# 🍄 mycelium.social

**A Nostr social platform built with [relay.tools](https://github.com/relaytools/), InfernoJS, and Blazecn.**

mycelium.social is a complete Nostr relay hosting and social platform. The relay infrastructure is built on [relay.tools](https://github.com/relaytools/) — an open-source relay management stack — with every user-facing component rewritten using [InfernoJS](https://infernojs.org) and [Blazecn](https://github.com/TekkadanPlays/blazecn), our shadcn/ui-compatible component library.

## Built on relay.tools

The server-side relay infrastructure uses the [relay.tools](https://github.com/relaytools/) collection of services, each rewritten with a modern InfernoJS + Blazecn frontend:

| Service | Upstream | What we changed |
|---------|----------|-----------------|
| **relaycreator** | [relaytools/relaycreator](https://github.com/relaytools/relaycreator) | Rewrote the Next.js frontend as an InfernoJS SPA with Blazecn. Express API server retained and extended. |
| **strfry** | [hoytech/strfry](https://github.com/hoytech/strfry) | Nostr relay daemon — used as-is. |
| **spamblaster** | [relaytools/spamblaster](https://github.com/relaytools/spamblaster) | strfry write-policy plugin — used as-is. |
| **interceptor** | [relaytools/interceptor](https://github.com/relaytools/interceptor) | WebSocket proxy handling NIP-42 auth and relay routing — used as-is. |
| **cookiecutter** | [relaytools/cookiecutter](https://github.com/relaytools/cookiecutter) | Generates per-relay strfry configs and HAProxy rules from the relaycreator API. |

## Tech Stack

### Frontend
- **[InfernoJS](https://infernojs.org)** — React-compatible UI library, extremely fast virtual DOM
- **[Blazecn](https://github.com/TekkadanPlays/blazecn)** — shadcn/ui-compatible component library ported to InfernoJS
- **[Tailwind CSS v4](https://tailwindcss.com)** — utility-first CSS with PostCSS
- **[Kaji](https://github.com/TekkadanPlays/kaji)** — InfernoJS-native Nostr protocol library

### Server
- **[Bun](https://bun.sh)** — JavaScript runtime, bundler, and package manager
- **[Hono](https://hono.dev)** — lightweight web framework (social client server)
- **[Express](https://expressjs.com)** — API server (relaycreator)
- **[Prisma](https://www.prisma.io)** — ORM for MariaDB

### Infrastructure
- **[HAProxy](https://www.haproxy.org)** — TLS termination, WebSocket routing, wildcard subdomain handling
- **[MariaDB](https://mariadb.org)** — relay metadata, user accounts, ACLs
- **[systemd-nspawn](https://www.freedesktop.org/software/systemd/man/systemd-nspawn.html)** — lightweight containers for service isolation
- **[OvenMediaEngine](https://github.com/AirenSoft/OvenMediaEngine)** — RTMP ingest and HLS/WebRTC streaming

### Signing & Auth
- **[nos2x-frog](https://github.com/TekkadanPlays/nos2x-frog)** — NIP-07 browser extension for Nostr key management

## Features

- Global and Following feed modes with live updates
- Post creation, replies, reactions, reposts
- User profiles with follow/unfollow (NIP-02)
- Rich content rendering (links, images, video, hashtags, nostr: entities)
- Notifications (reactions, replies, mentions, reposts)
- Relay management with live connection status
- Relay hosting with per-relay ACLs, write policies, and moderation
- Hashtag feeds
- Raw event inspector
- NIP-07 browser extension authentication
- Component library documentation at `/docs`

## Getting Started

```bash
cd mycelium
bun install
bun run build
bun run dev
```

The app starts at `http://localhost:3000`.

## Project Structure

```
mycelium.social/
├── mycelium/               # Main social client
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Layout, Feed, PostCard, Compose, Login
│   │   │   ├── pages/      # Home, PostDetail, UserProfile, Notifications, etc.
│   │   │   ├── store/      # State management (auth, relay, feed, contacts)
│   │   │   └── ui/         # Blazecn components (Button, Card, Input, etc.)
│   │   ├── nostr/          # Kaji protocol library (local mirror)
│   │   ├── server/         # Hono server
│   │   └── styles/         # Tailwind CSS v4 + PostCSS
│   ├── build.ts            # Bun build script
│   └── package.json
├── live/                   # Live streaming frontend (NIP-53)
├── relaycreator/           # Relay management (fork of relay.tools)
├── nos2x-fox/              # Browser extension (nos2x-frog)
└── blazecn/                # Component library
```

## Related Repositories

| Repo | Description |
|------|-------------|
| [relay.tools](https://github.com/relaytools/) | Upstream relay management stack |
| [blazecn](https://github.com/TekkadanPlays/blazecn) | shadcn/ui-compatible component library for InfernoJS |
| [kaji](https://github.com/TekkadanPlays/kaji) | InfernoJS-native Nostr protocol library |
| [nos2x-frog](https://github.com/TekkadanPlays/nos2x-frog) | Nostr signer browser extension |
| [mycelium-android](https://github.com/TekkadanPlays/mycelium-android) | Native Android Nostr client |
| [relaycreator](https://github.com/TekkadanPlays/relaycreator) | Our fork of relay.tools/relaycreator with InfernoJS frontend |

## License

MIT — see [NOTICE.md](NOTICE.md) for third-party license details.
