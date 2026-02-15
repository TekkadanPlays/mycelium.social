import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Toggle } from '../../../ui/Toggle';
import { ToggleGroup, ToggleGroupItem } from '../../../ui/ToggleGroup';
import { PageHeader, DemoBox, ExampleRow, CodeBlock, PropTable } from '../_helpers';

export class TogglePage extends Component<{}, { bold: boolean; italic: boolean }> {
  declare state: { bold: boolean; italic: boolean };
  constructor(props: {}) {
    super(props);
    this.state = { bold: false, italic: false };
  }
  render() {
    return createElement('div', { className: 'space-y-8' },
      createElement(PageHeader, {
        title: 'Toggle',
        description: 'A two-state button that can be either on or off. Also available as a group.',
      }),
      createElement(DemoBox, { className: 'flex-col gap-6' },
        createElement(ExampleRow, { label: 'Single toggles' },
          createElement(Toggle, {
            pressed: this.state.bold,
            onClick: () => this.setState({ bold: !this.state.bold }),
          }, 'B'),
          createElement(Toggle, {
            pressed: this.state.italic,
            onClick: () => this.setState({ italic: !this.state.italic }),
          }, 'I'),
          createElement(Toggle, { variant: 'outline' }, 'Outline'),
        ),
        createElement(ExampleRow, { label: 'Toggle group' },
          createElement(ToggleGroup, null,
            createElement(ToggleGroupItem, { value: 'bold', pressed: this.state.bold, onClick: () => this.setState({ bold: !this.state.bold }) }, 'B'),
            createElement(ToggleGroupItem, { value: 'italic', pressed: this.state.italic, onClick: () => this.setState({ italic: !this.state.italic }) }, 'I'),
            createElement(ToggleGroupItem, { value: 'underline' }, 'U'),
          ),
        ),
      ),
      createElement(CodeBlock, { code: "import { Toggle } from '@/ui/Toggle'\n\ncreateElement(Toggle, { pressed: isBold, onClick: () => toggle() }, 'B')" }),
      createElement(PropTable, { rows: [
        { prop: 'pressed', type: 'boolean', default: 'false' },
        { prop: 'variant', type: "'default' | 'outline'", default: "'default'" },
        { prop: 'size', type: "'default' | 'sm' | 'lg'", default: "'default'" },
        { prop: 'disabled', type: 'boolean', default: 'false' },
        { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
      ]}),
    );
  }
}
