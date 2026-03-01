import { createElement } from 'inferno-create-element';
import { Input } from '../../../ui/Input';
import { PageHeader, DemoBox, CodeBlock, PropTable } from '../_helpers';

export function InputPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Input',
      description: 'Displays a form input field with consistent styling and focus ring.',
    }),
    createElement(DemoBox, { className: 'block' },
      createElement('div', { className: 'max-w-sm mx-auto space-y-3' },
        createElement(Input, { placeholder: 'Default input' }),
        createElement(Input, { type: 'email', placeholder: 'you@example.com' }),
        createElement(Input, { type: 'password', placeholder: 'Password' }),
        createElement(Input, { disabled: true, placeholder: 'Disabled' }),
      ),
    ),
    createElement(CodeBlock, { code: "import { Input } from '@/ui/Input'\n\ncreateElement(Input, { type: 'email', placeholder: 'you@example.com' })" }),
    createElement(PropTable, { rows: [
      { prop: 'type', type: 'string', default: "'text'" },
      { prop: 'placeholder', type: 'string', default: '\u2014' },
      { prop: 'value', type: 'string', default: '\u2014' },
      { prop: 'disabled', type: 'boolean', default: 'false' },
      { prop: 'readOnly', type: 'boolean', default: 'false' },
      { prop: 'onInput', type: '(e: Event) => void', default: '\u2014' },
      { prop: 'className', type: 'string', default: '\u2014' },
    ]}),
  );
}
