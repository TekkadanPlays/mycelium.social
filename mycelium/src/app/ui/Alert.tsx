import { createElement } from 'inferno-create-element';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

export const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-foreground',
        destructive:
          'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

interface AlertProps extends VariantProps<typeof alertVariants> {
  className?: string;
  children?: any;
}

export function Alert({ variant, className, children }: AlertProps) {
  return createElement('div', {
    'data-slot': 'alert',
    role: 'alert',
    className: cn(alertVariants({ variant }), className),
  }, children);
}

interface AlertTitleProps {
  className?: string;
  children?: any;
}

export function AlertTitle({ className, children }: AlertTitleProps) {
  return createElement('div', {
    'data-slot': 'alert-title',
    className: cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className),
  }, children);
}

interface AlertDescriptionProps {
  className?: string;
  children?: any;
}

export function AlertDescription({ className, children }: AlertDescriptionProps) {
  return createElement('div', {
    'data-slot': 'alert-description',
    className: cn('col-start-2 text-sm text-muted-foreground [&_p]:leading-relaxed', className),
  }, children);
}
