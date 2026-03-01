import type { Statement } from 'bun:sqlite';
import { getDb } from './schema';
import type { StoredEvent } from './events';

// ---------------------------------------------------------------------------
// Contact List Materialized View (kind 3 — NIP-02)
// ---------------------------------------------------------------------------

export interface ContactEntry {
  pubkey: string;
  relay?: string;
  petname?: string;
}

export interface ContactListRow {
  pubkey: string;
  event_id: string;
  created_at: number;
  contacts_json: string;
}

let _upsert: Statement | null = null;
let _get: Statement | null = null;

function getUpsertStmt(): Statement {
  if (!_upsert) {
    _upsert = getDb().prepare(`
      INSERT INTO contact_lists (pubkey, event_id, created_at, contacts_json)
      VALUES ($pubkey, $event_id, $created_at, $contacts_json)
      ON CONFLICT(pubkey) DO UPDATE SET
        event_id = excluded.event_id,
        created_at = excluded.created_at,
        contacts_json = excluded.contacts_json
      WHERE excluded.created_at > contact_lists.created_at
    `);
  }
  return _upsert;
}

function getGetStmt(): Statement {
  if (!_get) {
    _get = getDb().prepare('SELECT * FROM contact_lists WHERE pubkey = $pubkey');
  }
  return _get;
}

/**
 * Upsert a contact list from a kind-3 event. Only updates if newer.
 */
export function upsertContactList(event: StoredEvent): boolean {
  if (event.kind !== 3) return false;

  const contacts: ContactEntry[] = [];
  for (const tag of event.tags) {
    if (tag[0] === 'p' && tag[1]) {
      contacts.push({
        pubkey: tag[1],
        relay: tag[2] || undefined,
        petname: tag[3] || undefined,
      });
    }
  }

  const result = getUpsertStmt().run({
    $pubkey: event.pubkey,
    $event_id: event.id,
    $created_at: event.created_at,
    $contacts_json: JSON.stringify(contacts),
  });

  return result.changes > 0;
}

/** Get contact list for a pubkey. */
export function getContactList(pubkey: string): ContactEntry[] | null {
  const row = getGetStmt().get({ $pubkey: pubkey }) as ContactListRow | null;
  if (!row) return null;
  return JSON.parse(row.contacts_json) as ContactEntry[];
}

/** Get followed pubkeys as a Set (convenience). */
export function getFollowingSet(pubkey: string): Set<string> {
  const contacts = getContactList(pubkey);
  if (!contacts) return new Set();
  return new Set(contacts.map(c => c.pubkey));
}
