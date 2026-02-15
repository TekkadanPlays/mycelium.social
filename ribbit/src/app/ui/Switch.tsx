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
      'peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 shadow-xs transition-all outline-none cursor-pointer',
      'focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      checked ? 'bg-primary border-primary' : 'bg-muted-foreground/25 border-muted-foreground/40',
      className,
    ),
  },
    createElement('span', {
      'data-slot': 'switch-thumb',
      className: cn(
        'pointer-events-none block size-4 rounded-full bg-background ring-0 transition-transform',
        checked ? 'translate-x-4' : 'translate-x-0',
      ),
    }),
  );
}
