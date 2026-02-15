import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import {
  TypographyH1, TypographyH2, TypographyH3, TypographyH4,
  TypographyP, TypographyBlockquote, TypographyInlineCode,
  TypographyLead, TypographyLarge, TypographySmall, TypographyMuted, TypographyList,
} from '../../../ui/Typography';

export function TypographyPage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Typography',
      description: 'Styles for headings, paragraphs, lists, and inline text elements.',
    }),

    // Headings
    createElement(SectionHeading, { id: 'headings' }, 'Headings'),
    createElement(DemoBox, { className: 'flex-col gap-4 items-start' },
      createElement(TypographyH1, null, 'This is H1'),
      createElement(TypographyH2, null, 'This is H2'),
      createElement(TypographyH3, null, 'This is H3'),
      createElement(TypographyH4, null, 'This is H4'),
    ),

    // Paragraph & Lead
    createElement(SectionHeading, { id: 'paragraph' }, 'Paragraph & Lead'),
    createElement(DemoBox, { className: 'flex-col gap-4 items-start max-w-lg' },
      createElement(TypographyLead, null,
        'A modal dialog that interrupts the user with important content and expects a response.',
      ),
      createElement(TypographyP, null,
        'The king, seeing how much happier his subjects were, realized the error of his ways and repealed the tax on laughter.',
      ),
    ),

    // Blockquote
    createElement(SectionHeading, { id: 'blockquote' }, 'Blockquote'),
    createElement(DemoBox, { className: 'flex-col items-start max-w-lg' },
      createElement(TypographyBlockquote, null,
        '"After all," he said, "everyone enjoys a good joke, so it\'s only fair that they should pay for the privilege."',
      ),
    ),

    // Inline Code
    createElement(SectionHeading, { id: 'inline-code' }, 'Inline Code'),
    createElement(DemoBox, { className: 'flex-col items-start' },
      createElement(TypographyP, null,
        'Use the ',
        createElement(TypographyInlineCode, null, 'createElement()'),
        ' function to render components.',
      ),
    ),

    // List
    createElement(SectionHeading, { id: 'list' }, 'List'),
    createElement(DemoBox, { className: 'flex-col items-start' },
      createElement(TypographyList, null,
        createElement('li', null, '1st level of puns: 5 gold coins'),
        createElement('li', null, '2nd level of jokes: 10 gold coins'),
        createElement('li', null, '3rd level of one-liners: 20 gold coins'),
      ),
    ),

    // Sizes
    createElement(SectionHeading, { id: 'sizes' }, 'Large, Small & Muted'),
    createElement(DemoBox, { className: 'flex-col gap-3 items-start' },
      createElement(TypographyLarge, null, 'Are you absolutely sure?'),
      createElement(TypographySmall, null, 'Email address'),
      createElement(TypographyMuted, null, 'Enter your email address.'),
    ),

    // Usage
    createElement(SectionHeading, { id: 'usage' }, 'Usage'),
    createElement(CodeBlock, { code: `import {
  TypographyH1, TypographyH2, TypographyH3, TypographyH4,
  TypographyP, TypographyBlockquote, TypographyInlineCode,
  TypographyLead, TypographyLarge, TypographySmall, TypographyMuted,
  TypographyList,
} from '@/ui/Typography'

createElement(TypographyH1, null, 'Heading 1')
createElement(TypographyP, null, 'A paragraph of text.')
createElement(TypographyBlockquote, null, 'A quote.')
createElement(TypographyInlineCode, null, 'code')
createElement(TypographyList, null,
  createElement('li', null, 'Item one'),
  createElement('li', null, 'Item two'),
)` }),

    // Props
    createElement(SectionHeading, { id: 'props' }, 'Props'),
    createElement(PropTable, {
      rows: [
        { prop: 'className', type: 'string', default: '\u2014' },
        { prop: 'children', type: 'any', default: '\u2014' },
      ],
    }),
    createElement('p', { className: 'text-xs text-muted-foreground mt-2' },
      'All typography components accept className and children props.',
    ),
  );
}
