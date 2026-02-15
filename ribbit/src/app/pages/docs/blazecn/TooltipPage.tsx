import { createElement } from 'inferno-create-element';
import { Tooltip } from '../../../ui/Tooltip';
import { Button } from '../../../ui/Button';
import { PageHeader, DemoBox, ExampleRow, CodeBlock, PropTable } from '../_helpers';

export function TooltipPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Tooltip',
      description: 'A popup that displays information related to an element when hovered or focused.',
    }),
    createElement(DemoBox, null,
      createElement(ExampleRow, { label: 'Sides' },
        createElement(Tooltip, { content: 'Top tooltip', side: 'top' },
          createElement(Button, { variant: 'outline', size: 'sm' }, 'Top'),
        ),
        createElement(Tooltip, { content: 'Bottom tooltip', side: 'bottom' },
          createElement(Button, { variant: 'outline', size: 'sm' }, 'Bottom'),
        ),
        createElement(Tooltip, { content: 'Left tooltip', side: 'left' },
          createElement(Button, { variant: 'outline', size: 'sm' }, 'Left'),
        ),
        createElement(Tooltip, { content: 'Right tooltip', side: 'right' },
          createElement(Button, { variant: 'outline', size: 'sm' }, 'Right'),
        ),
      ),
    ),
    createElement(CodeBlock, { code: "import { Tooltip } from '@/ui/Tooltip'\n\ncreateElement(Tooltip, { content: 'Add to library', side: 'top' },\n  createElement(Button, { variant: 'outline' }, 'Hover me'),\n)" }),
    createElement(PropTable, { rows: [
      { prop: 'content', type: 'string', default: '\u2014' },
      { prop: 'side', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'" },
      { prop: 'delayMs', type: 'number', default: '200' },
      { prop: 'className', type: 'string', default: '\u2014' },
    ]}),
  );
}
