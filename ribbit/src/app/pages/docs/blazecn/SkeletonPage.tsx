import { createElement } from 'inferno-create-element';
import { Skeleton } from '../../../ui/Skeleton';
import { PageHeader, DemoBox, CodeBlock } from '../_helpers';

export function SkeletonPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Skeleton',
      description: 'Use to show a placeholder while content is loading.',
    }),
    createElement(DemoBox, { className: 'flex-col' },
      createElement('div', { className: 'space-y-3 w-full max-w-sm' },
        createElement('div', { className: 'flex items-center gap-3' },
          createElement(Skeleton, { className: 'size-10 rounded-full' }),
          createElement('div', { className: 'space-y-2 flex-1' },
            createElement(Skeleton, { className: 'h-4 w-3/4' }),
            createElement(Skeleton, { className: 'h-3 w-1/2' }),
          ),
        ),
        createElement(Skeleton, { className: 'h-32 w-full rounded-lg' }),
        createElement('div', { className: 'space-y-2' },
          createElement(Skeleton, { className: 'h-4 w-full' }),
          createElement(Skeleton, { className: 'h-4 w-5/6' }),
          createElement(Skeleton, { className: 'h-4 w-4/6' }),
        ),
      ),
    ),
    createElement(CodeBlock, { code: "import { Skeleton } from '@/ui/Skeleton'\n\ncreateElement(Skeleton, { className: 'h-4 w-48' })\ncreateElement(Skeleton, { className: 'size-10 rounded-full' })" }),
  );
}
