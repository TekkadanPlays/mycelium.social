import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// ButtonGroup — group of buttons displayed together
// ---------------------------------------------------------------------------

interface ButtonGroupProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  children?: any;
}

export function ButtonGroup({ className, orientation = 'horizontal', children }: ButtonGroupProps) {
  const isHorizontal = orientation === 'horizontal';

  return createElement('div', {
    'data-slot': 'button-group',
    role: 'group',
    className: cn(
      'inline-flex',
      isHorizontal ? 'flex-row' : 'flex-col',
      // Remove inner border-radius and double borders between buttons
      isHorizontal && '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:-ml-px',
      !isHorizontal && '[&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:-mt-px',
      className,
    ),
  }, children);
}
