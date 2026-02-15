import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../ui/Dialog';
import { Button } from '../../../ui/Button';
import { PageHeader, DemoBox, CodeBlock } from '../_helpers';

export class DialogPage extends Component<{}, { open: boolean }> {
  declare state: { open: boolean };
  constructor(props: {}) {
    super(props);
    this.state = { open: false };
  }
  render() {
    return createElement('div', { className: 'space-y-8' },
      createElement(PageHeader, {
        title: 'Dialog',
        description: 'A modal dialog that interrupts the user with important content and expects a response.',
      }),
      createElement(DemoBox, null,
        createElement(Button, {
          variant: 'outline',
          onClick: () => this.setState({ open: true }),
        }, 'Open Dialog'),
      ),
      createElement(Dialog, { open: this.state.open, onOpenChange: (open: boolean) => this.setState({ open }) },
        createElement(DialogContent, { onClose: () => this.setState({ open: false }) },
          createElement(DialogHeader, null,
            createElement(DialogTitle, null, 'Are you sure?'),
            createElement(DialogDescription, null, 'This action cannot be undone. This will permanently delete your account.'),
          ),
          createElement(DialogFooter, null,
            createElement(Button, { variant: 'outline', onClick: () => this.setState({ open: false }) }, 'Cancel'),
            createElement(Button, { variant: 'destructive', onClick: () => this.setState({ open: false }) }, 'Delete'),
          ),
        ),
      ),
      createElement(CodeBlock, { code: "import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/ui/Dialog'\n\ncreateElement(Dialog, { open: isOpen },\n  createElement(DialogContent, { onClose: () => setOpen(false) },\n    createElement(DialogHeader, null,\n      createElement(DialogTitle, null, 'Title'),\n      createElement(DialogDescription, null, 'Description'),\n    ),\n    createElement(DialogFooter, null,\n      createElement(Button, { onClick: close }, 'OK'),\n    ),\n  ),\n)" }),
    );
  }
}
