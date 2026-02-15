import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Tooltip
//
// InfernoJS doesn't have portals, so we position the tooltip relative to the
// trigger using a wrapper div. This is the main architectural difference from
// shadcn's Radix-based Tooltip which uses a portal.
// ---------------------------------------------------------------------------

interface TooltipProps {
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  delayMs?: number;
  children?: any;
}

interface TooltipState {
  visible: boolean;
}

export class Tooltip extends Component<TooltipProps, TooltipState> {
  declare state: TooltipState;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: TooltipProps) {
    super(props);
    this.state = { visible: false };
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  private show = () => {
    const delay = this.props.delayMs ?? 200;
    this.timer = setTimeout(() => this.setState({ visible: true }), delay);
  };

  private hide = () => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.setState({ visible: false });
  };

  render() {
    const { content, side = 'top', className, children } = this.props;
    const { visible } = this.state;

    const positionClasses: Record<string, string> = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return createElement('div', {
      'data-slot': 'tooltip',
      className: 'relative inline-flex',
      onMouseEnter: this.show,
      onMouseLeave: this.hide,
      onFocus: this.show,
      onBlur: this.hide,
    },
      children,
      visible
        ? createElement('div', {
            'data-slot': 'tooltip-content',
            role: 'tooltip',
            className: cn(
              'absolute z-50 w-fit rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md pointer-events-none whitespace-nowrap',
              positionClasses[side],
              className,
            ),
          }, content)
        : null,
    );
  }
}
