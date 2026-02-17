import { createElement } from 'inferno-create-element';
import { Button } from '../../../ui/Button';
import { toast } from '../../../ui/Toast';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';

export function ToastPage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Sonner',
      description: 'An opinionated toast component for Inferno.',
    }),

    // Hero demo
    createElement(DemoBox, { className: 'items-center justify-center' },
      createElement(Button, {
        variant: 'outline',
        onClick: () => toast('Event has been created'),
      }, 'Show Toast'),
    ),

    // Installation
    createElement(SectionHeading, { id: 'installation' }, 'Installation'),
    createElement(CodeBlock, { code: `import { Toaster } from '@/ui/Toast'

// Add the Toaster component to your app root
createElement(Toaster, null)`, lang: 'tsx' }),

    // Usage
    createElement(SectionHeading, { id: 'usage' }, 'Usage'),
    createElement(CodeBlock, { code: `import { toast } from '@/ui/Toast'`, lang: 'tsx' }),
    createElement(CodeBlock, { code: `toast('Event has been created.')`, lang: 'tsx' }),

    // Examples
    createElement(SectionHeading, { id: 'examples' }, 'Examples'),

    // Types
    createElement('h3', { className: 'text-base font-semibold mb-3' }, 'Types'),
    createElement(DemoBox, { className: 'items-center justify-center' },
      createElement('div', { className: 'flex flex-wrap gap-2' },
        createElement(Button, {
          variant: 'outline',
          onClick: () => toast('Event has been created'),
        }, 'Default'),
        createElement(Button, {
          variant: 'outline',
          onClick: () => toast.success('Event has been created'),
        }, 'Success'),
        createElement(Button, {
          variant: 'outline',
          onClick: () => toast.info('Be at the area 10 minutes before the event time'),
        }, 'Info'),
        createElement(Button, {
          variant: 'outline',
          onClick: () => toast.warning('Event start time cannot be earlier than 8am'),
        }, 'Warning'),
        createElement(Button, {
          variant: 'outline',
          onClick: () => toast.error('Event has not been created'),
        }, 'Error'),
        createElement(Button, {
          variant: 'outline',
          onClick: () => {
            toast.promise(
              new Promise((resolve) => setTimeout(() => resolve({ name: 'Event' }), 2000)),
              {
                loading: 'Loading...',
                success: 'Event has been created',
                error: 'Error',
              },
            );
          },
        }, 'Promise'),
      ),
    ),

    // Description
    createElement('h3', { className: 'text-base font-semibold mb-3 mt-8' }, 'Description'),
    createElement(DemoBox, { className: 'items-center justify-center' },
      createElement(Button, {
        variant: 'outline',
        onClick: () => toast('Event has been created', {
          description: 'Monday, January 3rd at 6:00pm',
        }),
      }, 'Show Toast'),
    ),

    // Position
    createElement('h3', { className: 'text-base font-semibold mb-3 mt-8' }, 'Position'),
    createElement(DemoBox, { className: 'items-center justify-center' },
      createElement('div', { className: 'flex flex-wrap justify-center gap-2' },
        createElement(Button, {
          variant: 'outline',
          onClick: () => toast('Event has been created', { position: 'top-left' }),
        }, 'Top Left'),
        createElement(Button, {
          variant: 'outline',
          onClick: () => toast('Event has been created', { position: 'top-center' }),
        }, 'Top Center'),
        createElement(Button, {
          variant: 'outline',
          onClick: () => toast('Event has been created', { position: 'top-right' }),
        }, 'Top Right'),
        createElement(Button, {
          variant: 'outline',
          onClick: () => toast('Event has been created', { position: 'bottom-left' }),
        }, 'Bottom Left'),
        createElement(Button, {
          variant: 'outline',
          onClick: () => toast('Event has been created', { position: 'bottom-center' }),
        }, 'Bottom Center'),
        createElement(Button, {
          variant: 'outline',
          onClick: () => toast('Event has been created', { position: 'bottom-right' }),
        }, 'Bottom Right'),
      ),
    ),

    // API Reference
    createElement(SectionHeading, { id: 'api-reference' }, 'API Reference'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-4' },
      'Modeled after ',
      createElement('a', {
        href: 'https://sonner.emilkowal.ski',
        className: 'underline underline-offset-4 hover:text-foreground transition-colors',
        target: '_blank',
        rel: 'noopener noreferrer',
      }, 'sonner'),
      ' by emilkowalski.',
    ),
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
  );
}
