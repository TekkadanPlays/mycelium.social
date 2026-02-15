import { createElement } from 'inferno-create-element';
import { PageHeader, CodeBlock } from '../_helpers';

const TOKENS = [
  { name: 'background', color: 'bg-background', label: 'Background' },
  { name: 'card', color: 'bg-card', label: 'Card' },
  { name: 'primary', color: 'bg-primary', label: 'Primary' },
  { name: 'secondary', color: 'bg-secondary', label: 'Secondary' },
  { name: 'muted', color: 'bg-muted', label: 'Muted' },
  { name: 'accent', color: 'bg-accent', label: 'Accent' },
  { name: 'destructive', color: 'bg-destructive', label: 'Destructive' },
  { name: 'border', color: 'bg-border', label: 'Border' },
];

export function TokensPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Design Tokens',
      description: 'Blazecn uses the same semantic token pairs as shadcn/ui, defined as CSS custom properties in your Tailwind config.',
    }),

    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
      ...TOKENS.map((token) =>
        createElement('div', {
          key: token.name,
          className: 'flex items-center gap-3 rounded-lg border border-border p-3',
        },
          createElement('div', { className: `w-10 h-10 rounded-md ${token.color} border border-border shrink-0` }),
          createElement('div', null,
            createElement('p', { className: 'text-sm font-medium' }, token.label),
            createElement('p', { className: 'text-xs font-mono text-muted-foreground' }, `--${token.name}`),
          ),
        ),
      ),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h3', { className: 'text-sm font-semibold' }, 'Token Convention'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Every semantic color has a foreground pair. For example, --primary is the background and --primary-foreground is the text color to use on that background.',
      ),
      createElement(CodeBlock, { code: "/* CSS custom properties */\n--primary: oklch(0.45 0.10 150);           /* background */\n--primary-foreground: oklch(0.985 0.01 150); /* text on primary */\n\n/* Bridged to Tailwind v4 */\n@theme inline {\n  --color-primary: var(--primary);\n  --color-primary-foreground: var(--primary-foreground);\n}\n\n/* Usage in components */\n.bg-primary          /* background color */\n.text-primary-foreground  /* text color */" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h3', { className: 'text-sm font-semibold' }, 'Dark Mode'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Dark mode is controlled by the .dark class on <html>. The @custom-variant directive tells Tailwind v4 to use class-based dark mode instead of prefers-color-scheme.',
      ),
      createElement(CodeBlock, { code: "/* In tailwind.css */\n@custom-variant dark (&:is(.dark *));\n\n.dark {\n  --background: oklch(0.145 0 0);\n  --foreground: oklch(0.985 0 0);\n  --primary: oklch(0.65 0.10 155);\n  /* ... all tokens redefined for dark */\n}" }),
    ),
  );
}
