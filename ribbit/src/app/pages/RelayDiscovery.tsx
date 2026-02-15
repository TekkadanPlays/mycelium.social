import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Relay } from '../../nostr/relay';
import type { NostrEvent } from '../../nostr/event';
import {
  getRelayManagerState,
  subscribeRelayManager,
  addRelayToProfile,
} from '../store/relaymanager';
import type { RelayProfile } from '../store/relaymanager';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

// ---------------------------------------------------------------------------
// NIP-66 Relay Discovery
// ---------------------------------------------------------------------------
// NIP-66 defines kind 30166 (relay metadata) and kind 10166 (relay monitor).
// We query known monitor relays for kind 30166 events to discover relays.

const MONITOR_RELAYS = [
  'wss://relay.nostr.watch',
  'wss://history.nostr.watch',
];

interface RelayInfo {
  url: string;
  name: string;
  description: string;
  software: string;
  version: string;
  supportedNips: number[];
  contact: string;
  pubkey: string;
  lastSeen: number;
}

type SortMode = 'recent' | 'name' | 'nips';

interface DiscoveryState {
  relays: RelayInfo[];
  isLoading: boolean;
  error: string | null;
  search: string;
  profiles: RelayProfile[];
  addMenuOpen: string | null;
  // Filters
  filterSoftware: string; // '' = all
  filterNip: number | null; // null = all
  sortBy: SortMode;
  showFilters: boolean;
}

function parseRelayInfo(event: NostrEvent): RelayInfo | null {
  const dTag = event.tags.find((t) => t[0] === 'd');
  if (!dTag || !dTag[1]) return null;

  const url = dTag[1];
  let name = '';
  let description = '';
  let software = '';
  let version = '';
  let contact = '';
  const supportedNips: number[] = [];

  for (const tag of event.tags) {
    if (tag[0] === 'N' && tag[1]) {
      const n = parseInt(tag[1], 10);
      if (!isNaN(n)) supportedNips.push(n);
    }
    if (tag[0] === 'R' && tag[1] === 'name' && tag[2]) name = tag[2];
    if (tag[0] === 'R' && tag[1] === 'desc' && tag[2]) description = tag[2];
    if (tag[0] === 'R' && tag[1] === 'software' && tag[2]) software = tag[2];
    if (tag[0] === 'R' && tag[1] === 'version' && tag[2]) version = tag[2];
    if (tag[0] === 'R' && tag[1] === 'contact' && tag[2]) contact = tag[2];
    // Also try rtt tag for name fallback
    if (tag[0] === 'rtt' && tag[1] === 'open') name = name || '';
  }

  // Try parsing content as JSON for relay info document
  if (event.content) {
    try {
      const info = JSON.parse(event.content);
      if (!name && info.name) name = info.name;
      if (!description && info.description) description = info.description;
      if (!software && info.software) software = info.software;
      if (!version && info.version) version = info.version;
      if (!contact && info.contact) contact = info.contact;
      if (supportedNips.length === 0 && Array.isArray(info.supported_nips)) {
        for (const n of info.supported_nips) {
          if (typeof n === 'number') supportedNips.push(n);
        }
      }
    } catch {
      // content isn't JSON, that's fine
    }
  }

  return {
    url,
    name: name || url.replace('wss://', '').replace('ws://', ''),
    description: description || '',
    software: software ? software.split('/').pop() || software : '',
    version,
    contact,
    supportedNips: supportedNips.sort((a, b) => a - b),
    pubkey: event.pubkey,
    lastSeen: event.created_at,
  };
}

// Collect unique software names from relay list
function collectSoftwareOptions(relays: RelayInfo[]): string[] {
  const set = new Set<string>();
  for (const r of relays) {
    if (r.software) set.add(r.software);
  }
  return Array.from(set).sort();
}

// Collect unique NIP numbers from relay list
function collectNipOptions(relays: RelayInfo[]): number[] {
  const set = new Set<number>();
  for (const r of relays) {
    for (const n of r.supportedNips) set.add(n);
  }
  return Array.from(set).sort((a, b) => a - b);
}

function sortRelays(relays: RelayInfo[], mode: SortMode): RelayInfo[] {
  const copy = [...relays];
  switch (mode) {
    case 'name': return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'nips': return copy.sort((a, b) => b.supportedNips.length - a.supportedNips.length);
    case 'recent':
    default: return copy.sort((a, b) => b.lastSeen - a.lastSeen);
  }
}

export class RelayDiscovery extends Component<{}, DiscoveryState> {
  private unsubManager: (() => void) | null = null;
  private monitorRelay: Relay | null = null;
  declare state: DiscoveryState;

  constructor(props: {}) {
    super(props);
    this.state = {
      relays: [],
      isLoading: false,
      error: null,
      search: '',
      profiles: getRelayManagerState().profiles,
      addMenuOpen: null,
      filterSoftware: '',
      filterNip: null,
      sortBy: 'recent',
      showFilters: false,
    };
  }

  componentDidMount() {
    this.unsubManager = subscribeRelayManager(() => {
      this.setState({ ...this.state, profiles: getRelayManagerState().profiles });
    });
    this.fetchRelays();
  }

  componentWillUnmount() {
    this.unsubManager?.();
    if (this.monitorRelay) {
      this.monitorRelay.disconnect();
    }
  }

  fetchRelays() {
    this.setState({ ...this.state, isLoading: true, error: null, relays: [] });

    const relay = new Relay(MONITOR_RELAYS[0]);
    this.monitorRelay = relay;
    const seen = new Map<string, RelayInfo>();

    const onEvent = (event: NostrEvent) => {
      const info = parseRelayInfo(event);
      if (info && !seen.has(info.url)) {
        seen.set(info.url, info);
        this.setState({
          ...this.state,
          relays: Array.from(seen.values()),
        });
      }
    };

    const onEose = () => {
      this.setState({ ...this.state, isLoading: false });
      relay.disconnect();
    };

    relay.connect().then(() => {
      relay.subscribe([{ kinds: [30166], limit: 500 }], onEvent, onEose);
    }).catch(() => {
      const fallback = new Relay(MONITOR_RELAYS[1]);
      this.monitorRelay = fallback;
      fallback.connect().then(() => {
        fallback.subscribe([{ kinds: [30166], limit: 500 }], onEvent, () => {
          this.setState({ ...this.state, isLoading: false });
          fallback.disconnect();
        });
      }).catch((err2) => {
        this.setState({ ...this.state, isLoading: false, error: 'Could not connect to relay monitors. ' + String(err2) });
      });
    });
  }

  isRelayInAnyProfile(url: string): boolean {
    return this.state.profiles.some((p) => p.relays.includes(url));
  }

  getFiltered(): RelayInfo[] {
    const { relays, search, filterSoftware, filterNip, sortBy } = this.state;

    let result = relays;

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.url.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.software.toLowerCase().includes(q)
      );
    }

    // Software filter
    if (filterSoftware) {
      result = result.filter((r) => r.software === filterSoftware);
    }

    // NIP filter
    if (filterNip !== null) {
      result = result.filter((r) => r.supportedNips.includes(filterNip));
    }

    return sortRelays(result, sortBy);
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.state.filterSoftware) count++;
    if (this.state.filterNip !== null) count++;
    if (this.state.sortBy !== 'recent') count++;
    return count;
  }

  render() {
    const { relays, isLoading, error, search, profiles, addMenuOpen, filterSoftware, filterNip, sortBy, showFilters } = this.state;
    const filtered = this.getFiltered();
    const softwareOptions = collectSoftwareOptions(relays);
    const nipOptions = collectNipOptions(relays);
    const filterCount = this.activeFilterCount;

    return createElement('div', { className: 'space-y-4 max-w-3xl' },
      // Header
      createElement('div', { className: 'flex items-center justify-between' },
        createElement('div', null,
          createElement('h1', { className: 'text-xl font-bold tracking-tight' }, 'Discover Relays'),
          createElement('p', { className: 'text-sm text-muted-foreground mt-1' },
            'Browse relays monitored via NIP-66. Filter by software, NIPs, or search. Like ',
            createElement('a', {
              href: '/docs/ribbit-android',
              className: 'text-primary hover:underline',
            }, 'Ribbit Android'),
            '\u2019s relay manager, you can add relays to categorized profiles.',
          ),
        ),
        createElement(Link, { to: '/settings/relays' },
          createElement(Button, { variant: 'outline', size: 'sm' }, '\u{1F4E1} Manager'),
        ),
      ),

      // Search + filter toggle
      createElement('div', { className: 'flex gap-2' },
        createElement(Input, {
          type: 'text',
          value: search,
          onInput: (e: Event) => this.setState({ ...this.state, search: (e.target as HTMLInputElement).value }),
          placeholder: 'Search relays by name, URL, or software...',
          className: 'flex-1',
        }),
        createElement(Button, {
          variant: showFilters ? 'default' : 'outline',
          size: 'sm',
          onClick: () => this.setState({ ...this.state, showFilters: !showFilters }),
          className: 'shrink-0',
        },
          '\u{1F50D} Filters',
          filterCount > 0
            ? createElement('span', { className: 'ml-1 text-[10px] bg-primary-foreground/20 rounded-full px-1.5' }, String(filterCount))
            : null,
        ),
      ),

      // Filter panel
      showFilters
        ? createElement('div', { className: 'rounded-xl border border-border p-4 space-y-3 bg-muted/20' },
            createElement('div', { className: 'flex items-center justify-between' },
              createElement('p', { className: 'text-xs font-semibold uppercase tracking-wider text-muted-foreground' }, 'Filters'),
              filterCount > 0
                ? createElement('button', {
                    onClick: () => this.setState({ ...this.state, filterSoftware: '', filterNip: null, sortBy: 'recent' }),
                    className: 'text-xs text-primary hover:underline',
                  }, 'Clear all')
                : null,
            ),

            // Software filter
            createElement('div', null,
              createElement('label', { className: 'text-xs text-muted-foreground mb-1 block' }, 'Software'),
              createElement('div', { className: 'flex flex-wrap gap-1.5' },
                createElement('button', {
                  onClick: () => this.setState({ ...this.state, filterSoftware: '' }),
                  className: `text-xs px-2 py-1 rounded-md transition-colors ${
                    !filterSoftware ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`,
                }, 'All'),
                ...softwareOptions.map((sw) =>
                  createElement('button', {
                    key: sw,
                    onClick: () => this.setState({ ...this.state, filterSoftware: filterSoftware === sw ? '' : sw }),
                    className: `text-xs px-2 py-1 rounded-md transition-colors ${
                      filterSoftware === sw ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`,
                  }, sw),
                ),
              ),
            ),

            // NIP filter
            createElement('div', null,
              createElement('label', { className: 'text-xs text-muted-foreground mb-1 block' }, 'Supports NIP'),
              createElement('div', { className: 'flex flex-wrap gap-1' },
                createElement('button', {
                  onClick: () => this.setState({ ...this.state, filterNip: null }),
                  className: `text-[10px] px-1.5 py-0.5 rounded transition-colors font-mono ${
                    filterNip === null ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`,
                }, 'Any'),
                ...nipOptions.slice(0, 40).map((n) =>
                  createElement('button', {
                    key: String(n),
                    onClick: () => this.setState({ ...this.state, filterNip: filterNip === n ? null : n }),
                    className: `text-[10px] px-1.5 py-0.5 rounded transition-colors font-mono ${
                      filterNip === n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`,
                  }, String(n).padStart(2, '0')),
                ),
              ),
            ),

            // Sort
            createElement('div', null,
              createElement('label', { className: 'text-xs text-muted-foreground mb-1 block' }, 'Sort by'),
              createElement('div', { className: 'flex gap-1.5' },
                ...([
                  { key: 'recent' as SortMode, label: 'Recent' },
                  { key: 'name' as SortMode, label: 'Name' },
                  { key: 'nips' as SortMode, label: 'Most NIPs' },
                ]).map((opt) =>
                  createElement('button', {
                    key: opt.key,
                    onClick: () => this.setState({ ...this.state, sortBy: opt.key }),
                    className: `text-xs px-2 py-1 rounded-md transition-colors ${
                      sortBy === opt.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`,
                  }, opt.label),
                ),
              ),
            ),
          )
        : null,

      // Stats
      createElement('div', { className: 'flex items-center gap-3 text-xs text-muted-foreground' },
        isLoading
          ? createElement('span', { className: 'animate-pulse' }, 'Loading relays from monitors...')
          : createElement('span', null,
              filtered.length + ' relay' + (filtered.length !== 1 ? 's' : ''),
              relays.length !== filtered.length ? ` (of ${relays.length} total)` : '',
            ),
        error ? createElement('span', { className: 'text-destructive' }, error) : null,
      ),

      // Relay list
      filtered.length > 0
        ? createElement('div', { className: 'space-y-2' },
            ...filtered.slice(0, 100).map((relay) => {
              const inProfile = this.isRelayInAnyProfile(relay.url);
              const menuOpen = addMenuOpen === relay.url;

              return createElement('div', {
                key: relay.url,
                className: 'rounded-xl border border-border p-4 hover:border-primary/20 transition-colors',
              },
                createElement('div', { className: 'flex items-start justify-between gap-3' },
                  createElement('div', { className: 'flex-1 min-w-0' },
                    createElement('div', { className: 'flex items-center gap-2 mb-1' },
                      createElement('p', { className: 'text-sm font-semibold truncate' }, relay.name),
                      relay.software
                        ? createElement(Badge, { variant: 'secondary', className: 'text-[10px] shrink-0' },
                            relay.software + (relay.version ? ' ' + relay.version : ''),
                          )
                        : null,
                      inProfile
                        ? createElement(Badge, { variant: 'outline', className: 'text-[10px] shrink-0 text-emerald-600' }, 'Added')
                        : null,
                    ),
                    createElement('p', { className: 'text-xs font-mono text-muted-foreground truncate' }, relay.url),
                    relay.description
                      ? createElement('p', { className: 'text-xs text-muted-foreground mt-1 line-clamp-2' }, relay.description)
                      : null,
                    relay.supportedNips.length > 0
                      ? createElement('div', { className: 'flex flex-wrap gap-1 mt-2' },
                          ...relay.supportedNips.slice(0, 15).map((n) =>
                            createElement('button', {
                              key: String(n),
                              onClick: () => this.setState({ ...this.state, filterNip: n, showFilters: true }),
                              className: `text-[10px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                                filterNip === n
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-accent'
                              }`,
                            }, 'NIP-' + String(n).padStart(2, '0')),
                          ),
                          relay.supportedNips.length > 15
                            ? createElement('span', { className: 'text-[10px] text-muted-foreground/50' },
                                '+' + (relay.supportedNips.length - 15) + ' more',
                              )
                            : null,
                        )
                      : null,
                  ),

                  // Add to profile button
                  createElement('div', { className: 'relative shrink-0' },
                    createElement(Button, {
                      variant: inProfile ? 'outline' : 'default',
                      size: 'sm',
                      onClick: (e: Event) => {
                        e.stopPropagation();
                        this.setState({ ...this.state, addMenuOpen: menuOpen ? null : relay.url });
                      },
                    }, inProfile ? 'Add to...' : '+ Add'),

                    // Profile selector dropdown
                    menuOpen
                      ? createElement('div', {
                          className: 'absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg py-1 z-50',
                        },
                          ...profiles.map((profile) => {
                            const alreadyIn = profile.relays.includes(relay.url);
                            return createElement('button', {
                              key: profile.id,
                              disabled: alreadyIn,
                              onClick: () => {
                                addRelayToProfile(profile.id, relay.url);
                                this.setState({ ...this.state, addMenuOpen: null });
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
              );
            }),
          )
        : !isLoading
          ? createElement('div', { className: 'text-center py-16' },
              createElement('div', { className: 'text-3xl mb-3' }, '\u{1F4E1}'),
              createElement('p', { className: 'text-sm text-muted-foreground' },
                filterCount > 0 ? 'No relays match your filters.' : 'No relays found.',
              ),
              filterCount > 0
                ? createElement('button', {
                    onClick: () => this.setState({ ...this.state, filterSoftware: '', filterNip: null, sortBy: 'recent', search: '' }),
                    className: 'text-xs text-primary hover:underline mt-2 inline-block',
                  }, 'Clear filters')
                : null,
            )
          : null,
    );
  }
}
