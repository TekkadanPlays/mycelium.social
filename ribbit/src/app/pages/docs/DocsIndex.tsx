import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Badge } from '../../ui/Badge';

interface ProjectCard {
  icon: string;
  title: string;
  description: string;
  path: string;
  tags: string[];
  status: 'stable' | 'beta' | 'wip';
}

const PROJECTS: ProjectCard[] = [
  {
    icon: '\u26A1',
    title: 'Blazecn',
    description: 'A shadcn/ui-compatible component library for InfernoJS. Same design tokens, same class strings, zero React dependency.',
    path: '/docs/blazecn',
    tags: ['InfernoJS', 'Tailwind v4', 'Components'],
    status: 'stable',
  },
  {
    icon: '\uD83D\uDC38',
    title: 'Ribbit',
    description: 'A Nostr social client built with InfernoJS and Hono. Fast, lightweight, and decentralized.',
    path: '/docs/ribbit',
    tags: ['Nostr', 'InfernoJS', 'Hono', 'Bun'],
    status: 'beta',
  },
  {
    icon: '\uD83D\uDD25',
    title: 'Kaji',
    description: 'Build tooling and development utilities for the ribbit.network ecosystem.',
    path: '/docs/kaji',
    tags: ['Build Tools', 'Bun'],
    status: 'wip',
  },
  {
    icon: '\uD83D\uDCF1',
    title: 'Ribbit Android',
    description: 'Native Android client with Jetpack Compose, Material Design 3, tabbed relay manager, NIP-11 caching, and wallet zaps.',
    path: '/docs/ribbit-android',
    tags: ['Android', 'Kotlin', 'Compose', 'NIP-55'],
    status: 'beta',
  },
  {
    icon: '\uD83D\uDD10',
    title: 'nos2x-frog',
    description: 'A Nostr signer browser extension. NIP-07 compatible, built with InfernoJS.',
    path: '/docs/nos2x-frog',
    tags: ['Nostr', 'NIP-07', 'Extension', 'InfernoJS'],
    status: 'stable',
  },
  {
    icon: '\uD83D\uDCDC',
    title: 'NIPs',
    description: 'Nostr Implementation Possibilities. Categorical reorganization of the protocol specification.',
    path: '/docs/nips',
    tags: ['Nostr', 'Protocol', 'Specification'],
    status: 'wip',
  },
];

const statusColors: Record<string, string> = {
  stable: 'default',
  beta: 'secondary',
  wip: 'outline',
};

export function DocsIndex() {
  return createElement('div', { className: 'space-y-10' },
    // Hero
    createElement('div', null,
      createElement('h1', { className: 'text-3xl font-bold tracking-tight mb-3' }, 'ribbit.network'),
      createElement('p', { className: 'text-muted-foreground max-w-2xl text-lg' },
        'Documentation for the ribbit.network stack. Explore the tools, libraries, and protocols that power a decentralized social experience.',
      ),
    ),

    // Project grid
    createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
      ...PROJECTS.map((project) =>
        createElement(Link, {
          key: project.title,
          to: project.path,
          className: 'group block rounded-lg border border-border p-5 transition-colors hover:border-primary/30 hover:bg-accent/30',
        },
          createElement('div', { className: 'flex items-start justify-between mb-3' },
            createElement('div', { className: 'flex items-center gap-2' },
              createElement('span', { className: 'text-xl' }, project.icon),
              createElement('h2', { className: 'text-lg font-semibold group-hover:text-primary transition-colors' }, project.title),
            ),
            createElement(Badge, { variant: (statusColors[project.status] || 'secondary') as any },
              project.status,
            ),
          ),
          createElement('p', { className: 'text-sm text-muted-foreground mb-3' }, project.description),
          createElement('div', { className: 'flex flex-wrap gap-1.5' },
            ...project.tags.map((tag) =>
              createElement(Badge, { key: tag, variant: 'outline', className: 'text-[10px]' }, tag),
            ),
          ),
        ),
      ),
    ),

    // Footer
    createElement('div', { className: 'pt-4 text-center' },
      createElement('p', { className: 'text-xs text-muted-foreground' },
        'ribbit.network \u00B7 MIT License \u00B7 Built with InfernoJS + Tailwind CSS v4',
      ),
    ),
  );
}
