import { createElement } from 'inferno-create-element';
import { PageHeader, CodeBlock, PropTable } from '../_helpers';

export function KajiNip10Page() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'nip10',
      description: 'NIP-10: Thread parsing. Extracts root/reply markers from e tags with positional fallback for legacy events.',
    }),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'ThreadReference'),
      createElement(CodeBlock, { code: "interface ThreadReference {\n  rootId: string | null      // root event of the thread\n  rootRelay: string          // relay hint for root\n  rootPubkey: string         // pubkey hint for root\n  replyId: string | null     // direct parent being replied to\n  replyRelay: string         // relay hint for reply\n  replyPubkey: string        // pubkey hint for reply\n  mentionIds: string[]       // mentioned event IDs (unmarked e tags)\n}" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'parseThreadTags'),
      createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' },
        'Parses e tags from an event to extract thread structure. Supports both the preferred marked format (root/reply markers in tag[3]) and the deprecated positional format (first e tag = root, last = reply, middle = mentions).',
      ),
      createElement(CodeBlock, { code: "import { parseThreadTags } from 'kaji'\n\nconst thread = parseThreadTags(event)\nif (thread.rootId) {\n  console.log('Thread root:', thread.rootId)\n  console.log('Replying to:', thread.replyId)\n  console.log('Mentions:', thread.mentionIds)\n}" }),
      createElement('div', { className: 'rounded-lg border border-border p-4 bg-muted/30' },
        createElement('p', { className: 'text-sm font-medium mb-2' }, 'Marker format (preferred)'),
        createElement('p', { className: 'text-sm font-mono text-muted-foreground' },
          '["e", "<root-id>", "<relay>", "root", "<pubkey>"]\n["e", "<reply-id>", "<relay>", "reply", "<pubkey>"]',
        ),
      ),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'buildReplyTags'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Builds the correct e and p tags for replying to an event. Handles both root replies and nested replies. Automatically collects p tags for notification.',
      ),
      createElement(CodeBlock, { code: "import { buildReplyTags, createEvent, Kind } from 'kaji'\n\nconst tags = buildReplyTags(rootEvent, parentEvent, 'wss://mycelium.social')\nconst reply = createEvent(Kind.Text, 'Great post!', tags)" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Helpers'),
      createElement(CodeBlock, { code: "import { isReply, isRootNote } from 'kaji'\n\nisReply(event)     // true if event has any e tags\nisRootNote(event)  // true if event has no e tags" }),
    ),

    createElement(PropTable, { rows: [
      { prop: 'parseThreadTags(event)', type: 'ThreadReference', default: 'Extract thread structure' },
      { prop: 'buildReplyTags(root, parent, relay?)', type: 'NostrTag[]', default: 'Build reply e/p tags' },
      { prop: 'isReply(event)', type: 'boolean', default: 'Has e tags?' },
      { prop: 'isRootNote(event)', type: 'boolean', default: 'No e tags?' },
    ]}),
  );
}
