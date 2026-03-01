import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// NavigationMenu — horizontal nav with dropdown panels
// ---------------------------------------------------------------------------

interface NavigationMenuProps {
  className?: string;
  children?: any;
}

export function NavigationMenu({ className, children }: NavigationMenuProps) {
  return createElement('nav', {
    'data-slot': 'navigation-menu',
    className: cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className),
  }, children);
}

// ---------------------------------------------------------------------------
// NavigationMenuList
// ---------------------------------------------------------------------------

interface NavigationMenuListProps {
  className?: string;
  children?: any;
}

export function NavigationMenuList({ className, children }: NavigationMenuListProps) {
  return createElement('ul', {
    'data-slot': 'navigation-menu-list',
    className: cn('group flex flex-1 list-none items-center justify-center gap-1', className),
  }, children);
}

// ---------------------------------------------------------------------------
// NavigationMenuItem — wraps trigger + content, manages open state
// Coordinates with siblings so hovering switches when one is already open.
// ---------------------------------------------------------------------------

// Shared state for NavigationMenu coordination
let _navMenuOpenId: string | null = null;
const _navMenuListeners: Set<() => void> = new Set();
function navMenuSetOpen(id: string | null) {
  _navMenuOpenId = id;
  _navMenuListeners.forEach((fn) => fn());
}
function navMenuSubscribe(fn: () => void) { _navMenuListeners.add(fn); return () => { _navMenuListeners.delete(fn); }; }

let _navMenuIdCounter = 0;

interface NavigationMenuItemProps {
  className?: string;
  children?: any;
}

interface NavigationMenuItemState {
  open: boolean;
}

export class NavigationMenuItem extends Component<NavigationMenuItemProps, NavigationMenuItemState> {
  private id = `nmi-${++_navMenuIdCounter}`;
  private unsub: (() => void) | null = null;
  private ref: HTMLElement | null = null;
  declare state: NavigationMenuItemState;

  constructor(props: NavigationMenuItemProps) {
    super(props);
    this.state = { open: false };
  }

  private handleOutside = (e: MouseEvent) => {
    if (_navMenuOpenId === this.id && this.ref && !this.ref.contains(e.target as Node)) {
      navMenuSetOpen(null);
    }
  };

  private handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && _navMenuOpenId) navMenuSetOpen(null);
  };

  componentDidMount() {
    this.unsub = navMenuSubscribe(() => {
      const open = _navMenuOpenId === this.id;
      if (this.state.open !== open) this.setState({ open });
    });
    document.addEventListener('mousedown', this.handleOutside);
    document.addEventListener('keydown', this.handleKey);
  }

  componentWillUnmount() {
    this.unsub?.();
    document.removeEventListener('mousedown', this.handleOutside);
    document.removeEventListener('keydown', this.handleKey);
    if (_navMenuOpenId === this.id) navMenuSetOpen(null);
  }

  private handleClick = () => {
    navMenuSetOpen(_navMenuOpenId === this.id ? null : this.id);
  };

  private handleMouseEnter = () => {
    if (_navMenuOpenId && _navMenuOpenId !== this.id) {
      navMenuSetOpen(this.id);
    }
  };

  render() {
    const { className, children } = this.props;
    const { open } = this.state;
    const kids = Array.isArray(children) ? children : [children];

    let triggerChild: any = null;
    let contentChild: any = null;
    const others: any[] = [];

    for (const child of kids) {
      if (!child) continue;
      if (child.type === NavigationMenuTrigger || (child.props && child.props['data-slot'] === 'navigation-menu-trigger')) {
        triggerChild = child;
      } else if (child.type === NavigationMenuContent || (child.props && child.props['data-slot'] === 'navigation-menu-content')) {
        contentChild = child;
      } else {
        others.push(child);
      }
    }

    return createElement('li', {
      'data-slot': 'navigation-menu-item',
      ref: (el: HTMLElement | null) => { this.ref = el; },
      className: cn('relative', className),
      onmouseenter: this.handleMouseEnter,
    },
      triggerChild
        ? createElement(NavigationMenuTrigger, {
            ...(triggerChild.props || {}),
            onClick: this.handleClick,
            'data-state': open ? 'open' : 'closed',
          }, triggerChild.children != null ? triggerChild.children : (triggerChild.props && triggerChild.props.children))
        : null,
      open && contentChild ? contentChild : null,
      ...others,
    );
  }
}

// ---------------------------------------------------------------------------
// NavigationMenuTrigger
// ---------------------------------------------------------------------------

interface NavigationMenuTriggerProps {
  className?: string;
  onClick?: () => void;
  'data-state'?: string;
  children?: any;
}

export function NavigationMenuTrigger(props: NavigationMenuTriggerProps) {
  const { className, onClick, children, ...rest } = props;
  return createElement('button', {
    'data-slot': 'navigation-menu-trigger',
    type: 'button',
    onClick,
    className: cn(
      'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'focus-visible:outline-none',
      'data-[state=open]:bg-accent/50',
      className,
    ),
    ...rest,
  },
    children,
    createElement('svg', {
      className: cn('relative top-px ml-1 size-3 transition-transform duration-200', 'group-data-[state=open]:rotate-180'),
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }, createElement('path', { d: 'M6 9l6 6 6-6' })),
  );
}

// ---------------------------------------------------------------------------
// NavigationMenuContent
// ---------------------------------------------------------------------------

interface NavigationMenuContentProps {
  className?: string;
  children?: any;
}

export function NavigationMenuContent({ className, children }: NavigationMenuContentProps) {
  return createElement('div', {
    'data-slot': 'navigation-menu-content',
    className: cn(
      'absolute left-0 top-full w-full md:w-auto',
      'mt-1.5 min-w-[400px] md:min-w-[500px] lg:min-w-[600px] rounded-md border bg-popover p-4 text-popover-foreground shadow-lg',
      'animate-in fade-in-0 zoom-in-95',
      className,
    ),
  }, children);
}

// ---------------------------------------------------------------------------
// NavigationMenuLink
// ---------------------------------------------------------------------------

interface NavigationMenuLinkProps {
  className?: string;
  href?: string;
  onClick?: (e: Event) => void;
  children?: any;
}

export function NavigationMenuLink({ className, href, onClick, children }: NavigationMenuLinkProps) {
  return createElement('a', {
    'data-slot': 'navigation-menu-link',
    href,
    onClick,
    className: cn(
      'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'focus:bg-accent focus:text-accent-foreground',
      className,
    ),
  }, children);
}
