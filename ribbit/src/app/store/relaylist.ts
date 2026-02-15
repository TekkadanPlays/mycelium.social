import type { NostrEvent } from '../../nostr/event';
import { Kind } from '../../nostr/event';
import { getPool } from './relay';
import { getAuthState } from './auth';

// NIP-65: Relay List Metadata (kind 10002)
// Tags: ["r", <relay-url>] or ["r", <relay-url>, "read"|"write"]

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
      } else {
        state = { relays: [], isLoaded: true, event: null };
      }
      notify();
    },
  );
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
