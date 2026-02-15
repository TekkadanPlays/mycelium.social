import type { NostrEvent } from '../../nostr/event';
import { Kind } from '../../nostr/event';
import { isRootNote } from '../../nostr/nip10';
import { getPool } from './relay';
import { getFollowingList } from './contacts';
import type { PoolSubscription } from '../../nostr/pool';

export type FeedSort = 'new' | 'hot' | 'top';
export type FeedMode = 'global' | 'following';

export interface FeedState {
  posts: NostrEvent[];
  reactions: Map<string, NostrEvent[]>; // eventId -> reaction events
  replyCounts: Map<string, number>; // eventId -> reply count
  isLoading: boolean;
  sort: FeedSort;
  mode: FeedMode;
  eoseReceived: boolean;
  newPostsBuffer: NostrEvent[]; // live posts waiting to be shown
}

type Listener = () => void;

let state: FeedState = {
  posts: [],
  reactions: new Map(),
  replyCounts: new Map(),
  isLoading: false,
  sort: 'new',
  mode: 'global',
  eoseReceived: false,
  newPostsBuffer: [],
};

const listeners: Set<Listener> = new Set();
let activeSub: PoolSubscription | null = null;
let reactionsSub: PoolSubscription | null = null;
let repliesSub: PoolSubscription | null = null;
let liveSub: PoolSubscription | null = null;
let collectedPostIds: Set<string> = new Set();

function notify() {
  for (const fn of listeners) fn();
}

export function getFeedState(): FeedState {
  return state;
}

export function subscribeFeed(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setSort(sort: FeedSort) {
  state = { ...state, sort, posts: sortPosts(state.posts, sort) };
  notify();
}

export function setFeedMode(mode: FeedMode) {
  if (mode === state.mode) return;
  state = { ...state, mode };
  notify();
  loadFeed();
}

// Flush buffered live posts into the visible feed
export function flushNewPosts() {
  if (state.newPostsBuffer.length === 0) return;
  const merged = [...state.newPostsBuffer, ...state.posts];
  state = { ...state, posts: sortPosts(merged, state.sort), newPostsBuffer: [] };
  notify();
}

function sortPosts(posts: NostrEvent[], sort: FeedSort): NostrEvent[] {
  const sorted = [...posts];
  switch (sort) {
    case 'new':
      return sorted.sort((a, b) => b.created_at - a.created_at);
    case 'top': {
      return sorted.sort((a, b) => {
        const aReactions = state.reactions.get(a.id)?.length || 0;
        const bReactions = state.reactions.get(b.id)?.length || 0;
        return bReactions - aReactions;
      });
    }
    case 'hot': {
      const now = Math.floor(Date.now() / 1000);
      return sorted.sort((a, b) => {
        const aReactions = state.reactions.get(a.id)?.length || 0;
        const bReactions = state.reactions.get(b.id)?.length || 0;
        const aAge = (now - a.created_at) / 3600 + 2;
        const bAge = (now - b.created_at) / 3600 + 2;
        const aScore = aReactions / Math.pow(aAge, 1.5);
        const bScore = bReactions / Math.pow(bAge, 1.5);
        return bScore - aScore;
      });
    }
    default:
      return sorted;
  }
}

function cleanupSubs() {
  if (activeSub) { activeSub.unsubscribe(); activeSub = null; }
  if (reactionsSub) { reactionsSub.unsubscribe(); reactionsSub = null; }
  if (repliesSub) { repliesSub.unsubscribe(); repliesSub = null; }
  if (liveSub) { liveSub.unsubscribe(); liveSub = null; }
}

export function loadFeed(limit: number = 50) {
  const pool = getPool();
  cleanupSubs();
  collectedPostIds = new Set();

  state = { ...state, isLoading: true, posts: [], reactions: new Map(), replyCounts: new Map(), eoseReceived: false, newPostsBuffer: [] };
  notify();

  let eoseCount = 0;

  // Build filter based on mode
  const filter: Record<string, any> = { kinds: [Kind.Text], limit };
  if (state.mode === 'following') {
    const authors = getFollowingList();
    if (authors.length === 0) {
      state = { ...state, isLoading: false, eoseReceived: true };
      notify();
      return;
    }
    filter.authors = authors;
  }

  activeSub = pool.subscribe(
    [filter],
    (event) => {
      if (!isRootNote(event)) return;
      if (collectedPostIds.has(event.id)) return;
      collectedPostIds.add(event.id);

      state = {
        ...state,
        posts: sortPosts([...state.posts, event], state.sort),
      };
      notify();
    },
    () => {
      eoseCount++;
      if (eoseCount >= 1) {
        state = { ...state, isLoading: false, eoseReceived: true };
        notify();

        if (activeSub) { activeSub.unsubscribe(); activeSub = null; }

        if (collectedPostIds.size > 0) {
          const ids = Array.from(collectedPostIds);
          fetchReactionsBatch(ids);
          fetchReplyCounts(ids);
        }

        // Start live subscription for new posts
        startLiveSubscription();
      }
    },
  );
}

// Load older posts (pagination)
export function loadMore(count: number = 30) {
  if (state.posts.length === 0 || state.isLoading) return;
  const pool = getPool();

  const oldestTimestamp = state.posts[state.posts.length - 1].created_at;

  state = { ...state, isLoading: true };
  notify();

  const newIds: string[] = [];

  const sub = pool.subscribe(
    [{ kinds: [Kind.Text], until: oldestTimestamp - 1, limit: count }],
    (event) => {
      if (!isRootNote(event)) return;
      if (collectedPostIds.has(event.id)) return;
      collectedPostIds.add(event.id);
      newIds.push(event.id);

      state = {
        ...state,
        posts: sortPosts([...state.posts, event], state.sort),
      };
      notify();
    },
    () => {
      sub.unsubscribe();
      state = { ...state, isLoading: false };
      notify();

      if (newIds.length > 0) {
        fetchReactionsBatch(newIds);
        fetchReplyCounts(newIds);
      }
    },
  );
}

function startLiveSubscription() {
  const pool = getPool();
  const since = Math.floor(Date.now() / 1000);

  liveSub = pool.subscribe(
    [{ kinds: [Kind.Text], since }],
    (event) => {
      if (!isRootNote(event)) return;
      if (collectedPostIds.has(event.id)) return;
      collectedPostIds.add(event.id);

      // Buffer new posts instead of inserting directly
      state = { ...state, newPostsBuffer: [...state.newPostsBuffer, event] };
      notify();
    },
  );
}

function fetchReactionsBatch(eventIds: string[]) {
  const pool = getPool();

  if (reactionsSub) reactionsSub.unsubscribe();

  reactionsSub = pool.subscribe(
    [{ kinds: [Kind.Reaction], '#e': eventIds }],
    (reaction) => {
      const eTag = reaction.tags.find((t) => t[0] === 'e');
      if (!eTag) return;
      const targetId = eTag[1];
      if (!eventIds.includes(targetId)) return;

      const existing = state.reactions.get(targetId) || [];
      if (existing.some((r) => r.id === reaction.id)) return;

      const updated = new Map(state.reactions);
      updated.set(targetId, [...existing, reaction]);
      state = { ...state, reactions: updated };
      notify();
    },
    () => {
      if (reactionsSub) { reactionsSub.unsubscribe(); reactionsSub = null; }
      if (state.sort !== 'new') {
        state = { ...state, posts: sortPosts(state.posts, state.sort) };
        notify();
      }
    },
  );
}

function fetchReplyCounts(eventIds: string[]) {
  const pool = getPool();

  if (repliesSub) repliesSub.unsubscribe();

  // We subscribe to kind-1 replies referencing these events, and just count them
  const seen = new Set<string>();

  repliesSub = pool.subscribe(
    [{ kinds: [Kind.Text], '#e': eventIds }],
    (event) => {
      if (seen.has(event.id)) return;
      seen.add(event.id);

      // Find which post this replies to
      const eTags = event.tags.filter((t) => t[0] === 'e');
      if (eTags.length === 0) return;
      // The reply target is the last e-tag (NIP-10 convention for reply)
      const targetId = eTags[eTags.length - 1][1];
      if (!eventIds.includes(targetId)) return;

      const counts = new Map(state.replyCounts);
      counts.set(targetId, (counts.get(targetId) || 0) + 1);
      state = { ...state, replyCounts: counts };
      notify();
    },
    () => {
      if (repliesSub) { repliesSub.unsubscribe(); repliesSub = null; }
    },
  );
}
