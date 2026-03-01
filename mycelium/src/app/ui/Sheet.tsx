import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Sheet (slide-over panel)
// Uses inline styles for transform so Inferno can transition smoothly
// between mounted-hidden → visible → hidden → unmounted.
// ---------------------------------------------------------------------------

interface SheetProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: any;
}

interface SheetState {
  mounted: boolean;
  visible: boolean;
}

export class Sheet extends Component<SheetProps, SheetState> {
  declare state: SheetState;
  private raf: number | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: SheetProps) {
    super(props);
    this.state = { mounted: props.open, visible: false };
  }

  componentDidMount() {
    if (this.props.open) {
      this.raf = requestAnimationFrame(() => {
        this.raf = requestAnimationFrame(() => {
          this.setState({ visible: true });
        });
      });
    }
  }

  componentDidUpdate(prevProps: SheetProps) {
    if (!prevProps.open && this.props.open) {
      this.clearTimers();
      this.setState({ mounted: true, visible: false }, () => {
        this.raf = requestAnimationFrame(() => {
          this.raf = requestAnimationFrame(() => {
            this.setState({ visible: true });
          });
        });
      });
    } else if (prevProps.open && !this.props.open) {
      this.setState({ visible: false });
      this.timer = setTimeout(() => this.setState({ mounted: false }), 300);
    }
  }

  componentWillUnmount() {
    this.clearTimers();
  }

  private clearTimers() {
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
  }

  render() {
    if (!this.state.mounted) return null;
    const { visible } = this.state;
    const { onOpenChange, children } = this.props;
    const onClose = () => onOpenChange?.(false);

    // Clone children to inject visible prop into SheetContent
    const kids = Array.isArray(children) ? children : [children];
    const enhanced = kids.map((child: any) => {
      if (child && child.type === SheetContent) {
        return createElement(SheetContent, { ...child.props, _visible: visible, onClose }, child.children || child.props?.children);
      }
      return child;
    });

    return createElement('div', { 'data-slot': 'sheet' }, ...enhanced);
  }
}

// ---------------------------------------------------------------------------
// SheetContent — renders overlay + sliding panel with inline style transitions
// ---------------------------------------------------------------------------

export type SheetSide = 'top' | 'bottom' | 'left' | 'right';

interface SheetContentProps {
  side?: SheetSide;
  className?: string;
  children?: any;
  onClose?: () => void;
  _visible?: boolean;
}

const sideClasses: Record<SheetSide, string> = {
  top: 'inset-x-0 top-0 border-b',
  bottom: 'inset-x-0 bottom-0 border-t',
  left: 'inset-y-0 left-0 w-3/4 border-r sm:max-w-sm',
  right: 'inset-y-0 right-0 w-3/4 border-l sm:max-w-sm',
};

function getSlideTransform(side: SheetSide, visible: boolean): string {
  if (visible) return 'translate3d(0,0,0)';
  switch (side) {
    case 'right': return 'translate3d(100%,0,0)';
    case 'left': return 'translate3d(-100%,0,0)';
    case 'top': return 'translate3d(0,-100%,0)';
    case 'bottom': return 'translate3d(0,100%,0)';
  }
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
    const { side = 'right', className, children, onClose, _visible: visible = true } = this.props;

    return createElement('div', {
      'data-slot': 'sheet-portal',
      className: 'fixed inset-0 z-50',
    },
      // Overlay
      createElement('div', {
        'data-slot': 'sheet-overlay',
        className: 'fixed inset-0 bg-black/50',
        style: {
          opacity: visible ? 1 : 0,
          transition: 'opacity 300ms cubic-bezier(0.4,0,0.2,1)',
        },
        onClick: (e: Event) => { if (e.target === e.currentTarget) onClose?.(); },
      }),
      // Panel
      createElement('div', {
        'data-slot': 'sheet-content',
        role: 'dialog',
        'aria-modal': true,
        className: cn(
          'bg-background fixed z-50 flex flex-col gap-4 shadow-lg border p-6',
          sideClasses[side],
          className,
        ),
        style: {
          transform: getSlideTransform(side, visible),
          transition: 'transform 300ms cubic-bezier(0.32,0.72,0,1)',
        },
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

// SheetOverlay is no longer needed as a separate export but keep for API compat
export function SheetOverlay() { return null; }

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
