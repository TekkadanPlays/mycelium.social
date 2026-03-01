import { createElement } from 'inferno-create-element';
import { Separator } from '../../../ui/Separator';
import { PageHeader, DemoBox, CodeBlock } from '../_helpers';

export function SeparatorPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Separator',
      description: 'Visually or semantically separates content.',
    }),
    createElement(DemoBox, { className: 'flex-col gap-6' },
      createElement('div', { className: 'w-48 text-center' },
        createElement('p', { className: 'text-sm' }, 'Content above'),
        createElement(Separator, { className: 'my-3' }),
        createElement('p', { className: 'text-sm' }, 'Content below'),
      ),
      createElement('div', { className: 'flex items-center gap-3 h-6' },
        createElement('span', { className: 'text-sm' }, 'Left'),
        createElement(Separator, { orientation: 'vertical' }),
        createElement('span', { className: 'text-sm' }, 'Right'),
      ),
    ),
    createElement(CodeBlock, { code: "import { Separator } from '@/ui/Separator'\n\ncreateElement(Separator, null)                          // horizontal\ncreateElement(Separator, { orientation: 'vertical' })   // vertical" }),
  );
}
