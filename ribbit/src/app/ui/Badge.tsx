import { createElement } from 'inferno-create-element';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-white',
        outline: 'border-border text-foreground',
        ghost: 'text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children?: any;
}

export function Badge({ variant, className, children }: BadgeProps) {
  return createElement('span', {
    className: cn(badgeVariants({ variant }), className),
  }, children);
}
