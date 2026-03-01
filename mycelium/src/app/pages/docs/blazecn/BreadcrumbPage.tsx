import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis,
} from '../../../ui/Breadcrumb';

export function BreadcrumbPage_() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Breadcrumb',
      description: 'Displays the path to the current page using a hierarchy of links. Helps users understand their location within the app.',
    }),

    // Demo
    createElement(SectionHeading, { id: 'demo' }, 'Demo'),
    createElement(DemoBox, null,
      createElement(Breadcrumb, null,
        createElement(BreadcrumbList, null,
          createElement(BreadcrumbItem, null,
            createElement(BreadcrumbLink, { href: '#' }, 'Home'),
          ),
          createElement(BreadcrumbSeparator, null),
          createElement(BreadcrumbItem, null,
            createElement(BreadcrumbLink, { href: '#' }, 'Components'),
          ),
          createElement(BreadcrumbSeparator, null),
          createElement(BreadcrumbItem, null,
            createElement(BreadcrumbPage, null, 'Breadcrumb'),
          ),
        ),
      ),
    ),

    // With ellipsis
    createElement(SectionHeading, { id: 'ellipsis' }, 'With Ellipsis'),
    createElement(DemoBox, null,
      createElement(Breadcrumb, null,
        createElement(BreadcrumbList, null,
          createElement(BreadcrumbItem, null,
            createElement(BreadcrumbLink, { href: '#' }, 'Home'),
          ),
          createElement(BreadcrumbSeparator, null),
          createElement(BreadcrumbItem, null,
            createElement(BreadcrumbEllipsis, null),
          ),
          createElement(BreadcrumbSeparator, null),
          createElement(BreadcrumbItem, null,
            createElement(BreadcrumbLink, { href: '#' }, 'Components'),
          ),
          createElement(BreadcrumbSeparator, null),
          createElement(BreadcrumbItem, null,
            createElement(BreadcrumbPage, null, 'Breadcrumb'),
          ),
        ),
      ),
    ),

    // Usage
    createElement(SectionHeading, { id: 'usage' }, 'Usage'),
    createElement(CodeBlock, { code: `import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from './ui/Breadcrumb'

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>` }),

    // Parts
    createElement(SectionHeading, { id: 'parts' }, 'Parts'),
    createElement('ul', { className: 'text-sm text-muted-foreground space-y-1 list-disc pl-5' },
      createElement('li', null, createElement('strong', null, 'Breadcrumb'), ' \u2014 Root nav element with aria-label'),
      createElement('li', null, createElement('strong', null, 'BreadcrumbList'), ' \u2014 Ordered list container'),
      createElement('li', null, createElement('strong', null, 'BreadcrumbItem'), ' \u2014 List item wrapper'),
      createElement('li', null, createElement('strong', null, 'BreadcrumbLink'), ' \u2014 Clickable link (renders <a> if href, <button> otherwise)'),
      createElement('li', null, createElement('strong', null, 'BreadcrumbPage'), ' \u2014 Current page (non-clickable, aria-current="page")'),
      createElement('li', null, createElement('strong', null, 'BreadcrumbSeparator'), ' \u2014 Chevron separator (customizable via children)'),
      createElement('li', null, createElement('strong', null, 'BreadcrumbEllipsis'), ' \u2014 Ellipsis indicator for collapsed items'),
    ),

    // Props
    createElement(SectionHeading, { id: 'props' }, 'Props'),
    createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'BreadcrumbLink'),
    createElement(PropTable, {
      rows: [
        { prop: 'href', type: 'string', default: '\u2014' },
        { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
        { prop: 'className', type: 'string', default: '\u2014' },
      ],
    }),
  );
}
