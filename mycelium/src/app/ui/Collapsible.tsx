import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Collapsible
// ---------------------------------------------------------------------------

interface CollapsibleProps {
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: any;
}

export function Collapsible({ className, open = false, children }: CollapsibleProps) {
  return createElement('div', {
    'data-slot': 'collapsible',
    'data-state': open ? 'open' : 'closed',
    className: cn(className),
  }, children);
}

// ---------------------------------------------------------------------------
// CollapsibleTrigger
// ---------------------------------------------------------------------------

interface CollapsibleTriggerProps {
  className?: string;
  open?: boolean;
  onClick?: (e: Event) => void;
  children?: any;
}

export function CollapsibleTrigger({ className, open = false, onClick, children }: CollapsibleTriggerProps) {
  return createElement('button', {
    'data-slot': 'collapsible-trigger',
    type: 'button',
    'aria-expanded': open,
    'data-state': open ? 'open' : 'closed',
    onClick,
    className: cn(className),
  }, children);
}

// ---------------------------------------------------------------------------
// CollapsibleContent
// ---------------------------------------------------------------------------

interface CollapsibleContentProps {
  className?: string;
  open?: boolean;
  children?: any;
}

export function CollapsibleContent({ className, open = false, children }: CollapsibleContentProps) {
  if (!open) return null;

  return createElement('div', {
    'data-slot': 'collapsible-content',
    'data-state': 'open',
    className: cn(className),
  }, children);
}
