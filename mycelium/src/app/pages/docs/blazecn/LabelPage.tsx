import { createElement } from 'inferno-create-element';
import { Label } from '../../../ui/Label';
import { Input } from '../../../ui/Input';
import { PageHeader, DemoBox, CodeBlock } from '../_helpers';

export function LabelPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Label',
      description: 'Renders an accessible label associated with controls.',
    }),
    createElement(DemoBox, { className: 'block' },
      createElement('div', { className: 'max-w-sm mx-auto space-y-1' },
        createElement(Label, { htmlFor: 'demo-email' }, 'Your email'),
        createElement(Input, { id: 'demo-email', type: 'email', placeholder: 'you@example.com' }),
      ),
    ),
    createElement(CodeBlock, { code: "import { Label } from '@/ui/Label'\n\ncreateElement(Label, { htmlFor: 'email' }, 'Email')\ncreateElement(Input, { id: 'email', type: 'email' })" }),
  );
}
