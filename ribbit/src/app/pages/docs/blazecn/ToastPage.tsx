import { createElement } from 'inferno-create-element';
import { Button } from '../../../ui/Button';
import { toast } from '../../../ui/Toast';
import { PageHeader, DemoBox, ExampleRow, CodeBlock } from '../_helpers';

export function ToastPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Toast',
      description: 'A succinct message that is displayed temporarily. Uses an imperative toast() API with a pub/sub pattern.',
    }),
    createElement(DemoBox, null,
      createElement(ExampleRow, { label: 'Trigger toasts' },
        createElement(Button, {
          variant: 'outline',
          onClick: () => toast({ title: 'Event created', description: 'Sunday, December 03, 2023 at 9:00 AM' }),
        }, 'Show Toast'),
        createElement(Button, {
          variant: 'destructive',
          onClick: () => toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' }),
        }, 'Destructive Toast'),
      ),
    ),
    createElement(CodeBlock, { code: "import { toast, Toaster } from '@/ui/Toast'\n\n// Mount once at root\ncreateElement(Toaster, null)\n\n// Call anywhere\ntoast({ title: 'Saved', description: 'Your changes have been saved.' })\ntoast({ title: 'Error', variant: 'destructive' })" }),
  );
}
