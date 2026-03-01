import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import type { NostrEvent } from '../../nostr/event';
import { Kind } from '../../nostr/event';
import { PostCard } from '../components/PostCard';
import { getPool } from '../store/relay';
import { getProfile, fetchProfile, fetchProfiles, subscribeProfiles } from '../store/profiles';
import { npubEncode, shortenNpub } from '../../nostr/utils';
import { isRootNote } from '../../nostr/nip10';
import { getAuthState } from '../store/auth';
import { isFollowing, followUser, unfollowUser, subscribeContacts, getContactsState } from '../store/contacts';
import { getCachedAuthorPosts, cacheEvent } from '../api/cache';
import { crawl } from '../store/relay-crawler';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';

type ProfileTab = 'posts' | 'following';
const PAGE_SIZE = 50;

interface UserProfileProps {
  match: { params: { pubkey: string } };
}

interface UserProfileState {
  profile: ReturnType<typeof getProfile>;
  posts: NostrEvent[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  isFollowed: boolean;
  followLoading: boolean;
  activeTab: ProfileTab;
  followList: string[];
  followListLoading: boolean;
}

export class UserProfile extends Component<UserProfileProps, UserProfileState> {
  private unsubProfiles: (() => void) | null = null;
  private unsubContacts: (() => void) | null = null;
  declare state: UserProfileState;

  private seenPostIds: Set<string> = new Set();

  constructor(props: UserProfileProps) {
    super(props);
    this.state = {
      profile: undefined,
      posts: [],
      isLoading: true,
      isLoadingMore: false,
      hasMore: true,
      isFollowed: isFollowing(props.match.params.pubkey),
      followLoading: false,
      activeTab: 'posts',
      followList: [],
      followListLoading: false,
    };
  }

  componentDidMount() {
    this.unsubProfiles = subscribeProfiles(() => {
      this.setState({
        ...this.state,
        profile: getProfile(this.props.match.params.pubkey),
      });
    });
    this.unsubContacts = subscribeContacts(() => {
      this.setState({ ...this.state, isFollowed: isFollowing(this.props.match.params.pubkey) });
    });
    this.loadUser();
  }

  componentWillUnmount() {
    this.unsubProfiles?.();
    this.unsubContacts?.();
  }

  handleFollow = async () => {
    const pubkey = this.props.match.params.pubkey;
    this.setState({ ...this.state, followLoading: true });
    try {
      if (this.state.isFollowed) {
        await unfollowUser(pubkey);
      } else {
        await followUser(pubkey);
      }
    } catch (err) {
      console.error('Follow/unfollow error:', err);
    }
    this.setState({ ...this.state, followLoading: false });
  };

  setTab = (tab: ProfileTab) => {
    this.setState({ ...this.state, activeTab: tab });
    if (tab === 'following' && this.state.followList.length === 0 && !this.state.followListLoading) {
      this.loadFollowList();
    }
  };

  loadFollowList() {
    const pubkey = this.props.match.params.pubkey;
    const auth = getAuthState();

    // If viewing own profile, use contacts store
    if (auth.pubkey === pubkey) {
      const contacts = getContactsState();
      if (contacts.isLoaded) {
        const list = Array.from(contacts.following);
        this.setState({ ...this.state, followList: list, followListLoading: false, activeTab: 'following' });
        if (list.length > 0) fetchProfiles(list);
        return;
      }
    }

    // Otherwise fetch kind-3 for this pubkey
    this.setState({ ...this.state, followListLoading: true });
    const pool = getPool();
    let latest: NostrEvent | null = null;

    const sub = pool.subscribe(
      [{ kinds: [Kind.Contacts], authors: [pubkey], limit: 1 }],
      (event) => {
        if (!latest || event.created_at > latest.created_at) {
          latest = event;
        }
      },
      () => {
        sub.unsubscribe();
        const list: string[] = [];
        if (latest) {
          for (const tag of latest.tags) {
            if (tag[0] === 'p' && tag[1]) list.push(tag[1]);
          }
        }
        this.setState({ ...this.state, followList: list, followListLoading: false });
        if (list.length > 0) fetchProfiles(list);
      },
    );
  }

  private addPosts(events: NostrEvent[]) {
    const newPosts: NostrEvent[] = [];
    for (const event of events) {
      if (this.seenPostIds.has(event.id)) continue;
      if (!isRootNote(event)) continue;
      this.seenPostIds.add(event.id);
      cacheEvent(event);
      newPosts.push(event);
    }
    if (newPosts.length === 0) return;
    const merged = [...this.state.posts, ...newPosts].sort((a, b) => b.created_at - a.created_at);
    this.setState({ ...this.state, posts: merged });
  }

  async loadUser() {
    const pubkey = this.props.match.params.pubkey;
    fetchProfile(pubkey);

    // 1. Restore from server cache (instant)
    try {
      const cached = await getCachedAuthorPosts(pubkey, 1, PAGE_SIZE);
      if (cached.length > 0) {
        this.addPosts(cached);
        this.setState({ ...this.state, isLoading: false });
      }
    } catch { /* server unreachable */ }

    // 2. Fan out to pool + crawler simultaneously for fresh data
    const pool = getPool();
    const poolDone = new Promise<void>((resolve) => {
      const sub = pool.subscribe(
        [{ kinds: [Kind.Text], authors: [pubkey], limit: PAGE_SIZE }],
        (event) => this.addPosts([event]),
        () => { sub.unsubscribe(); resolve(); },
      );
    });

    const crawlDone = crawl(
      [{ kinds: [Kind.Text], authors: [pubkey], limit: PAGE_SIZE }],
      (event) => this.addPosts([event]),
      { maxRelays: 6, timeout: 6000, preferIndexers: true },
    ).catch(() => {});

    await Promise.allSettled([poolDone, crawlDone]);
    this.setState({
      ...this.state,
      isLoading: false,
      hasMore: this.state.posts.length >= PAGE_SIZE,
    });
  }

  loadMore = async () => {
    const { posts, isLoadingMore, hasMore } = this.state;
    if (isLoadingMore || !hasMore || posts.length === 0) return;

    const pubkey = this.props.match.params.pubkey;
    const oldest = posts[posts.length - 1]!.created_at;
    const prevCount = this.seenPostIds.size;

    this.setState({ ...this.state, isLoadingMore: true });

    // 1. Check server cache for older posts
    try {
      const cached = await getCachedAuthorPosts(pubkey, 1, PAGE_SIZE, oldest);
      if (cached.length > 0) this.addPosts(cached);
    } catch { /* server unreachable */ }

    // 2. Crawl relays for older posts using `until` cursor
    const pool = getPool();
    const poolDone = new Promise<void>((resolve) => {
      const sub = pool.subscribe(
        [{ kinds: [Kind.Text], authors: [pubkey], limit: PAGE_SIZE, until: oldest }],
        (event) => this.addPosts([event]),
        () => { sub.unsubscribe(); resolve(); },
      );
    });

    const crawlDone = crawl(
      [{ kinds: [Kind.Text], authors: [pubkey], limit: PAGE_SIZE, until: oldest }],
      (event) => this.addPosts([event]),
      { maxRelays: 8, timeout: 8000, preferIndexers: true },
    ).catch(() => {});

    await Promise.allSettled([poolDone, crawlDone]);

    const gained = this.seenPostIds.size - prevCount;
    this.setState({
      ...this.state,
      isLoadingMore: false,
      hasMore: gained >= 5,
    });
  };

  render() {
    const { profile, posts, isLoading } = this.state;
    const pubkey = this.props.match.params.pubkey;
    const npub = npubEncode(pubkey);
    const displayName = profile?.displayName || profile?.name || shortenNpub(npub);
    const initial = (displayName || '?')[0].toUpperCase();
    const auth = getAuthState();
    const isOwnProfile = auth.pubkey === pubkey;

    return createElement('div', { className: 'mx-auto max-w-2xl px-4 sm:px-6 py-6 space-y-4' },
      // Back link
      createElement(Link, {
        to: '/feed',
        className: 'inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors',
      }, '\u2190 Back to feed'),

      // Profile card
      createElement('div', { className: 'rounded-xl border border-border overflow-hidden' },
        // Banner
        createElement('div', { className: 'h-36 sm:h-44 bg-muted relative overflow-hidden' },
          profile?.banner
            ? createElement('img', { src: profile.banner, alt: '', className: 'w-full h-full object-cover' })
            : createElement('div', { className: 'w-full h-full bg-gradient-to-br from-primary/15 via-primary/5 to-transparent' }),
        ),

        // Profile info
        createElement('div', { className: 'px-5 pb-5 -mt-12 relative' },
          // Avatar + actions row
          createElement('div', { className: 'flex items-end justify-between mb-3' },
            createElement(Avatar, { className: 'size-20 border-4 border-background shadow-lg' },
              profile?.picture
                ? createElement(AvatarImage, { src: profile.picture, alt: displayName })
                : null,
              createElement(AvatarFallback, { className: 'text-xl' }, initial),
            ),

            // Actions
            createElement('div', { className: 'flex items-center gap-2 pt-14' },
              isOwnProfile
                ? createElement(Link, { to: '/settings' },
                    createElement(Button, { variant: 'outline', size: 'sm' }, 'Edit Profile'),
                  )
                : auth.pubkey
                  ? createElement(Button, {
                      onClick: this.handleFollow,
                      disabled: this.state.followLoading,
                      variant: this.state.isFollowed ? 'outline' : 'default',
                      size: 'sm',
                      className: this.state.isFollowed ? 'hover:text-destructive hover:border-destructive/50' : '',
                    }, this.state.followLoading ? '...' : this.state.isFollowed ? 'Unfollow' : 'Follow')
                  : null,
            ),
          ),

          // Name + NIP-05
          createElement('h1', { className: 'text-xl font-bold tracking-tight' }, displayName),
          profile?.nip05
            ? createElement('p', { className: 'text-sm text-primary mt-0.5' }, profile.nip05)
            : null,

          // Npub
          createElement('button', {
            className: 'text-xs font-mono text-muted-foreground/50 mt-1 hover:text-muted-foreground transition-colors truncate max-w-full text-left',
            onClick: () => navigator.clipboard.writeText(npub),
            title: 'Click to copy',
          }, npub),

          // Bio
          profile?.about
            ? createElement('p', { className: 'text-sm text-muted-foreground mt-3 leading-relaxed' }, profile.about)
            : null,

          // Stats row
          createElement('div', { className: 'flex items-center gap-4 mt-4 pt-3 border-t border-border' },
            createElement('div', { className: 'text-center' },
              createElement('p', { className: 'text-sm font-bold' }, String(posts.length)),
              createElement('p', { className: 'text-[11px] text-muted-foreground' }, 'Posts'),
            ),
            this.state.isFollowed
              ? createElement(Badge, { variant: 'secondary', className: 'text-[10px]' }, 'Following')
              : null,
          ),
        ),
      ),

      // Tabs
      createElement('div', { className: 'flex gap-1 border-b border-border' },
        createElement('button', {
          className: 'px-4 py-2.5 text-sm font-medium transition-colors relative ' +
            (this.state.activeTab === 'posts'
              ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full'
              : 'text-muted-foreground hover:text-foreground'),
          onClick: () => this.setTab('posts'),
        }, 'Posts'),
        createElement('button', {
          className: 'px-4 py-2.5 text-sm font-medium transition-colors relative ' +
            (this.state.activeTab === 'following'
              ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full'
              : 'text-muted-foreground hover:text-foreground'),
          onClick: () => this.setTab('following'),
        }, 'Following'),
      ),

      // Tab content
      this.state.activeTab === 'posts'
        ? this.renderPostsTab(posts, isLoading)
        : this.renderFollowingTab(),
    );
  }

  renderPostsTab(posts: NostrEvent[], isLoading: boolean) {
    const { isLoadingMore, hasMore } = this.state;

    return createElement('div', { className: 'space-y-3' },
      isLoading && posts.length === 0
        ? createElement('div', { className: 'flex justify-center py-16' },
            createElement(Spinner, null),
          )
        : posts.length > 0
          ? createElement('div', { className: 'space-y-3' },
              ...posts.map((event) => createElement(PostCard, { key: event.id, event, compact: true })),
              // Load More button
              hasMore
                ? createElement('div', { className: 'flex justify-center py-6' },
                    createElement(Button, {
                      variant: 'outline',
                      size: 'sm',
                      onClick: this.loadMore,
                      disabled: isLoadingMore,
                    }, isLoadingMore
                      ? createElement('span', { className: 'flex items-center gap-2' },
                          createElement(Spinner, { size: 'sm' }),
                          'Loading older posts...',
                        )
                      : 'Load More'),
                  )
                : createElement('p', { className: 'text-center text-xs text-muted-foreground py-6' },
                    `Showing all ${posts.length} posts`,
                  ),
            )
          : createElement('div', { className: 'text-center py-12' },
              createElement('p', { className: 'text-sm text-muted-foreground' }, 'No posts yet.'),
            ),
    );
  }

  renderFollowingTab() {
    const { followList, followListLoading } = this.state;

    if (followListLoading) {
      return createElement('div', { className: 'flex justify-center py-16' },
        createElement(Spinner, null),
      );
    }

    if (followList.length === 0) {
      return createElement('div', { className: 'text-center py-12' },
        createElement('p', { className: 'text-sm text-muted-foreground' }, 'Not following anyone yet.'),
      );
    }

    return createElement('div', { className: 'space-y-1' },
      ...followList.map((pk) => {
        const p = getProfile(pk);
        const name = p?.displayName || p?.name || shortenNpub(npubEncode(pk));
        const initial = (name || '?')[0].toUpperCase();

        return createElement(Link, {
          key: pk,
          to: `/u/${pk}`,
          className: 'flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors',
        },
          createElement(Avatar, { className: 'size-10' },
            p?.picture
              ? createElement(AvatarImage, { src: p.picture, alt: name })
              : null,
            createElement(AvatarFallback, { className: 'text-sm' }, initial),
          ),
          createElement('div', { className: 'min-w-0 flex-1' },
            createElement('p', { className: 'text-sm font-medium truncate' }, name),
            p?.nip05
              ? createElement('p', { className: 'text-xs text-primary truncate' }, p.nip05)
              : createElement('p', { className: 'text-xs text-muted-foreground font-mono truncate' }, shortenNpub(npubEncode(pk))),
          ),
        );
      }),
    );
  }
}
