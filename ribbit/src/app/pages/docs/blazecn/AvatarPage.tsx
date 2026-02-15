import { createElement } from 'inferno-create-element';
import { Avatar, AvatarImage, AvatarFallback } from '../../../ui/Avatar';
import { PageHeader, DemoBox, ExampleRow, CodeBlock } from '../_helpers';

export function AvatarPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Avatar',
      description: 'An image element with a fallback for representing the user.',
    }),
    createElement(DemoBox, null,
      createElement(ExampleRow, { label: 'With image & fallback' },
        createElement(Avatar, null,
          createElement(AvatarImage, { src: '/tink.gif', alt: 'Tink' }),
          createElement(AvatarFallback, null, 'TK'),
        ),
        createElement(Avatar, null,
          createElement(AvatarFallback, null, 'JD'),
        ),
        createElement(Avatar, { className: 'size-12' },
          createElement(AvatarFallback, { className: 'text-sm' }, 'AB'),
        ),
      ),
    ),
    createElement(CodeBlock, { code: "import { Avatar, AvatarImage, AvatarFallback } from '@/ui/Avatar'\n\ncreateElement(Avatar, null,\n  createElement(AvatarImage, { src: '/avatar.png', alt: 'User' }),\n  createElement(AvatarFallback, null, 'JD'),\n)" }),
  );
}
