import { createElement } from 'inferno-create-element';
import { Textarea } from '../../../ui/Textarea';
import { PageHeader, DemoBox, CodeBlock, PropTable } from '../_helpers';

export function TextareaPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Textarea',
      description: 'Displays a form textarea with consistent styling.',
    }),
    createElement(DemoBox, { className: 'block' },
      createElement('div', { className: 'max-w-sm mx-auto space-y-3' },
        createElement(Textarea, { placeholder: 'Write something...' }),
        createElement(Textarea, { placeholder: 'Disabled', disabled: true }),
      ),
    ),
    createElement(CodeBlock, { code: "import { Textarea } from '@/ui/Textarea'\n\ncreateElement(Textarea, { placeholder: 'Write something...', rows: 4 })" }),
    createElement(PropTable, { rows: [
      { prop: 'placeholder', type: 'string', default: '\u2014' },
      { prop: 'value', type: 'string', default: '\u2014' },
      { prop: 'rows', type: 'number', default: '3' },
      { prop: 'disabled', type: 'boolean', default: 'false' },
      { prop: 'className', type: 'string', default: '\u2014' },
    ]}),
  );
}
