import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Checkbox } from '../../../ui/Checkbox';
import { Label } from '../../../ui/Label';
import { PageHeader, DemoBox, CodeBlock, PropTable } from '../_helpers';

export class CheckboxPage extends Component<{}, { checked: boolean }> {
  declare state: { checked: boolean };
  constructor(props: {}) {
    super(props);
    this.state = { checked: false };
  }
  render() {
    return createElement('div', { className: 'space-y-8' },
      createElement(PageHeader, {
        title: 'Checkbox',
        description: 'A control that allows the user to toggle between checked and not checked.',
      }),
      createElement(DemoBox, null,
        createElement('div', { className: 'flex items-center gap-3' },
          createElement(Checkbox, {
            id: 'terms',
            checked: this.state.checked,
            onChange: (checked: boolean) => this.setState({ checked }),
          }),
          createElement(Label, { htmlFor: 'terms' }, 'Accept terms and conditions'),
        ),
      ),
      createElement(CodeBlock, { code: "import { Checkbox } from '@/ui/Checkbox'\n\ncreateElement(Checkbox, {\n  checked: isChecked,\n  onChange: (checked) => setChecked(checked),\n})" }),
      createElement(PropTable, { rows: [
        { prop: 'checked', type: 'boolean', default: 'false' },
        { prop: 'disabled', type: 'boolean', default: 'false' },
        { prop: 'onChange', type: '(checked: boolean) => void', default: '\u2014' },
        { prop: 'className', type: 'string', default: '\u2014' },
      ]}),
    );
  }
}
