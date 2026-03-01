import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Typography — semantic text components
// ---------------------------------------------------------------------------

interface TypographyProps {
  className?: string;
  children?: any;
}

export function TypographyH1({ className, children }: TypographyProps) {
  return createElement('h1', {
    'data-slot': 'typography-h1',
    className: cn('scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl', className),
  }, children);
}

export function TypographyH2({ className, children }: TypographyProps) {
  return createElement('h2', {
    'data-slot': 'typography-h2',
    className: cn('scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0', className),
  }, children);
}

export function TypographyH3({ className, children }: TypographyProps) {
  return createElement('h3', {
    'data-slot': 'typography-h3',
    className: cn('scroll-m-20 text-2xl font-semibold tracking-tight', className),
  }, children);
}

export function TypographyH4({ className, children }: TypographyProps) {
  return createElement('h4', {
    'data-slot': 'typography-h4',
    className: cn('scroll-m-20 text-xl font-semibold tracking-tight', className),
  }, children);
}

export function TypographyP({ className, children }: TypographyProps) {
  return createElement('p', {
    'data-slot': 'typography-p',
    className: cn('leading-7 [&:not(:first-child)]:mt-6', className),
  }, children);
}

export function TypographyBlockquote({ className, children }: TypographyProps) {
  return createElement('blockquote', {
    'data-slot': 'typography-blockquote',
    className: cn('mt-6 border-l-2 pl-6 italic', className),
  }, children);
}

export function TypographyInlineCode({ className, children }: TypographyProps) {
  return createElement('code', {
    'data-slot': 'typography-inline-code',
    className: cn('relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold', className),
  }, children);
}

export function TypographyLead({ className, children }: TypographyProps) {
  return createElement('p', {
    'data-slot': 'typography-lead',
    className: cn('text-xl text-muted-foreground', className),
  }, children);
}

export function TypographyLarge({ className, children }: TypographyProps) {
  return createElement('div', {
    'data-slot': 'typography-large',
    className: cn('text-lg font-semibold', className),
  }, children);
}

export function TypographySmall({ className, children }: TypographyProps) {
  return createElement('small', {
    'data-slot': 'typography-small',
    className: cn('text-sm font-medium leading-none', className),
  }, children);
}

export function TypographyMuted({ className, children }: TypographyProps) {
  return createElement('p', {
    'data-slot': 'typography-muted',
    className: cn('text-sm text-muted-foreground', className),
  }, children);
}

export function TypographyList({ className, children }: TypographyProps) {
  return createElement('ul', {
    'data-slot': 'typography-list',
    className: cn('my-6 ml-6 list-disc [&>li]:mt-2', className),
  }, children);
}
