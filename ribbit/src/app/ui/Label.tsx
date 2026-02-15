import { createElement } from 'inferno-create-element';
import { cn } from './utils';

interface LabelProps {
  className?: string;
  htmlFor?: string;
  children?: any;
}

export function Label({ className, htmlFor, children }: LabelProps) {
  return createElement('label', {
    'data-slot': 'label',
    for: htmlFor,
    className: cn(
      'flex items-center gap-2 text-sm leading-none font-medium select-none',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      className,
    ),
  }, children);
}
