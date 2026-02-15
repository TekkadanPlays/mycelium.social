import { createElement } from 'inferno-create-element';
import { Spinner } from '../../../ui/Spinner';
import { PageHeader, DemoBox, ExampleRow, CodeBlock } from '../_helpers';

export function SpinnerPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Spinner',
      description: 'Accessible loading indicator with 3 sizes. Uses role="status" and aria-label.',
    }),
    createElement(DemoBox, null,
      createElement(ExampleRow, { label: 'Sizes' },
        createElement('div', { className: 'flex items-center gap-2' },
          createElement(Spinner, { size: 'sm' }),
          createElement('span', { className: 'text-xs text-muted-foreground' }, 'sm'),
        ),
        createElement('div', { className: 'flex items-center gap-2' },
          createElement(Spinner, null),
          createElement('span', { className: 'text-xs text-muted-foreground' }, 'default'),
        ),
        createElement('div', { className: 'flex items-center gap-2' },
          createElement(Spinner, { size: 'lg' }),
          createElement('span', { className: 'text-xs text-muted-foreground' }, 'lg'),
        ),
      ),
    ),
    createElement(CodeBlock, { code: "import { Spinner } from '@/ui/Spinner'\n\ncreateElement(Spinner, { size: 'sm' })\ncreateElement(Spinner, null)              // default\ncreateElement(Spinner, { size: 'lg' })" }),
  );
}
