import { createElement } from 'inferno-create-element';
import { Button } from '../../../ui/Button';
import { toast } from '../../../ui/Toast';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';

export function ToastPage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Sonner',
      description: 'An opinionated toast component. Sonner-style imperative API with typed toasts, actions, promises, and configurable positioning.',
    }),

    // Default
    createElement(SectionHeading, { id: 'demo' }, 'Demo'),
    createElement(DemoBox, null,
      createElement(Button, {
        variant: 'outline',
        onClick: () => toast('Event has been created'),
      }, 'Show Toast'),
    ),

    // Types
    createElement(SectionHeading, { id: 'types' }, 'Types'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Use typed methods for semantic toasts with appropriate icons.',
    ),
    createElement(DemoBox, { className: 'flex-col gap-3' },
      createElement('div', { className: 'flex flex-wrap items-center gap-3' },
        createElement(Button, {
          variant: 'outline',
          size: 'sm',
          onClick: () => toast('Event has been created'),
        }, 'Default'),
        createElement(Button, {
          variant: 'outline',
          size: 'sm',
          onClick: () => toast.success('Event has been created'),
        }, 'Success'),
        createElement(Button, {
          variant: 'outline',
          size: 'sm',
          onClick: () => toast.error('Event has not been created'),
        }, 'Error'),
        createElement(Button, {
          variant: 'outline',
          size: 'sm',
          onClick: () => toast.info('Be at the area 10 minutes before the event time'),
        }, 'Info'),
        createElement(Button, {
          variant: 'outline',
          size: 'sm',
          onClick: () => toast.warning('Event start time is earlier than expected'),
        }, 'Warning'),
      ),
    ),

    // Description
    createElement(SectionHeading, { id: 'description' }, 'Description'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Add a description to provide more context.',
    ),
    createElement(DemoBox, null,
      createElement(Button, {
        variant: 'outline',
        onClick: () => toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
        }),
      }, 'With Description'),
    ),

    // Action
    createElement(SectionHeading, { id: 'action' }, 'Action'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Add action and cancel buttons to toasts.',
    ),
    createElement(DemoBox, null,
      createElement(Button, {
        variant: 'outline',
        onClick: () => toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          action: {
            label: 'Undo',
            onClick: () => toast.info('Undo successful'),
          },
          cancel: {
            label: 'Dismiss',
            onClick: () => {},
          },
        }),
      }, 'With Action'),
    ),

    // Promise
    createElement(SectionHeading, { id: 'promise' }, 'Promise'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Show loading, success, and error states automatically from a promise.',
    ),
    createElement(DemoBox, { className: 'flex-col gap-3' },
      createElement('div', { className: 'flex flex-wrap items-center gap-3' },
        createElement(Button, {
          variant: 'outline',
          size: 'sm',
          onClick: () => {
            const promise = new Promise((resolve) => setTimeout(resolve, 2000));
            toast.promise(promise, {
              loading: 'Loading...',
              success: 'Data loaded successfully',
              error: 'Failed to load data',
            });
          },
        }, 'Promise (Success)'),
        createElement(Button, {
          variant: 'outline',
          size: 'sm',
          onClick: () => {
            const promise = new Promise((_, reject) => setTimeout(reject, 2000));
            toast.promise(promise, {
              loading: 'Deleting...',
              success: 'Deleted successfully',
              error: 'Failed to delete',
            });
          },
        }, 'Promise (Error)'),
      ),
    ),

    // Stacking
    createElement(SectionHeading, { id: 'stacking' }, 'Stacking'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Toasts elegantly stack with scale and offset transitions. Click rapidly to see the effect.',
    ),
    createElement(DemoBox, null,
      createElement(Button, {
        variant: 'outline',
        onClick: () => {
          toast('Toast 1');
          setTimeout(() => toast.success('Toast 2'), 100);
          setTimeout(() => toast.info('Toast 3'), 200);
          setTimeout(() => toast.warning('Toast 4'), 300);
        },
      }, 'Stack Multiple'),
    ),

    // Usage
    createElement(SectionHeading, { id: 'usage' }, 'Usage'),
    createElement(CodeBlock, { code: `import { toast, Toaster } from '@/ui/Toast'

// Mount Toaster once at your app root
createElement(Toaster, { position: 'bottom-right' })

// Default toast
toast('Event has been created')

// Typed toasts
toast.success('Profile updated')
toast.error('Something went wrong')
toast.info('New version available')
toast.warning('Low disk space')

// With description
toast('Event created', {
  description: 'Sunday, December 03, 2023 at 9:00 AM',
})

// With action buttons
toast('File deleted', {
  action: { label: 'Undo', onClick: () => undoDelete() },
  cancel: { label: 'Dismiss', onClick: () => {} },
})

// Promise toast
toast.promise(fetchData(), {
  loading: 'Loading...',
  success: 'Data loaded',
  error: 'Failed to load',
})` }),

    // Props
    createElement(SectionHeading, { id: 'props' }, 'Props'),
    createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'toast()'),
    createElement(PropTable, {
      rows: [
        { prop: 'title', type: 'string', default: '\u2014' },
        { prop: 'description', type: 'string', default: '\u2014' },
        { prop: 'action', type: '{ label: string; onClick: () => void }', default: '\u2014' },
        { prop: 'cancel', type: '{ label: string; onClick: () => void }', default: '\u2014' },
        { prop: 'duration', type: 'number (ms)', default: '4000' },
      ],
    }),
    createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'Toaster'),
    createElement(PropTable, {
      rows: [
        { prop: 'position', type: "'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center'", default: "'bottom-right'" },
      ],
    }),
    createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'Toast Methods'),
    createElement(PropTable, {
      rows: [
        { prop: 'toast(title, opts?)', type: 'Default toast', default: '\u2014' },
        { prop: 'toast.success(title, opts?)', type: 'Success with check icon', default: '\u2014' },
        { prop: 'toast.error(title, opts?)', type: 'Error with X icon', default: '\u2014' },
        { prop: 'toast.info(title, opts?)', type: 'Info with i icon', default: '\u2014' },
        { prop: 'toast.warning(title, opts?)', type: 'Warning with triangle icon', default: '\u2014' },
        { prop: 'toast.promise(promise, msgs)', type: 'Auto-transitions loading/success/error', default: '\u2014' },
      ],
    }),
  );
}
