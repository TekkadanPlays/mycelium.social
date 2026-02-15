import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Progress } from '../../../ui/Progress';
import { Button } from '../../../ui/Button';
import { PageHeader, DemoBox, CodeBlock, PropTable } from '../_helpers';

export class ProgressPage extends Component<{}, { value: number }> {
  declare state: { value: number };
  constructor(props: {}) {
    super(props);
    this.state = { value: 60 };
  }
  render() {
    return createElement('div', { className: 'space-y-8' },
      createElement(PageHeader, {
        title: 'Progress',
        description: 'Displays an indicator showing the completion progress of a task.',
      }),
      createElement(DemoBox, { className: 'flex-col' },
        createElement('div', { className: 'w-full space-y-4' },
          createElement(Progress, { value: this.state.value }),
          createElement('div', { className: 'flex gap-2 justify-center' },
            createElement(Button, { size: 'xs', variant: 'outline', onClick: () => this.setState({ value: Math.max(0, this.state.value - 10) }) }, '-10'),
            createElement('span', { className: 'text-xs text-muted-foreground self-center' }, this.state.value + '%'),
            createElement(Button, { size: 'xs', variant: 'outline', onClick: () => this.setState({ value: Math.min(100, this.state.value + 10) }) }, '+10'),
          ),
        ),
      ),
      createElement(CodeBlock, { code: "import { Progress } from '@/ui/Progress'\n\ncreateElement(Progress, { value: 60 })" }),
      createElement(PropTable, { rows: [
        { prop: 'value', type: 'number', default: '0' },
        { prop: 'max', type: 'number', default: '100' },
        { prop: 'className', type: 'string', default: '\u2014' },
      ]}),
    );
  }
}
