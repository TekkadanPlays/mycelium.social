import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Select
//
// A custom styled select dropdown. Uses a button trigger + positioned list,
// not a native <select>. Click-outside closes the menu.
// ---------------------------------------------------------------------------

interface SelectProps {
  children?: any;
}

export function Select({ children }: SelectProps) {
  return createElement('div', {
    'data-slot': 'select',
    className: 'relative inline-block',
  }, children);
}

// ---------------------------------------------------------------------------
// SelectTrigger
// ---------------------------------------------------------------------------

interface SelectTriggerProps {
  className?: string;
  open?: boolean;
  disabled?: boolean;
  onClick?: (e: Event) => void;
  children?: any;
}

export function SelectTrigger(props: SelectTriggerProps) {
  const { className, open = false, disabled = false, onClick, children } = props;

  return createElement('button', {
    'data-slot': 'select-trigger',
    type: 'button',
    role: 'combobox',
    'aria-expanded': open,
    disabled,
    onClick,
    className: cn(
      'border-input dark:bg-input/30 dark:hover:bg-input/50 flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2',
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className,
    ),
  },
    children,
    createElement('svg', {
      className: 'size-4 shrink-0 opacity-50',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
      createElement('path', { d: 'M6 9l6 6 6-6' }),
    ),
  );
}

// ---------------------------------------------------------------------------
// SelectValue
// ---------------------------------------------------------------------------

interface SelectValueProps {
  className?: string;
  placeholder?: string;
  children?: any;
}

export function SelectValue({ className, placeholder, children }: SelectValueProps) {
  return createElement('span', {
    'data-slot': 'select-value',
    className: cn(className),
  }, children || createElement('span', { className: 'text-muted-foreground' }, placeholder));
}

// ---------------------------------------------------------------------------
// SelectContent
// ---------------------------------------------------------------------------

interface SelectContentProps {
  className?: string;
  open?: boolean;
  onClose?: () => void;
  children?: any;
}

export class SelectContent extends Component<SelectContentProps> {
  private handleClickOutside = (e: MouseEvent) => {
    const el = (this as any).$LI?.dom;
    if (el && !el.contains(e.target as Node)) {
      this.props.onClose?.();
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.props.onClose?.();
  };

  componentDidMount() {
    setTimeout(() => {
      document.addEventListener('mousedown', this.handleClickOutside);
      document.addEventListener('keydown', this.handleKeyDown);
    }, 0);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    const { className, open, children } = this.props;
    if (!open) return null;

    return createElement('div', {
      'data-slot': 'select-content',
      role: 'listbox',
      className: cn(
        'absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        className,
      ),
    }, children);
  }
}

// ---------------------------------------------------------------------------
// SelectItem
// ---------------------------------------------------------------------------

interface SelectItemProps {
  className?: string;
  value: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (e: Event) => void;
  children?: any;
}

export function SelectItem(props: SelectItemProps) {
  const { className, value, selected = false, disabled = false, onClick, children } = props;

  return createElement('button', {
    'data-slot': 'select-item',
    type: 'button',
    role: 'option',
    'aria-selected': selected,
    'data-value': value,
    disabled,
    onClick,
    className: cn(
      'relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
      'hover:bg-accent hover:text-accent-foreground',
      'focus-visible:bg-accent focus-visible:text-accent-foreground',
      disabled && 'pointer-events-none opacity-50',
      selected && 'bg-accent/50',
      className,
    ),
  },
    createElement('span', { className: 'flex-1 text-left' }, children),
    selected
      ? createElement('svg', {
          className: 'size-4 shrink-0',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
          createElement('polyline', { points: '20 6 9 17 4 12' }),
        )
      : null,
  );
}

// ---------------------------------------------------------------------------
// SelectSeparator
// ---------------------------------------------------------------------------

interface SelectSeparatorProps {
  className?: string;
}

export function SelectSeparator({ className }: SelectSeparatorProps) {
  return createElement('div', {
    'data-slot': 'select-separator',
    role: 'separator',
    className: cn('bg-border -mx-1 my-1 h-px', className),
  });
}
