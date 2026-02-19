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
      'Choose a base color palette. Each theme adjusts the primary color (buttons, links, focus rings) while keeping neutral surfaces.',
    ),
    createElement(DemoBox, { className: 'block p-6' },
      createElement(ThemePicker, null),
    ),

    // Available themes
    createElement(SectionHeading, { id: 'themes' }, 'Available Themes'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      '20 themes with full light/dark OKLCH token sets. Neutrals change surface colors; color themes change primary accent.',
    ),
    createElement('div', { className: 'space-y-4' },
      createElement('div', null,
        createElement('p', { className: 'text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2' }, 'Neutrals'),
        createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-4 gap-1.5' },
          ...[
            { name: 'Neutral', desc: 'Pure black/white, zero chroma. Default.' },
            { name: 'Stone', desc: 'Warm neutral with slight yellow undertone.' },
            { name: 'Zinc', desc: 'Cool neutral with blue-purple undertone.' },
            { name: 'Gray', desc: 'Blue-tinted neutral.' },
          ].map((t) =>
            createElement('div', { key: t.name, className: 'text-sm' },
              createElement('span', { className: 'font-medium' }, t.name),
              createElement('span', { className: 'text-muted-foreground' }, ' \u2014 ' + t.desc),
            ),
          ),
        ),
      ),
      createElement('div', null,
        createElement('p', { className: 'text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2' }, 'Colors'),
        createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-4 gap-1.5' },
          ...['Amber', 'Blue', 'Cyan', 'Emerald', 'Fuchsia', 'Green', 'Indigo', 'Lime',
              'Orange', 'Pink', 'Purple', 'Red', 'Rose', 'Sky', 'Teal', 'Violet',
          ].map((name) =>
            createElement('span', { key: name, className: 'text-sm font-medium' }, name),
          ),
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

setBaseTheme('lime')    // Switch to Lime (default)
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
        createElement('li', null, 'Theme classes (.theme-lime, .theme-blue, etc.) override primary/ring CSS variables on <html>'),
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
.theme-lime {
  --primary: oklch(0.65 0.18 132);
  --primary-foreground: oklch(0.99 0.03 121);
}
.dark.theme-lime {
  --primary: oklch(0.77 0.20 131);
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
