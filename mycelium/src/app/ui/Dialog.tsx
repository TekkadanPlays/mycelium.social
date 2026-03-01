import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Dialog (controlled modal)
// ---------------------------------------------------------------------------

interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: any;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return createElement('div', {
    'data-slot': 'dialog',
    'data-state': 'open',
  }, children);
}

// ---------------------------------------------------------------------------
// DialogOverlay
// ---------------------------------------------------------------------------

interface DialogOverlayProps {
  className?: string;
  onClick?: (e: Event) => void;
}

export function DialogOverlay({ className, onClick }: DialogOverlayProps) {
  return createElement('div', {
    'data-slot': 'dialog-overlay',
    className: cn(
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0',
      className,
    ),
    onClick: (e: Event) => {
      if (e.target === e.currentTarget) onClick?.(e);
    },
  });
}

// ---------------------------------------------------------------------------
// DialogContent
// ---------------------------------------------------------------------------

interface DialogContentProps {
  className?: string;
  children?: any;
  onClose?: () => void;
}

export class DialogContent extends Component<DialogContentProps> {
  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.props.onClose?.();
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.body.style.overflow = '';
  }

  render() {
    const { className, children, onClose } = this.props;

    return createElement('div', {
      'data-slot': 'dialog-portal',
      className: 'fixed inset-0 z-50 flex items-center justify-center',
    },
      createElement(DialogOverlay, { onClick: onClose }),
      createElement('div', {
        'data-slot': 'dialog-content',
        role: 'dialog',
        'aria-modal': true,
        className: cn(
          'bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg',
          className,
        ),
      },
        children,
        createElement('button', {
          'data-slot': 'dialog-close',
          type: 'button',
          onClick: onClose,
          className: 'absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none cursor-pointer',
          'aria-label': 'Close',
        },
          createElement('svg', {
            className: 'size-4',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
            createElement('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
            createElement('line', { x1: '6', y1: '6', x2: '18', y2: '18' }),
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// DialogHeader / DialogFooter / DialogTitle / DialogDescription
// ---------------------------------------------------------------------------

interface SlotProps {
  className?: string;
  children?: any;
}

export function DialogHeader({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'dialog-header',
    className: cn('flex flex-col gap-2 text-center sm:text-left', className),
  }, children);
}

export function DialogFooter({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'dialog-footer',
    className: cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className),
  }, children);
}

export function DialogTitle({ className, children }: SlotProps) {
  return createElement('h2', {
    'data-slot': 'dialog-title',
    className: cn('text-lg leading-none font-semibold', className),
  }, children);
}

export function DialogDescription({ className, children }: SlotProps) {
  return createElement('p', {
    'data-slot': 'dialog-description',
    className: cn('text-muted-foreground text-sm', className),
  }, children);
}
