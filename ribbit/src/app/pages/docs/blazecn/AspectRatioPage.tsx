import { createElement } from 'inferno-create-element';
import { AspectRatio } from '../../../ui/AspectRatio';
import { cn } from '../../../ui/utils';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';

export function AspectRatioPage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Aspect Ratio',
      description: 'Displays content within a desired ratio. Uses the padding-bottom technique for zero-JS layout.',
    }),

    // 16:9 with gradient placeholder
    createElement(SectionHeading, { id: 'demo' }, 'Demo'),
    createElement(DemoBox, { className: 'block p-8' },
      createElement('div', { className: 'max-w-md mx-auto' },
        createElement(AspectRatio, { ratio: 16 / 9, className: 'rounded-lg overflow-hidden' },
          createElement('div', {
            className: 'w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-muted flex items-end p-4',
          },
            createElement('div', null,
              createElement('div', { className: 'text-sm font-semibold' }, 'Photo by Drew Beamer'),
              createElement('div', { className: 'text-xs text-muted-foreground' }, 'Unsplash \u2014 16:9 Widescreen'),
            ),
          ),
        ),
      ),
    ),

    // 1:1 Square
    createElement(SectionHeading, { id: 'square' }, 'Square (1:1)'),
    createElement(DemoBox, { className: 'block p-8' },
      createElement('div', { className: 'max-w-[250px] mx-auto' },
        createElement(AspectRatio, { ratio: 1, className: 'rounded-lg overflow-hidden' },
          createElement('div', {
            className: 'w-full h-full bg-gradient-to-br from-accent via-muted to-accent/50 flex items-center justify-center',
          },
            createElement('div', { className: 'text-center' },
              createElement('div', { className: 'text-2xl mb-1' }, '\uD83D\uDDBC\uFE0F'),
              createElement('div', { className: 'text-xs text-muted-foreground' }, '1:1 Square'),
            ),
          ),
        ),
      ),
    ),

    // Multiple ratios
    createElement(SectionHeading, { id: 'ratios' }, 'Common Ratios'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Use the ratio prop to set common aspect ratios.',
    ),
    createElement(DemoBox, { className: 'block p-8' },
      createElement('div', { className: 'flex flex-wrap items-end justify-center gap-6 max-w-3xl mx-auto' },
        ...[
          { ratio: 16 / 9, label: '16:9', desc: 'Widescreen', color: 'from-blue-500/20 to-blue-500/5', width: '280px' },
          { ratio: 4 / 3, label: '4:3', desc: 'Classic TV', color: 'from-green-500/20 to-green-500/5', width: '200px' },
          { ratio: 1, label: '1:1', desc: 'Square', color: 'from-purple-500/20 to-purple-500/5', width: '160px' },
          { ratio: 3 / 2, label: '3:2', desc: 'Photography', color: 'from-orange-500/20 to-orange-500/5', width: '210px' },
          { ratio: 21 / 9, label: '21:9', desc: 'Ultrawide', color: 'from-red-500/20 to-red-500/5', width: '320px' },
          { ratio: 9 / 16, label: '9:16', desc: 'Portrait', color: 'from-teal-500/20 to-teal-500/5', width: '100px' },
        ].map((item) =>
          createElement('div', { key: item.label, style: { width: item.width } },
            createElement(AspectRatio, { ratio: item.ratio, className: 'rounded-lg overflow-hidden border' },
              createElement('div', {
                className: cn('w-full h-full flex flex-col items-center justify-center bg-gradient-to-br', item.color),
              },
                createElement('span', { className: 'text-sm font-bold' }, item.label),
                createElement('span', { className: 'text-xs text-muted-foreground' }, item.desc),
              ),
            ),
          ),
        ),
      ),
    ),

    // Video placeholder
    createElement(SectionHeading, { id: 'with-content' }, 'With Embedded Content'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'AspectRatio works with any content \u2014 images, videos, maps, or iframes.',
    ),
    createElement(DemoBox, { className: 'block p-8' },
      createElement('div', { className: 'max-w-md mx-auto' },
        createElement(AspectRatio, { ratio: 16 / 9, className: 'rounded-lg overflow-hidden border' },
          createElement('div', {
            className: 'w-full h-full bg-gradient-to-br from-muted to-muted/50 flex flex-col items-center justify-center gap-2',
          },
            createElement('svg', { className: 'size-10 text-muted-foreground/40', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
              createElement('polygon', { points: '5 3 19 12 5 21 5 3' }),
            ),
            createElement('span', { className: 'text-xs text-muted-foreground' }, 'Video / iframe placeholder'),
          ),
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
