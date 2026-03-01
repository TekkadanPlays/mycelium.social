import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// InputOTP
//
// A one-time password input component with individual character slots.
// Handles auto-focus, paste, backspace navigation between slots.
// ---------------------------------------------------------------------------

interface InputOTPProps {
  className?: string;
  maxLength: number;
  value?: string;
  onChange?: (value: string) => void;
  children?: any;
}

interface InputOTPState {
  values: string[];
  focusIndex: number;
}

export class InputOTP extends Component<InputOTPProps, InputOTPState> {
  declare state: InputOTPState;
  private inputs: (HTMLInputElement | null)[] = [];

  constructor(props: InputOTPProps) {
    super(props);
    const initial = (props.value || '').split('').slice(0, props.maxLength);
    this.state = {
      values: [...initial, ...Array(props.maxLength - initial.length).fill('')],
      focusIndex: 0,
    };
    this.inputs = Array(props.maxLength).fill(null);
  }

  private handleInput = (index: number, e: Event) => {
    const input = e.target as HTMLInputElement;
    const char = input.value.slice(-1);
    const newValues = [...this.state.values];
    newValues[index] = char;
    this.setState({ values: newValues, focusIndex: index }, () => {
      this.props.onChange?.(newValues.join(''));
      if (char && index < this.props.maxLength - 1) {
        this.inputs[index + 1]?.focus();
      }
    });
  };

  private handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!this.state.values[index] && index > 0) {
        e.preventDefault();
        const newValues = [...this.state.values];
        newValues[index - 1] = '';
        this.setState({ values: newValues, focusIndex: index - 1 }, () => {
          this.props.onChange?.(newValues.join(''));
          this.inputs[index - 1]?.focus();
        });
      } else {
        const newValues = [...this.state.values];
        newValues[index] = '';
        this.setState({ values: newValues }, () => {
          this.props.onChange?.(newValues.join(''));
        });
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      this.inputs[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < this.props.maxLength - 1) {
      e.preventDefault();
      this.inputs[index + 1]?.focus();
    }
  };

  private handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pasted = (e.clipboardData?.getData('text') || '').slice(0, this.props.maxLength);
    const newValues = [...this.state.values];
    for (let i = 0; i < pasted.length; i++) {
      newValues[i] = pasted[i];
    }
    this.setState({ values: newValues }, () => {
      this.props.onChange?.(newValues.join(''));
      const nextIndex = Math.min(pasted.length, this.props.maxLength - 1);
      this.inputs[nextIndex]?.focus();
    });
  };

  private handleFocus = (index: number) => {
    this.setState({ focusIndex: index });
    const input = this.inputs[index];
    if (input) input.select();
  };

  render() {
    const { className, maxLength } = this.props;
    const { values, focusIndex } = this.state;

    return createElement('div', {
      'data-slot': 'input-otp',
      className: cn('flex items-center gap-2', className),
    },
      ...Array.from({ length: maxLength }, (_, i) =>
        createElement('input', {
          key: String(i),
          ref: (el: HTMLInputElement | null) => { this.inputs[i] = el; },
          type: 'text',
          inputMode: 'numeric',
          maxLength: 1,
          value: values[i] || '',
          oninput: (e: Event) => this.handleInput(i, e),
          onkeydown: (e: KeyboardEvent) => this.handleKeyDown(i, e),
          onpaste: (e: ClipboardEvent) => this.handlePaste(e),
          onfocus: () => this.handleFocus(i),
          'aria-label': `Digit ${i + 1}`,
          className: cn(
            'flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-center text-sm font-medium shadow-xs transition-all',
            'outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring',
            'placeholder:text-muted-foreground',
          ),
        }),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// InputOTPGroup — visual grouping with separator support
// ---------------------------------------------------------------------------

interface InputOTPGroupProps {
  className?: string;
  children?: any;
}

export function InputOTPGroup({ className, children }: InputOTPGroupProps) {
  return createElement('div', {
    'data-slot': 'input-otp-group',
    className: cn('flex items-center gap-2', className),
  }, children);
}

// ---------------------------------------------------------------------------
// InputOTPSeparator — dash between groups
// ---------------------------------------------------------------------------

interface InputOTPSeparatorProps {
  className?: string;
}

export function InputOTPSeparator({ className }: InputOTPSeparatorProps) {
  return createElement('div', {
    'data-slot': 'input-otp-separator',
    role: 'separator',
    className: cn('text-muted-foreground', className),
  }, '\u2014');
}
