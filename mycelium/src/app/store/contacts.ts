import type { NostrEvent } from '../../nostr/event';
import { Kind, createEvent } from '../../nostr/event';
import { signWithExtension } from '../../nostr/nip07';
import { getPool } from './relay';
import { getAuthState } from './auth';
import { cacheEvent } from '../api/cache';

type Listener = () => void;

export interface ContactsState {
  following: Set<string>; // pubkeys the user follows
  isLoaded: boolean;
  contactEvent: NostrEvent | null; // the raw kind-3 event (needed for republishing)
}

let state: ContactsState = {
  following: new Set(),
  isLoaded: false,
  contactEvent: null,
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

export function getContactsState(): ContactsState {
  return state;
}

export function subscribeContacts(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isFollowing(pubkey: string): boolean {
  return state.following.has(pubkey);
}

/** Clear all contacts state. */
export function resetContacts(): void {
  state = { following: new Set(), isLoaded: false, contactEvent: null };
  notify();
}

export function getFollowingList(): string[] {
  return Array.from(state.following);
}

// Apply a pre-fetched contacts event (from bootstrap indexer query)
export function applyContactsEvent(event: NostrEvent) {
  // Only accept if newer than what we have
  if (state.contactEvent && state.contactEvent.created_at >= event.created_at) return;
  const following = new Set<string>();
  for (const tag of event.tags) {
    if (tag[0] === 'p' && tag[1]) {
      following.add(tag[1]);
    }
  }
  state = { following, isLoaded: true, contactEvent: event };
  cacheEvent(event);
  notify();
}

export function loadContacts() {
  const auth = getAuthState();
  if (!auth.pubkey) return;

  const pool = getPool();
  let latest: NostrEvent | null = null;

  const sub = pool.subscribe(
    [{ kinds: [Kind.Contacts], authors: [auth.pubkey] }],
    (event) => {
      if (!latest || event.created_at > latest.created_at) {
        latest = event;
      }
    },
    () => {
      sub.unsubscribe();
      if (latest) {
        applyContactsEvent(latest);
      } else if (!state.isLoaded) {
        state = { following: new Set(), isLoaded: true, contactEvent: null };
        notify();
      }
    },
  );
}

export async function followUser(pubkey: string): Promise<void> {
  const auth = getAuthState();
  if (!auth.pubkey) return;
  if (state.following.has(pubkey)) return;

  // Build new tag list from existing + new
  const tags: string[][] = state.contactEvent
    ? state.contactEvent.tags.filter((t) => t[0] === 'p')
    : [];
  tags.push(['p', pubkey]);

  const content = state.contactEvent?.content || '';
  const unsigned = createEvent(Kind.Contacts, content, tags, auth.pubkey);
  const signed = await signWithExtension(unsigned);
  const pool = getPool();
  await pool.publish(signed);

  const following = new Set(state.following);
  following.add(pubkey);
  state = { following, isLoaded: true, contactEvent: signed };
  notify();
}

export async function unfollowUser(pubkey: string): Promise<void> {
  const auth = getAuthState();
  if (!auth.pubkey) return;
  if (!state.following.has(pubkey)) return;

  const tags: string[][] = state.contactEvent
    ? state.contactEvent.tags.filter((t) => !(t[0] === 'p' && t[1] === pubkey))
    : [];

  const content = state.contactEvent?.content || '';
  const unsigned = createEvent(Kind.Contacts, content, tags, auth.pubkey);
  const signed = await signWithExtension(unsigned);
  const pool = getPool();
  await pool.publish(signed);

  const following = new Set(state.following);
  following.delete(pubkey);
  state = { following, isLoaded: true, contactEvent: signed };
  notify();
}
