import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Sonner-style toast system for Inferno
//
// Architecture modeled after sonner by Emil Kowalski.
// Uses an Observer singleton that publishes individual toast events.
// The Toaster component manages its own array and handles enter/exit
// animations via CSS transforms and data attributes — never returns null
// to prevent mount/unmount flicker during navigation.
// ---------------------------------------------------------------------------

const TOAST_LIFETIME = 4000;
const VISIBLE_TOASTS = 3;
const GAP = 14;
const TIME_BEFORE_UNMOUNT = 200;
const TOAST_WIDTH = 356;
const VIEWPORT_OFFSET = 24;

export type ToastType = 'default' | 'success' | 'error' | 'info' | 'warning' | 'loading';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastT {
  id: string | number;
  type: ToastType;
  title?: string;
  description?: string;
  action?: ToastAction;
  cancel?: ToastAction;
  duration?: number;
  delete?: boolean;
  dismissible?: boolean;
}

interface ToastToDismiss {
  id: string | number;
  dismiss: true;
}

// ---------------------------------------------------------------------------
// Observer — singleton state manager (matches real Sonner architecture)
// ---------------------------------------------------------------------------

let toastsCounter = 1;

class Observer {
  subscribers: Array<(toast: ToastT | ToastToDismiss) => void> = [];
  toasts: Array<ToastT> = [];
  dismissedToasts: Set<string | number> = new Set();

  subscribe = (subscriber: (toast: ToastT | ToastToDismiss) => void) => {
    this.subscribers.push(subscriber);
    return () => {
      const idx = this.subscribers.indexOf(subscriber);
      if (idx > -1) this.subscribers.splice(idx, 1);
    };
  };

  publish = (data: ToastT | ToastToDismiss) => {
    this.subscribers.forEach((sub) => sub(data));
  };

  addToast = (data: ToastT) => {
    this.publish(data);
    this.toasts = [...this.toasts, data];
  };

  create = (data: Partial<ToastT> & { message?: string; type?: ToastType }): string | number => {
    const { message, ...rest } = data;
    const id = data.id ?? toastsCounter++;
    const alreadyExists = this.toasts.find((t) => t.id === id);
    const dismissible = data.dismissible ?? true;

    if (this.dismissedToasts.has(id)) {
      this.dismissedToasts.delete(id);
    }

    if (alreadyExists) {
      this.toasts = this.toasts.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...rest, id, dismissible, title: message ?? t.title };
          this.publish(updated);
          return updated;
        }
        return t;
      });
    } else {
      this.addToast({ title: message, ...rest, dismissible, id, type: rest.type || 'default' } as ToastT);
    }

    return id;
  };

  dismiss = (id?: string | number) => {
    if (id) {
      this.dismissedToasts.add(id);
      requestAnimationFrame(() => this.publish({ id, dismiss: true }));
    } else {
      this.toasts.forEach((t) => {
        this.publish({ id: t.id, dismiss: true });
      });
    }
    return id;
  };

  message = (message: string, data?: Partial<ToastT>) => this.create({ ...data, message });
  success = (message: string, data?: Partial<ToastT>) => this.create({ ...data, message, type: 'success' });
  error = (message: string, data?: Partial<ToastT>) => this.create({ ...data, message, type: 'error' });
  info = (message: string, data?: Partial<ToastT>) => this.create({ ...data, message, type: 'info' });
  warning = (message: string, data?: Partial<ToastT>) => this.create({ ...data, message, type: 'warning' });
  loading = (message: string, data?: Partial<ToastT>) => this.create({ ...data, message, type: 'loading' });

  promise = <T,>(
    promise: Promise<T>,
    msgs: { loading: string; success: string; error: string },
  ): Promise<T> => {
    const id = this.create({ message: msgs.loading, type: 'loading', duration: Infinity });
    promise
      .then(() => {
        this.create({ id, message: msgs.success, type: 'success', duration: TOAST_LIFETIME });
      })
      .catch(() => {
        this.create({ id, message: msgs.error, type: 'error', duration: TOAST_LIFETIME });
      });
    return promise;
  };
}

const ToastState = new Observer();

// ---------------------------------------------------------------------------
// Public API — toast() function with method variants
// ---------------------------------------------------------------------------

interface ToastOptions {
  description?: string;
  action?: ToastAction;
  cancel?: ToastAction;
  duration?: number;
  id?: string | number;
}

function toastFn(title: string, opts?: ToastOptions): string | number {
  return ToastState.create({ message: title, ...opts });
}

export const toast = Object.assign(toastFn, {
  success: (title: string, opts?: ToastOptions) => ToastState.create({ ...opts, message: title, type: 'success' as ToastType }),
  error: (title: string, opts?: ToastOptions) => ToastState.create({ ...opts, message: title, type: 'error' as ToastType }),
  info: (title: string, opts?: ToastOptions) => ToastState.create({ ...opts, message: title, type: 'info' as ToastType }),
  warning: (title: string, opts?: ToastOptions) => ToastState.create({ ...opts, message: title, type: 'warning' as ToastType }),
  loading: (title: string, opts?: ToastOptions) => ToastState.create({ ...opts, message: title, type: 'loading' as ToastType }),
  dismiss: (id?: string | number) => ToastState.dismiss(id),
  promise: ToastState.promise,
});

export function dismissToast(id: string | number) {
  ToastState.dismiss(id);
}

// ---------------------------------------------------------------------------
// Type icons (SVG)
// ---------------------------------------------------------------------------

function ToastIcon({ type }: { type: ToastType }) {
  if (type === 'default') return null;

  if (type === 'loading') {
    return createElement('div', { className: 'size-5 shrink-0 relative' },
      createElement('svg', {
        className: 'size-5 animate-spin text-muted-foreground',
        viewBox: '0 0 24 24',
        fill: 'none',
      },
        createElement('circle', { cx: '12', cy: '12', r: '10', stroke: 'currentColor', 'stroke-width': '2', opacity: '0.25' }),
        createElement('path', { d: 'M4 12a8 8 0 018-8', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round' }),
      ),
    );
  }

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
// ToastItem — individual toast with height measurement and timer management
// ---------------------------------------------------------------------------

interface ToastItemProps {
  data: ToastT;
  index: number;
  expanded: boolean;
  front: boolean;
  visible: boolean;
  heights: Array<{ toastId: string | number; height: number }>;
  position: string;
  removeToast: (t: ToastT) => void;
  setHeight: (id: string | number, height: number) => void;
  removeHeight: (id: string | number) => void;
}

interface ToastItemState {
  mounted: boolean;
  removed: boolean;
  offsetBeforeRemove: number;
  initialHeight: number;
}

class ToastItem extends Component<ToastItemProps, ToastItemState> {
  declare state: ToastItemState;
  private toastRef: HTMLLIElement | null = null;
  private closeTimerStart = 0;
  private lastCloseTimerStart = 0;
  private remainingTime: number;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(props: ToastItemProps) {
    super(props);
    this.remainingTime = props.data.duration ?? TOAST_LIFETIME;
    this.state = { mounted: false, removed: false, offsetBeforeRemove: 0, initialHeight: 0 };
  }

  componentDidMount() {
    // Trigger enter animation on next frame
    requestAnimationFrame(() => this.setState({ mounted: true }));

    // Measure height
    if (this.toastRef) {
      const h = this.toastRef.getBoundingClientRect().height;
      this.setState({ initialHeight: h });
      this.props.setHeight(this.props.data.id, h);
    }

    this.startTimer();
  }

  componentDidUpdate(prevProps: ToastItemProps) {
    // Re-measure if content changed
    if (prevProps.data.title !== this.props.data.title || prevProps.data.description !== this.props.data.description) {
      if (this.toastRef) {
        const h = this.toastRef.getBoundingClientRect().height;
        this.setState({ initialHeight: h });
        this.props.setHeight(this.props.data.id, h);
      }
    }

    // Handle delete flag
    if (this.props.data.delete && !prevProps.data.delete) {
      this.deleteToast();
    }

    // Manage timer based on expanded/interaction state
    if (prevProps.expanded !== this.props.expanded) {
      if (this.props.expanded) {
        this.pauseTimer();
      } else {
        this.startTimer();
      }
    }

    // If type changed from loading, restart timer
    if (prevProps.data.type === 'loading' && this.props.data.type !== 'loading') {
      this.remainingTime = this.props.data.duration ?? TOAST_LIFETIME;
      this.startTimer();
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.props.removeHeight(this.props.data.id);
  }

  private startTimer() {
    if (this.props.data.type === 'loading') return;
    const dur = this.remainingTime;
    if (dur === Infinity || dur <= 0) return;

    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.closeTimerStart = Date.now();
    this.timeoutId = setTimeout(() => this.deleteToast(), dur);
  }

  private pauseTimer() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.lastCloseTimerStart < this.closeTimerStart) {
      const elapsed = Date.now() - this.closeTimerStart;
      this.remainingTime = Math.max(0, this.remainingTime - elapsed);
    }
    this.lastCloseTimerStart = Date.now();
  }

  private deleteToast() {
    this.setState({ removed: true, offsetBeforeRemove: this.getOffset() });
    this.props.removeHeight(this.props.data.id);
    if (this.timeoutId) clearTimeout(this.timeoutId);
    setTimeout(() => this.props.removeToast(this.props.data), TIME_BEFORE_UNMOUNT);
  }

  private getOffset(): number {
    const { heights, data } = this.props;
    const heightIdx = heights.findIndex((h) => h.toastId === data.id);
    if (heightIdx < 0) return 0;
    let offset = 0;
    for (let i = 0; i < heightIdx; i++) offset += heights[i].height;
    return heightIdx * GAP + offset;
  }

  render() {
    const { data, index, front, visible, expanded, heights, position } = this.props;
    const { mounted, removed, offsetBeforeRemove, initialHeight } = this.state;
    const isTop = position.startsWith('top');
    const heightIdx = heights.findIndex((h) => h.toastId === data.id);
    const toastsBeforeHeight = heights.slice(0, Math.max(0, heightIdx)).reduce((s, h) => s + h.height, 0);
    const offset = removed ? offsetBeforeRemove : (heightIdx >= 0 ? heightIdx * GAP + toastsBeforeHeight : 0);
    const lift = isTop ? 1 : -1;

    return createElement('li', {
      ref: (el: HTMLLIElement | null) => { this.toastRef = el; },
      'data-sonner-toast': '',
      'data-mounted': mounted,
      'data-removed': removed,
      'data-visible': visible,
      'data-front': front,
      'data-expanded': expanded,
      'data-type': data.type,
      'data-y-position': isTop ? 'top' : 'bottom',
      role: 'alert',
      tabIndex: 0,
      className: 'group',
      style: {
        '--index': index,
        '--toasts-before': index,
        '--z-index': 100 - index,
        '--offset': `${offset}px`,
        '--initial-height': `${initialHeight}px`,
      } as any,
      onMouseEnter: () => this.pauseTimer(),
      onMouseLeave: () => { if (!this.props.expanded) this.startTimer(); },
    },
      createElement('div', {
        className: cn(
          'pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border bg-background text-foreground border-border p-4 shadow-lg',
        ),
      },
        // Icon
        createElement(ToastIcon, { type: data.type }),

        // Content
        createElement('div', { className: 'flex-1 grid gap-1' },
          data.title
            ? createElement('div', { className: 'text-sm font-semibold' }, data.title)
            : null,
          data.description
            ? createElement('div', { className: 'text-sm text-muted-foreground' }, data.description)
            : null,
          (data.action || data.cancel)
            ? createElement('div', { className: 'flex items-center gap-2 mt-2' },
                data.action
                  ? createElement('button', {
                      type: 'button',
                      onClick: () => { data.action!.onClick(); this.deleteToast(); },
                      className: 'inline-flex items-center justify-center rounded-md text-xs font-medium h-7 px-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors',
                    }, data.action.label)
                  : null,
                data.cancel
                  ? createElement('button', {
                      type: 'button',
                      onClick: () => { data.cancel!.onClick(); this.deleteToast(); },
                      className: 'inline-flex items-center justify-center rounded-md text-xs font-medium h-7 px-3 border border-border bg-background hover:bg-accent transition-colors',
                    }, data.cancel.label)
                  : null,
              )
            : null,
        ),

        // Close button
        (data.dismissible !== false)
          ? createElement('button', {
              type: 'button',
              onClick: () => this.deleteToast(),
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
            )
          : null,
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Toaster — mount once at root level, NEVER returns null
// ---------------------------------------------------------------------------

export type ToasterPosition = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';

interface ToasterProps {
  position?: ToasterPosition;
}

interface ToasterState {
  toasts: ToastT[];
  heights: Array<{ toastId: string | number; height: number }>;
  expanded: boolean;
}

export class Toaster extends Component<ToasterProps, ToasterState> {
  declare state: ToasterState;
  private unsub: (() => void) | null = null;

  constructor(props: ToasterProps) {
    super(props);
    this.state = { toasts: [], heights: [], expanded: false };
  }

  componentDidMount() {
    this.unsub = ToastState.subscribe((incoming) => {
      if ('dismiss' in incoming && incoming.dismiss) {
        // Mark toast for deletion — triggers exit animation
        this.setState((s) => ({
          toasts: s.toasts.map((t) => t.id === incoming.id ? { ...t, delete: true } : t),
        }));
        return;
      }

      // Add or update toast
      const toast = incoming as ToastT;
      this.setState((s) => {
        const idx = s.toasts.findIndex((t) => t.id === toast.id);
        if (idx !== -1) {
          // Update existing
          const updated = [...s.toasts];
          updated[idx] = { ...updated[idx], ...toast };
          return { toasts: updated };
        }
        // Add new (prepend so newest is first / front)
        return { toasts: [toast, ...s.toasts] };
      });
    });
  }

  componentWillUnmount() {
    this.unsub?.();
  }

  private removeToast = (toastToRemove: ToastT) => {
    this.setState((s) => ({
      toasts: s.toasts.filter((t) => t.id !== toastToRemove.id),
    }));
  };

  private setHeight = (id: string | number, height: number) => {
    this.setState((s) => {
      const exists = s.heights.find((h) => h.toastId === id);
      if (exists) {
        return { heights: s.heights.map((h) => h.toastId === id ? { ...h, height } : h) };
      }
      return { heights: [{ toastId: id, height }, ...s.heights] };
    });
  };

  private removeHeight = (id: string | number) => {
    this.setState((s) => ({
      heights: s.heights.filter((h) => h.toastId !== id),
    }));
  };

  render() {
    const { toasts, heights, expanded } = this.state;
    const position = this.props.position || 'top-center';
    const [y, x] = position.split('-');

    // Always render the container — never return null
    return createElement('section', {
      'aria-label': 'Notifications',
      tabIndex: -1,
      'aria-live': 'polite',
      'aria-atomic': 'false',
    },
      createElement('ol', {
        'data-sonner-toaster': '',
        'data-y-position': y,
        'data-x-position': x,
        style: {
          '--front-toast-height': `${heights[0]?.height || 0}px`,
          '--width': `${TOAST_WIDTH}px`,
          '--gap': `${GAP}px`,
          '--offset-top': `${VIEWPORT_OFFSET}px`,
          '--offset-bottom': `${VIEWPORT_OFFSET}px`,
          '--offset-left': `${VIEWPORT_OFFSET}px`,
          '--offset-right': `${VIEWPORT_OFFSET}px`,
        } as any,
        onMouseEnter: () => this.setState({ expanded: true }),
        onMouseLeave: () => this.setState({ expanded: false }),
      },
        ...toasts.map((t, index) =>
          createElement(ToastItem, {
            key: t.id,
            data: t,
            index,
            front: index === 0,
            visible: index < VISIBLE_TOASTS,
            expanded,
            heights,
            position,
            removeToast: this.removeToast,
            setHeight: this.setHeight,
            removeHeight: this.removeHeight,
          }),
        ),
      ),
    );
  }
}
