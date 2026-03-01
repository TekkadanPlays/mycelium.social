import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Kbd — keyboard key display
// ---------------------------------------------------------------------------

interface KbdProps {
  className?: string;
  children?: any;
}

export function Kbd({ className, children }: KbdProps) {
  return createElement('kbd', {
    'data-slot': 'kbd',
    className: cn(
      'pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100',
      className,
    ),
  }, children);
}

// ---------------------------------------------------------------------------
// KbdGroup — group of keyboard keys with separator
// ---------------------------------------------------------------------------

interface KbdGroupProps {
  className?: string;
  keys: string[];
  separator?: string;
}

export function KbdGroup({ className, keys, separator = '+' }: KbdGroupProps) {
  const elements: any[] = [];
  keys.forEach((key, i) => {
    elements.push(createElement(Kbd, { key: String(i) }, key));
    if (i < keys.length - 1) {
      elements.push(
        createElement('span', {
          key: `sep-${i}`,
          className: 'text-xs text-muted-foreground',
        }, separator),
      );
    }
  });

  return createElement('span', {
    'data-slot': 'kbd-group',
    className: cn('inline-flex items-center gap-0.5', className),
  }, ...elements);
}
