import { createElement } from 'inferno-create-element';
import { cn } from './utils';

interface AspectRatioProps {
  className?: string;
  ratio?: number;
  children?: any;
}

export function AspectRatio({ className, ratio = 16 / 9, children }: AspectRatioProps) {
  return createElement('div', {
    'data-slot': 'aspect-ratio',
    className: cn('relative w-full overflow-hidden', className),
    style: { paddingBottom: `${(1 / ratio) * 100}%` },
  },
    createElement('div', {
      className: 'absolute inset-0',
    }, children),
  );
}
