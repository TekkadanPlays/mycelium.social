import type { Database, Statement } from 'bun:sqlite';
import { getDb } from './schema';
import type { StoredEvent } from './events';

// ---------------------------------------------------------------------------
// Profile Materialized View
// ---------------------------------------------------------------------------
// Maintains a denormalized profiles table from kind-0 events for fast lookups.
// Updated on every kind-0 event insert via upsertProfile().

interface ProfileMeta {
  name?: string;
  display_name?: string;
  about?: string;
  picture?: string;
  nip05?: string;
  banner?: string;
  lud16?: string;
  [key: string]: unknown;
}

let _upsertProfile: Statement | null = null;
let _getProfile: Statement | null = null;
let _getProfilesBatch: null = null; // dynamic query, can't prepare

function getUpsertStmt(): Statement {
  if (!_upsertProfile) {
    _upsertProfile = getDb().prepare(`
      INSERT INTO profiles (pubkey, event_id, created_at, name, display_name, about, picture, nip05, banner, lud16, raw_content)
      VALUES ($pubkey, $event_id, $created_at, $name, $display_name, $about, $picture, $nip05, $banner, $lud16, $raw_content)
      ON CONFLICT(pubkey) DO UPDATE SET
        event_id = excluded.event_id,
        created_at = excluded.created_at,
        name = excluded.name,
        display_name = excluded.display_name,
        about = excluded.about,
        picture = excluded.picture,
        nip05 = excluded.nip05,
        banner = excluded.banner,
        lud16 = excluded.lud16,
        raw_content = excluded.raw_content
      WHERE excluded.created_at > profiles.created_at
    `);
  }
  return _upsertProfile;
}

function getProfileStmt(): Statement {
  if (!_getProfile) {
    _getProfile = getDb().prepare('SELECT * FROM profiles WHERE pubkey = $pubkey');
  }
  return _getProfile;
}

export interface ProfileRow {
  pubkey: string;
  event_id: string;
  created_at: number;
  name: string | null;
  display_name: string | null;
  about: string | null;
  picture: string | null;
  nip05: string | null;
  banner: string | null;
  lud16: string | null;
  raw_content: string;
}

/**
 * Upsert a profile from a kind-0 event. Only updates if the event is newer.
 */
export function upsertProfile(event: StoredEvent): boolean {
  if (event.kind !== 0) return false;

  let meta: ProfileMeta = {};
  try {
    meta = JSON.parse(event.content);
  } catch {
    // Invalid JSON content — store with empty fields
  }

  const result = getUpsertStmt().run({
    $pubkey: event.pubkey,
    $event_id: event.id,
    $created_at: event.created_at,
    $name: meta.name ?? null,
    $display_name: meta.display_name ?? null,
    $about: meta.about ?? null,
    $picture: meta.picture ?? null,
    $nip05: meta.nip05 ?? null,
    $banner: meta.banner ?? null,
    $lud16: meta.lud16 ?? null,
    $raw_content: event.content,
  });

  return result.changes > 0;
}

/** Get a single profile by pubkey. */
export function getProfile(pubkey: string): ProfileRow | null {
  return getProfileStmt().get({ $pubkey: pubkey }) as ProfileRow | null;
}

/** Get profiles for multiple pubkeys in one query. */
export function getProfilesBatch(pubkeys: string[]): ProfileRow[] {
  if (pubkeys.length === 0) return [];

  const db = getDb();
  const placeholders = pubkeys.map(() => '?').join(',');
  return db.prepare(
    `SELECT * FROM profiles WHERE pubkey IN (${placeholders})`
  ).all(...pubkeys) as ProfileRow[];
}

/** Search profiles by name (prefix match). */
export function searchProfiles(query: string, limit = 20): ProfileRow[] {
  const db = getDb();
  return db.prepare(
    `SELECT * FROM profiles
     WHERE name LIKE $query OR display_name LIKE $query
     ORDER BY created_at DESC
     LIMIT $limit`
  ).all({ $query: `${query}%`, $limit: limit }) as ProfileRow[];
}
