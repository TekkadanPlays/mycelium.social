import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Sonner-style toast system
//
// Imperative API modeled after sonner by Emil Kowalski.
// Supports: default, success, error, info, warning, action buttons,
// descriptions, promise toasts, configurable position, and elegant stacking.
// ---------------------------------------------------------------------------

export type ToastType = 'default' | 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastData {
  id: string;
  type: ToastType;
  title?: string;
  description?: string;
  action?: ToastAction;
  cancel?: ToastAction;
  duration: number;
  dismissing?: boolean;
}

type ToastListener = (toasts: ToastData[]) => void;

let toasts: ToastData[] = [];
let listeners: ToastListener[] = [];
let nextId = 0;

function notify() {
  listeners.forEach((fn) => fn([...toasts]));
}

interface ToastOptions {
  description?: string;
  action?: ToastAction;
  cancel?: ToastAction;
  duration?: number;
}

function createToast(type: ToastType, title: string, opts: ToastOptions = {}): string {
  const id = `toast-${++nextId}`;
  const entry: ToastData = {
    id,
    type,
    title,
    description: opts.description,
    action: opts.action,
    cancel: opts.cancel,
    duration: opts.duration ?? 4000,
  };
  toasts = [...toasts, entry];
  notify();

  if (entry.duration > 0) {
    setTimeout(() => dismissToast(id), entry.duration);
  }

  return id;
}

export function toast(title: string, opts?: ToastOptions): string {
  return createToast('default', title, opts);
}

toast.success = (title: string, opts?: ToastOptions) => createToast('success', title, opts);
toast.error = (title: string, opts?: ToastOptions) => createToast('error', title, opts);
toast.info = (title: string, opts?: ToastOptions) => createToast('info', title, opts);
toast.warning = (title: string, opts?: ToastOptions) => createToast('warning', title, opts);

toast.promise = <T,>(
  promise: Promise<T>,
  msgs: { loading: string; success: string; error: string },
): Promise<T> => {
  const id = createToast('default', msgs.loading, { duration: 0 });
  promise
    .then(() => {
      toasts = toasts.map((t) => t.id === id ? { ...t, type: 'success', title: msgs.success, duration: 4000 } : t);
      notify();
      setTimeout(() => dismissToast(id), 4000);
    })
    .catch(() => {
      toasts = toasts.map((t) => t.id === id ? { ...t, type: 'error', title: msgs.error, duration: 4000 } : t);
      notify();
      setTimeout(() => dismissToast(id), 4000);
    });
  return promise;
};

export function dismissToast(id: string) {
  toasts = toasts.map((t) => t.id === id ? { ...t, dismissing: true } : t);
  notify();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, 300);
}

function subscribeToasts(fn: ToastListener): () => void {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

// ---------------------------------------------------------------------------
// Type icons
// ---------------------------------------------------------------------------

function ToastIcon({ type }: { type: ToastType }) {
  if (type === 'default') return null;

  const iconMap: Record<string, { path: string; color: string }> = {
    success: {
      path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-green-500',
    },
    error: {
      path: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-red-500',
    },
    info: {
      path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-blue-500',
    },
    warning: {
      path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
      color: 'text-yellow-500',
    },
  };

  const icon = iconMap[type];
  if (!icon) return null;

  return createElement('svg', {
    className: cn('size-5 shrink-0', icon.color),
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  },
    createElement('path', { d: icon.path }),
  );
}

// ---------------------------------------------------------------------------
// Toast visual
// ---------------------------------------------------------------------------

interface ToastItemProps {
  data: ToastData;
  onDismiss: (id: string) => void;
}

function ToastItem({ data, onDismiss }: ToastItemProps) {
  return createElement('div', {
    'data-slot': 'toast',
    'data-type': data.type,
    role: 'alert',
    className: cn(
      'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border bg-background text-foreground border-border p-4 shadow-lg',
      data.dismissing && 'animate-out fade-out-0 slide-out-to-top-full',
    ),
  },
    // Icon
    createElement(ToastIcon, { type: data.type }),

    // Content
    createElement('div', { className: 'flex-1 grid gap-1' },
      data.title
        ? createElement('div', {
            'data-slot': 'toast-title',
            className: 'text-sm font-semibold',
          }, data.title)
        : null,
      data.description
        ? createElement('div', {
            'data-slot': 'toast-description',
            className: 'text-sm text-muted-foreground',
          }, data.description)
        : null,
      // Action / Cancel buttons
      (data.action || data.cancel)
        ? createElement('div', { className: 'flex items-center gap-2 mt-2' },
            data.action
              ? createElement('button', {
                  type: 'button',
                  onClick: () => { data.action!.onClick(); onDismiss(data.id); },
                  className: 'inline-flex items-center justify-center rounded-md text-xs font-medium h-7 px-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors',
                }, data.action.label)
              : null,
            data.cancel
              ? createElement('button', {
                  type: 'button',
                  onClick: () => { data.cancel!.onClick(); onDismiss(data.id); },
                  className: 'inline-flex items-center justify-center rounded-md text-xs font-medium h-7 px-3 border border-border bg-background hover:bg-accent transition-colors',
                }, data.cancel.label)
              : null,
          )
        : null,
    ),

    // Close button
    createElement('button', {
      'data-slot': 'toast-close',
      type: 'button',
      onClick: () => onDismiss(data.id),
      className: cn(
        'absolute top-2 right-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100',
        'outline-none focus-visible:opacity-100 focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'hover:text-foreground text-muted-foreground',
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

export type ToasterPosition = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';

interface ToasterProps {
  position?: ToasterPosition;
}

interface ToasterState {
  toasts: ToastData[];
}

const positionClasses: Record<ToasterPosition, string> = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export class Toaster extends Component<ToasterProps, ToasterState> {
  declare state: ToasterState;
  private unsub: (() => void) | null = null;

  constructor(props: ToasterProps) {
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
    const position = this.props.position || 'top-center';
    const isTop = position.startsWith('top');

    if (toasts.length === 0) return null;

    const maxVisible = 5;
    const visible = isTop ? toasts.slice(-maxVisible).reverse() : toasts.slice(-maxVisible);
    const count = visible.length;

    return createElement('div', {
      'data-slot': 'toaster',
      className: cn(
        'fixed z-[100] w-full max-w-sm pointer-events-none',
        positionClasses[position],
      ),
    },
      createElement('div', {
        className: 'relative',
        style: { height: count > 0 ? `${64 + (count - 1) * 14}px` : '0px' },
      },
        ...visible.map((t, i) => {
          const fromFront = count - 1 - i;
          const scale = 1 - fromFront * 0.04;
          const translateY = isTop ? fromFront * 10 : fromFront * -10;
          const opacity = 1 - fromFront * 0.12;

          return createElement('div', {
            key: t.id,
            className: cn(
              'absolute left-0 right-0 transition-all duration-300 ease-out',
              isTop ? 'top-0' : 'bottom-0',
            ),
            style: {
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity: Math.max(0.4, opacity),
              zIndex: isTop ? (count - fromFront) : i,
            },
          },
            createElement(ToastItem, {
              data: t,
              onDismiss: dismissToast,
            }),
          );
        }),
      ),
    );
  }
}
