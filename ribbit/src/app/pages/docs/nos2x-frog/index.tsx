import { createElement } from 'inferno-create-element';
import { Badge } from '../../../ui/Badge';
import { PageHeader } from '../_helpers';

export function Nos2xFrogIntro() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'nos2x-frog',
      description: 'A Nostr signer browser extension. NIP-07 compatible, built with InfernoJS.',
    }),
    createElement('div', { className: 'flex flex-wrap gap-2 mb-4' },
      createElement(Badge, null, 'Nostr'),
      createElement(Badge, { variant: 'secondary' }, 'NIP-07'),
      createElement(Badge, { variant: 'secondary' }, 'InfernoJS'),
      createElement(Badge, { variant: 'secondary' }, 'Browser Extension'),
      createElement(Badge, { variant: 'outline' }, 'Stable'),
    ),
    createElement('div', { className: 'space-y-4' },
      createElement('h2', { className: 'text-xl font-bold tracking-tight' }, 'Overview'),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
        ...[
          { title: 'NIP-07 Signer', desc: 'Signs Nostr events in the browser. Compatible with all NIP-07 clients.' },
          { title: 'Key Management', desc: 'Multiple profiles with secure key storage. Import, export, and generate keys.' },
          { title: 'InfernoJS UI', desc: 'Migrated from React to InfernoJS. Flat, minimal design with Prompt font.' },
          { title: 'Permission System', desc: 'Per-site permissions with activity logging. Approve or deny signing requests.' },
        ].map((item) =>
          createElement('div', { key: item.title, className: 'rounded-lg border border-border p-4' },
            createElement('p', { className: 'text-sm font-semibold mb-1' }, item.title),
            createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
          ),
        ),
      ),
    ),

    createElement('div', { className: 'rounded-lg border border-border p-6 text-center' },
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Full documentation coming soon.',
      ),
    ),
  );
}
