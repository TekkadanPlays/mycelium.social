import type { NostrEvent } from '../../nostr/event';
import { Kind } from '../../nostr/event';
import { getPool } from './relay';
import { getAuthState } from './auth';
import { addRelayToProfile, getRelayManagerState } from './relaymanager';

// NIP-65: Relay List Metadata (kind 10002)
// Tags: ["r", <relay-url>] or ["r", <relay-url>, "read"|"write"]
//
// Outbox model:
//   - Write relays → user's Outbox profile (where they publish)
//   - Read relays  → user's Inbox profile (where they read from)
//   - On login, NIP-65 data auto-populates the relay manager profiles
//   - For other users, fetchRelayListForPubkey() returns their relay list
//     so we can find their posts in their outbox relays

export interface RelayListEntry {
  url: string;
  read: boolean;
  write: boolean;
}

export interface RelayListState {
  relays: RelayListEntry[];
  isLoaded: boolean;
  event: NostrEvent | null;
}

type Listener = () => void;

let state: RelayListState = {
  relays: [],
  isLoaded: false,
  event: null,
};

const listeners: Set<Listener> = new Set();

function notify() {
  for (const fn of listeners) fn();
}

export function getRelayListState(): RelayListState {
  return state;
}

export function subscribeRelayList(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getReadRelays(): string[] {
  return state.relays.filter((r) => r.read).map((r) => r.url);
}

export function getWriteRelays(): string[] {
  return state.relays.filter((r) => r.write).map((r) => r.url);
}

function parseRelayListEvent(event: NostrEvent): RelayListEntry[] {
  const relays: RelayListEntry[] = [];
  for (const tag of event.tags) {
    if (tag[0] !== 'r' || !tag[1]) continue;
    const url = tag[1].replace(/\/$/, '');
    const marker = tag[2]; // "read", "write", or undefined (both)
    relays.push({
      url,
      read: !marker || marker === 'read',
      write: !marker || marker === 'write',
    });
  }
  return relays;
}

export function loadRelayList() {
  const auth = getAuthState();
  if (!auth.pubkey) return;

  const pool = getPool();
  let latest: NostrEvent | null = null;

  const sub = pool.subscribe(
    [{ kinds: [Kind.RelayList], authors: [auth.pubkey] }],
    (event) => {
      if (!latest || event.created_at > latest.created_at) {
        latest = event;
      }
    },
    () => {
      sub.unsubscribe();
      if (latest) {
        state = {
          relays: parseRelayListEvent(latest),
          isLoaded: true,
          event: latest,
        };
        // Auto-populate relay manager Outbox/Inbox from NIP-65
        syncRelayListToManager(state.relays);
      } else {
        state = { relays: [], isLoaded: true, event: null };
      }
      notify();
    },
  );
}

// Sync NIP-65 relay list into relay manager Outbox/Inbox profiles.
// Only adds relays that aren't already present — never removes user-added relays.
function syncRelayListToManager(relays: RelayListEntry[]) {
  const mgr = getRelayManagerState();
  const outbox = mgr.profiles.find((p) => p.id === 'outbox');
  const inbox = mgr.profiles.find((p) => p.id === 'inbox');

  for (const entry of relays) {
    if (entry.write && outbox && !outbox.relays.includes(entry.url)) {
      addRelayToProfile('outbox', entry.url);
    }
    if (entry.read && inbox && !inbox.relays.includes(entry.url)) {
      addRelayToProfile('inbox', entry.url);
    }
  }
}

// Fetch relay list for any pubkey (for outbox model)
export function fetchRelayListForPubkey(
  pubkey: string,
  callback: (relays: RelayListEntry[]) => void,
) {
  const pool = getPool();
  let latest: NostrEvent | null = null;

  const sub = pool.subscribe(
    [{ kinds: [Kind.RelayList], authors: [pubkey] }],
    (event) => {
      if (!latest || event.created_at > latest.created_at) {
        latest = event;
      }
    },
    () => {
      sub.unsubscribe();
      callback(latest ? parseRelayListEvent(latest) : []);
    },
  );
}

export function resetRelayList() {
  state = { relays: [], isLoaded: false, event: null };
  notify();
}
