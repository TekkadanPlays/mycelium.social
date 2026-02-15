import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import type { NostrEvent } from '../../nostr/event';
import { PostCard } from './PostCard';
import { getFeedState, subscribeFeed, setSort, setFeedMode, loadFeed, loadMore, flushNewPosts } from '../store/feed';
import type { FeedSort, FeedMode } from '../store/feed';
import { getAuthState } from '../store/auth';
import { getContactsState } from '../store/contacts';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';

interface FeedLocalState {
  posts: NostrEvent[];
  isLoading: boolean;
  sort: FeedSort;
  mode: FeedMode;
  eoseReceived: boolean;
  newPostsCount: number;
}

export class SortTabs extends Component<{ sort: FeedSort; onSort: (s: FeedSort) => void }> {
  render() {
    const { sort, onSort } = this.props;
    const tabs: { value: FeedSort; label: string; icon: string }[] = [
      { value: 'hot', label: 'Hot', icon: '\u{1F525}' },
      { value: 'new', label: 'New', icon: '\u2728' },
      { value: 'top', label: 'Top', icon: '\u{1F4C8}' },
    ];

    return createElement('div', { className: 'flex items-center gap-1' },
      ...tabs.map((tab) =>
        createElement('button', {
          key: tab.value,
          onClick: () => onSort(tab.value),
          className: `px-3 py-1.5 text-sm rounded-md transition-colors ${
            sort === tab.value
              ? 'bg-accent text-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
          }`,
        }, `${tab.icon} ${tab.label}`),
      ),
    );
  }
}

export class Feed extends Component<{}, FeedLocalState> {
  private unsub: (() => void) | null = null;
  declare state: FeedLocalState;

  constructor(props: {}) {
    super(props);
    const s = getFeedState();
    this.state = {
      posts: s.posts,
      isLoading: s.isLoading,
      sort: s.sort,
      mode: s.mode,
      eoseReceived: s.eoseReceived,
      newPostsCount: s.newPostsBuffer.length,
    };
  }

  componentDidMount() {
    this.unsub = subscribeFeed(() => {
      const s = getFeedState();
      this.setState({
        posts: s.posts,
        isLoading: s.isLoading,
        sort: s.sort,
        mode: s.mode,
        eoseReceived: s.eoseReceived,
        newPostsCount: s.newPostsBuffer.length,
      });
    });
    loadFeed();
  }

  componentWillUnmount() {
    this.unsub?.();
  }

  handleSort = (sort: FeedSort) => {
    setSort(sort);
  };

  render() {
    const { posts, isLoading, sort, mode, eoseReceived, newPostsCount } = this.state;
    const isLoggedIn = !!getAuthState().pubkey;
    const hasFollows = getContactsState().following.size > 0;

    return createElement('div', { className: 'space-y-3' },
      // Feed mode + sort tabs
      createElement('div', {
        className: 'rounded-lg border border-border px-3 py-2 flex items-center justify-between flex-wrap gap-2',
      },
        // Mode tabs (left)
        isLoggedIn
          ? createElement('div', { className: 'flex items-center gap-1' },
              createElement('button', {
                onClick: () => setFeedMode('global'),
                className: `px-3 py-1.5 text-sm rounded-md transition-colors ${
                  mode === 'global' ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                }`,
              }, '\u{1F30D} Global'),
              createElement('button', {
                onClick: () => setFeedMode('following'),
                disabled: !hasFollows,
                className: `px-3 py-1.5 text-sm rounded-md transition-colors ${
                  mode === 'following' ? 'bg-accent text-foreground font-medium'
                  : !hasFollows ? 'text-muted-foreground/30 cursor-not-allowed'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                }`,
                title: !hasFollows ? 'Follow some people first' : '',
              }, '\u{1F465} Following'),
            )
          : null,
        // Sort tabs (right)
        createElement(SortTabs, { sort, onSort: this.handleSort }),
      ),

      // New posts banner
      newPostsCount > 0
        ? createElement('button', {
            onClick: flushNewPosts,
            className: 'w-full rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors',
          }, `\u2191 ${newPostsCount} new post${newPostsCount > 1 ? 's' : ''}`)
        : null,

      // Loading
      isLoading && posts.length === 0
        ? createElement('div', { className: 'flex justify-center py-16' },
            createElement(Spinner, null),
          )
        : null,

      // Posts
      posts.length > 0
        ? createElement('div', { className: 'space-y-3' },
            ...posts.map((event: NostrEvent) =>
              createElement(PostCard, { key: event.id, event }),
            ),
          )
        : eoseReceived
          ? createElement('div', { className: 'text-center py-16' },
              createElement('div', { className: 'text-4xl mb-3' }, '\u{1F438}'),
              createElement('p', { className: 'text-sm font-medium text-muted-foreground' }, 'No posts yet'),
              createElement('p', { className: 'text-xs text-muted-foreground mt-1' }, 'Be the first to croak!'),
            )
          : null,

      // Load more button
      posts.length > 0 && eoseReceived && !isLoading
        ? createElement('div', { className: 'flex justify-center pt-2 pb-4' },
            createElement(Button, {
              variant: 'outline',
              onClick: () => loadMore(),
            }, 'Load more'),
          )
        : null,

      // Loading indicator for load-more
      isLoading && posts.length > 0
        ? createElement('div', { className: 'flex justify-center py-4' },
            createElement(Spinner, { size: 'sm' }),
          )
        : null,
    );
  }
}
