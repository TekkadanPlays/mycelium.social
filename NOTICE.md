# Mycelium — Third-Party Licenses & Notices

Mycelium is a collection of independent services that communicate over
HTTP, WebSocket, and RTMP. Each component is licensed separately.
Running them together as an aggregate does **not** combine them into a
single program under any copyleft license (see GPLv3 §5, "aggregate").

---

## Components authored by Mycelium / TekkadanPlays — MIT

| Component | Description |
|---|---|
| `live/` (mycelium-live) | Live streaming frontend & Bun server (NIP-53, HLS player) |
| `nos2x-fox/` | Browser extension for Nostr key management (fork of nos2x) |
| `ui/` | Shared UI component library (blazecn, based on shadcn/ui) |
| `sonner/` | Toast notification library |
| `buntralino/` | Desktop app shell (Bun + Tauri) |

These components are released under the **MIT License**.
See each directory's `LICENSE` or `LICENSE.md` for the full text.

---

## relay.tools / relaycreator — GPLv3

| Component | License | Upstream |
|---|---|---|
| `relaycreator/` | **GNU General Public License v3.0** | Fork of [relay.tools](https://github.com/nicholasgasior/relay.tools) |

The relaycreator API server and frontend are licensed under GPLv3.
All modifications are published at:
<https://github.com/TekkadanPlays/relaycreator>

**Your rights**: You may use, modify, and redistribute this component
under the terms of GPLv3. Source code is available at the link above.

---

## OvenMediaEngine — AGPL-3.0

| Component | License | Upstream |
|---|---|---|
| OvenMediaEngine (OME) | **GNU Affero General Public License v3.0** | [AirenSoft/OvenMediaEngine](https://github.com/AirenSoft/OvenMediaEngine) |

OvenMediaEngine is run **unmodified** as a standalone Docker container
(`airensoft/ovenmediaengine`). It is not linked into or combined with
any Mycelium code. Per AGPL-3.0 §13, users interacting with OME over
the network can obtain the source code at:
<https://github.com/AirenSoft/OvenMediaEngine>

---

## Other runtime dependencies (not distributed)

The following are **not part of the Mycelium source distribution** but
are used at runtime on the server:

| Software | License | Notes |
|---|---|---|
| strfry | Public domain (Unlicense) | Nostr relay, runs as separate process |
| HAProxy | GPLv2 | Reverse proxy, runs as separate process |
| MariaDB | GPLv2 | Database, runs as separate process |
| Ergo IRC | MIT | IRC server, runs as separate process |

These are standard server infrastructure and are not modified or
redistributed by Mycelium.

---

## npm / Bun dependencies

Third-party npm packages used by mycelium-live are listed in
`live/package.json`. Notable licenses:

| Package | License |
|---|---|
| inferno | MIT |
| hls.js | Apache-2.0 |
| @noble/curves, @noble/hashes | MIT |
| @scure/base | MIT |
| tailwindcss | MIT |
| class-variance-authority | Apache-2.0 |
| clsx | MIT |
| tailwind-merge | MIT |

---

## Summary

- **Your own code** (mycelium-live, nos2x-fox, blazecn, Android app): **MIT**
- **relaycreator** (relay management API): **GPLv3** — source available on GitHub
- **OvenMediaEngine** (streaming server): **AGPL-3.0** — run unmodified, source at AirenSoft's GitHub
- All components run as **separate processes** communicating over network protocols — this is an aggregate, not a combined work
