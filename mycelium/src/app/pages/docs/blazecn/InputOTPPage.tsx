import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import { InputOTP, InputOTPSeparator } from '../../../ui/InputOTP';

interface InputOTPPageState {
  value4: string;
  value6: string;
}

export class InputOTPPage extends Component<{}, InputOTPPageState> {
  declare state: InputOTPPageState;

  constructor(props: {}) {
    super(props);
    this.state = { value4: '', value6: '' };
  }

  render() {
    const { value4, value6 } = this.state;

    return createElement('div', { className: 'space-y-10' },
      createElement(PageHeader, {
        title: 'Input OTP',
        description: 'Accessible one-time password input with auto-focus, paste support, and keyboard navigation.',
      }),

      // Demo — 6 digits
      createElement(SectionHeading, { id: 'demo' }, 'Demo'),
      createElement(DemoBox, { className: 'flex-col gap-4' },
        createElement(InputOTP, {
          maxLength: 6,
          value: value6,
          onChange: (v: string) => this.setState({ value6: v }),
        }),
        createElement('p', { className: 'text-xs text-muted-foreground text-center' },
          value6.length === 6 ? 'Code entered: ' + value6 : 'Enter your 6-digit code',
        ),
      ),

      // 4-digit pattern
      createElement(SectionHeading, { id: 'four-digit' }, '4-Digit Pattern'),
      createElement(DemoBox, { className: 'flex-col gap-4' },
        createElement(InputOTP, {
          maxLength: 4,
          value: value4,
          onChange: (v: string) => this.setState({ value4: v }),
        }),
        createElement('p', { className: 'text-xs text-muted-foreground text-center' },
          value4.length === 4 ? 'PIN: ' + value4 : 'Enter your 4-digit PIN',
        ),
      ),

      // Features
      createElement(SectionHeading, { id: 'features' }, 'Features'),
      createElement('ul', { className: 'text-sm text-muted-foreground space-y-1 list-disc pl-5' },
        createElement('li', null, 'Auto-focuses next input on character entry'),
        createElement('li', null, 'Backspace navigates to previous input'),
        createElement('li', null, 'Arrow keys navigate between inputs'),
        createElement('li', null, 'Paste support \u2014 distributes pasted text across all slots'),
        createElement('li', null, 'Click to focus selects the character in that slot'),
        createElement('li', null, 'Numeric input mode on mobile keyboards'),
      ),

      // Usage
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement(CodeBlock, { code: `import { InputOTP } from '@/ui/InputOTP'

createElement(InputOTP, {
  maxLength: 6,
  value: otpValue,
  onChange: (value) => setOtpValue(value),
})` }),

      // Props
      createElement(SectionHeading, { id: 'props' }, 'Props'),
      createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'InputOTP'),
      createElement(PropTable, {
        rows: [
          { prop: 'maxLength', type: 'number', default: '\u2014 (required)' },
          { prop: 'value', type: 'string', default: "''" },
          { prop: 'onChange', type: '(value: string) => void', default: '\u2014' },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
    );
  }
}
