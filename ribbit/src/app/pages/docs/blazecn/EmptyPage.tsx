import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions } from '../../../ui/Empty';
import { Button } from '../../../ui/Button';

export function EmptyPage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Empty',
      description: 'A placeholder for empty states with icon, title, description, and optional actions.',
    }),

    // Demo
    createElement(SectionHeading, { id: 'demo' }, 'Demo'),
    createElement(DemoBox, { className: 'block p-8' },
      createElement(Empty, { className: 'max-w-md mx-auto' },
        createElement(EmptyIcon, null,
          createElement('svg', {
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '1.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
            createElement('path', { d: 'M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z' }),
            createElement('path', { d: 'M13 2v7h7' }),
          ),
        ),
        createElement(EmptyTitle, null, 'No files uploaded'),
        createElement(EmptyDescription, null, 'Upload a file to get started. Drag and drop or click the button below.'),
        createElement(EmptyActions, null,
          createElement(Button, { size: 'sm' }, 'Upload File'),
        ),
      ),
    ),

    // Minimal
    createElement(SectionHeading, { id: 'minimal' }, 'Minimal'),
    createElement(DemoBox, { className: 'block p-8' },
      createElement(Empty, { className: 'max-w-sm mx-auto' },
        createElement(EmptyTitle, null, 'No results'),
        createElement(EmptyDescription, null, 'Try adjusting your search or filters.'),
      ),
    ),

    // With multiple actions
    createElement(SectionHeading, { id: 'actions' }, 'With Actions'),
    createElement(DemoBox, { className: 'block p-8' },
      createElement(Empty, { className: 'max-w-md mx-auto' },
        createElement(EmptyIcon, null,
          createElement('svg', {
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '1.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
            createElement('circle', { cx: '12', cy: '12', r: '10' }),
            createElement('line', { x1: '12', y1: '8', x2: '12', y2: '12' }),
            createElement('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' }),
          ),
        ),
        createElement(EmptyTitle, null, 'Something went wrong'),
        createElement(EmptyDescription, null, 'There was an error loading your data. Please try again.'),
        createElement(EmptyActions, null,
          createElement(Button, { size: 'sm' }, 'Retry'),
          createElement(Button, { variant: 'outline', size: 'sm' }, 'Go Back'),
        ),
      ),
    ),

    // Usage
    createElement(SectionHeading, { id: 'usage' }, 'Usage'),
    createElement(CodeBlock, { code: `import { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions } from '@/ui/Empty'

createElement(Empty, null,
  createElement(EmptyIcon, null, icon),
  createElement(EmptyTitle, null, 'No items'),
  createElement(EmptyDescription, null, 'Get started by creating a new item.'),
  createElement(EmptyActions, null,
    createElement(Button, null, 'Create'),
  ),
)` }),

    // Props
    createElement(SectionHeading, { id: 'props' }, 'Props'),
    createElement(PropTable, {
      rows: [
        { prop: 'className', type: 'string', default: '\u2014' },
        { prop: 'children', type: 'any', default: '\u2014' },
      ],
    }),
    createElement('p', { className: 'text-xs text-muted-foreground mt-2' },
      'All Empty sub-components (EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions) accept className and children.',
    ),
  );
}
