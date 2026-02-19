import { Database } from 'bun:sqlite';
import { join } from 'path';

// ---------------------------------------------------------------------------
// SQLite Database — Nostr Event Cache
// ---------------------------------------------------------------------------
// Single-file database using bun:sqlite with WAL mode for concurrent
// read/write performance. All Nostr events are stored in a normalized
// schema with indexes optimized for the queries ribbit actually makes.
//
// Design principles:
//   - Events table stores raw JSON + indexed columns for fast lookups
//   - Replaceable events (kind 0, 3, 10002) use UPSERT with created_at check
//   - Tags stored in a separate table for efficient tag-based queries
//   - Prepared statements reused across the process lifetime

const DB_PATH = join(import.meta.dir, '..', '..', '..', 'data', 'ribbit.db');

let db: Database | null = null;

export function getDb(): Database {
  if (db) return db;

  // Ensure data directory exists
  const { mkdirSync } = require('fs');
  const { dirname } = require('path');
  mkdirSync(dirname(DB_PATH), { recursive: true });

  db = new Database(DB_PATH, { create: true });

  // Performance pragmas
  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA synchronous = NORMAL');
  db.run('PRAGMA cache_size = 10000');
  db.run('PRAGMA foreign_keys = ON');
  db.run('PRAGMA temp_store = MEMORY');

  createTables(db);
  return db;
}

function createTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id          TEXT PRIMARY KEY,
      pubkey      TEXT NOT NULL,
      created_at  INTEGER NOT NULL,
      kind        INTEGER NOT NULL,
      content     TEXT NOT NULL DEFAULT '',
      tags_json   TEXT NOT NULL DEFAULT '[]',
      sig         TEXT NOT NULL,
      raw         TEXT NOT NULL,
      first_seen  INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  // Tags: normalized for efficient lookups (e.g. #e, #p, #t queries)
  db.run(`
    CREATE TABLE IF NOT EXISTS event_tags (
      event_id    TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      tag_name    TEXT NOT NULL,
      tag_value   TEXT NOT NULL,
      tag_index   INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (event_id, tag_name, tag_value, tag_index)
    )
  `);

  // Profiles: materialized view of kind-0 events for fast profile lookups
  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      pubkey      TEXT PRIMARY KEY,
      event_id    TEXT NOT NULL REFERENCES events(id),
      created_at  INTEGER NOT NULL,
      name        TEXT,
      display_name TEXT,
      about       TEXT,
      picture     TEXT,
      nip05       TEXT,
      banner      TEXT,
      lud16       TEXT,
      raw_content TEXT NOT NULL
    )
  `);

  // Relay lists: materialized view of kind-10002 events
  db.run(`
    CREATE TABLE IF NOT EXISTS relay_lists (
      pubkey      TEXT PRIMARY KEY,
      event_id    TEXT NOT NULL REFERENCES events(id),
      created_at  INTEGER NOT NULL,
      relays_json TEXT NOT NULL DEFAULT '[]'
    )
  `);

  // Contact lists: materialized view of kind-3 events
  db.run(`
    CREATE TABLE IF NOT EXISTS contact_lists (
      pubkey      TEXT PRIMARY KEY,
      event_id    TEXT NOT NULL REFERENCES events(id),
      created_at  INTEGER NOT NULL,
      contacts_json TEXT NOT NULL DEFAULT '[]'
    )
  `);

  // Indexes for common query patterns
  db.run('CREATE INDEX IF NOT EXISTS idx_events_pubkey ON events(pubkey)');
  db.run('CREATE INDEX IF NOT EXISTS idx_events_kind ON events(kind)');
  db.run('CREATE INDEX IF NOT EXISTS idx_events_kind_pubkey ON events(kind, pubkey)');
  db.run('CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC)');
  db.run('CREATE INDEX IF NOT EXISTS idx_events_kind_created ON events(kind, created_at DESC)');
  db.run('CREATE INDEX IF NOT EXISTS idx_event_tags_name_value ON event_tags(tag_name, tag_value)');
  db.run('CREATE INDEX IF NOT EXISTS idx_event_tags_event_id ON event_tags(event_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_profiles_name ON profiles(name)');
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
