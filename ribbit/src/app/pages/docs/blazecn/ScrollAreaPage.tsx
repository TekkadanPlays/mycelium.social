import { createElement } from 'inferno-create-element';
import { ScrollArea } from '../../../ui/ScrollArea';
import { PageHeader, DemoBox, CodeBlock } from '../_helpers';

export function ScrollAreaPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Scroll Area',
      description: 'Augments native scroll functionality with a custom styled scrollbar. CSS-only, no JS overhead.',
    }),
    createElement(DemoBox, null,
      createElement(ScrollArea, { className: 'h-48 w-64 rounded-md border p-4' },
        ...Array.from({ length: 20 }, (_, i) =>
          createElement('div', { key: i, className: 'py-1 text-sm' }, 'Item ' + (i + 1)),
        ),
      ),
    ),
    createElement(CodeBlock, { code: "import { ScrollArea } from '@/ui/ScrollArea'\n\ncreateElement(ScrollArea, { className: 'h-48 w-64 rounded-md border p-4' },\n  ...items.map((item) => createElement('div', null, item)),\n)" }),
  );
}
