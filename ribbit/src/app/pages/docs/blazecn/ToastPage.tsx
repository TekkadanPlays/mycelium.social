import { createElement } from 'inferno-create-element';
import { Button } from '../../../ui/Button';
import { toast } from '../../../ui/Toast';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';

export function ToastPage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Sonner',
      description: 'An opinionated toast component modeled after sonner by Emil Kowalski. Observer-driven state, CSS data-attribute animations, expand-on-hover stacking, and per-toast timer management.',
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

    // Loading
    createElement(SectionHeading, { id: 'loading' }, 'Loading'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Show a persistent loading toast with a spinner. Useful for long-running operations outside of promise flow.',
    ),
    createElement(DemoBox, null,
      createElement(Button, {
        variant: 'outline',
        onClick: () => {
          const id = toast.loading('Uploading file...');
          setTimeout(() => toast.success('Upload complete', { id }), 3000);
        },
      }, 'Loading Toast'),
    ),

    // Dismiss
    createElement(SectionHeading, { id: 'dismiss' }, 'Dismiss'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Programmatically dismiss a specific toast by ID, or dismiss all toasts at once.',
    ),
    createElement(DemoBox, { className: 'flex-col gap-3' },
      createElement('div', { className: 'flex flex-wrap items-center gap-3' },
        createElement(Button, {
          variant: 'outline',
          size: 'sm',
          onClick: () => {
            const id = toast('Persistent notification', { duration: Infinity });
            setTimeout(() => toast.dismiss(id), 2000);
          },
        }, 'Dismiss by ID'),
        createElement(Button, {
          variant: 'outline',
          size: 'sm',
          onClick: () => {
            toast('First toast');
            toast.success('Second toast');
            toast.info('Third toast');
            setTimeout(() => toast.dismiss(), 2000);
          },
        }, 'Dismiss All'),
      ),
    ),

    // Stacking
    createElement(SectionHeading, { id: 'stacking' }, 'Stacking'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Toasts stack with scale and offset transitions. Hover over the stack to expand and see all toasts. Timers pause while expanded.',
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
createElement(Toaster, { position: 'top-center' })

// Default toast
toast('Event has been created')

// Typed toasts
toast.success('Profile updated')
toast.error('Something went wrong')
toast.info('New version available')
toast.warning('Low disk space')
toast.loading('Uploading...')

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
})

// Loading → update pattern
const id = toast.loading('Processing...')
// later...
toast.success('Done!', { id })

// Dismiss
toast.dismiss(id)   // dismiss specific
toast.dismiss()     // dismiss all` }),

    // Architecture
    createElement(SectionHeading, { id: 'architecture' }, 'Architecture'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Modeled after sonner by Emil Kowalski. Uses an Observer singleton that publishes individual toast events. The Toaster component always renders its container (never returns null) to prevent mount/unmount flicker during navigation. Each ToastItem manages its own height measurement, auto-dismiss timer with pause-on-hover, and exit animation lifecycle.',
    ),
    createElement(CodeBlock, { code: `// Observer publishes individual events, not the full array
ToastState.subscribe((incoming) => {
  if ('dismiss' in incoming) { /* mark for exit animation */ }
  else { /* add or update toast */ }
})

// Toaster ALWAYS renders the container
render() {
  return createElement('section', ...,
    createElement('ol', { 'data-sonner-toaster': '' }, ...toasts)
  )
}

// CSS drives all positioning via data attributes
[data-sonner-toast][data-mounted='true'] { opacity: 1; }
[data-sonner-toast][data-removed='true'] { opacity: 0; }` }),

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
        { prop: 'id', type: 'string | number', default: 'auto-increment' },
        { prop: 'dismissible', type: 'boolean', default: 'true' },
      ],
    }),
    createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'Toaster'),
    createElement(PropTable, {
      rows: [
        { prop: 'position', type: "'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center'", default: "'top-center'" },
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
        { prop: 'toast.loading(title, opts?)', type: 'Persistent loading with spinner', default: '\u2014' },
        { prop: 'toast.promise(promise, msgs)', type: 'Auto-transitions loading/success/error', default: '\u2014' },
        { prop: 'toast.dismiss(id?)', type: 'Dismiss by ID or dismiss all', default: '\u2014' },
      ],
    }),
  );
}
