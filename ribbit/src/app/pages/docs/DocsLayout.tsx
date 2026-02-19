import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { cn } from '../../ui/utils';
import { Separator } from '../../ui/Separator';

// ---------------------------------------------------------------------------
// Navigation data
// ---------------------------------------------------------------------------

interface NavItem {
  path: string;
  label: string;
}

interface NavSection {
  heading: string;
  items: NavItem[];
}

interface NavGroup {
  title: string;
  basePath: string;
  icon: string;
  description: string;
  sections: NavSection[];
}

const NAV: NavGroup[] = [
  {
    title: 'Blazecn',
    basePath: '/docs/blazecn',
    icon: '\u26A1',
    description: 'UI component library',
    sections: [
      {
        heading: 'Getting Started',
        items: [
          { path: '/docs/blazecn', label: 'Introduction' },
          { path: '/docs/blazecn/installation', label: 'Installation' },
          { path: '/docs/blazecn/tokens', label: 'Design Tokens' },
          { path: '/docs/blazecn/theme-toggle', label: 'Themes' },
          { path: '/docs/blazecn/cn', label: 'cn() Utility' },
          { path: '/docs/blazecn/components', label: 'Components' },
        ],
      },
      {
        heading: 'Components',
        items: [
          { path: '/docs/blazecn/accordion', label: 'Accordion' },
          { path: '/docs/blazecn/alert', label: 'Alert' },
          { path: '/docs/blazecn/alert-dialog', label: 'Alert Dialog' },
          { path: '/docs/blazecn/aspect-ratio', label: 'Aspect Ratio' },
          { path: '/docs/blazecn/avatar', label: 'Avatar' },
          { path: '/docs/blazecn/badge', label: 'Badge' },
          { path: '/docs/blazecn/breadcrumb', label: 'Breadcrumb' },
          { path: '/docs/blazecn/button', label: 'Button' },
          { path: '/docs/blazecn/button-group', label: 'Button Group' },
          { path: '/docs/blazecn/card', label: 'Card' },
          { path: '/docs/blazecn/carousel', label: 'Carousel' },
          { path: '/docs/blazecn/checkbox', label: 'Checkbox' },
          { path: '/docs/blazecn/collapsible', label: 'Collapsible' },
          { path: '/docs/blazecn/combobox', label: 'Combobox' },
          { path: '/docs/blazecn/command', label: 'Command' },
          { path: '/docs/blazecn/context-menu', label: 'Context Menu' },
          { path: '/docs/blazecn/dialog', label: 'Dialog' },
          { path: '/docs/blazecn/drawer', label: 'Drawer' },
          { path: '/docs/blazecn/dropdown-menu', label: 'Dropdown Menu' },
          { path: '/docs/blazecn/empty', label: 'Empty' },
          { path: '/docs/blazecn/hover-card', label: 'Hover Card' },
          { path: '/docs/blazecn/input', label: 'Input' },
          { path: '/docs/blazecn/input-otp', label: 'Input OTP' },
          { path: '/docs/blazecn/kbd', label: 'Kbd' },
          { path: '/docs/blazecn/label', label: 'Label' },
          { path: '/docs/blazecn/menubar', label: 'Menubar' },
          { path: '/docs/blazecn/navigation-menu', label: 'Navigation Menu' },
          { path: '/docs/blazecn/pagination', label: 'Pagination' },
          { path: '/docs/blazecn/popover', label: 'Popover' },
          { path: '/docs/blazecn/progress', label: 'Progress' },
          { path: '/docs/blazecn/radio-group', label: 'Radio Group' },
          { path: '/docs/blazecn/resizable', label: 'Resizable' },
          { path: '/docs/blazecn/scroll-area', label: 'Scroll Area' },
          { path: '/docs/blazecn/select', label: 'Select' },
          { path: '/docs/blazecn/separator', label: 'Separator' },
          { path: '/docs/blazecn/sheet', label: 'Sheet' },
          { path: '/docs/blazecn/sidebar', label: 'Sidebar' },
          { path: '/docs/blazecn/skeleton', label: 'Skeleton' },
          { path: '/docs/blazecn/slider', label: 'Slider' },
          { path: '/docs/blazecn/toast', label: 'Sonner' },
          { path: '/docs/blazecn/spinner', label: 'Spinner' },
          { path: '/docs/blazecn/switch', label: 'Switch' },
          { path: '/docs/blazecn/table', label: 'Table' },
          { path: '/docs/blazecn/tabs', label: 'Tabs' },
          { path: '/docs/blazecn/textarea', label: 'Textarea' },
          { path: '/docs/blazecn/toggle', label: 'Toggle' },
          { path: '/docs/blazecn/toggle-group', label: 'Toggle Group' },
          { path: '/docs/blazecn/tooltip', label: 'Tooltip' },
          { path: '/docs/blazecn/typography', label: 'Typography' },
        ],
      },
    ],
  },
  {
    title: 'Mycelium',
    basePath: '/docs/mycelium',
    icon: '\uD83C\uDF44',
    description: 'Nostr social client',
    sections: [
      {
        heading: 'Overview',
        items: [
          { path: '/docs/mycelium', label: 'Introduction' },
        ],
      },
    ],
  },
  {
    title: 'Kaji',
    basePath: '/docs/kaji',
    icon: '\uD83D\uDD25',
    description: 'Nostr protocol library',
    sections: [
      {
        heading: 'Overview',
        items: [
          { path: '/docs/kaji', label: 'Introduction' },
        ],
      },
      {
        heading: 'Core',
        items: [
          { path: '/docs/kaji/event', label: 'event' },
          { path: '/docs/kaji/keys', label: 'keys' },
          { path: '/docs/kaji/sign', label: 'sign' },
          { path: '/docs/kaji/filter', label: 'filter' },
        ],
      },
      {
        heading: 'Networking',
        items: [
          { path: '/docs/kaji/relay', label: 'relay' },
          { path: '/docs/kaji/pool', label: 'pool' },
        ],
      },
      {
        heading: 'NIPs',
        items: [
          { path: '/docs/kaji/nip07', label: 'nip07' },
          { path: '/docs/kaji/nip10', label: 'nip10' },
          { path: '/docs/kaji/nip25', label: 'nip25' },
          { path: '/docs/kaji/nip29', label: 'nip29' },
          { path: '/docs/kaji/nip55', label: 'nip55' },
          { path: '/docs/kaji/nip66', label: 'nip66' },
        ],
      },
      {
        heading: 'Utilities',
        items: [
          { path: '/docs/kaji/utils', label: 'utils' },
        ],
      },
    ],
  },
  {
    title: 'Mycelium for Android',
    basePath: '/docs/mycelium-android',
    icon: '\uD83D\uDCF1',
    description: 'Native Android app',
    sections: [
      {
        heading: 'Overview',
        items: [
          { path: '/docs/mycelium-android', label: 'Introduction' },
        ],
      },
    ],
  },
  {
    title: 'nos2x-frog',
    basePath: '/docs/nos2x-frog',
    icon: '\uD83D\uDD10',
    description: 'Browser signer extension',
    sections: [
      {
        heading: 'Overview',
        items: [
          { path: '/docs/nos2x-frog', label: 'Introduction' },
        ],
      },
      {
        heading: 'History',
        items: [
          { path: '/docs/nos2x-frog/fixing-nos2x-fox', label: 'Fixing nos2x-fox' },
          { path: '/docs/nos2x-frog/upgrading-nos2x-fox', label: 'Upgrading nos2x-fox' },
          { path: '/docs/nos2x-frog/breaking-nos2x-frog', label: 'Breaking nos2x-frog' },
        ],
      },
    ],
  },
  {
    title: 'NIPs',
    basePath: '/docs/nips',
    icon: '\uD83D\uDCDC',
    description: 'Nostr protocol specs',
    sections: [
      {
        heading: 'Overview',
        items: [
          { path: '/docs/nips', label: 'Introduction' },
        ],
      },
      {
        heading: 'Categories',
        items: [
          { path: '/docs/nips/1xx', label: '1xx — Core Protocol' },
          { path: '/docs/nips/2xx', label: '2xx — Identity & Keys' },
          { path: '/docs/nips/3xx', label: '3xx — Relay Infrastructure' },
          { path: '/docs/nips/4xx', label: '4xx — Signing & Encryption' },
          { path: '/docs/nips/5xx', label: '5xx — Social & Content' },
          { path: '/docs/nips/6xx', label: '6xx — Messaging & Groups' },
          { path: '/docs/nips/7xx', label: '7xx — Payments & Zaps' },
          { path: '/docs/nips/8xx', label: '8xx — Media & Files' },
          { path: '/docs/nips/9xx', label: '9xx — Applications' },
        ],
      },
    ],
  },
];

export { NAV };

// ---------------------------------------------------------------------------
// ProjectSwitcher — dropdown to select docs project
// ---------------------------------------------------------------------------

interface ProjectSwitcherState {
  open: boolean;
}

class ProjectSwitcher extends Component<{ activeGroup: NavGroup; currentPath: string }, ProjectSwitcherState> {
  declare state: ProjectSwitcherState;
  private ref: HTMLDivElement | null = null;

  constructor(props: { activeGroup: NavGroup; currentPath: string }) {
    super(props);
    this.state = { open: false };
  }

  private handleOutside = (e: MouseEvent) => {
    if (this.state.open && this.ref && !this.ref.contains(e.target as Node)) {
      this.setState({ open: false });
    }
  };

  private handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.setState({ open: false });
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
    const { activeGroup } = this.props;
    const { open } = this.state;

    return createElement('div', {
      ref: (el: HTMLDivElement | null) => { this.ref = el; },
      className: 'relative mb-4',
    },
      // Trigger button
      createElement('button', {
        type: 'button',
        onClick: () => this.setState((s: ProjectSwitcherState) => ({ open: !s.open })),
        className: cn(
          'flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
          'hover:bg-accent/50',
          open && 'bg-accent/50',
        ),
      },
        createElement('span', { className: 'text-base' }, activeGroup.icon),
        createElement('div', { className: 'flex-1 text-left' },
          createElement('div', { className: 'font-semibold' }, activeGroup.title),
          createElement('div', { className: 'text-xs text-muted-foreground' }, activeGroup.description),
        ),
        createElement('svg', {
          className: cn('size-4 text-muted-foreground transition-transform duration-200', open && 'rotate-180'),
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        }, createElement('path', { d: 'M6 9l6 6 6-6' })),
      ),

      // Dropdown
      open
        ? createElement('div', {
          className: 'absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border bg-popover p-1 shadow-md',
        },
          ...NAV.map((group) =>
            createElement(Link, {
              key: group.title,
              to: group.basePath,
              onClick: () => this.setState({ open: false }),
              className: cn(
                'flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
                activeGroup.title === group.title
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
              ),
            },
              createElement('span', { className: 'text-base w-6 text-center' }, group.icon),
              createElement('div', { className: 'flex-1' },
                createElement('div', { className: 'font-medium text-foreground' }, group.title),
                createElement('div', { className: 'text-xs text-muted-foreground' }, group.description),
              ),
            ),
          ),
        )
        : null,
    );
  }
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

function DocsSidebar({ currentPath }: { currentPath: string }) {
  const activeGroup = [...NAV].sort((a, b) => b.basePath.length - a.basePath.length).find((g) => currentPath.startsWith(g.basePath)) || NAV[0];

  return createElement('aside', {
    className: 'hidden lg:block w-56 shrink-0',
  },
    createElement('div', {
      className: 'sticky top-[64px] flex flex-col max-h-[calc(100vh-80px)]',
    },
      // Project switcher sits above the scrollable area so its dropdown isn't clipped
      createElement('div', { className: 'relative z-20 shrink-0 mb-1' },
        createElement(ProjectSwitcher, { activeGroup, currentPath }),
      ),

      // Scrollable nav links
      createElement('div', { className: 'overflow-y-auto space-y-1 pr-2 pb-8' },
        ...activeGroup.sections.map((section) =>
          createElement('div', { key: section.heading, className: 'mb-4' },
            createElement('p', {
              className: 'px-2 mb-1 text-xs font-semibold tracking-wider uppercase text-muted-foreground/60',
            }, section.heading),
            ...section.items.map((item) =>
              createElement(Link, {
                key: item.path,
                to: item.path,
                className: cn(
                  'flex items-center px-2 py-1.5 text-sm rounded-md transition-colors',
                  currentPath === item.path
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                ),
              }, item.label),
            ),
          ),
        ),
      ),
    ),
  );
}

// ---------------------------------------------------------------------------
// Layout wrapper
// ---------------------------------------------------------------------------

export function DocsLayout({ children, currentPath }: { children?: any; currentPath: string }) {
  return createElement('div', { className: 'flex gap-8' },
    createElement(DocsSidebar, { currentPath }),
    createElement('div', { 'data-slot': 'doc-page', className: 'flex-1 min-w-0 pb-16' },
      children,
    ),
  );
}
