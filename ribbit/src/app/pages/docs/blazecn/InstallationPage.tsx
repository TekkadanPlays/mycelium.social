import { createElement } from 'inferno-create-element';
import { PageHeader, CodeBlock } from '../_helpers';

export function InstallationPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Installation',
      description: 'Blazecn follows the shadcn philosophy \u2014 you own the code. Copy the components you need into your project.',
    }),

    createElement('div', { className: 'space-y-6' },
      createElement('div', { className: 'space-y-2' },
        createElement('h3', { className: 'text-sm font-semibold' }, '1. Install dependencies'),
        createElement(CodeBlock, { code: 'bun add class-variance-authority clsx tailwind-merge' }),
      ),

      createElement('div', { className: 'space-y-2' },
        createElement('h3', { className: 'text-sm font-semibold' }, '2. Add the cn() utility'),
        createElement(CodeBlock, { code: "// utils.ts\nimport { clsx, type ClassValue } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}" }),
      ),

      createElement('div', { className: 'space-y-2' },
        createElement('h3', { className: 'text-sm font-semibold' }, '3. Configure Tailwind CSS v4'),
        createElement('p', { className: 'text-sm text-muted-foreground' },
          'Add the design tokens to your tailwind.css. Blazecn uses the same semantic token pairs as shadcn/ui.',
        ),
        createElement(CodeBlock, { code: "@import \"tailwindcss\";\n\n/* Use .dark class instead of prefers-color-scheme */\n@custom-variant dark (&:is(.dark *));\n\n:root {\n  --background: oklch(1 0 0);\n  --foreground: oklch(0.145 0 0);\n  --primary: oklch(0.45 0.10 150);\n  --primary-foreground: oklch(0.985 0.01 150);\n  /* ... see Design Tokens page for full list */\n}\n\n.dark {\n  --background: oklch(0.145 0 0);\n  --foreground: oklch(0.985 0 0);\n  /* ... */\n}\n\n@theme inline {\n  --color-background: var(--background);\n  --color-foreground: var(--foreground);\n  --color-primary: var(--primary);\n  /* ... bridge all tokens */\n}" }),
      ),

      createElement('div', { className: 'space-y-2' },
        createElement('h3', { className: 'text-sm font-semibold' }, '4. Copy components'),
        createElement('p', { className: 'text-sm text-muted-foreground' },
          'Copy any component file from the ui/ directory into your project. Each is self-contained with only cn() as a local dependency.',
        ),
        createElement(CodeBlock, { code: "// Example: copy Button.tsx into your project\nimport { Button } from './ui/Button'\n\ncreateElement(Button, { variant: 'outline' }, 'Click me')" }),
      ),
    ),
  );
}
