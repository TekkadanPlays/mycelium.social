import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import type { NostrEvent } from '../../nostr/event';
import { Kind, createEvent } from '../../nostr/event';
import { signWithExtension } from '../../nostr/nip07';
import { summarizeReactions, buildReactionTags, getReactionType } from '../../nostr/nip25';
import { getProfile, fetchProfile, subscribeProfiles } from '../store/profiles';
import { getFeedState, subscribeFeed } from '../store/feed';
import { getAuthState } from '../store/auth';
import { getPool } from '../store/relay';
import { npubEncode, shortenNpub } from '../../nostr/utils';
import { ContentRenderer } from './ContentRenderer';

interface PostCardProps {
  event: NostrEvent;
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
    const { event } = this.props;
    const { profileName, profilePicture, reactions, isVoting } = this.state;
    const auth = getAuthState();

    const summary = summarizeReactions(reactions, auth.pubkey || undefined);
    const userLiked = summary.userReaction === '+' || summary.userReaction === '';
    const userDisliked = summary.userReaction === '-';

    const initial = (profileName || '?')[0].toUpperCase();

    return createElement('div', {
      className: 'rounded-lg border border-border overflow-hidden hover:border-border/80 transition-all group',
    },
      createElement('div', { className: 'flex' },
        // Vote column
        createElement('div', {
          className: 'flex flex-col items-center gap-0.5 py-3 px-2.5 bg-muted/30',
        },
          createElement('button', {
            onClick: () => this.vote('+'),
            disabled: isVoting || !auth.pubkey,
            title: 'Upvote',
            className: `p-1 rounded transition-colors ${
              userLiked ? 'text-upvote' : 'text-muted-foreground/40 hover:text-upvote'
            } disabled:opacity-30 disabled:pointer-events-none`,
          }, '\u25B2'),
          createElement('span', {
            className: `text-xs font-semibold tabular-nums ${
              summary.score > 0 ? 'text-upvote' : summary.score < 0 ? 'text-downvote' : 'text-muted-foreground'
            }`,
          }, summary.score),
          createElement('button', {
            onClick: () => this.vote('-'),
            disabled: isVoting || !auth.pubkey,
            title: 'Downvote',
            className: `p-1 rounded transition-colors ${
              userDisliked ? 'text-downvote' : 'text-muted-foreground/40 hover:text-downvote'
            } disabled:opacity-30 disabled:pointer-events-none`,
          }, '\u25BC'),
        ),

        // Content
        createElement('div', { className: 'flex-1 min-w-0 p-3' },
          // Author row
          createElement('div', { className: 'flex items-center gap-2 mb-2' },
            // Avatar
            profilePicture
              ? createElement('img', {
                  src: profilePicture,
                  alt: '',
                  className: 'w-6 h-6 rounded-full object-cover',
                })
              : createElement('div', {
                  className: 'w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center',
                },
                  createElement('span', { className: 'text-[10px] font-semibold text-primary' }, initial),
                ),
            createElement(Link, {
              to: `/u/${event.pubkey}`,
              className: 'text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
            }, profileName),
            createElement('span', { className: 'text-muted-foreground/30' }, '\u00B7'),
            createElement('span', {
              className: 'text-xs text-muted-foreground',
              title: new Date(event.created_at * 1000).toLocaleString(),
            }, this.formatTime(event.created_at)),
          ),

          // Content
          createElement('div', { className: 'line-clamp-4' },
            createElement(ContentRenderer, { content: event.content }),
          ),

          // Actions
          createElement('div', { className: 'flex items-center gap-4 mt-3 pt-2 border-t border-border' },
            createElement(Link, {
              to: `/post/${event.id}`,
              className: 'text-xs text-muted-foreground hover:text-foreground transition-colors',
            }, `\u{1F4AC} ${(() => { const feed = getFeedState(); const c = feed.replyCounts.get(event.id); return c ? `${c} Repl${c === 1 ? 'y' : 'ies'}` : 'Comments'; })()}`),
            createElement('button', {
              className: 'text-xs text-muted-foreground hover:text-foreground transition-colors',
              onClick: async () => {
                const auth = getAuthState();
                if (!auth.pubkey) return;
                try {
                  const unsigned = createEvent(Kind.Repost, JSON.stringify(event), [['e', event.id, ''], ['p', event.pubkey]], auth.pubkey);
                  const signed = await signWithExtension(unsigned);
                  await getPool().publish(signed);
                } catch (err) { console.error('Repost error:', err); }
              },
            }, '\u{1F501} Repost'),
            createElement('button', {
              className: 'text-xs text-muted-foreground hover:text-foreground transition-colors',
              onClick: () => navigator.clipboard.writeText(`${window.location.origin}/post/${event.id}`),
            }, '\u{1F517} Share'),
          ),
        ),
      ),
    );
  }
}
