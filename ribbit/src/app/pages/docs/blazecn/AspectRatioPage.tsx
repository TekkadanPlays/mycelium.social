import { createElement } from 'inferno-create-element';
import { AspectRatio } from '../../../ui/AspectRatio';
import { PageHeader, DemoBox, CodeBlock, PropTable } from '../_helpers';

export function AspectRatioPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Aspect Ratio',
      description: 'Displays content within a desired ratio. Uses padding-bottom technique for zero-JS layout.',
    }),
    createElement(DemoBox, { className: 'flex-col gap-6' },
      createElement('div', { className: 'w-full max-w-md' },
        createElement('p', { className: 'text-xs text-muted-foreground mb-2 text-center' }, '16:9'),
        createElement(AspectRatio, { ratio: 16 / 9, className: 'rounded-lg overflow-hidden bg-muted' },
          createElement('img', {
            src: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80',
            alt: 'Photo by Drew Beamer',
            className: 'object-cover w-full h-full',
          }),
        ),
      ),
      createElement('div', { className: 'w-full max-w-[200px]' },
        createElement('p', { className: 'text-xs text-muted-foreground mb-2 text-center' }, '1:1'),
        createElement(AspectRatio, { ratio: 1, className: 'rounded-lg overflow-hidden bg-muted' },
          createElement('img', {
            src: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=400&dpr=2&q=80',
            alt: 'Photo by Drew Beamer',
            className: 'object-cover w-full h-full',
          }),
        ),
      ),
    ),
    createElement(CodeBlock, { code: "import { AspectRatio } from '@/ui/AspectRatio'\n\ncreateElement(AspectRatio, { ratio: 16 / 9 },\n  createElement('img', { src: '/photo.jpg', className: 'object-cover w-full h-full' }),\n)" }),
    createElement(PropTable, { rows: [
      { prop: 'ratio', type: 'number', default: '16/9' },
      { prop: 'className', type: 'string', default: '\u2014' },
    ]}),
  );
}
