import { createElement } from 'inferno-create-element';
import { cn } from './utils';

interface SlotProps {
  className?: string;
  children?: any;
}

export function Table({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'table-container',
    className: 'relative w-full overflow-x-auto',
  },
    createElement('table', {
      'data-slot': 'table',
      className: cn('w-full caption-bottom text-sm', className),
    }, children),
  );
}

export function TableHeader({ className, children }: SlotProps) {
  return createElement('thead', {
    'data-slot': 'table-header',
    className: cn('[&_tr]:border-b', className),
  }, children);
}

export function TableBody({ className, children }: SlotProps) {
  return createElement('tbody', {
    'data-slot': 'table-body',
    className: cn('[&_tr:last-child]:border-0', className),
  }, children);
}

export function TableFooter({ className, children }: SlotProps) {
  return createElement('tfoot', {
    'data-slot': 'table-footer',
    className: cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className),
  }, children);
}

export function TableRow({ className, children }: SlotProps) {
  return createElement('tr', {
    'data-slot': 'table-row',
    className: cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className,
    ),
  }, children);
}

export function TableHead({ className, children }: SlotProps) {
  return createElement('th', {
    'data-slot': 'table-head',
    className: cn(
      'text-muted-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    ),
  }, children);
}

export function TableCell({ className, children }: SlotProps) {
  return createElement('td', {
    'data-slot': 'table-cell',
    className: cn(
      'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    ),
  }, children);
}

export function TableCaption({ className, children }: SlotProps) {
  return createElement('caption', {
    'data-slot': 'table-caption',
    className: cn('text-muted-foreground mt-4 text-sm', className),
  }, children);
}
