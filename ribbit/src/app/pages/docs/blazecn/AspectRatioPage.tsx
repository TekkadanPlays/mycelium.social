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

    // Multiple ratios
    createElement(SectionHeading, { id: 'ratios' }, 'Common Ratios'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Use the ratio prop to set common aspect ratios.',
    ),
    createElement(DemoBox, { className: 'block p-8' },
      createElement('div', { className: 'grid grid-cols-3 gap-6 max-w-2xl mx-auto' },
        ...[
          { ratio: 16 / 9, label: '16:9' },
          { ratio: 4 / 3, label: '4:3' },
          { ratio: 1, label: '1:1' },
          { ratio: 3 / 4, label: '3:4' },
          { ratio: 21 / 9, label: '21:9' },
          { ratio: 3 / 2, label: '3:2' },
        ].map((item) =>
          createElement('div', { key: item.label },
            createElement('p', { className: 'text-xs text-muted-foreground mb-2 text-center font-mono' }, item.label),
            createElement(AspectRatio, { ratio: item.ratio, className: 'rounded-lg overflow-hidden bg-muted' },
              createElement('div', {
                className: 'w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5',
              },
                createElement('span', { className: 'text-xs font-mono text-muted-foreground' }, item.label),
              ),
            ),
          ),
        ),
      ),
    ),

    // With map / iframe
    createElement(SectionHeading, { id: 'with-content' }, 'With Embedded Content'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'AspectRatio works with any content, not just images. Use it for videos, maps, or any embedded content.',
    ),
    createElement(DemoBox, { className: 'block p-8' },
      createElement('div', { className: 'max-w-md mx-auto' },
        createElement(AspectRatio, { ratio: 16 / 9, className: 'rounded-lg overflow-hidden bg-muted border border-border' },
          createElement('div', {
            className: 'w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/50',
          },
            createElement('svg', { className: 'size-8 text-muted-foreground/50', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
              createElement('path', { d: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' }),
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
