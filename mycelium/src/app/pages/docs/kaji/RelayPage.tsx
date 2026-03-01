import { createElement } from 'inferno-create-element';
import { PageHeader, CodeBlock, PropTable } from '../_helpers';

export function KajiRelayPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'relay',
      description: 'Single WebSocket relay connection with auto-reconnect, subscription management, and publish with OK tracking.',
    }),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Relay class'),
      createElement(CodeBlock, { code: "import { Relay } from 'kaji'\n\nconst relay = new Relay('wss://mycelium.social')\nawait relay.connect()\n\n// Subscribe\nconst subId = relay.subscribe(\n  [{ kinds: [1], limit: 10 }],\n  (event) => console.log('got event:', event.id),\n  () => console.log('EOSE'),\n)\n\n// Unsubscribe\nrelay.unsubscribe(subId)\n\n// Publish\nconst result = await relay.publish(signedEvent)\n// { accepted: true, message: '' }\n\n// Disconnect\nrelay.disconnect()" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Connection Lifecycle'),
      createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' },
        'On connect, the relay opens a WebSocket and flushes any messages queued while disconnected. Existing subscriptions are automatically re-sent on reconnect. If the connection drops, exponential backoff reconnect kicks in (1s \u2192 2s \u2192 4s \u2192 ... up to 60s, max 5 attempts).',
      ),
      createElement(CodeBlock, { code: "// Status changes\nconst unsub = relay.onStatusChange((status) => {\n  // 'connecting' | 'connected' | 'disconnected' | 'error'\n  console.log(relay.url, status)\n})\n\n// Current status\nrelay.status // 'connected'" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Message Handling'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'The relay parses all NIP-01 message types:',
      ),
      createElement('div', { className: 'rounded-lg border border-border overflow-hidden' },
        createElement('table', { className: 'w-full text-sm' },
          createElement('thead', null,
            createElement('tr', { className: 'border-b border-border bg-muted/30' },
              createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground w-20' }, 'Type'),
              createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground' }, 'Handling'),
            ),
          ),
          createElement('tbody', null,
            ...([
              { type: 'EVENT', desc: 'Dispatched to the matching subscription\'s onEvent callback' },
              { type: 'EOSE', desc: 'Triggers the subscription\'s onEose callback' },
              { type: 'OK', desc: 'Resolves the publish() promise with { accepted, message }' },
              { type: 'NOTICE', desc: 'Logged to console.warn' },
              { type: 'CLOSED', desc: 'Triggers onClosed callback, removes subscription' },
              { type: 'AUTH', desc: 'NIP-42 challenge \u2014 stub present, full impl in mycelium\'s relay.ts' },
            ]).map((row, i) =>
              createElement('tr', {
                key: row.type,
                className: i < 5 ? 'border-b border-border/50' : '',
              },
                createElement('td', { className: 'px-3 py-2 font-mono text-xs' }, row.type),
                createElement('td', { className: 'px-3 py-2 text-muted-foreground' }, row.desc),
              ),
            ),
          ),
        ),
      ),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Publish'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'publish() returns a Promise that resolves when the relay sends an OK message, or rejects after a 10-second timeout.',
      ),
      createElement(CodeBlock, { code: "const { accepted, message } = await relay.publish(signedEvent)\nif (!accepted) {\n  console.error('Relay rejected:', message)\n}" }),
    ),

    createElement(PropTable, { rows: [
      { prop: 'url', type: 'string (readonly)', default: 'Normalized relay URL' },
      { prop: 'status', type: 'RelayStatus', default: "'disconnected'" },
      { prop: 'activeSubscriptions', type: 'number', default: 'Count of active subs' },
      { prop: 'connect()', type: 'Promise<void>', default: '\u2014' },
      { prop: 'disconnect()', type: 'void', default: '\u2014' },
      { prop: 'subscribe(filters, onEvent, onEose?, onClosed?)', type: 'string', default: 'Returns sub ID' },
      { prop: 'unsubscribe(subId)', type: 'void', default: '\u2014' },
      { prop: 'publish(event)', type: 'Promise<{accepted, message}>', default: '\u2014' },
      { prop: 'onStatusChange(listener)', type: '() => void', default: 'Returns unsub fn' },
    ]}),
  );
}
