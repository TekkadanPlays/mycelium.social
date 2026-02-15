import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// ContextMenu (right-click menu)
// ---------------------------------------------------------------------------

interface ContextMenuProps {
  children?: any;
}

interface ContextMenuState {
  open: boolean;
  x: number;
  y: number;
}

export class ContextMenu extends Component<ContextMenuProps, ContextMenuState> {
  declare state: ContextMenuState;

  constructor(props: ContextMenuProps) {
    super(props);
    this.state = { open: false, x: 0, y: 0 };
  }

  private handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    this.setState({ open: true, x: e.clientX, y: e.clientY });
  };

  private handleClose = () => {
    this.setState({ open: false });
  };

  private handleGlobalClick = () => {
    if (this.state.open) this.handleClose();
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.handleClose();
  };

  componentDidMount() {
    document.addEventListener('click', this.handleGlobalClick);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleGlobalClick);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    const { children } = this.props;
    const { open, x, y } = this.state;

    // Separate trigger from content children
    const childArray = Array.isArray(children) ? children : [children];
    const trigger = childArray.find((c: any) => c?.props?.['data-slot'] === 'context-menu-trigger' || c?.type === ContextMenuTrigger);
    const content = childArray.find((c: any) => c?.props?.['data-slot'] === 'context-menu-content' || c?.type === ContextMenuContent);

    return createElement('div', { 'data-slot': 'context-menu' },
      createElement('div', { oncontextmenu: this.handleContextMenu },
        trigger,
      ),
      open && content
        ? createElement('div', {
            className: 'fixed inset-0 z-50',
            onClick: (e: Event) => { e.stopPropagation(); this.handleClose(); },
          },
            createElement('div', {
              className: cn(
                'fixed z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
                'animate-in fade-in-0 zoom-in-95',
              ),
              style: { top: `${y}px`, left: `${x}px` },
              onClick: (e: Event) => e.stopPropagation(),
            },
              content?.props?.children || content?.children,
            ),
          )
        : null,
    );
  }
}

// ---------------------------------------------------------------------------
// ContextMenuTrigger
// ---------------------------------------------------------------------------

interface ContextMenuTriggerProps {
  className?: string;
  children?: any;
}

export function ContextMenuTrigger({ className, children }: ContextMenuTriggerProps) {
  return createElement('div', {
    'data-slot': 'context-menu-trigger',
    className,
  }, children);
}

// ---------------------------------------------------------------------------
// ContextMenuContent
// ---------------------------------------------------------------------------

interface ContextMenuContentProps {
  className?: string;
  children?: any;
}

export function ContextMenuContent({ className, children }: ContextMenuContentProps) {
  return createElement('div', {
    'data-slot': 'context-menu-content',
    className,
  }, children);
}

// ---------------------------------------------------------------------------
// ContextMenuItem
// ---------------------------------------------------------------------------

interface ContextMenuItemProps {
  className?: string;
  disabled?: boolean;
  onClick?: (e: Event) => void;
  children?: any;
}

export function ContextMenuItem({ className, disabled, onClick, children }: ContextMenuItemProps) {
  return createElement('div', {
    'data-slot': 'context-menu-item',
    role: 'menuitem',
    'data-disabled': disabled || undefined,
    onClick: disabled ? undefined : onClick,
    className: cn(
      'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
      'hover:bg-accent hover:text-accent-foreground',
      disabled && 'pointer-events-none opacity-50',
      !disabled && 'cursor-pointer',
      className,
    ),
  }, children);
}

// ---------------------------------------------------------------------------
// ContextMenuSeparator
// ---------------------------------------------------------------------------

interface ContextMenuSeparatorProps {
  className?: string;
}

export function ContextMenuSeparator({ className }: ContextMenuSeparatorProps) {
  return createElement('div', {
    'data-slot': 'context-menu-separator',
    role: 'separator',
    className: cn('-mx-1 my-1 h-px bg-border', className),
  });
}

// ---------------------------------------------------------------------------
// ContextMenuLabel
// ---------------------------------------------------------------------------

interface ContextMenuLabelProps {
  className?: string;
  children?: any;
}

export function ContextMenuLabel({ className, children }: ContextMenuLabelProps) {
  return createElement('div', {
    'data-slot': 'context-menu-label',
    className: cn('px-2 py-1.5 text-sm font-semibold text-foreground', className),
  }, children);
}

// ---------------------------------------------------------------------------
// ContextMenuShortcut
// ---------------------------------------------------------------------------

interface ContextMenuShortcutProps {
  className?: string;
  children?: any;
}

export function ContextMenuShortcut({ className, children }: ContextMenuShortcutProps) {
  return createElement('span', {
    'data-slot': 'context-menu-shortcut',
    className: cn('ml-auto text-xs tracking-widest text-muted-foreground', className),
  }, children);
}
