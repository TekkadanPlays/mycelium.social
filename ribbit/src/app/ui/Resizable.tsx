import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// ResizablePanelGroup — container for resizable panels
// ---------------------------------------------------------------------------

interface ResizablePanelGroupProps {
  className?: string;
  direction?: 'horizontal' | 'vertical';
  children?: any;
}

interface ResizablePanelGroupState {
  sizes: number[];
  dragging: number | null;
}

export class ResizablePanelGroup extends Component<ResizablePanelGroupProps, ResizablePanelGroupState> {
  declare state: ResizablePanelGroupState;
  private ref: HTMLDivElement | null = null;

  constructor(props: ResizablePanelGroupProps) {
    super(props);
    this.state = { sizes: [], dragging: null };
  }

  componentDidMount() {
    this.initSizes();
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  private initSizes() {
    const children = this.getPanels();
    const count = children.length;
    if (count > 0 && this.state.sizes.length !== count) {
      const defaultSizes = children.map((c: any) => c.props?.defaultSize || (100 / count));
      this.setState({ sizes: defaultSizes });
    }
  }

  private getPanels(): any[] {
    const { children } = this.props;
    const arr = Array.isArray(children) ? children : [children];
    return arr.filter((c: any) => c?.type === ResizablePanel || c?.props?.['data-slot'] === 'resizable-panel');
  }

  private handleMouseMove = (e: MouseEvent) => {
    const { dragging, sizes } = this.state;
    if (dragging === null || !this.ref) return;

    const rect = this.ref.getBoundingClientRect();
    const isHorizontal = (this.props.direction || 'horizontal') === 'horizontal';
    const total = isHorizontal ? rect.width : rect.height;
    const pos = isHorizontal ? (e.clientX - rect.left) : (e.clientY - rect.top);
    const pct = (pos / total) * 100;

    const newSizes = [...sizes];
    const sumBefore = sizes.slice(0, dragging).reduce((a, b) => a + b, 0);
    const combined = sizes[dragging] + sizes[dragging + 1];

    const minSize = 10;
    let leftSize = pct - sumBefore;
    leftSize = Math.max(minSize, Math.min(combined - minSize, leftSize));

    newSizes[dragging] = leftSize;
    newSizes[dragging + 1] = combined - leftSize;
    this.setState({ sizes: newSizes });
  };

  private handleMouseUp = () => {
    if (this.state.dragging !== null) {
      this.setState({ dragging: null });
    }
  };

  private startDrag = (index: number) => {
    this.setState({ dragging: index });
  };

  render() {
    const { className, direction = 'horizontal' } = this.props;
    const { sizes } = this.state;
    const panels = this.getPanels();
    const isHorizontal = direction === 'horizontal';

    const elements: any[] = [];
    panels.forEach((panel: any, i: number) => {
      elements.push(
        createElement('div', {
          key: `panel-${i}`,
          'data-slot': 'resizable-panel',
          className: cn('overflow-hidden', panel.props?.className),
          style: {
            [isHorizontal ? 'width' : 'height']: sizes[i] ? `${sizes[i]}%` : 'auto',
            flexShrink: 0,
          },
        }, panel.props?.children || panel.children),
      );

      if (i < panels.length - 1) {
        elements.push(
          createElement(ResizableHandle, {
            key: `handle-${i}`,
            direction,
            onDragStart: () => this.startDrag(i),
          }),
        );
      }
    });

    return createElement('div', {
      'data-slot': 'resizable-panel-group',
      ref: (el: HTMLDivElement | null) => { this.ref = el; },
      className: cn(
        'flex h-full w-full',
        isHorizontal ? 'flex-row' : 'flex-col',
        this.state.dragging !== null && 'select-none',
        className,
      ),
    }, ...elements);
  }
}

// ---------------------------------------------------------------------------
// ResizablePanel
// ---------------------------------------------------------------------------

interface ResizablePanelProps {
  className?: string;
  defaultSize?: number;
  children?: any;
}

export function ResizablePanel({ className, defaultSize, children }: ResizablePanelProps) {
  return createElement('div', {
    'data-slot': 'resizable-panel',
    className,
  }, children);
}

// ---------------------------------------------------------------------------
// ResizableHandle
// ---------------------------------------------------------------------------

interface ResizableHandleProps {
  className?: string;
  direction?: 'horizontal' | 'vertical';
  withHandle?: boolean;
  onDragStart?: () => void;
}

export function ResizableHandle({ className, direction = 'horizontal', withHandle = true, onDragStart }: ResizableHandleProps) {
  const isHorizontal = direction === 'horizontal';

  return createElement('div', {
    'data-slot': 'resizable-handle',
    role: 'separator',
    onmousedown: onDragStart,
    className: cn(
      'relative flex items-center justify-center bg-border',
      'after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
      isHorizontal ? 'w-px cursor-col-resize' : 'h-px cursor-row-resize',
      className,
    ),
  },
    withHandle
      ? createElement('div', {
          className: cn(
            'z-10 flex items-center justify-center rounded-sm border bg-border',
            isHorizontal ? 'h-4 w-3' : 'h-3 w-4',
          ),
        },
          createElement('svg', {
            className: cn('size-2.5', !isHorizontal && 'rotate-90'),
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
          },
            createElement('circle', { cx: '9', cy: '12', r: '1', fill: 'currentColor' }),
            createElement('circle', { cx: '15', cy: '12', r: '1', fill: 'currentColor' }),
          ),
        )
      : null,
  );
}
