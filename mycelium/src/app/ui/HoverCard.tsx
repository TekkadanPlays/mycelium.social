import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// HoverCard
//
// Shows a rich content card on hover. No portals in InfernoJS, so the card
// is positioned relative to the trigger wrapper.
// ---------------------------------------------------------------------------

interface HoverCardProps {
  className?: string;
  onMouseEnter?: (e: Event) => void;
  onMouseLeave?: (e: Event) => void;
  children?: any;
}

export function HoverCard({ className, onMouseEnter, onMouseLeave, children }: HoverCardProps) {
  return createElement('div', {
    'data-slot': 'hover-card',
    onMouseEnter,
    onMouseLeave,
    className: cn('relative inline-block', className),
  }, children);
}

// ---------------------------------------------------------------------------
// HoverCardTrigger
// ---------------------------------------------------------------------------

interface HoverCardTriggerProps {
  className?: string;
  children?: any;
}

export function HoverCardTrigger({ className, children }: HoverCardTriggerProps) {
  return createElement('div', {
    'data-slot': 'hover-card-trigger',
    className: cn(className),
  }, children);
}

// ---------------------------------------------------------------------------
// HoverCardContent
// ---------------------------------------------------------------------------

interface HoverCardContentProps {
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom';
  open?: boolean;
  children?: any;
}

export function HoverCardContent(props: HoverCardContentProps) {
  const { className, align = 'center', side = 'bottom', open, children } = props;
  if (!open) return null;

  const alignClasses: Record<string, string> = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  const sideClasses: Record<string, string> = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
  };

  return createElement('div', {
    'data-slot': 'hover-card-content',
    className: cn(
      'absolute z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
      alignClasses[align],
      sideClasses[side],
      className,
    ),
  }, children);
}

// ---------------------------------------------------------------------------
// HoverCardWrapper — stateful wrapper that manages hover open/close with delay
// ---------------------------------------------------------------------------

interface HoverCardWrapperProps {
  className?: string;
  openDelay?: number;
  closeDelay?: number;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom';
  trigger: any;
  children?: any;
}

interface HoverCardWrapperState {
  open: boolean;
}

export class HoverCardWrapper extends Component<HoverCardWrapperProps, HoverCardWrapperState> {
  declare state: HoverCardWrapperState;
  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: HoverCardWrapperProps) {
    super(props);
    this.state = { open: false };
  }

  componentWillUnmount() {
    if (this.openTimer) clearTimeout(this.openTimer);
    if (this.closeTimer) clearTimeout(this.closeTimer);
  }

  private handleMouseEnter = () => {
    if (this.closeTimer) { clearTimeout(this.closeTimer); this.closeTimer = null; }
    this.openTimer = setTimeout(() => {
      this.setState({ open: true });
    }, this.props.openDelay ?? 200);
  };

  private handleMouseLeave = () => {
    if (this.openTimer) { clearTimeout(this.openTimer); this.openTimer = null; }
    this.closeTimer = setTimeout(() => {
      this.setState({ open: false });
    }, this.props.closeDelay ?? 300);
  };

  render() {
    const { className, align, side, trigger, children } = this.props;
    const { open } = this.state;

    return createElement(HoverCard, {
      className,
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
    },
      createElement(HoverCardTrigger, null, trigger),
      createElement(HoverCardContent, { open, align, side }, children),
    );
  }
}
