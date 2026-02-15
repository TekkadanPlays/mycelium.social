import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import type { NostrEvent } from '../../nostr/event';
import { Kind, createEvent } from '../../nostr/event';
import { buildReplyTags } from '../../nostr/nip10';
import { signWithExtension } from '../../nostr/nip07';
import { summarizeReactions, buildReactionTags } from '../../nostr/nip25';
import { getPool } from '../store/relay';
import { getAuthState } from '../store/auth';
import { getProfile, fetchProfile, subscribeProfiles } from '../store/profiles';
import { npubEncode, shortenNpub } from '../../nostr/utils';
import { ContentRenderer } from '../components/ContentRenderer';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
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
  authorPicture: string;
}

function formatRelativeTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(timestamp * 1000).toLocaleDateString();
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
      authorPicture: '',
    };
  }

  componentDidMount() {
    this.unsubProfiles = subscribeProfiles(() => this.updateAuthor());
    this.loadPost();
  }

  componentWillUnmount() {
    this.unsubProfiles?.();
  }

  updateAuthor() {
    if (!this.state.post) return;
    const profile = getProfile(this.state.post.pubkey);
    this.setState({
      ...this.state,
      authorName: profile?.displayName || profile?.name || shortenNpub(npubEncode(this.state.post.pubkey)),
      authorPicture: profile?.picture || '',
    });
  }

  loadPost() {
    const pool = getPool();
    const eventId = this.props.match.params.id;

    pool.subscribe(
      [{ ids: [eventId] }],
      (event) => {
        this.setState({ ...this.state, post: event, isLoading: false });
        fetchProfile(event.pubkey);
        this.updateAuthor();
      },
      () => {
        if (!this.state.post) this.setState({ ...this.state, isLoading: false });
      },
    );

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

    pool.subscribe(
      [{ kinds: [Kind.Reaction], '#e': [eventId] }],
      (reaction) => {
        if (this.state.reactions.some((r) => r.id === reaction.id)) return;
        this.setState({ ...this.state, reactions: [...this.state.reactions, reaction] });
      },
    );
  }

  handleReplyInput = (e: Event) => {
    this.setState({ ...this.state, replyContent: (e.target as HTMLTextAreaElement).value });
  };

  handleReply = async () => {
    const auth = getAuthState();
    if (!auth.pubkey || !this.state.post || !this.state.replyContent.trim()) return;

    this.setState({ ...this.state, isReplying: true });
    try {
      const tags = buildReplyTags(this.state.post, this.state.post);
      const unsigned = createEvent(Kind.Text, this.state.replyContent.trim(), tags, auth.pubkey);
      const signed = await signWithExtension(unsigned);
      await getPool().publish(signed);
      this.setState({ ...this.state, replyContent: '', isReplying: false });
    } catch (err) {
      console.error('Reply failed:', err);
      this.setState({ ...this.state, isReplying: false });
    }
  };

  async vote(content: string) {
    const auth = getAuthState();
    if (!auth.pubkey || !this.state.post) return;
    try {
      const tags = buildReactionTags(this.state.post);
      const unsigned = createEvent(Kind.Reaction, content, tags, auth.pubkey);
      const signed = await signWithExtension(unsigned);
      await getPool().publish(signed);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  }

  render() {
    const { post, replies, reactions, replyContent, isLoading, isReplying, authorName, authorPicture } = this.state;
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
        createElement(Link, { to: '/feed', className: 'inline-block mt-3 text-xs text-primary hover:underline' }, '\u2190 Back to feed'),
      );
    }

    const summary = summarizeReactions(reactions, auth.pubkey || undefined);
    const userLiked = summary.userReaction === '+' || summary.userReaction === '';
    const userDisliked = summary.userReaction === '-';
    const initial = (authorName || '?')[0].toUpperCase();

    return createElement('div', { className: 'space-y-4 max-w-2xl' },
      // Back link
      createElement(Link, {
        to: '/feed',
        className: 'inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors',
      }, '\u2190 Back to feed'),

      // Main post
      createElement('div', { className: 'rounded-xl border border-border p-5' },
        // Author
        createElement('div', { className: 'flex items-center gap-3 mb-4' },
          createElement(Link, { to: `/u/${post.pubkey}`, className: 'shrink-0' },
            createElement(Avatar, { className: 'size-10' },
              authorPicture
                ? createElement(AvatarImage, { src: authorPicture, alt: authorName })
                : null,
              createElement(AvatarFallback, null, initial),
            ),
          ),
          createElement('div', null,
            createElement(Link, {
              to: `/u/${post.pubkey}`,
              className: 'text-sm font-semibold hover:underline',
            }, authorName),
            createElement('p', {
              className: 'text-xs text-muted-foreground',
              title: new Date(post.created_at * 1000).toLocaleString(),
            }, formatRelativeTime(post.created_at)),
          ),
        ),

        // Content (full, no clamp)
        createElement('div', { className: 'text-sm leading-relaxed' },
          createElement(ContentRenderer, { content: post.content }),
        ),

        // Action bar
        createElement('div', { className: 'flex items-center gap-1 mt-4 pt-3 border-t border-border -ml-1.5' },
          createElement('button', {
            onClick: () => this.vote('+'),
            disabled: !auth.pubkey,
            className: `inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
              userLiked ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            } disabled:opacity-30`,
          }, '\u25B2', summary.likes > 0 ? String(summary.likes) : null),
          createElement('button', {
            onClick: () => this.vote('-'),
            disabled: !auth.pubkey,
            className: `inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
              userDisliked ? 'text-destructive bg-destructive/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            } disabled:opacity-30`,
          }, '\u25BC', summary.dislikes > 0 ? String(summary.dislikes) : null),
          createElement('span', { className: 'inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-muted-foreground' },
            '\u{1F4AC}', replies.length > 0 ? String(replies.length) : '0',
          ),
          createElement('button', {
            className: 'inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors ml-auto',
            onClick: () => navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`),
          }, '\u{1F517} Copy link'),
        ),
      ),

      // Reply composer
      auth.pubkey
        ? createElement('div', { className: 'rounded-xl border border-border p-4' },
            createElement(Textarea, {
              value: replyContent,
              onInput: this.handleReplyInput,
              onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); this.handleReply(); } },
              placeholder: 'Write a reply... (Ctrl+Enter to post)',
              rows: 3,
              className: 'resize-none min-h-[60px]',
            }),
            createElement('div', { className: 'flex items-center justify-between mt-3' },
              createElement('span', { className: 'text-xs text-muted-foreground/50' },
                replyContent.length > 0 ? `${replyContent.length} characters` : '',
              ),
              createElement(Button, {
                onClick: this.handleReply,
                disabled: isReplying || !replyContent.trim(),
                size: 'sm',
              }, isReplying ? 'Posting...' : 'Reply'),
            ),
          )
        : null,

      // Threaded replies
      replies.length > 0
        ? createElement('div', { className: 'space-y-0' },
            createElement('p', { className: 'text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3' },
              `${replies.length} ${replies.length === 1 ? 'Reply' : 'Replies'}`,
            ),
            ...replies.map((reply, idx) => {
              const rProfile = getProfile(reply.pubkey);
              const rName = rProfile?.displayName || rProfile?.name || shortenNpub(npubEncode(reply.pubkey));
              const rPicture = rProfile?.picture || '';
              const rInitial = (rName || '?')[0].toUpperCase();
              const isLast = idx === replies.length - 1;

              return createElement('div', {
                key: reply.id,
                className: 'flex gap-3',
              },
                // Thread line + avatar
                createElement('div', { className: 'flex flex-col items-center shrink-0' },
                  createElement(Link, { to: `/u/${reply.pubkey}` },
                    createElement(Avatar, { className: 'size-8' },
                      rPicture
                        ? createElement(AvatarImage, { src: rPicture, alt: rName })
                        : null,
                      createElement(AvatarFallback, { className: 'text-[10px]' }, rInitial),
                    ),
                  ),
                  !isLast
                    ? createElement('div', { className: 'w-px flex-1 bg-border mt-2' })
                    : null,
                ),

                // Reply content
                createElement('div', { className: `flex-1 min-w-0 pb-4 ${isLast ? '' : 'border-b-0'}` },
                  createElement('div', { className: 'flex items-center gap-1.5 mb-1' },
                    createElement(Link, {
                      to: `/u/${reply.pubkey}`,
                      className: 'text-sm font-semibold hover:underline',
                    }, rName),
                    createElement('span', { className: 'text-muted-foreground/40 text-xs' }, '\u00B7'),
                    createElement('span', {
                      className: 'text-xs text-muted-foreground',
                      title: new Date(reply.created_at * 1000).toLocaleString(),
                    }, formatRelativeTime(reply.created_at)),
                  ),
                  createElement('div', { className: 'text-sm' },
                    createElement(ContentRenderer, { content: reply.content }),
                  ),
                  // Reply action — click to open this reply as its own thread
                  createElement(Link, {
                    to: `/post/${reply.id}`,
                    className: 'inline-flex items-center gap-1 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors',
                  }, '\u{1F4AC} View thread'),
                ),
              );
            }),
          )
        : !isLoading
          ? createElement('div', { className: 'text-center py-10' },
              createElement('p', { className: 'text-sm text-muted-foreground' }, 'No replies yet. Be the first!'),
            )
          : null,
    );
  }
}
