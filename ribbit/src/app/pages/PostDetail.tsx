import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import type { NostrEvent } from '../../nostr/event';
import { Kind, createEvent } from '../../nostr/event';
import { parseThreadTags, buildReplyTags } from '../../nostr/nip10';
import { signWithExtension } from '../../nostr/nip07';
import { summarizeReactions, buildReactionTags } from '../../nostr/nip25';
import { getPool } from '../store/relay';
import { getAuthState } from '../store/auth';
import { getProfile, fetchProfile, subscribeProfiles } from '../store/profiles';
import { npubEncode, shortenNpub } from '../../nostr/utils';
import { ContentRenderer } from '../components/ContentRenderer';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Spinner } from '../ui/Spinner';

interface PostDetailProps {
  match: { params: { id: string } };
}

interface PostDetailState {
  post: NostrEvent | null;
  replies: NostrEvent[];
  reactions: NostrEvent[];
  replyContent: string;
  isLoading: boolean;
  isReplying: boolean;
  authorName: string;
}

export class PostDetail extends Component<PostDetailProps, PostDetailState> {
  private unsubProfiles: (() => void) | null = null;
  declare state: PostDetailState;

  constructor(props: PostDetailProps) {
    super(props);
    this.state = {
      post: null,
      replies: [],
      reactions: [],
      replyContent: '',
      isLoading: true,
      isReplying: false,
      authorName: '',
    };
  }

  componentDidMount() {
    this.unsubProfiles = subscribeProfiles(() => this.updateAuthorName());
    this.loadPost();
  }

  componentWillUnmount() {
    this.unsubProfiles?.();
  }

  updateAuthorName() {
    if (!this.state.post) return;
    const profile = getProfile(this.state.post.pubkey);
    const name = profile?.displayName || profile?.name || shortenNpub(npubEncode(this.state.post.pubkey));
    this.setState({ ...this.state, authorName: name });
  }

  loadPost() {
    const pool = getPool();
    const eventId = this.props.match.params.id;

    // Fetch the post
    pool.subscribe(
      [{ ids: [eventId] }],
      (event) => {
        this.setState({ ...this.state, post: event, isLoading: false });
        fetchProfile(event.pubkey);
        this.updateAuthorName();
      },
      () => {
        if (!this.state.post) {
          this.setState({ ...this.state, isLoading: false });
        }
      },
    );

    // Fetch replies (kind 1 events that reference this event)
    pool.subscribe(
      [{ kinds: [Kind.Text], '#e': [eventId] }],
      (event) => {
        if (this.state.replies.some((r) => r.id === event.id)) return;
        fetchProfile(event.pubkey);
        this.setState({
          ...this.state,
          replies: [...this.state.replies, event].sort((a, b) => a.created_at - b.created_at),
        });
      },
    );

    // Fetch reactions
    pool.subscribe(
      [{ kinds: [Kind.Reaction], '#e': [eventId] }],
      (reaction) => {
        if (this.state.reactions.some((r) => r.id === reaction.id)) return;
        this.setState({
          ...this.state,
          reactions: [...this.state.reactions, reaction],
        });
      },
    );
  }

  handleReplyInput = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    this.setState({ ...this.state, replyContent: target.value });
  };

  handleReply = async () => {
    const auth = getAuthState();
    if (!auth.pubkey || !this.state.post || !this.state.replyContent.trim()) return;

    this.setState({ ...this.state, isReplying: true });
    try {
      const tags = buildReplyTags(this.state.post, this.state.post);
      const unsigned = createEvent(Kind.Text, this.state.replyContent.trim(), tags, auth.pubkey);
      const signed = await signWithExtension(unsigned);
      const pool = getPool();
      await pool.publish(signed);
      this.setState({ ...this.state, replyContent: '', isReplying: false });
    } catch (err) {
      console.error('Reply failed:', err);
      this.setState({ ...this.state, isReplying: false });
    }
  };

  formatTime(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString();
  }

  render() {
    const { post, replies, reactions, replyContent, isLoading, isReplying, authorName } = this.state;
    const auth = getAuthState();

    if (isLoading) {
      return createElement('div', { className: 'flex justify-center py-16' },
        createElement(Spinner, null),
      );
    }

    if (!post) {
      return createElement('div', { className: 'text-center py-16' },
        createElement('div', { className: 'text-4xl mb-3' }, '\u{1F50D}'),
        createElement('p', { className: 'text-sm font-medium text-muted-foreground' }, 'Post not found'),
        createElement(Link, { to: '/', className: 'inline-block mt-3 text-xs text-primary hover:underline' }, '\u2190 Back to feed'),
      );
    }

    const summary = summarizeReactions(reactions, auth.pubkey || undefined);

    return createElement('div', { className: 'space-y-4' },
      // Back link
      createElement(Link, {
        to: '/',
        className: 'inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2',
      }, '\u2190 Back to feed'),

      // Post card
      createElement('div', { className: 'rounded-lg border border-border p-5' },
        // Author
        createElement('div', { className: 'flex items-center gap-2 mb-4' },
          createElement('div', {
            className: 'w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center',
          },
            createElement('span', { className: 'text-xs font-semibold text-primary' },
              (authorName || '?')[0].toUpperCase(),
            ),
          ),
          createElement('div', null,
            createElement(Link, {
              to: `/u/${post.pubkey}`,
              className: 'text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
            }, authorName),
            createElement('p', { className: 'text-xs text-muted-foreground' }, this.formatTime(post.created_at)),
          ),
        ),
        // Content
        createElement(ContentRenderer, { content: post.content }),
        // Stats
        createElement('div', { className: 'flex items-center gap-4 mt-4 pt-3 border-t border-border' },
          createElement('span', { className: 'text-xs text-muted-foreground' }, `${summary.likes} \u{1F44D}`),
          createElement('span', { className: 'text-xs text-muted-foreground' }, `${summary.dislikes} \u{1F44E}`),
          createElement('span', { className: 'text-xs text-muted-foreground' }, `${replies.length} replies`),
        ),
      ),

      // Reply box
      auth.pubkey
        ? createElement('div', { className: 'rounded-lg border border-border p-4' },
            createElement(Textarea, {
              value: replyContent,
              onInput: this.handleReplyInput,
              placeholder: 'Write a reply...',
              rows: 3,
              className: 'resize-none min-h-[60px]',
            }),
            createElement('div', { className: 'flex justify-end mt-3' },
              createElement(Button, {
                onClick: this.handleReply,
                disabled: isReplying || !replyContent.trim(),
                size: 'sm',
              }, isReplying ? 'Posting...' : 'Reply'),
            ),
          )
        : null,

      // Replies
      replies.length > 0
        ? createElement('div', { className: 'space-y-3' },
            createElement('p', { className: 'text-xs font-semibold tracking-wider uppercase text-muted-foreground' },
              `${replies.length} Replies`,
            ),
            ...replies.map((reply) => {
              const rProfile = getProfile(reply.pubkey);
              const rName = rProfile?.displayName || rProfile?.name || reply.pubkey.slice(0, 8) + '...';
              const rInitial = (rName || '?')[0].toUpperCase();
              return createElement('div', {
                key: reply.id,
                className: 'rounded-lg border border-border p-4',
              },
                createElement('div', { className: 'flex items-center gap-2 mb-2' },
                  createElement('div', {
                    className: 'w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center',
                  },
                    createElement('span', { className: 'text-[9px] font-semibold text-secondary' }, rInitial),
                  ),
                  createElement(Link, {
                    to: `/u/${reply.pubkey}`,
                    className: 'text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
                  }, rName),
                  createElement('span', { className: 'text-muted-foreground/30' }, '\u00B7'),
                  createElement('span', { className: 'text-xs text-muted-foreground' }, this.formatTime(reply.created_at)),
                ),
                createElement(ContentRenderer, { content: reply.content }),
              );
            }),
          )
        : createElement('div', { className: 'text-center py-8 text-xs text-muted-foreground' },
            'No replies yet',
          ),
    );
  }
}
