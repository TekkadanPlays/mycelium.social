import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Slider } from '../../../ui/Slider';
import { PageHeader, DemoBox, CodeBlock, PropTable } from '../_helpers';

export class SliderPage extends Component<{}, { value: number }> {
  declare state: { value: number };
  constructor(props: {}) {
    super(props);
    this.state = { value: 50 };
  }
  render() {
    return createElement('div', { className: 'space-y-8' },
      createElement(PageHeader, {
        title: 'Slider',
        description: 'An input where the user selects a value from within a given range by dragging.',
      }),
      createElement(DemoBox, { className: 'flex-col' },
        createElement('div', { className: 'w-full space-y-2' },
          createElement(Slider, {
            value: this.state.value,
            min: 0,
            max: 100,
            step: 1,
            onValueChange: (v: number) => this.setState({ value: v }),
          }),
          createElement('p', { className: 'text-xs text-muted-foreground text-center' },
            'Value: ' + this.state.value,
          ),
        ),
      ),
      createElement(CodeBlock, { code: "import { Slider } from '@/ui/Slider'\n\ncreateElement(Slider, {\n  value: 50,\n  min: 0,\n  max: 100,\n  step: 1,\n  onValueChange: (v) => setValue(v),\n})" }),
      createElement(PropTable, { rows: [
        { prop: 'value', type: 'number', default: '0' },
        { prop: 'min', type: 'number', default: '0' },
        { prop: 'max', type: 'number', default: '100' },
        { prop: 'step', type: 'number', default: '1' },
        { prop: 'disabled', type: 'boolean', default: 'false' },
        { prop: 'onValueChange', type: '(value: number) => void', default: '\u2014' },
      ]}),
    );
  }
}
