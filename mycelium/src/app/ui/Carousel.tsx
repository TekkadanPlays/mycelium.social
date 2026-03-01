import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Carousel
//
// A sliding content carousel with previous/next navigation.
// Supports horizontal and vertical orientation.
// ---------------------------------------------------------------------------

interface CarouselProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  children?: any;
}

interface CarouselState {
  currentIndex: number;
  totalItems: number;
}

export class Carousel extends Component<CarouselProps, CarouselState> {
  declare state: CarouselState;

  constructor(props: CarouselProps) {
    super(props);
    this.state = { currentIndex: 0, totalItems: 0 };
  }

  private scrollPrev = () => {
    this.setState((prev: CarouselState) => ({
      currentIndex: Math.max(0, prev.currentIndex - 1),
    }));
  };

  private scrollNext = () => {
    this.setState((prev: CarouselState) => ({
      currentIndex: Math.min(prev.totalItems - 1, prev.currentIndex + 1),
    }));
  };

  render() {
    const { className, orientation = 'horizontal', children } = this.props;
    const isHorizontal = orientation === 'horizontal';

    return createElement('div', {
      'data-slot': 'carousel',
      'data-orientation': orientation,
      className: cn('relative', className),
      role: 'region',
      'aria-roledescription': 'carousel',
    },
      createElement(CarouselContent, {
        orientation,
        currentIndex: this.state.currentIndex,
      }, children),
      createElement(CarouselPrevious, {
        onClick: this.scrollPrev,
        disabled: this.state.currentIndex === 0,
        orientation,
      }),
      createElement(CarouselNext, {
        onClick: this.scrollNext,
        disabled: this.state.currentIndex >= this.state.totalItems - 1,
        orientation,
      }),
    );
  }

  componentDidMount() {
    const el = (this as any).$LI?.dom;
    if (el) {
      const content = el.querySelector('[data-slot="carousel-content"]');
      if (content) {
        this.setState({ totalItems: content.children.length });
      }
    }
  }
}

// ---------------------------------------------------------------------------
// CarouselContent
// ---------------------------------------------------------------------------

interface CarouselContentProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  currentIndex?: number;
  children?: any;
}

export function CarouselContent({ className, orientation = 'horizontal', currentIndex = 0, children }: CarouselContentProps) {
  const isHorizontal = orientation === 'horizontal';
  const transform = isHorizontal
    ? `translateX(-${currentIndex * 100}%)`
    : `translateY(-${currentIndex * 100}%)`;

  return createElement('div', {
    className: 'overflow-hidden',
  },
    createElement('div', {
      'data-slot': 'carousel-content',
      className: cn(
        'flex transition-transform duration-300 ease-in-out',
        !isHorizontal && 'flex-col',
        className,
      ),
      style: { transform },
    }, children),
  );
}

// ---------------------------------------------------------------------------
// CarouselItem
// ---------------------------------------------------------------------------

interface CarouselItemProps {
  className?: string;
  children?: any;
}

export function CarouselItem({ className, children }: CarouselItemProps) {
  return createElement('div', {
    'data-slot': 'carousel-item',
    role: 'group',
    'aria-roledescription': 'slide',
    className: cn('min-w-0 shrink-0 grow-0 basis-full', className),
  }, children);
}

// ---------------------------------------------------------------------------
// CarouselPrevious / CarouselNext
// ---------------------------------------------------------------------------

interface CarouselNavProps {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export function CarouselPrevious({ className, onClick, disabled, orientation = 'horizontal' }: CarouselNavProps) {
  const isHorizontal = orientation === 'horizontal';

  return createElement('button', {
    'data-slot': 'carousel-previous',
    type: 'button',
    onClick,
    disabled,
    'aria-label': 'Previous slide',
    className: cn(
      'absolute z-10 inline-flex items-center justify-center size-8 rounded-full border border-border bg-background shadow-sm transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'disabled:opacity-50 disabled:pointer-events-none',
      isHorizontal ? 'top-1/2 -translate-y-1/2 -left-4' : 'left-1/2 -translate-x-1/2 -top-4',
      className,
    ),
  },
    createElement('svg', {
      className: 'size-4',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
      createElement('path', { d: isHorizontal ? 'M15 18l-6-6 6-6' : 'M18 15l-6-6-6 6' }),
    ),
  );
}

export function CarouselNext({ className, onClick, disabled, orientation = 'horizontal' }: CarouselNavProps) {
  const isHorizontal = orientation === 'horizontal';

  return createElement('button', {
    'data-slot': 'carousel-next',
    type: 'button',
    onClick,
    disabled,
    'aria-label': 'Next slide',
    className: cn(
      'absolute z-10 inline-flex items-center justify-center size-8 rounded-full border border-border bg-background shadow-sm transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'disabled:opacity-50 disabled:pointer-events-none',
      isHorizontal ? 'top-1/2 -translate-y-1/2 -right-4' : 'left-1/2 -translate-x-1/2 -bottom-4',
      className,
    ),
  },
    createElement('svg', {
      className: 'size-4',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
      createElement('path', { d: isHorizontal ? 'M9 18l6-6-6-6' : 'M6 9l6 6 6-6' }),
    ),
  );
}
