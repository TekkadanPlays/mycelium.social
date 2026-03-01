import { createElement } from 'inferno-create-element';
import { cn } from './utils';
import { buttonVariants } from './Button';

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

interface PaginationProps {
  className?: string;
  children?: any;
}

export function Pagination({ className, children }: PaginationProps) {
  return createElement('nav', {
    'data-slot': 'pagination',
    role: 'navigation',
    'aria-label': 'pagination',
    className: cn('mx-auto flex w-full justify-center', className),
  }, children);
}

// ---------------------------------------------------------------------------
// PaginationContent
// ---------------------------------------------------------------------------

interface PaginationContentProps {
  className?: string;
  children?: any;
}

export function PaginationContent({ className, children }: PaginationContentProps) {
  return createElement('ul', {
    'data-slot': 'pagination-content',
    className: cn('flex flex-row items-center gap-1', className),
  }, children);
}

// ---------------------------------------------------------------------------
// PaginationItem
// ---------------------------------------------------------------------------

interface PaginationItemProps {
  className?: string;
  children?: any;
}

export function PaginationItem({ className, children }: PaginationItemProps) {
  return createElement('li', {
    'data-slot': 'pagination-item',
    className: cn(className),
  }, children);
}

// ---------------------------------------------------------------------------
// PaginationLink
// ---------------------------------------------------------------------------

interface PaginationLinkProps {
  className?: string;
  isActive?: boolean;
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  href?: string;
  onClick?: (e: Event) => void;
  'aria-label'?: string;
  children?: any;
}

export function PaginationLink(props: PaginationLinkProps) {
  const { className, isActive = false, disabled = false, size = 'icon', href, onClick, children } = props;

  return createElement(href ? 'a' : 'button', {
    'data-slot': 'pagination-link',
    'aria-current': isActive ? 'page' : undefined,
    href,
    type: href ? undefined : 'button',
    disabled,
    onClick,
    className: cn(
      buttonVariants({ variant: isActive ? 'outline' : 'ghost', size }),
      isActive && 'border-input',
      disabled && 'pointer-events-none opacity-50',
      className,
    ),
  }, children);
}

// ---------------------------------------------------------------------------
// PaginationPrevious
// ---------------------------------------------------------------------------

interface PaginationNavProps {
  className?: string;
  href?: string;
  onClick?: (e: Event) => void;
  disabled?: boolean;
}

export function PaginationPrevious({ className, href, onClick, disabled }: PaginationNavProps) {
  return createElement(PaginationLink, {
    href,
    onClick,
    disabled,
    size: 'default',
    'aria-label': 'Go to previous page',
    className: cn('gap-1 pl-2.5', className),
  },
    createElement('svg', {
      className: 'size-4',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }, createElement('path', { d: 'm15 18-6-6 6-6' })),
    createElement('span', null, 'Previous'),
  );
}

// ---------------------------------------------------------------------------
// PaginationNext
// ---------------------------------------------------------------------------

export function PaginationNext({ className, href, onClick, disabled }: PaginationNavProps) {
  return createElement(PaginationLink, {
    href,
    onClick,
    disabled,
    size: 'default',
    'aria-label': 'Go to next page',
    className: cn('gap-1 pr-2.5', className),
  },
    createElement('span', null, 'Next'),
    createElement('svg', {
      className: 'size-4',
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
// PaginationEllipsis
// ---------------------------------------------------------------------------

interface PaginationEllipsisProps {
  className?: string;
}

export function PaginationEllipsis({ className }: PaginationEllipsisProps) {
  return createElement('span', {
    'data-slot': 'pagination-ellipsis',
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
    createElement('span', { className: 'sr-only' }, 'More pages'),
  );
}
