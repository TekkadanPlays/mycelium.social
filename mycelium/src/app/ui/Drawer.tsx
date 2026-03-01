import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Drawer (mobile-friendly bottom sheet)
// Uses inline styles for transform so Inferno can transition smoothly
// between mounted-hidden → visible → hidden → unmounted.
// ---------------------------------------------------------------------------

interface DrawerProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: any;
}

interface DrawerState {
  mounted: boolean;
  visible: boolean;
}

export class Drawer extends Component<DrawerProps, DrawerState> {
  declare state: DrawerState;
  private raf: number | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: DrawerProps) {
    super(props);
    this.state = { mounted: props.open, visible: false };
  }

  componentDidMount() {
    if (this.props.open) {
      // Double-rAF: first frame mounts with off-screen transform, second triggers transition
      this.raf = requestAnimationFrame(() => {
        this.raf = requestAnimationFrame(() => {
          this.setState({ visible: true });
        });
      });
    }
  }

  componentDidUpdate(prevProps: DrawerProps) {
    if (!prevProps.open && this.props.open) {
      // Opening: mount immediately, then animate in after two frames
      this.clearTimers();
      this.setState({ mounted: true, visible: false }, () => {
        this.raf = requestAnimationFrame(() => {
          this.raf = requestAnimationFrame(() => {
            this.setState({ visible: true });
          });
        });
      });
    } else if (prevProps.open && !this.props.open) {
      // Closing: animate out, then unmount after transition
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

    return createElement(DrawerPortal, { visible, onClose }, children);
  }
}

// ---------------------------------------------------------------------------
// DrawerPortal — renders overlay + content with inline style transitions
// ---------------------------------------------------------------------------

interface DrawerPortalProps {
  visible: boolean;
  onClose: () => void;
  children?: any;
}

function DrawerPortal({ visible, onClose, children }: DrawerPortalProps) {
  return createElement('div', {
    'data-slot': 'drawer-portal',
    className: 'fixed inset-0 z-50',
  },
    createElement('div', {
      'data-slot': 'drawer-overlay',
      className: 'fixed inset-0 bg-black/50',
      style: {
        opacity: visible ? 1 : 0,
        transition: 'opacity 300ms cubic-bezier(0.4,0,0.2,1)',
      },
      onClick: onClose,
    }),
    createElement('div', {
      'data-slot': 'drawer-content',
      className: 'bg-background fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border-t',
      style: {
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 300ms cubic-bezier(0.32,0.72,0,1)',
      },
    },
      createElement('div', {
        className: 'mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted',
      }),
      children,
    ),
  );
}

// ---------------------------------------------------------------------------
// DrawerContent — simple wrapper, animation handled by Drawer/DrawerPortal
// ---------------------------------------------------------------------------

interface DrawerContentProps {
  className?: string;
  children?: any;
  onClose?: () => void;
}

export function DrawerContent({ className, children }: DrawerContentProps) {
  return createElement('div', {
    'data-slot': 'drawer-content-inner',
    className: cn('px-4', className),
  }, children);
}

// ---------------------------------------------------------------------------
// DrawerHeader / Footer / Title / Description
// ---------------------------------------------------------------------------

interface SlotProps {
  className?: string;
  children?: any;
}

export function DrawerHeader({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'drawer-header',
    className: cn('grid gap-1.5 p-4 text-center', className),
  }, children);
}

export function DrawerFooter({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'drawer-footer',
    className: cn('mt-auto flex flex-col gap-2 p-4 mx-auto w-full max-w-sm', className),
  }, children);
}

export function DrawerTitle({ className, children }: SlotProps) {
  return createElement('h2', {
    'data-slot': 'drawer-title',
    className: cn('text-lg font-semibold leading-none tracking-tight', className),
  }, children);
}

export function DrawerDescription({ className, children }: SlotProps) {
  return createElement('p', {
    'data-slot': 'drawer-description',
    className: cn('text-sm text-muted-foreground', className),
  }, children);
}

// ---------------------------------------------------------------------------
// DrawerClose
// ---------------------------------------------------------------------------

interface DrawerCloseProps {
  className?: string;
  onClick?: () => void;
  children?: any;
}

export function DrawerClose({ className, onClick, children }: DrawerCloseProps) {
  return createElement('button', {
    'data-slot': 'drawer-close',
    type: 'button',
    onClick,
    className,
  }, children);
}
