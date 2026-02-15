import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Breadcrumb
// ---------------------------------------------------------------------------

interface BreadcrumbProps {
  className?: string;
  children?: any;
}

export function Breadcrumb({ className, children }: BreadcrumbProps) {
  return createElement('nav', {
    'data-slot': 'breadcrumb',
    'aria-label': 'breadcrumb',
    className: cn(className),
  }, children);
}

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------

interface BreadcrumbListProps {
  className?: string;
  children?: any;
}

export function BreadcrumbList({ className, children }: BreadcrumbListProps) {
  return createElement('ol', {
    'data-slot': 'breadcrumb-list',
    className: cn(
      'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5',
      className,
    ),
  }, children);
}

// ---------------------------------------------------------------------------
// BreadcrumbItem
// ---------------------------------------------------------------------------

interface BreadcrumbItemProps {
  className?: string;
  children?: any;
}

export function BreadcrumbItem({ className, children }: BreadcrumbItemProps) {
  return createElement('li', {
    'data-slot': 'breadcrumb-item',
    className: cn('inline-flex items-center gap-1.5', className),
  }, children);
}

// ---------------------------------------------------------------------------
// BreadcrumbLink
// ---------------------------------------------------------------------------

interface BreadcrumbLinkProps {
  className?: string;
  href?: string;
  onClick?: (e: Event) => void;
  children?: any;
}

export function BreadcrumbLink({ className, href, onClick, children }: BreadcrumbLinkProps) {
  return createElement(href ? 'a' : 'button', {
    'data-slot': 'breadcrumb-link',
    href,
    type: href ? undefined : 'button',
    onClick,
    className: cn(
      'text-muted-foreground hover:text-foreground transition-colors',
      className,
    ),
  }, children);
}

// ---------------------------------------------------------------------------
// BreadcrumbPage (current / non-clickable)
// ---------------------------------------------------------------------------

interface BreadcrumbPageProps {
  className?: string;
  children?: any;
}

export function BreadcrumbPage({ className, children }: BreadcrumbPageProps) {
  return createElement('span', {
    'data-slot': 'breadcrumb-page',
    role: 'link',
    'aria-disabled': true,
    'aria-current': 'page',
    className: cn('text-foreground font-normal', className),
  }, children);
}

// ---------------------------------------------------------------------------
// BreadcrumbSeparator
// ---------------------------------------------------------------------------

interface BreadcrumbSeparatorProps {
  className?: string;
  children?: any;
}

export function BreadcrumbSeparator({ className, children }: BreadcrumbSeparatorProps) {
  return createElement('li', {
    'data-slot': 'breadcrumb-separator',
    role: 'presentation',
    'aria-hidden': true,
    className: cn('[&>svg]:size-3.5', className),
  },
    children ||
    createElement('svg', {
      className: 'size-3.5',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }, createElement('path', { d: 'm9 18 6-6-6-6' })),
  );
}

// ---------------------------------------------------------------------------
// BreadcrumbEllipsis
// ---------------------------------------------------------------------------

interface BreadcrumbEllipsisProps {
  className?: string;
}

export function BreadcrumbEllipsis({ className }: BreadcrumbEllipsisProps) {
  return createElement('span', {
    'data-slot': 'breadcrumb-ellipsis',
    role: 'presentation',
    'aria-hidden': true,
    className: cn('flex size-9 items-center justify-center', className),
  },
    createElement('svg', {
      className: 'size-4',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
      createElement('circle', { cx: '12', cy: '12', r: '1' }),
      createElement('circle', { cx: '19', cy: '12', r: '1' }),
      createElement('circle', { cx: '5', cy: '12', r: '1' }),
    ),
    createElement('span', { className: 'sr-only' }, 'More'),
  );
}
