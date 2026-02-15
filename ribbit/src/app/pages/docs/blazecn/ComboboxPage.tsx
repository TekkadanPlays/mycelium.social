import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import {
  Command, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem,
} from '../../../ui/Command';
import { Button } from '../../../ui/Button';

const FRAMEWORKS = [
  { value: 'next', label: 'Next.js' },
  { value: 'svelte', label: 'SvelteKit' },
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
  { value: 'inferno', label: 'Inferno' },
];

interface ComboboxPageState {
  open: boolean;
  selected: string;
  search: string;
}

export class ComboboxPage extends Component<{}, ComboboxPageState> {
  declare state: ComboboxPageState;
  private ref: HTMLDivElement | null = null;

  constructor(props: {}) {
    super(props);
    this.state = { open: false, selected: '', search: '' };
  }

  private handleOutside = (e: MouseEvent) => {
    if (this.state.open && this.ref && !this.ref.contains(e.target as Node)) {
      this.setState({ open: false });
    }
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutside);
  }

  render() {
    const { open, selected, search } = this.state;
    const filtered = search
      ? FRAMEWORKS.filter((f) => f.label.toLowerCase().includes(search.toLowerCase()))
      : FRAMEWORKS;
    const selectedLabel = FRAMEWORKS.find((f) => f.value === selected)?.label;

    return createElement('div', { className: 'space-y-10' },
      createElement(PageHeader, {
        title: 'Combobox',
        description: 'Autocomplete input and command palette with a list of suggestions. Built on top of the Command component.',
      }),

      // Demo
      createElement(SectionHeading, { id: 'demo' }, 'Demo'),
      createElement(DemoBox, null,
        createElement('div', {
          ref: (el: HTMLDivElement | null) => { this.ref = el; },
          className: 'relative w-[200px]',
        },
          createElement(Button, {
            variant: 'outline',
            className: 'w-full justify-between',
            onClick: () => this.setState((s: ComboboxPageState) => ({ open: !s.open, search: '' })),
          },
            selectedLabel || 'Select framework...',
            createElement('svg', {
              className: 'ml-2 size-4 shrink-0 opacity-50',
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': '2',
            }, createElement('path', { d: 'M6 9l6 6 6-6' })),
          ),
          open
            ? createElement('div', {
                className: 'absolute top-full left-0 z-50 mt-1 w-full',
              },
                createElement(Command, { className: 'rounded-lg border shadow-md' },
                  createElement(CommandInput, {
                    placeholder: 'Search framework...',
                    value: search,
                    onInput: (e: Event) => this.setState({ search: (e.target as HTMLInputElement).value }),
                  }),
                  createElement(CommandList, null,
                    filtered.length === 0
                      ? createElement(CommandEmpty, null, 'No framework found.')
                      : null,
                    createElement(CommandGroup, null,
                      ...filtered.map((fw) =>
                        createElement(CommandItem, {
                          key: fw.value,
                          onClick: () => this.setState({ selected: fw.value, open: false }),
                        },
                          createElement('svg', {
                            className: `mr-2 size-4 ${selected === fw.value ? 'opacity-100' : 'opacity-0'}`,
                            viewBox: '0 0 24 24',
                            fill: 'none',
                            stroke: 'currentColor',
                            'stroke-width': '2',
                            'stroke-linecap': 'round',
                            'stroke-linejoin': 'round',
                          }, createElement('path', { d: 'M20 6L9 17l-5-5' })),
                          fw.label,
                        ),
                      ),
                    ),
                  ),
                ),
              )
            : null,
        ),
      ),

      // Usage
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
        'The Combobox is built by composing the Command component with a Popover-style dropdown. It is not a separate component \u2014 it\u2019s a pattern.',
      ),
      createElement(CodeBlock, { code: `import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from '@/ui/Command'
import { Button } from '@/ui/Button'

// Toggle open state
createElement(Button, { onClick: toggle }, selected || 'Select...')

// Dropdown
open && createElement(Command, { className: 'border shadow-md' },
  createElement(CommandInput, { placeholder: 'Search...' }),
  createElement(CommandList, null,
    createElement(CommandGroup, null,
      items.map(item =>
        createElement(CommandItem, {
          onClick: () => select(item),
        }, item.label),
      ),
    ),
  ),
)` }),

      // Props
      createElement(SectionHeading, { id: 'props' }, 'Props'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'The Combobox uses Command component props. See the ',
        createElement('a', {
          href: '/docs/blazecn/command',
          className: 'underline hover:text-foreground',
        }, 'Command'),
        ' docs for full API reference.',
      ),
    );
  }
}
