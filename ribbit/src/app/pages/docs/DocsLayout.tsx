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
  sections: NavSection[];
}

const NAV: NavGroup[] = [
  {
    title: 'Blazecn',
    basePath: '/docs/blazecn',
    icon: '\u26A1',
    sections: [
      {
        heading: 'Getting Started',
        items: [
          { path: '/docs/blazecn', label: 'Introduction' },
          { path: '/docs/blazecn/installation', label: 'Installation' },
          { path: '/docs/blazecn/tokens', label: 'Design Tokens' },
          { path: '/docs/blazecn/cn', label: 'cn() Utility' },
        ],
      },
      {
        heading: 'Core',
        items: [
          { path: '/docs/blazecn/button', label: 'Button' },
          { path: '/docs/blazecn/badge', label: 'Badge' },
          { path: '/docs/blazecn/card', label: 'Card' },
          { path: '/docs/blazecn/theme-toggle', label: 'Theme Toggle' },
        ],
      },
      {
        heading: 'Form',
        items: [
          { path: '/docs/blazecn/input', label: 'Input' },
          { path: '/docs/blazecn/textarea', label: 'Textarea' },
          { path: '/docs/blazecn/label', label: 'Label' },
          { path: '/docs/blazecn/switch', label: 'Switch' },
          { path: '/docs/blazecn/checkbox', label: 'Checkbox' },
          { path: '/docs/blazecn/radio-group', label: 'Radio Group' },
          { path: '/docs/blazecn/select', label: 'Select' },
          { path: '/docs/blazecn/slider', label: 'Slider' },
        ],
      },
      {
        heading: 'Data Display',
        items: [
          { path: '/docs/blazecn/avatar', label: 'Avatar' },
          { path: '/docs/blazecn/table', label: 'Table' },
          { path: '/docs/blazecn/separator', label: 'Separator' },
          { path: '/docs/blazecn/spinner', label: 'Spinner' },
          { path: '/docs/blazecn/skeleton', label: 'Skeleton' },
          { path: '/docs/blazecn/progress', label: 'Progress' },
          { path: '/docs/blazecn/alert', label: 'Alert' },
          { path: '/docs/blazecn/hover-card', label: 'Hover Card' },
        ],
      },
      {
        heading: 'Navigation',
        items: [
          { path: '/docs/blazecn/tabs', label: 'Tabs' },
          { path: '/docs/blazecn/toggle', label: 'Toggle' },
          { path: '/docs/blazecn/toggle-group', label: 'Toggle Group' },
          { path: '/docs/blazecn/accordion', label: 'Accordion' },
          { path: '/docs/blazecn/breadcrumb', label: 'Breadcrumb' },
          { path: '/docs/blazecn/pagination', label: 'Pagination' },
          { path: '/docs/blazecn/collapsible', label: 'Collapsible' },
        ],
      },
      {
        heading: 'Overlay',
        items: [
          { path: '/docs/blazecn/dialog', label: 'Dialog' },
          { path: '/docs/blazecn/tooltip', label: 'Tooltip' },
          { path: '/docs/blazecn/toast', label: 'Sonner' },
          { path: '/docs/blazecn/dropdown-menu', label: 'Dropdown Menu' },
          { path: '/docs/blazecn/popover', label: 'Popover' },
          { path: '/docs/blazecn/sheet', label: 'Sheet' },
        ],
      },
      {
        heading: 'Layout',
        items: [
          { path: '/docs/blazecn/scroll-area', label: 'Scroll Area' },
          { path: '/docs/blazecn/aspect-ratio', label: 'Aspect Ratio' },
        ],
      },
    ],
  },
  {
    title: 'Ribbit',
    basePath: '/docs/ribbit',
    icon: '\uD83D\uDC38',
    sections: [
      {
        heading: 'Overview',
        items: [
          { path: '/docs/ribbit', label: 'Introduction' },
        ],
      },
    ],
  },
  {
    title: 'Kaji',
    basePath: '/docs/kaji',
    icon: '\uD83D\uDD25',
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
    title: 'Ribbit Android',
    basePath: '/docs/ribbit-android',
    icon: '\uD83D\uDCF1',
    sections: [
      {
        heading: 'Overview',
        items: [
          { path: '/docs/ribbit-android', label: 'Introduction' },
        ],
      },
    ],
  },
  {
    title: 'nos2x-frog',
    basePath: '/docs/nos2x-frog',
    icon: '\uD83D\uDD10',
    sections: [
      {
        heading: 'Overview',
        items: [
          { path: '/docs/nos2x-frog', label: 'Introduction' },
        ],
      },
    ],
  },
  {
    title: 'NIPs',
    basePath: '/docs/nips',
    icon: '\uD83D\uDCDC',
    sections: [
      {
        heading: 'Overview',
        items: [
          { path: '/docs/nips', label: 'Introduction' },
        ],
      },
    ],
  },
];

export { NAV };

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

function DocsSidebar({ currentPath }: { currentPath: string }) {
  // Determine which group is active
  const activeGroup = NAV.find((g) => currentPath.startsWith(g.basePath)) || NAV[0];

  return createElement('aside', {
    className: 'hidden lg:block w-56 shrink-0',
  },
    createElement('div', {
      className: 'sticky top-[72px] space-y-1 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 pb-8',
    },
      // Project selector links
      createElement('div', { className: 'flex flex-wrap gap-1.5 mb-4' },
        ...NAV.map((group) =>
          createElement(Link, {
            key: group.title,
            to: group.basePath,
            className: cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors',
              activeGroup.title === group.title
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent',
            ),
          }, group.icon, ' ', group.title),
        ),
      ),

      createElement(Separator, { className: 'mb-3' }),

      // Active group sections
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
  );
}

// ---------------------------------------------------------------------------
// Layout wrapper
// ---------------------------------------------------------------------------

export function DocsLayout({ children, currentPath }: { children?: any; currentPath: string }) {
  return createElement('div', { className: 'flex gap-8' },
    createElement(DocsSidebar, { currentPath }),
    createElement('div', { className: 'flex-1 min-w-0 pb-16' },
      children,
    ),
  );
}
