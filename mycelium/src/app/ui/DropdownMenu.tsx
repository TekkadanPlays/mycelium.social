import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// DropdownMenu
//
// InfernoJS has no portals, so the menu is positioned relative to the trigger
// wrapper. Click-outside is handled via a document listener.
// ---------------------------------------------------------------------------

interface DropdownMenuProps {
  children?: any;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return createElement('div', {
    'data-slot': 'dropdown-menu',
    className: 'relative inline-block',
  }, children);
}

// ---------------------------------------------------------------------------
// DropdownMenuTrigger
// ---------------------------------------------------------------------------

interface DropdownMenuTriggerProps {
  className?: string;
  onClick?: (e: Event) => void;
  children?: any;
}

export function DropdownMenuTrigger({ className, onClick, children }: DropdownMenuTriggerProps) {
  return createElement('button', {
    'data-slot': 'dropdown-menu-trigger',
    type: 'button',
    onClick,
    className: cn('outline-none', className),
  }, children);
}

// ---------------------------------------------------------------------------
// DropdownMenuContent
// ---------------------------------------------------------------------------

interface DropdownMenuContentProps {
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom';
  open?: boolean;
  onClose?: () => void;
  children?: any;
}

export class DropdownMenuContent extends Component<DropdownMenuContentProps> {
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
    const { className, align = 'end', side = 'bottom', open, children } = this.props;
    if (!open) return null;

    const alignClasses: Record<string, string> = {
      start: 'left-0',
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-0',
    };

    const sideClasses: Record<string, string> = {
      top: 'bottom-full mb-1',
      bottom: 'top-full mt-1',
    };

    return createElement('div', {
      'data-slot': 'dropdown-menu-content',
      role: 'menu',
      className: cn(
        'absolute z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        alignClasses[align],
        sideClasses[side],
        className,
      ),
    }, children);
  }
}

// ---------------------------------------------------------------------------
// DropdownMenuItem
// ---------------------------------------------------------------------------

interface DropdownMenuItemProps {
  className?: string;
  disabled?: boolean;
  destructive?: boolean;
  onClick?: (e: Event) => void;
  children?: any;
}

export function DropdownMenuItem(props: DropdownMenuItemProps) {
  const { className, disabled = false, destructive = false, onClick, children } = props;

  return createElement('button', {
    'data-slot': 'dropdown-menu-item',
    type: 'button',
    role: 'menuitem',
    disabled,
    onClick,
    className: cn(
      "relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
      "focus-visible:bg-accent focus-visible:text-accent-foreground",
      "hover:bg-accent hover:text-accent-foreground",
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      disabled && 'pointer-events-none opacity-50',
      destructive && 'text-destructive focus-visible:text-destructive hover:text-destructive',
      className,
    ),
  }, children);
}

// ---------------------------------------------------------------------------
// DropdownMenuSeparator
// ---------------------------------------------------------------------------

interface DropdownMenuSeparatorProps {
  className?: string;
}

export function DropdownMenuSeparator({ className }: DropdownMenuSeparatorProps) {
  return createElement('div', {
    'data-slot': 'dropdown-menu-separator',
    role: 'separator',
    className: cn('bg-border -mx-1 my-1 h-px', className),
  });
}

// ---------------------------------------------------------------------------
// DropdownMenuLabel
// ---------------------------------------------------------------------------

interface DropdownMenuLabelProps {
  className?: string;
  children?: any;
}

export function DropdownMenuLabel({ className, children }: DropdownMenuLabelProps) {
  return createElement('div', {
    'data-slot': 'dropdown-menu-label',
    className: cn('px-2 py-1.5 text-sm font-semibold', className),
  }, children);
}

// ---------------------------------------------------------------------------
// DropdownMenuGroup
// ---------------------------------------------------------------------------

interface DropdownMenuGroupProps {
  className?: string;
  children?: any;
}

export function DropdownMenuGroup({ className, children }: DropdownMenuGroupProps) {
  return createElement('div', {
    'data-slot': 'dropdown-menu-group',
    role: 'group',
    className: cn(className),
  }, children);
}
