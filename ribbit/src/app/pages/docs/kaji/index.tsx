import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Badge } from '../../../ui/Badge';
import { PageHeader, CodeBlock } from '../_helpers';

const MODULES = [
  { name: 'event', path: '/docs/kaji/event', desc: 'Event creation, serialization, validation, signing. Kind enum.' },
  { name: 'keys', path: '/docs/kaji/keys', desc: 'Key pair generation, public key derivation, NIP-19 conversion.' },
  { name: 'sign', path: '/docs/kaji/sign', desc: 'Schnorr signing and verification via @noble/curves.' },
  { name: 'filter', path: '/docs/kaji/filter', desc: 'Fluent filter builder for relay subscriptions.' },
  { name: 'relay', path: '/docs/kaji/relay', desc: 'Single WebSocket relay with auto-reconnect and NIP-42 AUTH stub.' },
  { name: 'pool', path: '/docs/kaji/pool', desc: 'Multi-relay pool with cross-relay dedup and parallel publish.' },
  { name: 'nip07', path: '/docs/kaji/nip07', desc: 'window.nostr browser extension integration (NIP-07).' },
  { name: 'nip10', path: '/docs/kaji/nip10', desc: 'Thread parsing: root/reply markers, positional fallback, reply tag builder.' },
  { name: 'nip25', path: '/docs/kaji/nip25', desc: 'Reactions: like/dislike/emoji, dedup per pubkey, summaries.' },
  { name: 'nip29', path: '/docs/kaji/nip29', desc: 'Relay-based groups: metadata, members, join/leave requests.' },
  { name: 'nip55', path: '/docs/kaji/nip55', desc: 'Android signer integration (NIP-55). Intent-based signing for native apps.' },
  { name: 'nip66', path: '/docs/kaji/nip66', desc: 'Relay discovery and monitoring (NIP-66). Indexer queries, RTT, metadata.' },
  { name: 'utils', path: '/docs/kaji/utils', desc: 'NIP-19 bech32 encoding, nprofile TLV, hex helpers, kind names.' },
];

export function KajiIntro() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Kaji',
      description: 'InfernoJS-native Nostr protocol library. Zero framework dependencies \u2014 works anywhere.',
    }),
    createElement('div', { className: 'flex flex-wrap gap-2 mb-4' },
      createElement(Badge, null, 'Nostr'),
      createElement(Badge, { variant: 'secondary' }, 'TypeScript'),
      createElement(Badge, { variant: 'secondary' }, '13 modules'),
      createElement(Badge, { variant: 'secondary' }, '~2.5 KB gzipped'),
      createElement(Badge, { variant: 'outline' }, 'v0.1.0'),
    ),
    // Quick start
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Quick Start'),
      createElement('div', { className: 'rounded-lg border border-border p-4 bg-muted/30' },
        createElement('p', { className: 'text-sm text-muted-foreground' },
          'Kaji is not yet published to a package registry. Clone the source and import directly:',
        ),
      ),
      createElement(CodeBlock, { code: "git clone https://github.com/TekkadanPlays/kaji.git" }),
      createElement(CodeBlock, { code: "import { createEvent, Kind, RelayPool, signWithExtension } from 'kaji'\n\n// Connect to relays\nconst pool = new RelayPool()\npool.addRelay('wss://mycelium.social')\nawait pool.connectAll()\n\n// Create and sign a note via NIP-07 extension\nconst event = createEvent(Kind.Text, 'Hello from Kaji!')\nconst signed = await signWithExtension(event)\n\n// Publish to all connected relays\nawait pool.publish(signed)" }),
    ),

    // Architecture
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Architecture'),
      createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' },
        'Kaji is a flat library \u2014 no nested packages, no build plugins, no framework coupling. Every module is a single file that exports plain functions and classes. The only dependencies are @noble/curves (secp256k1 schnorr), @noble/hashes (SHA-256), and @scure/base (bech32).',
      ),
      createElement('div', { className: 'rounded-lg border border-border p-4 bg-muted/30' },
        createElement('p', { className: 'text-sm font-mono leading-relaxed whitespace-pre' },
          'kaji/\n  src/\n    index.ts      \u2190 barrel re-export\n    event.ts      \u2190 NIP-01 core\n    keys.ts       \u2190 key generation\n    sign.ts       \u2190 schnorr sign/verify\n    filter.ts     \u2190 fluent filter builder\n    relay.ts      \u2190 single WebSocket relay\n    pool.ts       \u2190 multi-relay pool\n    nip07.ts      \u2190 browser extension\n    nip10.ts      \u2190 threads\n    nip25.ts      \u2190 reactions\n    nip29.ts      \u2190 groups\n    nip55.ts      \u2190 android signer\n    nip66.ts      \u2190 relay discovery\n    utils.ts      \u2190 bech32, hex, helpers',
        ),
      ),
    ),

    // Dependencies
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Dependencies'),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-3' },
        ...[
          { name: '@noble/curves', ver: '^1.8.0', desc: 'secp256k1 schnorr signatures. Audited, zero-dep.' },
          { name: '@noble/hashes', ver: '^1.7.0', desc: 'SHA-256 hashing for event IDs. Audited, zero-dep.' },
          { name: '@scure/base', ver: '^1.2.0', desc: 'bech32 encoding for NIP-19 (npub, nsec, note, nprofile).' },
        ].map((dep) =>
          createElement('div', { key: dep.name, className: 'rounded-lg border border-border p-4' },
            createElement('p', { className: 'text-sm font-mono font-semibold' }, dep.name),
            createElement('p', { className: 'text-xs text-muted-foreground mt-0.5' }, dep.ver),
            createElement('p', { className: 'text-xs text-muted-foreground mt-1' }, dep.desc),
          ),
        ),
      ),
    ),

    // NIP coverage
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'NIP Coverage'),
      createElement('div', { className: 'rounded-lg border border-border overflow-hidden' },
        createElement('table', { className: 'w-full text-sm' },
          createElement('thead', null,
            createElement('tr', { className: 'border-b border-border bg-muted/30' },
              createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground w-20' }, 'NIP'),
              createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground' }, 'Description'),
              createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground w-24' }, 'Module'),
            ),
          ),
          createElement('tbody', null,
            ...([
              { nip: '01', desc: 'Events, serialization, validation, signing', mod: 'event' },
              { nip: '07', desc: 'window.nostr browser extension', mod: 'nip07' },
              { nip: '10', desc: 'Thread parsing (root/reply markers)', mod: 'nip10' },
              { nip: '19', desc: 'bech32 encoding (npub, nsec, note, nprofile)', mod: 'utils' },
              { nip: '25', desc: 'Reactions (like/dislike/emoji, dedup)', mod: 'nip25' },
              { nip: '29', desc: 'Relay-based groups (metadata, members)', mod: 'nip29' },
              { nip: '42', desc: 'Client authentication (AUTH challenge stub)', mod: 'relay' },
              { nip: '55', desc: 'Android signer integration (intent-based)', mod: 'nip55' },
              { nip: '65', desc: 'Relay list metadata (read/write relay lists)', mod: 'pool' },
              { nip: '66', desc: 'Relay discovery and monitoring', mod: 'nip66' },
            ]).map((row, i, arr) =>
              createElement('tr', {
                key: row.nip,
                className: i < arr.length - 1 ? 'border-b border-border/50' : '',
              },
                createElement('td', { className: 'px-3 py-2 font-mono text-xs' }, row.nip),
                createElement('td', { className: 'px-3 py-2' }, row.desc),
                createElement('td', { className: 'px-3 py-2 font-mono text-xs text-muted-foreground' }, row.mod),
              ),
            ),
          ),
        ),
      ),
    ),

    // Modules
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Modules'),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
        ...MODULES.map((mod) =>
          createElement(Link, {
            key: mod.name,
            to: mod.path,
            className: 'rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors block',
          },
            createElement('p', { className: 'text-sm font-mono font-semibold' }, mod.name),
            createElement('p', { className: 'text-xs text-muted-foreground mt-1' }, mod.desc),
          ),
        ),
      ),
    ),
  );
}
