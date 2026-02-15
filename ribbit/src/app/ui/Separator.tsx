import { createElement } from 'inferno-create-element';
import { cn } from './utils';

interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Separator({ className, orientation = 'horizontal' }: SeparatorProps) {
  return createElement('div', {
    'data-slot': 'separator',
    role: 'separator',
    className: cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      className,
    ),
  });
}
