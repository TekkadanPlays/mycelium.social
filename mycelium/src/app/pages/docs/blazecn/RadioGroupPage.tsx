import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { RadioGroup, RadioGroupItem } from '../../../ui/RadioGroup';
import { Label } from '../../../ui/Label';
import { PageHeader, DemoBox, CodeBlock } from '../_helpers';

export class RadioGroupPage extends Component<{}, { value: string }> {
  declare state: { value: string };
  constructor(props: {}) {
    super(props);
    this.state = { value: 'default' };
  }
  render() {
    return createElement('div', { className: 'space-y-8' },
      createElement(PageHeader, {
        title: 'Radio Group',
        description: 'A set of checkable buttons where only one can be checked at a time.',
      }),
      createElement(DemoBox, null,
        createElement(RadioGroup, null,
          ...['default', 'comfortable', 'compact'].map((val) =>
            createElement('div', { key: val, className: 'flex items-center gap-2' },
              createElement(RadioGroupItem, {
                value: val,
                checked: this.state.value === val,
                onClick: () => this.setState({ value: val }),
              }),
              createElement(Label, null, val.charAt(0).toUpperCase() + val.slice(1)),
            ),
          ),
        ),
      ),
      createElement(CodeBlock, { code: "import { RadioGroup, RadioGroupItem } from '@/ui/RadioGroup'\n\ncreateElement(RadioGroup, null,\n  createElement(RadioGroupItem, { value: 'a', checked: val === 'a', onClick: () => set('a') }),\n  createElement(RadioGroupItem, { value: 'b', checked: val === 'b', onClick: () => set('b') }),\n)" }),
    );
  }
}
