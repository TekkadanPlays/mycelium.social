import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import { ThemeToggle } from '../../../ui/ThemeToggle';
import { ThemePicker } from '../../../ui/ThemePicker';
import { ThemeSelector } from '../../../ui/ThemeSelector';

export function ThemeTogglePage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Themes',
      description: 'Toggle between light and dark modes, and choose from multiple base color themes. All preferences persist in localStorage.',
    }),

    // Dark mode toggle
    createElement(SectionHeading, { id: 'dark-mode' }, 'Dark Mode'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Toggle between light and dark mode. Respects system preference on first visit.',
    ),
    createElement(DemoBox, null,
      createElement('div', { className: 'flex items-center gap-4' },
        createElement(ThemeToggle, null),
        createElement('span', { className: 'text-sm text-muted-foreground' }, 'Click to toggle dark mode'),
      ),
    ),

    // Base color theme
    createElement(SectionHeading, { id: 'base-theme' }, 'Base Color Theme'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Choose a base color palette. Each theme adjusts the primary color (buttons, links, focus rings) while keeping neutral surfaces. Includes Ribbit green, Nostr purple, and Bitcoin orange.',
    ),
    createElement(DemoBox, { className: 'block p-6' },
      createElement(ThemePicker, null),
    ),

    // Available themes
    createElement(SectionHeading, { id: 'themes' }, 'Available Themes'),
    createElement('div', { className: 'space-y-2' },
      ...[
        { name: 'Neutral', desc: 'Pure black/white with zero chroma. The shadcn default.' },
        { name: 'Ribbit', desc: 'Muted green \u2014 the Ribbit frog identity.' },
        { name: 'Nostr', desc: 'Purple accent based on #8e30eb.' },
        { name: 'Bitcoin', desc: 'Orange accent based on #F7931A.' },
      ].map((t) =>
        createElement('div', { key: t.name, className: 'flex items-baseline gap-2' },
          createElement('span', { className: 'text-sm font-semibold' }, t.name),
          createElement('span', { className: 'text-sm text-muted-foreground' }, '\u2014 ' + t.desc),
        ),
      ),
    ),

    // Usage
    createElement(SectionHeading, { id: 'usage' }, 'Usage'),
    createElement(CodeBlock, { code: `import { ThemeToggle } from '@/ui/ThemeToggle'
import { ThemePicker } from '@/ui/ThemePicker'

// Dark mode toggle button
createElement(ThemeToggle, null)

// Base color theme picker
createElement(ThemePicker, null)

// Programmatic API
import { setBaseTheme, setDarkMode, toggleDarkMode } from '@/store/theme'

setBaseTheme('ribbit')  // Switch to Ribbit green
setDarkMode(true)       // Force dark mode
toggleDarkMode()        // Toggle dark/light` }),

    // How it works
    createElement(SectionHeading, { id: 'how-it-works' }, 'How It Works'),
    createElement('div', { className: 'space-y-3' },
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'The theme system uses CSS custom properties with class-based overrides:',
      ),
      createElement('ul', { className: 'text-sm text-muted-foreground space-y-1 list-disc pl-5' },
        createElement('li', null, 'Base colors defined in :root (light) and .dark (dark) using oklch values'),
        createElement('li', null, 'Theme classes (.theme-ribbit, .theme-nostr, .theme-bitcoin) override primary/ring CSS variables on <html>'),
        createElement('li', null, 'Dark variants use .dark.theme-* compound selectors'),
        createElement('li', null, 'Both dark mode and base theme persist to localStorage'),
        createElement('li', null, 'initTheme() in App.tsx applies persisted preferences on load'),
      ),
    ),

    // CSS setup
    createElement(SectionHeading, { id: 'css-setup' }, 'CSS Setup'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Define base tokens in :root/.dark, then add theme class overrides:',
    ),
    createElement(CodeBlock, { code: `:root {
  --primary: oklch(0.205 0 0);        /* Neutral default */
  --primary-foreground: oklch(0.985 0 0);
  /* ... */
}
.dark {
  --primary: oklch(0.922 0 0);
  /* ... */
}

/* Theme override */
.theme-ribbit {
  --primary: oklch(0.45 0.10 150);    /* Green */
  --primary-foreground: oklch(0.985 0.01 150);
}
.dark.theme-ribbit {
  --primary: oklch(0.65 0.10 155);
}` }),

    // Props
    createElement(SectionHeading, { id: 'props' }, 'Props'),
    createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'ThemeToggle'),
    createElement(PropTable, {
      rows: [
        { prop: 'className', type: 'string', default: '\u2014' },
      ],
    }),
    createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'ThemePicker'),
    createElement(PropTable, {
      rows: [
        { prop: 'className', type: 'string', default: '\u2014' },
      ],
    }),
  );
}
