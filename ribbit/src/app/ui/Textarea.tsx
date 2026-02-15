import { createElement } from 'inferno-create-element';
import { cn } from './utils';

interface TextareaProps {
  className?: string;
  placeholder?: string;
  value?: string;
  rows?: number;
  disabled?: boolean;
  onInput?: (e: Event) => void;
  onChange?: (e: Event) => void;
}

export function Textarea(props: TextareaProps) {
  const { className, rows = 3, ...rest } = props;
  return createElement('textarea', {
    'data-slot': 'textarea',
    rows,
    ...rest,
    className: cn(
      'border-input placeholder:text-muted-foreground dark:bg-input/30 flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'resize-none',
      className,
    ),
  });
}
