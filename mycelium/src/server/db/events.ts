import type { Database, Statement } from 'bun:sqlite';
import { getDb } from './schema';

// ---------------------------------------------------------------------------
// Event Store — CRUD for Nostr events with prepared statements
// ---------------------------------------------------------------------------
// All statements are lazily initialized and reused for the process lifetime.
// Replaceable events (kind 0, 3, 10002) use newest-wins semantics.

interface NostrEventRow {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  content: string;
  tags_json: string;
  sig: string;
  raw: string;
  first_seen: number;
}

export interface StoredEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  content: string;
  tags: string[][];
  sig: string;
}

// Replaceable event kinds (only latest per pubkey matters)
const REPLACEABLE_KINDS = new Set([0, 3, 10002]);

// ---------------------------------------------------------------------------
// Prepared statements (lazy init)
// ---------------------------------------------------------------------------

let _insertEvent: Statement | null = null;
let _insertTag: Statement | null = null;
let _getEventById: Statement | null = null;
let _getEventsByKindPubkey: Statement | null = null;
let _getEventsByKind: Statement | null = null;
let _getEventsByPubkeys: Statement | null = null;
let _getEventsByTagValue: Statement | null = null;
let _getLatestByKindPubkey: Statement | null = null;
let _deleteEvent: Statement | null = null;
let _deleteTags: Statement | null = null;
let _countEvents: Statement | null = null;

function stmts() {
  const db = getDb();

  if (!_insertEvent) {
    _insertEvent = db.prepare(`
      INSERT OR IGNORE INTO events (id, pubkey, created_at, kind, content, tags_json, sig, raw)
      VALUES ($id, $pubkey, $created_at, $kind, $content, $tags_json, $sig, $raw)
    `);
  }
  if (!_insertTag) {
    _insertTag = db.prepare(`
      INSERT OR IGNORE INTO event_tags (event_id, tag_name, tag_value, tag_index)
      VALUES ($event_id, $tag_name, $tag_value, $tag_index)
    `);
  }
  if (!_getEventById) {
    _getEventById = db.prepare('SELECT * FROM events WHERE id = $id');
  }
  if (!_getEventsByKindPubkey) {
    _getEventsByKindPubkey = db.prepare(
      'SELECT * FROM events WHERE kind = $kind AND pubkey = $pubkey ORDER BY created_at DESC LIMIT $limit'
    );
  }
  if (!_getEventsByKind) {
    _getEventsByKind = db.prepare(
      'SELECT * FROM events WHERE kind = $kind ORDER BY created_at DESC LIMIT $limit'
    );
  }
  if (!_getLatestByKindPubkey) {
    _getLatestByKindPubkey = db.prepare(
      'SELECT * FROM events WHERE kind = $kind AND pubkey = $pubkey ORDER BY created_at DESC LIMIT 1'
    );
  }
  if (!_deleteEvent) {
    _deleteEvent = db.prepare('DELETE FROM events WHERE id = $id');
  }
  if (!_deleteTags) {
    _deleteTags = db.prepare('DELETE FROM event_tags WHERE event_id = $event_id');
  }
  if (!_countEvents) {
    _countEvents = db.prepare('SELECT COUNT(*) as count FROM events');
  }

  return {
    insertEvent: _insertEvent!,
    insertTag: _insertTag!,
    getEventById: _getEventById!,
    getEventsByKindPubkey: _getEventsByKindPubkey!,
    getEventsByKind: _getEventsByKind!,
    getLatestByKindPubkey: _getLatestByKindPubkey!,
    deleteEvent: _deleteEvent!,
    deleteTags: _deleteTags!,
    countEvents: _countEvents!,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function rowToEvent(row: NostrEventRow): StoredEvent {
  return {
    id: row.id,
    pubkey: row.pubkey,
    created_at: row.created_at,
    kind: row.kind,
    content: row.content,
    tags: JSON.parse(row.tags_json),
    sig: row.sig,
  };
}

/**
 * Store a Nostr event. For replaceable kinds (0, 3, 10002), only stores
 * if newer than existing. Returns true if the event was actually stored.
 */
export function storeEvent(event: StoredEvent): boolean {
  const s = stmts();

  // For replaceable events, check if we already have a newer one
  if (REPLACEABLE_KINDS.has(event.kind)) {
    const existing = s.getLatestByKindPubkey.get({
      $kind: event.kind,
      $pubkey: event.pubkey,
    }) as NostrEventRow | null;

    if (existing && existing.created_at >= event.created_at) {
      return false; // Already have a newer or equal event
    }

    // Delete old event if exists (cascade deletes tags)
    if (existing) {
      s.deleteEvent.run({ $id: existing.id });
    }
  }

  const raw = JSON.stringify(event);
  const tagsJson = JSON.stringify(event.tags);

  s.insertEvent.run({
    $id: event.id,
    $pubkey: event.pubkey,
    $created_at: event.created_at,
    $kind: event.kind,
    $content: event.content,
    $tags_json: tagsJson,
    $sig: event.sig,
    $raw: raw,
  });

  // Index tags (only first two elements: tag name + primary value)
  for (let i = 0; i < event.tags.length; i++) {
    const tag = event.tags[i];
    if (tag && tag.length >= 2 && tag[0] && tag[1]) {
      s.insertTag.run({
        $event_id: event.id,
        $tag_name: tag[0],
        $tag_value: tag[1],
        $tag_index: i,
      });
    }
  }

  return true;
}

/**
 * Store multiple events in a single transaction (much faster for bulk inserts).
 */
export function storeEvents(events: StoredEvent[]): number {
  const db = getDb();
  let stored = 0;

  const tx = db.transaction(() => {
    for (const event of events) {
      if (storeEvent(event)) stored++;
    }
  });

  tx();
  return stored;
}

/** Get a single event by ID. */
export function getEvent(id: string): StoredEvent | null {
  const row = stmts().getEventById.get({ $id: id }) as NostrEventRow | null;
  return row ? rowToEvent(row) : null;
}

/** Get the latest event for a given kind + pubkey (for replaceable events). */
export function getLatestEvent(kind: number, pubkey: string): StoredEvent | null {
  const row = stmts().getLatestByKindPubkey.get({
    $kind: kind,
    $pubkey: pubkey,
  }) as NostrEventRow | null;
  return row ? rowToEvent(row) : null;
}

/** Get events by kind, ordered by created_at DESC. */
export function getEventsByKind(kind: number, limit = 100): StoredEvent[] {
  const rows = stmts().getEventsByKind.all({
    $kind: kind,
    $limit: limit,
  }) as NostrEventRow[];
  return rows.map(rowToEvent);
}

/** Get events by kind + pubkey, ordered by created_at DESC. */
export function getEventsByKindAndPubkey(kind: number, pubkey: string, limit = 100): StoredEvent[] {
  const rows = stmts().getEventsByKindPubkey.all({
    $kind: kind,
    $pubkey: pubkey,
    $limit: limit,
  }) as NostrEventRow[];
  return rows.map(rowToEvent);
}

/** Get events by kind + pubkey with `until` cursor for pagination. */
export function getEventsByKindAndPubkeyUntil(
  kind: number,
  pubkey: string,
  until: number,
  limit = 50,
): StoredEvent[] {
  const db = getDb();
  const rows = db.prepare(
    'SELECT * FROM events WHERE kind = ? AND pubkey = ? AND created_at < ? ORDER BY created_at DESC LIMIT ?'
  ).all(kind, pubkey, until, limit) as NostrEventRow[];
  return rows.map(rowToEvent);
}

/** Get events by tag value (e.g. all reactions referencing a post). */
export function getEventsByTag(tagName: string, tagValue: string, kind?: number, limit = 200): StoredEvent[] {
  const db = getDb();
  let sql = `
    SELECT e.* FROM events e
    INNER JOIN event_tags t ON e.id = t.event_id
    WHERE t.tag_name = ? AND t.tag_value = ?
  `;
  const params: (string | number)[] = [tagName, tagValue];

  if (kind !== undefined) {
    sql += ' AND e.kind = ?';
    params.push(kind);
  }

  sql += ' ORDER BY e.created_at DESC LIMIT ?';
  params.push(limit);

  const rows = db.prepare(sql).all(...params) as NostrEventRow[];
  return rows.map(rowToEvent);
}

/**
 * Get profiles for multiple pubkeys in one query.
 * Returns a Map of pubkey -> StoredEvent (kind 0).
 */
export function getProfiles(pubkeys: string[]): Map<string, StoredEvent> {
  if (pubkeys.length === 0) return new Map();

  const db = getDb();
  const placeholders = pubkeys.map(() => '?').join(',');
  const rows = db.prepare(`
    SELECT e.* FROM events e
    INNER JOIN profiles p ON e.id = p.event_id
    WHERE p.pubkey IN (${placeholders})
  `).all(...pubkeys) as NostrEventRow[];

  const result = new Map<string, StoredEvent>();
  for (const row of rows) {
    result.set(row.pubkey, rowToEvent(row));
  }
  return result;
}

/** Get events by kind for multiple authors, ordered by created_at DESC. */
export function getEventsByKindAndAuthors(kind: number, authors: string[], limit = 100): StoredEvent[] {
  if (authors.length === 0) return [];
  const db = getDb();
  const placeholders = authors.map(() => '?').join(',');
  const rows = db.prepare(`
    SELECT * FROM events
    WHERE kind = ? AND pubkey IN (${placeholders})
    ORDER BY created_at DESC LIMIT ?
  `).all(kind, ...authors, limit) as NostrEventRow[];
  return rows.map(rowToEvent);
}

/** Get total event count (for stats). */
export function getEventCount(): number {
  const row = stmts().countEvents.get() as { count: number } | null;
  return row?.count ?? 0;
}

/** Delete an event by ID. */
export function deleteEvent(id: string): boolean {
  const result = stmts().deleteEvent.run({ $id: id });
  return result.changes > 0;
}
