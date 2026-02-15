import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Toggle } from '../../../ui/Toggle';
import { ToggleGroup, ToggleGroupItem } from '../../../ui/ToggleGroup';
import { PageHeader, SectionHeading, DemoBox, ExampleRow, CodeBlock, PropTable } from '../_helpers';

interface TogglePageState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  bookmark: boolean;
}

export class TogglePage extends Component<{}, TogglePageState> {
  declare state: TogglePageState;
  constructor(props: {}) {
    super(props);
    this.state = { bold: false, italic: false, underline: false, bookmark: false };
  }

  // SVG icon helpers
  private boldIcon() {
    return createElement('svg', { className: 'size-4', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
      createElement('path', { d: 'M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8' }),
    );
  }
  private italicIcon() {
    return createElement('svg', { className: 'size-4', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
      createElement('line', { x1: '19', y1: '4', x2: '10', y2: '4' }),
      createElement('line', { x1: '14', y1: '20', x2: '5', y2: '20' }),
      createElement('line', { x1: '15', y1: '4', x2: '9', y2: '20' }),
    );
  }
  private underlineIcon() {
    return createElement('svg', { className: 'size-4', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
      createElement('path', { d: 'M6 4v6a6 6 0 0 0 12 0V4' }),
      createElement('line', { x1: '4', y1: '20', x2: '20', y2: '20' }),
    );
  }
  private bookmarkIcon() {
    return createElement('svg', { className: 'size-4', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
      createElement('path', { d: 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z' }),
    );
  }

  render() {
    const { bold, italic, underline, bookmark } = this.state;

    return createElement('div', { className: 'space-y-10' },
      createElement(PageHeader, {
        title: 'Toggle',
        description: 'A two-state button that can be either on or off.',
      }),

      // Default
      createElement(SectionHeading, { id: 'demo' }, 'Demo'),
      createElement(DemoBox, null,
        createElement(Toggle, {
          pressed: bookmark,
          onClick: () => this.setState({ bookmark: !bookmark }),
          'aria-label': 'Toggle bookmark',
        }, this.bookmarkIcon()),
      ),

      // Outline
      createElement(SectionHeading, { id: 'outline' }, 'Outline'),
      createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
        'Use variant="outline" for an outline style.',
      ),
      createElement(DemoBox, null,
        createElement(Toggle, {
          variant: 'outline',
          pressed: italic,
          onClick: () => this.setState({ italic: !italic }),
          'aria-label': 'Toggle italic',
        }, this.italicIcon()),
      ),

      // With Text
      createElement(SectionHeading, { id: 'with-text' }, 'With Text'),
      createElement(DemoBox, null,
        createElement(Toggle, {
          pressed: italic,
          onClick: () => this.setState({ italic: !italic }),
          'aria-label': 'Toggle italic',
        }, this.italicIcon(), ' Italic'),
      ),

      // Sizes
      createElement(SectionHeading, { id: 'sizes' }, 'Sizes'),
      createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
        'Use the size prop to change the size of the toggle.',
      ),
      createElement(DemoBox, null,
        createElement(ExampleRow, { label: '' },
          createElement(Toggle, { size: 'sm', pressed: bold, onClick: () => this.setState({ bold: !bold }), 'aria-label': 'Toggle bold sm' }, this.boldIcon()),
          createElement(Toggle, { pressed: bold, onClick: () => this.setState({ bold: !bold }), 'aria-label': 'Toggle bold default' }, this.boldIcon()),
          createElement(Toggle, { size: 'lg', pressed: bold, onClick: () => this.setState({ bold: !bold }), 'aria-label': 'Toggle bold lg' }, this.boldIcon()),
        ),
      ),

      // Disabled
      createElement(SectionHeading, { id: 'disabled' }, 'Disabled'),
      createElement(DemoBox, null,
        createElement(Toggle, { disabled: true, 'aria-label': 'Toggle disabled' }, this.italicIcon()),
      ),

      // Toggle Group
      createElement(SectionHeading, { id: 'toggle-group' }, 'Toggle Group'),
      createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
        'A set of two-state buttons that can be toggled on or off.',
      ),
      createElement(DemoBox, null,
        createElement(ToggleGroup, null,
          createElement(ToggleGroupItem, { value: 'bold', pressed: bold, onClick: () => this.setState({ bold: !bold }), 'aria-label': 'Toggle bold' }, this.boldIcon()),
          createElement(ToggleGroupItem, { value: 'italic', pressed: italic, onClick: () => this.setState({ italic: !italic }), 'aria-label': 'Toggle italic' }, this.italicIcon()),
          createElement(ToggleGroupItem, { value: 'underline', pressed: underline, onClick: () => this.setState({ underline: !underline }), 'aria-label': 'Toggle underline' }, this.underlineIcon()),
        ),
      ),

      // Outline Toggle Group
      createElement(SectionHeading, { id: 'toggle-group-outline' }, 'Toggle Group Outline'),
      createElement(DemoBox, null,
        createElement(ToggleGroup, null,
          createElement(ToggleGroupItem, { value: 'bold', variant: 'outline', pressed: bold, onClick: () => this.setState({ bold: !bold }), 'aria-label': 'Toggle bold' }, this.boldIcon()),
          createElement(ToggleGroupItem, { value: 'italic', variant: 'outline', pressed: italic, onClick: () => this.setState({ italic: !italic }), 'aria-label': 'Toggle italic' }, this.italicIcon()),
          createElement(ToggleGroupItem, { value: 'underline', variant: 'outline', pressed: underline, onClick: () => this.setState({ underline: !underline }), 'aria-label': 'Toggle underline' }, this.underlineIcon()),
        ),
      ),

      // Code
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement(CodeBlock, { code: `import { Toggle } from '@/ui/Toggle'

createElement(Toggle, {
  pressed: isBookmarked,
  onClick: () => setBookmarked(!isBookmarked),
  'aria-label': 'Toggle bookmark',
}, bookmarkIcon)` }),

      createElement(CodeBlock, { code: `import { ToggleGroup, ToggleGroupItem } from '@/ui/ToggleGroup'

createElement(ToggleGroup, null,
  createElement(ToggleGroupItem, { value: 'bold', pressed: bold, onClick: toggle }, boldIcon),
  createElement(ToggleGroupItem, { value: 'italic', pressed: italic, onClick: toggle }, italicIcon),
  createElement(ToggleGroupItem, { value: 'underline', pressed: underline, onClick: toggle }, underlineIcon),
)` }),

      // Props
      createElement(SectionHeading, { id: 'props' }, 'Props'),
      createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'Toggle'),
      createElement(PropTable, { rows: [
        { prop: 'pressed', type: 'boolean', default: 'false' },
        { prop: 'variant', type: "'default' | 'outline'", default: "'default'" },
        { prop: 'size', type: "'default' | 'sm' | 'lg'", default: "'default'" },
        { prop: 'disabled', type: 'boolean', default: 'false' },
        { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
      ]}),
      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'ToggleGroupItem'),
      createElement(PropTable, { rows: [
        { prop: 'value', type: 'string', default: '\u2014' },
        { prop: 'pressed', type: 'boolean', default: 'false' },
        { prop: 'variant', type: "'default' | 'outline'", default: "'default'" },
        { prop: 'size', type: "'default' | 'sm' | 'lg'", default: "'default'" },
        { prop: 'disabled', type: 'boolean', default: 'false' },
        { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
      ]}),
    );
  }
}
