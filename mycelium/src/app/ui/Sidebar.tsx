import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';
import { Sheet, SheetContent } from './Sheet';
import { Separator } from './Separator';
import { Skeleton } from './Skeleton';
import { Tooltip } from './Tooltip';

// ---------------------------------------------------------------------------
// Sidebar — InfernoJS port of shadcn/ui Sidebar
//
// Uses module-level state instead of React Context. A single SidebarProvider
// manages open/collapsed state and broadcasts to subscribers.
// ---------------------------------------------------------------------------

const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

// ---------------------------------------------------------------------------
// Module-level sidebar state (replaces React Context)
// ---------------------------------------------------------------------------

interface SidebarState {
  open: boolean;
  openMobile: boolean;
  isMobile: boolean;
}

let _sidebarState: SidebarState = { open: true, openMobile: false, isMobile: false };
const _sidebarListeners = new Set<() => void>();

function notifySidebar() { _sidebarListeners.forEach((fn) => fn()); }
function subscribeSidebar(fn: () => void) { _sidebarListeners.add(fn); return () => { _sidebarListeners.delete(fn); }; }

export function getSidebarState() { return _sidebarState; }

export function setSidebarOpen(open: boolean) {
  _sidebarState = { ..._sidebarState, open };
  notifySidebar();
}

export function setSidebarOpenMobile(open: boolean) {
  _sidebarState = { ..._sidebarState, openMobile: open };
  notifySidebar();
}

export function toggleSidebar() {
  if (_sidebarState.isMobile) {
    setSidebarOpenMobile(!_sidebarState.openMobile);
  } else {
    setSidebarOpen(!_sidebarState.open);
  }
}

// ---------------------------------------------------------------------------
// SidebarProvider
// ---------------------------------------------------------------------------

interface SidebarProviderProps {
  defaultOpen?: boolean;
  className?: string;
  style?: Record<string, string>;
  children?: any;
}

export class SidebarProvider extends Component<SidebarProviderProps> {
  private unsub: (() => void) | null = null;
  private mql: MediaQueryList | null = null;

  constructor(props: SidebarProviderProps) {
    super(props);
    _sidebarState = { ..._sidebarState, open: props.defaultOpen !== false };
  }

  componentDidMount() {
    this.unsub = subscribeSidebar(() => this.forceUpdate());

    // Mobile detection
    this.mql = window.matchMedia('(max-width: 767px)');
    const handler = () => {
      _sidebarState = { ..._sidebarState, isMobile: this.mql!.matches };
      if (!this.mql!.matches) _sidebarState.openMobile = false;
      notifySidebar();
    };
    this.mql.addEventListener('change', handler);
    _sidebarState = { ..._sidebarState, isMobile: this.mql.matches };

    // Keyboard shortcut
    document.addEventListener('keydown', this.handleKey);
  }

  componentWillUnmount() {
    this.unsub?.();
    document.removeEventListener('keydown', this.handleKey);
  }

  private handleKey = (e: KeyboardEvent) => {
    if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      toggleSidebar();
    }
  };

  render() {
    const { className, style, children } = this.props;
    const state = _sidebarState.open ? 'expanded' : 'collapsed';

    return createElement('div', {
      'data-slot': 'sidebar-wrapper',
      'data-state': state,
      style: {
        '--sidebar-width': SIDEBAR_WIDTH,
        '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
        ...(style || {}),
      },
      className: cn(
        'group/sidebar-wrapper flex min-h-svh w-full',
        className,
      ),
    }, children);
  }
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

interface SidebarComponentProps {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
  className?: string;
  children?: any;
}

export class Sidebar extends Component<SidebarComponentProps> {
  private unsub: (() => void) | null = null;

  componentDidMount() {
    this.unsub = subscribeSidebar(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsub?.();
  }

  render() {
    const { side = 'left', variant = 'sidebar', collapsible = 'offcanvas', className, children } = this.props;
    const { isMobile, open, openMobile } = _sidebarState;
    const state = open ? 'expanded' : 'collapsed';

    if (collapsible === 'none') {
      return createElement('div', {
        'data-slot': 'sidebar',
        className: cn('bg-card text-foreground flex h-full flex-col', className),
        style: { width: SIDEBAR_WIDTH },
      }, children);
    }

    // Mobile: use Sheet
    if (isMobile) {
      return createElement(Sheet, {
        open: openMobile,
        onOpenChange: setSidebarOpenMobile,
      },
        createElement(SheetContent, {
          side,
          className: cn('w-[18rem] p-0 [&>[data-slot=sheet-close]]:hidden', className),
        },
          createElement('div', { className: 'flex h-full w-full flex-col' }, children),
        ),
      );
    }

    // Desktop
    const isFloating = variant === 'floating' || variant === 'inset';

    return createElement('div', {
      className: 'group peer text-foreground hidden md:block',
      'data-state': state,
      'data-collapsible': state === 'collapsed' ? collapsible : '',
      'data-variant': variant,
      'data-side': side,
      'data-slot': 'sidebar',
    },
      // Gap element
      createElement('div', {
        'data-slot': 'sidebar-gap',
        className: cn(
          'relative bg-transparent transition-[width] duration-200 ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          isFloating
            ? 'group-data-[collapsible=icon]:w-[calc(3rem+1rem)]'
            : 'group-data-[collapsible=icon]:w-[3rem]',
        ),
        style: { width: SIDEBAR_WIDTH },
      }),
      // Container
      createElement('div', {
        'data-slot': 'sidebar-container',
        'data-side': side,
        className: cn(
          'fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] duration-200 ease-linear md:flex',
          side === 'left' ? 'left-0' : 'right-0',
          isFloating
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(3rem+1rem+2px)]'
            : cn(
                'group-data-[collapsible=icon]:w-[3rem]',
                side === 'left' ? 'border-r' : 'border-l',
              ),
          className,
        ),
        style: { width: SIDEBAR_WIDTH },
      },
        createElement('div', {
          'data-sidebar': 'sidebar',
          'data-slot': 'sidebar-inner',
          className: cn(
            'bg-card flex size-full flex-col',
            isFloating && 'rounded-lg shadow-sm ring-1 ring-border',
          ),
        }, children),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// SidebarTrigger
// ---------------------------------------------------------------------------

interface SidebarTriggerProps {
  className?: string;
  children?: any;
}

export function SidebarTrigger({ className, children }: SidebarTriggerProps) {
  return createElement('button', {
    'data-slot': 'sidebar-trigger',
    type: 'button',
    onClick: toggleSidebar,
    className: cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
      'hover:bg-accent hover:text-accent-foreground h-7 w-7 cursor-pointer',
      className,
    ),
  },
    children || createElement('svg', {
      className: 'size-4',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
      createElement('rect', { x: '3', y: '3', width: '7', height: '18', rx: '1' }),
      createElement('rect', { x: '14', y: '3', width: '7', height: '18', rx: '1' }),
    ),
    createElement('span', { className: 'sr-only' }, 'Toggle Sidebar'),
  );
}

// ---------------------------------------------------------------------------
// SidebarRail — thin drag/click strip to toggle
// ---------------------------------------------------------------------------

export function SidebarRail({ className }: { className?: string }) {
  return createElement('button', {
    'data-slot': 'sidebar-rail',
    'aria-label': 'Toggle Sidebar',
    tabIndex: -1,
    onClick: toggleSidebar,
    title: 'Toggle Sidebar',
    className: cn(
      'absolute inset-y-0 z-20 hidden w-4 -right-4 transition-all ease-linear sm:flex cursor-pointer',
      'hover:after:bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-[2px]',
      className,
    ),
  });
}

// ---------------------------------------------------------------------------
// SidebarInset — main content area next to sidebar
// ---------------------------------------------------------------------------

export function SidebarInset({ className, children }: { className?: string; children?: any }) {
  return createElement('main', {
    'data-slot': 'sidebar-inset',
    className: cn('bg-background relative flex w-full flex-1 flex-col', className),
  }, children);
}

// ---------------------------------------------------------------------------
// Layout slots
// ---------------------------------------------------------------------------

interface SlotProps { className?: string; children?: any; }

export function SidebarHeader({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'sidebar-header',
    className: cn('flex flex-col gap-2 p-2', className),
  }, children);
}

export function SidebarFooter({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'sidebar-footer',
    className: cn('flex flex-col gap-2 p-2', className),
  }, children);
}

export function SidebarContent({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'sidebar-content',
    className: cn('flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden', className),
  }, children);
}

export function SidebarSeparator({ className }: { className?: string }) {
  return createElement(Separator, {
    'data-slot': 'sidebar-separator',
    className: cn('mx-2 w-auto', className),
  } as any);
}

export function SidebarInput({ className, ...rest }: { className?: string; placeholder?: string; value?: string; onInput?: (e: Event) => void }) {
  return createElement('input', {
    'data-slot': 'sidebar-input',
    className: cn('bg-background h-8 w-full rounded-md border border-input px-3 text-sm shadow-xs outline-none focus:border-primary', className),
    ...rest,
  });
}

// ---------------------------------------------------------------------------
// SidebarGroup
// ---------------------------------------------------------------------------

export function SidebarGroup({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'sidebar-group',
    className: cn('relative flex w-full min-w-0 flex-col p-2', className),
  }, children);
}

export function SidebarGroupLabel({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'sidebar-group-label',
    className: cn(
      'text-muted-foreground h-8 rounded-md px-2 text-xs font-medium flex shrink-0 items-center',
      'transition-[margin,opacity] duration-200 ease-linear',
      'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
      className,
    ),
  }, children);
}

export function SidebarGroupAction({ className, children, onClick }: SlotProps & { onClick?: (e: Event) => void }) {
  return createElement('button', {
    'data-slot': 'sidebar-group-action',
    type: 'button',
    onClick,
    className: cn(
      'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      'absolute top-3.5 right-3 w-5 rounded-md p-0 flex aspect-square items-center justify-center',
      'group-data-[collapsible=icon]:hidden cursor-pointer',
      className,
    ),
  }, children);
}

export function SidebarGroupContent({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'sidebar-group-content',
    className: cn('w-full text-sm', className),
  }, children);
}

// ---------------------------------------------------------------------------
// SidebarMenu
// ---------------------------------------------------------------------------

export function SidebarMenu({ className, children }: SlotProps) {
  return createElement('ul', {
    'data-slot': 'sidebar-menu',
    className: cn('flex w-full min-w-0 flex-col gap-0', className),
  }, children);
}

export function SidebarMenuItem({ className, children }: SlotProps) {
  return createElement('li', {
    'data-slot': 'sidebar-menu-item',
    className: cn('group/menu-item relative', className),
  }, children);
}

// ---------------------------------------------------------------------------
// SidebarMenuButton
// ---------------------------------------------------------------------------

interface SidebarMenuButtonProps {
  className?: string;
  isActive?: boolean;
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default' | 'outline';
  tooltip?: string;
  onClick?: (e: Event) => void;
  children?: any;
}

export function SidebarMenuButton({
  className, isActive = false, size = 'default', variant = 'default',
  tooltip, onClick, children,
}: SidebarMenuButtonProps) {
  const sizeClass = size === 'sm' ? 'h-7 text-xs' : size === 'lg' ? 'h-12 text-sm' : 'h-8 text-sm';

  const btn = createElement('button', {
    'data-slot': 'sidebar-menu-button',
    'data-active': isActive || undefined,
    'data-size': size,
    type: 'button',
    onClick,
    className: cn(
      'hover:bg-accent hover:text-accent-foreground gap-2 rounded-md p-2 text-left transition-[width,height,padding]',
      'group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2',
      'flex w-full items-center overflow-hidden outline-none cursor-pointer',
      'data-[active]:bg-accent data-[active]:text-accent-foreground data-[active]:font-medium',
      '[&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate',
      variant === 'outline' && 'bg-background shadow-[0_0_0_1px_var(--border)]',
      sizeClass,
      className,
    ),
  }, children);

  if (tooltip) {
    return createElement(Tooltip, { content: tooltip, side: 'right' }, btn);
  }

  return btn;
}

// ---------------------------------------------------------------------------
// SidebarMenuAction
// ---------------------------------------------------------------------------

interface SidebarMenuActionProps {
  className?: string;
  showOnHover?: boolean;
  onClick?: (e: Event) => void;
  children?: any;
}

export function SidebarMenuAction({ className, showOnHover = false, onClick, children }: SidebarMenuActionProps) {
  return createElement('button', {
    'data-slot': 'sidebar-menu-action',
    type: 'button',
    onClick,
    className: cn(
      'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      'absolute top-1.5 right-1 aspect-square w-5 rounded-md p-0 flex items-center justify-center',
      'group-data-[collapsible=icon]:hidden cursor-pointer',
      showOnHover && 'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 md:opacity-0',
      className,
    ),
  }, children);
}

// ---------------------------------------------------------------------------
// SidebarMenuBadge
// ---------------------------------------------------------------------------

export function SidebarMenuBadge({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'sidebar-menu-badge',
    className: cn(
      'text-muted-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none',
      'group-data-[collapsible=icon]:hidden',
      className,
    ),
  }, children);
}

// ---------------------------------------------------------------------------
// SidebarMenuSkeleton
// ---------------------------------------------------------------------------

export function SidebarMenuSkeleton({ className, showIcon = false }: { className?: string; showIcon?: boolean }) {
  const width = `${Math.floor(Math.random() * 40) + 50}%`;
  return createElement('div', {
    'data-slot': 'sidebar-menu-skeleton',
    className: cn('flex h-8 items-center gap-2 rounded-md px-2', className),
  },
    showIcon && createElement(Skeleton, { className: 'size-4 rounded-md' }),
    createElement(Skeleton, { className: 'h-4 flex-1', style: { maxWidth: width } } as any),
  );
}

// ---------------------------------------------------------------------------
// SidebarMenuSub
// ---------------------------------------------------------------------------

export function SidebarMenuSub({ className, children }: SlotProps) {
  return createElement('ul', {
    'data-slot': 'sidebar-menu-sub',
    className: cn(
      'border-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5',
      'group-data-[collapsible=icon]:hidden',
      className,
    ),
  }, children);
}

export function SidebarMenuSubItem({ className, children }: SlotProps) {
  return createElement('li', {
    'data-slot': 'sidebar-menu-sub-item',
    className: cn('group/menu-sub-item relative', className),
  }, children);
}

interface SidebarMenuSubButtonProps {
  className?: string;
  size?: 'sm' | 'md';
  isActive?: boolean;
  href?: string;
  onClick?: (e: Event) => void;
  children?: any;
}

export function SidebarMenuSubButton({ className, size = 'md', isActive = false, href, onClick, children }: SidebarMenuSubButtonProps) {
  return createElement(href ? 'a' : 'button', {
    'data-slot': 'sidebar-menu-sub-button',
    'data-active': isActive || undefined,
    'data-size': size,
    href,
    onClick,
    type: href ? undefined : 'button',
    className: cn(
      'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      'data-[active]:bg-accent data-[active]:text-accent-foreground',
      'h-7 gap-2 rounded-md px-2 flex min-w-0 items-center overflow-hidden outline-none cursor-pointer',
      'group-data-[collapsible=icon]:hidden',
      '[&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0',
      size === 'sm' ? 'text-xs' : 'text-sm',
      className,
    ),
  }, children);
}
