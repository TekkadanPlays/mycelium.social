import { Hono } from 'hono';

// NIP-05: Mapping Nostr keys to DNS-based internet identifiers
// Serves /.well-known/nostr.json?name=<username>
// For now, returns empty — will be populated from relay data or config

export const nip05Route = new Hono();

// In-memory registry (can be replaced with relay lookup later)
const nip05Users: Record<string, string> = {};

export function registerNip05(name: string, pubkeyHex: string) {
  nip05Users[name.toLowerCase()] = pubkeyHex;
}

nip05Route.get('/nostr.json', (c) => {
  const name = c.req.query('name');

  if (!name) {
    return c.json({ names: nip05Users });
  }

  const pubkey = nip05Users[name.toLowerCase()];
  if (!pubkey) {
    return c.json({ names: {} });
  }

  return c.json({
    names: { [name]: pubkey },
  });
});
