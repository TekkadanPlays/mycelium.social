import { createElement } from 'inferno-create-element';
import { cn } from './utils';
import { toggleVariants, type ToggleVariant, type ToggleSize } from './Toggle';

interface ToggleGroupProps {
  className?: string;
  type?: 'single' | 'multiple';
  variant?: ToggleVariant;
  size?: ToggleSize;
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
  children?: any;
}

export function ToggleGroup(props: ToggleGroupProps) {
  const { className, children } = props;

  return createElement('div', {
    'data-slot': 'toggle-group',
    role: 'group',
    className: cn('flex items-center gap-1', className),
  }, children);
}

interface ToggleGroupItemProps {
  className?: string;
  value: string;
  pressed?: boolean;
  disabled?: boolean;
  variant?: ToggleVariant;
  size?: ToggleSize;
  onClick?: (e: Event) => void;
  children?: any;
}

export function ToggleGroupItem(props: ToggleGroupItemProps) {
  const { className, value, pressed = false, disabled, variant = 'default', size = 'default', onClick, children } = props;

  return createElement('button', {
    'data-slot': 'toggle-group-item',
    type: 'button',
    'aria-pressed': pressed,
    'data-state': pressed ? 'on' : 'off',
    'data-value': value,
    disabled,
    onClick,
    className: cn(
      toggleVariants({ variant, size }),
      'focus-visible:z-10',
      className,
    ),
  }, children);
}
