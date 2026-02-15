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
    createElement(DemoBox, { className: 'block p-12' },
      createElement('div', { className: 'flex flex-col items-center gap-4' },
        // Top — at the top with space above
        createElement('div', null,
          createElement(Tooltip, { content: 'Top tooltip', side: 'top' },
            createElement(Button, { variant: 'outline', size: 'sm' }, 'Top'),
          ),
        ),
        // Left and Right — side by side with wide gap
        createElement('div', { className: 'flex items-center gap-24' },
          createElement(Tooltip, { content: 'Left tooltip', side: 'left' },
            createElement(Button, { variant: 'outline', size: 'sm' }, 'Left'),
          ),
          createElement(Tooltip, { content: 'Right tooltip', side: 'right' },
            createElement(Button, { variant: 'outline', size: 'sm' }, 'Right'),
          ),
        ),
        // Bottom — at the bottom with space below
        createElement('div', null,
          createElement(Tooltip, { content: 'Bottom tooltip', side: 'bottom' },
            createElement(Button, { variant: 'outline', size: 'sm' }, 'Bottom'),
          ),
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
