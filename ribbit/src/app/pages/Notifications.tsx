import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import type { NostrEvent } from '../../nostr/event';
import { Kind } from '../../nostr/event';
import { getPool } from '../store/relay';
import { getAuthState } from '../store/auth';
import { getProfile, fetchProfile, subscribeProfiles, getDisplayName } from '../store/profiles';
import { Spinner } from '../ui/Spinner';

interface Notification {
  id: string;
  type: 'reply' | 'reaction' | 'mention' | 'repost';
  event: NostrEvent;
  targetId: string | null;
}

interface NotificationsState {
  notifications: Notification[];
  isLoading: boolean;
}

export class Notifications extends Component<{}, NotificationsState> {
  private unsubProfiles: (() => void) | null = null;
  declare state: NotificationsState;

  constructor(props: {}) {
    super(props);
    this.state = {
      notifications: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.unsubProfiles = subscribeProfiles(() => this.forceUpdate());
    this.loadNotifications();
  }

  componentWillUnmount() {
    this.unsubProfiles?.();
  }

  loadNotifications() {
    const auth = getAuthState();
    if (!auth.pubkey) {
      this.setState({ notifications: [], isLoading: false });
      return;
    }

    const pool = getPool();
    const seen = new Set<string>();
    const notifs: Notification[] = [];

    // Fetch reactions to my posts, replies mentioning me, reposts of my content
    const sub = pool.subscribe(
      [
        { kinds: [Kind.Reaction], '#p': [auth.pubkey], limit: 50 },
        { kinds: [Kind.Text], '#p': [auth.pubkey], limit: 50 },
        { kinds: [6], '#p': [auth.pubkey], limit: 20 },
      ],
      (event) => {
        if (seen.has(event.id)) return;
        if (event.pubkey === auth.pubkey) return; // skip own events
        seen.add(event.id);
        fetchProfile(event.pubkey);

        const eTag = event.tags.find((t) => t[0] === 'e');
        const targetId = eTag ? eTag[1] : null;

        let type: Notification['type'] = 'mention';
        if (event.kind === Kind.Reaction) type = 'reaction';
        else if (event.kind === 6) type = 'repost';
        else if (event.kind === Kind.Text && targetId) type = 'reply';

        notifs.push({ id: event.id, type, event, targetId });

        // Sort by time, newest first
        notifs.sort((a, b) => b.event.created_at - a.event.created_at);

        this.setState({ notifications: [...notifs], isLoading: false });
      },
      () => {
        sub.unsubscribe();
        this.setState({ ...this.state, isLoading: false });
      },
    );
  }

  formatTime(timestamp: number): string {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return new Date(timestamp * 1000).toLocaleDateString();
  }

  render() {
    const auth = getAuthState();
    const { notifications, isLoading } = this.state;

    if (!auth.pubkey) {
      return createElement('div', { className: 'text-center py-16' },
        createElement('div', { className: 'text-4xl mb-3' }, '\u{1F514}'),
        createElement('p', { className: 'text-sm font-medium text-muted-foreground' }, 'Sign in to see notifications'),
      );
    }

    return createElement('div', { className: 'space-y-3' },
      createElement('h1', { className: 'text-lg font-bold tracking-tight' }, 'Notifications'),

      isLoading
        ? createElement('div', { className: 'flex justify-center py-16' },
            createElement(Spinner, null),
          )
        : null,

      notifications.length > 0
        ? createElement('div', { className: 'space-y-1' },
            ...notifications.map((notif) => {
              const name = getDisplayName(notif.event.pubkey);
              const initial = (name || '?')[0].toUpperCase();
              const profile = getProfile(notif.event.pubkey);

              const iconMap = { reaction: '\u2764\uFE0F', reply: '\u{1F4AC}', mention: '\u{1F4E2}', repost: '\u{1F501}' };
              const labelMap = { reaction: 'reacted to your post', reply: 'replied to your post', mention: 'mentioned you', repost: 'reposted your note' };

              return createElement('div', {
                key: notif.id,
                className: 'rounded-lg border border-border p-3 flex items-start gap-3 hover:border-border/80 transition-colors',
              },
                // Avatar
                profile?.picture
                  ? createElement('img', { src: profile.picture, alt: '', className: 'w-7 h-7 rounded-full object-cover shrink-0' })
                  : createElement('div', { className: 'w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0' },
                      createElement('span', { className: 'text-[10px] font-semibold text-primary' }, initial),
                    ),

                // Content
                createElement('div', { className: 'flex-1 min-w-0' },
                  createElement('p', { className: 'text-sm' },
                    createElement('span', null, iconMap[notif.type] + ' '),
                    createElement(Link, {
                      to: `/u/${notif.event.pubkey}`,
                      className: 'font-medium text-foreground/80 hover:text-foreground transition-colors',
                    }, name),
                    createElement('span', { className: 'text-muted-foreground' }, ` ${labelMap[notif.type]}`),
                  ),
                  // Preview content for replies/mentions
                  notif.type === 'reply' || notif.type === 'mention'
                    ? createElement(Link, {
                        to: notif.targetId ? `/post/${notif.targetId}` : '#',
                        className: 'block mt-1 text-xs text-muted-foreground line-clamp-2 hover:text-foreground/60 transition-colors',
                      }, notif.event.content.slice(0, 150) + (notif.event.content.length > 150 ? '...' : ''))
                    : null,
                  // Reaction content
                  notif.type === 'reaction' && notif.event.content && notif.event.content !== '+'
                    ? createElement('span', { className: 'text-sm' }, notif.event.content)
                    : null,
                ),

                // Time
                createElement('span', { className: 'text-xs text-muted-foreground/50 shrink-0' },
                  this.formatTime(notif.event.created_at),
                ),
              );
            }),
          )
        : !isLoading
          ? createElement('div', { className: 'text-center py-16' },
              createElement('div', { className: 'text-4xl mb-3' }, '\u{1F389}'),
              createElement('p', { className: 'text-sm font-medium text-muted-foreground' }, 'All caught up!'),
              createElement('p', { className: 'text-xs text-muted-foreground mt-1' }, 'No notifications yet.'),
            )
          : null,
    );
  }
}
