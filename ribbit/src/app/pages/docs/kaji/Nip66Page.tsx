import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, CodeBlock } from '../_helpers';
import { Badge } from '../../../ui/Badge';

export function KajiNip66Page() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'nip66',
      description: 'Relay discovery and monitoring client. Query aggregated relay state from an rstate REST API instance.',
    }),
    createElement('div', { className: 'flex flex-wrap gap-2 mb-4' },
      createElement(Badge, null, 'NIP-66'),
      createElement(Badge, { variant: 'secondary' }, 'Relay Discovery'),
      createElement(Badge, { variant: 'secondary' }, 'REST Client'),
      createElement(Badge, { variant: 'outline' }, 'kaji/nip66'),
    ),

    // Overview
    createElement('div', { className: 'space-y-3' },
      createElement(SectionHeading, { id: 'overview' }, 'Overview'),
      createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' },
        'NIP-66 defines relay discovery and monitoring via kind-10166 (monitor announcements) and kind-30166 (relay observations). Kaji\'s nip66 module is a typed REST client for querying aggregated relay state from an rstate instance — the nostr.watch relay intelligence engine.',
      ),
      createElement('div', { className: 'rounded-lg border border-border p-4 bg-muted/30' },
        createElement('p', { className: 'text-sm font-medium mb-2' }, 'What rstate provides'),
        createElement('ul', { className: 'text-sm text-muted-foreground space-y-1 list-disc pl-5' },
          createElement('li', null, 'Aggregated relay metadata from multiple independent monitors'),
          createElement('li', null, 'Round-trip time (RTT) measurements for open, read, and write operations'),
          createElement('li', null, 'NIP support detection across the network'),
          createElement('li', null, 'Geographic location, country, and ISP data'),
          createElement('li', null, 'Software family and version tracking'),
          createElement('li', null, 'Online/offline status with configurable time windows'),
        ),
      ),
    ),

    // Quick start
    createElement('div', { className: 'space-y-3' },
      createElement(SectionHeading, { id: 'quickstart' }, 'Quick Start'),
      createElement(CodeBlock, { code: `import { Nip66Client, discoverRelays, discoverIndexerRelays } from 'kaji/nip66'

const client = new Nip66Client('https://mycelium.social/api/rstate')

// Find general-purpose relays sorted by latency
const relays = await discoverRelays(client, { nips: [1, 9, 11], maxLatency: 500 })

// Find NIP-50 search-capable indexer relays
const indexers = await discoverIndexerRelays(client, 10)` }),
    ),

    // Nip66Client
    createElement('div', { className: 'space-y-3' },
      createElement(SectionHeading, { id: 'client' }, 'Nip66Client'),
      createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' },
        'The main class for interacting with an rstate REST API. All methods return typed responses.',
      ),
      createElement(CodeBlock, { code: `const client = new Nip66Client(baseUrl: string, timeout?: number)
// baseUrl: rstate API root (e.g. 'https://mycelium.social/api/rstate')
// timeout: request timeout in ms (default: 10000)` }),
    ),

    // Methods
    createElement('div', { className: 'space-y-3' },
      createElement(SectionHeading, { id: 'methods' }, 'Methods'),

      createElement('div', { className: 'space-y-2' },
        ...[
          { sig: 'ping(): Promise<RelayHealthResponse>', desc: 'Health check. Returns API status, version, uptime, observation count, and cache stats.' },
          { sig: 'listRelays(opts?): Promise<RelayListResponse>', desc: 'Paginated relay list with optional sorting. Options: limit, offset, sortBy, sortOrder.' },
          { sig: 'getRelayState(relayUrl): Promise<RelayState | null>', desc: 'Get the full aggregated state for a single relay. Returns null if not found.' },
          { sig: 'searchRelays(filter, limit?, offset?): Promise<RelayListResponse>', desc: 'Search relays by filter criteria (NIPs, network, software, latency, support threshold).' },
          { sig: 'onlineRelays(opts?): Promise<{ relays: string[] }>', desc: 'Find currently online relays. Options: onlineWindowSeconds, network filter.' },
          { sig: 'nearbyRelays(lat, lon, radiusKm): Promise<RelayListResponse>', desc: 'Find relays near geographic coordinates within a radius.' },
          { sig: 'bySoftware(): Promise<Record<string, string[]>>', desc: 'Group all known relays by software family.' },
          { sig: 'byNip(): Promise<Record<number, { relays, supportRatio }>>', desc: 'Group relays by NIP support with support ratios.' },
          { sig: 'byCountry(): Promise<Record<string, string[]>>', desc: 'Group relays by country code.' },
          { sig: 'compareRelays(urls): Promise<{ relays: Array<RelayState | null> }>', desc: 'Compare multiple relays side-by-side.' },
        ].map((m) =>
          createElement('div', { key: m.sig, className: 'rounded-lg border border-border p-4' },
            createElement('p', { className: 'text-sm font-mono font-semibold' }, m.sig),
            createElement('p', { className: 'text-xs text-muted-foreground mt-1' }, m.desc),
          ),
        ),
      ),
    ),

    // Types
    createElement('div', { className: 'space-y-3' },
      createElement(SectionHeading, { id: 'types' }, 'Types'),
      createElement(CodeBlock, { code: `interface RelayState {
  relayUrl: string
  network?: AggregatedValue<'clearnet' | 'tor' | 'i2p' | 'hybrid'>
  software?: { family?: AggregatedValue<string>; version?: AggregatedValue<string> }
  rtt?: {
    open?: AggregatedValue<number> & { mad?: number }
    read?: AggregatedValue<number> & { mad?: number }
    write?: AggregatedValue<number> & { mad?: number }
  }
  nips?: { list: number[]; support: Record<number, number> }
  labels?: Record<string, string[]>
  geo?: { lat: number; lon: number; precision: number; geohash: string; support: number }
  country?: AggregatedValue<string>
  updated_at: number
  contributingAuthors: string[]
  observationCount: number
  lastSeenAt?: number
  lastOpenAt?: number
}

interface AggregatedValue<T> {
  value: T
  support: number
  sampleSize: number
  contributingAuthors: string[]
  lastUpdated: number
}

interface RelaySearchFilter {
  nips?: number[]
  network?: string[]
  software?: string
  maxLatency?: number
  minSupport?: number
}` }),
    ),

    // Convenience functions
    createElement('div', { className: 'space-y-3' },
      createElement(SectionHeading, { id: 'convenience' }, 'Convenience Functions'),

      createElement('div', { className: 'rounded-lg border border-border p-4' },
        createElement('p', { className: 'text-sm font-mono font-semibold' }, 'discoverIndexerRelays(client, limit?): Promise<RelayState[]>'),
        createElement('p', { className: 'text-xs text-muted-foreground mt-1' }, 'Find NIP-50 search-capable relays on clearnet with >50% support, sorted by lowest open RTT. Ideal for finding indexer relays for NIP-65 lookups.'),
      ),

      createElement('div', { className: 'rounded-lg border border-border p-4' },
        createElement('p', { className: 'text-sm font-mono font-semibold' }, 'discoverRelays(client, opts?): Promise<RelayState[]>'),
        createElement('p', { className: 'text-xs text-muted-foreground mt-1' }, 'Find general-purpose relays supporting specified NIPs (default: 1, 9, 11) on clearnet, sorted by RTT. Options: nips, maxLatency, limit.'),
      ),
    ),

    // Usage examples
    createElement('div', { className: 'space-y-3' },
      createElement(SectionHeading, { id: 'examples' }, 'Examples'),
      createElement(CodeBlock, { code: `import { Nip66Client } from 'kaji/nip66'

const client = new Nip66Client('https://mycelium.social/api/rstate')

// Health check
const health = await client.ping()
console.log(health.status, health.observationCount, 'observations')

// Search for relays supporting NIP-29 (groups) with low latency
const groupRelays = await client.searchRelays(
  { nips: [29], network: ['clearnet'], maxLatency: 300 },
  20
)

// Find relays near Tokyo
const nearby = await client.nearbyRelays(35.6762, 139.6503, 500)

// Compare specific relays
const comparison = await client.compareRelays([
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.nostr.band',
])

// Group by software to see relay ecosystem
const software = await client.bySoftware()
// { 'strfry': ['wss://...', ...], 'nostream': ['wss://...', ...] }` }),
    ),
  );
}
