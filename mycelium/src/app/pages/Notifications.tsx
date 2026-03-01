import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { getAuthState } from '../store/auth';
import { getProfile, subscribeProfiles, getDisplayName } from '../store/profiles';
import {
  getNotificationsState,
  subscribeNotifications,
  loadNotifications,
  markAllSeen,
} from '../store/notifications';
import type { Notification, NotifType } from '../store/notifications';
import { Spinner } from '../ui/Spinner';
import { Badge } from '../ui/Badge';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TabKey = 'all' | NotifType;

const TABS: { key: TabKey; label: string; icon: string; color: string }[] = [
  { key: 'all',      label: 'All',       icon: '\u{1F514}', color: 'text-foreground' },
  { key: 'reaction', label: 'Reactions',  icon: '\u2764\uFE0F', color: 'text-rose-500' },
  { key: 'reply',    label: 'Replies',    icon: '\u{1F4AC}', color: 'text-blue-500' },
  { key: 'mention',  label: 'Mentions',   icon: '\u{1F4E2}', color: 'text-amber-500' },
  { key: 'repost',   label: 'Reposts',    icon: '\u{1F501}', color: 'text-emerald-500' },
];

const LABEL_MAP: Record<NotifType, string> = {
  reaction: 'reacted to your post',
  reply: 'replied to your post',
  mention: 'mentioned you',
  repost: 'reposted your note',
};

const ACCENT_MAP: Record<NotifType, string> = {
  reaction: 'border-l-rose-500/40',
  reply: 'border-l-blue-500/40',
  mention: 'border-l-amber-500/40',
  repost: 'border-l-emerald-500/40',
};

const ICON_BG_MAP: Record<NotifType, string> = {
  reaction: 'bg-rose-500/10 text-rose-500',
  reply: 'bg-blue-500/10 text-blue-500',
  mention: 'bg-amber-500/10 text-amber-500',
  repost: 'bg-emerald-500/10 text-emerald-500',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface NotificationsPageState {
  notifications: Notification[];
  isLoading: boolean;
  activeTab: TabKey;
  lastSeenTimestamp: number;
}

export class Notifications extends Component<{}, NotificationsPageState> {
  private unsubProfiles: (() => void) | null = null;
  private unsubNotifs: (() => void) | null = null;
  declare state: NotificationsPageState;

  constructor(props: {}) {
    super(props);
    const ns = getNotificationsState();
    this.state = {
      notifications: ns.notifications,
      isLoading: ns.isLoading,
      activeTab: 'all',
      lastSeenTimestamp: ns.lastSeenTimestamp,
    };
  }

  componentDidMount() {
    this.unsubProfiles = subscribeProfiles(() => this.forceUpdate());
    this.unsubNotifs = subscribeNotifications(() => {
      const ns = getNotificationsState();
      this.setState({
        ...this.state,
        notifications: ns.notifications,
        isLoading: ns.isLoading,
        lastSeenTimestamp: ns.lastSeenTimestamp,
      });
    });
    // Load notifications if not already loaded
    const ns = getNotificationsState();
    if (ns.notifications.length === 0 && !ns.isLoading) {
      loadNotifications();
    }
    // Mark as seen when viewing
    markAllSeen();
  }

  componentWillUnmount() {
    this.unsubProfiles?.();
    this.unsubNotifs?.();
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

  getFiltered(): Notification[] {
    const { notifications, activeTab } = this.state;
    if (activeTab === 'all') return notifications;
    return notifications.filter((n) => n.type === activeTab);
  }

  getCounts(): Record<TabKey, number> {
    const { notifications } = this.state;
    return {
      all: notifications.length,
      reaction: notifications.filter((n) => n.type === 'reaction').length,
      reply: notifications.filter((n) => n.type === 'reply').length,
      mention: notifications.filter((n) => n.type === 'mention').length,
      repost: notifications.filter((n) => n.type === 'repost').length,
    };
  }

  render() {
    const auth = getAuthState();
    const { isLoading, activeTab } = this.state;

    if (!auth.pubkey) {
      return createElement('div', { className: 'flex flex-col items-center justify-center min-h-[60vh]' },
        createElement('div', { className: 'text-5xl mb-4' }, '\u{1F514}'),
        createElement('p', { className: 'text-lg font-medium text-muted-foreground' }, 'Sign in to see notifications'),
      );
    }

    const filtered = this.getFiltered();
    const counts = this.getCounts();

    return createElement('div', { className: 'flex flex-1 flex-col' },
      // ── Sticky tab bar ──
      createElement('div', { className: 'sticky top-14 z-30 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60' },
        createElement('div', { className: 'mx-auto max-w-3xl px-4 sm:px-6' },
          createElement('div', { className: 'flex items-center gap-1 overflow-x-auto -mb-px' },
            ...TABS.map((tab) =>
              createElement('button', {
                key: tab.key,
                type: 'button',
                onClick: () => this.setState({ ...this.state, activeTab: tab.key }),
                className: [
                  'whitespace-nowrap border-b-2 py-3 px-3 text-sm font-medium transition-colors cursor-pointer flex items-center gap-2',
                  activeTab === tab.key
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
                ].join(' '),
              },
                createElement('span', null, tab.icon),
                tab.label,
                counts[tab.key] > 0
                  ? createElement('span', {
                      className: 'text-[10px] font-semibold rounded-full px-1.5 py-0.5 leading-none ' +
                        (activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'),
                    }, String(counts[tab.key]))
                  : null,
              ),
            ),
          ),
        ),
      ),

      // ── Content ──
      createElement('div', { className: 'flex-1' },
        createElement('div', { className: 'mx-auto max-w-3xl px-4 sm:px-6 py-4' },

          isLoading
            ? createElement('div', { className: 'flex justify-center py-16' },
                createElement(Spinner, null),
              )
            : null,

          filtered.length > 0
            ? createElement('div', { className: 'space-y-2' },
                ...filtered.map((notif) => {
                  const name = getDisplayName(notif.event.pubkey);
                  const initial = (name || '?')[0].toUpperCase();
                  const profile = getProfile(notif.event.pubkey);
                  const isUnseen = notif.event.created_at > this.state.lastSeenTimestamp;

                  return createElement('div', {
                    key: notif.id,
                    className: 'rounded-lg border border-l-[3px] ' + ACCENT_MAP[notif.type] + ' p-4 flex items-start gap-3 transition-colors '
                      + (isUnseen ? 'bg-primary/5 border-border' : 'border-border hover:bg-accent/30'),
                  },
                    // Type icon
                    createElement('div', {
                      className: 'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm ' + ICON_BG_MAP[notif.type],
                    }, TABS.find((t) => t.key === notif.type)?.icon || ''),

                    // Avatar
                    profile?.picture
                      ? createElement('img', { src: profile.picture, alt: '', className: 'w-8 h-8 rounded-full object-cover shrink-0' })
                      : createElement('div', { className: 'w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0' },
                          createElement('span', { className: 'text-xs font-semibold text-primary' }, initial),
                        ),

                    // Content
                    createElement('div', { className: 'flex-1 min-w-0' },
                      createElement('p', { className: 'text-sm' },
                        createElement(Link, {
                          to: `/u/${notif.event.pubkey}`,
                          className: 'font-semibold text-foreground hover:text-primary transition-colors',
                        }, name),
                        createElement('span', { className: 'text-muted-foreground' }, ' ' + LABEL_MAP[notif.type]),
                      ),
                      // Preview content for replies/mentions
                      notif.type === 'reply' || notif.type === 'mention'
                        ? createElement(Link, {
                            to: notif.targetId ? `/post/${notif.targetId}` : '#',
                            className: 'block mt-1.5 text-xs text-muted-foreground line-clamp-2 hover:text-foreground/60 transition-colors leading-relaxed',
                          }, notif.event.content.slice(0, 200) + (notif.event.content.length > 200 ? '...' : ''))
                        : null,
                      // Reaction content
                      notif.type === 'reaction' && notif.event.content && notif.event.content !== '+'
                        ? createElement('span', { className: 'text-lg mt-1 inline-block' }, notif.event.content)
                        : null,
                    ),

                    // Time
                    createElement('span', { className: 'text-xs text-muted-foreground/50 shrink-0 mt-0.5' },
                      this.formatTime(notif.event.created_at),
                    ),
                  );
                }),
              )
            : !isLoading
              ? createElement('div', { className: 'text-center py-20' },
                  createElement('div', { className: 'text-5xl mb-4' },
                    activeTab === 'all' ? '\u{1F389}' : TABS.find((t) => t.key === activeTab)?.icon || '',
                  ),
                  createElement('p', { className: 'text-sm font-medium text-muted-foreground' },
                    activeTab === 'all' ? 'All caught up!' : 'No ' + activeTab + 's yet.',
                  ),
                )
              : null,
        ),
      ),
    );
  }
}
