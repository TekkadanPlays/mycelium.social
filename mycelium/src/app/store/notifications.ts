import type { NostrEvent } from '../../nostr/event';
import { Kind } from '../../nostr/event';
import { getPool } from './relay';
import { getAuthState } from './auth';
import { fetchProfile } from './profiles';
import { cacheEvent } from '../api/cache';
import type { PoolSubscription } from '../../nostr/pool';

// ---------------------------------------------------------------------------
// Notifications Store
// ---------------------------------------------------------------------------
// Manages notification events (reactions, replies, mentions, reposts),
// caches them to the server, tracks seen/unseen via localStorage timestamp,
// and maintains a live subscription for incoming notifications.

export type NotifType = 'reaction' | 'reply' | 'mention' | 'repost';

export interface Notification {
  id: string;
  type: NotifType;
  event: NostrEvent;
  targetId: string | null;
}

export interface NotificationsState {
  notifications: Notification[];
  isLoading: boolean;
  lastSeenTimestamp: number; // unix timestamp of when user last viewed notifications
  unseenCount: number;
}

type Listener = () => void;

const STORAGE_KEY = 'ribbit_notif_last_seen';

let state: NotificationsState = {
  notifications: [],
  isLoading: false,
  lastSeenTimestamp: 0,
  unseenCount: 0,
};

const listeners: Set<Listener> = new Set();
let liveSub: PoolSubscription | null = null;
let initialSub: PoolSubscription | null = null;
const seen = new Set<string>();

let notifyScheduled = false;
function notify() {
  if (notifyScheduled) return;
  notifyScheduled = true;
  queueMicrotask(() => {
    notifyScheduled = false;
    for (const fn of listeners) fn();
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getNotificationsState(): NotificationsState {
  return state;
}

export function subscribeNotifications(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Mark all notifications as seen (updates localStorage timestamp). */
export function markAllSeen(): void {
  const now = Math.floor(Date.now() / 1000);
  state = { ...state, lastSeenTimestamp: now, unseenCount: 0 };
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, String(now));
  }
  notify();
}

/** Get the unseen count (for badge in nav). */
export function getUnseenCount(): number {
  return state.unseenCount;
}

function loadLastSeen(): number {
  if (typeof localStorage === 'undefined') return 0;
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? parseInt(saved, 10) || 0 : 0;
}

function classifyEvent(event: NostrEvent, myPubkey: string): Notification | null {
  if (event.pubkey === myPubkey) return null;

  const eTag = event.tags.find((t: string[]) => t[0] === 'e');
  const targetId = eTag && eTag[1] ? eTag[1] : null;

  let type: NotifType = 'mention';
  if (event.kind === Kind.Reaction) type = 'reaction';
  else if (event.kind === 6) type = 'repost';
  else if (event.kind === Kind.Text && targetId) type = 'reply';

  return { id: event.id, type, event, targetId };
}

function recalcUnseen() {
  const unseen = state.notifications.filter(
    (n) => n.event.created_at > state.lastSeenTimestamp,
  ).length;
  state = { ...state, unseenCount: unseen };
}

function addNotification(notif: Notification) {
  // Array-level dedup guard (in case seen set was cleared between reloads)
  if (state.notifications.some((n) => n.id === notif.id)) return;
  state = {
    ...state,
    notifications: [notif, ...state.notifications].sort(
      (a, b) => b.event.created_at - a.event.created_at,
    ),
  };
  recalcUnseen();
  notify();
}

// ---------------------------------------------------------------------------
// Load & Subscribe
// ---------------------------------------------------------------------------

export function loadNotifications(): void {
  const auth = getAuthState();
  if (!auth.pubkey) return;

  // Cleanup previous
  cleanupSubs();
  seen.clear();

  state = {
    ...state,
    notifications: [],
    isLoading: true,
    lastSeenTimestamp: loadLastSeen(),
    unseenCount: 0,
  };
  notify();

  const pool = getPool();
  const myPubkey = auth.pubkey;

  // Initial fetch
  initialSub = pool.subscribe(
    [
      { kinds: [Kind.Reaction], '#p': [myPubkey], limit: 100 },
      { kinds: [Kind.Text], '#p': [myPubkey], limit: 100 },
      { kinds: [6], '#p': [myPubkey], limit: 50 },
    ],
    (event: NostrEvent) => {
      if (seen.has(event.id)) return;
      seen.add(event.id);
      fetchProfile(event.pubkey);
      cacheEvent(event);

      const notif = classifyEvent(event, myPubkey);
      if (notif) addNotification(notif);
    },
    () => {
      if (initialSub) { initialSub.unsubscribe(); initialSub = null; }
      state = { ...state, isLoading: false };
      recalcUnseen();
      notify();

      // Start live subscription for new notifications
      startLiveNotifications(myPubkey);
    },
  );
}

function startLiveNotifications(myPubkey: string): void {
  const pool = getPool();
  const since = Math.floor(Date.now() / 1000);

  liveSub = pool.subscribe(
    [
      { kinds: [Kind.Reaction], '#p': [myPubkey], since },
      { kinds: [Kind.Text], '#p': [myPubkey], since },
      { kinds: [6], '#p': [myPubkey], since },
    ],
    (event: NostrEvent) => {
      if (seen.has(event.id)) return;
      seen.add(event.id);
      fetchProfile(event.pubkey);
      cacheEvent(event);

      const notif = classifyEvent(event, myPubkey);
      if (notif) addNotification(notif);
    },
  );
}

export function cleanupSubs(): void {
  if (initialSub) { initialSub.unsubscribe(); initialSub = null; }
  if (liveSub) { liveSub.unsubscribe(); liveSub = null; }
}

/** Reset all notification state and cancel active subscriptions. */
export function resetNotifications(): void {
  cleanupSubs();
  seen.clear();
  state = {
    notifications: [],
    isLoading: false,
    lastSeenTimestamp: 0,
    unseenCount: 0,
  };
  notify();
}
