import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import { cn } from '../../../ui/utils';
import { Separator } from '../../../ui/Separator';

// ---------------------------------------------------------------------------
// Icons (inline SVGs)
// ---------------------------------------------------------------------------

function IconHome(cls: string) {
  return createElement('svg', { className: cls, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
    createElement('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
    createElement('polyline', { points: '9 22 9 12 15 12 15 22' }),
  );
}

function IconInbox(cls: string) {
  return createElement('svg', { className: cls, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
    createElement('polyline', { points: '22 12 16 12 14 15 10 15 8 12 2 12' }),
    createElement('path', { d: 'M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z' }),
  );
}

function IconCalendar(cls: string) {
  return createElement('svg', { className: cls, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
    createElement('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2' }),
    createElement('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
    createElement('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
    createElement('line', { x1: '3', y1: '10', x2: '21', y2: '10' }),
  );
}

function IconSearch(cls: string) {
  return createElement('svg', { className: cls, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
    createElement('circle', { cx: '11', cy: '11', r: '8' }),
    createElement('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' }),
  );
}

function IconSettings(cls: string) {
  return createElement('svg', { className: cls, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
    createElement('circle', { cx: '12', cy: '12', r: '3' }),
    createElement('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' }),
  );
}

function IconChevron(cls: string) {
  return createElement('svg', { className: cls, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
    createElement('path', { d: 'M9 18l6-6-6-6' }),
  );
}

function IconPanelLeft(cls: string) {
  return createElement('svg', { className: cls, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
    createElement('rect', { x: '3', y: '3', width: '7', height: '18', rx: '1' }),
    createElement('rect', { x: '14', y: '3', width: '7', height: '18', rx: '1' }),
  );
}

// ---------------------------------------------------------------------------
// Inline mini-sidebar components (contained, no fixed positioning)
// ---------------------------------------------------------------------------

function MiniSidebarBtn({ icon, label, badge, isActive, collapsed, onClick }: {
  icon: (cls: string) => any; label: string; badge?: string; isActive?: boolean; collapsed?: boolean; onClick?: () => void;
}) {
  return createElement('li', { className: 'relative' },
    createElement('button', {
      type: 'button',
      onClick,
      className: cn(
        'flex w-full items-center gap-2 rounded-md px-2 text-sm transition-colors cursor-pointer',
        collapsed ? 'h-8 justify-center' : 'h-8',
        isActive ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      ),
    },
      icon('size-4 shrink-0'),
      !collapsed && createElement('span', { className: 'truncate' }, label),
    ),
    badge && !collapsed && createElement('span', {
      className: 'absolute right-1 top-1/2 -translate-y-1/2 text-xs text-muted-foreground tabular-nums',
    }, badge),
  );
}

function MiniSubBtn({ label, isActive, onClick }: { label: string; isActive?: boolean; onClick?: () => void }) {
  return createElement('li', null,
    createElement('button', {
      type: 'button',
      onClick,
      className: cn(
        'flex w-full items-center h-7 rounded-md px-2 text-sm transition-colors cursor-pointer',
        isActive ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      ),
    }, createElement('span', { className: 'truncate' }, label)),
  );
}

// ---------------------------------------------------------------------------
// SidebarPage
// ---------------------------------------------------------------------------

interface SidebarPageState {
  activeItem: string;
  expandedGroup: string;
  collapsed: boolean;
}

export class SidebarPage extends Component<{}, SidebarPageState> {
  declare state: SidebarPageState;

  constructor(props: {}) {
    super(props);
    this.state = { activeItem: 'home', expandedGroup: 'building', collapsed: false };
  }

  render() {
    const { activeItem, expandedGroup, collapsed } = this.state;

    const navMain = [
      { label: 'Home', icon: IconHome, id: 'home', badge: '' },
      { label: 'Inbox', icon: IconInbox, id: 'inbox', badge: '12' },
      { label: 'Calendar', icon: IconCalendar, id: 'calendar', badge: '' },
      { label: 'Search', icon: IconSearch, id: 'search', badge: '' },
      { label: 'Settings', icon: IconSettings, id: 'settings', badge: '' },
    ];

    const groups = [
      {
        label: 'Building Your Application',
        id: 'building',
        items: [
          { label: 'Routing', id: 'routing' },
          { label: 'Data Fetching', id: 'data-fetching' },
          { label: 'Rendering', id: 'rendering' },
          { label: 'Caching', id: 'caching' },
        ],
      },
      {
        label: 'API Reference',
        id: 'api',
        items: [
          { label: 'Components', id: 'components' },
          { label: 'File Conventions', id: 'file-conventions' },
          { label: 'Functions', id: 'functions' },
        ],
      },
    ];

    return createElement('div', { className: 'space-y-10' },
      createElement(PageHeader, {
        title: 'Sidebar',
        description: 'A composable, themeable and customizable sidebar component.',
      }),

      // Demo — self-contained, no fixed positioning
      createElement(SectionHeading, { id: 'demo' }, 'Demo'),
      createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
        'A full sidebar with header, navigation groups, collapsible sub-menus, badges, and a footer. Click the trigger to toggle.',
      ),
      createElement(DemoBox, { className: 'block p-0 overflow-hidden' },
        createElement('div', { className: 'flex h-[480px] w-full' },
          // Sidebar panel
          createElement('div', {
            className: 'bg-card flex flex-col border-r transition-[width] duration-200 ease-linear overflow-hidden shrink-0',
            style: { width: collapsed ? '3rem' : '16rem' },
          },
            // Header
            createElement('div', { className: 'flex flex-col gap-2 p-2' },
              createElement('div', { className: 'flex items-center gap-2 px-2 py-1' },
                createElement('div', { className: 'flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold shrink-0' }, 'A'),
                !collapsed && createElement('span', { className: 'text-sm font-semibold truncate' }, 'Acme Inc'),
              ),
            ),
            createElement(Separator, { className: 'mx-2 w-auto' }),
            // Content
            createElement('div', { className: 'flex-1 overflow-auto p-2 space-y-2' },
              // Group label
              !collapsed && createElement('div', { className: 'text-muted-foreground h-6 px-2 text-xs font-medium flex items-center' }, 'Platform'),
              // Main nav
              createElement('ul', { className: 'flex flex-col gap-0' },
                ...navMain.map((item) =>
                  createElement(MiniSidebarBtn, {
                    key: item.id,
                    icon: item.icon,
                    label: item.label,
                    badge: item.badge || undefined,
                    isActive: activeItem === item.id,
                    collapsed,
                    onClick: () => this.setState({ activeItem: item.id }),
                  }),
                ),
              ),
              // Collapsible groups — always rendered, hidden via overflow when collapsed
              ...groups.map((group) =>
                createElement('div', { key: group.id, className: cn('space-y-0 transition-opacity duration-200', collapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100') },
                  createElement('div', { className: 'text-muted-foreground h-6 px-2 text-xs font-medium flex items-center mt-2 whitespace-nowrap' }, group.label),
                  createElement('ul', { className: 'flex flex-col gap-0' },
                    createElement('li', null,
                      createElement('button', {
                        type: 'button',
                        onClick: () => this.setState({ expandedGroup: expandedGroup === group.id ? '' : group.id }),
                        className: 'flex w-full items-center gap-2 rounded-md px-2 h-8 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer whitespace-nowrap',
                      },
                        IconChevron(expandedGroup === group.id ? 'size-4 rotate-90 transition-transform shrink-0' : 'size-4 transition-transform shrink-0'),
                        createElement('span', { className: 'truncate' }, group.label),
                      ),
                    ),
                    expandedGroup === group.id && createElement('ul', { className: 'mx-3.5 border-l border-border pl-2.5 py-0.5 flex flex-col gap-1' },
                      ...group.items.map((sub) =>
                        createElement(MiniSubBtn, {
                          key: sub.id,
                          label: sub.label,
                          isActive: activeItem === sub.id,
                          onClick: () => this.setState({ activeItem: sub.id }),
                        }),
                      ),
                    ),
                  ),
                ),
              ),
            ),
            // Footer
            createElement(Separator, { className: 'mx-2 w-auto' }),
            createElement('div', { className: 'p-2' },
              createElement('div', { className: cn('flex items-center gap-2 rounded-md px-2 py-1.5', collapsed && 'justify-center') },
                createElement('div', { className: 'size-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold shrink-0' }, 'JD'),
                !collapsed && createElement('span', { className: 'text-sm truncate' }, 'John Doe'),
              ),
            ),
          ),
          // Main content
          createElement('div', { className: 'flex-1 flex flex-col min-w-0' },
            createElement('div', { className: 'flex items-center gap-2 border-b px-4 h-12' },
              createElement('button', {
                type: 'button',
                onClick: () => this.setState({ collapsed: !collapsed }),
                className: 'inline-flex items-center justify-center rounded-md h-7 w-7 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer',
              }, IconPanelLeft('size-4')),
              createElement('span', { className: 'text-sm font-medium' }, 'Dashboard'),
            ),
            createElement('div', { className: 'p-6' },
              createElement('p', { className: 'text-sm text-muted-foreground' },
                'Main content area. The sidebar collapses to icons on desktop and becomes a sheet on mobile.',
              ),
            ),
          ),
        ),
      ),

      // Structure
      createElement(SectionHeading, { id: 'structure' }, 'Structure'),
      createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
        'A Sidebar is composed of the following parts:',
      ),
      createElement('ul', { className: 'text-sm space-y-1 mb-4 list-disc pl-5 text-muted-foreground' },
        createElement('li', null, createElement('code', { className: 'text-xs' }, 'SidebarProvider'), ' \u2014 Manages open/collapsed state and keyboard shortcut (Ctrl+B).'),
        createElement('li', null, createElement('code', { className: 'text-xs' }, 'Sidebar'), ' \u2014 The sidebar container. Uses Sheet on mobile.'),
        createElement('li', null, createElement('code', { className: 'text-xs' }, 'SidebarHeader'), ' / ', createElement('code', { className: 'text-xs' }, 'SidebarFooter'), ' \u2014 Sticky at top and bottom.'),
        createElement('li', null, createElement('code', { className: 'text-xs' }, 'SidebarContent'), ' \u2014 Scrollable content area.'),
        createElement('li', null, createElement('code', { className: 'text-xs' }, 'SidebarGroup'), ' \u2014 Sections within content.'),
        createElement('li', null, createElement('code', { className: 'text-xs' }, 'SidebarMenu'), ' / ', createElement('code', { className: 'text-xs' }, 'SidebarMenuItem'), ' / ', createElement('code', { className: 'text-xs' }, 'SidebarMenuButton'), ' \u2014 Navigation items.'),
        createElement('li', null, createElement('code', { className: 'text-xs' }, 'SidebarMenuSub'), ' \u2014 Nested sub-menus.'),
        createElement('li', null, createElement('code', { className: 'text-xs' }, 'SidebarTrigger'), ' \u2014 Toggle button.'),
        createElement('li', null, createElement('code', { className: 'text-xs' }, 'SidebarRail'), ' \u2014 Thin click strip to toggle.'),
        createElement('li', null, createElement('code', { className: 'text-xs' }, 'SidebarInset'), ' \u2014 Main content area next to sidebar.'),
      ),

      // Usage
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement(CodeBlock, { code: `import {
  SidebarProvider, Sidebar, SidebarTrigger, SidebarInset,
  SidebarHeader, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
} from '@/ui/Sidebar'

// Wrap your layout in SidebarProvider
createElement(SidebarProvider, null,
  createElement(Sidebar, null,
    createElement(SidebarHeader, null, /* logo */),
    createElement(SidebarContent, null,
      createElement(SidebarGroup, null,
        createElement(SidebarGroupLabel, null, 'Navigation'),
        createElement(SidebarGroupContent, null,
          createElement(SidebarMenu, null,
            createElement(SidebarMenuItem, null,
              createElement(SidebarMenuButton, {
                isActive: true,
                tooltip: 'Home',
              }, icon, 'Home'),
            ),
          ),
        ),
      ),
    ),
    createElement(SidebarFooter, null, /* user */),
  ),
  createElement(SidebarInset, null,
    createElement(SidebarTrigger, null),
    /* page content */
  ),
)` }),

      // Collapsible modes
      createElement(SectionHeading, { id: 'collapsible' }, 'Collapsible Modes'),
      createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
        'The Sidebar supports three collapsible modes via the collapsible prop:',
      ),
      createElement('ul', { className: 'text-sm space-y-1 mb-4 list-disc pl-5 text-muted-foreground' },
        createElement('li', null, createElement('code', { className: 'text-xs' }, 'offcanvas'), ' \u2014 Slides off-screen when collapsed (default).'),
        createElement('li', null, createElement('code', { className: 'text-xs' }, 'icon'), ' \u2014 Collapses to icon-only width (3rem). Menu buttons show tooltips.'),
        createElement('li', null, createElement('code', { className: 'text-xs' }, 'none'), ' \u2014 Non-collapsible, always visible.'),
      ),
      createElement(CodeBlock, { code: `// Icon-collapsible sidebar
createElement(Sidebar, { collapsible: 'icon' }, ...)

// Non-collapsible sidebar
createElement(Sidebar, { collapsible: 'none' }, ...)` }),

      // Variants
      createElement(SectionHeading, { id: 'variants' }, 'Variants'),
      createElement('ul', { className: 'text-sm space-y-1 mb-4 list-disc pl-5 text-muted-foreground' },
        createElement('li', null, createElement('code', { className: 'text-xs' }, 'sidebar'), ' \u2014 Standard sidebar with border (default).'),
        createElement('li', null, createElement('code', { className: 'text-xs' }, 'floating'), ' \u2014 Floating sidebar with rounded corners and shadow.'),
        createElement('li', null, createElement('code', { className: 'text-xs' }, 'inset'), ' \u2014 Inset sidebar. Use with SidebarInset for the main content.'),
      ),

      // Programmatic control
      createElement(SectionHeading, { id: 'control' }, 'Programmatic Control'),
      createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
        'Use the exported functions to control the sidebar from anywhere:',
      ),
      createElement(CodeBlock, { code: `import { toggleSidebar, setSidebarOpen, getSidebarState } from '@/ui/Sidebar'

// Toggle
toggleSidebar()

// Set explicitly
setSidebarOpen(false)

// Read state
const { open, isMobile, openMobile } = getSidebarState()` }),

      // Props
      createElement(SectionHeading, { id: 'props' }, 'Props'),

      createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'SidebarProvider'),
      createElement(PropTable, { rows: [
        { prop: 'defaultOpen', type: 'boolean', default: 'true' },
        { prop: 'className', type: 'string', default: '\u2014' },
        { prop: 'style', type: 'Record<string, string>', default: '\u2014' },
      ]}),

      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'Sidebar'),
      createElement(PropTable, { rows: [
        { prop: 'side', type: "'left' | 'right'", default: "'left'" },
        { prop: 'variant', type: "'sidebar' | 'floating' | 'inset'", default: "'sidebar'" },
        { prop: 'collapsible', type: "'offcanvas' | 'icon' | 'none'", default: "'offcanvas'" },
      ]}),

      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'SidebarMenuButton'),
      createElement(PropTable, { rows: [
        { prop: 'isActive', type: 'boolean', default: 'false' },
        { prop: 'size', type: "'default' | 'sm' | 'lg'", default: "'default'" },
        { prop: 'variant', type: "'default' | 'outline'", default: "'default'" },
        { prop: 'tooltip', type: 'string', default: '\u2014' },
        { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
      ]}),

      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'SidebarMenuSubButton'),
      createElement(PropTable, { rows: [
        { prop: 'isActive', type: 'boolean', default: 'false' },
        { prop: 'size', type: "'sm' | 'md'", default: "'md'" },
        { prop: 'href', type: 'string', default: '\u2014' },
        { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
      ]}),
    );
  }
}
