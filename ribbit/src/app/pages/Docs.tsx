import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Switch } from '../ui/Switch';
import { Separator } from '../ui/Separator';
import { Spinner } from '../ui/Spinner';
import { Skeleton } from '../ui/Skeleton';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function SectionHeading({ id, children }: { id: string; children?: any }) {
  return createElement('div', { id, className: 'scroll-mt-20' },
    createElement('h2', { className: 'text-xl font-bold tracking-tight mb-1' }, children),
    createElement(Separator, { className: 'mb-6' }),
  );
}

function ExampleRow({ label, children }: { label: string; children?: any }) {
  return createElement('div', { className: 'space-y-2' },
    createElement('p', { className: 'text-xs font-semibold tracking-wider uppercase text-muted-foreground' }, label),
    createElement('div', { className: 'flex flex-wrap items-center gap-3' }, children),
  );
}

function CodeBlock({ code }: { code: string }) {
  return createElement('pre', {
    className: 'rounded-lg bg-muted/50 border border-border p-4 text-xs font-mono text-muted-foreground overflow-x-auto leading-relaxed',
  }, createElement('code', null, code));
}

function PropTable({ rows }: { rows: Array<{ prop: string; type: string; default: string }> }) {
  return createElement('div', { className: 'overflow-x-auto' },
    createElement('table', { className: 'w-full text-sm' },
      createElement('thead', null,
        createElement('tr', { className: 'border-b border-border' },
          createElement('th', { className: 'text-left py-2 pr-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground' }, 'Prop'),
          createElement('th', { className: 'text-left py-2 pr-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground' }, 'Type'),
          createElement('th', { className: 'text-left py-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground' }, 'Default'),
        ),
      ),
      createElement('tbody', null,
        ...rows.map((row) =>
          createElement('tr', { key: row.prop, className: 'border-b border-border/50' },
            createElement('td', { className: 'py-2 pr-4 font-mono text-xs text-primary' }, row.prop),
            createElement('td', { className: 'py-2 pr-4 font-mono text-xs text-muted-foreground' }, row.type),
            createElement('td', { className: 'py-2 font-mono text-xs' }, row.default),
          ),
        ),
      ),
    ),
  );
}

// ---------------------------------------------------------------------------
// Sidebar navigation
// ---------------------------------------------------------------------------

const NAV_SECTIONS = [
  {
    heading: 'Getting Started',
    items: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'installation', label: 'Installation' },
      { id: 'tokens', label: 'Design Tokens' },
    ],
  },
  {
    heading: 'Components',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'badge', label: 'Badge' },
      { id: 'card', label: 'Card' },
      { id: 'input', label: 'Input' },
      { id: 'textarea', label: 'Textarea' },
      { id: 'label', label: 'Label' },
      { id: 'switch', label: 'Switch' },
      { id: 'separator', label: 'Separator' },
      { id: 'spinner', label: 'Spinner' },
      { id: 'skeleton', label: 'Skeleton' },
    ],
  },
  {
    heading: 'Utilities',
    items: [
      { id: 'cn', label: 'cn()' },
    ],
  },
];

function DocsSidebar() {
  return createElement('nav', { className: 'hidden lg:block w-48 shrink-0' },
    createElement('div', { className: 'sticky top-[72px] space-y-5 max-h-[calc(100vh-100px)] overflow-y-auto' },
      ...NAV_SECTIONS.map((section) =>
        createElement('div', { key: section.heading },
          createElement('p', {
            className: 'px-2 mb-1.5 text-xs font-semibold tracking-wider uppercase text-muted-foreground/60',
          }, section.heading),
          ...section.items.map((item) =>
            createElement('a', {
              key: item.id,
              href: `#${item.id}`,
              className: 'flex items-center px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors',
            }, item.label),
          ),
        ),
      ),
    ),
  );
}

// ---------------------------------------------------------------------------
// Main docs page
// ---------------------------------------------------------------------------

interface DocsState {
  switchChecked: boolean;
}

export class Docs extends Component<{}, DocsState> {
  declare state: DocsState;

  constructor(props: {}) {
    super(props);
    this.state = { switchChecked: false };
  }

  render() {
    return createElement('div', { className: 'flex gap-8' },
      createElement(DocsSidebar, null),
      createElement('div', { className: 'flex-1 min-w-0 space-y-12' },

        // ===================================================================
        // INTRODUCTION
        // ===================================================================
        createElement('div', { id: 'introduction', className: 'scroll-mt-20' },
          createElement('div', { className: 'flex items-center gap-3 mb-2' },
            createElement('span', { className: 'text-3xl' }, '\u26A1'),
            createElement('h1', { className: 'text-3xl font-bold tracking-tight' }, 'Blazecn'),
          ),
          createElement('p', { className: 'text-muted-foreground max-w-2xl mb-4' },
            'A shadcn/ui-compatible component library for InfernoJS. Same design tokens, same class strings, zero React dependency. Built for speed.',
          ),
          createElement('div', { className: 'flex flex-wrap gap-3 mb-6' },
            createElement(Badge, null, 'InfernoJS'),
            createElement(Badge, { variant: 'secondary' }, 'Tailwind CSS v4'),
            createElement(Badge, { variant: 'secondary' }, 'class-variance-authority'),
            createElement(Badge, { variant: 'outline' }, 'MIT License'),
          ),
          createElement('div', { className: 'flex gap-3' },
            createElement('a', {
              href: 'https://github.com/TekkadanPlays/blazecn',
              target: '_blank',
              rel: 'noopener',
              className: 'inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors',
            }, 'GitHub \u2192'),
            createElement(Link, {
              to: '/',
              className: 'inline-flex items-center gap-2 rounded-md border border-input px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
            }, '\u2190 Back to ribbit'),
          ),
        ),

        // ===================================================================
        // INSTALLATION
        // ===================================================================
        createElement(SectionHeading, { id: 'installation' }, 'Installation'),
        createElement('div', { className: 'space-y-4' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Blazecn follows the shadcn philosophy \u2014 you own the code. Copy the components you need into your project.',
          ),
          createElement('div', { className: 'space-y-2' },
            createElement('p', { className: 'text-xs font-semibold tracking-wider uppercase text-muted-foreground' }, '1. Install dependencies'),
            createElement(CodeBlock, { code: 'bun add class-variance-authority clsx tailwind-merge' }),
          ),
          createElement('div', { className: 'space-y-2' },
            createElement('p', { className: 'text-xs font-semibold tracking-wider uppercase text-muted-foreground' }, '2. Add the cn() utility'),
            createElement(CodeBlock, { code: "import { clsx, type ClassValue } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}" }),
          ),
          createElement('div', { className: 'space-y-2' },
            createElement('p', { className: 'text-xs font-semibold tracking-wider uppercase text-muted-foreground' }, '3. Copy components'),
            createElement('p', { className: 'text-sm text-muted-foreground' },
              'Copy any component file from the ui/ directory into your project. Each is self-contained with only cn() as a local dependency.',
            ),
          ),
        ),

        // ===================================================================
        // DESIGN TOKENS
        // ===================================================================
        createElement(SectionHeading, { id: 'tokens' }, 'Design Tokens'),
        createElement('div', { className: 'space-y-4' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Blazecn uses the same semantic token pairs as shadcn/ui, defined as CSS custom properties in your Tailwind config.',
          ),
          createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
            ...[
              { name: 'background', color: 'bg-background', fg: 'text-foreground', label: 'Background' },
              { name: 'card', color: 'bg-card', fg: 'text-card-foreground', label: 'Card' },
              { name: 'primary', color: 'bg-primary', fg: 'text-primary-foreground', label: 'Primary' },
              { name: 'secondary', color: 'bg-secondary', fg: 'text-secondary-foreground', label: 'Secondary' },
              { name: 'muted', color: 'bg-muted', fg: 'text-muted-foreground', label: 'Muted' },
              { name: 'accent', color: 'bg-accent', fg: 'text-accent-foreground', label: 'Accent' },
              { name: 'destructive', color: 'bg-destructive', fg: 'text-white', label: 'Destructive' },
              { name: 'border', color: 'bg-border', fg: 'text-foreground', label: 'Border' },
            ].map((token) =>
              createElement('div', {
                key: token.name,
                className: 'flex items-center gap-3 rounded-lg border border-border p-3',
              },
                createElement('div', { className: `w-10 h-10 rounded-md ${token.color} border border-border shrink-0` }),
                createElement('div', null,
                  createElement('p', { className: 'text-sm font-medium' }, token.label),
                  createElement('p', { className: 'text-xs font-mono text-muted-foreground' }, `--${token.name}`),
                ),
              ),
            ),
          ),
        ),

        // ===================================================================
        // BUTTON
        // ===================================================================
        createElement(SectionHeading, { id: 'button' }, 'Button'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Displays a button or a component that looks like a button. 6 variants \u00D7 6 sizes.',
          ),
          createElement(ExampleRow, { label: 'Variants' },
            createElement(Button, null, 'Default'),
            createElement(Button, { variant: 'destructive' }, 'Destructive'),
            createElement(Button, { variant: 'outline' }, 'Outline'),
            createElement(Button, { variant: 'secondary' }, 'Secondary'),
            createElement(Button, { variant: 'ghost' }, 'Ghost'),
            createElement(Button, { variant: 'link' }, 'Link'),
          ),
          createElement(ExampleRow, { label: 'Sizes' },
            createElement(Button, { size: 'xs' }, 'Extra Small'),
            createElement(Button, { size: 'sm' }, 'Small'),
            createElement(Button, null, 'Default'),
            createElement(Button, { size: 'lg' }, 'Large'),
            createElement(Button, { size: 'icon' }, '\u2605'),
            createElement(Button, { size: 'icon-sm' }, '\u2605'),
          ),
          createElement(ExampleRow, { label: 'States' },
            createElement(Button, { disabled: true }, 'Disabled'),
            createElement(Button, { variant: 'outline', disabled: true }, 'Disabled Outline'),
          ),
          createElement(CodeBlock, { code: "createElement(Button, { variant: 'outline', size: 'sm' }, 'Click me')" }),
          createElement(PropTable, { rows: [
            { prop: 'variant', type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", default: "'default'" },
            { prop: 'size', type: "'default' | 'sm' | 'xs' | 'lg' | 'icon' | 'icon-sm'", default: "'default'" },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'" },
            { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
            { prop: 'className', type: 'string', default: '\u2014' },
          ]}),
        ),

        // ===================================================================
        // BADGE
        // ===================================================================
        createElement(SectionHeading, { id: 'badge' }, 'Badge'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Displays a badge or a component that looks like a badge. 5 variants.',
          ),
          createElement(ExampleRow, { label: 'Variants' },
            createElement(Badge, null, 'Default'),
            createElement(Badge, { variant: 'secondary' }, 'Secondary'),
            createElement(Badge, { variant: 'destructive' }, 'Destructive'),
            createElement(Badge, { variant: 'outline' }, 'Outline'),
            createElement(Badge, { variant: 'ghost' }, 'Ghost'),
          ),
          createElement(CodeBlock, { code: "createElement(Badge, { variant: 'secondary' }, 'New')" }),
          createElement(PropTable, { rows: [
            { prop: 'variant', type: "'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'", default: "'default'" },
            { prop: 'className', type: 'string', default: '\u2014' },
          ]}),
        ),

        // ===================================================================
        // CARD
        // ===================================================================
        createElement(SectionHeading, { id: 'card' }, 'Card'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Displays a card with header, content, and footer. Composable with slot components.',
          ),
          createElement('div', { className: 'max-w-md' },
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
          createElement(CodeBlock, { code: "createElement(Card, null,\n  createElement(CardHeader, null,\n    createElement(CardTitle, null, 'Title'),\n    createElement(CardDescription, null, 'Description'),\n  ),\n  createElement(CardContent, null, 'Content'),\n  createElement(CardFooter, null, 'Footer'),\n)" }),
        ),

        // ===================================================================
        // INPUT
        // ===================================================================
        createElement(SectionHeading, { id: 'input' }, 'Input'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Displays a form input field with consistent styling and focus ring.',
          ),
          createElement('div', { className: 'max-w-sm space-y-3' },
            createElement(Input, { placeholder: 'Default input' }),
            createElement(Input, { type: 'email', placeholder: 'you@example.com' }),
            createElement(Input, { type: 'password', placeholder: 'Password' }),
            createElement(Input, { disabled: true, placeholder: 'Disabled' }),
          ),
          createElement(CodeBlock, { code: "createElement(Input, { type: 'email', placeholder: 'you@example.com' })" }),
          createElement(PropTable, { rows: [
            { prop: 'type', type: 'string', default: "'text'" },
            { prop: 'placeholder', type: 'string', default: '\u2014' },
            { prop: 'value', type: 'string', default: '\u2014' },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'readOnly', type: 'boolean', default: 'false' },
            { prop: 'onInput', type: '(e: Event) => void', default: '\u2014' },
            { prop: 'className', type: 'string', default: '\u2014' },
          ]}),
        ),

        // ===================================================================
        // TEXTAREA
        // ===================================================================
        createElement(SectionHeading, { id: 'textarea' }, 'Textarea'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Displays a form textarea with consistent styling.',
          ),
          createElement('div', { className: 'max-w-sm space-y-3' },
            createElement(Textarea, { placeholder: 'Write something...' }),
            createElement(Textarea, { placeholder: 'Disabled', disabled: true }),
          ),
          createElement(CodeBlock, { code: "createElement(Textarea, { placeholder: 'Write something...', rows: 4 })" }),
          createElement(PropTable, { rows: [
            { prop: 'placeholder', type: 'string', default: '\u2014' },
            { prop: 'value', type: 'string', default: '\u2014' },
            { prop: 'rows', type: 'number', default: '3' },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'className', type: 'string', default: '\u2014' },
          ]}),
        ),

        // ===================================================================
        // LABEL
        // ===================================================================
        createElement(SectionHeading, { id: 'label' }, 'Label'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Renders an accessible label associated with controls.',
          ),
          createElement('div', { className: 'max-w-sm space-y-1' },
            createElement(Label, { htmlFor: 'demo-email' }, 'Your email'),
            createElement(Input, { id: 'demo-email', type: 'email', placeholder: 'you@example.com' }),
          ),
          createElement(CodeBlock, { code: "createElement(Label, { htmlFor: 'email' }, 'Email')\ncreateElement(Input, { id: 'email', type: 'email' })" }),
        ),

        // ===================================================================
        // SWITCH
        // ===================================================================
        createElement(SectionHeading, { id: 'switch' }, 'Switch'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'A toggle switch with ARIA role="switch" for boolean settings.',
          ),
          createElement('div', { className: 'flex items-center gap-3' },
            createElement(Switch, {
              checked: this.state.switchChecked,
              onChange: (checked: boolean) => this.setState({ switchChecked: checked }),
            }),
            createElement('span', { className: 'text-sm' },
              this.state.switchChecked ? 'On' : 'Off',
            ),
          ),
          createElement(CodeBlock, { code: "createElement(Switch, {\n  checked: isEnabled,\n  onChange: (checked) => setEnabled(checked),\n})" }),
          createElement(PropTable, { rows: [
            { prop: 'checked', type: 'boolean', default: 'false' },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'onChange', type: '(checked: boolean) => void', default: '\u2014' },
            { prop: 'className', type: 'string', default: '\u2014' },
          ]}),
        ),

        // ===================================================================
        // SEPARATOR
        // ===================================================================
        createElement(SectionHeading, { id: 'separator' }, 'Separator'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Visually or semantically separates content.',
          ),
          createElement('div', { className: 'space-y-4' },
            createElement('div', null,
              createElement('p', { className: 'text-sm' }, 'Content above'),
              createElement(Separator, { className: 'my-3' }),
              createElement('p', { className: 'text-sm' }, 'Content below'),
            ),
            createElement('div', { className: 'flex items-center gap-3 h-6' },
              createElement('span', { className: 'text-sm' }, 'Left'),
              createElement(Separator, { orientation: 'vertical' }),
              createElement('span', { className: 'text-sm' }, 'Right'),
            ),
          ),
          createElement(CodeBlock, { code: "createElement(Separator, null)                          // horizontal\ncreateElement(Separator, { orientation: 'vertical' })   // vertical" }),
        ),

        // ===================================================================
        // SPINNER
        // ===================================================================
        createElement(SectionHeading, { id: 'spinner' }, 'Spinner'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Accessible loading indicator with 3 sizes. Uses role="status" and aria-label.',
          ),
          createElement(ExampleRow, { label: 'Sizes' },
            createElement('div', { className: 'flex items-center gap-2' },
              createElement(Spinner, { size: 'sm' }),
              createElement('span', { className: 'text-xs text-muted-foreground' }, 'sm'),
            ),
            createElement('div', { className: 'flex items-center gap-2' },
              createElement(Spinner, null),
              createElement('span', { className: 'text-xs text-muted-foreground' }, 'default'),
            ),
            createElement('div', { className: 'flex items-center gap-2' },
              createElement(Spinner, { size: 'lg' }),
              createElement('span', { className: 'text-xs text-muted-foreground' }, 'lg'),
            ),
          ),
          createElement(CodeBlock, { code: "createElement(Spinner, { size: 'sm' })\ncreateElement(Spinner, null)              // default\ncreateElement(Spinner, { size: 'lg' })" }),
        ),

        // ===================================================================
        // SKELETON
        // ===================================================================
        createElement(SectionHeading, { id: 'skeleton' }, 'Skeleton'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Use to show a placeholder while content is loading.',
          ),
          createElement('div', { className: 'space-y-3 max-w-sm' },
            createElement('div', { className: 'flex items-center gap-3' },
              createElement(Skeleton, { className: 'size-10 rounded-full' }),
              createElement('div', { className: 'space-y-2 flex-1' },
                createElement(Skeleton, { className: 'h-4 w-3/4' }),
                createElement(Skeleton, { className: 'h-3 w-1/2' }),
              ),
            ),
            createElement(Skeleton, { className: 'h-32 w-full rounded-lg' }),
            createElement('div', { className: 'space-y-2' },
              createElement(Skeleton, { className: 'h-4 w-full' }),
              createElement(Skeleton, { className: 'h-4 w-5/6' }),
              createElement(Skeleton, { className: 'h-4 w-4/6' }),
            ),
          ),
          createElement(CodeBlock, { code: "createElement(Skeleton, { className: 'h-4 w-48' })\ncreateElement(Skeleton, { className: 'size-10 rounded-full' })" }),
        ),

        // ===================================================================
        // CN UTILITY
        // ===================================================================
        createElement(SectionHeading, { id: 'cn' }, 'cn() Utility'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Combines clsx and tailwind-merge for conditional, conflict-free class composition. This is the foundation utility used by every Blazecn component.',
          ),
          createElement(CodeBlock, { code: "import { cn } from './ui/utils';\n\n// Conditional classes\ncn('px-4 py-2', isActive && 'bg-primary', className)\n\n// Tailwind conflict resolution\ncn('px-4', 'px-6')  // \u2192 'px-6'\ncn('text-red-500', 'text-blue-500')  // \u2192 'text-blue-500'" }),
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'You can also use exported variant functions outside of components:',
          ),
          createElement(CodeBlock, { code: "import { buttonVariants } from './ui/Button';\n\n// Use button styles on a link\ncreateElement('a', {\n  href: '/docs',\n  className: buttonVariants({ variant: 'outline', size: 'sm' }),\n}, 'Read Docs')" }),
        ),

        // ===================================================================
        // FOOTER
        // ===================================================================
        createElement(Separator, { className: 'mt-8' }),
        createElement('div', { className: 'py-8 text-center' },
          createElement('p', { className: 'text-xs text-muted-foreground' },
            'Blazecn \u00B7 MIT License \u00B7 Built with InfernoJS + Tailwind CSS v4',
          ),
          createElement('div', { className: 'flex justify-center gap-4 mt-3' },
            createElement('a', {
              href: 'https://github.com/TekkadanPlays/blazecn',
              target: '_blank',
              rel: 'noopener',
              className: 'text-xs text-primary hover:underline',
            }, 'GitHub'),
            createElement(Link, {
              to: '/',
              className: 'text-xs text-primary hover:underline',
            }, 'ribbit.network'),
          ),
        ),
      ),
    );
  }
}
