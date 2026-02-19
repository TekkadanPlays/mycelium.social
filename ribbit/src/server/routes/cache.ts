import { Hono } from 'hono';
import {
  getProfile,
  getProfilesBatch,
  searchProfiles,
  getRelayList,
  getRelayListsBatch,
  getPopularWriteRelays,
  getContactList,
  getEvent,
  getEventsByKind,
  getEventsByKindAndPubkey,
  getEventsByKindAndPubkeyUntil,
  getEventsByKindAndAuthors,
  getEventsByTag,
  getEventCount,
  storeEvent,
  storeEvents,
  upsertProfile,
  upsertRelayList,
  upsertContactList,
  TTLCache,
} from '../db';
import type { StoredEvent, ProfileRow, RelayEntry } from '../db';

// ---------------------------------------------------------------------------
// Cache API Routes
// ---------------------------------------------------------------------------
// Exposes the SQLite cache to the client via JSON API.
// The client can query cached data instantly and fall back to relays
// for anything not yet cached.

export const cacheRoute = new Hono();

// In-memory TTL caches for ultra-hot paths
const profileCache = new TTLCache<string, ProfileRow | null>(30_000, 5_000);
const relayListCache = new TTLCache<string, RelayEntry[] | null>(60_000, 5_000);

// ── Profiles ────────────────────────────────────────────────────────────

/** GET /cache/profiles/:pubkey */
cacheRoute.get('/profiles/:pubkey', (c) => {
  const pubkey = c.req.param('pubkey');

  // Check TTL cache first
  const cached = profileCache.get(pubkey);
  if (cached !== undefined) {
    if (cached === null) return c.json({ found: false }, 404);
    return c.json({ found: true, profile: cached });
  }

  // Fall through to SQLite
  const profile = getProfile(pubkey);
  profileCache.set(pubkey, profile);

  if (!profile) return c.json({ found: false }, 404);
  return c.json({ found: true, profile });
});

/** POST /cache/profiles/batch — body: { pubkeys: string[] } */
cacheRoute.post('/profiles/batch', async (c) => {
  const body = await c.req.json<{ pubkeys: string[] }>();
  if (!body.pubkeys || !Array.isArray(body.pubkeys)) {
    return c.json({ error: 'pubkeys array required' }, 400);
  }

  // Check TTL cache for each, collect misses
  const result: Record<string, ProfileRow> = {};
  const misses: string[] = [];

  for (const pk of body.pubkeys) {
    const cached = profileCache.get(pk);
    if (cached !== undefined) {
      if (cached) result[pk] = cached;
    } else {
      misses.push(pk);
    }
  }

  // Batch query SQLite for misses
  if (misses.length > 0) {
    const rows = getProfilesBatch(misses);
    const found = new Set<string>();
    for (const row of rows) {
      result[row.pubkey] = row;
      profileCache.set(row.pubkey, row);
      found.add(row.pubkey);
    }
    // Cache negative results too
    for (const pk of misses) {
      if (!found.has(pk)) profileCache.set(pk, null);
    }
  }

  return c.json({ profiles: result });
});

/** GET /cache/profiles/search?q=name */
cacheRoute.get('/profiles/search', (c) => {
  const q = c.req.query('q');
  if (!q || q.length < 2) return c.json({ profiles: [] });
  const profiles = searchProfiles(q, 20);
  return c.json({ profiles });
});

// ── Relay Lists ─────────────────────────────────────────────────────────

/** GET /cache/relay-lists/:pubkey */
cacheRoute.get('/relay-lists/:pubkey', (c) => {
  const pubkey = c.req.param('pubkey');

  const cached = relayListCache.get(pubkey);
  if (cached !== undefined) {
    if (cached === null) return c.json({ found: false }, 404);
    return c.json({ found: true, relays: cached });
  }

  const relays = getRelayList(pubkey);
  relayListCache.set(pubkey, relays);

  if (!relays) return c.json({ found: false }, 404);
  return c.json({ found: true, relays });
});

/** POST /cache/relay-lists/batch — body: { pubkeys: string[] } */
cacheRoute.post('/relay-lists/batch', async (c) => {
  const body = await c.req.json<{ pubkeys: string[] }>();
  if (!body.pubkeys || !Array.isArray(body.pubkeys)) {
    return c.json({ error: 'pubkeys array required' }, 400);
  }

  const result: Record<string, RelayEntry[]> = {};
  const misses: string[] = [];

  for (const pk of body.pubkeys) {
    const cached = relayListCache.get(pk);
    if (cached !== undefined) {
      if (cached) result[pk] = cached;
    } else {
      misses.push(pk);
    }
  }

  if (misses.length > 0) {
    const batchResult = getRelayListsBatch(misses);
    for (const [pk, relays] of batchResult) {
      result[pk] = relays;
      relayListCache.set(pk, relays);
    }
    for (const pk of misses) {
      if (!batchResult.has(pk)) relayListCache.set(pk, null);
    }
  }

  return c.json({ relayLists: result });
});

// ── Contacts ────────────────────────────────────────────────────────────

/** GET /cache/contacts/:pubkey */
cacheRoute.get('/contacts/:pubkey', (c) => {
  const pubkey = c.req.param('pubkey');
  const contacts = getContactList(pubkey);
  if (!contacts) return c.json({ found: false }, 404);
  return c.json({ found: true, contacts });
});

// ── Events ──────────────────────────────────────────────────────────────

/** GET /cache/events/:id */
cacheRoute.get('/events/:id', (c) => {
  const id = c.req.param('id');
  const event = getEvent(id);
  if (!event) return c.json({ found: false }, 404);
  return c.json({ found: true, event });
});

/** GET /cache/events?kind=1&limit=50 */
cacheRoute.get('/events', (c) => {
  const kind = Number(c.req.query('kind'));
  const limit = Math.min(Number(c.req.query('limit') || '50'), 500);
  if (isNaN(kind)) return c.json({ error: 'kind parameter required' }, 400);
  const events = getEventsByKind(kind, limit);
  return c.json({ events });
});

/** POST /cache/events/feed — body: { authors: string[], limit?: number } */
cacheRoute.post('/events/feed', async (c) => {
  const body = await c.req.json<{ authors: string[]; limit?: number }>();
  if (!body.authors || !Array.isArray(body.authors) || body.authors.length === 0) {
    return c.json({ error: 'authors array required' }, 400);
  }
  const limit = Math.min(body.limit || 50, 200);
  const events = getEventsByKindAndAuthors(1, body.authors, limit);
  return c.json({ events });
});

/** GET /cache/events/author/:pubkey?kind=1&limit=50&until=<ts> — paginated author posts */
cacheRoute.get('/events/author/:pubkey', (c) => {
  const pubkey = c.req.param('pubkey');
  const kind = Number(c.req.query('kind') || '1');
  const limit = Math.min(Number(c.req.query('limit') || '50'), 200);
  const until = c.req.query('until') ? Number(c.req.query('until')) : undefined;

  const events = until
    ? getEventsByKindAndPubkeyUntil(kind, pubkey, until, limit)
    : getEventsByKindAndPubkey(kind, pubkey, limit);

  return c.json({ events });
});

/** GET /cache/events/by-tag?name=e&value=<id>&kind=7 */
cacheRoute.get('/events/by-tag', (c) => {
  const name = c.req.query('name');
  const value = c.req.query('value');
  const kind = c.req.query('kind') ? Number(c.req.query('kind')) : undefined;
  const limit = Math.min(Number(c.req.query('limit') || '100'), 500);

  if (!name || !value) return c.json({ error: 'name and value required' }, 400);
  const events = getEventsByTag(name, value, kind, limit);
  return c.json({ events });
});

// ── Ingest ──────────────────────────────────────────────────────────────
// Client pushes events it receives from relays into the server cache.

/** POST /cache/ingest — body: { events: StoredEvent[] } */
cacheRoute.post('/ingest', async (c) => {
  const body = await c.req.json<{ events: StoredEvent[] }>();
  if (!body.events || !Array.isArray(body.events)) {
    return c.json({ error: 'events array required' }, 400);
  }

  // Cap batch size to prevent abuse
  const events = body.events.slice(0, 500);
  const stored = storeEvents(events);

  // Update materialized views
  for (const event of events) {
    if (event.kind === 0) {
      upsertProfile(event);
      profileCache.delete(event.pubkey);
    } else if (event.kind === 10002) {
      upsertRelayList(event);
      relayListCache.delete(event.pubkey);
    } else if (event.kind === 3) {
      upsertContactList(event);
    }
  }

  return c.json({ stored, total: events.length });
});

/** POST /cache/ingest/event — body: StoredEvent (single event) */
cacheRoute.post('/ingest/event', async (c) => {
  const event = await c.req.json<StoredEvent>();
  if (!event.id || !event.pubkey) {
    return c.json({ error: 'invalid event' }, 400);
  }

  const stored = storeEvent(event);

  // Update materialized views
  if (event.kind === 0) {
    upsertProfile(event);
    profileCache.delete(event.pubkey);
  } else if (event.kind === 10002) {
    upsertRelayList(event);
    relayListCache.delete(event.pubkey);
  } else if (event.kind === 3) {
    upsertContactList(event);
  }

  return c.json({ stored });
});

// ── Popular Relays ──────────────────────────────────────────────────────

/** GET /cache/popular-relays?limit=25 — top write relays by frequency across all cached NIP-65 */
cacheRoute.get('/popular-relays', (c) => {
  const limit = Math.min(Number(c.req.query('limit') || '25'), 100);
  const relays = getPopularWriteRelays(limit);
  return c.json({ relays });
});

// ── Stats ───────────────────────────────────────────────────────────────

/** GET /cache/stats */
cacheRoute.get('/stats', (c) => {
  return c.json({
    eventCount: getEventCount(),
    profileCacheSize: profileCache.size,
    relayListCacheSize: relayListCache.size,
  });
});
