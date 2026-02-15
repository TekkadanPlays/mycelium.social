import { createElement } from 'inferno-create-element';
import { cn } from './utils';

interface ProgressProps {
  className?: string;
  value?: number;
  max?: number;
}

export function Progress(props: ProgressProps) {
  const { className, value = 0, max = 100 } = props;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return createElement('div', {
    'data-slot': 'progress',
    role: 'progressbar',
    'aria-valuenow': value,
    'aria-valuemin': 0,
    'aria-valuemax': max,
    className: cn(
      'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
      className,
    ),
  },
    createElement('div', {
      'data-slot': 'progress-indicator',
      className: 'bg-primary h-full transition-all duration-300 ease-in-out',
      style: { width: `${percentage}%` },
    }),
  );
}
