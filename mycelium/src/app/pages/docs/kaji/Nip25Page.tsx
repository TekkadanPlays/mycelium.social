import { createElement } from 'inferno-create-element';
import { PageHeader, CodeBlock, PropTable } from '../_helpers';

export function KajiNip25Page() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'nip25',
      description: 'NIP-25: Reactions. Like/dislike/emoji classification, per-pubkey deduplication, and reaction summaries.',
    }),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'ReactionSummary'),
      createElement(CodeBlock, { code: "interface ReactionSummary {\n  likes: number               // count of '+' or '' reactions\n  dislikes: number            // count of '-' reactions\n  emojis: Map<string, number> // emoji \u2192 count\n  total: number               // unique reactors (after dedup)\n  score: number               // likes - dislikes\n  userReaction: string | null // current user's reaction, or null\n}" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'getReactionType'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Classifies a reaction\'s content string into like, dislike, or emoji.',
      ),
      createElement(CodeBlock, { code: "import { getReactionType } from 'kaji'\n\ngetReactionType('+')   // 'like'\ngetReactionType('')    // 'like'\ngetReactionType('-')   // 'dislike'\ngetReactionType('\uD83D\uDD25')  // 'emoji'" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'buildReactionTags'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Builds the e, p, and k tags for a kind-7 reaction event targeting another event.',
      ),
      createElement(CodeBlock, { code: "import { buildReactionTags, createEvent, Kind } from 'kaji'\n\nconst tags = buildReactionTags(targetEvent, 'wss://mycelium.social')\nconst reaction = createEvent(Kind.Reaction, '+', tags)\n// tags: [['e', id, relay, pubkey], ['p', pubkey, relay], ['k', '1']]" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'summarizeReactions'),
      createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' },
        'Takes an array of kind-7 events and produces a ReactionSummary. Deduplicates by pubkey (keeps the latest reaction per user). Optionally pass the current user\'s pubkey to populate userReaction.',
      ),
      createElement(CodeBlock, { code: "import { summarizeReactions } from 'kaji'\n\nconst summary = summarizeReactions(reactionEvents, myPubkey)\nconsole.log(summary.likes, summary.dislikes, summary.score)\nif (summary.userReaction) {\n  console.log('You reacted with:', summary.userReaction)\n}" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'getReactionTarget'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Extracts the target event ID from a reaction. Per NIP-25, the last e tag is the target.',
      ),
      createElement(CodeBlock, { code: "import { getReactionTarget } from 'kaji'\n\nconst targetId = getReactionTarget(reactionEvent)\n// '3bf0c63f...' or null" }),
    ),

    createElement(PropTable, { rows: [
      { prop: 'getReactionType(content)', type: 'ReactionType', default: "'like' | 'dislike' | 'emoji'" },
      { prop: 'buildReactionTags(target, relay?)', type: 'NostrTag[]', default: 'e + p + k tags' },
      { prop: 'summarizeReactions(events, pubkey?)', type: 'ReactionSummary', default: 'Deduped summary' },
      { prop: 'getReactionTarget(event)', type: 'string | null', default: 'Last e tag value' },
    ]}),
  );
}
