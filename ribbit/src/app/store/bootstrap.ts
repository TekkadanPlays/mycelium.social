import { Relay } from '../../nostr/relay';
import { Kind } from '../../nostr/event';
import type { NostrEvent } from '../../nostr/event';
import { getIndexerUrls, discoverIndexers, getIndexerState, subscribeIndexers } from './indexers';
import { getPool, addRelay } from './relay';
import { addRelayToProfile, removeRelayFromProfile, getRelayManagerState } from './relaymanager';
import { signWithExtension } from '../../nostr/nip07';
import { getAuthState } from './auth';
import { cacheEvent, getCachedProfile, getCachedRelayList, getCachedContacts } from '../api/cache';

// ---------------------------------------------------------------------------
// Bootstrap Store
// ---------------------------------------------------------------------------
// After login, this store:
//   1. Opens ephemeral connections to the best indexer relays
//   2. Queries kind-0 (profile) and kind-10002 (NIP-65) for the user's pubkey
//   3. Renders progressively as events arrive (InfernoJS re-renders on notify)
//   4. Once NIP-65 is found, populates Outbox/Inbox and connects to those relays
//   5. Tears down ephemeral indexer connections

type Listener = () => void;

export interface BootstrapProfile {
  name: string;
  displayName: string;
  picture: string;
  banner: string;
  about: string;
  nip05: string;
  lud16: string;
}

export interface RelayListEntry {
  url: string;
  read: boolean;
  write: boolean;
}

export type BootstrapPhase =
  | 'idle'
  | 'discovering_indexers'
  | 'querying_indexers'
  | 'connecting_relays'
  | 'ready'
  | 'error';

export interface BootstrapState {
  phase: BootstrapPhase;
  profile: BootstrapProfile | null;
  profileEvent: NostrEvent | null;
  relayList: RelayListEntry[];
  relayListEvent: NostrEvent | null;
  contactsEvent: NostrEvent | null;
  followingCount: number;
  indexersQueried: number;
  indexersResponded: number;
  outboxConnected: number;
  inboxConnected: number;
  error: string | null;
}

let state: BootstrapState = {
  phase: 'idle',
  profile: null,
  profileEvent: null,
  relayList: [],
  relayListEvent: null,
  contactsEvent: null,
  followingCount: 0,
  indexersQueried: 0,
  indexersResponded: 0,
  outboxConnected: 0,
  inboxConnected: 0,
  error: null,
};

const listeners: Set<Listener> = new Set();

let notifyScheduled = false;
function notify() {
  if (notifyScheduled) return;
  notifyScheduled = true;
  queueMicrotask(() => {
    notifyScheduled = false;
    for (const fn of listeners) fn();
  });
}

export function getBootstrapState(): BootstrapState {
  return state;
}

export function subscribeBootstrap(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Ephemeral relays used during bootstrap (cleaned up after)
let ephemeralRelays: Relay[] = [];
let bootstrappedPubkey: string | null = null;
let activeBootstrap: Promise<void> | null = null;

/** Reset bootstrap state and clean up ephemeral relays. */
export function resetBootstrap(): void {
  stopPeriodicRefresh();
  cleanupEphemeral();
  bootstrappedPubkey = null;
  activeBootstrap = null;
  state = {
    phase: 'idle',
    profile: null,
    profileEvent: null,
    relayList: [],
    relayListEvent: null,
    contactsEvent: null,
    followingCount: 0,
    indexersQueried: 0,
    indexersResponded: 0,
    outboxConnected: 0,
    inboxConnected: 0,
    error: null,
  };
  notify();
}

// ---------------------------------------------------------------------------
// Main bootstrap entry point — called after login
// ---------------------------------------------------------------------------

export async function bootstrapUser(pubkey: string): Promise<void> {
  // Already bootstrapped for this pubkey — don't reset
  if (bootstrappedPubkey === pubkey && state.phase === 'ready') {
    return;
  }
  // Already in progress for this pubkey — wait for it
  if (bootstrappedPubkey === pubkey && activeBootstrap) {
    return activeBootstrap;
  }

  bootstrappedPubkey = pubkey;
  activeBootstrap = doBootstrap(pubkey).finally(() => {
    activeBootstrap = null;
  });
  return activeBootstrap;
}

async function doBootstrap(pubkey: string): Promise<void> {
  // Reset state
  state = {
    phase: 'discovering_indexers',
    profile: null,
    profileEvent: null,
    relayList: [],
    relayListEvent: null,
    contactsEvent: null,
    followingCount: 0,
    indexersQueried: 0,
    indexersResponded: 0,
    outboxConnected: 0,
    inboxConnected: 0,
    error: null,
  };
  notify();

  // 1. Discover indexers if not already done
  const indexerState = getIndexerState();
  if (indexerState.urls.length === 0) {
    await discoverIndexers(10);
  }

  const indexerUrls = getIndexerUrls();
  if (indexerUrls.length === 0) {
    state = { ...state, phase: 'error', error: 'No indexer relays found' };
    notify();
    return;
  }

  // Populate Indexers relay manager profile
  syncIndexersToManager(indexerUrls);

  // Listen for NIP-66 background upgrades and re-sync Indexers profile
  subscribeIndexers(() => {
    const upgraded = getIndexerUrls();
    if (upgraded.length > 0) {
      syncIndexersToManager(upgraded);
    }
  });

  // 1.5. Check server cache first — instant if available
  try {
    const [cachedProfile, cachedRelays, cachedContacts] = await Promise.all([
      getCachedProfile(pubkey),
      getCachedRelayList(pubkey),
      getCachedContacts(pubkey),
    ]);

    if (cachedProfile) {
      let meta: Record<string, string> = {};
      try { meta = JSON.parse(cachedProfile.raw_content); } catch { /* ignore */ }
      state = {
        ...state,
        profile: {
          name: meta.name || '',
          displayName: meta.display_name || meta.displayName || '',
          about: meta.about || '',
          picture: meta.picture || '',
          banner: meta.banner || '',
          nip05: meta.nip05 || '',
          lud16: meta.lud16 || '',
        },
      };
      console.log('[bootstrap] Profile loaded from server cache');
      notify();
    }

    if (cachedRelays && cachedRelays.length > 0) {
      const relayList: RelayListEntry[] = cachedRelays.map((r) => ({
        url: r.url,
        read: r.read,
        write: r.write,
      }));
      state = { ...state, relayList };
      console.log('[bootstrap] Relay list loaded from server cache —', relayList.length, 'relays');
      notify();
    }

    if (cachedContacts && cachedContacts.length > 0) {
      state = { ...state, followingCount: cachedContacts.length };
      console.log('[bootstrap] Contacts loaded from server cache —', cachedContacts.length, 'follows');
      notify();
    }
  } catch {
    // Server cache unavailable — continue to indexers
  }

  // 2. Query indexers for kind-0, kind-10002, kind-3 (fills in anything cache missed)
  state = { ...state, phase: 'querying_indexers', indexersQueried: indexerUrls.length };
  notify();

  await queryIndexers(pubkey, indexerUrls);

  // 3. Connect to outbox/inbox relays
  if (state.relayList.length > 0) {
    state = { ...state, phase: 'connecting_relays' };
    notify();
    await connectUserRelays(state.relayList);
  }

  // 4. Done
  state = { ...state, phase: 'ready' };
  notify();

  // Cleanup ephemeral relays
  cleanupEphemeral();
}

// ---------------------------------------------------------------------------
// Query indexers
// ---------------------------------------------------------------------------

function queryIndexers(pubkey: string, indexerUrls: string[]): Promise<void> {
  return new Promise<void>((resolve) => {
    let responded = 0;
    const total = indexerUrls.length;
    const timeout = setTimeout(() => finish(), 8000);

    function finish() {
      clearTimeout(timeout);
      resolve();
    }

    function onIndexerDone() {
      responded++;
      state = { ...state, indexersResponded: responded };
      notify();
      if (responded >= total) finish();
    }

    for (const url of indexerUrls) {
      const relay = new Relay(url);
      ephemeralRelays.push(relay);

      relay.connect()
        .then(() => {
          // Check if actually connected (connect resolves even on close)
          if (relay.status !== 'connected') {
            console.warn('[bootstrap] Failed to connect to', url);
            onIndexerDone();
            return;
          }
          console.log('[bootstrap] Connected to indexer:', url);

          const subId = relay.subscribe(
            [
              { kinds: [Kind.Metadata], authors: [pubkey], limit: 1 },
              { kinds: [Kind.RelayList], authors: [pubkey], limit: 1 },
              { kinds: [Kind.Contacts], authors: [pubkey], limit: 1 },
            ],
            (event: NostrEvent) => {
              // Write-through to server cache
              cacheEvent(event);

              if (event.kind === Kind.Metadata) {
                if (!state.profileEvent || event.created_at > state.profileEvent.created_at) {
                  console.log('[bootstrap] Got profile from', url);
                  state = {
                    ...state,
                    profileEvent: event,
                    profile: parseProfile(event),
                  };
                  notify();
                }
              } else if (event.kind === Kind.RelayList) {
                if (!state.relayListEvent || event.created_at > state.relayListEvent.created_at) {
                  console.log('[bootstrap] Got NIP-65 relay list from', url, '—', parseRelayList(event).length, 'relays');
                  state = {
                    ...state,
                    relayListEvent: event,
                    relayList: parseRelayList(event),
                  };
                  notify();
                }
              } else if (event.kind === Kind.Contacts) {
                if (!state.contactsEvent || event.created_at > state.contactsEvent.created_at) {
                  const count = event.tags.filter((t) => t[0] === 'p' && t[1]).length;
                  console.log('[bootstrap] Got contacts from', url, '—', count, 'follows');
                  state = {
                    ...state,
                    contactsEvent: event,
                    followingCount: count,
                  };
                  notify();
                }
              }
            },
            () => {
              relay.unsubscribe(subId);
              onIndexerDone();
            },
          );
        })
        .catch(() => {
          onIndexerDone();
        });
    }
  });
}

// ---------------------------------------------------------------------------
// Connect to user's outbox + inbox relays
// ---------------------------------------------------------------------------

async function connectUserRelays(relayList: RelayListEntry[]): Promise<void> {
  const pool = getPool();
  const auth = getAuthState();
  const mgr = getRelayManagerState();

  const writeRelays = relayList.filter((r) => r.write).map((r) => r.url);
  const readRelays = relayList.filter((r) => r.read).map((r) => r.url);

  // Populate relay manager Outbox/Inbox profiles
  const outbox = mgr.profiles.find((p) => p.id === 'outbox');
  const inbox = mgr.profiles.find((p) => p.id === 'inbox');

  for (const url of writeRelays) {
    if (outbox && !outbox.relays.includes(url)) {
      addRelayToProfile('outbox', url);
    }
  }
  for (const url of readRelays) {
    if (inbox && !inbox.relays.includes(url)) {
      addRelayToProfile('inbox', url);
    }
  }

  // Connect to all outbox + inbox relays via the pool
  const allUrls = new Set([...writeRelays, ...readRelays]);
  const connectPromises: Promise<void>[] = [];

  for (const url of allUrls) {
    const existing = pool.getRelay(url);
    if (!existing) {
      // Use addRelayWithAuth — these are the user's own outbox/inbox relays
      const relay = pool.addRelayWithAuth(url);
      connectPromises.push(
        relay.connect()
          .then(() => {
            if (writeRelays.includes(url)) {
              state = { ...state, outboxConnected: state.outboxConnected + 1 };
            }
            if (readRelays.includes(url)) {
              state = { ...state, inboxConnected: state.inboxConnected + 1 };
            }
            notify();
          })
          .catch((err) => {
            console.warn(`[bootstrap] Failed to connect to ${url}:`, err);
          }),
      );
    }
  }

  await Promise.allSettled(connectPromises);
}

// ---------------------------------------------------------------------------
// Sync indexer URLs to relay manager Indexers profile
// ---------------------------------------------------------------------------

function syncIndexersToManager(indexerUrls: string[]) {
  const mgr = getRelayManagerState();
  const indexers = mgr.profiles.find((p) => p.id === 'indexers');
  if (!indexers) return;

  // Replace the entire indexer list (these are dynamic, not user-curated)
  // Clear existing and add new
  for (const url of indexers.relays) {
    if (!indexerUrls.includes(url)) {
      removeRelayFromProfile('indexers', url);
    }
  }
  for (const url of indexerUrls) {
    if (!indexers.relays.includes(url)) {
      addRelayToProfile('indexers', url);
    }
  }
}

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------

function cleanupEphemeral() {
  for (const relay of ephemeralRelays) {
    // Only disconnect if it's not in the main pool
    const pool = getPool();
    if (!pool.getRelay(relay.url)) {
      relay.disconnect();
    }
  }
  ephemeralRelays = [];
}

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

function parseProfile(event: NostrEvent): BootstrapProfile {
  let meta: Record<string, string> = {};
  try {
    meta = JSON.parse(event.content);
  } catch { /* ignore */ }

  return {
    name: meta.name || '',
    displayName: meta.display_name || meta.displayName || '',
    picture: meta.picture || '',
    banner: meta.banner || '',
    about: meta.about || '',
    nip05: meta.nip05 || '',
    lud16: meta.lud16 || '',
  };
}

function parseRelayList(event: NostrEvent): RelayListEntry[] {
  const relays: RelayListEntry[] = [];
  for (const tag of event.tags) {
    if (tag[0] !== 'r' || !tag[1]) continue;
    const url = tag[1].replace(/\/+$/, '');
    const marker = tag[2];
    relays.push({
      url,
      read: !marker || marker === 'read',
      write: !marker || marker === 'write',
    });
  }
  return relays;
}

// ---------------------------------------------------------------------------
// Periodic refresh — re-query indexers for latest profile data
// ---------------------------------------------------------------------------

let refreshInterval: ReturnType<typeof setInterval> | null = null;
const REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Start periodic background refresh of profile-related events from indexers.
 * Called once after initial bootstrap. Runs every ~60 minutes.
 */
export function startPeriodicRefresh(): void {
  if (refreshInterval) return; // already running
  refreshInterval = setInterval(() => {
    refreshFromIndexers().catch((err) =>
      console.warn('[bootstrap] Periodic refresh error:', err),
    );
  }, REFRESH_INTERVAL_MS);
}

export function stopPeriodicRefresh(): void {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

/**
 * Lightweight re-query of indexers for kind-0, kind-10002, kind-3.
 * Does NOT reset bootstrap state or reconnect relays — just updates
 * profile/relayList/contacts if newer events are found.
 */
async function refreshFromIndexers(): Promise<void> {
  const pubkey = bootstrappedPubkey;
  if (!pubkey || state.phase !== 'ready') return;

  const indexerUrls = getIndexerUrls();
  if (indexerUrls.length === 0) return;

  console.log('[bootstrap] Periodic refresh — querying', indexerUrls.length, 'indexers');

  // Pick up to 3 indexers to keep it lightweight
  const urls = indexerUrls.slice(0, 3);

  for (const url of urls) {
    const relay = new Relay(url);
    try {
      await relay.connect();
      if (relay.status !== 'connected') {
        relay.disconnect();
        continue;
      }

      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          relay.disconnect();
          resolve();
        }, 5000);

        const subId = relay.subscribe(
          [
            { kinds: [Kind.Metadata], authors: [pubkey], limit: 1 },
            { kinds: [Kind.RelayList], authors: [pubkey], limit: 1 },
            { kinds: [Kind.Contacts], authors: [pubkey], limit: 1 },
          ],
          (event: NostrEvent) => {
            cacheEvent(event);

            if (event.kind === Kind.Metadata) {
              if (!state.profileEvent || event.created_at > state.profileEvent.created_at) {
                state = { ...state, profileEvent: event, profile: parseProfile(event) };
                notify();
              }
            } else if (event.kind === Kind.RelayList) {
              if (!state.relayListEvent || event.created_at > state.relayListEvent.created_at) {
                state = { ...state, relayListEvent: event, relayList: parseRelayList(event) };
                notify();
              }
            } else if (event.kind === Kind.Contacts) {
              if (!state.contactsEvent || event.created_at > state.contactsEvent.created_at) {
                const count = event.tags.filter((t) => t[0] === 'p' && t[1]).length;
                state = { ...state, contactsEvent: event, followingCount: count };
                notify();
              }
            }
          },
          () => {
            clearTimeout(timeout);
            relay.unsubscribe(subId);
            relay.disconnect();
            resolve();
          },
        );
      });
    } catch {
      relay.disconnect();
    }
  }

  console.log('[bootstrap] Periodic refresh complete');
}

// ---------------------------------------------------------------------------
// Utility: get outbox relay URLs from bootstrap state
// ---------------------------------------------------------------------------

export function getOutboxUrls(): string[] {
  return state.relayList.filter((r) => r.write).map((r) => r.url);
}

export function getInboxUrls(): string[] {
  return state.relayList.filter((r) => r.read).map((r) => r.url);
}
