import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../../../ui/Collapsible';
import { Button } from '../../../ui/Button';

interface CollapsiblePageState {
  open: boolean;
}

export class CollapsiblePage extends Component<{}, CollapsiblePageState> {
  declare state: CollapsiblePageState;

  constructor(props: {}) {
    super(props);
    this.state = { open: false };
  }

  render() {
    const { open } = this.state;

    return createElement('div', { className: 'space-y-10' },
      createElement(PageHeader, {
        title: 'Collapsible',
        description: 'An interactive component that expands and collapses a panel of content.',
      }),

      // Demo
      createElement(SectionHeading, { id: 'demo' }, 'Demo'),
      createElement(DemoBox, null,
        createElement(Collapsible, { open },
          createElement('div', { className: 'flex items-center justify-between space-x-4 px-4' },
            createElement('h4', { className: 'text-sm font-semibold' }, '@peduarte starred 3 repositories'),
            createElement(CollapsibleTrigger, {
              open,
              onClick: () => this.setState({ open: !open }),
            },
              createElement(Button, { variant: 'ghost', size: 'sm' }, open ? '\u25B2' : '\u25BC'),
            ),
          ),
          createElement('div', { className: 'rounded-md border border-border px-4 py-2 font-mono text-sm mt-2' },
            '@radix-ui/primitives',
          ),
          createElement(CollapsibleContent, { open },
            createElement('div', { className: 'space-y-2 mt-2' },
              createElement('div', { className: 'rounded-md border border-border px-4 py-2 font-mono text-sm' },
                '@radix-ui/colors',
              ),
              createElement('div', { className: 'rounded-md border border-border px-4 py-2 font-mono text-sm' },
                '@stitches/react',
              ),
            ),
          ),
        ),
      ),

      // Usage
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement(CodeBlock, { code: `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/Collapsible'

// Manage open state yourself
const [open, setOpen] = useState(false)

<Collapsible open={open}>
  <CollapsibleTrigger open={open} onClick={() => setOpen(!open)}>
    Toggle
  </CollapsibleTrigger>
  <CollapsibleContent open={open}>
    Hidden content here
  </CollapsibleContent>
</Collapsible>` }),

      // Props
      createElement(SectionHeading, { id: 'props' }, 'Props'),
      createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'Collapsible'),
      createElement(PropTable, {
        rows: [
          { prop: 'open', type: 'boolean', default: 'false' },
          { prop: 'onOpenChange', type: '(open: boolean) => void', default: '\u2014' },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'CollapsibleTrigger'),
      createElement(PropTable, {
        rows: [
          { prop: 'open', type: 'boolean', default: 'false' },
          { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'CollapsibleContent'),
      createElement(PropTable, {
        rows: [
          { prop: 'open', type: 'boolean', default: 'false' },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
    );
  }
}
