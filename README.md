# 🐸 ribbit.network

**A Nostr social platform built with InfernoJS.**

ribbit.network is a fast, lightweight Nostr client featuring a modern dark UI powered by [Blazecn](https://github.com/TekkadanPlays/blazecn) — our shadcn/ui-compatible component library for InfernoJS.

## Stack

- **Frontend** — [InfernoJS](https://infernojs.org) + [Tailwind CSS v4](https://tailwindcss.com) + [Blazecn](https://github.com/TekkadanPlays/blazecn)
- **Protocol** — [Kaji](https://github.com/TekkadanPlays/kaji) (InfernoJS-native Nostr library)
- **Server** — [Hono](https://hono.dev) on [Bun](https://bun.sh)
- **Signer** — [nos2x-frog](https://github.com/TekkadanPlays/nos2x-frog) (NIP-07 browser extension)

## Features

- Global and Following feed modes with live updates
- Post creation, replies, reactions, reposts
- User profiles with follow/unfollow (NIP-02)
- Rich content rendering (links, images, video, hashtags, nostr: entities)
- Notifications (reactions, replies, mentions, reposts)
- Relay management with live connection status
- Hashtag feeds
- Raw event inspector
- NIP-07 browser extension authentication
- Component library documentation at `/docs`

## Getting Started

```bash
cd ribbit
bun install
bun run build
bun run dev
```

The app starts at `http://localhost:3000`.

## Project Structure

```
ribbit.network/
└── ribbit/                 # Main application
    ├── public/             # Static assets
    ├── src/
    │   ├── app/
    │   │   ├── components/ # Layout, Feed, PostCard, Compose, Login
    │   │   ├── pages/      # Home, PostDetail, UserProfile, Notifications, etc.
    │   │   ├── store/      # State management (auth, relay, feed, contacts)
    │   │   └── ui/         # Blazecn components (Button, Card, Input, etc.)
    │   ├── nostr/          # Kaji protocol library (local mirror)
    │   ├── server/         # Hono server
    │   └── styles/         # Tailwind CSS + main.css
    ├── build.ts            # Bun build script (PostCSS + Babel + bundle)
    └── package.json
```

## Related Repositories

| Repo | Description |
|------|-------------|
| [blazecn](https://github.com/TekkadanPlays/blazecn) | shadcn/ui-compatible component library for InfernoJS |
| [kaji](https://github.com/TekkadanPlays/kaji) | InfernoJS-native Nostr protocol library |
| [nos2x-frog](https://github.com/TekkadanPlays/nos2x-frog) | Nostr signer browser extension (Ribbit Signer) |
| [nips](https://github.com/TekkadanPlays/nips) | Reorganized Nostr Implementation Possibilities |

## License

MIT
