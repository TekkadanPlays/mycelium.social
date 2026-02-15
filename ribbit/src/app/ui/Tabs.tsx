import { createElement } from 'inferno-create-element';
import { cn } from './utils';

interface TabsProps {
  className?: string;
  value?: string;
  children?: any;
}

export function Tabs({ className, children }: TabsProps) {
  return createElement('div', {
    'data-slot': 'tabs',
    className: cn('flex flex-col gap-2', className),
  }, children);
}

interface TabsListProps {
  className?: string;
  children?: any;
}

export function TabsList({ className, children }: TabsListProps) {
  return createElement('div', {
    'data-slot': 'tabs-list',
    role: 'tablist',
    className: cn(
      'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
      className,
    ),
  }, children);
}

interface TabsTriggerProps {
  className?: string;
  value: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: Event) => void;
  children?: any;
}

export function TabsTrigger(props: TabsTriggerProps) {
  const { className, value, active = false, disabled, onClick, children } = props;

  return createElement('button', {
    'data-slot': 'tabs-trigger',
    type: 'button',
    role: 'tab',
    'aria-selected': active,
    'data-state': active ? 'active' : 'inactive',
    'data-value': value,
    disabled,
    onClick,
    className: cn(
      "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-sm font-medium transition-all outline-none",
      "focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      "disabled:pointer-events-none disabled:opacity-50",
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      active
        ? 'bg-background text-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground',
      className,
    ),
  }, children);
}

interface TabsContentProps {
  className?: string;
  value: string;
  active?: boolean;
  children?: any;
}

export function TabsContent(props: TabsContentProps) {
  const { className, value, active = false, children } = props;

  if (!active) return null;

  return createElement('div', {
    'data-slot': 'tabs-content',
    role: 'tabpanel',
    'data-value': value,
    className: cn('flex-1 outline-none', className),
  }, children);
}
