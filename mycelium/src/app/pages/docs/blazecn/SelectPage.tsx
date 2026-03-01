import { createElement } from 'inferno-create-element';
import { PageHeader, DemoBox, CodeBlock, PropTable } from '../_helpers';

export function SelectPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Select',
      description: 'A custom styled dropdown select. Composed of a trigger button that opens a positioned dropdown list.',
    }),
    createElement(DemoBox, { className: 'block' },
      createElement('p', { className: 'text-sm text-muted-foreground text-center' },
        'Select is a controlled component \u2014 the demo requires state management. See the code example below.',
      ),
    ),
    createElement(CodeBlock, { code: "import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/ui/Select'\n\ncreateElement(Select, null,\n  createElement(SelectTrigger, {\n    open,\n    onClick: () => setOpen(!open),\n  },\n    createElement(SelectValue, {\n      placeholder: 'Choose a fruit...',\n    }, value || null),\n  ),\n  createElement(SelectContent, {\n    open,\n    onClose: () => setOpen(false),\n  },\n    createElement(SelectItem, {\n      value: 'apple',\n      selected: value === 'apple',\n      onClick: () => { setValue('apple'); setOpen(false); },\n    }, 'Apple'),\n  ),\n)" }),
    createElement(PropTable, { rows: [
      { prop: 'open', type: 'boolean', default: 'false' },
      { prop: 'onClose', type: '() => void', default: '\u2014' },
      { prop: 'value', type: 'string', default: '\u2014' },
      { prop: 'selected', type: 'boolean', default: 'false' },
      { prop: 'placeholder', type: 'string', default: '\u2014' },
    ]}),
  );
}
