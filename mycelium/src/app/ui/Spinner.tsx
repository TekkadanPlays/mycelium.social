import { createElement } from 'inferno-create-element';
import { cn } from './utils';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

const sizeStyles = {
  sm: 'size-4 border-2',
  default: 'size-6 border-3',
  lg: 'size-8 border-4',
};

export function Spinner({ className, size = 'default' }: SpinnerProps) {
  return createElement('div', {
    'data-slot': 'spinner',
    role: 'status',
    'aria-label': 'Loading',
    className: cn(
      'animate-spin rounded-full border-muted border-t-primary',
      sizeStyles[size],
      className,
    ),
  });
}
