import { createElement } from 'inferno-create-element';
import { AspectRatio } from '../../../ui/AspectRatio';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';

export function AspectRatioPage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Aspect Ratio',
      description: 'Displays content within a desired ratio. Uses the padding-bottom technique for zero-JS layout.',
    }),

    // 16:9 with image
    createElement(SectionHeading, { id: 'demo' }, 'Demo'),
    createElement(DemoBox, { className: 'block p-8' },
      createElement('div', { className: 'max-w-md mx-auto' },
        createElement(AspectRatio, { ratio: 16 / 9, className: 'rounded-lg overflow-hidden bg-muted' },
          createElement('img', {
            src: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80',
            alt: 'Photo by Drew Beamer',
            className: 'object-cover w-full h-full',
          }),
        ),
      ),
    ),

    // 1:1 Square
    createElement(SectionHeading, { id: 'square' }, 'Square (1:1)'),
    createElement(DemoBox, { className: 'block p-8' },
      createElement('div', { className: 'max-w-[250px] mx-auto' },
        createElement(AspectRatio, { ratio: 1, className: 'rounded-lg overflow-hidden bg-muted' },
          createElement('img', {
            src: 'https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=600&dpr=2&q=80',
            alt: 'Photo by Alvaro Pinot',
            className: 'object-cover w-full h-full',
          }),
        ),
      ),
    ),

    // Multiple ratios
    createElement(SectionHeading, { id: 'ratios' }, 'Common Ratios'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Use the ratio prop to set common aspect ratios.',
    ),
    createElement(DemoBox, { className: 'block p-8' },
      createElement('div', { className: 'grid grid-cols-3 gap-6 max-w-2xl mx-auto' },
        ...[
          { ratio: 16 / 9, label: '16:9', desc: 'Widescreen' },
          { ratio: 4 / 3, label: '4:3', desc: 'Classic TV' },
          { ratio: 1, label: '1:1', desc: 'Square' },
          { ratio: 3 / 2, label: '3:2', desc: 'Photography' },
          { ratio: 21 / 9, label: '21:9', desc: 'Ultrawide' },
          { ratio: 9 / 16, label: '9:16', desc: 'Portrait' },
        ].map((item) =>
          createElement('div', { key: item.label },
            createElement(AspectRatio, { ratio: item.ratio, className: 'rounded-lg overflow-hidden border bg-muted' },
              createElement('div', {
                className: 'w-full h-full flex flex-col items-center justify-center',
              },
                createElement('span', { className: 'text-sm font-semibold' }, item.label),
                createElement('span', { className: 'text-xs text-muted-foreground' }, item.desc),
              ),
            ),
          ),
        ),
      ),
    ),

    // Map placeholder
    createElement(SectionHeading, { id: 'with-content' }, 'With Embedded Content'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'AspectRatio works with any content \u2014 images, videos, maps, or iframes.',
    ),
    createElement(DemoBox, { className: 'block p-8' },
      createElement('div', { className: 'max-w-md mx-auto' },
        createElement(AspectRatio, { ratio: 16 / 9, className: 'rounded-lg overflow-hidden' },
          createElement('iframe', {
            src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596698663!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1',
            className: 'w-full h-full border-0',
            loading: 'lazy',
            title: 'Map of New York',
          }),
        ),
      ),
    ),

    // Usage
    createElement(SectionHeading, { id: 'usage' }, 'Usage'),
    createElement(CodeBlock, { code: `import { AspectRatio } from '@/ui/AspectRatio'

// With an image
createElement(AspectRatio, { ratio: 16 / 9, className: 'rounded-lg overflow-hidden' },
  createElement('img', {
    src: '/photo.jpg',
    alt: 'Landscape',
    className: 'object-cover w-full h-full',
  }),
)

// Square ratio
createElement(AspectRatio, { ratio: 1 },
  createElement('div', { className: 'bg-muted w-full h-full' }),
)` }),

    // Props
    createElement(SectionHeading, { id: 'props' }, 'Props'),
    createElement(PropTable, { rows: [
      { prop: 'ratio', type: 'number', default: '16/9' },
      { prop: 'className', type: 'string', default: '\u2014' },
    ]}),
  );
}
