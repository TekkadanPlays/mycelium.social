import { createElement } from 'inferno-create-element';
import { Badge } from '../../../ui/Badge';
import { PageHeader, DemoBox, ExampleRow, CodeBlock, PropTable } from '../_helpers';

export function BadgePage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Badge',
      description: 'Displays a badge or a component that looks like a badge. 5 variants.',
    }),
    createElement(DemoBox, null,
      createElement(ExampleRow, { label: 'Variants' },
        createElement(Badge, null, 'Default'),
        createElement(Badge, { variant: 'secondary' }, 'Secondary'),
        createElement(Badge, { variant: 'destructive' }, 'Destructive'),
        createElement(Badge, { variant: 'outline' }, 'Outline'),
        createElement(Badge, { variant: 'ghost' }, 'Ghost'),
      ),
    ),
    createElement(CodeBlock, { code: "import { Badge } from '@/ui/Badge'\n\ncreateElement(Badge, { variant: 'secondary' }, 'New')" }),
    createElement(PropTable, { rows: [
      { prop: 'variant', type: "'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'", default: "'default'" },
      { prop: 'className', type: 'string', default: '\u2014' },
    ]}),
  );
}
