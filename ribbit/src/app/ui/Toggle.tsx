import { createElement } from 'inferno-create-element';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

export const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:focus-visible:ring-destructive/20",
  {
    variants: {
      variant: {
        default: 'bg-transparent hover:bg-muted hover:text-muted-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
        outline: 'border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
      },
      size: {
        default: 'h-9 px-2 min-w-9',
        sm: 'h-8 px-1.5 min-w-8',
        lg: 'h-10 px-2.5 min-w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export type ToggleVariant = NonNullable<VariantProps<typeof toggleVariants>['variant']>;
export type ToggleSize = NonNullable<VariantProps<typeof toggleVariants>['size']>;

interface ToggleProps extends VariantProps<typeof toggleVariants> {
  className?: string;
  pressed?: boolean;
  disabled?: boolean;
  onClick?: (e: Event) => void;
  children?: any;
}

export function Toggle(props: ToggleProps) {
  const { variant, size, className, pressed = false, disabled, onClick, children } = props;

  return createElement('button', {
    'data-slot': 'toggle',
    type: 'button',
    'aria-pressed': pressed,
    'data-state': pressed ? 'on' : 'off',
    disabled,
    onClick,
    className: cn(toggleVariants({ variant, size }), className),
  }, children);
}
