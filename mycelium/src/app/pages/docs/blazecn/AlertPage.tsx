import { createElement } from 'inferno-create-element';
import { Alert, AlertTitle, AlertDescription } from '../../../ui/Alert';
import { PageHeader, DemoBox, CodeBlock } from '../_helpers';

export function AlertPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Alert',
      description: 'Displays a callout for important information. 2 variants.',
    }),
    createElement(DemoBox, { className: 'block' },
      createElement('div', { className: 'space-y-3 max-w-lg mx-auto' },
        createElement(Alert, null,
          createElement(AlertTitle, null, 'Heads up!'),
          createElement(AlertDescription, null, 'You can add components to your app using the CLI.'),
        ),
        createElement(Alert, { variant: 'destructive' },
          createElement(AlertTitle, null, 'Error'),
          createElement(AlertDescription, null, 'Your session has expired. Please log in again.'),
        ),
      ),
    ),
    createElement(CodeBlock, { code: "import { Alert, AlertTitle, AlertDescription } from '@/ui/Alert'\n\ncreateElement(Alert, { variant: 'destructive' },\n  createElement(AlertTitle, null, 'Error'),\n  createElement(AlertDescription, null, 'Something went wrong.'),\n)" }),
  );
}
