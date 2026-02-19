import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';
import { getBaseTheme, setBaseTheme, subscribeTheme, type BaseTheme } from '../store/theme';

// ---------------------------------------------------------------------------
// ThemePicker — lets users choose a base color theme
// ---------------------------------------------------------------------------

interface ThemeEntry { id: BaseTheme; label: string; swatch: string }

const NEUTRALS: ThemeEntry[] = [
  { id: 'neutral', label: 'Neutral', swatch: 'bg-[oklch(0.205_0_0)]' },
  { id: 'stone', label: 'Stone', swatch: 'bg-[oklch(0.216_0.006_56)]' },
  { id: 'zinc', label: 'Zinc', swatch: 'bg-[oklch(0.21_0.006_286)]' },
  { id: 'gray', label: 'Gray', swatch: 'bg-[oklch(0.21_0.034_265)]' },
];

const COLORS: ThemeEntry[] = [
  { id: 'amber', label: 'Amber', swatch: 'bg-[oklch(0.67_0.16_58)]' },
  { id: 'blue', label: 'Blue', swatch: 'bg-[oklch(0.488_0.243_264)]' },
  { id: 'cyan', label: 'Cyan', swatch: 'bg-[oklch(0.61_0.11_222)]' },
  { id: 'emerald', label: 'Emerald', swatch: 'bg-[oklch(0.60_0.13_163)]' },
  { id: 'fuchsia', label: 'Fuchsia', swatch: 'bg-[oklch(0.59_0.26_323)]' },
  { id: 'green', label: 'Green', swatch: 'bg-[oklch(0.648_0.2_132)]' },
  { id: 'indigo', label: 'Indigo', swatch: 'bg-[oklch(0.51_0.23_277)]' },
  { id: 'lime', label: 'Lime', swatch: 'bg-[oklch(0.65_0.18_132)]' },
  { id: 'orange', label: 'Orange', swatch: 'bg-[oklch(0.646_0.222_41)]' },
  { id: 'pink', label: 'Pink', swatch: 'bg-[oklch(0.59_0.22_1)]' },
  { id: 'purple', label: 'Purple', swatch: 'bg-[oklch(0.56_0.25_302)]' },
  { id: 'red', label: 'Red', swatch: 'bg-[oklch(0.577_0.245_27)]' },
  { id: 'rose', label: 'Rose', swatch: 'bg-[oklch(0.586_0.253_18)]' },
  { id: 'sky', label: 'Sky', swatch: 'bg-[oklch(0.59_0.14_242)]' },
  { id: 'teal', label: 'Teal', swatch: 'bg-[oklch(0.60_0.10_185)]' },
  { id: 'violet', label: 'Violet', swatch: 'bg-[oklch(0.541_0.281_293)]' },
];

interface ThemePickerProps {
  className?: string;
}

interface ThemePickerState {
  active: BaseTheme;
}

export class ThemePicker extends Component<ThemePickerProps, ThemePickerState> {
  declare state: ThemePickerState;
  private unsub: (() => void) | null = null;

  constructor(props: ThemePickerProps) {
    super(props);
    this.state = { active: getBaseTheme() };
  }

  componentDidMount() {
    this.unsub = subscribeTheme(() => this.setState({ active: getBaseTheme() }));
  }

  componentWillUnmount() {
    this.unsub?.();
  }

  private renderSwatch(t: ThemeEntry, active: BaseTheme) {
    const isActive = active === t.id;
    return createElement('button', {
      key: t.id,
      type: 'button',
      title: t.label,
      onClick: () => setBaseTheme(t.id),
      className: cn(
        'relative size-8 rounded-full border-2 cursor-pointer transition-all',
        'outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'hover:scale-110',
        isActive ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-muted-foreground/30',
        t.swatch,
      ),
    },
      isActive
        ? createElement('svg', {
            className: 'absolute inset-0 m-auto size-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '3',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          }, createElement('path', { d: 'M20 6L9 17l-5-5' }))
        : null,
    );
  }

  render() {
    const { className } = this.props;
    const { active } = this.state;

    return createElement('div', {
      'data-slot': 'theme-picker',
      className: cn('space-y-4', className),
    },
      // Neutrals row
      createElement('div', null,
        createElement('p', { className: 'text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2' }, 'Neutrals'),
        createElement('div', { className: 'flex flex-wrap gap-2' },
          ...NEUTRALS.map((t) => this.renderSwatch(t, active)),
        ),
      ),
      // Colors grid
      createElement('div', null,
        createElement('p', { className: 'text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2' }, 'Colors'),
        createElement('div', { className: 'flex flex-wrap gap-2' },
          ...COLORS.map((t) => this.renderSwatch(t, active)),
        ),
      ),
    );
  }
}
