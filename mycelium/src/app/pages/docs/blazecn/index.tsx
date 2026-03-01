import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Badge } from '../../../ui/Badge';

export function BlazecnIntro() {
  return createElement('div', { className: 'space-y-8' },
    // Hero
    createElement('div', null,
      createElement('div', { className: 'flex items-center gap-3 mb-2' },
        createElement('span', { className: 'text-3xl' }, '\u26A1'),
        createElement('h1', { className: 'text-3xl font-bold tracking-tight' }, 'Blazecn'),
      ),
      createElement('p', { className: 'text-muted-foreground max-w-2xl mb-4' },
        'A component library for InfernoJS. Beautiful design tokens, consistent class strings, zero React dependency. Built for speed.',
      ),
      createElement('div', { className: 'flex flex-wrap gap-2 mb-4' },
        createElement(Badge, null, 'InfernoJS'),
        createElement(Badge, { variant: 'secondary' }, 'Tailwind CSS v4'),
        createElement(Badge, { variant: 'secondary' }, 'class-variance-authority'),
        createElement(Badge, { variant: 'outline' }, 'MIT License'),
      ),
    ),

    // Overview
    createElement('div', { className: 'space-y-4' },
      createElement('h2', { className: 'text-xl font-bold tracking-tight' }, 'Overview'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Blazecn follows a simple philosophy \u2014 you own the code. Copy the components you need into your project. Every component is a single file with only cn() as a local dependency.',
      ),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4' },
        ...[
          { title: '49 Components', desc: 'Buttons, forms, overlays, data display, navigation, and layout primitives.' },
          { title: 'InfernoJS Native', desc: 'Pure createElement calls. No JSX runtime, no React, no hooks. Class components for state.' },
          { title: 'Tailwind v4', desc: 'OKLCH design tokens, CSS custom properties, @theme inline bridge. Light + dark themes.' },
        ].map((item) =>
          createElement('div', {
            key: item.title,
            className: 'rounded-lg border border-border p-4',
          },
            createElement('p', { className: 'text-sm font-semibold mb-1' }, item.title),
            createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
          ),
        ),
      ),
    ),

    // Why Blazecn
    createElement('div', { className: 'space-y-4' },
      createElement('h2', { className: 'text-xl font-bold tracking-tight' }, 'Why Blazecn?'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Most component libraries are built for React and carry its entire runtime. Blazecn takes a different approach.',
      ),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
        ...[
          { title: 'No React Runtime', desc: 'InfernoJS is 9x faster than React in benchmarks and ships a fraction of the bundle size. Blazecn inherits that speed.' },
          { title: 'No Radix Dependency', desc: 'React-based libraries like shadcn/ui depend on Radix primitives. Blazecn implements accessibility patterns directly \u2014 no heavy abstraction layer.' },
          { title: 'Single-File Components', desc: 'Every component is one file with one dependency: cn(). No barrel exports, no deep import chains, no tree-shaking surprises.' },
          { title: 'Pure createElement', desc: 'No JSX compilation step required. Works with any bundler. No hooks, no context providers, no React-specific patterns.' },
          { title: 'OKLCH Color System', desc: 'Perceptually uniform colors via oklch() instead of hex/hsl. Consistent contrast ratios across light and dark themes automatically.' },
          { title: 'Tailwind CSS v4 Native', desc: 'Built for Tailwind v4 from day one \u2014 @theme inline, CSS custom properties, @custom-variant. No PostCSS plugin hacks.' },
        ].map((item) =>
          createElement('div', {
            key: item.title,
            className: 'rounded-lg border border-border p-4',
          },
            createElement('p', { className: 'text-sm font-semibold mb-1' }, item.title),
            createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
          ),
        ),
      ),
    ),

    // Get Started
    createElement('div', { className: 'space-y-6' },
      createElement('h2', { className: 'text-xl font-bold tracking-tight' }, 'Get Started'),

      // Examples
      createElement('div', { className: 'space-y-1' },
        createElement('h3', { className: 'text-sm font-semibold' }, 'Examples'),
        createElement('p', { className: 'text-sm text-muted-foreground' },
          'Interactive demos of blazecn components in action. Dashboard layouts, card showcases, authentication flows, and task management UIs. ',
          createElement(Link, { to: '/examples', className: 'text-primary hover:underline' }, 'View examples \u2192'),
        ),
      ),

      // Blocks
      createElement('div', { className: 'space-y-1' },
        createElement('h3', { className: 'text-sm font-semibold' }, 'Blocks'),
        createElement('p', { className: 'text-sm text-muted-foreground' },
          'Pre-built page layouts composed from blazecn components. Copy and paste into your apps. ',
          createElement(Link, { to: '/blocks', className: 'text-primary hover:underline' }, 'View blocks \u2192'),
        ),
        createElement('div', { className: 'mt-2 flex items-start gap-2 rounded-md border border-border bg-muted/50 px-3 py-2' },
          createElement('svg', {
            className: 'size-4 text-muted-foreground shrink-0 mt-0.5',
            viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
            'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
          }, createElement('circle', { cx: '12', cy: '12', r: '10' }), createElement('path', { d: 'M12 16v-4' }), createElement('path', { d: 'M12 8h.01' })),
          createElement('p', { className: 'text-xs text-muted-foreground' },
            'Blocks are best viewed full-width \u2014 the showcase page renders each block at its intended size with no sidebar constraints.',
          ),
        ),
      ),
    ),

    // Modules
    createElement('div', { className: 'space-y-4' },
      createElement('h2', { className: 'text-xl font-bold tracking-tight' }, 'Modules'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Full application modules built with blazecn and InfernoJS. Clone them, customize them, ship them.',
      ),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4' },
        ...[
          { title: 'Marketplace', desc: 'A NIP-15 decentralized marketplace with product browsing, stall pages, cart, and category filtering.', path: '/run' },
        ].map((item) =>
          createElement(Link, {
            key: item.title,
            to: item.path,
            className: 'rounded-lg border border-border p-4 transition-colors hover:border-primary/30 hover:bg-primary/5 group',
          },
            createElement('p', { className: 'text-sm font-semibold mb-1 group-hover:text-primary transition-colors' }, item.title),
            createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
          ),
        ),
      ),
    ),
  );
}
