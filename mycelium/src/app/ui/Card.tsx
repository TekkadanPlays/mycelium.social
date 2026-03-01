import { createElement } from 'inferno-create-element';
import { cn } from './utils';

interface CardProps {
  className?: string;
  children?: any;
  onClick?: (e: Event) => void;
}

export function Card({ className, children, onClick }: CardProps) {
  return createElement('div', {
    'data-slot': 'card',
    className: cn(
      'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
      onClick && 'cursor-pointer',
      className,
    ),
    onClick,
  }, children);
}

interface SlotProps {
  className?: string;
  children?: any;
}

export function CardHeader({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'card-header',
    className: cn(
      'grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6',
      className,
    ),
  }, children);
}

export function CardTitle({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'card-title',
    className: cn('leading-none font-semibold', className),
  }, children);
}

export function CardDescription({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'card-description',
    className: cn('text-muted-foreground text-sm', className),
  }, children);
}

export function CardContent({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'card-content',
    className: cn('px-6', className),
  }, children);
}

export function CardFooter({ className, children }: SlotProps) {
  return createElement('div', {
    'data-slot': 'card-footer',
    className: cn('flex items-center px-6', className),
  }, children);
}
