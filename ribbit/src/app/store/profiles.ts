import type { NostrEvent } from '../../nostr/event';
import { Kind } from '../../nostr/event';
import { getPool } from './relay';

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

function notify() {
  for (const fn of listeners) fn();
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

// Batch queue: collect pubkeys over a short window, then fetch all at once
let batchQueue: Set<string> = new Set();
let batchTimer: ReturnType<typeof setTimeout> | null = null;
const BATCH_DELAY = 150; // ms to wait before flushing

export function fetchProfile(pubkey: string) {
  if (profiles.has(pubkey) || pendingFetches.has(pubkey)) return;
  batchQueue.add(pubkey);
  scheduleBatchFlush();
}

export function fetchProfiles(pubkeys: string[]) {
  for (const pk of pubkeys) {
    if (!profiles.has(pk) && !pendingFetches.has(pk)) {
      batchQueue.add(pk);
    }
  }
  scheduleBatchFlush();
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

  const pool = getPool();
  const sub = pool.subscribe(
    [{ kinds: [Kind.Metadata], authors: toFetch }],
    (event) => {
      const existing = profiles.get(event.pubkey);
      if (!existing || event.created_at > existing.lastUpdated) {
        profiles.set(event.pubkey, parseProfileEvent(event));
        notify();
      }
    },
    () => {
      // Close sub after EOSE
      sub.unsubscribe();
      for (const pk of toFetch) pendingFetches.delete(pk);
    },
  );
}

export function getDisplayName(pubkey: string): string {
  const profile = profiles.get(pubkey);
  if (profile) {
    return profile.displayName || profile.name || pubkey.slice(0, 8) + '...';
  }
  return pubkey.slice(0, 8) + '...';
}
