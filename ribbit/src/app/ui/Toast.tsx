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
const TOAST_WIDTH = 356;
const VIEWPORT_OFFSET = 32;

export type ToastType = 'default' | 'success' | 'error' | 'info' | 'warning' | 'loading';
export type ToasterPosition = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';

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
  position?: ToasterPosition;
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
      this.toasts = this.toasts.filter((t) => t.id !== id);
      this.publish({ id, dismiss: true });
    } else {
      this.toasts.forEach((t) => this.publish({ id: t.id, dismiss: true }));
      this.toasts = [];
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
  position?: ToasterPosition;
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
// Type icons (SVG) — wrapped in a 16×16 flex container matching real Sonner
// ---------------------------------------------------------------------------

function ToastIcon({ type }: { type: ToastType }) {
  if (type === 'default') return null;

  const svgBase = {
    className: 'size-4',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  };

  let icon: any = null;

  if (type === 'loading') {
    icon = createElement('svg', { ...svgBase, className: 'size-4 animate-spin' },
      createElement('path', { d: 'M21 12a9 9 0 1 1-6.219-8.56' }),
    );
  } else if (type === 'success') {
    icon = createElement('svg', svgBase,
      createElement('circle', { cx: '12', cy: '12', r: '10' }),
      createElement('path', { d: 'm9 12 2 2 4-4' }),
    );
  } else if (type === 'error') {
    icon = createElement('svg', svgBase,
      createElement('path', { d: 'M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z' }),
      createElement('path', { d: 'm15 9-6 6' }),
      createElement('path', { d: 'm9 9 6 6' }),
    );
  } else if (type === 'info') {
    icon = createElement('svg', svgBase,
      createElement('circle', { cx: '12', cy: '12', r: '10' }),
      createElement('path', { d: 'M12 16v-4' }),
      createElement('path', { d: 'M12 8h.01' }),
    );
  } else if (type === 'warning') {
    icon = createElement('svg', svgBase,
      createElement('path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3' }),
      createElement('path', { d: 'M12 9v4' }),
      createElement('path', { d: 'M12 17h.01' }),
    );
  }

  if (!icon) return null;

  // Wrapper matches real Sonner's [data-icon] container: 16×16 flex, shrink-0
  return createElement('div', {
    className: 'flex items-center justify-center shrink-0',
    style: { width: '16px', height: '16px' },
  }, icon);
}

// ---------------------------------------------------------------------------
// ToastItem — individual toast with height measurement and timer management
//
// Matches real Sonner's Toast component architecture:
// - isFront/isVisible derived from `index` (toast array position)
// - heightIndex only used for offset calculation (updates faster than array)
// - Timer controlled by expanded/interacting props from Toaster (not per-toast mouse)
// - Height registered on mount, cleaned up in deleteToast + unmount safety net
// - --toasts-before and --z-index use `index` and `toasts.length`
// ---------------------------------------------------------------------------

interface ToastItemProps {
  data: ToastT;
  index: number;
  toasts: ToastT[];
  expanded: boolean;
  interacting: boolean;
  heights: Array<{ toastId: string | number; height: number; position?: string }>;
  position: string;
  gap: number;
  removeToast: (t: ToastT) => void;
  setHeights: (fn: (h: Array<{ toastId: string | number; height: number; position?: string }>) => Array<{ toastId: string | number; height: number; position?: string }>) => void;
}

interface ToastItemState {
  mounted: boolean;
  initialHeight: number;
}

class ToastItem extends Component<ToastItemProps, ToastItemState> {
  declare state: ToastItemState;
  private toastRef: HTMLLIElement | null = null;
  private closeTimerStartRef = 0;
  private lastCloseTimerStartRef = 0;
  private remainingTime: number;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private deleted = false;

  constructor(props: ToastItemProps) {
    super(props);
    this.remainingTime = props.data.duration ?? TOAST_LIFETIME;
    this.state = { mounted: false, initialHeight: 0 };
  }

  componentDidMount() {
    // Trigger enter animation (matches real Sonner: setMounted(true) in useEffect([]))
    requestAnimationFrame(() => this.setState({ mounted: true }));

    // Register height (matches real Sonner: setHeights in useEffect with cleanup)
    if (this.toastRef) {
      const h = this.toastRef.getBoundingClientRect().height;
      this.setState({ initialHeight: h });
      this.props.setHeights((prev) => [{ toastId: this.props.data.id, height: h, position: this.props.data.position || this.props.position }, ...prev]);
    }

    // Start timer if not paused
    this.syncTimer();
  }

  componentDidUpdate(prevProps: ToastItemProps) {
    // Re-measure height if content changed
    if (prevProps.data.title !== this.props.data.title || prevProps.data.description !== this.props.data.description) {
      if (this.toastRef) {
        const h = this.toastRef.getBoundingClientRect().height;
        this.setState({ initialHeight: h });
        this.props.setHeights((prev) => {
          const exists = prev.find((x) => x.toastId === this.props.data.id);
          if (exists) return prev.map((x) => x.toastId === this.props.data.id ? { ...x, height: h } : x);
          return [{ toastId: this.props.data.id, height: h, position: this.props.data.position || this.props.position }, ...prev];
        });
      }
    }

    // Handle delete flag from Observer.dismiss()
    if (this.props.data.delete && !prevProps.data.delete && !this.deleted) {
      this.deleteToast();
    }

    // Sync timer when expanded or interacting changes
    if (prevProps.expanded !== this.props.expanded || prevProps.interacting !== this.props.interacting) {
      this.syncTimer();
    }

    // If type changed from loading, reset remaining time and sync
    if (prevProps.data.type === 'loading' && this.props.data.type !== 'loading') {
      this.remainingTime = this.props.data.duration ?? TOAST_LIFETIME;
      this.syncTimer();
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  private syncTimer() {
    if (this.deleted) return;
    if (this.props.data.type === 'loading' || this.props.data.duration === Infinity) return;
    if (this.remainingTime === Infinity) return;

    if (this.props.expanded || this.props.interacting) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  private startTimer() {
    if (this.deleted) return;
    if (this.remainingTime <= 0) return;

    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.closeTimerStartRef = Date.now();
    this.timeoutId = setTimeout(() => this.deleteToast(), this.remainingTime);
  }

  private pauseTimer() {
    if (this.timeoutId) { clearTimeout(this.timeoutId); this.timeoutId = null; }
    if (this.lastCloseTimerStartRef < this.closeTimerStartRef) {
      const elapsed = Date.now() - this.closeTimerStartRef;
      this.remainingTime = Math.max(0, this.remainingTime - elapsed);
    }
    this.lastCloseTimerStartRef = Date.now();
  }

  private deleteToast() {
    if (this.deleted) return;
    this.deleted = true;

    if (this.timeoutId) { clearTimeout(this.timeoutId); this.timeoutId = null; }

    // Single atomic call: removeToast removes both the toast and its height
    // in one setState to prevent intermediate renders with stale data.
    this.props.removeToast(this.props.data);
  }

  render() {
    const { data, index, toasts, expanded, heights, position, gap } = this.props;
    const { mounted, initialHeight } = this.state;
    const [yPos, xPos] = position.split('-');

    const isFront = index === 0;
    const isVisible = index + 1 <= VISIBLE_TOASTS;

    const heightIdx = heights.findIndex((h) => h.toastId === data.id);
    const toastsHeightBefore = heights.reduce((prev, curr, i) => i >= heightIdx ? prev : prev + curr.height, 0);
    const offset = heightIdx >= 0 ? heightIdx * gap + toastsHeightBefore : 0;

    return createElement('li', {
      ref: (el: HTMLLIElement | null) => { this.toastRef = el; },
      'data-sonner-toast': '',
      'data-mounted': mounted,
      'data-visible': isVisible,
      'data-front': isFront,
      'data-expanded': Boolean(expanded),
      'data-type': data.type,
      'data-y-position': yPos,
      'data-x-position': xPos,
      role: 'alert',
      tabIndex: 0,
      className: 'group',
      style: {
        '--index': index,
        '--toasts-before': index,
        '--z-index': toasts.length - index,
        '--offset': `${offset}px`,
        '--initial-height': `${initialHeight}px`,
      } as any,
    },
      createElement('div', {
        className: cn(
          'relative flex w-full items-center gap-2 overflow-hidden rounded-xl border p-4 shadow-lg',
        ),
        style: {
          background: 'var(--popover)',
          color: 'var(--popover-foreground)',
          borderColor: 'var(--border)',
          fontSize: '13px',
        },
      },
        // Icon
        createElement(ToastIcon, { type: data.type }),

        // Content
        createElement('div', { className: 'flex flex-col gap-0.5 flex-1 min-w-0' },
          data.title
            ? createElement('div', { className: 'font-medium leading-snug' }, data.title)
            : null,
          data.description
            ? createElement('div', { className: 'text-muted-foreground leading-snug', style: { fontSize: '12px' } }, data.description)
            : null,
          (data.action || data.cancel)
            ? createElement('div', { className: 'flex items-center gap-2 mt-1.5' },
                data.action
                  ? createElement('button', {
                      type: 'button',
                      onClick: () => { data.action!.onClick(); this.deleteToast(); },
                      className: 'inline-flex items-center justify-center rounded-md text-xs font-medium h-6 px-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors',
                    }, data.action.label)
                  : null,
                data.cancel
                  ? createElement('button', {
                      type: 'button',
                      onClick: () => { data.cancel!.onClick(); this.deleteToast(); },
                      className: 'inline-flex items-center justify-center rounded-md text-xs font-medium h-6 px-2 border hover:bg-accent transition-colors',
                      style: { borderColor: 'var(--border)', background: 'var(--popover)' },
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
                'absolute top-1.5 right-1.5 rounded-full p-0.5 opacity-0 transition-opacity group-hover:opacity-100',
                'outline-none focus-visible:opacity-100 focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'hover:text-foreground text-muted-foreground/60',
              ),
              'aria-label': 'Dismiss',
            },
              createElement('svg', {
                className: 'size-3.5',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                'stroke-width': '2.5',
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
//
// Matches real Sonner's Toaster architecture:
// - expanded state managed here, flows down as prop
// - interacting state (pointerDown/Up) prevents onMouseLeave from collapsing
// - expanded resets to false when toasts.length <= 1
// - heights managed via functional setHeights passed to ToastItem
// - --front-toast-height uses heights[0] (newest = front)
// ---------------------------------------------------------------------------

type HeightEntry = { toastId: string | number; height: number; position?: string };

interface ToasterProps {
  position?: ToasterPosition;
}

interface ToasterState {
  toasts: ToastT[];
  heights: HeightEntry[];
  expanded: boolean;
  interacting: boolean;
}

export class Toaster extends Component<ToasterProps, ToasterState> {
  declare state: ToasterState;
  private unsub: (() => void) | null = null;

  constructor(props: ToasterProps) {
    super(props);
    this.state = { toasts: [], heights: [], expanded: false, interacting: false };
  }

  componentDidMount() {
    this.unsub = ToastState.subscribe((incoming) => {
      if ('dismiss' in incoming && incoming.dismiss) {
        this.setState((s) => ({
          toasts: s.toasts.map((t) => t.id === incoming.id ? { ...t, delete: true } : t),
        }));
        return;
      }

      const toast = incoming as ToastT;
      this.setState((s) => {
        const idx = s.toasts.findIndex((t) => t.id === toast.id);
        if (idx !== -1) {
          const updated = [...s.toasts];
          updated[idx] = { ...updated[idx], ...toast };
          return { toasts: updated };
        }
        return { toasts: [toast, ...s.toasts] };
      });
    });
  }

  componentDidUpdate(_prevProps: ToasterProps, prevState: ToasterState) {
    // Reset expanded when 0 or 1 toast left (matches real Sonner)
    if (this.state.toasts.length <= 1 && prevState.toasts.length > 1) {
      this.setState({ expanded: false });
    }
  }

  componentWillUnmount() {
    this.unsub?.();
  }

  private removeToast = (toastToRemove: ToastT) => {
    // Atomic: remove toast AND its height in a single setState to prevent
    // intermediate renders where toasts and heights are out of sync.
    this.setState((s) => {
      const existing = s.toasts.find((t) => t.id === toastToRemove.id);
      if (existing && !existing.delete) {
        ToastState.toasts = ToastState.toasts.filter((t) => t.id !== toastToRemove.id);
      }
      return {
        toasts: s.toasts.filter((t) => t.id !== toastToRemove.id),
        heights: s.heights.filter((h) => h.toastId !== toastToRemove.id),
      };
    });
  };

  // Functional setHeights — passed to ToastItem so it can do functional updates
  // (matches real Sonner's setHeights pattern)
  private setHeights = (fn: (prev: HeightEntry[]) => HeightEntry[]) => {
    this.setState((s) => ({ heights: fn(s.heights) }));
  };

  render() {
    const { toasts, heights, expanded, interacting } = this.state;
    const defaultPosition = this.props.position || 'top-center';

    // Collect all unique positions (default + any per-toast overrides)
    const positionSet = new Set<string>([defaultPosition]);
    toasts.forEach((t) => { if (t.position) positionSet.add(t.position); });
    const positions = Array.from(positionSet);

    return createElement('section', {
      'aria-label': 'Notifications',
      tabIndex: -1,
      'aria-live': 'polite',
      'aria-atomic': 'false',
    },
      ...positions.map((pos, posIdx) => {
        const [y, x] = pos.split('-');
        // Filter toasts for this position group (matches real Sonner line 849)
        const groupToasts = toasts.filter((t) =>
          (!t.position && posIdx === 0) || t.position === pos,
        );
        const groupHeights = heights.filter((h) =>
          (!h.position && posIdx === 0) || h.position === pos,
        );

        if (groupToasts.length === 0) return null;

        // --front-toast-height uses heights[0] (matches real Sonner line 803)
        const frontHeight = groupHeights[0]?.height || 0;

        return createElement('ol', {
          key: pos,
          'data-sonner-toaster': '',
          'data-y-position': y,
          'data-x-position': x,
          style: {
            '--front-toast-height': `${frontHeight}px`,
            '--width': `${TOAST_WIDTH}px`,
            '--gap': `${GAP}px`,
            '--offset-top': `${VIEWPORT_OFFSET}px`,
            '--offset-bottom': `${VIEWPORT_OFFSET}px`,
            '--offset-left': `${VIEWPORT_OFFSET}px`,
            '--offset-right': `${VIEWPORT_OFFSET}px`,
          } as any,
          onMouseEnter: () => this.setState({ expanded: true }),
          onMouseMove: () => this.setState({ expanded: true }),
          onMouseLeave: () => {
            if (!interacting) this.setState({ expanded: false });
          },
          onPointerDown: () => this.setState({ interacting: true }),
          onPointerUp: () => this.setState({ interacting: false }),
        },
          ...groupToasts.map((t, index) =>
            createElement(ToastItem, {
              key: t.id,
              data: t,
              index,
              toasts: groupToasts,
              expanded,
              interacting,
              heights: groupHeights,
              position: pos,
              gap: GAP,
              removeToast: this.removeToast,
              setHeights: this.setHeights,
            }),
          ),
        );
      }),
    );
  }
}
