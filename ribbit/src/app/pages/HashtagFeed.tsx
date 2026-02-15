import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import type { NostrEvent } from '../../nostr/event';
import { Kind } from '../../nostr/event';
import { isRootNote } from '../../nostr/nip10';
import { PostCard } from '../components/PostCard';
import { getPool } from '../store/relay';
import { Spinner } from '../ui/Spinner';

interface HashtagFeedProps {
  match: { params: { tag: string } };
}

interface HashtagFeedState {
  posts: NostrEvent[];
  isLoading: boolean;
}

export class HashtagFeed extends Component<HashtagFeedProps, HashtagFeedState> {
  declare state: HashtagFeedState;

  constructor(props: HashtagFeedProps) {
    super(props);
    this.state = { posts: [], isLoading: true };
  }

  componentDidMount() {
    this.loadTag();
  }

  loadTag() {
    const tag = this.props.match.params.tag.toLowerCase();
    const pool = getPool();
    const seen = new Set<string>();

    const sub = pool.subscribe(
      [{ kinds: [Kind.Text], '#t': [tag], limit: 50 }],
      (event) => {
        if (seen.has(event.id)) return;
        if (!isRootNote(event)) return;
        seen.add(event.id);
        this.setState({
          posts: [...this.state.posts, event].sort((a, b) => b.created_at - a.created_at),
        });
      },
      () => {
        sub.unsubscribe();
        this.setState({ ...this.state, isLoading: false });
      },
    );
  }

  render() {
    const { posts, isLoading } = this.state;
    const tag = this.props.match.params.tag;

    return createElement('div', { className: 'space-y-3' },
      createElement(Link, {
        to: '/',
        className: 'inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2',
      }, '\u2190 Back to feed'),

      createElement('h1', { className: 'text-lg font-bold tracking-tight' }, `#${tag}`),

      isLoading && posts.length === 0
        ? createElement('div', { className: 'flex justify-center py-16' },
            createElement(Spinner, null),
          )
        : null,

      posts.length > 0
        ? createElement('div', { className: 'space-y-3' },
            ...posts.map((event) => createElement(PostCard, { key: event.id, event })),
          )
        : !isLoading
          ? createElement('div', { className: 'text-center py-16' },
              createElement('div', { className: 'text-4xl mb-3' }, '#'),
              createElement('p', { className: 'text-sm font-medium text-muted-foreground' }, `No posts tagged #${tag}`),
            )
          : null,
    );
  }
}
