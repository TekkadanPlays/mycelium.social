import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Popover
//
// Positioned relative to trigger (no portals in InfernoJS).
// Click-outside closes via document listener.
// ---------------------------------------------------------------------------

interface PopoverProps {
  children?: any;
}

export function Popover({ children }: PopoverProps) {
  return createElement('div', {
    'data-slot': 'popover',
    className: 'relative inline-block',
  }, children);
}

// ---------------------------------------------------------------------------
// PopoverTrigger
// ---------------------------------------------------------------------------

interface PopoverTriggerProps {
  className?: string;
  onClick?: (e: Event) => void;
  children?: any;
}

export function PopoverTrigger({ className, onClick, children }: PopoverTriggerProps) {
  return createElement('button', {
    'data-slot': 'popover-trigger',
    type: 'button',
    onClick,
    className: cn('outline-none', className),
  }, children);
}

// ---------------------------------------------------------------------------
// PopoverContent
// ---------------------------------------------------------------------------

interface PopoverContentProps {
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom';
  open?: boolean;
  onClose?: () => void;
  children?: any;
}

export class PopoverContent extends Component<PopoverContentProps> {
  private handleClickOutside = (e: MouseEvent) => {
    const el = (this as any).$LI?.dom;
    if (el && !el.contains(e.target as Node)) {
      this.props.onClose?.();
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.props.onClose?.();
  };

  componentDidMount() {
    setTimeout(() => {
      document.addEventListener('mousedown', this.handleClickOutside);
      document.addEventListener('keydown', this.handleKeyDown);
    }, 0);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    const { className, align = 'center', side = 'bottom', open, children } = this.props;
    if (!open) return null;

    const alignClasses: Record<string, string> = {
      start: 'left-0',
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-0',
    };

    const sideClasses: Record<string, string> = {
      top: 'bottom-full mb-2',
      bottom: 'top-full mt-2',
    };

    return createElement('div', {
      'data-slot': 'popover-content',
      className: cn(
        'absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
        alignClasses[align],
        sideClasses[side],
        className,
      ),
    }, children);
  }
}
