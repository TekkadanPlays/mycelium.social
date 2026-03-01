import { createElement } from 'inferno-create-element';
import { PageHeader, CodeBlock, PropTable } from '../_helpers';

export function KajiFilterPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'filter',
      description: 'Fluent filter builder for constructing NIP-01 subscription filters.',
    }),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'NostrFilter'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'The raw filter interface matching the NIP-01 spec. You can use this directly or build one with the fluent API.',
      ),
      createElement(CodeBlock, { code: "interface NostrFilter {\n  ids?: string[]       // event IDs\n  authors?: string[]   // pubkey hex strings\n  kinds?: number[]     // event kinds\n  since?: number       // unix timestamp lower bound\n  until?: number       // unix timestamp upper bound\n  limit?: number       // max events to return\n  [key: `#${string}`]: string[] | undefined  // tag filters (#e, #p, #t, etc)\n}" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'FilterBuilder'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Fluent API for building filters. Every method returns this for chaining. Call .build() to get the final NostrFilter object.',
      ),
      createElement(CodeBlock, { code: "import { filter, Kind } from 'kaji'\n\n// Get latest 50 text notes from two authors\nconst f = filter()\n  .kinds(Kind.Text)\n  .authors('abc...', 'def...')\n  .limit(50)\n  .build()\n\n// Get reactions to a specific event\nconst reactions = filter()\n  .kinds(Kind.Reaction)\n  .events('eventId123...')\n  .build()\n\n// Get group messages with #h tag\nconst groupMsgs = filter()\n  .kinds(9, 11)\n  .group('my-group-id')\n  .since(Math.floor(Date.now() / 1000) - 3600)\n  .build()\n\n// Arbitrary tag filter\nconst tagged = filter()\n  .kinds(Kind.Text)\n  .tag('t', 'nostr', 'bitcoin')\n  .build()" }),
    ),

    createElement(PropTable, { rows: [
      { prop: '.ids(...ids)', type: 'FilterBuilder', default: 'Add event ID filters' },
      { prop: '.authors(...hex)', type: 'FilterBuilder', default: 'Add author pubkey filters' },
      { prop: '.kinds(...kinds)', type: 'FilterBuilder', default: 'Add kind filters' },
      { prop: '.since(ts)', type: 'FilterBuilder', default: 'Set lower bound timestamp' },
      { prop: '.until(ts)', type: 'FilterBuilder', default: 'Set upper bound timestamp' },
      { prop: '.limit(n)', type: 'FilterBuilder', default: 'Set max results' },
      { prop: '.tag(letter, ...vals)', type: 'FilterBuilder', default: 'Add #<letter> tag filter' },
      { prop: '.events(...ids)', type: 'FilterBuilder', default: 'Shorthand for .tag("e", ...)' },
      { prop: '.pubkeys(...hex)', type: 'FilterBuilder', default: 'Shorthand for .tag("p", ...)' },
      { prop: '.group(id)', type: 'FilterBuilder', default: 'Shorthand for .tag("h", id)' },
      { prop: '.build()', type: 'NostrFilter', default: 'Returns the built filter' },
    ]}),
  );
}
