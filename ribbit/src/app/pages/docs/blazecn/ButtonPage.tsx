import { createElement } from 'inferno-create-element';
import { Button } from '../../../ui/Button';
import { PageHeader, DemoBox, ExampleRow, CodeBlock, PropTable } from '../_helpers';

export function ButtonPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Button',
      description: 'Displays a button or a component that looks like a button. 6 variants \u00D7 6 sizes.',
    }),
    createElement(DemoBox, { className: 'flex-col gap-6' },
      createElement(ExampleRow, { label: 'Variants' },
        createElement(Button, null, 'Default'),
        createElement(Button, { variant: 'destructive' }, 'Destructive'),
        createElement(Button, { variant: 'outline' }, 'Outline'),
        createElement(Button, { variant: 'secondary' }, 'Secondary'),
        createElement(Button, { variant: 'ghost' }, 'Ghost'),
        createElement(Button, { variant: 'link' }, 'Link'),
      ),
      createElement(ExampleRow, { label: 'Sizes' },
        createElement(Button, { size: 'xs' }, 'Extra Small'),
        createElement(Button, { size: 'sm' }, 'Small'),
        createElement(Button, null, 'Default'),
        createElement(Button, { size: 'lg' }, 'Large'),
        createElement(Button, { size: 'icon' }, '\u2605'),
        createElement(Button, { size: 'icon-sm' }, '\u2605'),
      ),
      createElement(ExampleRow, { label: 'States' },
        createElement(Button, { disabled: true }, 'Disabled'),
        createElement(Button, { variant: 'outline', disabled: true }, 'Disabled Outline'),
      ),
    ),

    createElement(CodeBlock, { code: "import { Button } from '@/ui/Button'\n\ncreateElement(Button, { variant: 'outline', size: 'sm' }, 'Click me')" }),

    createElement(PropTable, { rows: [
      { prop: 'variant', type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", default: "'default'" },
      { prop: 'size', type: "'default' | 'sm' | 'xs' | 'lg' | 'icon' | 'icon-sm'", default: "'default'" },
      { prop: 'disabled', type: 'boolean', default: 'false' },
      { prop: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'" },
      { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
      { prop: 'className', type: 'string', default: '\u2014' },
    ]}),
  );
}
