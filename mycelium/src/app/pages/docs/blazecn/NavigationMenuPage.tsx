import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem,
  NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink,
} from '../../../ui/NavigationMenu';

export function NavigationMenuPage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Navigation Menu',
      description: 'A collection of links for navigating websites, with support for dropdown panels.',
    }),

    // Demo
    createElement(SectionHeading, { id: 'demo' }, 'Demo'),
    createElement('p', { className: 'text-xs text-muted-foreground mb-3 sm:hidden' },
      'Scroll horizontally to see the full navigation menu.',
    ),
    createElement(DemoBox, { className: 'block p-8 overflow-visible min-h-[320px] items-start' },
      createElement(NavigationMenu, { className: 'min-w-[500px]' },
        createElement(NavigationMenuList, null,
          // Getting Started — featured card layout
          createElement(NavigationMenuItem, null,
            createElement(NavigationMenuTrigger, null, 'Getting Started'),
            createElement(NavigationMenuContent, { className: 'w-[500px]' },
              createElement('ul', { className: 'grid gap-3 p-4 md:grid-cols-[.75fr_1fr]' },
                // Featured card
                createElement('li', { className: 'row-span-3' },
                  createElement('a', {
                    href: '#',
                    className: 'flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md',
                  },
                    createElement('div', { className: 'text-lg font-medium mb-2' }, '\u26A1 Blazecn'),
                    createElement('p', { className: 'text-sm leading-tight text-muted-foreground' },
                      'Beautifully designed components built with Inferno and Tailwind CSS.',
                    ),
                  ),
                ),
                // Links
                createElement('li', null,
                  createElement(NavigationMenuLink, { href: '#' },
                    createElement('div', { className: 'text-sm font-medium leading-none' }, 'Introduction'),
                    createElement('p', { className: 'line-clamp-2 text-sm leading-snug text-muted-foreground mt-1' },
                      'Re-usable components for your InfernoJS apps.',
                    ),
                  ),
                ),
                createElement('li', null,
                  createElement(NavigationMenuLink, { href: '#' },
                    createElement('div', { className: 'text-sm font-medium leading-none' }, 'Installation'),
                    createElement('p', { className: 'line-clamp-2 text-sm leading-snug text-muted-foreground mt-1' },
                      'How to install dependencies and structure your app.',
                    ),
                  ),
                ),
                createElement('li', null,
                  createElement(NavigationMenuLink, { href: '#' },
                    createElement('div', { className: 'text-sm font-medium leading-none' }, 'Typography'),
                    createElement('p', { className: 'line-clamp-2 text-sm leading-snug text-muted-foreground mt-1' },
                      'Styles for headings, paragraphs, lists, and more.',
                    ),
                  ),
                ),
              ),
            ),
          ),
          // Components — standard 2-col grid
          createElement(NavigationMenuItem, null,
            createElement(NavigationMenuTrigger, null, 'Components'),
            createElement(NavigationMenuContent, { className: 'w-[500px]' },
              createElement('ul', { className: 'grid gap-3 p-4 md:grid-cols-2' },
                ...[
                  { title: 'Alert Dialog', desc: 'A modal dialog that interrupts the user with important content.' },
                  { title: 'Hover Card', desc: 'For sighted users to preview content available behind a link.' },
                  { title: 'Progress', desc: 'Displays an indicator showing the completion progress of a task.' },
                  { title: 'Scroll Area', desc: 'Augments native scroll functionality for custom, cross-browser styling.' },
                  { title: 'Tabs', desc: 'A set of layered sections of content, known as tab panels.' },
                  { title: 'Tooltip', desc: 'A popup that displays information related to an element on hover.' },
                ].map((item) =>
                  createElement('li', { key: item.title },
                    createElement(NavigationMenuLink, { href: '#' },
                      createElement('div', { className: 'text-sm font-medium leading-none' }, item.title),
                      createElement('p', { className: 'line-clamp-2 text-sm leading-snug text-muted-foreground mt-1' }, item.desc),
                    ),
                  ),
                ),
              ),
            ),
          ),
          // Documentation — plain link (no dropdown)
          createElement(NavigationMenuItem, null,
            createElement(NavigationMenuLink, {
              href: '#',
              className: 'inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
            }, 'Documentation'),
          ),
        ),
      ),
    ),

    // Usage
    createElement(SectionHeading, { id: 'usage' }, 'Usage'),
    createElement(CodeBlock, { code: `import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem,
  NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink,
} from '@/ui/NavigationMenu'

createElement(NavigationMenu, null,
  createElement(NavigationMenuList, null,
    createElement(NavigationMenuItem, null,
      createElement(NavigationMenuTrigger, null, 'Getting Started'),
      createElement(NavigationMenuContent, null,
        createElement(NavigationMenuLink, { href: '/docs' }, 'Introduction'),
      ),
    ),
  ),
)` }),

    // Props
    createElement(SectionHeading, { id: 'props' }, 'Props'),
    createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'NavigationMenuLink'),
    createElement(PropTable, {
      rows: [
        { prop: 'href', type: 'string', default: '\u2014' },
        { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
      ],
    }),
  );
}
