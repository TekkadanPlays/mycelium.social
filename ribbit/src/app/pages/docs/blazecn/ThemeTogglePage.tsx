import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import { ThemeToggle } from '../../../ui/ThemeToggle';

export function ThemeTogglePage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'ThemeToggle',
      description: 'A button that toggles between light and dark themes. Persists preference in localStorage and respects system preference on first visit.',
    }),

    // Demo
    createElement(SectionHeading, { id: 'demo' }, 'Demo'),
    createElement(DemoBox, null,
      createElement('div', { className: 'flex items-center gap-4' },
        createElement(ThemeToggle, null),
        createElement('span', { className: 'text-sm text-muted-foreground' }, 'Click to toggle theme'),
      ),
    ),

    // Usage
    createElement(SectionHeading, { id: 'usage' }, 'Usage'),
    createElement(CodeBlock, { code: `import { ThemeToggle } from './ui/ThemeToggle'

// Basic usage
<ThemeToggle />

// With custom class
<ThemeToggle className="size-8" />` }),

    // How it works
    createElement(SectionHeading, { id: 'how-it-works' }, 'How It Works'),
    createElement('div', { className: 'space-y-3' },
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'ThemeToggle manages the .dark class on the <html> element:',
      ),
      createElement('ul', { className: 'text-sm text-muted-foreground space-y-1 list-disc pl-5' },
        createElement('li', null, 'On mount, reads theme from localStorage or falls back to system preference (prefers-color-scheme)'),
        createElement('li', null, 'Adds or removes the .dark class on document.documentElement'),
        createElement('li', null, 'Persists the choice to localStorage under the key "theme"'),
        createElement('li', null, 'Displays a sun icon in dark mode (click to go light) and a moon icon in light mode (click to go dark)'),
      ),
    ),

    // Integration
    createElement(SectionHeading, { id: 'integration' }, 'Integration'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Place the ThemeToggle in your app header so it is always accessible. The toggle works with Tailwind CSS v4\'s @custom-variant dark selector and CSS custom properties defined on :root and .dark.',
    ),
    createElement(CodeBlock, { code: `// In your header component
createElement('div', { className: 'flex items-center gap-2' },
  createElement(ThemeToggle, { className: 'size-8' }),
  // ... other header items
)` }),

    // CSS setup
    createElement(SectionHeading, { id: 'css-setup' }, 'CSS Setup'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Your tailwind.css must include the dark variant and define color tokens for both :root and .dark:',
    ),
    createElement(CodeBlock, { code: `@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... other tokens */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... other tokens */
}` }),

    // Props
    createElement(SectionHeading, { id: 'props' }, 'Props'),
    createElement(PropTable, {
      rows: [
        { prop: 'className', type: 'string', default: '—' },
      ],
    }),
  );
}
