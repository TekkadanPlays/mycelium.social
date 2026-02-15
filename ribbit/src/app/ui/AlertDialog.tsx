import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';
import { buttonVariants } from './Button';

// ---------------------------------------------------------------------------
// AlertDialog
//
// A modal dialog that interrupts the user with important content and expects
// a response. Unlike Dialog, it has no close button — the user must choose
// an action (confirm or cancel).
// ---------------------------------------------------------------------------

interface AlertDialogProps {
  open: boolean;
  children?: any;
}

export function AlertDialog({ open, children }: AlertDialogProps) {
  if (!open) return null;
  return createElement('div', { 'data-slot': 'alert-dialog', 'data-state': 'open' }, children);
}

// ---------------------------------------------------------------------------
// AlertDialogOverlay
// ---------------------------------------------------------------------------

interface AlertDialogOverlayProps {
  className?: string;
}

export function AlertDialogOverlay({ className }: AlertDialogOverlayProps) {
  return createElement('div', {
    'data-slot': 'alert-dialog-overlay',
    className: cn('fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]', className),
  });
}

// ---------------------------------------------------------------------------
// AlertDialogContent
// ---------------------------------------------------------------------------

interface AlertDialogContentProps {
  className?: string;
  children?: any;
}

export class AlertDialogContent extends Component<AlertDialogContentProps> {
  componentDidMount() {
    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
  }

  render() {
    const { className, children } = this.props;

    return createElement('div', {
      'data-slot': 'alert-dialog-portal',
      className: 'fixed inset-0 z-50 flex items-center justify-center',
    },
      createElement(AlertDialogOverlay, null),
      createElement('div', {
        'data-slot': 'alert-dialog-content',
        role: 'alertdialog',
        'aria-modal': true,
        className: cn(
          'bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg',
          className,
        ),
      },
        children,
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// AlertDialogHeader / Footer / Title / Description
// ---------------------------------------------------------------------------

interface SlotProps {
  className?: string;
  children?: any;
}

export function AlertDialogHeader({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'alert-dialog-header',
    className: cn('flex flex-col gap-2 text-center sm:text-left', className),
  }, children);
}

export function AlertDialogFooter({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'alert-dialog-footer',
    className: cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className),
  }, children);
}

export function AlertDialogTitle({ className, children }: SlotProps) {
  return createElement('h2', {
    'data-slot': 'alert-dialog-title',
    className: cn('text-lg font-semibold', className),
  }, children);
}

export function AlertDialogDescription({ className, children }: SlotProps) {
  return createElement('p', {
    'data-slot': 'alert-dialog-description',
    className: cn('text-muted-foreground text-sm', className),
  }, children);
}

// ---------------------------------------------------------------------------
// AlertDialogAction / Cancel
// ---------------------------------------------------------------------------

interface AlertDialogButtonProps {
  className?: string;
  onClick?: (e: Event) => void;
  children?: any;
}

export function AlertDialogAction({ className, onClick, children }: AlertDialogButtonProps) {
  return createElement('button', {
    'data-slot': 'alert-dialog-action',
    type: 'button',
    onClick,
    className: cn(buttonVariants(), className),
  }, children);
}

export function AlertDialogCancel({ className, onClick, children }: AlertDialogButtonProps) {
  return createElement('button', {
    'data-slot': 'alert-dialog-cancel',
    type: 'button',
    onClick,
    className: cn(buttonVariants({ variant: 'outline' }), className),
  }, children);
}
