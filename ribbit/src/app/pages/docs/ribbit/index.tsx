import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Badge } from '../../../ui/Badge';
import { PageHeader } from '../_helpers';

export function RibbitIntro() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Ribbit',
      description: 'A Nostr social client built with InfernoJS and Hono. Fast, lightweight, and decentralized.',
    }),
    createElement('div', { className: 'flex flex-wrap gap-2 mb-6' },
      createElement(Badge, null, 'Nostr'),
      createElement(Badge, { variant: 'secondary' }, 'InfernoJS'),
      createElement(Badge, { variant: 'secondary' }, 'Hono'),
      createElement(Badge, { variant: 'secondary' }, 'Bun'),
      createElement(Badge, { variant: 'outline' }, 'Beta'),
    ),
    createElement('div', { className: 'flex gap-3 mb-8' },
      createElement('a', {
        href: 'https://github.com/TekkadanPlays/ribbit.network',
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
      createElement('h2', { className: 'text-xl font-bold tracking-tight' }, 'Stack'),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
        ...[
          { title: 'Runtime', desc: 'Bun \u2014 fast JavaScript runtime with built-in bundler and test runner.' },
          { title: 'Frontend', desc: 'InfernoJS \u2014 fastest virtual DOM library. No React dependency.' },
          { title: 'Backend', desc: 'Hono \u2014 ultrafast web framework. Serves SPA + API routes.' },
          { title: 'Protocol', desc: 'Nostr \u2014 decentralized social protocol. NIP-01, NIP-07, NIP-10, NIP-25, NIP-29.' },
          { title: 'Styling', desc: 'Tailwind CSS v4 + Blazecn component library.' },
          { title: 'Relay', desc: 'strfry on mycelium.social \u2014 high-performance C++ relay.' },
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
        'Full documentation coming soon. Ribbit is currently in beta.',
      ),
    ),
  );
}
