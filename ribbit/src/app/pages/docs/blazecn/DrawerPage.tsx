import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import {
  Drawer, DrawerContent, DrawerHeader, DrawerFooter,
  DrawerTitle, DrawerDescription,
} from '../../../ui/Drawer';
import { Button } from '../../../ui/Button';

interface DrawerPageState {
  open: boolean;
}

export class DrawerPage extends Component<{}, DrawerPageState> {
  declare state: DrawerPageState;

  constructor(props: {}) {
    super(props);
    this.state = { open: false };
  }

  render() {
    const { open } = this.state;

    return createElement('div', { className: 'space-y-10' },
      createElement(PageHeader, {
        title: 'Drawer',
        description: 'A mobile-friendly panel that slides up from the bottom of the screen.',
      }),

      // Demo
      createElement(SectionHeading, { id: 'demo' }, 'Demo'),
      createElement(DemoBox, null,
        createElement(Button, {
          variant: 'outline',
          onClick: () => this.setState({ open: true }),
        }, 'Open Drawer'),
        createElement(Drawer, { open, onOpenChange: (v: boolean) => this.setState({ open: v }) },
          createElement(DrawerContent, null,
            createElement(DrawerHeader, null,
              createElement(DrawerTitle, null, 'Move Goal'),
              createElement(DrawerDescription, null, 'Set your daily activity goal.'),
            ),
            createElement('div', { className: 'p-4' },
              createElement('div', { className: 'flex items-center justify-center gap-4' },
                createElement(Button, {
                  variant: 'outline',
                  size: 'icon',
                  onClick: () => {},
                }, '\u2212'),
                createElement('div', { className: 'text-center' },
                  createElement('div', { className: 'text-6xl font-bold tracking-tighter' }, '350'),
                  createElement('div', { className: 'text-xs uppercase text-muted-foreground tracking-wide' }, 'Calories/day'),
                ),
                createElement(Button, {
                  variant: 'outline',
                  size: 'icon',
                  onClick: () => {},
                }, '+'),
              ),
            ),
            createElement(DrawerFooter, null,
              createElement(Button, {
                onClick: () => this.setState({ open: false }),
              }, 'Submit'),
              createElement(Button, {
                variant: 'outline',
                onClick: () => this.setState({ open: false }),
              }, 'Cancel'),
            ),
          ),
        ),
      ),

      // Usage
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement(CodeBlock, { code: `import {
  Drawer, DrawerContent, DrawerHeader, DrawerFooter,
  DrawerTitle, DrawerDescription,
} from '@/ui/Drawer'

createElement(Drawer, { open },
  createElement(DrawerContent, { onClose: close },
    createElement(DrawerHeader, null,
      createElement(DrawerTitle, null, 'Title'),
      createElement(DrawerDescription, null, 'Description'),
    ),
    createElement(DrawerFooter, null,
      createElement(Button, { onClick: submit }, 'Submit'),
      createElement(Button, { variant: 'outline', onClick: close }, 'Cancel'),
    ),
  ),
)` }),

      // Props
      createElement(SectionHeading, { id: 'props' }, 'Props'),
      createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'Drawer'),
      createElement(PropTable, {
        rows: [
          { prop: 'open', type: 'boolean', default: 'false' },
          { prop: 'onOpenChange', type: '(open: boolean) => void', default: '\u2014' },
        ],
      }),
      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'DrawerContent'),
      createElement(PropTable, {
        rows: [
          { prop: 'onClose', type: '() => void', default: '\u2014' },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
    );
  }
}
