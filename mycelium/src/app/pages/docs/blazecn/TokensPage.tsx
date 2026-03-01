import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, CodeBlock } from '../_helpers';

const TOKENS = [
  { name: 'background', color: 'bg-background', label: 'Background' },
  { name: 'foreground', color: 'bg-foreground', label: 'Foreground' },
  { name: 'card', color: 'bg-card', label: 'Card' },
  { name: 'popover', color: 'bg-popover', label: 'Popover' },
  { name: 'primary', color: 'bg-primary', label: 'Primary' },
  { name: 'secondary', color: 'bg-secondary', label: 'Secondary' },
  { name: 'muted', color: 'bg-muted', label: 'Muted' },
  { name: 'accent', color: 'bg-accent', label: 'Accent' },
  { name: 'destructive', color: 'bg-destructive', label: 'Destructive' },
  { name: 'border', color: 'bg-border', label: 'Border' },
  { name: 'input', color: 'bg-input', label: 'Input' },
  { name: 'ring', color: 'bg-ring', label: 'Ring' },
];

const SIDEBAR_TOKENS = [
  { name: 'sidebar-background', color: 'bg-sidebar', label: 'Sidebar' },
  { name: 'sidebar-primary', color: 'bg-sidebar-primary', label: 'Sidebar Primary' },
  { name: 'sidebar-accent', color: 'bg-sidebar-accent', label: 'Sidebar Accent' },
  { name: 'sidebar-border', color: 'bg-sidebar-border', label: 'Sidebar Border' },
  { name: 'sidebar-ring', color: 'bg-sidebar-ring', label: 'Sidebar Ring' },
];

export function TokensPage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Design Tokens',
      description: 'Semantic color tokens defined as CSS custom properties. Every token adapts to the active theme and light/dark mode automatically.',
    }),

    // Core tokens
    createElement(SectionHeading, { id: 'core' }, 'Core Tokens'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'These tokens define the color palette for all components. Each has a foreground pair (e.g. --primary / --primary-foreground).',
    ),
    createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2' },
      ...TOKENS.map((token) =>
        createElement('div', {
          key: token.name,
          className: 'flex items-center gap-2.5 rounded-lg border border-border p-2.5',
        },
          createElement('div', { className: `w-8 h-8 rounded-md ${token.color} border border-border shrink-0` }),
          createElement('div', { className: 'min-w-0' },
            createElement('p', { className: 'text-xs font-medium truncate' }, token.label),
            createElement('p', { className: 'text-[10px] font-mono text-muted-foreground truncate' }, `--${token.name}`),
          ),
        ),
      ),
    ),

    // Sidebar tokens
    createElement(SectionHeading, { id: 'sidebar' }, 'Sidebar Tokens'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Dedicated tokens for sidebar layouts. Themes can tint the sidebar independently from the main content area.',
    ),
    createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2' },
      ...SIDEBAR_TOKENS.map((token) =>
        createElement('div', {
          key: token.name,
          className: 'flex items-center gap-2.5 rounded-lg border border-border p-2.5',
        },
          createElement('div', { className: `w-8 h-8 rounded-md ${token.color} border border-border shrink-0` }),
          createElement('div', { className: 'min-w-0' },
            createElement('p', { className: 'text-xs font-medium truncate' }, token.label),
            createElement('p', { className: 'text-[10px] font-mono text-muted-foreground truncate' }, `--${token.name}`),
          ),
        ),
      ),
    ),

    // Token convention
    createElement(SectionHeading, { id: 'convention' }, 'Token Convention'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Every semantic color has a foreground pair. The base token is the background and the -foreground variant is the text color to use on that background.',
    ),
    createElement(CodeBlock, { code: "/* CSS custom properties (OKLCH) */\n--primary: oklch(0.65 0.18 132);           /* background */\n--primary-foreground: oklch(0.99 0.03 121); /* text on primary */\n\n/* Bridged to Tailwind v4 */\n@theme inline {\n  --color-primary: var(--primary);\n  --color-primary-foreground: var(--primary-foreground);\n}\n\n/* Usage in components */\n.bg-primary          /* background color */\n.text-primary-foreground  /* text color */" }),

    // Theming
    createElement(SectionHeading, { id: 'theming' }, 'Theme Overrides'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Blazecn ships 20 themes. Neutral themes (Stone, Zinc, Gray) override all surface tokens. Color themes override primary/ring/sidebar-primary. The active theme class is applied to <html>.',
    ),
    createElement(CodeBlock, { code: "/* Neutral default — :root and .dark */\n:root {\n  --background: oklch(1 0 0);\n  --primary: oklch(0.205 0 0);\n  /* ... all tokens */\n}\n.dark {\n  --background: oklch(0.145 0 0);\n  --primary: oklch(0.922 0 0);\n}\n\n/* Color theme override — e.g. Lime */\n.theme-lime {\n  --primary: oklch(0.65 0.18 132);\n  --primary-foreground: oklch(0.99 0.03 121);\n  --ring: oklch(0.65 0.18 132);\n  --sidebar-primary: oklch(0.65 0.18 132);\n}\n.dark.theme-lime {\n  --primary: oklch(0.77 0.20 131);\n  /* ... dark overrides */\n}" }),

    // Dark mode
    createElement(SectionHeading, { id: 'dark-mode' }, 'Dark Mode'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Dark mode is controlled by the .dark class on <html>. The @custom-variant directive tells Tailwind v4 to use class-based dark mode instead of prefers-color-scheme.',
    ),
    createElement(CodeBlock, { code: "/* In tailwind.css */\n@custom-variant dark (&:is(.dark *));\n\n/* Dark tokens are defined in .dark { ... } */\n/* Theme dark variants use compound selectors: .dark.theme-lime { ... } */" }),
  );
}
