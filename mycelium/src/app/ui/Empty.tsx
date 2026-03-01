import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Empty — empty state placeholder
// ---------------------------------------------------------------------------

interface EmptyProps {
  className?: string;
  children?: any;
}

export function Empty({ className, children }: EmptyProps) {
  return createElement('div', {
    'data-slot': 'empty',
    className: cn(
      'flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-md border border-dashed p-8 text-center',
      className,
    ),
  }, children);
}

// ---------------------------------------------------------------------------
// EmptyIcon
// ---------------------------------------------------------------------------

interface EmptyIconProps {
  className?: string;
  children?: any;
}

export function EmptyIcon({ className, children }: EmptyIconProps) {
  return createElement('div', {
    'data-slot': 'empty-icon',
    className: cn('flex size-12 items-center justify-center rounded-full bg-muted [&_svg]:size-6 [&_svg]:text-muted-foreground', className),
  }, children);
}

// ---------------------------------------------------------------------------
// EmptyTitle
// ---------------------------------------------------------------------------

interface EmptyTitleProps {
  className?: string;
  children?: any;
}

export function EmptyTitle({ className, children }: EmptyTitleProps) {
  return createElement('h3', {
    'data-slot': 'empty-title',
    className: cn('mt-2 text-lg font-semibold', className),
  }, children);
}

// ---------------------------------------------------------------------------
// EmptyDescription
// ---------------------------------------------------------------------------

interface EmptyDescriptionProps {
  className?: string;
  children?: any;
}

export function EmptyDescription({ className, children }: EmptyDescriptionProps) {
  return createElement('p', {
    'data-slot': 'empty-description',
    className: cn('mb-4 text-sm text-muted-foreground', className),
  }, children);
}

// ---------------------------------------------------------------------------
// EmptyActions
// ---------------------------------------------------------------------------

interface EmptyActionsProps {
  className?: string;
  children?: any;
}

export function EmptyActions({ className, children }: EmptyActionsProps) {
  return createElement('div', {
    'data-slot': 'empty-actions',
    className: cn('flex items-center gap-2', className),
  }, children);
}
