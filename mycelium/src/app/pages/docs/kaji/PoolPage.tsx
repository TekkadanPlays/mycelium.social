import { createElement } from 'inferno-create-element';
import { PageHeader, CodeBlock, PropTable } from '../_helpers';

export function KajiPoolPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'pool',
      description: 'Multi-relay pool with cross-relay event deduplication and parallel publish.',
    }),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'RelayPool class'),
      createElement(CodeBlock, { code: "import { RelayPool } from 'kaji'\n\nconst pool = new RelayPool()\npool.addRelay('wss://mycelium.social')\npool.addRelay('wss://relay.damus.io')\nawait pool.connectAll()\n\n// Subscribe across all relays (events are deduped)\nconst sub = pool.subscribe(\n  [{ kinds: [1], limit: 20 }],\n  (event, relay) => {\n    console.log(`Got event ${event.id} from ${relay.url}`)\n  },\n  (relay) => {\n    console.log(`EOSE from ${relay.url}`)\n  },\n)\n\n// Unsubscribe from all relays\nsub.unsubscribe()\n\n// Publish to all relays in parallel\nconst results = await pool.publish(signedEvent)\n// Map<string, { accepted: boolean, message: string }>\nfor (const [url, result] of results) {\n  console.log(url, result.accepted)\n}" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Deduplication'),
      createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' },
        'The pool tracks seen event IDs in a Set. When the same event arrives from multiple relays, only the first is passed to your onEvent callback. The set auto-prunes at 10,000 entries (drops the oldest half).',
      ),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Relay Management'),
      createElement(CodeBlock, { code: "// Add a relay (returns the Relay instance)\nconst relay = pool.addRelay('wss://nos.lol')\n\n// Get a relay by URL\nconst r = pool.getRelay('wss://nos.lol')\n\n// Remove and disconnect a relay\npool.removeRelay('wss://nos.lol')\n\n// Get all relays\npool.allRelays // Relay[]\n\n// Get status map\npool.getStatus() // Map<string, RelayStatus>\n\n// Disconnect everything\npool.disconnectAll()" }),
    ),

    createElement(PropTable, { rows: [
      { prop: 'addRelay(url)', type: 'Relay', default: 'Adds and returns relay (idempotent)' },
      { prop: 'removeRelay(url)', type: 'void', default: 'Disconnects and removes' },
      { prop: 'getRelay(url)', type: 'Relay | undefined', default: '\u2014' },
      { prop: 'allRelays', type: 'Relay[]', default: 'All managed relays' },
      { prop: 'connectAll()', type: 'Promise<void>', default: 'Connects all relays in parallel' },
      { prop: 'disconnectAll()', type: 'void', default: '\u2014' },
      { prop: 'subscribe(filters, onEvent, onEose?)', type: 'PoolSubscription', default: 'Cross-relay sub with dedup' },
      { prop: 'publish(event)', type: 'Promise<Map>', default: 'Parallel publish to all relays' },
      { prop: 'getStatus()', type: 'Map<string, RelayStatus>', default: '\u2014' },
    ]}),
  );
}
