import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '../../../ui/Sheet';
import { Button } from '../../../ui/Button';

interface SheetPageState {
  openRight: boolean;
  openLeft: boolean;
}

export class SheetPage extends Component<{}, SheetPageState> {
  declare state: SheetPageState;

  constructor(props: {}) {
    super(props);
    this.state = { openRight: false, openLeft: false };
  }

  render() {
    const { openRight, openLeft } = this.state;

    return createElement('div', { className: 'space-y-10' },
      createElement(PageHeader, {
        title: 'Sheet',
        description: 'A slide-over panel that extends from the edge of the screen. Useful for navigation, forms, or detail views.',
      }),

      // Demo
      createElement(SectionHeading, { id: 'demo' }, 'Demo'),
      createElement(DemoBox, null,
        createElement('div', { className: 'flex gap-3' },
          createElement(Button, {
            variant: 'outline',
            onClick: () => this.setState({ openRight: true }),
          }, 'Open Right'),
          createElement(Button, {
            variant: 'outline',
            onClick: () => this.setState({ openLeft: true }),
          }, 'Open Left'),
        ),
      ),

      // Right sheet
      createElement(Sheet, { open: openRight, onOpenChange: (v: boolean) => this.setState({ openRight: v }) },
        createElement(SheetContent, {
          side: 'right',
        },
          createElement(SheetHeader, null,
            createElement(SheetTitle, null, 'Edit Profile'),
            createElement(SheetDescription, null, 'Make changes to your profile here. Click save when you\'re done.'),
          ),
          createElement('div', { className: 'py-4 text-sm text-muted-foreground' },
            'Sheet content goes here.',
          ),
          createElement(SheetFooter, null,
            createElement(Button, {
              onClick: () => this.setState({ openRight: false }),
            }, 'Save changes'),
          ),
        ),
      ),

      // Left sheet
      createElement(Sheet, { open: openLeft, onOpenChange: (v: boolean) => this.setState({ openLeft: v }) },
        createElement(SheetContent, {
          side: 'left',
        },
          createElement(SheetHeader, null,
            createElement(SheetTitle, null, 'Navigation'),
            createElement(SheetDescription, null, 'Browse the sidebar.'),
          ),
          createElement('div', { className: 'py-4 text-sm text-muted-foreground' },
            'Navigation links would go here.',
          ),
        ),
      ),

      // Usage
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement(CodeBlock, { code: `import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from './ui/Sheet'

<Sheet open={open}>
  <SheetContent side="right" onClose={() => setOpen(false)}>
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
      <SheetDescription>Description text</SheetDescription>
    </SheetHeader>
    <div>Content</div>
    <SheetFooter>
      <Button onClick={save}>Save</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>` }),

      // Sides
      createElement(SectionHeading, { id: 'sides' }, 'Sides'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'SheetContent supports four sides: top, bottom, left, and right. The default is right.',
      ),

      // Props
      createElement(SectionHeading, { id: 'props' }, 'Props'),
      createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'Sheet'),
      createElement(PropTable, {
        rows: [
          { prop: 'open', type: 'boolean', default: 'false' },
          { prop: 'onOpenChange', type: '(open: boolean) => void', default: '\u2014' },
        ],
      }),
      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'SheetContent'),
      createElement(PropTable, {
        rows: [
          { prop: 'side', type: "'top' | 'bottom' | 'left' | 'right'", default: "'right'" },
          { prop: 'onClose', type: '() => void', default: '\u2014' },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
    );
  }
}
