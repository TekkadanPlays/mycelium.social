import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Sheet (slide-over panel)
// ---------------------------------------------------------------------------

interface SheetProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: any;
}

export function Sheet({ open, children }: SheetProps) {
  if (!open) return null;

  return createElement('div', {
    'data-slot': 'sheet',
    'data-state': 'open',
  }, children);
}

// ---------------------------------------------------------------------------
// SheetOverlay
// ---------------------------------------------------------------------------

interface SheetOverlayProps {
  className?: string;
  onClick?: (e: Event) => void;
}

export function SheetOverlay({ className, onClick }: SheetOverlayProps) {
  return createElement('div', {
    'data-slot': 'sheet-overlay',
    className: cn('fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]', className),
    onClick: (e: Event) => {
      if (e.target === e.currentTarget) onClick?.(e);
    },
  });
}

// ---------------------------------------------------------------------------
// SheetContent
// ---------------------------------------------------------------------------

const sheetContentVariants = cva(
  'bg-background fixed z-50 flex flex-col gap-4 shadow-lg transition-transform duration-300 ease-in-out border',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b',
        bottom: 'inset-x-0 bottom-0 border-t',
        left: 'inset-y-0 left-0 w-3/4 border-r sm:max-w-sm',
        right: 'inset-y-0 right-0 w-3/4 border-l sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

export type SheetSide = NonNullable<VariantProps<typeof sheetContentVariants>['side']>;

interface SheetContentProps extends VariantProps<typeof sheetContentVariants> {
  className?: string;
  children?: any;
  onClose?: () => void;
}

export class SheetContent extends Component<SheetContentProps> {
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
    const { side, className, children, onClose } = this.props;

    return createElement('div', {
      'data-slot': 'sheet-portal',
      className: 'fixed inset-0 z-50',
    },
      createElement(SheetOverlay, { onClick: onClose }),
      createElement('div', {
        'data-slot': 'sheet-content',
        role: 'dialog',
        'aria-modal': true,
        className: cn(sheetContentVariants({ side }), 'p-6', className),
      },
        children,
        createElement('button', {
          'data-slot': 'sheet-close',
          type: 'button',
          onClick: onClose,
          className: 'absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer',
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
// SheetHeader / SheetFooter / SheetTitle / SheetDescription
// ---------------------------------------------------------------------------

interface SlotProps {
  className?: string;
  children?: any;
}

export function SheetHeader({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'sheet-header',
    className: cn('flex flex-col gap-2', className),
  }, children);
}

export function SheetFooter({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'sheet-footer',
    className: cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className),
  }, children);
}

export function SheetTitle({ className, children }: SlotProps) {
  return createElement('h2', {
    'data-slot': 'sheet-title',
    className: cn('text-foreground text-lg font-semibold', className),
  }, children);
}

export function SheetDescription({ className, children }: SlotProps) {
  return createElement('p', {
    'data-slot': 'sheet-description',
    className: cn('text-muted-foreground text-sm', className),
  }, children);
}
