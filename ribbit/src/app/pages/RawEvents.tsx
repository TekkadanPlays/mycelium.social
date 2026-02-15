import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Relay } from '../../nostr/relay';
import type { NostrEvent } from '../../nostr/event';
import { signWithExtension } from '../../nostr/nip07';
import { getAuthState } from '../store/auth';
import { npubEncode, nprofileEncode, shortenNpub, shortenHex, kindName } from '../../nostr/utils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ProfileCache {
  name: string;
  displayName: string;
  picture: string;
  nip05: string;
}

interface RawEventsState {
  relayUrl: string;
  relay: Relay | null;
  status: string;
  events: NostrEvent[];
  profiles: Map<string, ProfileCache>;
  isPaused: boolean;
  filterKind: number | null;
  maxEvents: number;
  totalReceived: number;
}

export class RawEvents extends Component<{}, RawEventsState> {
  declare state: RawEventsState;
  private profileQueue: Set<string> = new Set();
  private profileTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: {}) {
    super(props);
    this.state = {
      relayUrl: 'wss://relay.damus.io',
      relay: null,
      status: 'disconnected',
      events: [],
      profiles: new Map(),
      isPaused: false,
      filterKind: null,
      maxEvents: 200,
      totalReceived: 0,
    };
  }

  componentWillUnmount() {
    if (this.state.relay) {
      this.state.relay.disconnect();
    }
    if (this.profileTimer) clearTimeout(this.profileTimer);
  }

  handleUrlChange = (e: Event) => {
    this.setState({ ...this.state, relayUrl: (e.target as HTMLInputElement).value });
  };

  handleConnect = () => {
    // Disconnect existing
    if (this.state.relay) {
      this.state.relay.disconnect();
    }

    // Auto-prefix wss:// if missing
    let url = this.state.relayUrl.trim();
    if (!url.startsWith('wss://') && !url.startsWith('ws://')) {
      url = 'wss://' + url;
      this.setState({ ...this.state, relayUrl: url });
    }

    const relay = new Relay(url);
    // Wire up NIP-42 AUTH signer if user is logged in
    const auth = getAuthState();
    if (auth.pubkey) {
      relay.setAuthSigner((unsigned) => signWithExtension(unsigned));
    }
    this.setState({
      ...this.state,
      relay,
      status: 'connecting',
      events: [],
      profiles: new Map(),
      totalReceived: 0,
    });

    relay.onStatusChange((status) => {
      this.setState({ ...this.state, status });
    });

    relay.connect().then(() => {
      // Subscribe to all events (firehose)
      relay.subscribe(
        [{ limit: this.state.maxEvents }],
        (event) => {
          this.handleEvent(event);
        },
        () => {
          // EOSE — now subscribe to live events
          relay.subscribe(
            [{ since: Math.floor(Date.now() / 1000) }],
            (event) => {
              this.handleEvent(event);
            },
          );
        },
      );
    }).catch((err) => {
      this.setState({ ...this.state, status: 'error: ' + String(err) });
    });
  };

  handleDisconnect = () => {
    if (this.state.relay) {
      this.state.relay.disconnect();
      this.setState({ ...this.state, relay: null, status: 'disconnected' });
    }
  };

  handleEvent(event: NostrEvent) {
    if (this.state.isPaused) return;

    const totalReceived = this.state.totalReceived + 1;

    // Queue profile fetch for this pubkey
    if (!this.state.profiles.has(event.pubkey)) {
      this.queueProfileFetch(event.pubkey);
    }

    // Parse metadata events into profile cache
    if (event.kind === 0) {
      this.parseMetadata(event);
    }

    // Prepend (newest first), cap at maxEvents
    const events = [event, ...this.state.events].slice(0, this.state.maxEvents);
    this.setState({ ...this.state, events, totalReceived });
  }

  parseMetadata(event: NostrEvent) {
    try {
      const meta = JSON.parse(event.content);
      const profile: ProfileCache = {
        name: meta.name || '',
        displayName: meta.display_name || meta.displayName || '',
        picture: meta.picture || '',
        nip05: meta.nip05 || '',
      };
      const profiles = new Map(this.state.profiles);
      profiles.set(event.pubkey, profile);
      this.setState({ ...this.state, profiles });
    } catch { /* ignore bad JSON */ }
  }

  queueProfileFetch(pubkey: string) {
    this.profileQueue.add(pubkey);
    if (this.profileTimer) return;
    this.profileTimer = setTimeout(() => {
      this.profileTimer = null;
      this.flushProfileQueue();
    }, 300);
  }

  flushProfileQueue() {
    if (!this.state.relay || this.profileQueue.size === 0) return;
    const pubkeys = Array.from(this.profileQueue).filter((pk) => !this.state.profiles.has(pk));
    this.profileQueue.clear();
    if (pubkeys.length === 0) return;

    this.state.relay.subscribe(
      [{ kinds: [0], authors: pubkeys }],
      (event) => {
        this.parseMetadata(event);
      },
    );
  }

  togglePause = () => {
    this.setState({ ...this.state, isPaused: !this.state.isPaused });
  };

  setFilterKind = (kind: number | null) => {
    this.setState({ ...this.state, filterKind: kind });
  };

  clearEvents = () => {
    this.setState({ ...this.state, events: [], totalReceived: 0 });
  };

  getDisplayName(pubkey: string): string {
    const profile = this.state.profiles.get(pubkey);
    if (profile) {
      return profile.displayName || profile.name || shortenNpub(npubEncode(pubkey));
    }
    return shortenNpub(npubEncode(pubkey));
  }

  formatTime(ts: number): string {
    return new Date(ts * 1000).toLocaleTimeString();
  }

  truncateContent(content: string, max: number = 200): string {
    if (content.length <= max) return content;
    return content.slice(0, max) + '...';
  }

  getKindClasses(kind: number): { bg: string; text: string; border: string } {
    if (kind === 0) return { bg: 'bg-info/10', text: 'text-info', border: 'border-l-info' };
    if (kind === 1) return { bg: 'bg-success/10', text: 'text-success', border: 'border-l-success' };
    if (kind === 3) return { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-l-secondary' };
    if (kind === 7) return { bg: 'bg-warning/10', text: 'text-warning', border: 'border-l-warning' };
    if (kind === 6) return { bg: 'bg-accent/10', text: 'text-accent', border: 'border-l-accent' };
    if (kind >= 9000 && kind < 10000) return { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-l-destructive' };
    return { bg: 'bg-muted/50', text: 'text-muted-foreground', border: 'border-l-muted' };
  }

  render() {
    const { relayUrl, status, events, isPaused, filterKind, totalReceived, profiles } = this.state;

    const filteredEvents = filterKind !== null
      ? events.filter((e) => e.kind === filterKind)
      : events;

    // Collect kind counts for filter buttons
    const kindCounts = new Map<number, number>();
    for (const e of events) {
      kindCounts.set(e.kind, (kindCounts.get(e.kind) || 0) + 1);
    }
    const sortedKinds = Array.from(kindCounts.entries()).sort((a, b) => b[1] - a[1]);

    return createElement('div', { className: 'space-y-3' },
      createElement(Link, {
        to: '/',
        className: 'inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2',
      }, '\u2190 Back to feed'),

      // Connection bar
      createElement('div', { className: 'rounded-lg border border-border p-3 flex gap-2 items-center flex-wrap' },
        createElement(Input, {
          type: 'text',
          value: relayUrl,
          onInput: this.handleUrlChange,
          placeholder: 'wss://relay.example.com',
          className: 'flex-1 min-w-[200px]',
        }),
        status === 'disconnected' || status.startsWith('error')
          ? createElement(Button, {
              onClick: this.handleConnect,
              size: 'sm',
            }, 'Connect')
          : createElement(Button, {
              onClick: this.handleDisconnect,
              variant: 'ghost',
              size: 'sm',
              className: 'text-destructive/70 hover:text-destructive hover:bg-destructive/5',
            }, 'Disconnect'),
        createElement('div', {
          className: `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
            status === 'connected' ? 'bg-success/10 text-success'
            : status === 'connecting' ? 'bg-warning/10 text-warning'
            : 'bg-destructive/10 text-destructive'
          }`,
        },
          createElement('span', {
            className: `w-1.5 h-1.5 rounded-full ${
              status === 'connected' ? 'bg-success'
              : status === 'connecting' ? 'bg-warning animate-pulse'
              : 'bg-destructive'
            }`,
          }),
          status,
        ),
      ),

      // Controls bar
      events.length > 0
        ? createElement('div', { className: 'rounded-lg border border-border px-3 py-2 flex gap-2 items-center flex-wrap' },
            createElement('button', {
              onClick: this.togglePause,
              className: `px-3 py-1 text-sm rounded-md transition-colors ${
                isPaused ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
              }`,
            }, isPaused ? '\u25B6 Resume' : '\u23F8 Pause'),
            createElement('button', {
              onClick: this.clearEvents,
              className: 'px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-md transition-colors',
            }, 'Clear'),
            createElement('span', {
              className: 'text-xs text-muted-foreground/50 ml-auto',
            }, `${filteredEvents.length} shown / ${totalReceived} total / ${profiles.size} profiles`),
          )
        : null,

      // Kind filter chips
      sortedKinds.length > 0
        ? createElement('div', { className: 'flex gap-1 flex-wrap' },
            createElement('button', {
              onClick: () => this.setFilterKind(null),
              className: `px-2.5 py-1 text-xs rounded-md transition-colors ${
                filterKind === null ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
              }`,
            }, `All (${events.length})`),
            ...sortedKinds.map(([kind, count]) =>
              createElement('button', {
                key: kind,
                onClick: () => this.setFilterKind(kind),
                className: `px-2.5 py-1 text-xs rounded-md transition-colors ${
                  filterKind === kind ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                }`,
              }, `${kindName(kind)} (${count})`),
            ),
          )
        : null,

      // Event list
      filteredEvents.length > 0
        ? createElement('div', { className: 'space-y-1' },
            ...filteredEvents.map((event) => {
              const profile = this.state.profiles.get(event.pubkey);
              const displayName = this.getDisplayName(event.pubkey);
              const npub = npubEncode(event.pubkey);
              const nprofile = nprofileEncode(event.pubkey, [relayUrl]);
              const kc = this.getKindClasses(event.kind);

              return createElement('div', {
                key: event.id,
                className: `rounded-lg border border-border border-l-[3px] ${kc.border} px-3 py-2.5`,
              },
                // Header row
                createElement('div', { className: 'flex justify-between items-start gap-2' },
                  createElement('div', { className: 'flex items-center gap-2 min-w-0' },
                    // Avatar
                    profile?.picture
                      ? createElement('img', {
                          src: profile.picture,
                          className: 'w-5 h-5 rounded-full object-cover shrink-0',
                          onerror: (e: Event) => { (e.target as HTMLImageElement).style.display = 'none'; },
                        })
                      : createElement('div', {
                          className: 'w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0',
                        }, createElement('span', { className: 'text-[9px] font-semibold text-primary' }, (displayName[0] || '?').toUpperCase())),
                    // Name + nprofile
                    createElement('div', { className: 'min-w-0' },
                      createElement(Link, {
                        to: `/u/${event.pubkey}`,
                        className: 'block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors truncate',
                      }, displayName),
                      createElement('p', {
                        className: 'text-[10px] font-mono text-muted-foreground/40 truncate',
                        title: nprofile,
                      }, shortenNpub(npub)),
                    ),
                  ),
                  // Kind badge + time
                  createElement('div', { className: 'flex items-center gap-2 shrink-0' },
                    createElement('span', {
                      className: `text-[10px] px-1.5 py-0.5 rounded font-semibold ${kc.bg} ${kc.text}`,
                    }, kindName(event.kind)),
                    createElement('span', {
                      className: 'text-xs text-muted-foreground',
                      title: new Date(event.created_at * 1000).toLocaleString(),
                    }, this.formatTime(event.created_at)),
                  ),
                ),

                // Content
                event.content
                  ? createElement('p', {
                      className: 'mt-1.5 text-xs text-muted-foreground whitespace-pre-wrap break-words leading-relaxed',
                    }, this.truncateContent(event.content, 300))
                  : null,

                // Tags (collapsed)
                event.tags.length > 0
                  ? createElement('div', { className: 'mt-1.5 flex gap-1 flex-wrap' },
                      ...event.tags.slice(0, 5).map((tag, i) =>
                        createElement('span', {
                          key: i,
                          className: 'text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground font-mono',
                          title: JSON.stringify(tag),
                        }, `${tag[0]}:${tag[1] ? shortenHex(tag[1], 6) : ''}`),
                      ),
                      event.tags.length > 5
                        ? createElement('span', { className: 'text-[10px] text-muted-foreground/40' }, `+${event.tags.length - 5} more`)
                        : null,
                    )
                  : null,

                // Event ID
                createElement('p', {
                  className: 'mt-1 text-[10px] font-mono text-muted-foreground/30',
                  title: event.id,
                }, shortenHex(event.id, 10)),
              );
            }),
          )
        : status === 'connected'
          ? createElement('div', { className: 'text-center py-16' },
              createElement('div', { className: 'text-4xl mb-3' }, '\u{1F4E1}'),
              createElement('p', { className: 'text-sm font-medium text-muted-foreground' }, 'Waiting for events...'),
            )
          : status === 'disconnected'
            ? createElement('div', { className: 'text-center py-16' },
                createElement('div', { className: 'text-4xl mb-3' }, '\u{1F50C}'),
                createElement('p', { className: 'text-sm font-medium text-muted-foreground' }, 'Enter a relay URL and click Connect'),
              )
            : null,
    );
  }
}
