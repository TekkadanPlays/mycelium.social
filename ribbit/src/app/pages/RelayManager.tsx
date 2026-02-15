import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import {
  getRelayManagerState,
  subscribeRelayManager,
  getActiveProfile,
  setActiveProfile,
  addRelayToProfile,
  removeRelayFromProfile,
  createProfile,
  renameProfile,
  deleteProfile,
  syncPoolToActiveProfile,
} from '../store/relaymanager';
import { getRelayState, subscribeRelay } from '../store/relay';
import type { RelayProfile } from '../store/relaymanager';
import type { RelayStatus } from '../../nostr/relay';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface RelayManagerPageState {
  profiles: RelayProfile[];
  activeProfileId: string;
  relayStatuses: Map<string, RelayStatus>;
  newRelayUrl: string;
  newProfileName: string;
  editingProfileId: string | null;
  editingName: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export class RelayManager extends Component<{}, RelayManagerPageState> {
  private unsubManager: (() => void) | null = null;
  private unsubRelay: (() => void) | null = null;
  declare state: RelayManagerPageState;

  constructor(props: {}) {
    super(props);
    const mgr = getRelayManagerState();
    const relay = getRelayState();
    this.state = {
      profiles: mgr.profiles,
      activeProfileId: mgr.activeProfileId,
      relayStatuses: relay.statuses,
      newRelayUrl: '',
      newProfileName: '',
      editingProfileId: null,
      editingName: '',
    };
  }

  componentDidMount() {
    this.unsubManager = subscribeRelayManager(() => {
      const mgr = getRelayManagerState();
      this.setState({ ...this.state, profiles: mgr.profiles, activeProfileId: mgr.activeProfileId });
    });
    this.unsubRelay = subscribeRelay(() => {
      this.setState({ ...this.state, relayStatuses: getRelayState().statuses });
    });
  }

  componentWillUnmount() {
    this.unsubManager?.();
    this.unsubRelay?.();
  }

  handleAddRelay = () => {
    const url = this.state.newRelayUrl.trim();
    if (!url) return;
    addRelayToProfile(this.state.activeProfileId, url);
    this.setState({ ...this.state, newRelayUrl: '' });
  };

  handleCreateProfile = () => {
    const name = this.state.newProfileName.trim();
    if (!name) return;
    const id = createProfile(name);
    setActiveProfile(id);
    this.setState({ ...this.state, newProfileName: '' });
  };

  handleStartRename = (profile: RelayProfile) => {
    this.setState({ ...this.state, editingProfileId: profile.id, editingName: profile.name });
  };

  handleSaveRename = () => {
    if (this.state.editingProfileId && this.state.editingName.trim()) {
      renameProfile(this.state.editingProfileId, this.state.editingName.trim());
    }
    this.setState({ ...this.state, editingProfileId: null, editingName: '' });
  };

  render() {
    const { profiles, activeProfileId, relayStatuses, newRelayUrl, newProfileName, editingProfileId, editingName } = this.state;
    const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

    return createElement('div', { className: 'space-y-6 max-w-3xl' },
      // Header
      createElement('div', { className: 'flex items-center justify-between' },
        createElement('div', null,
          createElement('h1', { className: 'text-xl font-bold tracking-tight' }, 'Relay Manager'),
          createElement('p', { className: 'text-sm text-muted-foreground mt-1' },
            'Organize relays into profiles. Switch profiles to change which relays you connect to.',
          ),
        ),
        createElement(Link, { to: '/discover' },
          createElement(Button, { variant: 'outline', size: 'sm' }, '\u{1F50D} Discover'),
        ),
      ),

      // Profile tabs
      createElement('div', { className: 'space-y-3' },
        createElement('div', { className: 'flex items-center gap-2 flex-wrap' },
          ...profiles.map((profile) =>
            createElement('button', {
              key: profile.id,
              onClick: () => setActiveProfile(profile.id),
              className: `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                profile.id === activeProfileId
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-accent'
              }`,
            },
              profile.name,
              profile.relays.length > 0
                ? createElement('span', {
                    className: `ml-1.5 text-xs ${
                      profile.id === activeProfileId ? 'text-primary-foreground/70' : 'text-muted-foreground/60'
                    }`,
                  }, String(profile.relays.length))
                : null,
            ),
          ),
        ),

        // New profile input
        createElement('div', { className: 'flex gap-2' },
          createElement(Input, {
            type: 'text',
            value: newProfileName,
            onInput: (e: Event) => this.setState({ ...this.state, newProfileName: (e.target as HTMLInputElement).value }),
            onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter') this.handleCreateProfile(); },
            placeholder: 'New profile name...',
            className: 'max-w-[200px]',
          }),
          createElement(Button, {
            onClick: this.handleCreateProfile,
            disabled: !newProfileName.trim(),
            variant: 'outline',
            size: 'sm',
          }, '+ Add Profile'),
        ),
      ),

      // Active profile header
      createElement('div', { className: 'rounded-xl border border-border' },
        // Profile info bar
        createElement('div', { className: 'px-5 py-4 flex items-center justify-between border-b border-border' },
          editingProfileId === activeProfile.id
            ? createElement('div', { className: 'flex items-center gap-2' },
                createElement(Input, {
                  type: 'text',
                  value: editingName,
                  onInput: (e: Event) => this.setState({ ...this.state, editingName: (e.target as HTMLInputElement).value }),
                  onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter') this.handleSaveRename(); },
                  className: 'max-w-[200px]',
                  autoFocus: true,
                }),
                createElement(Button, { onClick: this.handleSaveRename, size: 'sm' }, 'Save'),
              )
            : createElement('div', { className: 'flex items-center gap-3' },
                createElement('h2', { className: 'text-base font-semibold' }, activeProfile.name),
                activeProfile.builtin
                  ? createElement(Badge, { variant: 'secondary', className: 'text-[10px]' }, 'Built-in')
                  : null,
                createElement(Badge, { variant: 'outline', className: 'text-[10px]' },
                  activeProfile.relays.length + ' relay' + (activeProfile.relays.length !== 1 ? 's' : ''),
                ),
              ),
          createElement('div', { className: 'flex items-center gap-2' },
            !activeProfile.builtin
              ? createElement(Button, {
                  variant: 'ghost',
                  size: 'sm',
                  onClick: () => this.handleStartRename(activeProfile),
                }, 'Rename')
              : null,
            !activeProfile.builtin
              ? createElement(Button, {
                  variant: 'ghost',
                  size: 'sm',
                  className: 'text-destructive/70 hover:text-destructive',
                  onClick: () => { if (confirm('Delete profile "' + activeProfile.name + '"?')) deleteProfile(activeProfile.id); },
                }, 'Delete')
              : null,
            createElement(Button, {
              variant: 'outline',
              size: 'sm',
              onClick: () => syncPoolToActiveProfile(),
            }, 'Connect All'),
          ),
        ),

        // Add relay input
        createElement('div', { className: 'px-5 py-3 border-b border-border bg-muted/20' },
          createElement('div', { className: 'flex gap-2' },
            createElement(Input, {
              type: 'text',
              value: newRelayUrl,
              onInput: (e: Event) => this.setState({ ...this.state, newRelayUrl: (e.target as HTMLInputElement).value }),
              onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter') this.handleAddRelay(); },
              placeholder: 'wss://relay.example.com',
              className: 'flex-1',
            }),
            createElement(Button, {
              onClick: this.handleAddRelay,
              disabled: !newRelayUrl.trim(),
              size: 'sm',
            }, 'Add Relay'),
          ),
        ),

        // Relay list
        activeProfile.relays.length > 0
          ? createElement('div', { className: 'divide-y divide-border' },
              ...activeProfile.relays.map((url) => {
                const status = relayStatuses.get(url);
                const statusColor = status === 'connected' ? 'bg-emerald-500'
                  : status === 'connecting' ? 'bg-amber-500 animate-pulse'
                  : 'bg-muted-foreground/30';
                const statusText = status || 'idle';

                return createElement('div', {
                  key: url,
                  className: 'px-5 py-3 flex items-center justify-between gap-3',
                },
                  createElement('div', { className: 'flex items-center gap-3 min-w-0' },
                    createElement('span', { className: `w-2 h-2 rounded-full shrink-0 ${statusColor}` }),
                    createElement('div', { className: 'min-w-0' },
                      createElement('p', { className: 'text-sm font-mono truncate' }, url),
                      createElement('p', { className: 'text-[11px] text-muted-foreground' }, statusText),
                    ),
                  ),
                  createElement(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    className: 'text-destructive/50 hover:text-destructive shrink-0',
                    onClick: () => removeRelayFromProfile(activeProfile.id, url),
                  }, 'Remove'),
                );
              }),
            )
          : createElement('div', { className: 'px-5 py-12 text-center' },
              createElement('p', { className: 'text-sm text-muted-foreground' }, 'No relays in this profile yet.'),
              createElement('p', { className: 'text-xs text-muted-foreground/60 mt-1' }, 'Add a relay above or discover relays on the network.'),
            ),
      ),

      // Help text
      createElement('div', { className: 'rounded-xl border border-border p-5 bg-muted/20' },
        createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'How profiles work'),
        createElement('div', { className: 'space-y-1.5 text-xs text-muted-foreground' },
          createElement('p', null, '\u{1F4E4} ', createElement('strong', null, 'Outbox'), ' \u2014 Relays you publish to. Your posts are sent here.'),
          createElement('p', null, '\u{1F4E5} ', createElement('strong', null, 'Inbox'), ' \u2014 Relays you read from. Your feed pulls events from here.'),
          createElement('p', null, '\u{1F50E} ', createElement('strong', null, 'Indexers'), ' \u2014 Relays that index profiles and events for discovery.'),
          createElement('p', null, '\u{1F3F7}\uFE0F ', createElement('strong', null, 'Custom profiles'), ' \u2014 Create unlimited collections for different communities, topics, or relay sets you want to explore.'),
        ),
      ),
    );
  }
}
