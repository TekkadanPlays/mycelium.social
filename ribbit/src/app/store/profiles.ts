import type { NostrEvent } from '../../nostr/event';
import { Kind } from '../../nostr/event';
import { getPool } from './relay';
import { getOutboxUrls } from './bootstrap';
import { cacheEvent, getCachedProfiles } from '../api/cache';
import { crawl } from './relay-crawler';

export interface Profile {
  pubkey: string;
  name: string;
  displayName: string;
  about: string;
  picture: string;
  banner: string;
  nip05: string;
  lud16: string;
  lastUpdated: number;
}

type Listener = () => void;

const profiles: Map<string, Profile> = new Map();
const listeners: Set<Listener> = new Set();
const pendingFetches: Set<string> = new Set();

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

export function subscribeProfiles(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getProfile(pubkey: string): Profile | undefined {
  return profiles.get(pubkey);
}

export function getAllProfiles(): Map<string, Profile> {
  return profiles;
}

function parseProfileEvent(event: NostrEvent): Profile {
  let meta: Record<string, string> = {};
  try {
    meta = JSON.parse(event.content);
  } catch { /* ignore */ }

  return {
    pubkey: event.pubkey,
    name: meta.name || '',
    displayName: meta.display_name || meta.displayName || '',
    about: meta.about || '',
    picture: meta.picture || '',
    banner: meta.banner || '',
    nip05: meta.nip05 || '',
    lud16: meta.lud16 || '',
    lastUpdated: event.created_at,
  };
}

function applyEvent(event: NostrEvent) {
  const existing = profiles.get(event.pubkey);
  if (!existing || event.created_at > existing.lastUpdated) {
    profiles.set(event.pubkey, parseProfileEvent(event));
    // Write-through to server cache
    cacheEvent(event);
    notify();
  }
}

// ---------------------------------------------------------------------------
// High-performance parallel profile fetcher
// ---------------------------------------------------------------------------
// Strategy: fan out kind-0 queries across ALL available sources simultaneously:
//   1. Pool relays (outbox + any connected relays)
//   2. Indexer relays (ephemeral connections, best RTT)
//
// Each source responds independently → progressive rendering.
// Chunks large batches into groups of 50 authors per REQ to avoid relay limits.

const batchQueue: Set<string> = new Set();
let batchTimer: ReturnType<typeof setTimeout> | null = null;
const BATCH_DELAY = 30; // ms — near-instant batching, just enough to coalesce sync calls
const CHUNK_SIZE = 50; // max authors per REQ filter

/** Clear all cached profiles and pending fetches. */
export function resetProfiles(): void {
  profiles.clear();
  pendingFetches.clear();
  batchQueue.clear();
  if (batchTimer) { clearTimeout(batchTimer); batchTimer = null; }
  notify();
}

export function fetchProfile(pubkey: string) {
  if (profiles.has(pubkey) || pendingFetches.has(pubkey)) return;
  batchQueue.add(pubkey);
  scheduleBatchFlush();
}

export function fetchProfiles(pubkeys: string[]) {
  let added = 0;
  for (const pk of pubkeys) {
    if (!profiles.has(pk) && !pendingFetches.has(pk)) {
      batchQueue.add(pk);
      added++;
    }
  }
  if (added > 0) scheduleBatchFlush();
}

function scheduleBatchFlush() {
  if (batchTimer) return;
  batchTimer = setTimeout(() => {
    batchTimer = null;
    flushBatch();
  }, BATCH_DELAY);
}

function flushBatch() {
  const toFetch = Array.from(batchQueue).filter(
    (pk) => !profiles.has(pk) && !pendingFetches.has(pk),
  );
  batchQueue.clear();
  if (toFetch.length === 0) return;

  for (const pk of toFetch) pendingFetches.add(pk);

  // 1. Check server cache first (async, non-blocking)
  getCachedProfiles(toFetch).then((cached) => {
    const remaining: string[] = [];
    for (const pk of toFetch) {
      const hit = cached.get(pk);
      if (hit) {
        // Hydrate from server cache
        const existing = profiles.get(pk);
        if (!existing || hit.created_at > existing.lastUpdated) {
          let meta: Record<string, string> = {};
          try { meta = JSON.parse(hit.raw_content); } catch { /* ignore */ }
          profiles.set(pk, {
            pubkey: pk,
            name: meta.name || '',
            displayName: meta.display_name || meta.displayName || '',
            about: meta.about || '',
            picture: meta.picture || '',
            banner: meta.banner || '',
            nip05: meta.nip05 || '',
            lud16: meta.lud16 || '',
            lastUpdated: hit.created_at,
          });
        }
        pendingFetches.delete(pk);
      } else {
        remaining.push(pk);
      }
    }
    if (cached.size > 0) notify();

    // 2. Query relays for anything not in server cache
    if (remaining.length === 0) return;
    queryRelays(remaining);
  }).catch(() => {
    // Server unreachable — fall back to relay-only
    queryRelays(toFetch);
  });
}

function queryRelays(toFetch: string[]) {
  // Chunk into groups
  const chunks: string[][] = [];
  for (let i = 0; i < toFetch.length; i += CHUNK_SIZE) {
    chunks.push(toFetch.slice(i, i + CHUNK_SIZE));
  }

  // Fan out to all sources simultaneously
  queryViaPool(chunks, toFetch);
  queryViaCrawler(chunks);
  queryViaOutbox(chunks);
}

function queryViaPool(chunks: string[][], allPubkeys: string[]) {
  const pool = getPool();
  let eoseCount = 0;

  for (const chunk of chunks) {
    const sub = pool.subscribe(
      [{ kinds: [Kind.Metadata], authors: chunk }],
      (event) => applyEvent(event),
      () => {
        sub.unsubscribe();
        eoseCount++;
        if (eoseCount >= chunks.length) {
          for (const pk of allPubkeys) pendingFetches.delete(pk);
        }
      },
    );
  }
}

function queryViaOutbox(chunks: string[][]) {
  const pool = getPool();
  const outboxUrls = getOutboxUrls();
  if (outboxUrls.length === 0) return;

  for (const chunk of chunks) {
    const sub = pool.subscribeToUrls(
      outboxUrls,
      [{ kinds: [Kind.Metadata], authors: chunk }],
      (event) => applyEvent(event),
      () => { sub.unsubscribe(); },
    );
  }
}

function queryViaCrawler(chunks: string[][]) {
  // Use the relay crawler to query indexers + popular relays simultaneously
  for (const chunk of chunks) {
    crawl(
      [{ kinds: [Kind.Metadata], authors: chunk }],
      (event) => applyEvent(event),
      { maxRelays: 6, timeout: 5000, preferIndexers: true },
    ).catch(() => { /* crawler error, no-op */ });
  }
}

export function getDisplayName(pubkey: string): string {
  const profile = profiles.get(pubkey);
  if (profile) {
    return profile.displayName || profile.name || pubkey.slice(0, 8) + '...';
  }
  return pubkey.slice(0, 8) + '...';
}
