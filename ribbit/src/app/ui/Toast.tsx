import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Toast system
//
// Imperative API: call toast() to show a notification. The Toaster component
// renders the toast stack. No React context needed — uses a simple pub/sub.
// ---------------------------------------------------------------------------

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

type ToastListener = (toasts: ToastData[]) => void;

let toasts: ToastData[] = [];
let listeners: ToastListener[] = [];
let nextId = 0;

function notify() {
  listeners.forEach((fn) => fn([...toasts]));
}

export function toast(data: Omit<ToastData, 'id'>) {
  const id = `toast-${++nextId}`;
  const entry: ToastData = { id, duration: 4000, variant: 'default', ...data };
  toasts = [...toasts, entry];
  notify();

  setTimeout(() => {
    dismissToast(id);
  }, entry.duration);

  return id;
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

function subscribeToasts(fn: ToastListener): () => void {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

// ---------------------------------------------------------------------------
// Toast visual
// ---------------------------------------------------------------------------

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        destructive: 'bg-destructive text-white border-destructive group',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface ToastItemProps {
  data: ToastData;
  onDismiss: (id: string) => void;
}

function ToastItem({ data, onDismiss }: ToastItemProps) {
  return createElement('div', {
    'data-slot': 'toast',
    role: 'alert',
    className: cn(toastVariants({ variant: data.variant })),
  },
    createElement('div', { className: 'grid gap-1' },
      data.title
        ? createElement('div', {
            'data-slot': 'toast-title',
            className: 'text-sm font-semibold',
          }, data.title)
        : null,
      data.description
        ? createElement('div', {
            'data-slot': 'toast-description',
            className: 'text-sm opacity-90',
          }, data.description)
        : null,
    ),
    createElement('button', {
      'data-slot': 'toast-close',
      type: 'button',
      onClick: () => onDismiss(data.id),
      className: cn(
        'absolute top-2 right-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100',
        'outline-none focus-visible:opacity-100 focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'hover:text-foreground',
      ),
      'aria-label': 'Dismiss',
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
        createElement('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
        createElement('line', { x1: '6', y1: '6', x2: '18', y2: '18' }),
      ),
    ),
  );
}

// ---------------------------------------------------------------------------
// Toaster — mount once at root level
// ---------------------------------------------------------------------------

interface ToasterState {
  toasts: ToastData[];
}

export class Toaster extends Component<{}, ToasterState> {
  declare state: ToasterState;
  private unsub: (() => void) | null = null;

  constructor(props: {}) {
    super(props);
    this.state = { toasts: [] };
  }

  componentDidMount() {
    this.unsub = subscribeToasts((toasts) => this.setState({ toasts }));
  }

  componentWillUnmount() {
    this.unsub?.();
  }

  render() {
    const { toasts } = this.state;
    if (toasts.length === 0) return null;

    const maxVisible = 3;
    const visible = toasts.slice(-maxVisible);
    const hiddenCount = toasts.length - visible.length;

    return createElement('div', {
      'data-slot': 'toaster',
      className: 'fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none',
    },
      hiddenCount > 0
        ? createElement('div', {
            className: 'text-center text-xs text-muted-foreground py-1',
          }, `+${hiddenCount} more`)
        : null,
      ...visible.map((t) =>
        createElement(ToastItem, {
          key: t.id,
          data: t,
          onDismiss: dismissToast,
        }),
      ),
    );
  }
}
