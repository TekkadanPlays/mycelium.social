import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../ui/Dialog';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Label } from '../../../ui/Label';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';

interface DialogPageState {
  basic: boolean;
  profile: boolean;
  confirm: boolean;
}

export class DialogPage extends Component<{}, DialogPageState> {
  declare state: DialogPageState;
  constructor(props: {}) {
    super(props);
    this.state = { basic: false, profile: false, confirm: false };
  }
  render() {
    const s = this.state;

    return createElement('div', { className: 'space-y-10' },
      createElement(PageHeader, {
        title: 'Dialog',
        description: 'A modal dialog that interrupts the user with important content and expects a response.',
      }),

      // Basic
      createElement(SectionHeading, { id: 'demo' }, 'Demo'),
      createElement(DemoBox, null,
        createElement(Button, {
          variant: 'outline',
          onClick: () => this.setState({ basic: true }),
        }, 'Open Dialog'),
      ),
      createElement(Dialog, { open: s.basic, onOpenChange: (open: boolean) => this.setState({ basic: open }) },
        createElement(DialogContent, { onClose: () => this.setState({ basic: false }) },
          createElement(DialogHeader, null,
            createElement(DialogTitle, null, 'Are you absolutely sure?'),
            createElement(DialogDescription, null, 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.'),
          ),
          createElement(DialogFooter, null,
            createElement(Button, { variant: 'outline', onClick: () => this.setState({ basic: false }) }, 'Cancel'),
            createElement(Button, { variant: 'destructive', onClick: () => this.setState({ basic: false }) }, 'Delete'),
          ),
        ),
      ),

      // Edit Profile
      createElement(SectionHeading, { id: 'edit-profile' }, 'Edit Profile'),
      createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
        'A dialog with form inputs for editing a profile.',
      ),
      createElement(DemoBox, null,
        createElement(Button, {
          variant: 'outline',
          onClick: () => this.setState({ profile: true }),
        }, 'Edit Profile'),
      ),
      createElement(Dialog, { open: s.profile, onOpenChange: (open: boolean) => this.setState({ profile: open }) },
        createElement(DialogContent, { onClose: () => this.setState({ profile: false }) },
          createElement(DialogHeader, null,
            createElement(DialogTitle, null, 'Edit profile'),
            createElement(DialogDescription, null, 'Make changes to your profile here. Click save when you\'re done.'),
          ),
          createElement('div', { className: 'grid gap-4 py-4' },
            createElement('div', { className: 'grid grid-cols-4 items-center gap-4' },
              createElement(Label, { className: 'text-right' }, 'Name'),
              createElement(Input, { className: 'col-span-3', placeholder: 'Pedro Duarte' }),
            ),
            createElement('div', { className: 'grid grid-cols-4 items-center gap-4' },
              createElement(Label, { className: 'text-right' }, 'Username'),
              createElement(Input, { className: 'col-span-3', placeholder: '@peduarte' }),
            ),
          ),
          createElement(DialogFooter, null,
            createElement(Button, { onClick: () => this.setState({ profile: false }) }, 'Save changes'),
          ),
        ),
      ),

      // Confirmation
      createElement(SectionHeading, { id: 'confirmation' }, 'Confirmation'),
      createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
        'A simple confirmation dialog with primary and secondary actions.',
      ),
      createElement(DemoBox, null,
        createElement(Button, {
          variant: 'outline',
          onClick: () => this.setState({ confirm: true }),
        }, 'Show Notification Settings'),
      ),
      createElement(Dialog, { open: s.confirm, onOpenChange: (open: boolean) => this.setState({ confirm: open }) },
        createElement(DialogContent, { onClose: () => this.setState({ confirm: false }), className: 'sm:max-w-[425px]' },
          createElement(DialogHeader, null,
            createElement(DialogTitle, null, 'Notification preferences'),
            createElement(DialogDescription, null, 'Choose which notifications you\'d like to receive.'),
          ),
          createElement('div', { className: 'space-y-3 py-4' },
            ...[
              { label: 'Push notifications', desc: 'Receive push notifications on your device.' },
              { label: 'Email digests', desc: 'Get a weekly summary of activity.' },
              { label: 'Marketing emails', desc: 'Receive emails about new features.' },
            ].map((item) =>
              createElement('div', { key: item.label, className: 'flex items-start gap-3 rounded-md border p-3' },
                createElement('div', { className: 'size-4 mt-0.5 rounded border border-primary bg-primary flex items-center justify-center' },
                  createElement('svg', { className: 'size-3 text-primary-foreground', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '3', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                    createElement('path', { d: 'M20 6L9 17l-5-5' }),
                  ),
                ),
                createElement('div', null,
                  createElement('div', { className: 'text-sm font-medium' }, item.label),
                  createElement('div', { className: 'text-xs text-muted-foreground' }, item.desc),
                ),
              ),
            ),
          ),
          createElement(DialogFooter, null,
            createElement(Button, { variant: 'outline', onClick: () => this.setState({ confirm: false }) }, 'Cancel'),
            createElement(Button, { onClick: () => this.setState({ confirm: false }) }, 'Save'),
          ),
        ),
      ),

      // Usage
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement(CodeBlock, { code: `import {
  Dialog, DialogContent, DialogHeader, DialogFooter,
  DialogTitle, DialogDescription,
} from '@/ui/Dialog'

createElement(Dialog, { open: isOpen },
  createElement(DialogContent, { onClose: () => setOpen(false) },
    createElement(DialogHeader, null,
      createElement(DialogTitle, null, 'Title'),
      createElement(DialogDescription, null, 'Description'),
    ),
    createElement(DialogFooter, null,
      createElement(Button, { onClick: close }, 'OK'),
    ),
  ),
)` }),

      // Props
      createElement(SectionHeading, { id: 'props' }, 'Props'),
      createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'Dialog'),
      createElement(PropTable, {
        rows: [
          { prop: 'open', type: 'boolean', default: 'false' },
          { prop: 'onOpenChange', type: '(open: boolean) => void', default: '\u2014' },
        ],
      }),
      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'DialogContent'),
      createElement(PropTable, {
        rows: [
          { prop: 'onClose', type: '() => void', default: '\u2014' },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
    );
  }
}
