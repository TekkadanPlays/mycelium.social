import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import type { NostrEvent } from '../../nostr/event';
import { Kind, createEvent } from '../../nostr/event';
import { signWithExtension } from '../../nostr/nip07';
import { summarizeReactions, buildReactionTags } from '../../nostr/nip25';
import { getProfile, fetchProfile, subscribeProfiles } from '../store/profiles';
import { getFeedState, subscribeFeed } from '../store/feed';
import { getAuthState } from '../store/auth';
import { getPool } from '../store/relay';
import { npubEncode, shortenNpub } from '../../nostr/utils';
import { ContentRenderer } from './ContentRenderer';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';

interface PostCardProps {
  event: NostrEvent;
  compact?: boolean;
}

interface PostCardState {
  profileName: string;
  profilePicture: string;
  reactions: NostrEvent[];
  isVoting: boolean;
}

export class PostCard extends Component<PostCardProps, PostCardState> {
  private unsubProfiles: (() => void) | null = null;
  private unsubFeed: (() => void) | null = null;
  declare state: PostCardState;

  constructor(props: PostCardProps) {
    super(props);
    this.state = {
      profileName: '',
      profilePicture: '',
      reactions: [],
      isVoting: false,
    };
  }

  componentDidMount() {
    fetchProfile(this.props.event.pubkey);
    this.unsubProfiles = subscribeProfiles(() => this.updateProfile());
    this.unsubFeed = subscribeFeed(() => this.updateReactions());
    this.updateProfile();
    this.updateReactions();
  }

  componentWillUnmount() {
    this.unsubProfiles?.();
    this.unsubFeed?.();
  }

  updateProfile() {
    const profile = getProfile(this.props.event.pubkey);
    this.setState({
      ...this.state,
      profileName: profile?.displayName || profile?.name || shortenNpub(npubEncode(this.props.event.pubkey)),
      profilePicture: profile?.picture || '',
    });
  }

  updateReactions() {
    const feed = getFeedState();
    const reactions = feed.reactions.get(this.props.event.id) || [];
    this.setState({ ...this.state, reactions });
  }

  async vote(content: string) {
    const auth = getAuthState();
    if (!auth.pubkey || this.state.isVoting) return;

    this.setState({ ...this.state, isVoting: true });
    try {
      const tags = buildReactionTags(this.props.event);
      const unsigned = createEvent(Kind.Reaction, content, tags, auth.pubkey);
      const signed = await signWithExtension(unsigned);
      const pool = getPool();
      await pool.publish(signed);
    } catch (err) {
      console.error('Vote failed:', err);
    }
    this.setState({ ...this.state, isVoting: false });
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
    const { event, compact } = this.props;
    const { profileName, profilePicture, reactions, isVoting } = this.state;
    const auth = getAuthState();

    const summary = summarizeReactions(reactions, auth.pubkey || undefined);
    const userLiked = summary.userReaction === '+' || summary.userReaction === '';
    const userDisliked = summary.userReaction === '-';
    const initial = (profileName || '?')[0].toUpperCase();
    const replyCount = getFeedState().replyCounts.get(event.id) || 0;

    return createElement('div', {
      className: 'rounded-xl border border-border p-4 hover:border-primary/20 transition-all',
    },
      // Author row
      createElement('div', { className: 'flex items-center gap-2.5 mb-3' },
        createElement(Link, { to: `/u/${event.pubkey}`, className: 'shrink-0' },
          createElement(Avatar, { className: compact ? 'size-7' : 'size-9' },
            profilePicture
              ? createElement(AvatarImage, { src: profilePicture, alt: profileName })
              : null,
            createElement(AvatarFallback, { className: compact ? 'text-[10px]' : 'text-xs' }, initial),
          ),
        ),
        createElement('div', { className: 'flex-1 min-w-0' },
          createElement('div', { className: 'flex items-center gap-1.5' },
            createElement(Link, {
              to: `/u/${event.pubkey}`,
              className: 'text-sm font-semibold hover:underline truncate',
            }, profileName),
            createElement('span', { className: 'text-muted-foreground/40 text-xs' }, '\u00B7'),
            createElement('span', {
              className: 'text-xs text-muted-foreground shrink-0',
              title: new Date(event.created_at * 1000).toLocaleString(),
            }, this.formatTime(event.created_at)),
          ),
        ),
      ),

      // Content — click to open thread
      createElement(Link, {
        to: `/post/${event.id}`,
        className: 'block',
      },
        createElement('div', { className: compact ? 'line-clamp-3' : 'line-clamp-6' },
          createElement(ContentRenderer, { content: event.content }),
        ),
      ),

      // Action bar
      createElement('div', { className: 'flex items-center gap-1 mt-3 -ml-1.5' },
        // Like
        createElement('button', {
          onClick: () => this.vote('+'),
          disabled: isVoting || !auth.pubkey,
          className: `inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
            userLiked
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          } disabled:opacity-30 disabled:pointer-events-none`,
        },
          '\u25B2',
          summary.likes > 0 ? createElement('span', { className: 'tabular-nums' }, String(summary.likes)) : null,
        ),
        // Dislike
        createElement('button', {
          onClick: () => this.vote('-'),
          disabled: isVoting || !auth.pubkey,
          className: `inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
            userDisliked
              ? 'text-destructive bg-destructive/10'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          } disabled:opacity-30 disabled:pointer-events-none`,
        },
          '\u25BC',
          summary.dislikes > 0 ? createElement('span', { className: 'tabular-nums' }, String(summary.dislikes)) : null,
        ),
        // Comments
        createElement(Link, {
          to: `/post/${event.id}`,
          className: 'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
        },
          '\u{1F4AC}',
          replyCount > 0 ? createElement('span', { className: 'tabular-nums' }, String(replyCount)) : null,
        ),
        // Share
        createElement('button', {
          className: 'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors ml-auto',
          onClick: () => navigator.clipboard.writeText(`${window.location.origin}/post/${event.id}`),
        }, '\u{1F517}'),
      ),
    );
  }
}
