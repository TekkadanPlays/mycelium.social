import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

interface SliderProps {
  className?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (value: number) => void;
}

export class Slider extends Component<SliderProps, { dragging: boolean }> {
  declare state: { dragging: boolean };
  private trackRef: HTMLDivElement | null = null;

  constructor(props: SliderProps) {
    super(props);
    this.state = { dragging: false };
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
  }

  private getPercentage(): number {
    const { value = 0, min = 0, max = 100 } = this.props;
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  }

  private valueFromPosition(clientX: number): number {
    if (!this.trackRef) return this.props.value ?? this.props.min ?? 0;
    const rect = this.trackRef.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const { min = 0, max = 100, step = 1 } = this.props;
    const raw = min + ratio * (max - min);
    return Math.round(raw / step) * step;
  }

  private handlePointerDown(e: PointerEvent) {
    if (this.props.disabled) return;
    this.setState({ dragging: true });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.props.onValueChange?.(this.valueFromPosition(e.clientX));
  }

  private handlePointerMove(e: PointerEvent) {
    if (!this.state.dragging || this.props.disabled) return;
    this.props.onValueChange?.(this.valueFromPosition(e.clientX));
  }

  private handlePointerUp() {
    this.setState({ dragging: false });
  }

  render() {
    const { className, disabled = false } = this.props;
    const pct = this.getPercentage();

    return createElement('div', {
      'data-slot': 'slider',
      role: 'slider',
      'aria-valuenow': this.props.value ?? 0,
      'aria-valuemin': this.props.min ?? 0,
      'aria-valuemax': this.props.max ?? 100,
      'aria-disabled': disabled,
      tabIndex: disabled ? -1 : 0,
      className: cn(
        'relative flex w-full touch-none items-center select-none',
        disabled && 'opacity-50 pointer-events-none',
        className,
      ),
      onPointerDown: this.handlePointerDown,
      onPointerMove: this.handlePointerMove,
      onPointerUp: this.handlePointerUp,
    },
      createElement('div', {
        ref: (el: HTMLDivElement | null) => { this.trackRef = el; },
        'data-slot': 'slider-track',
        className: 'bg-primary/20 relative h-1.5 w-full grow overflow-hidden rounded-full',
      },
        createElement('div', {
          'data-slot': 'slider-range',
          className: 'bg-primary absolute h-full',
          style: { width: `${pct}%` },
        }),
      ),
      createElement('div', {
        'data-slot': 'slider-thumb',
        className: cn(
          'block size-4 shrink-0 rounded-full border border-primary/50 bg-background shadow-sm transition-colors',
          'focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          this.state.dragging && 'ring-ring/50 ring-[3px]',
        ),
        style: {
          position: 'absolute',
          left: `calc(${pct}% - 8px)`,
          top: '50%',
          transform: 'translateY(-50%)',
        },
      }),
    );
  }
}
