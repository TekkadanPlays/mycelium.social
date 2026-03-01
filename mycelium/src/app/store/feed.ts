import type { NostrEvent } from '../../nostr/event';
import { Kind } from '../../nostr/event';
import { isRootNote } from '../../nostr/nip10';
import { getPool } from './relay';
import { getFollowingList } from './contacts';
import { getOutboxUrls } from './bootstrap';
import type { PoolSubscription } from '../../nostr/pool';
import { cacheEvent, getCachedFeed } from '../api/cache';

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
  mode: 'following',
  eoseReceived: false,
  newPostsBuffer: [],
};

const listeners: Set<Listener> = new Set();
let activeSub: PoolSubscription | null = null;
let reactionsSub: PoolSubscription | null = null;
let repliesSub: PoolSubscription | null = null;
let liveSub: PoolSubscription | null = null;
let collectedPostIds: Set<string> = new Set();
let seenReactionIds: Set<string> = new Set();
let seenReplyIds: Set<string> = new Set();

// Throttle notifications — batch UI updates to avoid thrashing InfernoJS
let notifyScheduled = false;
function notify() {
  if (notifyScheduled) return;
  notifyScheduled = true;
  queueMicrotask(() => {
    notifyScheduled = false;
    for (const fn of listeners) fn();
  });
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

/** Reset all feed state and cancel active subscriptions. */
export function resetFeed(): void {
  cleanupSubs();
  collectedPostIds = new Set();
  seenReactionIds = new Set();
  seenReplyIds = new Set();
  state = {
    posts: [],
    reactions: new Map(),
    replyCounts: new Map(),
    isLoading: false,
    sort: 'new',
    mode: 'following',
    eoseReceived: false,
    newPostsBuffer: [],
  };
  notify();
}

export function loadFeed(limit: number = 50) {
  const pool = getPool();
  cleanupSubs();
  collectedPostIds = new Set();
  seenReactionIds = new Set();
  seenReplyIds = new Set();

  state = { ...state, isLoading: true, posts: [], reactions: new Map(), replyCounts: new Map(), eoseReceived: false, newPostsBuffer: [] };
  notify();

  let eoseCount = 0;

  // Build filter based on mode
  const filter: Record<string, any> = { kinds: [Kind.Text], limit };
  const isFollowing = state.mode === 'following';
  let authors: string[] = [];
  if (isFollowing) {
    authors = getFollowingList();
    if (authors.length === 0) {
      state = { ...state, isLoading: false, eoseReceived: true };
      notify();
      return;
    }
    filter.authors = authors;
  }

  // For following mode, hydrate from server cache first (instant feed)
  if (isFollowing && authors.length > 0) {
    getCachedFeed(authors, limit).then((cached) => {
      if (cached.length > 0) {
        for (const event of cached) {
          if (isRootNote(event) && !collectedPostIds.has(event.id)) {
            collectedPostIds.add(event.id);
          }
        }
        const rootNotes = cached.filter((e) => isRootNote(e));
        if (rootNotes.length > 0 && state.posts.length === 0) {
          state = { ...state, posts: sortPosts(rootNotes, state.sort) };
          notify();
        }
      }
    }).catch(() => { /* server unreachable */ });
  }

  // Use outbox relays when available, otherwise fall back to full pool
  const outboxUrls = getOutboxUrls();
  const useOutbox = outboxUrls.length > 0;

  const onEvent = (event: NostrEvent) => {
    if (!isRootNote(event)) return;
    if (collectedPostIds.has(event.id)) return;
    collectedPostIds.add(event.id);
    // Only cache posts from followed users, not global
    if (isFollowing) cacheEvent(event);

    state = {
      ...state,
      posts: sortPosts([...state.posts, event], state.sort),
    };
    notify();
  };

  const onEose = () => {
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
  };

  activeSub = useOutbox
    ? pool.subscribeToUrls(outboxUrls, [filter], onEvent, onEose)
    : pool.subscribe([filter], onEvent, onEose);
}

// Load older posts (pagination)
export function loadMore(count: number = 30) {
  if (state.posts.length === 0 || state.isLoading) return;
  const pool = getPool();

  const oldestTimestamp = state.posts[state.posts.length - 1].created_at;

  state = { ...state, isLoading: true };
  notify();

  const newIds: string[] = [];

  const outboxUrls = getOutboxUrls();
  const useOutbox = outboxUrls.length > 0;

  const paginationFilter = [{ kinds: [Kind.Text], until: oldestTimestamp - 1, limit: count }];
  const sub = useOutbox
    ? pool.subscribeToUrls(outboxUrls, paginationFilter,
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
    )
    : pool.subscribe(
      paginationFilter,
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
  const outboxUrls = getOutboxUrls();
  const isFollowing = state.mode === 'following';

  const liveFilter: Record<string, any>[] = [{ kinds: [Kind.Text], since }];
  if (isFollowing) {
    const authors = getFollowingList();
    if (authors.length > 0) liveFilter[0].authors = authors;
  }

  const onLiveEvent = (event: NostrEvent) => {
    if (!isRootNote(event)) return;
    if (collectedPostIds.has(event.id)) return;
    collectedPostIds.add(event.id);
    if (isFollowing) cacheEvent(event);

    // Buffer new posts instead of inserting directly
    state = { ...state, newPostsBuffer: [...state.newPostsBuffer, event] };
    notify();
  };

  liveSub = outboxUrls.length > 0
    ? pool.subscribeToUrls(outboxUrls, liveFilter, onLiveEvent)
    : pool.subscribe(liveFilter, onLiveEvent);
}

function fetchReactionsBatch(eventIds: string[]) {
  const pool = getPool();

  if (reactionsSub) reactionsSub.unsubscribe();

  reactionsSub = pool.subscribe(
    [{ kinds: [Kind.Reaction], '#e': eventIds }],
    (reaction) => {
      if (seenReactionIds.has(reaction.id)) return;
      seenReactionIds.add(reaction.id);
      cacheEvent(reaction);

      const eTag = reaction.tags.find((t) => t[0] === 'e');
      if (!eTag) return;
      const targetId = eTag[1];
      if (!eventIds.includes(targetId)) return;

      const existing = state.reactions.get(targetId) || [];
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

  repliesSub = pool.subscribe(
    [{ kinds: [Kind.Text], '#e': eventIds }],
    (event) => {
      if (seenReplyIds.has(event.id)) return;
      seenReplyIds.add(event.id);

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
