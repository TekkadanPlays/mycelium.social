import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import type { NostrEvent } from '../../nostr/event';
import { PostCard } from './PostCard';
import { getFeedState, subscribeFeed, setSort, setFeedMode, loadFeed, loadMore, flushNewPosts } from '../store/feed';
import type { FeedSort, FeedMode } from '../store/feed';
import { getAuthState } from '../store/auth';
import { getContactsState } from '../store/contacts';
import { getBootstrapState, subscribeBootstrap } from '../store/bootstrap';
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

const MODE_TABS: { value: FeedMode; label: string; icon: string }[] = [
  { value: 'global', label: 'Global', icon: '\u{1F30D}' },
  { value: 'following', label: 'Following', icon: '\u{1F465}' },
];

const SORT_TABS: { value: FeedSort; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'hot', label: 'Hot' },
  { value: 'top', label: 'Top' },
];

export class Feed extends Component<{}, FeedLocalState> {
  private unsub: (() => void) | null = null;
  private unsubBootstrap: (() => void) | null = null;
  private feedLoaded = false;
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

  private tryLoadFeed() {
    if (this.feedLoaded) return;
    const auth = getAuthState();
    const bs = getBootstrapState();

    // If logged in, wait for bootstrap to finish (outbox relays + contacts ready)
    if (auth.pubkey) {
      if (bs.phase === 'ready' || bs.phase === 'error') {
        this.feedLoaded = true;
        loadFeed();
      }
      // else: still bootstrapping, wait for next notify
    } else {
      // Not logged in — load global feed immediately
      this.feedLoaded = true;
      loadFeed();
    }
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

    // Wait for bootstrap to be ready before loading feed
    this.unsubBootstrap = subscribeBootstrap(() => {
      this.tryLoadFeed();
    });

    this.tryLoadFeed();
  }

  componentWillUnmount() {
    this.unsub?.();
    this.unsubBootstrap?.();
  }

  render() {
    const { posts, isLoading, sort, mode, eoseReceived, newPostsCount } = this.state;
    const isLoggedIn = !!getAuthState().pubkey;
    const hasFollows = getContactsState().following.size > 0;

    return createElement('div', { className: 'space-y-4' },
      // Sticky feed controls
      createElement('div', {
        className: 'sticky top-14 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      },
        createElement('div', { className: 'flex items-center justify-between gap-2' },
          // Mode tabs (left)
          createElement('div', { className: 'flex items-center gap-1' },
            ...MODE_TABS.map((tab) => {
              const isActive = mode === tab.value;
              const disabled = tab.value === 'following' && (!isLoggedIn || !hasFollows);
              return createElement('button', {
                key: tab.value,
                onClick: () => !disabled && setFeedMode(tab.value),
                disabled,
                className: [
                  'px-3 py-1.5 text-sm rounded-lg transition-colors font-medium',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : disabled
                      ? 'text-muted-foreground/30 cursor-not-allowed'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                ].join(' '),
                title: disabled ? 'Follow some people first' : '',
              }, tab.icon + ' ' + tab.label);
            }),
          ),
          // Sort tabs (right)
          createElement('div', { className: 'flex items-center gap-0.5 bg-muted/50 rounded-lg p-0.5' },
            ...SORT_TABS.map((tab) =>
              createElement('button', {
                key: tab.value,
                onClick: () => setSort(tab.value),
                className: [
                  'px-2.5 py-1 text-xs rounded-md transition-colors font-medium',
                  sort === tab.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                ].join(' '),
              }, tab.label),
            ),
          ),
        ),
      ),

      // New posts banner
      newPostsCount > 0
        ? createElement('button', {
            onClick: flushNewPosts,
            className: 'w-full rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors',
          }, '\u2191 ' + newPostsCount + ' new post' + (newPostsCount > 1 ? 's' : '') + ' \u2014 click to load')
        : null,

      // Loading
      isLoading && posts.length === 0
        ? createElement('div', { className: 'flex flex-col items-center justify-center py-20 gap-3' },
            createElement(Spinner, null),
            createElement('p', { className: 'text-xs text-muted-foreground' }, 'Loading feed...'),
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
          ? createElement('div', { className: 'text-center py-20' },
              createElement('div', { className: 'text-5xl mb-4' }, '\u{1F438}'),
              createElement('p', { className: 'text-base font-semibold text-muted-foreground' }, 'No posts yet'),
              createElement('p', { className: 'text-sm text-muted-foreground/70 mt-1' }, 'Be the first to croak!'),
            )
          : null,

      // Load more
      posts.length > 0 && eoseReceived && !isLoading
        ? createElement('div', { className: 'flex justify-center py-6' },
            createElement(Button, {
              variant: 'outline',
              size: 'lg',
              onClick: () => loadMore(),
              className: 'px-8',
            }, 'Load more'),
          )
        : null,

      // Pagination spinner
      isLoading && posts.length > 0
        ? createElement('div', { className: 'flex justify-center py-6' },
            createElement(Spinner, { size: 'sm' }),
          )
        : null,
    );
  }
}
