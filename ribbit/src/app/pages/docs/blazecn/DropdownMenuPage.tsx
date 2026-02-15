import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from '../../../ui/DropdownMenu';
import { Button } from '../../../ui/Button';

interface DropdownMenuPageState {
  open: boolean;
}

export class DropdownMenuPage extends Component<{}, DropdownMenuPageState> {
  declare state: DropdownMenuPageState;

  constructor(props: {}) {
    super(props);
    this.state = { open: false };
  }

  render() {
    const { open } = this.state;

    return createElement('div', { className: 'space-y-10' },
      createElement(PageHeader, {
        title: 'Dropdown Menu',
        description: 'Displays a menu of actions or options triggered by a button. Supports labels, separators, disabled items, and destructive actions.',
      }),

      // Demo
      createElement(SectionHeading, { id: 'demo' }, 'Demo'),
      createElement(DemoBox, null,
        createElement(DropdownMenu, null,
          createElement(DropdownMenuTrigger, {
            onClick: () => this.setState({ open: !open }),
          },
            createElement(Button, { variant: 'outline' }, 'Open Menu'),
          ),
          createElement(DropdownMenuContent, {
            open,
            onClose: () => this.setState({ open: false }),
          },
            createElement(DropdownMenuLabel, null, 'My Account'),
            createElement(DropdownMenuSeparator, null),
            createElement(DropdownMenuItem, { onClick: () => this.setState({ open: false }) }, 'Profile'),
            createElement(DropdownMenuItem, { onClick: () => this.setState({ open: false }) }, 'Settings'),
            createElement(DropdownMenuItem, { onClick: () => this.setState({ open: false }) }, 'Keyboard shortcuts'),
            createElement(DropdownMenuSeparator, null),
            createElement(DropdownMenuItem, { disabled: true }, 'API (coming soon)'),
            createElement(DropdownMenuSeparator, null),
            createElement(DropdownMenuItem, {
              destructive: true,
              onClick: () => this.setState({ open: false }),
            }, 'Delete account'),
          ),
        ),
      ),

      // Usage
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement(CodeBlock, { code: `import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from './ui/DropdownMenu'

<DropdownMenu>
  <DropdownMenuTrigger onClick={toggle}>
    <Button variant="outline">Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent open={open} onClose={close}>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
    <DropdownMenuItem disabled>Archive</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem destructive>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>` }),

      // Behavior
      createElement(SectionHeading, { id: 'behavior' }, 'Behavior'),
      createElement('ul', { className: 'text-sm text-muted-foreground space-y-1 list-disc pl-5' },
        createElement('li', null, 'Click-outside closes the menu via a document mousedown listener'),
        createElement('li', null, 'Escape key closes the menu'),
        createElement('li', null, 'Positioned relative to the trigger (no portals in InfernoJS)'),
        createElement('li', null, 'Supports align (start/center/end) and side (top/bottom) positioning'),
      ),

      // Props
      createElement(SectionHeading, { id: 'props' }, 'Props'),
      createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'DropdownMenuContent'),
      createElement(PropTable, {
        rows: [
          { prop: 'open', type: 'boolean', default: 'false' },
          { prop: 'onClose', type: '() => void', default: '\u2014' },
          { prop: 'align', type: "'start' | 'center' | 'end'", default: "'end'" },
          { prop: 'side', type: "'top' | 'bottom'", default: "'bottom'" },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'DropdownMenuItem'),
      createElement(PropTable, {
        rows: [
          { prop: 'disabled', type: 'boolean', default: 'false' },
          { prop: 'destructive', type: 'boolean', default: 'false' },
          { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
    );
  }
}
