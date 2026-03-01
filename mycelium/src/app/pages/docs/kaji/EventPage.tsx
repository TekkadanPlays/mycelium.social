import { createElement } from 'inferno-create-element';
import { PageHeader, CodeBlock, PropTable } from '../_helpers';

export function KajiEventPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'event',
      description: 'NIP-01 core: event creation, serialization, ID computation, validation, and signing. Also exports the Kind enum.',
    }),

    // Types
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Types'),
      createElement(CodeBlock, { code: "type NostrTag = string[]\n\ninterface UnsignedEvent {\n  pubkey: string      // 64-char hex public key\n  created_at: number  // unix timestamp (seconds)\n  kind: number        // event kind\n  tags: NostrTag[]    // array of tag arrays\n  content: string     // event content\n}\n\ninterface NostrEvent extends UnsignedEvent {\n  id: string   // 64-char hex SHA-256 of serialized event\n  sig: string  // 128-char hex schnorr signature\n}" }),
    ),

    // createEvent
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'createEvent'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Creates an unsigned event template with the current timestamp. The pubkey is left empty \u2014 it gets filled by the signer (NIP-07 extension or finalizeEvent).',
      ),
      createElement(CodeBlock, { code: "import { createEvent, Kind } from 'kaji'\n\nconst note = createEvent(Kind.Text, 'Hello world!')\nconst reply = createEvent(Kind.Text, 'Nice post!', [\n  ['e', parentId, '', 'root'],\n  ['p', parentPubkey],\n])" }),
      createElement(PropTable, { rows: [
        { prop: 'kind', type: 'number', default: '\u2014' },
        { prop: 'content', type: 'string', default: '\u2014' },
        { prop: 'tags', type: 'NostrTag[]', default: '[]' },
        { prop: 'pubkey', type: 'string', default: "''" },
      ]}),
    ),

    // serializeEvent / computeEventId
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'serializeEvent / computeEventId'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'serializeEvent produces the NIP-01 canonical JSON array [0, pubkey, created_at, kind, tags, content]. computeEventId returns the SHA-256 hex hash of that serialization.',
      ),
      createElement(CodeBlock, { code: "import { serializeEvent, computeEventId } from 'kaji'\n\nconst json = serializeEvent(event)  // '[0,\"abc...\",1234,1,[],\"hello\"]'\nconst id = computeEventId(event)    // '3bf0c63...' (64-char hex)" }),
    ),

    // finalizeEvent
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'finalizeEvent'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Signs an event with a private key (hex). For browser apps, use signWithExtension from nip07 instead.',
      ),
      createElement(CodeBlock, { code: "import { finalizeEvent } from 'kaji'\n\nconst signed = finalizeEvent(unsigned, privateKeyHex)\n// signed.id and signed.sig are now set" }),
    ),

    // validateEvent
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'validateEvent'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Verifies that an event\'s ID matches its content and that the signature is valid for the pubkey.',
      ),
      createElement(CodeBlock, { code: "import { validateEvent } from 'kaji'\n\nif (validateEvent(event)) {\n  // event.id and event.sig are correct\n}" }),
    ),

    // Kind enum
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Kind'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Typed constant object for common event kinds. Use Kind.Text instead of magic number 1.',
      ),
      createElement(CodeBlock, { code: "const Kind = {\n  Metadata: 0,\n  Text: 1,\n  RecommendRelay: 2,\n  Contacts: 3,\n  EncryptedDM: 4,\n  EventDeletion: 5,\n  Repost: 6,\n  Reaction: 7,\n  ChannelCreation: 40,\n  ChannelMetadata: 41,\n  ChannelMessage: 42,\n  ChannelHideMessage: 43,\n  ChannelMuteUser: 44,\n  Comment: 1111,\n  // NIP-29 group kinds: 9000-9022, 39000-39003\n  GroupPutUser: 9000,\n  GroupRemoveUser: 9001,\n  // ... etc\n} as const" }),
    ),
  );
}
