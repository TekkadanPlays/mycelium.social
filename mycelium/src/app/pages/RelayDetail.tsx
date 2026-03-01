import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import {
  getRelayManagerState,
  subscribeRelayManager,
  addRelayToProfile,
} from '../store/relaymanager';
import type { RelayProfile } from '../store/relaymanager';

// ---------------------------------------------------------------------------
// Relay Detail Page — "profile" view for a single relay
// ---------------------------------------------------------------------------
// Fetches full relay state from rstate API at /relays/state?relayUrl=...

interface RelayState {
  url: string;
  name: string;
  description: string;
  software: string;
  version: string;
  supportedNips: number[];
  contact: string;
  pubkey: string;
  countryCode: string;
  countryName: string;
  city: string;
  isOnline: boolean;
  uptimePct: number | null;
  rttRead: number | null;
  rttWrite: number | null;
  lastSeen: number;
  // Extended fields from rstate
  paymentRequired: boolean;
  authRequired: boolean;
  limitation: any;
  retention: any;
  fees: any;
  icon: string;
  banner: string;
}

interface DetailState {
  relay: RelayState | null;
  isLoading: boolean;
  error: string | null;
  profiles: RelayProfile[];
  addMenuOpen: boolean;
  logs: string[];
}

function countryFlag(code: string): string {
  if (!code || code.length !== 2) return '';
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map((c) => 0x1F1E6 + c.charCodeAt(0) - 65),
  );
}

function parseRelayState(raw: any): RelayState {
  const info = raw.info || raw.nip11 || {};
  const geo = raw.geo || raw.location || {};
  const nips: number[] = [];
  if (Array.isArray(info.supported_nips)) {
    for (const n of info.supported_nips) {
      if (typeof n === 'number') nips.push(n);
    }
  }
  if (Array.isArray(raw.supported_nips)) {
    for (const n of raw.supported_nips) {
      if (typeof n === 'number' && !nips.includes(n)) nips.push(n);
    }
  }

  const sw = info.software || raw.software || '';

  return {
    url: raw.url || raw.relay_url || raw.d || '',
    name: info.name || raw.name || '',
    description: info.description || raw.description || '',
    software: sw ? (sw.split('/').pop() || sw) : '',
    version: info.version || raw.version || '',
    supportedNips: nips.sort((a, b) => a - b),
    contact: info.contact || raw.contact || '',
    pubkey: info.pubkey || raw.pubkey || '',
    countryCode: geo.country_code || geo.countryCode || raw.country_code || '',
    countryName: geo.country || geo.countryName || raw.country || '',
    city: geo.city || raw.city || '',
    isOnline: raw.is_online ?? raw.online ?? true,
    uptimePct: raw.uptime_pct ?? raw.uptime ?? null,
    rttRead: raw.rtt_read ?? raw.avg_rtt_read ?? raw.rtt?.read ?? null,
    rttWrite: raw.rtt_write ?? raw.avg_rtt_write ?? raw.rtt?.write ?? null,
    lastSeen: raw.last_seen ?? raw.created_at ?? 0,
    paymentRequired: info.limitation?.payment_required ?? false,
    authRequired: info.limitation?.auth_required ?? false,
    limitation: info.limitation || null,
    retention: info.retention || null,
    fees: info.fees || null,
    icon: info.icon || '',
    banner: info.banner || '',
  };
}

export class RelayDetail extends Component<{ match?: { params?: { url?: string } } }, DetailState> {
  private unsubManager: (() => void) | null = null;
  declare state: DetailState;

  constructor(props: any) {
    super(props);
    this.state = {
      relay: null,
      isLoading: true,
      error: null,
      profiles: getRelayManagerState().profiles,
      addMenuOpen: false,
      logs: [],
    };
  }

  private getRelayUrl(): string {
    const encoded = this.props.match?.params?.url || '';
    try {
      return decodeURIComponent(encoded);
    } catch {
      return encoded;
    }
  }

  componentDidMount() {
    this.unsubManager = subscribeRelayManager(() => {
      this.setState({ ...this.state, profiles: getRelayManagerState().profiles });
    });
    this.fetchRelayState();
  }

  componentWillUnmount() {
    this.unsubManager?.();
  }

  private addLog(msg: string) {
    const ts = new Date().toLocaleTimeString();
    this.setState({ ...this.state, logs: [...this.state.logs, `[${ts}] ${msg}`] });
  }

  async fetchRelayState() {
    const url = this.getRelayUrl();
    if (!url) {
      this.setState({ ...this.state, isLoading: false, error: 'No relay URL provided.' });
      return;
    }

    this.addLog('Fetching relay state from rstate API...');

    try {
      const res = await fetch(`/relays/state?relayUrl=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const relay = parseRelayState(data);
      if (!relay.url) relay.url = url;
      if (!relay.name) relay.name = url.replace('wss://', '').replace('ws://', '');

      this.addLog(`Received relay info: ${relay.name}`);
      if (relay.isOnline) this.addLog('Relay is online');
      else this.addLog('Relay appears offline');
      if (relay.rttRead !== null) this.addLog(`RTT read: ${relay.rttRead}ms`);
      if (relay.rttWrite !== null) this.addLog(`RTT write: ${relay.rttWrite}ms`);
      if (relay.supportedNips.length > 0) this.addLog(`Supports ${relay.supportedNips.length} NIPs`);

      this.setState({ ...this.state, relay, isLoading: false });
    } catch (err: any) {
      this.addLog(`Error: ${err?.message || err}`);
      // Fallback — show basic info from URL
      this.setState({
        ...this.state,
        relay: {
          url,
          name: url.replace('wss://', '').replace('ws://', ''),
          description: '',
          software: '',
          version: '',
          supportedNips: [],
          contact: '',
          pubkey: '',
          countryCode: '',
          countryName: '',
          city: '',
          isOnline: false,
          uptimePct: null,
          rttRead: null,
          rttWrite: null,
          lastSeen: 0,
          paymentRequired: false,
          authRequired: false,
          limitation: null,
          retention: null,
          fees: null,
          icon: '',
          banner: '',
        },
        isLoading: false,
        error: 'Could not fetch relay details. ' + String(err?.message || err),
      });
    }
  }

  isRelayInAnyProfile(url: string): boolean {
    return this.state.profiles.some((p) => p.relays.includes(url));
  }

  render() {
    const { relay, isLoading, error, profiles, addMenuOpen, logs } = this.state;

    if (isLoading) {
      return createElement('div', { className: 'flex justify-center py-20' },
        createElement(Spinner, null),
      );
    }

    if (!relay) {
      return createElement('div', { className: 'text-center py-20' },
        createElement('p', { className: 'text-sm text-muted-foreground' }, error || 'Relay not found.'),
        createElement(Link, { to: '/discover', className: 'text-xs text-primary hover:underline mt-2 inline-block' }, '\u2190 Back to discovery'),
      );
    }

    const flag = countryFlag(relay.countryCode);
    const inProfile = this.isRelayInAnyProfile(relay.url);

    return createElement('div', { className: 'mx-auto max-w-3xl px-4 sm:px-6 py-6 space-y-6' },
      // Back link
      createElement('button', {
        onClick: () => window.history.back(),
        className: 'inline-flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer',
      }, '\u2190 Back'),

      // Header card
      createElement('div', { className: 'rounded-xl border border-border p-6 space-y-4' },
        // Icon + name
        createElement('div', { className: 'flex items-start gap-4' },
          relay.icon
            ? createElement('img', { src: relay.icon, alt: '', className: 'w-14 h-14 rounded-xl object-cover shrink-0' })
            : createElement('div', { className: 'w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0' },
                createElement('span', { className: 'text-2xl' }, '\u{1F4E1}'),
              ),
          createElement('div', { className: 'flex-1 min-w-0' },
            createElement('div', { className: 'flex items-center gap-2 flex-wrap' },
              flag ? createElement('span', { className: 'text-lg' }, flag) : null,
              createElement('h1', { className: 'text-xl font-bold tracking-tight' }, relay.name),
              relay.isOnline
                ? createElement(Badge, { className: 'text-[10px]' }, '\u25CF Online')
                : createElement(Badge, { variant: 'destructive', className: 'text-[10px]' }, '\u25CF Offline'),
            ),
            createElement('p', { className: 'text-sm font-mono text-muted-foreground mt-1' }, relay.url),
            relay.description
              ? createElement('p', { className: 'text-sm text-muted-foreground mt-2 leading-relaxed' }, relay.description)
              : null,
          ),
        ),

        // Badges
        createElement('div', { className: 'flex flex-wrap gap-2' },
          relay.software
            ? createElement(Badge, { variant: 'secondary' }, relay.software + (relay.version ? ' ' + relay.version : ''))
            : null,
          relay.city || relay.countryName
            ? createElement(Badge, { variant: 'outline' }, (relay.city ? relay.city + ', ' : '') + relay.countryName)
            : null,
          relay.paymentRequired ? createElement(Badge, { variant: 'outline' }, '\u{1F4B3} Payment required') : null,
          relay.authRequired ? createElement(Badge, { variant: 'outline' }, '\u{1F512} Auth required') : null,
          inProfile ? createElement(Badge, { variant: 'outline', className: 'text-emerald-600' }, '\u2713 In your profiles') : null,
        ),

        // Add to profile
        createElement('div', { className: 'relative inline-block' },
          createElement(Button, {
            variant: inProfile ? 'outline' : 'default',
            size: 'sm',
            onClick: () => this.setState({ ...this.state, addMenuOpen: !addMenuOpen }),
          }, inProfile ? 'Add to another profile...' : '+ Add to profile'),
          addMenuOpen
            ? createElement('div', {
                className: 'absolute left-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg py-1 z-50',
              },
                ...profiles.map((profile) => {
                  const alreadyIn = profile.relays.includes(relay.url);
                  return createElement('button', {
                    key: profile.id,
                    disabled: alreadyIn,
                    onClick: () => {
                      addRelayToProfile(profile.id, relay.url);
                      this.setState({ ...this.state, addMenuOpen: false });
                    },
                    className: `flex items-center justify-between w-full px-3 py-2 text-sm transition-colors ${
                      alreadyIn
                        ? 'text-muted-foreground/40 cursor-not-allowed'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`,
                  },
                    profile.name,
                    alreadyIn
                      ? createElement('span', { className: 'text-[10px] text-emerald-600' }, '\u2713')
                      : null,
                  );
                }),
              )
            : null,
        ),
      ),

      // Metrics
      createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-4 gap-3' },
        ...[
          {
            label: 'RTT Read',
            value: relay.rttRead !== null ? relay.rttRead + 'ms' : '\u2014',
            color: relay.rttRead !== null ? (relay.rttRead < 200 ? 'text-emerald-600' : relay.rttRead < 500 ? 'text-amber-500' : 'text-destructive') : '',
          },
          {
            label: 'RTT Write',
            value: relay.rttWrite !== null ? relay.rttWrite + 'ms' : '\u2014',
            color: relay.rttWrite !== null ? (relay.rttWrite < 200 ? 'text-emerald-600' : relay.rttWrite < 500 ? 'text-amber-500' : 'text-destructive') : '',
          },
          {
            label: 'Uptime',
            value: relay.uptimePct !== null ? relay.uptimePct.toFixed(1) + '%' : '\u2014',
            color: relay.uptimePct !== null ? (relay.uptimePct > 95 ? 'text-emerald-600' : relay.uptimePct > 80 ? 'text-amber-500' : 'text-destructive') : '',
          },
          {
            label: 'NIPs',
            value: String(relay.supportedNips.length),
            color: '',
          },
        ].map((m) =>
          createElement('div', { key: m.label, className: 'rounded-lg border border-border p-3 text-center' },
            createElement('p', { className: 'text-xs text-muted-foreground mb-1' }, m.label),
            createElement('p', { className: 'text-lg font-bold ' + m.color }, m.value),
          ),
        ),
      ),

      // Supported NIPs
      relay.supportedNips.length > 0
        ? createElement('div', { className: 'space-y-2' },
            createElement('h2', { className: 'text-sm font-semibold' }, 'Supported NIPs'),
            createElement('div', { className: 'flex flex-wrap gap-1.5' },
              ...relay.supportedNips.map((n) =>
                createElement('span', {
                  key: String(n),
                  className: 'text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground font-mono',
                }, 'NIP-' + String(n).padStart(2, '0')),
              ),
            ),
          )
        : null,

      // Contact info
      relay.contact || relay.pubkey
        ? createElement('div', { className: 'space-y-2' },
            createElement('h2', { className: 'text-sm font-semibold' }, 'Contact'),
            relay.contact
              ? createElement('p', { className: 'text-xs text-muted-foreground' }, relay.contact)
              : null,
            relay.pubkey
              ? createElement('p', { className: 'text-xs font-mono text-muted-foreground truncate' }, 'pubkey: ' + relay.pubkey)
              : null,
          )
        : null,

      // Logs
      createElement('div', { className: 'space-y-2' },
        createElement('h2', { className: 'text-sm font-semibold' }, 'Activity Log'),
        createElement('div', { className: 'rounded-lg border border-border bg-muted/20 p-3 max-h-48 overflow-y-auto' },
          logs.length > 0
            ? createElement('div', { className: 'space-y-0.5' },
                ...logs.map((log, i) =>
                  createElement('p', { key: String(i), className: 'text-[11px] font-mono text-muted-foreground' }, log),
                ),
              )
            : createElement('p', { className: 'text-xs text-muted-foreground/50' }, 'No activity yet.'),
        ),
      ),

      // Error
      error
        ? createElement('div', { className: 'rounded-lg border border-destructive/30 bg-destructive/5 p-3' },
            createElement('p', { className: 'text-xs text-destructive' }, error),
          )
        : null,
    );
  }
}
