// ---------------------------------------------------------------------------
// Client-side Cache API — talks to /api/cache/* on the Hono server
// ---------------------------------------------------------------------------
// Write-through: every event received from relays gets pushed to the server.
// Read-through: stores check the server cache before hitting relays.

import type { NostrEvent } from '../../nostr/event';

const BASE = '/api/cache';

// ---------------------------------------------------------------------------
// Ingest (write-through)
// ---------------------------------------------------------------------------

/** Queue of events waiting to be flushed to the server. */
let ingestQueue: NostrEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_DELAY = 200; // ms — batch events before sending
const FLUSH_MAX = 100; // max events per request

/**
 * Queue an event for write-through to the server cache.
 * Events are batched and flushed every 200ms to avoid per-event HTTP overhead.
 */
export function cacheEvent(event: NostrEvent): void {
  ingestQueue.push(event);
  if (ingestQueue.length >= FLUSH_MAX) {
    flushIngestQueue();
  } else if (!flushTimer) {
    flushTimer = setTimeout(flushIngestQueue, FLUSH_DELAY);
  }
}

/** Flush all queued events to the server. */
function flushIngestQueue(): void {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (ingestQueue.length === 0) return;

  const batch = ingestQueue.splice(0, FLUSH_MAX);

  // Fire-and-forget — don't block the UI on cache writes
  fetch(`${BASE}/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: batch }),
  }).catch(() => {
    // Server unreachable — silently discard, relay data is the source of truth
  });
}

/** Flush any pending events to the server, then clear the queue. */
export function flushAndResetIngest(): void {
  flushIngestQueue();
  ingestQueue = [];
}

// ---------------------------------------------------------------------------
// Profiles (read-through)
// ---------------------------------------------------------------------------

export interface CachedProfile {
  pubkey: string;
  name: string | null;
  display_name: string | null;
  about: string | null;
  picture: string | null;
  nip05: string | null;
  banner: string | null;
  lud16: string | null;
  raw_content: string;
  created_at: number;
}

/** Fetch a single profile from the server cache. Returns null if not cached. */
export async function getCachedProfile(pubkey: string): Promise<CachedProfile | null> {
  try {
    const res = await fetch(`${BASE}/profiles/${pubkey}`);
    if (!res.ok) return null;
    const data = await res.json() as { found: boolean; profile?: CachedProfile };
    return data.found && data.profile ? data.profile : null;
  } catch {
    return null;
  }
}

/** Fetch profiles for multiple pubkeys from the server cache. */
export async function getCachedProfiles(pubkeys: string[]): Promise<Map<string, CachedProfile>> {
  if (pubkeys.length === 0) return new Map();

  try {
    const res = await fetch(`${BASE}/profiles/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pubkeys }),
    });
    if (!res.ok) return new Map();

    const data = await res.json() as { profiles: Record<string, CachedProfile> };
    const result = new Map<string, CachedProfile>();
    for (const [pk, profile] of Object.entries(data.profiles)) {
      result.set(pk, profile);
    }
    return result;
  } catch {
    return new Map();
  }
}

// ---------------------------------------------------------------------------
// Relay Lists (read-through)
// ---------------------------------------------------------------------------

export interface CachedRelayEntry {
  url: string;
  read: boolean;
  write: boolean;
}

/** Fetch relay list for a pubkey from the server cache. */
export async function getCachedRelayList(pubkey: string): Promise<CachedRelayEntry[] | null> {
  try {
    const res = await fetch(`${BASE}/relay-lists/${pubkey}`);
    if (!res.ok) return null;
    const data = await res.json() as { found: boolean; relays?: CachedRelayEntry[] };
    return data.found && data.relays ? data.relays : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Contacts (read-through)
// ---------------------------------------------------------------------------

export interface CachedContact {
  pubkey: string;
  relay?: string;
  petname?: string;
}

/** Fetch contact list for a pubkey from the server cache. */
export async function getCachedContacts(pubkey: string): Promise<CachedContact[] | null> {
  try {
    const res = await fetch(`${BASE}/contacts/${pubkey}`);
    if (!res.ok) return null;
    const data = await res.json() as { found: boolean; contacts?: CachedContact[] };
    return data.found && data.contacts ? data.contacts : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Events (read-through)
// ---------------------------------------------------------------------------

/** Fetch a single event by ID from the server cache. */
export async function getCachedEvent(id: string): Promise<NostrEvent | null> {
  try {
    const res = await fetch(`${BASE}/events/${id}`);
    if (!res.ok) return null;
    const data = await res.json() as { found: boolean; event?: NostrEvent };
    return data.found && data.event ? data.event : null;
  } catch {
    return null;
  }
}

/** Fetch events by tag (e.g. reactions for a post). */
export async function getCachedEventsByTag(
  tagName: string,
  tagValue: string,
  kind?: number,
  limit = 100,
): Promise<NostrEvent[]> {
  try {
    const params = new URLSearchParams({ name: tagName, value: tagValue, limit: String(limit) });
    if (kind !== undefined) params.set('kind', String(kind));
    const res = await fetch(`${BASE}/events/by-tag?${params}`);
    if (!res.ok) return [];
    const data = await res.json() as { events: NostrEvent[] };
    return data.events || [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Feed (read-through for following mode)
// ---------------------------------------------------------------------------

/** Fetch cached kind-1 notes from followed authors. */
export async function getCachedFeed(authors: string[], limit = 50): Promise<NostrEvent[]> {
  if (authors.length === 0) return [];
  try {
    const res = await fetch(`${BASE}/events/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authors, limit }),
    });
    if (!res.ok) return [];
    const data = await res.json() as { events: NostrEvent[] };
    return data.events || [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Author Posts (paginated, for profile page)
// ---------------------------------------------------------------------------

/** Fetch cached posts for a single author with optional `until` cursor for pagination. */
export async function getCachedAuthorPosts(
  pubkey: string,
  kind = 1,
  limit = 50,
  until?: number,
): Promise<NostrEvent[]> {
  try {
    const params = new URLSearchParams({ kind: String(kind), limit: String(limit) });
    if (until !== undefined) params.set('until', String(until));
    const res = await fetch(`${BASE}/events/author/${pubkey}?${params}`);
    if (!res.ok) return [];
    const data = await res.json() as { events: NostrEvent[] };
    return data.events || [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export async function getCacheStats(): Promise<{ eventCount: number; profileCacheSize: number; relayListCacheSize: number } | null> {
  try {
    const res = await fetch(`${BASE}/stats`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
