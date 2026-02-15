import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis,
} from '../../../ui/Pagination';

interface PaginationPageState {
  page: number;
}

export class PaginationPage_ extends Component<{}, PaginationPageState> {
  declare state: PaginationPageState;

  constructor(props: {}) {
    super(props);
    this.state = { page: 2 };
  }

  render() {
    const { page } = this.state;

    return createElement('div', { className: 'space-y-10' },
      createElement(PageHeader, {
        title: 'Pagination',
        description: 'Navigation component for paging through content. Supports previous/next buttons, page links, and ellipsis.',
      }),

      // Demo
      createElement(SectionHeading, { id: 'demo' }, 'Demo'),
      createElement(DemoBox, null,
        createElement(Pagination, null,
          createElement(PaginationContent, null,
            createElement(PaginationItem, null,
              createElement(PaginationPrevious, {
                onClick: () => this.setState({ page: Math.max(1, page - 1) }),
                disabled: page === 1,
              }),
            ),
            ...[1, 2, 3].map((n) =>
              createElement(PaginationItem, { key: String(n) },
                createElement(PaginationLink, {
                  isActive: page === n,
                  onClick: () => this.setState({ page: n }),
                }, String(n)),
              ),
            ),
            createElement(PaginationItem, null,
              createElement(PaginationEllipsis, null),
            ),
            createElement(PaginationItem, null,
              createElement(PaginationNext, {
                onClick: () => this.setState({ page: Math.min(10, page + 1) }),
                disabled: page === 10,
              }),
            ),
          ),
        ),
      ),
      createElement('p', { className: 'text-xs text-muted-foreground text-center' },
        'Current page: ' + page,
      ),

      // Usage
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement(CodeBlock, { code: `import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis,
} from './ui/Pagination'

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious onClick={prev} disabled={page === 1} />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink isActive={page === 1} onClick={() => setPage(1)}>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink isActive={page === 2} onClick={() => setPage(2)}>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext onClick={next} disabled={page === last} />
    </PaginationItem>
  </PaginationContent>
</Pagination>` }),

      // Parts
      createElement(SectionHeading, { id: 'parts' }, 'Parts'),
      createElement('ul', { className: 'text-sm text-muted-foreground space-y-1 list-disc pl-5' },
        createElement('li', null, createElement('strong', null, 'Pagination'), ' \u2014 Root nav with aria-label="pagination"'),
        createElement('li', null, createElement('strong', null, 'PaginationContent'), ' \u2014 Flex container for items'),
        createElement('li', null, createElement('strong', null, 'PaginationItem'), ' \u2014 List item wrapper'),
        createElement('li', null, createElement('strong', null, 'PaginationLink'), ' \u2014 Page button (uses Button ghost/outline variants)'),
        createElement('li', null, createElement('strong', null, 'PaginationPrevious / PaginationNext'), ' \u2014 Navigation buttons with chevron icons'),
        createElement('li', null, createElement('strong', null, 'PaginationEllipsis'), ' \u2014 Dots indicator for skipped pages'),
      ),

      // Props
      createElement(SectionHeading, { id: 'props' }, 'Props'),
      createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'PaginationLink'),
      createElement(PropTable, {
        rows: [
          { prop: 'isActive', type: 'boolean', default: 'false' },
          { prop: 'disabled', type: 'boolean', default: 'false' },
          { prop: 'size', type: "'default' | 'sm' | 'lg' | 'icon'", default: "'icon'" },
          { prop: 'href', type: 'string', default: '\u2014' },
          { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'PaginationPrevious / PaginationNext'),
      createElement(PropTable, {
        rows: [
          { prop: 'href', type: 'string', default: '\u2014' },
          { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
          { prop: 'disabled', type: 'boolean', default: 'false' },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
    );
  }
}
