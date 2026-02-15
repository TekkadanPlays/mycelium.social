import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';
import { getBaseTheme, setBaseTheme, subscribeTheme, type BaseTheme } from '../store/theme';

// ---------------------------------------------------------------------------
// ThemePicker — lets users choose a base color theme
// ---------------------------------------------------------------------------

const THEMES: { id: BaseTheme; label: string; swatch: string }[] = [
  { id: 'neutral', label: 'Neutral', swatch: 'bg-[oklch(0.205_0_0)]' },
  { id: 'zinc', label: 'Zinc', swatch: 'bg-[oklch(0.21_0.006_285.885)]' },
  { id: 'slate', label: 'Slate', swatch: 'bg-[oklch(0.208_0.042_265.755)]' },
  { id: 'stone', label: 'Stone', swatch: 'bg-[oklch(0.216_0.006_56.043)]' },
  { id: 'gray', label: 'Gray', swatch: 'bg-[oklch(0.21_0.034_264.665)]' },
  { id: 'ribbit', label: 'Ribbit', swatch: 'bg-[oklch(0.45_0.10_150)]' },
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

  render() {
    const { className } = this.props;
    const { active } = this.state;

    return createElement('div', {
      'data-slot': 'theme-picker',
      className: cn('flex flex-wrap gap-2', className),
    },
      ...THEMES.map((t) =>
        createElement('button', {
          key: t.id,
          type: 'button',
          onClick: () => setBaseTheme(t.id),
          className: cn(
            'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium cursor-pointer transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            active === t.id && 'border-primary bg-primary/5',
            active !== t.id && 'border-input',
          ),
        },
          createElement('span', {
            className: cn('size-4 rounded-full border border-border shrink-0', t.swatch),
          }),
          t.label,
          active === t.id
            ? createElement('svg', {
                className: 'size-3.5 ml-auto text-primary',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                'stroke-width': '3',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
              }, createElement('path', { d: 'M20 6L9 17l-5-5' }))
            : null,
        ),
      ),
    );
  }
}
