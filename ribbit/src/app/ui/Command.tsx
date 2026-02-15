import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Command (command palette / search)
//
// A composable command menu. Can be used standalone or inside a Dialog
// for a spotlight-style search experience.
// ---------------------------------------------------------------------------

interface CommandProps {
  className?: string;
  children?: any;
}

export function Command({ className, children }: CommandProps) {
  return createElement('div', {
    'data-slot': 'command',
    className: cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className,
    ),
  }, children);
}

// ---------------------------------------------------------------------------
// CommandInput
// ---------------------------------------------------------------------------

interface CommandInputProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onInput?: (e: Event) => void;
}

export function CommandInput({ className, placeholder = 'Type a command or search...', value, onInput }: CommandInputProps) {
  return createElement('div', {
    'data-slot': 'command-input-wrapper',
    className: 'flex items-center border-b border-border px-3',
  },
    createElement('svg', {
      className: 'mr-2 size-4 shrink-0 opacity-50',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
      createElement('circle', { cx: '11', cy: '11', r: '8' }),
      createElement('path', { d: 'm21 21-4.3-4.3' }),
    ),
    createElement('input', {
      'data-slot': 'command-input',
      type: 'text',
      placeholder,
      value,
      onInput,
      className: cn(
        'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      ),
    }),
  );
}

// ---------------------------------------------------------------------------
// CommandList
// ---------------------------------------------------------------------------

interface CommandListProps {
  className?: string;
  children?: any;
}

export function CommandList({ className, children }: CommandListProps) {
  return createElement('div', {
    'data-slot': 'command-list',
    role: 'listbox',
    className: cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className),
  }, children);
}

// ---------------------------------------------------------------------------
// CommandEmpty
// ---------------------------------------------------------------------------

interface CommandEmptyProps {
  className?: string;
  children?: any;
}

export function CommandEmpty({ className, children }: CommandEmptyProps) {
  return createElement('div', {
    'data-slot': 'command-empty',
    className: cn('py-6 text-center text-sm text-muted-foreground', className),
  }, children || 'No results found.');
}

// ---------------------------------------------------------------------------
// CommandGroup
// ---------------------------------------------------------------------------

interface CommandGroupProps {
  className?: string;
  heading?: string;
  children?: any;
}

export function CommandGroup({ className, heading, children }: CommandGroupProps) {
  return createElement('div', {
    'data-slot': 'command-group',
    role: 'group',
    className: cn('overflow-hidden p-1 text-foreground', className),
  },
    heading
      ? createElement('div', {
          'data-slot': 'command-group-heading',
          className: 'px-2 py-1.5 text-xs font-medium text-muted-foreground',
        }, heading)
      : null,
    children,
  );
}

// ---------------------------------------------------------------------------
// CommandItem
// ---------------------------------------------------------------------------

interface CommandItemProps {
  className?: string;
  disabled?: boolean;
  onClick?: (e: Event) => void;
  children?: any;
}

export function CommandItem({ className, disabled = false, onClick, children }: CommandItemProps) {
  return createElement('div', {
    'data-slot': 'command-item',
    role: 'option',
    'data-disabled': disabled || undefined,
    onClick: disabled ? undefined : onClick,
    className: cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "hover:bg-accent hover:text-accent-foreground",
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      disabled && 'pointer-events-none opacity-50',
      !disabled && 'cursor-pointer',
      className,
    ),
  }, children);
}

// ---------------------------------------------------------------------------
// CommandSeparator
// ---------------------------------------------------------------------------

interface CommandSeparatorProps {
  className?: string;
}

export function CommandSeparator({ className }: CommandSeparatorProps) {
  return createElement('div', {
    'data-slot': 'command-separator',
    role: 'separator',
    className: cn('bg-border -mx-1 h-px', className),
  });
}

// ---------------------------------------------------------------------------
// CommandShortcut
// ---------------------------------------------------------------------------

interface CommandShortcutProps {
  className?: string;
  children?: any;
}

export function CommandShortcut({ className, children }: CommandShortcutProps) {
  return createElement('span', {
    'data-slot': 'command-shortcut',
    className: cn('ml-auto text-xs tracking-widest text-muted-foreground', className),
  }, children);
}

// ---------------------------------------------------------------------------
// CommandDialog — wraps Command in a Dialog-style overlay
// ---------------------------------------------------------------------------

interface CommandDialogProps {
  open: boolean;
  onClose?: () => void;
  children?: any;
}

export class CommandDialog extends Component<CommandDialogProps> {
  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.props.onClose?.();
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.body.style.overflow = '';
  }

  render() {
    const { open, onClose, children } = this.props;
    if (!open) return null;

    return createElement('div', {
      'data-slot': 'command-dialog',
      className: 'fixed inset-0 z-50',
    },
      createElement('div', {
        className: 'fixed inset-0 bg-black/50 backdrop-blur-[2px]',
        onClick: onClose,
      }),
      createElement('div', {
        className: 'fixed top-[50%] left-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]',
      },
        createElement(Command, {
          className: 'rounded-lg border shadow-lg',
        }, children),
      ),
    );
  }
}
