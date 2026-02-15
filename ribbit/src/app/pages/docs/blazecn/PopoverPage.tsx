import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import { Popover, PopoverTrigger, PopoverContent } from '../../../ui/Popover';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Label } from '../../../ui/Label';

interface PopoverPageState {
  open: boolean;
}

export class PopoverPage extends Component<{}, PopoverPageState> {
  declare state: PopoverPageState;

  constructor(props: {}) {
    super(props);
    this.state = { open: false };
  }

  render() {
    const { open } = this.state;

    return createElement('div', { className: 'space-y-10' },
      createElement(PageHeader, {
        title: 'Popover',
        description: 'Displays rich content in a floating panel anchored to a trigger element.',
      }),

      // Demo
      createElement(SectionHeading, { id: 'demo' }, 'Demo'),
      createElement(DemoBox, null,
        createElement(Popover, null,
          createElement(PopoverTrigger, {
            onClick: () => this.setState({ open: !open }),
          },
            createElement(Button, { variant: 'outline' }, 'Open Popover'),
          ),
          createElement(PopoverContent, {
            open,
            onClose: () => this.setState({ open: false }),
          },
            createElement('div', { className: 'grid gap-4' },
              createElement('div', { className: 'space-y-2' },
                createElement('h4', { className: 'font-medium leading-none' }, 'Dimensions'),
                createElement('p', { className: 'text-sm text-muted-foreground' }, 'Set the dimensions for the layer.'),
              ),
              createElement('div', { className: 'grid gap-2' },
                createElement(Label, null, 'Width'),
                createElement(Input, { type: 'text', placeholder: '100%' }),
                createElement(Label, null, 'Height'),
                createElement(Input, { type: 'text', placeholder: '25px' }),
              ),
            ),
          ),
        ),
      ),

      // Usage
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement(CodeBlock, { code: `import { Popover, PopoverTrigger, PopoverContent } from './ui/Popover'

<Popover>
  <PopoverTrigger onClick={toggle}>
    <Button variant="outline">Open</Button>
  </PopoverTrigger>
  <PopoverContent open={open} onClose={close} align="start">
    <p>Popover content here</p>
  </PopoverContent>
</Popover>` }),

      // Props
      createElement(SectionHeading, { id: 'props' }, 'Props'),
      createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'PopoverContent'),
      createElement(PropTable, {
        rows: [
          { prop: 'open', type: 'boolean', default: 'false' },
          { prop: 'onClose', type: '() => void', default: '\u2014' },
          { prop: 'align', type: "'start' | 'center' | 'end'", default: "'center'" },
          { prop: 'side', type: "'top' | 'bottom'", default: "'bottom'" },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
    );
  }
}
