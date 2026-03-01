import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import { ToggleGroup, ToggleGroupItem } from '../../../ui/ToggleGroup';

interface ToggleGroupPageState {
  single: string;
  multiple: string[];
}

export class ToggleGroupPage extends Component<{}, ToggleGroupPageState> {
  declare state: ToggleGroupPageState;

  constructor(props: {}) {
    super(props);
    this.state = { single: 'center', multiple: ['bold'] };
  }

  render() {
    const { single, multiple } = this.state;

    return createElement('div', { className: 'space-y-10' },
      createElement(PageHeader, {
        title: 'Toggle Group',
        description: 'A set of two-state buttons that can be toggled on or off. Supports single and multiple selection modes.',
      }),

      // Single demo
      createElement(SectionHeading, { id: 'single' }, 'Single Selection'),
      createElement(DemoBox, null,
        createElement(ToggleGroup, { type: 'single', value: single },
          ...['left', 'center', 'right'].map((val) =>
            createElement(ToggleGroupItem, {
              key: val,
              value: val,
              pressed: single === val,
              onClick: () => this.setState({ single: val }),
            }, val.charAt(0).toUpperCase() + val.slice(1)),
          ),
        ),
      ),

      // Multiple demo
      createElement(SectionHeading, { id: 'multiple' }, 'Multiple Selection'),
      createElement(DemoBox, null,
        createElement(ToggleGroup, { type: 'multiple', value: multiple },
          ...['bold', 'italic', 'underline'].map((val) =>
            createElement(ToggleGroupItem, {
              key: val,
              value: val,
              pressed: multiple.includes(val),
              onClick: () => {
                const next = multiple.includes(val)
                  ? multiple.filter((v) => v !== val)
                  : [...multiple, val];
                this.setState({ multiple: next });
              },
            }, val.charAt(0).toUpperCase() + val.slice(1)),
          ),
        ),
      ),

      // Usage
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement(CodeBlock, { code: `import { ToggleGroup, ToggleGroupItem } from './ui/ToggleGroup'

// Single selection
<ToggleGroup type="single" value={value}>
  <ToggleGroupItem value="a" pressed={value === 'a'} onClick={() => set('a')}>A</ToggleGroupItem>
  <ToggleGroupItem value="b" pressed={value === 'b'} onClick={() => set('b')}>B</ToggleGroupItem>
</ToggleGroup>

// Multiple selection
<ToggleGroup type="multiple" value={values}>
  <ToggleGroupItem value="bold" pressed={values.includes('bold')} onClick={toggle}>B</ToggleGroupItem>
  <ToggleGroupItem value="italic" pressed={values.includes('italic')} onClick={toggle}>I</ToggleGroupItem>
</ToggleGroup>` }),

      // Props
      createElement(SectionHeading, { id: 'props' }, 'Props'),
      createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'ToggleGroup'),
      createElement(PropTable, {
        rows: [
          { prop: 'type', type: "'single' | 'multiple'", default: "'single'" },
          { prop: 'variant', type: "'default' | 'outline'", default: "'default'" },
          { prop: 'size', type: "'default' | 'sm' | 'lg'", default: "'default'" },
          { prop: 'value', type: 'string | string[]', default: '\u2014' },
          { prop: 'onValueChange', type: '(value) => void', default: '\u2014' },
          { prop: 'disabled', type: 'boolean', default: 'false' },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'ToggleGroupItem'),
      createElement(PropTable, {
        rows: [
          { prop: 'value', type: 'string', default: '\u2014' },
          { prop: 'pressed', type: 'boolean', default: 'false' },
          { prop: 'disabled', type: 'boolean', default: 'false' },
          { prop: 'variant', type: "'default' | 'outline'", default: "'default'" },
          { prop: 'size', type: "'default' | 'sm' | 'lg'", default: "'default'" },
          { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
    );
  }
}
