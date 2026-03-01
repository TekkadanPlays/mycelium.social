import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// ScrollArea
//
// CSS-only scrollable area with styled scrollbar. No Radix ScrollArea needed.
// Uses thin custom scrollbar via Tailwind utilities.
// ---------------------------------------------------------------------------

interface ScrollAreaProps {
  className?: string;
  children?: any;
}

export function ScrollArea({ className, children }: ScrollAreaProps) {
  return createElement('div', {
    'data-slot': 'scroll-area',
    className: cn(
      'relative overflow-auto',
      '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2',
      '[&::-webkit-scrollbar-track]:bg-transparent',
      '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border',
      className,
    ),
  }, children);
}
