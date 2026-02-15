import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Progress } from '../../../ui/Progress';
import { Button } from '../../../ui/Button';
import { PageHeader, DemoBox, SectionHeading, CodeBlock, PropTable } from '../_helpers';

interface ProgressPageState {
  value: number;
  running: boolean;
}

export class ProgressPage extends Component<{}, ProgressPageState> {
  declare state: ProgressPageState;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: {}) {
    super(props);
    this.state = { value: 0, running: false };
  }

  componentDidMount() {
    this.startAnimation();
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  private startAnimation = () => {
    this.setState({ value: 13, running: true });
    this.timer = setTimeout(() => this.setState({ value: 66 }), 500);
    setTimeout(() => {
      this.timer = setTimeout(() => this.setState({ value: 100 }), 1200);
    }, 0);
  };

  private restart = () => {
    if (this.timer) clearTimeout(this.timer);
    this.setState({ value: 0, running: false }, () => {
      setTimeout(() => this.startAnimation(), 200);
    });
  };

  render() {
    return createElement('div', { className: 'space-y-8' },
      createElement(PageHeader, {
        title: 'Progress',
        description: 'Displays an indicator showing the completion progress of a task.',
      }),

      // Auto-animated demo
      createElement(SectionHeading, { id: 'demo' }, 'Demo'),
      createElement(DemoBox, { className: 'flex-col gap-4' },
        createElement('div', { className: 'w-full max-w-md space-y-3' },
          createElement(Progress, { value: this.state.value }),
          createElement('div', { className: 'flex items-center justify-between' },
            createElement('span', { className: 'text-xs text-muted-foreground tabular-nums' }, this.state.value + '%'),
            createElement(Button, { size: 'sm', variant: 'outline', onClick: this.restart }, 'Restart'),
          ),
        ),
      ),

      // Static examples
      createElement(SectionHeading, { id: 'examples' }, 'Examples'),
      createElement(DemoBox, { className: 'flex-col gap-6' },
        createElement('div', { className: 'w-full max-w-md space-y-4' },
          ...[0, 25, 50, 75, 100].map((v) =>
            createElement('div', { key: String(v), className: 'space-y-1' },
              createElement('span', { className: 'text-xs text-muted-foreground' }, v + '%'),
              createElement(Progress, { value: v }),
            ),
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
