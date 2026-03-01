import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { RelayLink } from '../components/RelayLink';
import { getRelayState, subscribeRelay, addRelay, removeRelay } from '../store/relay';
import type { RelayStatus } from '../../nostr/relay';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface RelaySettingsState {
  statuses: Map<string, RelayStatus>;
  newUrl: string;
}

export class RelaySettings extends Component<{}, RelaySettingsState> {
  private unsub: (() => void) | null = null;
  declare state: RelaySettingsState;

  constructor(props: {}) {
    super(props);
    const rs = getRelayState();
    this.state = {
      statuses: rs.statuses,
      newUrl: '',
    };
  }

  componentDidMount() {
    this.unsub = subscribeRelay(() => {
      this.setState({ ...this.state, statuses: getRelayState().statuses });
    });
  }

  componentWillUnmount() {
    this.unsub?.();
  }

  handleAdd = () => {
    let url = this.state.newUrl.trim();
    if (!url) return;
    if (!url.startsWith('wss://') && !url.startsWith('ws://')) {
      url = 'wss://' + url;
    }
    addRelay(url);
    this.setState({ ...this.state, newUrl: '' });
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') this.handleAdd();
  };

  render() {
    const { statuses, newUrl } = this.state;
    const relays = Array.from(statuses.entries());

    return createElement('div', { className: 'space-y-4' },
      createElement(Link, {
        to: '/feed',
        className: 'inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2',
      }, '\u2190 Back to feed'),

      createElement('div', { className: 'flex items-center justify-between' },
        createElement('h1', { className: 'text-lg font-bold tracking-tight' }, 'Relay Settings'),
        createElement('span', { className: 'text-xs text-muted-foreground' }, `${relays.length} relay${relays.length !== 1 ? 's' : ''}`),
      ),

      // Add relay
      createElement('div', { className: 'rounded-lg border border-border p-4' },
        createElement('p', { className: 'text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3' }, 'Add Relay'),
        createElement('div', { className: 'flex gap-2' },
          createElement(Input, {
            type: 'text',
            value: newUrl,
            onInput: (e: Event) => this.setState({ ...this.state, newUrl: (e.target as HTMLInputElement).value }),
            onKeyDown: this.handleKeyDown,
            placeholder: 'wss://relay.example.com',
            className: 'flex-1',
          }),
          createElement(Button, {
            onClick: this.handleAdd,
            disabled: !newUrl.trim(),
            size: 'sm',
          }, 'Add'),
        ),
      ),

      // Relay list
      createElement('div', { className: 'space-y-2' },
        ...relays.map(([url, status]) => {
          const statusColor = status === 'connected' ? 'bg-success' : status === 'connecting' ? 'bg-warning animate-pulse' : 'bg-destructive';
          const statusTextColor = status === 'connected' ? 'text-success' : status === 'connecting' ? 'text-warning' : 'text-destructive';

          return createElement('div', {
            key: url,
            className: 'rounded-lg border border-border p-3 flex items-center justify-between gap-3',
          },
            createElement('div', { className: 'flex items-center gap-3 min-w-0' },
              createElement('span', { className: `w-2 h-2 rounded-full shrink-0 ${statusColor}` }),
              createElement('div', { className: 'min-w-0' },
                createElement(RelayLink, { url, className: 'text-sm font-mono text-foreground hover:text-primary truncate transition-colors' }),
                createElement('p', { className: `text-xs ${statusTextColor}` }, status),
              ),
            ),
            createElement(Button, {
              variant: 'ghost',
              size: 'xs',
              onClick: () => removeRelay(url),
              className: 'text-destructive/50 hover:text-destructive',
            }, 'Remove'),
          );
        }),
      ),

      relays.length === 0
        ? createElement('div', { className: 'text-center py-8 text-xs text-muted-foreground' },
            'No relays configured. Add one above.',
          )
        : null,
    );
  }
}
