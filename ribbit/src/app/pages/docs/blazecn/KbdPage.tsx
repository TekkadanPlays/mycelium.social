import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import { Kbd, KbdGroup } from '../../../ui/Kbd';

export function KbdPage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Kbd',
      description: 'Display keyboard keys or shortcuts inline.',
    }),

    // Demo
    createElement(SectionHeading, { id: 'demo' }, 'Demo'),
    createElement(DemoBox, { className: 'flex-col gap-4' },
      createElement('div', { className: 'flex items-center gap-4 flex-wrap' },
        createElement('span', { className: 'text-sm text-muted-foreground' }, 'Single key:'),
        createElement(Kbd, null, '\u2318'),
        createElement(Kbd, null, 'K'),
        createElement(Kbd, null, 'Shift'),
        createElement(Kbd, null, 'Enter'),
        createElement(Kbd, null, 'Esc'),
      ),
      createElement('div', { className: 'flex items-center gap-4 flex-wrap' },
        createElement('span', { className: 'text-sm text-muted-foreground' }, 'Shortcuts:'),
        createElement(KbdGroup, { keys: ['\u2318', 'K'] }),
        createElement(KbdGroup, { keys: ['\u2318', 'Shift', 'P'] }),
        createElement(KbdGroup, { keys: ['Ctrl', 'Alt', 'Del'] }),
      ),
    ),

    // In context
    createElement(SectionHeading, { id: 'context' }, 'In Context'),
    createElement(DemoBox, { className: 'flex-col gap-3' },
      createElement('p', { className: 'text-sm' },
        'Press ',
        createElement(KbdGroup, { keys: ['\u2318', 'K'] }),
        ' to open the command palette.',
      ),
      createElement('p', { className: 'text-sm' },
        'Use ',
        createElement(Kbd, null, 'Esc'),
        ' to close dialogs.',
      ),
      createElement('p', { className: 'text-sm' },
        'Save with ',
        createElement(KbdGroup, { keys: ['\u2318', 'S'] }),
        ' or ',
        createElement(KbdGroup, { keys: ['Ctrl', 'S'] }),
        ' on Windows.',
      ),
    ),

    // Usage
    createElement(SectionHeading, { id: 'usage' }, 'Usage'),
    createElement(CodeBlock, { code: `import { Kbd, KbdGroup } from '@/ui/Kbd'

// Single key
createElement(Kbd, null, '\u2318')

// Key combination
createElement(KbdGroup, { keys: ['\u2318', 'K'] })

// Custom separator
createElement(KbdGroup, { keys: ['Ctrl', 'Shift', 'P'], separator: ' ' })` }),

    // Props
    createElement(SectionHeading, { id: 'props' }, 'Props'),
    createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'Kbd'),
    createElement(PropTable, {
      rows: [
        { prop: 'className', type: 'string', default: '\u2014' },
        { prop: 'children', type: 'string', default: '\u2014' },
      ],
    }),
    createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'KbdGroup'),
    createElement(PropTable, {
      rows: [
        { prop: 'keys', type: 'string[]', default: '\u2014 (required)' },
        { prop: 'separator', type: 'string', default: "'+'" },
      ],
    }),
  );
}
