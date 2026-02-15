import { createElement } from 'inferno-create-element';
import { cn } from './utils';

interface InputProps {
  className?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  readOnly?: boolean;
  id?: string;
  onInput?: (e: Event) => void;
  onChange?: (e: Event) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
}

export function Input(props: InputProps) {
  const { className, type = 'text', ...rest } = props;
  return createElement('input', {
    'data-slot': 'input',
    type,
    ...rest,
    className: cn(
      'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      className,
    ),
  });
}
