import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import { ButtonGroup } from '../../../ui/ButtonGroup';
import { Button } from '../../../ui/Button';

export function ButtonGroupPage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Button Group',
      description: 'A group of buttons displayed together with shared borders and rounded corners.',
    }),

    // Demo
    createElement(SectionHeading, { id: 'demo' }, 'Demo'),
    createElement(DemoBox, { className: 'flex-col gap-6' },
      createElement('div', { className: 'flex flex-col gap-2 items-center' },
        createElement('span', { className: 'text-xs text-muted-foreground' }, 'Default'),
        createElement(ButtonGroup, null,
          createElement(Button, { variant: 'outline' }, 'Left'),
          createElement(Button, { variant: 'outline' }, 'Center'),
          createElement(Button, { variant: 'outline' }, 'Right'),
        ),
      ),
      createElement('div', { className: 'flex flex-col gap-2 items-center' },
        createElement('span', { className: 'text-xs text-muted-foreground' }, 'Primary'),
        createElement(ButtonGroup, null,
          createElement(Button, null, 'Save'),
          createElement(Button, null, 'Save & Close'),
        ),
      ),
    ),

    // Split button
    createElement(SectionHeading, { id: 'split' }, 'Split Button'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Combine a primary action with a dropdown trigger.',
    ),
    createElement(DemoBox, null,
      createElement(ButtonGroup, null,
        createElement(Button, null, 'Deploy'),
        createElement(Button, { size: 'icon' },
          createElement('svg', {
            className: 'size-4',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          }, createElement('path', { d: 'M6 9l6 6 6-6' })),
        ),
      ),
    ),

    // Vertical
    createElement(SectionHeading, { id: 'vertical' }, 'Vertical'),
    createElement(DemoBox, null,
      createElement(ButtonGroup, { orientation: 'vertical' },
        createElement(Button, { variant: 'outline' }, 'Top'),
        createElement(Button, { variant: 'outline' }, 'Middle'),
        createElement(Button, { variant: 'outline' }, 'Bottom'),
      ),
    ),

    // Sizes
    createElement(SectionHeading, { id: 'sizes' }, 'Sizes'),
    createElement(DemoBox, { className: 'flex-col gap-4' },
      createElement(ButtonGroup, null,
        createElement(Button, { variant: 'outline', size: 'sm' }, 'Small'),
        createElement(Button, { variant: 'outline', size: 'sm' }, 'Group'),
      ),
      createElement(ButtonGroup, null,
        createElement(Button, { variant: 'outline' }, 'Default'),
        createElement(Button, { variant: 'outline' }, 'Group'),
      ),
      createElement(ButtonGroup, null,
        createElement(Button, { variant: 'outline', size: 'lg' }, 'Large'),
        createElement(Button, { variant: 'outline', size: 'lg' }, 'Group'),
      ),
    ),

    // Usage
    createElement(SectionHeading, { id: 'usage' }, 'Usage'),
    createElement(CodeBlock, { code: `import { ButtonGroup } from '@/ui/ButtonGroup'
import { Button } from '@/ui/Button'

// Horizontal (default)
createElement(ButtonGroup, null,
  createElement(Button, { variant: 'outline' }, 'Left'),
  createElement(Button, { variant: 'outline' }, 'Center'),
  createElement(Button, { variant: 'outline' }, 'Right'),
)

// Vertical
createElement(ButtonGroup, { orientation: 'vertical' },
  createElement(Button, { variant: 'outline' }, 'Top'),
  createElement(Button, { variant: 'outline' }, 'Bottom'),
)` }),

    // Props
    createElement(SectionHeading, { id: 'props' }, 'Props'),
    createElement(PropTable, {
      rows: [
        { prop: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
        { prop: 'className', type: 'string', default: '\u2014' },
      ],
    }),
  );
}
