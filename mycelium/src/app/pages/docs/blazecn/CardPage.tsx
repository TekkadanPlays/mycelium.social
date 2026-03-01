import { createElement } from 'inferno-create-element';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../ui/Card';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Textarea } from '../../../ui/Textarea';
import { Label } from '../../../ui/Label';
import { PageHeader, DemoBox, CodeBlock } from '../_helpers';

export function CardPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Card',
      description: 'Displays a card with header, content, and footer. Composable with slot components.',
    }),
    createElement(DemoBox, { className: 'block' },
      createElement('div', { className: 'max-w-md mx-auto' },
        createElement(Card, null,
          createElement(CardHeader, null,
            createElement(CardTitle, null, 'Create project'),
            createElement(CardDescription, null, 'Deploy your new project in one-click.'),
          ),
          createElement(CardContent, null,
            createElement('div', { className: 'space-y-3' },
              createElement('div', { className: 'space-y-1' },
                createElement(Label, { htmlFor: 'name' }, 'Name'),
                createElement(Input, { id: 'name', placeholder: 'My project' }),
              ),
              createElement('div', { className: 'space-y-1' },
                createElement(Label, { htmlFor: 'desc' }, 'Description'),
                createElement(Textarea, { id: 'desc', placeholder: 'Describe your project...' }),
              ),
            ),
          ),
          createElement(CardFooter, { className: 'justify-between' },
            createElement(Button, { variant: 'outline' }, 'Cancel'),
            createElement(Button, null, 'Deploy'),
          ),
        ),
      ),
    ),
    createElement(CodeBlock, { code: "import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/ui/Card'\n\ncreateElement(Card, null,\n  createElement(CardHeader, null,\n    createElement(CardTitle, null, 'Title'),\n    createElement(CardDescription, null, 'Description'),\n  ),\n  createElement(CardContent, null, 'Content'),\n  createElement(CardFooter, null, 'Footer'),\n)" }),
  );
}
