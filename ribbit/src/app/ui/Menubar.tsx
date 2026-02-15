import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Menubar — desktop-style horizontal menu bar
// ---------------------------------------------------------------------------

interface MenubarProps {
  className?: string;
  children?: any;
}

export function Menubar({ className, children }: MenubarProps) {
  return createElement('div', {
    'data-slot': 'menubar',
    role: 'menubar',
    className: cn(
      'flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs',
      className,
    ),
  }, children);
}

// ---------------------------------------------------------------------------
// MenubarMenu — wraps a trigger + content pair
// ---------------------------------------------------------------------------

interface MenubarMenuProps {
  children?: any;
}

interface MenubarMenuState {
  open: boolean;
}

export class MenubarMenu extends Component<MenubarMenuProps, MenubarMenuState> {
  declare state: MenubarMenuState;
  private ref: HTMLDivElement | null = null;

  constructor(props: MenubarMenuProps) {
    super(props);
    this.state = { open: false };
  }

  private toggle = () => this.setState((s: MenubarMenuState) => ({ open: !s.open }));
  private close = () => this.setState({ open: false });

  private handleOutside = (e: MouseEvent) => {
    if (this.state.open && this.ref && !this.ref.contains(e.target as Node)) {
      this.close();
    }
  };

  private handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.close();
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOutside);
    document.addEventListener('keydown', this.handleKey);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutside);
    document.removeEventListener('keydown', this.handleKey);
  }

  render() {
    const { children } = this.props;
    const { open } = this.state;

    return createElement('div', {
      'data-slot': 'menubar-menu',
      ref: (el: HTMLDivElement | null) => { this.ref = el; },
      className: 'relative',
    },
      // Pass open/toggle to children via cloning
      ...(Array.isArray(children) ? children : [children]).map((child: any) => {
        if (!child?.props) return child;
        const slot = child.props['data-slot'] || (child.type && child.type.name);
        if (slot === 'menubar-trigger' || child.type === MenubarTrigger) {
          return createElement(MenubarTrigger, {
            ...child.props,
            onClick: this.toggle,
            'data-state': open ? 'open' : 'closed',
          }, child.children || child.props.children);
        }
        if (slot === 'menubar-content' || child.type === MenubarContent) {
          return open ? child : null;
        }
        return child;
      }),
    );
  }
}

// ---------------------------------------------------------------------------
// MenubarTrigger
// ---------------------------------------------------------------------------

interface MenubarTriggerProps {
  className?: string;
  onClick?: () => void;
  'data-state'?: string;
  children?: any;
}

export function MenubarTrigger(props: MenubarTriggerProps) {
  const { className, onClick, children, ...rest } = props;
  return createElement('button', {
    'data-slot': 'menubar-trigger',
    type: 'button',
    onClick,
    className: cn(
      'flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none',
      'hover:bg-accent hover:text-accent-foreground',
      'focus:bg-accent focus:text-accent-foreground',
      'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      className,
    ),
    ...rest,
  }, children);
}

// ---------------------------------------------------------------------------
// MenubarContent
// ---------------------------------------------------------------------------

interface MenubarContentProps {
  className?: string;
  children?: any;
}

export function MenubarContent({ className, children }: MenubarContentProps) {
  return createElement('div', {
    'data-slot': 'menubar-content',
    role: 'menu',
    className: cn(
      'absolute left-0 top-full z-50 mt-1 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
      'animate-in fade-in-0 zoom-in-95',
      className,
    ),
  }, children);
}

// ---------------------------------------------------------------------------
// MenubarItem
// ---------------------------------------------------------------------------

interface MenubarItemProps {
  className?: string;
  disabled?: boolean;
  onClick?: (e: Event) => void;
  children?: any;
}

export function MenubarItem({ className, disabled, onClick, children }: MenubarItemProps) {
  return createElement('div', {
    'data-slot': 'menubar-item',
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
// MenubarSeparator
// ---------------------------------------------------------------------------

interface MenubarSeparatorProps {
  className?: string;
}

export function MenubarSeparator({ className }: MenubarSeparatorProps) {
  return createElement('div', {
    'data-slot': 'menubar-separator',
    role: 'separator',
    className: cn('-mx-1 my-1 h-px bg-muted', className),
  });
}

// ---------------------------------------------------------------------------
// MenubarLabel
// ---------------------------------------------------------------------------

interface MenubarLabelProps {
  className?: string;
  children?: any;
}

export function MenubarLabel({ className, children }: MenubarLabelProps) {
  return createElement('div', {
    'data-slot': 'menubar-label',
    className: cn('px-2 py-1.5 text-sm font-semibold', className),
  }, children);
}

// ---------------------------------------------------------------------------
// MenubarShortcut
// ---------------------------------------------------------------------------

interface MenubarShortcutProps {
  className?: string;
  children?: any;
}

export function MenubarShortcut({ className, children }: MenubarShortcutProps) {
  return createElement('span', {
    'data-slot': 'menubar-shortcut',
    className: cn('ml-auto text-xs tracking-widest text-muted-foreground', className),
  }, children);
}
