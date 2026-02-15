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
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import { Alert, AlertTitle, AlertDescription } from '../ui/Alert';
import { Toggle } from '../ui/Toggle';
import { ToggleGroup, ToggleGroupItem } from '../ui/ToggleGroup';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Checkbox } from '../ui/Checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/RadioGroup';
import { Progress } from '../ui/Progress';
import { Slider } from '../ui/Slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/Dialog';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/Accordion';
import { Tooltip } from '../ui/Tooltip';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { ScrollArea } from '../ui/ScrollArea';
import { AspectRatio } from '../ui/AspectRatio';
import { toast, Toaster } from '../ui/Toast';
import { ThemeToggle } from '../ui/ThemeToggle';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function SectionHeading({ id, children }: { id: string; children?: any }) {
  return createElement('div', { id, className: 'scroll-mt-20 mb-6' },
    createElement('h2', {
      className: 'text-xl font-bold tracking-tight pb-1 border-b border-border w-fit',
    }, children),
  );
}

function ExampleRow({ label, children }: { label: string; children?: any }) {
  return createElement('div', { className: 'space-y-2' },
    createElement('p', { className: 'text-xs font-semibold tracking-wider uppercase text-muted-foreground' }, label),
    createElement('div', { className: 'flex flex-wrap items-center gap-3' }, children),
  );
}

function DemoBox({ children, className }: { children?: any; className?: string }) {
  return createElement('div', {
    className: cn(
      'flex items-center justify-center rounded-lg border border-border bg-muted/50 p-8',
      className,
    ),
  }, children);
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
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
    heading: 'Core',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'badge', label: 'Badge' },
      { id: 'card', label: 'Card' },
    ],
  },
  {
    heading: 'Form',
    items: [
      { id: 'input', label: 'Input' },
      { id: 'textarea', label: 'Textarea' },
      { id: 'label', label: 'Label' },
      { id: 'switch', label: 'Switch' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'radio', label: 'Radio Group' },
      { id: 'select', label: 'Select' },
      { id: 'slider', label: 'Slider' },
    ],
  },
  {
    heading: 'Data Display',
    items: [
      { id: 'avatar', label: 'Avatar' },
      { id: 'table', label: 'Table' },
      { id: 'separator', label: 'Separator' },
      { id: 'spinner', label: 'Spinner' },
      { id: 'skeleton', label: 'Skeleton' },
      { id: 'progress', label: 'Progress' },
      { id: 'alert', label: 'Alert' },
    ],
  },
  {
    heading: 'Navigation',
    items: [
      { id: 'tabs', label: 'Tabs' },
      { id: 'toggle', label: 'Toggle' },
      { id: 'accordion', label: 'Accordion' },
    ],
  },
  {
    heading: 'Overlay',
    items: [
      { id: 'dialog', label: 'Dialog' },
      { id: 'tooltip', label: 'Tooltip' },
      { id: 'toast', label: 'Toast' },
    ],
  },
  {
    heading: 'Layout',
    items: [
      { id: 'scroll-area', label: 'Scroll Area' },
      { id: 'aspect-ratio', label: 'Aspect Ratio' },
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
  checkboxChecked: boolean;
  radioValue: string;
  tabValue: string;
  toggleBold: boolean;
  toggleItalic: boolean;
  sliderValue: number;
  progressValue: number;
  dialogOpen: boolean;
  accordionOpen: string;
}

export class Docs extends Component<{}, DocsState> {
  declare state: DocsState;

  constructor(props: {}) {
    super(props);
    this.state = {
      switchChecked: false,
      checkboxChecked: false,
      radioValue: 'default',
      tabValue: 'preview',
      toggleBold: false,
      toggleItalic: false,
      sliderValue: 50,
      progressValue: 60,
      dialogOpen: false,
      accordionOpen: '',
    };
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
          createElement('div', { className: 'flex items-center gap-3' },
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
            createElement(ThemeToggle, null),
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
          createElement(DemoBox, { className: 'flex-col gap-6' },
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
          createElement(DemoBox, null,
            createElement(ExampleRow, { label: 'Variants' },
              createElement(Badge, null, 'Default'),
              createElement(Badge, { variant: 'secondary' }, 'Secondary'),
              createElement(Badge, { variant: 'destructive' }, 'Destructive'),
              createElement(Badge, { variant: 'outline' }, 'Outline'),
              createElement(Badge, { variant: 'ghost' }, 'Ghost'),
            ),
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
          createElement(DemoBox, { className: 'block' },
            createElement('div', { className: 'max-w-sm mx-auto space-y-3' },
              createElement(Input, { placeholder: 'Default input' }),
              createElement(Input, { type: 'email', placeholder: 'you@example.com' }),
              createElement(Input, { type: 'password', placeholder: 'Password' }),
              createElement(Input, { disabled: true, placeholder: 'Disabled' }),
            ),
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
          createElement(DemoBox, { className: 'block' },
            createElement('div', { className: 'max-w-sm mx-auto space-y-3' },
              createElement(Textarea, { placeholder: 'Write something...' }),
              createElement(Textarea, { placeholder: 'Disabled', disabled: true }),
            ),
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
          createElement(DemoBox, { className: 'block' },
            createElement('div', { className: 'max-w-sm mx-auto space-y-1' },
              createElement(Label, { htmlFor: 'demo-email' }, 'Your email'),
              createElement(Input, { id: 'demo-email', type: 'email', placeholder: 'you@example.com' }),
            ),
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
          createElement(DemoBox, null,
            createElement('div', { className: 'flex items-center gap-3' },
              createElement(Switch, {
                checked: this.state.switchChecked,
                onChange: (checked: boolean) => this.setState({ switchChecked: checked }),
              }),
              createElement('span', { className: 'text-sm' },
                this.state.switchChecked ? 'On' : 'Off',
              ),
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
          createElement(DemoBox, { className: 'flex-col gap-6' },
            createElement('div', { className: 'w-48 text-center' },
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
          createElement(DemoBox, null,
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
          createElement(DemoBox, { className: 'flex-col' },
            createElement('div', { className: 'space-y-3 w-full max-w-sm' },
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
          ),
          createElement(CodeBlock, { code: "createElement(Skeleton, { className: 'h-4 w-48' })\ncreateElement(Skeleton, { className: 'size-10 rounded-full' })" }),
        ),

        // ===================================================================
        // CHECKBOX
        // ===================================================================
        createElement(SectionHeading, { id: 'checkbox' }, 'Checkbox'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'A control that allows the user to toggle between checked and not checked.',
          ),
          createElement(DemoBox, null,
            createElement('div', { className: 'flex items-center gap-3' },
              createElement(Checkbox, {
                id: 'terms',
                checked: this.state.checkboxChecked,
                onChange: (checked: boolean) => this.setState({ checkboxChecked: checked }),
              }),
              createElement(Label, { htmlFor: 'terms' }, 'Accept terms and conditions'),
            ),
          ),
          createElement(CodeBlock, { code: "createElement(Checkbox, {\n  checked: isChecked,\n  onChange: (checked) => setChecked(checked),\n})" }),
          createElement(PropTable, { rows: [
            { prop: 'checked', type: 'boolean', default: 'false' },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'onChange', type: '(checked: boolean) => void', default: '\u2014' },
            { prop: 'className', type: 'string', default: '\u2014' },
          ]}),
        ),

        // ===================================================================
        // RADIO GROUP
        // ===================================================================
        createElement(SectionHeading, { id: 'radio' }, 'Radio Group'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'A set of checkable buttons where only one can be checked at a time.',
          ),
          createElement(DemoBox, null,
            createElement(RadioGroup, null,
              ...['default', 'comfortable', 'compact'].map((val) =>
                createElement('div', { key: val, className: 'flex items-center gap-2' },
                  createElement(RadioGroupItem, {
                    value: val,
                    checked: this.state.radioValue === val,
                    onClick: () => this.setState({ radioValue: val }),
                  }),
                  createElement(Label, null, val.charAt(0).toUpperCase() + val.slice(1)),
                ),
              ),
            ),
          ),
          createElement(CodeBlock, { code: "createElement(RadioGroup, null,\n  createElement(RadioGroupItem, { value: 'a', checked: val === 'a', onClick: () => set('a') }),\n  createElement(RadioGroupItem, { value: 'b', checked: val === 'b', onClick: () => set('b') }),\n)" }),
        ),

        // ===================================================================
        // SELECT (static demo)
        // ===================================================================
        createElement(SectionHeading, { id: 'select' }, 'Select'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'A custom styled dropdown select. Composed of a trigger button that opens a positioned dropdown list. Click outside to close. Fully controlled — you manage open/selected state.',
          ),
          createElement(DemoBox, { className: 'block' },
            createElement('p', { className: 'text-sm text-muted-foreground text-center' },
              'Select is a controlled component — the demo requires state management. See the code example below.',
            ),
          ),
          createElement(CodeBlock, { code: "// Select is fully controlled. You manage open + selected state.\n\nconst [open, setOpen] = useState(false);\nconst [value, setValue] = useState('');\n\ncreateElement(Select, null,\n  createElement(SelectTrigger, {\n    open,\n    onClick: () => setOpen(!open),\n  },\n    createElement(SelectValue, {\n      placeholder: 'Choose a fruit...',\n    }, value || null),\n  ),\n  createElement(SelectContent, {\n    open,\n    onClose: () => setOpen(false),\n  },\n    createElement(SelectItem, {\n      value: 'apple',\n      selected: value === 'apple',\n      onClick: () => { setValue('apple'); setOpen(false); },\n    }, 'Apple'),\n    createElement(SelectItem, {\n      value: 'banana',\n      selected: value === 'banana',\n      onClick: () => { setValue('banana'); setOpen(false); },\n    }, 'Banana'),\n  ),\n)" }),
          createElement(PropTable, { rows: [
            { prop: 'open', type: 'boolean', default: 'false' },
            { prop: 'onClose', type: '() => void', default: '\u2014' },
            { prop: 'value', type: 'string', default: '\u2014' },
            { prop: 'selected', type: 'boolean', default: 'false' },
            { prop: 'placeholder', type: 'string', default: '\u2014' },
          ]}),
        ),

        // ===================================================================
        // SLIDER
        // ===================================================================
        createElement(SectionHeading, { id: 'slider' }, 'Slider'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'An input where the user selects a value from within a given range by dragging.',
          ),
          createElement(DemoBox, { className: 'flex-col' },
            createElement('div', { className: 'w-full space-y-2' },
              createElement(Slider, {
                value: this.state.sliderValue,
                min: 0,
                max: 100,
                step: 1,
                onValueChange: (v: number) => this.setState({ sliderValue: v }),
              }),
              createElement('p', { className: 'text-xs text-muted-foreground text-center' },
                'Value: ' + this.state.sliderValue,
              ),
            ),
          ),
          createElement(CodeBlock, { code: "createElement(Slider, {\n  value: 50,\n  min: 0,\n  max: 100,\n  step: 1,\n  onValueChange: (v) => setValue(v),\n})" }),
          createElement(PropTable, { rows: [
            { prop: 'value', type: 'number', default: '0' },
            { prop: 'min', type: 'number', default: '0' },
            { prop: 'max', type: 'number', default: '100' },
            { prop: 'step', type: 'number', default: '1' },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'onValueChange', type: '(value: number) => void', default: '\u2014' },
          ]}),
        ),

        // ===================================================================
        // AVATAR
        // ===================================================================
        createElement(SectionHeading, { id: 'avatar' }, 'Avatar'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'An image element with a fallback for representing the user.',
          ),
          createElement(DemoBox, null,
            createElement(ExampleRow, { label: 'With image & fallback' },
            createElement(Avatar, null,
              createElement(AvatarImage, { src: 'https://github.com/shadcn.png', alt: 'shadcn' }),
              createElement(AvatarFallback, null, 'CN'),
            ),
            createElement(Avatar, null,
              createElement(AvatarFallback, null, 'JD'),
            ),
              createElement(Avatar, { className: 'size-12' },
                createElement(AvatarFallback, { className: 'text-sm' }, 'AB'),
              ),
            ),
          ),
          createElement(CodeBlock, { code: "createElement(Avatar, null,\n  createElement(AvatarImage, { src: '/avatar.png', alt: 'User' }),\n  createElement(AvatarFallback, null, 'JD'),\n)" }),
        ),

        // ===================================================================
        // TABLE
        // ===================================================================
        createElement(SectionHeading, { id: 'table' }, 'Table'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'A responsive table component with composable header, body, and row slots.',
          ),
          createElement(DemoBox, { className: 'block p-0 overflow-hidden' },
            createElement(Table, null,
              createElement(TableHeader, null,
                createElement(TableRow, null,
                  createElement(TableHead, null, 'Invoice'),
                  createElement(TableHead, null, 'Status'),
                  createElement(TableHead, null, 'Method'),
                  createElement(TableHead, { className: 'text-right' }, 'Amount'),
                ),
              ),
              createElement(TableBody, null,
                ...([
                  { inv: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
                  { inv: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
                  { inv: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
                ] as const).map((row) =>
                  createElement(TableRow, { key: row.inv },
                    createElement(TableCell, { className: 'font-medium' }, row.inv),
                    createElement(TableCell, null, row.status),
                    createElement(TableCell, null, row.method),
                    createElement(TableCell, { className: 'text-right' }, row.amount),
                  ),
                ),
              ),
            ),
          ),
          createElement(CodeBlock, { code: "createElement(Table, null,\n  createElement(TableHeader, null,\n    createElement(TableRow, null,\n      createElement(TableHead, null, 'Name'),\n      createElement(TableHead, null, 'Amount'),\n    ),\n  ),\n  createElement(TableBody, null,\n    createElement(TableRow, null,\n      createElement(TableCell, null, 'Item'),\n      createElement(TableCell, null, '$100'),\n    ),\n  ),\n)" }),
        ),

        // ===================================================================
        // PROGRESS
        // ===================================================================
        createElement(SectionHeading, { id: 'progress' }, 'Progress'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Displays an indicator showing the completion progress of a task.',
          ),
          createElement(DemoBox, { className: 'flex-col' },
            createElement('div', { className: 'w-full space-y-4' },
              createElement(Progress, { value: this.state.progressValue }),
              createElement('div', { className: 'flex gap-2 justify-center' },
                createElement(Button, { size: 'xs', variant: 'outline', onClick: () => this.setState({ progressValue: Math.max(0, this.state.progressValue - 10) }) }, '-10'),
                createElement('span', { className: 'text-xs text-muted-foreground self-center' }, this.state.progressValue + '%'),
                createElement(Button, { size: 'xs', variant: 'outline', onClick: () => this.setState({ progressValue: Math.min(100, this.state.progressValue + 10) }) }, '+10'),
              ),
            ),
          ),
          createElement(CodeBlock, { code: "createElement(Progress, { value: 60 })" }),
          createElement(PropTable, { rows: [
            { prop: 'value', type: 'number', default: '0' },
            { prop: 'max', type: 'number', default: '100' },
            { prop: 'className', type: 'string', default: '\u2014' },
          ]}),
        ),

        // ===================================================================
        // ALERT
        // ===================================================================
        createElement(SectionHeading, { id: 'alert' }, 'Alert'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Displays a callout for important information. 2 variants.',
          ),
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
          createElement(CodeBlock, { code: "createElement(Alert, { variant: 'destructive' },\n  createElement(AlertTitle, null, 'Error'),\n  createElement(AlertDescription, null, 'Something went wrong.'),\n)" }),
        ),

        // ===================================================================
        // TABS
        // ===================================================================
        createElement(SectionHeading, { id: 'tabs' }, 'Tabs'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'A set of layered sections of content, known as tab panels, displayed one at a time.',
          ),
          createElement(DemoBox, { className: 'block' },
            createElement(Tabs, null,
              createElement(TabsList, null,
                createElement(TabsTrigger, {
                  value: 'preview',
                  active: this.state.tabValue === 'preview',
                  onClick: () => this.setState({ tabValue: 'preview' }),
                }, 'Preview'),
                createElement(TabsTrigger, {
                  value: 'code',
                  active: this.state.tabValue === 'code',
                  onClick: () => this.setState({ tabValue: 'code' }),
                }, 'Code'),
                createElement(TabsTrigger, {
                  value: 'settings',
                  active: this.state.tabValue === 'settings',
                  onClick: () => this.setState({ tabValue: 'settings' }),
                }, 'Settings'),
              ),
              createElement(TabsContent, { value: 'preview', active: this.state.tabValue === 'preview' },
                createElement(Card, null,
                  createElement(CardContent, { className: 'pt-6' },
                    createElement('p', { className: 'text-sm text-muted-foreground' }, 'This is the preview tab content.'),
                  ),
                ),
              ),
              createElement(TabsContent, { value: 'code', active: this.state.tabValue === 'code' },
                createElement(Card, null,
                  createElement(CardContent, { className: 'pt-6' },
                    createElement('p', { className: 'text-sm font-mono text-muted-foreground' }, 'console.log("Hello from code tab")'),
                  ),
                ),
              ),
              createElement(TabsContent, { value: 'settings', active: this.state.tabValue === 'settings' },
                createElement(Card, null,
                  createElement(CardContent, { className: 'pt-6' },
                    createElement('p', { className: 'text-sm text-muted-foreground' }, 'Settings panel content goes here.'),
                  ),
                ),
              ),
            ),
          ),
          createElement(CodeBlock, { code: "createElement(Tabs, null,\n  createElement(TabsList, null,\n    createElement(TabsTrigger, { value: 'a', active: tab === 'a', onClick: () => set('a') }, 'Tab A'),\n    createElement(TabsTrigger, { value: 'b', active: tab === 'b', onClick: () => set('b') }, 'Tab B'),\n  ),\n  createElement(TabsContent, { value: 'a', active: tab === 'a' }, 'Content A'),\n  createElement(TabsContent, { value: 'b', active: tab === 'b' }, 'Content B'),\n)" }),
        ),

        // ===================================================================
        // TOGGLE
        // ===================================================================
        createElement(SectionHeading, { id: 'toggle' }, 'Toggle'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'A two-state button that can be either on or off. Also available as a group.',
          ),
          createElement(DemoBox, { className: 'flex-col gap-6' },
            createElement(ExampleRow, { label: 'Single toggles' },
              createElement(Toggle, {
                pressed: this.state.toggleBold,
                onClick: () => this.setState({ toggleBold: !this.state.toggleBold }),
              }, 'B'),
              createElement(Toggle, {
                pressed: this.state.toggleItalic,
                onClick: () => this.setState({ toggleItalic: !this.state.toggleItalic }),
              }, 'I'),
              createElement(Toggle, { variant: 'outline' }, 'Outline'),
            ),
            createElement(ExampleRow, { label: 'Toggle group' },
              createElement(ToggleGroup, null,
                createElement(ToggleGroupItem, { value: 'bold', pressed: this.state.toggleBold, onClick: () => this.setState({ toggleBold: !this.state.toggleBold }) }, 'B'),
                createElement(ToggleGroupItem, { value: 'italic', pressed: this.state.toggleItalic, onClick: () => this.setState({ toggleItalic: !this.state.toggleItalic }) }, 'I'),
                createElement(ToggleGroupItem, { value: 'underline' }, 'U'),
              ),
            ),
          ),
          createElement(CodeBlock, { code: "createElement(Toggle, { pressed: isBold, onClick: () => toggle() }, 'B')" }),
          createElement(PropTable, { rows: [
            { prop: 'pressed', type: 'boolean', default: 'false' },
            { prop: 'variant', type: "'default' | 'outline'", default: "'default'" },
            { prop: 'size', type: "'default' | 'sm' | 'lg'", default: "'default'" },
            { prop: 'disabled', type: 'boolean', default: 'false' },
            { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
          ]}),
        ),

        // ===================================================================
        // ACCORDION
        // ===================================================================
        createElement(SectionHeading, { id: 'accordion' }, 'Accordion'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'A vertically stacked set of interactive headings that each reveal a section of content.',
          ),
          createElement(DemoBox, { className: 'block' },
            createElement('div', { className: 'max-w-lg mx-auto' },
              createElement(Accordion, null,
                ...([
                  { value: 'item-1', title: 'Is it accessible?', content: 'Yes. It follows WAI-ARIA design patterns with proper aria-expanded attributes.' },
                  { value: 'item-2', title: 'Is it styled?', content: 'Yes. It comes with default styles that match the other Blazecn components.' },
                  { value: 'item-3', title: 'Is it animated?', content: 'Uses CSS grid-rows animation for smooth expand and collapse with opacity transitions.' },
                ] as const).map((item) =>
                  createElement(AccordionItem, { key: item.value, value: item.value },
                    createElement(AccordionTrigger, {
                      open: this.state.accordionOpen === item.value,
                      onClick: () => this.setState({ accordionOpen: this.state.accordionOpen === item.value ? '' : item.value }),
                    }, item.title),
                    createElement(AccordionContent, { open: this.state.accordionOpen === item.value }, item.content),
                  ),
                ),
              ),
            ),
          ),
          createElement(CodeBlock, { code: "createElement(Accordion, null,\n  createElement(AccordionItem, { value: 'a' },\n    createElement(AccordionTrigger, { open: val === 'a', onClick: toggle }, 'Title'),\n    createElement(AccordionContent, { open: val === 'a' }, 'Content'),\n  ),\n)" }),
        ),

        // ===================================================================
        // DIALOG
        // ===================================================================
        createElement(SectionHeading, { id: 'dialog' }, 'Dialog'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'A modal dialog that interrupts the user with important content and expects a response.',
          ),
          createElement(DemoBox, null,
            createElement(Button, {
              variant: 'outline',
              onClick: () => this.setState({ dialogOpen: true }),
            }, 'Open Dialog'),
          ),
          createElement(Dialog, { open: this.state.dialogOpen, onOpenChange: (open: boolean) => this.setState({ dialogOpen: open }) },
            createElement(DialogContent, { onClose: () => this.setState({ dialogOpen: false }) },
              createElement(DialogHeader, null,
                createElement(DialogTitle, null, 'Are you sure?'),
                createElement(DialogDescription, null, 'This action cannot be undone. This will permanently delete your account.'),
              ),
              createElement(DialogFooter, null,
                createElement(Button, { variant: 'outline', onClick: () => this.setState({ dialogOpen: false }) }, 'Cancel'),
                createElement(Button, { variant: 'destructive', onClick: () => this.setState({ dialogOpen: false }) }, 'Delete'),
              ),
            ),
          ),
          createElement(CodeBlock, { code: "createElement(Dialog, { open: isOpen },\n  createElement(DialogContent, { onClose: () => setOpen(false) },\n    createElement(DialogHeader, null,\n      createElement(DialogTitle, null, 'Title'),\n      createElement(DialogDescription, null, 'Description'),\n    ),\n    createElement(DialogFooter, null,\n      createElement(Button, { onClick: close }, 'OK'),\n    ),\n  ),\n)" }),
        ),

        // ===================================================================
        // TOOLTIP
        // ===================================================================
        createElement(SectionHeading, { id: 'tooltip' }, 'Tooltip'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'A popup that displays information related to an element when the element receives focus or is hovered.',
          ),
          createElement(DemoBox, null,
            createElement(ExampleRow, { label: 'Sides' },
              createElement(Tooltip, { content: 'Top tooltip', side: 'top' },
                createElement(Button, { variant: 'outline', size: 'sm' }, 'Top'),
              ),
              createElement(Tooltip, { content: 'Bottom tooltip', side: 'bottom' },
                createElement(Button, { variant: 'outline', size: 'sm' }, 'Bottom'),
              ),
              createElement(Tooltip, { content: 'Left tooltip', side: 'left' },
                createElement(Button, { variant: 'outline', size: 'sm' }, 'Left'),
              ),
              createElement(Tooltip, { content: 'Right tooltip', side: 'right' },
                createElement(Button, { variant: 'outline', size: 'sm' }, 'Right'),
              ),
            ),
          ),
          createElement(CodeBlock, { code: "createElement(Tooltip, { content: 'Add to library', side: 'top' },\n  createElement(Button, { variant: 'outline' }, 'Hover me'),\n)" }),
          createElement(PropTable, { rows: [
            { prop: 'content', type: 'string', default: '\u2014' },
            { prop: 'side', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'" },
            { prop: 'delayMs', type: 'number', default: '200' },
            { prop: 'className', type: 'string', default: '\u2014' },
          ]}),
        ),

        // ===================================================================
        // TOAST
        // ===================================================================
        createElement(SectionHeading, { id: 'toast' }, 'Toast'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'A succinct message that is displayed temporarily. Uses an imperative toast() API with a pub/sub pattern.',
          ),
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
          createElement(CodeBlock, { code: "import { toast, Toaster } from './ui/Toast';\n\n// Mount once at root\ncreateElement(Toaster, null)\n\n// Call anywhere\ntoast({ title: 'Saved', description: 'Your changes have been saved.' })\ntoast({ title: 'Error', variant: 'destructive' })" }),
        ),

        // ===================================================================
        // SCROLL AREA
        // ===================================================================
        createElement(SectionHeading, { id: 'scroll-area' }, 'Scroll Area'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Augments native scroll functionality with a custom styled scrollbar. CSS-only, no JS overhead.',
          ),
          createElement(DemoBox, null,
            createElement(ScrollArea, { className: 'h-48 w-64 rounded-md border p-4' },
              ...Array.from({ length: 20 }, (_, i) =>
                createElement('div', { key: i, className: 'py-1 text-sm' }, 'Item ' + (i + 1)),
              ),
            ),
          ),
          createElement(CodeBlock, { code: "createElement(ScrollArea, { className: 'h-48 w-64 rounded-md border p-4' },\n  ...items.map((item) => createElement('div', null, item)),\n)" }),
        ),

        // ===================================================================
        // ASPECT RATIO
        // ===================================================================
        createElement(SectionHeading, { id: 'aspect-ratio' }, 'Aspect Ratio'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Displays content within a desired ratio. Uses padding-bottom technique for zero-JS layout.',
          ),
          createElement(DemoBox, { className: 'flex-col gap-6' },
            createElement('div', { className: 'w-full max-w-md' },
              createElement('p', { className: 'text-xs text-muted-foreground mb-2 text-center' }, '16:9'),
              createElement(AspectRatio, { ratio: 16 / 9, className: 'rounded-lg overflow-hidden bg-muted' },
                createElement('img', {
                  src: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80',
                  alt: 'Photo by Drew Beamer',
                  className: 'object-cover w-full h-full',
                }),
              ),
            ),
            createElement('div', { className: 'w-full max-w-[200px]' },
              createElement('p', { className: 'text-xs text-muted-foreground mb-2 text-center' }, '1:1'),
              createElement(AspectRatio, { ratio: 1, className: 'rounded-lg overflow-hidden bg-muted' },
                createElement('img', {
                  src: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=400&dpr=2&q=80',
                  alt: 'Photo by Drew Beamer',
                  className: 'object-cover w-full h-full',
                }),
              ),
            ),
          ),
          createElement(CodeBlock, { code: "createElement(AspectRatio, { ratio: 16 / 9 },\n  createElement('img', { src: '/photo.jpg', className: 'object-cover w-full h-full' }),\n)" }),
          createElement(PropTable, { rows: [
            { prop: 'ratio', type: 'number', default: '16/9' },
            { prop: 'className', type: 'string', default: '\u2014' },
          ]}),
        ),

        // ===================================================================
        // CN UTILITY
        // ===================================================================
        createElement(SectionHeading, { id: 'cn' }, 'cn() Utility'),
        createElement('div', { className: 'space-y-6' },
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Every Blazecn component uses cn() to merge CSS classes. It does two things:',
          ),
          createElement('div', { className: 'space-y-3' },
            createElement('div', { className: 'rounded-lg border border-border p-4 space-y-2' },
              createElement('p', { className: 'text-sm font-semibold' }, '1. Conditional classes (from clsx)'),
              createElement('p', { className: 'text-sm text-muted-foreground' },
                'Pass strings, booleans, arrays — falsy values are ignored. This lets you toggle classes on/off.',
              ),
              createElement(CodeBlock, { code: "cn('px-4', isActive && 'bg-primary')\n// isActive=true  \u2192 'px-4 bg-primary'\n// isActive=false \u2192 'px-4'" }),
            ),
            createElement('div', { className: 'rounded-lg border border-border p-4 space-y-2' },
              createElement('p', { className: 'text-sm font-semibold' }, '2. Conflict resolution (from tailwind-merge)'),
              createElement('p', { className: 'text-sm text-muted-foreground' },
                'When two Tailwind classes target the same CSS property, the last one wins. Without this, both classes would apply and the result would be unpredictable.',
              ),
              createElement(CodeBlock, { code: "cn('px-4', 'px-6')              \u2192 'px-6'     (last wins)\ncn('text-red-500', 'text-blue') \u2192 'text-blue' (last wins)" }),
            ),
            createElement('div', { className: 'rounded-lg border border-border p-4 space-y-2' },
              createElement('p', { className: 'text-sm font-semibold' }, 'Why it matters'),
              createElement('p', { className: 'text-sm text-muted-foreground' },
                'Every component accepts a className prop. cn() lets your custom classes cleanly override the defaults without fighting them.',
              ),
              createElement(CodeBlock, { code: "// Button has default padding 'px-4'\n// Your className='px-8' overrides it cleanly:\ncreateElement(Button, { className: 'px-8' }, 'Wide')\n// Result: px-8 (not px-4 px-8)" }),
            ),
          ),
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
      createElement(Toaster, null),
    );
  }
}
