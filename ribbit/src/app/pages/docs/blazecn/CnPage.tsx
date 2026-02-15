import { createElement } from 'inferno-create-element';
import { PageHeader, CodeBlock } from '../_helpers';

export function CnPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'cn() Utility',
      description: 'Every Blazecn component uses cn() to merge CSS classes. It does two things:',
    }),

    createElement('div', { className: 'space-y-4' },
      createElement('div', { className: 'rounded-lg border border-border p-4 space-y-2' },
        createElement('p', { className: 'text-sm font-semibold' }, '1. Conditional classes (from clsx)'),
        createElement('p', { className: 'text-sm text-muted-foreground' },
          'Pass strings, booleans, arrays \u2014 falsy values are ignored. This lets you toggle classes on/off.',
        ),
        createElement(CodeBlock, { code: "cn('px-4', isActive && 'bg-primary')\n// isActive=true  \u2192 'px-4 bg-primary'\n// isActive=false \u2192 'px-4'" }),
      ),

      createElement('div', { className: 'rounded-lg border border-border p-4 space-y-2' },
        createElement('p', { className: 'text-sm font-semibold' }, '2. Conflict resolution (from tailwind-merge)'),
        createElement('p', { className: 'text-sm text-muted-foreground' },
          'When two Tailwind classes target the same CSS property, the last one wins. Without this, both classes would apply and the result would be unpredictable.',
        ),
        createElement(CodeBlock, { code: "cn('px-4', 'px-6')              \u2192 'px-6'     (last wins)\ncn('text-red-500', 'text-blue') \u2192 'text-blue' (last wins)" }),
      ),

      createElement('div', { className: 'rounded-lg border border-border p-4 space-y-2' },
        createElement('p', { className: 'text-sm font-semibold' }, 'Why it matters'),
        createElement('p', { className: 'text-sm text-muted-foreground' },
          'Every component accepts a className prop. cn() lets your custom classes cleanly override the defaults without fighting them.',
        ),
        createElement(CodeBlock, { code: "// Button has default padding 'px-4'\n// Your className='px-8' overrides it cleanly:\ncreateElement(Button, { className: 'px-8' }, 'Wide')\n// Result: px-8 (not px-4 px-8)" }),
      ),
    ),

    createElement('div', { className: 'space-y-2' },
      createElement('h3', { className: 'text-sm font-semibold' }, 'Source'),
      createElement(CodeBlock, { code: "import { clsx, type ClassValue } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}" }),
    ),
  );
}
