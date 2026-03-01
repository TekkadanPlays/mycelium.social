import { createElement } from 'inferno-create-element';
import { cn } from './utils';

interface SwitchProps {
  className?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Switch({ className, checked = false, disabled = false, onChange }: SwitchProps) {
  return createElement('button', {
    'data-slot': 'switch',
    type: 'button',
    role: 'switch',
    'aria-checked': checked,
    disabled,
    onClick: () => onChange?.(!checked),
    className: cn(
      'peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none cursor-pointer',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      checked ? 'bg-primary' : 'bg-input dark:bg-input/80',
      className,
    ),
  },
    createElement('span', {
      'data-slot': 'switch-thumb',
      className: cn(
        'pointer-events-none block size-4 rounded-full ring-0 transition-transform',
        checked
          ? 'translate-x-[calc(100%-2px)] bg-primary-foreground'
          : 'translate-x-0 bg-background dark:bg-foreground',
      ),
    }),
  );
}
