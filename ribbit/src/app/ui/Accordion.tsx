import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------

interface AccordionProps {
  className?: string;
  type?: 'single' | 'multiple';
  children?: any;
}

export function Accordion({ className, children }: AccordionProps) {
  return createElement('div', {
    'data-slot': 'accordion',
    className: cn(className),
  }, children);
}

// ---------------------------------------------------------------------------
// AccordionItem
// ---------------------------------------------------------------------------

interface AccordionItemProps {
  className?: string;
  value: string;
  children?: any;
}

export function AccordionItem({ className, value, children }: AccordionItemProps) {
  return createElement('div', {
    'data-slot': 'accordion-item',
    'data-value': value,
    className: cn('border-b last:border-b-0', className),
  }, children);
}

// ---------------------------------------------------------------------------
// AccordionTrigger
// ---------------------------------------------------------------------------

interface AccordionTriggerProps {
  className?: string;
  open?: boolean;
  onClick?: (e: Event) => void;
  children?: any;
}

export function AccordionTrigger({ className, open = false, onClick, children }: AccordionTriggerProps) {
  return createElement('button', {
    'data-slot': 'accordion-trigger',
    type: 'button',
    'aria-expanded': open,
    'data-state': open ? 'open' : 'closed',
    onClick,
    className: cn(
      'flex w-full flex-1 items-center justify-between gap-4 py-4 text-left text-sm font-medium transition-all outline-none cursor-pointer hover:underline',
      'focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      '[&[data-state=open]>svg]:rotate-180',
      className,
    ),
  },
    children,
    createElement('svg', {
      className: 'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
      createElement('path', { d: 'M6 9l6 6 6-6' }),
    ),
  );
}

// ---------------------------------------------------------------------------
// AccordionContent
// ---------------------------------------------------------------------------

interface AccordionContentProps {
  className?: string;
  open?: boolean;
  children?: any;
}

export function AccordionContent({ className, open = false, children }: AccordionContentProps) {
  return createElement('div', {
    'data-slot': 'accordion-content',
    'data-state': open ? 'open' : 'closed',
    className: cn(
      'overflow-hidden text-sm transition-all duration-300 ease-in-out',
      open ? 'grid grid-rows-[1fr] opacity-100' : 'grid grid-rows-[0fr] opacity-0',
      className,
    ),
  },
    createElement('div', { className: 'min-h-0' },
      createElement('div', { className: 'pt-0 pb-4' }, children),
    ),
  );
}
