import { createElement } from 'inferno-create-element';
import { cn } from './utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return createElement('div', {
    'data-slot': 'skeleton',
    className: cn('bg-accent animate-pulse rounded-md', className),
  });
}
