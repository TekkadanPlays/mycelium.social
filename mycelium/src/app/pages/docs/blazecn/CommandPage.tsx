import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import {
  Command, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator, CommandShortcut,
  CommandDialog,
} from '../../../ui/Command';
import { Button } from '../../../ui/Button';

interface CommandPageState {
  search: string;
  dialogOpen: boolean;
  dialogSearch: string;
}

const ITEMS = [
  { group: 'Suggestions', items: [
    { label: 'Calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', shortcut: null },
    { label: 'Search Emoji', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', shortcut: null },
    { label: 'Calculator', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z', shortcut: null },
  ]},
  { group: 'Settings', items: [
    { label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', shortcut: '\u2318P' },
    { label: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', shortcut: '\u2318B' },
    { label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', shortcut: '\u2318S' },
  ]},
];

function makeIcon(d: string) {
  return createElement('svg', {
    className: 'size-4 text-muted-foreground',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }, createElement('path', { d }));
}

function filterItems(search: string) {
  if (!search) return ITEMS;
  const q = search.toLowerCase();
  return ITEMS.map((g) => ({
    ...g,
    items: g.items.filter((item) => item.label.toLowerCase().includes(q)),
  })).filter((g) => g.items.length > 0);
}

export class CommandPage extends Component<{}, CommandPageState> {
  declare state: CommandPageState;

  constructor(props: {}) {
    super(props);
    this.state = { search: '', dialogOpen: false, dialogSearch: '' };
  }

  render() {
    const { search, dialogOpen, dialogSearch } = this.state;
    const filtered = filterItems(search);
    const dialogFiltered = filterItems(dialogSearch);

    return createElement('div', { className: 'space-y-10' },
      createElement(PageHeader, {
        title: 'Command',
        description: 'A command menu for searching and executing actions. Can be used inline or as a dialog.',
      }),

      // Inline demo
      createElement(SectionHeading, { id: 'demo' }, 'Demo'),
      createElement(DemoBox, { className: 'block p-6' },
        createElement(Command, { className: 'rounded-lg border shadow-md max-w-md mx-auto' },
          createElement(CommandInput, {
            value: search,
            onInput: (e: Event) => this.setState({ search: (e.target as HTMLInputElement).value }),
          }),
          createElement(CommandList, null,
            filtered.length === 0
              ? createElement(CommandEmpty, null)
              : null,
            ...filtered.map((group, gi) => [
              gi > 0 ? createElement(CommandSeparator, { key: `sep-${gi}` }) : null,
              createElement(CommandGroup, { key: group.group, heading: group.group },
                ...group.items.map((item) =>
                  createElement(CommandItem, { key: item.label },
                    makeIcon(item.icon),
                    createElement('span', null, item.label),
                    item.shortcut ? createElement(CommandShortcut, null, item.shortcut) : null,
                  ),
                ),
              ),
            ].filter(Boolean)),
          ),
        ),
      ),

      // Dialog demo
      createElement(SectionHeading, { id: 'dialog' }, 'Command Dialog'),
      createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
        'Wrap the command menu in a dialog for a spotlight-style search experience.',
      ),
      createElement(DemoBox, null,
        createElement(Button, {
          variant: 'outline',
          onClick: () => this.setState({ dialogOpen: true, dialogSearch: '' }),
        }, 'Open Command Palette'),
        dialogOpen
          ? createElement(CommandDialog, {
              open: true,
              onClose: () => this.setState({ dialogOpen: false }),
            },
              createElement(CommandInput, {
                value: dialogSearch,
                onInput: (e: Event) => this.setState({ dialogSearch: (e.target as HTMLInputElement).value }),
              }),
              createElement(CommandList, null,
                dialogFiltered.length === 0
                  ? createElement(CommandEmpty, null)
                  : null,
                ...dialogFiltered.map((group, gi) => [
                  gi > 0 ? createElement(CommandSeparator, { key: `sep-${gi}` }) : null,
                  createElement(CommandGroup, { key: group.group, heading: group.group },
                    ...group.items.map((item) =>
                      createElement(CommandItem, {
                        key: item.label,
                        onClick: () => this.setState({ dialogOpen: false }),
                      },
                        makeIcon(item.icon),
                        createElement('span', null, item.label),
                        item.shortcut ? createElement(CommandShortcut, null, item.shortcut) : null,
                      ),
                    ),
                  ),
                ].filter(Boolean)),
              ),
            )
          : null,
      ),

      // Usage
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement(CodeBlock, { code: `import {
  Command, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandShortcut,
} from '@/ui/Command'

createElement(Command, null,
  createElement(CommandInput, { placeholder: 'Search...' }),
  createElement(CommandList, null,
    createElement(CommandEmpty, null, 'No results.'),
    createElement(CommandGroup, { heading: 'Actions' },
      createElement(CommandItem, null, 'Calendar'),
      createElement(CommandItem, null, 'Search'),
    ),
  ),
)` }),

      // Props
      createElement(SectionHeading, { id: 'props' }, 'Props'),
      createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'CommandInput'),
      createElement(PropTable, {
        rows: [
          { prop: 'placeholder', type: 'string', default: "'Type a command or search...'" },
          { prop: 'value', type: 'string', default: '\u2014' },
          { prop: 'onInput', type: '(e: Event) => void', default: '\u2014' },
        ],
      }),
      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'CommandGroup'),
      createElement(PropTable, {
        rows: [
          { prop: 'heading', type: 'string', default: '\u2014' },
        ],
      }),
      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'CommandItem'),
      createElement(PropTable, {
        rows: [
          { prop: 'disabled', type: 'boolean', default: 'false' },
          { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
        ],
      }),
      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'CommandDialog'),
      createElement(PropTable, {
        rows: [
          { prop: 'open', type: 'boolean', default: 'false' },
          { prop: 'onClose', type: '() => void', default: '\u2014' },
        ],
      }),
    );
  }
}
