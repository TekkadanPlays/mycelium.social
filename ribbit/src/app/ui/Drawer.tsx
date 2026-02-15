import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Drawer (mobile-friendly bottom sheet)
// ---------------------------------------------------------------------------

interface DrawerProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: any;
}

export function Drawer({ open, onOpenChange, children }: DrawerProps) {
  if (!open) return null;
  return createElement('div', { 'data-slot': 'drawer', 'data-state': 'open' }, children);
}

// ---------------------------------------------------------------------------
// DrawerContent
// ---------------------------------------------------------------------------

interface DrawerContentProps {
  className?: string;
  children?: any;
  onClose?: () => void;
}

export class DrawerContent extends Component<DrawerContentProps> {
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
      'data-slot': 'drawer-portal',
      className: 'fixed inset-0 z-50',
    },
      createElement('div', {
        'data-slot': 'drawer-overlay',
        className: 'fixed inset-0 bg-black/50',
        onClick: onClose,
      }),
      createElement('div', {
        'data-slot': 'drawer-content',
        className: cn(
          'bg-background fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border-t',
          className,
        ),
      },
        createElement('div', {
          className: 'mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted',
        }),
        children,
      ),
    );
  }
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
