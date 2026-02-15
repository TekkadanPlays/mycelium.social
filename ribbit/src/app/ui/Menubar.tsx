import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Menubar — desktop-style horizontal menu bar
// Coordinates open state across menus so hovering switches when one is open.
// ---------------------------------------------------------------------------

// Simple pub/sub so MenubarMenu instances coordinate
let _menubarOpenId: string | null = null;
const _menubarListeners: Set<() => void> = new Set();
function menubarSetOpen(id: string | null) {
  _menubarOpenId = id;
  _menubarListeners.forEach((fn) => fn());
}
function menubarSubscribe(fn: () => void) { _menubarListeners.add(fn); return () => { _menubarListeners.delete(fn); }; }

interface MenubarProps {
  className?: string;
  children?: any;
}

export class Menubar extends Component<MenubarProps> {
  private unsub: (() => void) | null = null;
  private ref: HTMLDivElement | null = null;

  private handleOutside = (e: MouseEvent) => {
    if (_menubarOpenId && this.ref && !this.ref.contains(e.target as Node)) {
      menubarSetOpen(null);
    }
  };

  private handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && _menubarOpenId) menubarSetOpen(null);
  };

  componentDidMount() {
    this.unsub = menubarSubscribe(() => this.forceUpdate());
    document.addEventListener('mousedown', this.handleOutside);
    document.addEventListener('keydown', this.handleKey);
  }

  componentWillUnmount() {
    this.unsub?.();
    document.removeEventListener('mousedown', this.handleOutside);
    document.removeEventListener('keydown', this.handleKey);
  }

  render() {
    const { className, children } = this.props;
    return createElement('div', {
      'data-slot': 'menubar',
      role: 'menubar',
      ref: (el: HTMLDivElement | null) => { this.ref = el; },
      className: cn(
        'flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs',
        className,
      ),
    }, children);
  }
}

// ---------------------------------------------------------------------------
// MenubarMenu — wraps a trigger + content pair
// ---------------------------------------------------------------------------

let _menuIdCounter = 0;

interface MenubarMenuProps {
  children?: any;
}

export class MenubarMenu extends Component<MenubarMenuProps> {
  private id = `mbm-${++_menuIdCounter}`;
  private unsub: (() => void) | null = null;

  componentDidMount() {
    this.unsub = menubarSubscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsub?.();
    if (_menubarOpenId === this.id) menubarSetOpen(null);
  }

  private handleClick = () => {
    menubarSetOpen(_menubarOpenId === this.id ? null : this.id);
  };

  private handleMouseEnter = () => {
    // Only switch on hover if another menu is already open
    if (_menubarOpenId && _menubarOpenId !== this.id) {
      menubarSetOpen(this.id);
    }
  };

  render() {
    const { children } = this.props;
    const open = _menubarOpenId === this.id;

    return createElement('div', {
      'data-slot': 'menubar-menu',
      className: 'relative',
      onmouseenter: this.handleMouseEnter,
    },
      ...(Array.isArray(children) ? children : [children]).map((child: any) => {
        if (!child?.props) return child;
        if (child.type === MenubarTrigger) {
          return createElement(MenubarTrigger, {
            ...child.props,
            onClick: this.handleClick,
            'data-state': open ? 'open' : 'closed',
          }, child.children || child.props.children);
        }
        if (child.type === MenubarContent) {
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
