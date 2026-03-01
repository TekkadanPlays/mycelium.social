import { createElement } from 'inferno-create-element';
import { cn } from './utils';

interface CheckboxProps {
  className?: string;
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  onChange?: (checked: boolean) => void;
}

export function Checkbox(props: CheckboxProps) {
  const { className, checked = false, disabled = false, id, onChange } = props;

  return createElement('button', {
    'data-slot': 'checkbox',
    type: 'button',
    role: 'checkbox',
    id,
    'aria-checked': checked,
    'data-state': checked ? 'checked' : 'unchecked',
    disabled,
    onClick: () => onChange?.(!checked),
    className: cn(
      'peer size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none cursor-pointer',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      checked
        ? 'bg-primary text-primary-foreground border-primary'
        : 'border-input dark:bg-input/30',
      className,
    ),
  },
    checked
      ? createElement('svg', {
          className: 'size-3.5 mx-auto',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '3',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
          createElement('polyline', { points: '20 6 9 17 4 12' }),
        )
      : null,
  );
}
