import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Badge } from '../../../ui/Badge';
import { PageHeader } from '../_helpers';

export function Nos2xFrogIntro() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'nos2x-frog',
      description: 'A Nostr signer browser extension. NIP-07 compatible, built with InfernoJS.',
    }),
    createElement('div', { className: 'flex flex-wrap gap-2 mb-6' },
      createElement(Badge, null, 'Nostr'),
      createElement(Badge, { variant: 'secondary' }, 'NIP-07'),
      createElement(Badge, { variant: 'secondary' }, 'InfernoJS'),
      createElement(Badge, { variant: 'secondary' }, 'Browser Extension'),
      createElement(Badge, { variant: 'outline' }, 'Stable'),
    ),
    createElement('div', { className: 'flex gap-3 mb-8' },
      createElement('a', {
        href: 'https://github.com/TekkadanPlays/nos2x-frog',
        target: '_blank',
        rel: 'noopener',
        className: 'inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors',
      }, 'GitHub \u2192'),
      createElement(Link, {
        to: '/docs',
        className: 'inline-flex items-center gap-2 rounded-md border border-input px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
      }, '\u2190 All docs'),
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
