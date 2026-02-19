import type { Statement } from 'bun:sqlite';
import { getDb } from './schema';
import type { StoredEvent } from './events';

// ---------------------------------------------------------------------------
// Relay List Materialized View (kind 10002 — NIP-65)
// ---------------------------------------------------------------------------

export interface RelayEntry {
  url: string;
  read: boolean;
  write: boolean;
}

export interface RelayListRow {
  pubkey: string;
  event_id: string;
  created_at: number;
  relays_json: string;
}

let _upsert: Statement | null = null;
let _get: Statement | null = null;

function getUpsertStmt(): Statement {
  if (!_upsert) {
    _upsert = getDb().prepare(`
      INSERT INTO relay_lists (pubkey, event_id, created_at, relays_json)
      VALUES ($pubkey, $event_id, $created_at, $relays_json)
      ON CONFLICT(pubkey) DO UPDATE SET
        event_id = excluded.event_id,
        created_at = excluded.created_at,
        relays_json = excluded.relays_json
      WHERE excluded.created_at > relay_lists.created_at
    `);
  }
  return _upsert;
}

function getGetStmt(): Statement {
  if (!_get) {
    _get = getDb().prepare('SELECT * FROM relay_lists WHERE pubkey = $pubkey');
  }
  return _get;
}

/**
 * Upsert a relay list from a kind-10002 event. Only updates if newer.
 */
export function upsertRelayList(event: StoredEvent): boolean {
  if (event.kind !== 10002) return false;

  const relays: RelayEntry[] = [];
  for (const tag of event.tags) {
    if (tag[0] === 'r' && tag[1]) {
      const url = tag[1];
      const marker = tag[2];
      relays.push({
        url,
        read: !marker || marker === 'read',
        write: !marker || marker === 'write',
      });
    }
  }

  const result = getUpsertStmt().run({
    $pubkey: event.pubkey,
    $event_id: event.id,
    $created_at: event.created_at,
    $relays_json: JSON.stringify(relays),
  });

  return result.changes > 0;
}

/** Get relay list for a pubkey. */
export function getRelayList(pubkey: string): RelayEntry[] | null {
  const row = getGetStmt().get({ $pubkey: pubkey }) as RelayListRow | null;
  if (!row) return null;
  return JSON.parse(row.relays_json) as RelayEntry[];
}

/** Get the top N most popular write relay URLs across all cached relay lists. */
export function getPopularWriteRelays(limit: number = 25): { url: string; count: number }[] {
  const db = getDb();
  const rows = db.prepare('SELECT relays_json FROM relay_lists').all() as RelayListRow[];

  const freq = new Map<string, number>();
  for (const row of rows) {
    const relays: RelayEntry[] = JSON.parse(row.relays_json);
    for (const r of relays) {
      if (r.write) {
        const normalized = r.url.replace(/\/+$/, '');
        freq.set(normalized, (freq.get(normalized) || 0) + 1);
      }
    }
  }

  return Array.from(freq.entries())
    .map(([url, count]) => ({ url, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** Get relay lists for multiple pubkeys. */
export function getRelayListsBatch(pubkeys: string[]): Map<string, RelayEntry[]> {
  if (pubkeys.length === 0) return new Map();

  const db = getDb();
  const placeholders = pubkeys.map(() => '?').join(',');
  const rows = db.prepare(
    `SELECT * FROM relay_lists WHERE pubkey IN (${placeholders})`
  ).all(...pubkeys) as RelayListRow[];

  const result = new Map<string, RelayEntry[]>();
  for (const row of rows) {
    result.set(row.pubkey, JSON.parse(row.relays_json));
  }
  return result;
}
