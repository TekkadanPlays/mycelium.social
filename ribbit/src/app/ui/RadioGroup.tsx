import { createElement } from 'inferno-create-element';
import { cn } from './utils';

interface RadioGroupProps {
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: any;
}

export function RadioGroup(props: RadioGroupProps) {
  const { className, children } = props;

  return createElement('div', {
    'data-slot': 'radio-group',
    role: 'radiogroup',
    className: cn('grid gap-3', className),
  }, children);
}

interface RadioGroupItemProps {
  className?: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  onClick?: (e: Event) => void;
}

export function RadioGroupItem(props: RadioGroupItemProps) {
  const { className, value, checked = false, disabled = false, id, onClick } = props;

  return createElement('button', {
    'data-slot': 'radio-group-item',
    type: 'button',
    role: 'radio',
    id,
    'aria-checked': checked,
    'data-state': checked ? 'checked' : 'unchecked',
    'data-value': value,
    disabled,
    onClick,
    className: cn(
      'aspect-square size-4 shrink-0 rounded-full border-2 shadow-xs transition-all outline-none cursor-pointer',
      'focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      checked ? 'border-primary' : 'border-input',
      className,
    ),
  },
    checked
      ? createElement('span', {
          className: 'flex items-center justify-center',
        },
          createElement('span', {
            className: 'size-2 rounded-full bg-primary',
          }),
        )
      : null,
  );
}
