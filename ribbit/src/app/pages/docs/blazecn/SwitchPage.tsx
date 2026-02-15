import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Switch } from '../../../ui/Switch';
import { Label } from '../../../ui/Label';
import { PageHeader, DemoBox, CodeBlock, PropTable } from '../_helpers';

export class SwitchPage extends Component<{}, { checked: boolean }> {
  declare state: { checked: boolean };
  constructor(props: {}) {
    super(props);
    this.state = { checked: false };
  }
  render() {
    return createElement('div', { className: 'space-y-8' },
      createElement(PageHeader, {
        title: 'Switch',
        description: 'A toggle switch with ARIA role="switch" for boolean settings.',
      }),
      createElement(DemoBox, null,
        createElement('div', { className: 'flex items-center gap-3' },
          createElement(Switch, {
            checked: this.state.checked,
            onChange: (checked: boolean) => this.setState({ checked }),
          }),
          createElement(Label, null, this.state.checked ? 'On' : 'Off'),
        ),
      ),
      createElement(CodeBlock, { code: "import { Switch } from '@/ui/Switch'\n\ncreateElement(Switch, {\n  checked: isEnabled,\n  onChange: (checked) => setEnabled(checked),\n})" }),
      createElement(PropTable, { rows: [
        { prop: 'checked', type: 'boolean', default: 'false' },
        { prop: 'disabled', type: 'boolean', default: 'false' },
        { prop: 'onChange', type: '(checked: boolean) => void', default: '\u2014' },
        { prop: 'className', type: 'string', default: '\u2014' },
      ]}),
    );
  }
}
