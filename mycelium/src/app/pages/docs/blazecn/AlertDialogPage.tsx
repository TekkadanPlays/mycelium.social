import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
} from '../../../ui/AlertDialog';
import { Button } from '../../../ui/Button';

interface AlertDialogPageState {
  open: boolean;
}

export class AlertDialogPage extends Component<{}, AlertDialogPageState> {
  declare state: AlertDialogPageState;

  constructor(props: {}) {
    super(props);
    this.state = { open: false };
  }

  render() {
    const { open } = this.state;

    return createElement('div', { className: 'space-y-10' },
      createElement(PageHeader, {
        title: 'Alert Dialog',
        description: 'A modal dialog that interrupts the user with important content and expects a response.',
      }),

      // Demo
      createElement(SectionHeading, { id: 'demo' }, 'Demo'),
      createElement(DemoBox, null,
        createElement(Button, {
          variant: 'outline',
          onClick: () => this.setState({ open: true }),
        }, 'Show Dialog'),
        createElement(AlertDialog, { open },
          createElement(AlertDialogContent, null,
            createElement(AlertDialogHeader, null,
              createElement(AlertDialogTitle, null, 'Are you absolutely sure?'),
              createElement(AlertDialogDescription, null,
                'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
              ),
            ),
            createElement(AlertDialogFooter, null,
              createElement(AlertDialogCancel, {
                onClick: () => this.setState({ open: false }),
              }, 'Cancel'),
              createElement(AlertDialogAction, {
                onClick: () => this.setState({ open: false }),
              }, 'Continue'),
            ),
          ),
        ),
      ),

      // Usage
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement(CodeBlock, { code: `import {
  AlertDialog, AlertDialogContent, AlertDialogHeader,
  AlertDialogFooter, AlertDialogTitle, AlertDialogDescription,
  AlertDialogAction, AlertDialogCancel,
} from '@/ui/AlertDialog'

createElement(AlertDialog, { open },
  createElement(AlertDialogContent, null,
    createElement(AlertDialogHeader, null,
      createElement(AlertDialogTitle, null, 'Are you sure?'),
      createElement(AlertDialogDescription, null, 'This cannot be undone.'),
    ),
    createElement(AlertDialogFooter, null,
      createElement(AlertDialogCancel, { onClick: close }, 'Cancel'),
      createElement(AlertDialogAction, { onClick: confirm }, 'Continue'),
    ),
  ),
)` }),

      // Behavior
      createElement(SectionHeading, { id: 'behavior' }, 'Behavior'),
      createElement('ul', { className: 'text-sm text-muted-foreground space-y-1 list-disc pl-5' },
        createElement('li', null, 'No close (X) button \u2014 user must choose an action'),
        createElement('li', null, 'Overlay does not close on click (unlike Dialog)'),
        createElement('li', null, 'Body scroll is locked while open'),
        createElement('li', null, 'Uses role="alertdialog" and aria-modal for accessibility'),
      ),

      // Props
      createElement(SectionHeading, { id: 'props' }, 'Props'),
      createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'AlertDialog'),
      createElement(PropTable, {
        rows: [
          { prop: 'open', type: 'boolean', default: 'false' },
        ],
      }),
      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'AlertDialogAction / AlertDialogCancel'),
      createElement(PropTable, {
        rows: [
          { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
    );
  }
}
