import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import { Carousel, CarouselItem } from '../../../ui/Carousel';
import { Card, CardContent } from '../../../ui/Card';

export class CarouselPage extends Component<{}, {}> {
  render() {
    const slides = [1, 2, 3, 4, 5];

    return createElement('div', { className: 'space-y-10' },
      createElement(PageHeader, {
        title: 'Carousel',
        description: 'A sliding content carousel with previous/next navigation buttons.',
      }),

      // Demo
      createElement(SectionHeading, { id: 'demo' }, 'Demo'),
      createElement(DemoBox, { className: 'block p-12' },
        createElement('div', { className: 'max-w-xs mx-auto' },
          createElement(Carousel, null,
            ...slides.map((n) =>
              createElement(CarouselItem, { key: String(n) },
                createElement('div', { className: 'p-1' },
                  createElement(Card, null,
                    createElement(CardContent, { className: 'flex aspect-square items-center justify-center p-6' },
                      createElement('span', { className: 'text-4xl font-semibold' }, String(n)),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),

      // Sizes
      createElement(SectionHeading, { id: 'sizes' }, 'With Different Content'),
      createElement(DemoBox, { className: 'block p-12' },
        createElement('div', { className: 'max-w-sm mx-auto' },
          createElement(Carousel, null,
            createElement(CarouselItem, { key: 'a' },
              createElement('div', { className: 'p-1' },
                createElement('div', { className: 'rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-8 text-center' },
                  createElement('h3', { className: 'text-lg font-semibold mb-2' }, 'Welcome'),
                  createElement('p', { className: 'text-sm text-muted-foreground' }, 'Get started with Blazecn components.'),
                ),
              ),
            ),
            createElement(CarouselItem, { key: 'b' },
              createElement('div', { className: 'p-1' },
                createElement('div', { className: 'rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-8 text-center' },
                  createElement('h3', { className: 'text-lg font-semibold mb-2' }, 'Customize'),
                  createElement('p', { className: 'text-sm text-muted-foreground' }, 'Every component is a single file you own.'),
                ),
              ),
            ),
            createElement(CarouselItem, { key: 'c' },
              createElement('div', { className: 'p-1' },
                createElement('div', { className: 'rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/5 p-8 text-center' },
                  createElement('h3', { className: 'text-lg font-semibold mb-2' }, 'Ship'),
                  createElement('p', { className: 'text-sm text-muted-foreground' }, 'Build and deploy with confidence.'),
                ),
              ),
            ),
          ),
        ),
      ),

      // Usage
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement(CodeBlock, { code: `import { Carousel, CarouselItem } from '@/ui/Carousel'

createElement(Carousel, null,
  createElement(CarouselItem, null,
    createElement('div', null, 'Slide 1'),
  ),
  createElement(CarouselItem, null,
    createElement('div', null, 'Slide 2'),
  ),
  createElement(CarouselItem, null,
    createElement('div', null, 'Slide 3'),
  ),
)` }),

      // Props
      createElement(SectionHeading, { id: 'props' }, 'Props'),
      createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'Carousel'),
      createElement(PropTable, {
        rows: [
          { prop: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'CarouselItem'),
      createElement(PropTable, {
        rows: [
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
    );
  }
}
