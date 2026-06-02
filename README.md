# Hapa

Hapa is a local-first AI/worldbuilding ecosystem: a canon wiki, a set of small cooperating nodes, creative media pipelines, card/agent systems, and operator tools for turning Calder's Hapa universe into usable software and living lore.

This repository is the front door. It does not replace the individual source repos or the Hapa Worldbuilding Wiki. It explains how the pieces fit together, where to start, and which node owns which responsibility.

Local workspace root assumptions in this guide:

- Master repo: `$HAPA_DESKTOP_ROOT/hapa`
- Canon/wiki vault: `$HAPA_DESKTOP_ROOT/Hapa_Worldbuilding_Wiki`
- Operations spine: `$HAPA_DESKTOP_ROOT/.Overwatch`
- Main app: `$HAPA_DESKTOP_ROOT/hapa-dev-proto`
- Media node: `$HAPA_MLX_STATION_ROOT`

## Start here

If you are new to Hapa, read in this order:

1. This README: the high-level map.
2. `AGENTS.md`: safe edit boundaries and verification gates for AI agents.
3. `docs/FEATURE_PARITY.md`: truthful API/CLI/UI parity status for this repo.
4. `docs/CLI.md` and `docs/API.md`: scriptable interface and local feature-spine contract.
5. `docs/NODE_MAP.md`: what each repo/node does and where it lives.
6. `docs/WIKI_EXPANSION_MAP.md`: which wiki pages expand each concept.
7. `docs/OPERATING_MODEL.md`: how humans and agents should work safely in this ecosystem.
8. `docs/GITHUB_SECRET_SAFETY_AUDIT_2026-05-23.md`: latest local push-safety audit across Hapa git repositories.
9. `docs/KANBAN_UI_INGRESS_AUDIT.md`: current proof that node UIs link back to app-specific Overwatch Kanban boards.
10. The source README for the node you want to run or change.

Fast local links:

- [Hapa Worldbuilding Wiki](../Hapa_Worldbuilding_Wiki/README.md)
- [Canon for Humans](../Hapa_Worldbuilding_Wiki/Canon/Introduction%20for%20Humans.md)
- [Canon for AIs](../Hapa_Worldbuilding_Wiki/Canon/Introduction%20for%20AIs.md)
- [Living Canon Map](../Hapa_Worldbuilding_Wiki/Canon/Living%20Canon%20Map.md)
- [World Bible](../Hapa_Worldbuilding_Wiki/Canon/World%20Bible.md)
- [Node Capability Matrix](../Hapa_Worldbuilding_Wiki/Nodes/Node%20Capability%20Matrix.md)
- [Node Graph v2](../Hapa_Worldbuilding_Wiki/Nodes/Node%20Graph%20v2.md)
- [Repository State Matrix](../Hapa_Worldbuilding_Wiki/Development/Repository%20State%20Matrix.md)
- [Overwatch Knowledgebase](../.Overwatch/README.md)

## What Hapa is

Hapa has three layers that should stay connected:

1. Canon and memory
   - Markdown wiki pages for lore, names, timelines, systems, cards, raw sources, and development plans.
   - SQLite/Lance/projection stores that make the canon queryable by apps and agents.
   - Provenance pages that show where ideas came from.

2. Local nodes
   - Small services/apps with narrow responsibilities: main operator UI, media generation, LLM completions, task tracking, telemetry, keys, agent registry, card forging, world state, chat, songs, wiki growth, etc.
   - Nodes should be understandable independently, but they become useful when they exchange cards, events, media, status, and wiki references.

3. Creative/game surface
   - Cards, Phamiliars, Names, songs, living comics, Janus/spaceship surfaces, Cymatica spatial media, and future gameplay/economy loops.
   - These are not just assets; they are compressed memory packets that point back into lore, source material, and operational systems.

## Core idea

Hapa treats worldbuilding, software development, media creation, and agent work as one loop:

1. Raw source or lived idea enters the system.
2. Wiki/canon pages preserve context and provenance.
3. Cards and names compress the meaning into playable or reusable units.
4. Nodes expose capabilities: generation, search, registry, tasks, telemetry, identity, trust, world state.
5. Apps turn those capabilities into operator/player experiences.
6. Agents and humans inspect gaps, produce new artifacts, and write the results back into the wiki.

## Ecosystem flowchart

The same diagram is available as a dedicated Markdown page at `docs/FLOWCHART.md` and as a browser-viewable SVG/HTML artifact at `docs/assets/hapa-ecosystem-flowchart.html`.

```mermaid
flowchart TB
  human[Human / Calder / collaborators] --> master[This master repo\nHapa front door]
  master --> wiki[Hapa Worldbuilding Wiki\nCanon, Systems, Names, Cards]
  master --> overwatch[.Overwatch\nInventory, operations, status]

  wiki --> canon[Canon + World Bible]
  wiki --> systems[Systems + protocols]
  wiki --> cards[Cards + card seeds]
  wiki --> raw[Raw sources + provenance]

  canon --> devproto[hapa-dev-proto\nMain Hapa AG app]
  cards --> devproto
  systems --> devproto

  devproto --> sqlite[SQLite projections\nlocal persistence]
  devproto --> p2p[Hypercore / P2P experiments]
  devproto --> chat[hapa-chat-app\nrooms, agents, assets]

  wiki --> viewer[hapa-wiki-viewer\nread/browse wiki]
  wiki --> growth[hapa-wiki-growth-agent\nbounded expansion passes]
  growth --> wiki
  growth --> devproto

  devproto --> mlx[hapa-mlx-station\nmedia generation hub]
  devproto --> llada[hapa-llada-node\nlocal LLM completions]
  devproto --> lore[hapa-lore-node\nchronicle/search]
  devproto --> tasks[hapa-open-tasks-node\nKanban/tasks]
  devproto --> telemetry[hapa-telemetry-node\nhealth/discovery]
  devproto --> keys[hapa-keys-node\nlocal key vault]
  devproto --> agents[hapa-agent-registry-node\nagent identity/jobs]
  devproto --> crypto[hapa-crypto-node\ntrust/signatures]
  devproto --> anvil[hapa-anvil-node\ncard standards/forge]
  devproto --> lance[hapa-lance-node\nchunks/embeddings/index]
  devproto --> janus[hapa-janus-world-node\nworld truth kernel]

  mlx --> avatar[hapa-avatar-node\navatar/phamiliar variants]
  mlx --> songs[hapa-song-registry\nsongs/lyrics/timing]
  mlx --> comic[hapa-living-comic\nnarrative panels]
  mlx --> cymatica[Cymatica / LuminaStem\nspatial audio + 3D media]
  janus --> spaceship[hapa-spaceship-desktop-hijack\nJanus desktop surface]

  overwatch --> allnodes[All node READMEs\nstatus + contracts]
  allnodes --> master
```

## The major node families

### 1. Front door, operations, and canon

- [hapa](.) — this repository. The human/agent onboarding hub.
- [.Overwatch](../.Overwatch/README.md) — operations spine: inventories, status board, task inbox, reports, and cross-agent protocols.
- [Hapa Worldbuilding Wiki](../Hapa_Worldbuilding_Wiki/README.md) — canonical Markdown knowledge graph for lore, systems, cards, names, raw sources, and development synthesis.
- [hapa-wiki-viewer](../hapa-wiki-viewer/README.md) — UI for browsing the wiki as a local app instead of raw folders.
- [hapa-wiki-growth-agent](../hapa-wiki-growth-agent/README.md) — bounded local-agent workflow that expands the wiki with draft articles, lore dispatches, card drafts, media hooks, and ledgers.

### 2. Primary app and interaction surfaces

- [hapa-dev-proto](../hapa-dev-proto/README.md) — main Hapa AG Electron/React app; operator UI, card library, wormhole/workspace flows, SQLite projections, and P2P experiments.
- [hapa-chat-app](../hapa-chat-app/README.md) — local chat/workroom app for rooms, participants, agent visits, assets, worker jobs, and conversation inspection.
- [hapa-spaceship-desktop-hijack](../hapa-spaceship-desktop-hijack/README.md) — Janus/spaceship desktop surface prototype.
- [hapa-living-comic](../hapa-living-comic/README.md) — native living comic viewer/editor for story panels and media-backed narrative presentation.

### 3. AI, media, music, and creative generation

- [hapa-mlx-station]($HAPA_MLX_STATION_ROOT/README.md) — Apple Silicon media-generation station and authenticated hub for local image/media jobs.
- [hapa-llada-node](../hapa-llada-node/README.md) — local LLM/completion node for sovereign LLaDA/MLX experiments.
- [hapa-avatar-node](../hapa-avatar-node/README.md) — avatar/phamiliar lineage generation and metadata prototype.
- [hapa-song-registry](../hapa-song-registry/README.md) — songs, Suno/imported audio, lyrics, prompts, timing analysis, and music metadata.
- [hapa-luminastem-station](../hapa-luminastem-station/README.md) — LuminaStem/3D/audio stem visualization prototype.
- [Cymatica](../Project%20Cymatica_Vision/cymatica/README.md) — SwiftPM/RealityKit spatial audio and stems-to-3D experimentation.

### 4. Reliability, coordination, and trust

- [hapa-telemetry-node](../hapa-telemetry-node/README.md) — health, metrics, launcher, node registry, and discovery hub.
- [hapa-open-tasks-node](../hapa-open-tasks-node/README.md) — Hapa operational Kanban/task node.
- [hapa-lore-node](../hapa-lore-node/README.md) — chronicle/search node for daily progress, wisdom, and canon/operator history.
- [hapa-keys-node](../hapa-keys-node/README.md) — local key vault for node/provider secrets.
- [hapa-agent-registry-node](../hapa-agent-registry-node/README.md) — agent profiles, avatar jobs, identity/onboarding metadata.
- [hapa-crypto-node](../hapa-crypto-node/README.md) — Swift-native encryption, signatures, identity proofs, and trust primitives.

### 5. Cards, indexes, protocol, and world state

- [hapa-anvil-node](../hapa-anvil-node/README.md) — card standardization, evaluation, forging, and artifact emission.
- [hapa-lance-node](../hapa-lance-node/README.md) — projection/index layer for cards, wiki chunks, embeddings, and multimodal records.
- [hapa-janus-world-node](../hapa-janus-world-node/README.md) — Janus local world truth kernel: append-only world events and derived snapshots.
- [Consul Node Proto](../Consul%20Node%20Proto/README.md) — Warden/Heap/River proof harness and environment-up verification prototype.
- [hapa-cultivation-suite](../pulse-node-proto-dev/hapa-cultivation-suite/README.md) — Pulse/cultivation protocol tooling monorepo.
- [hapa-spec-scaffold](../hapa-spec-scaffold/README.md) — compact protocol/spec/test scaffold.

### 6. Archives, capsules, and historical references

- [hapa-og](../hapa-og/README.md) — older integrated Hapa app snapshot for archaeology/reference.
- [Help Fund Hapa Capsule](../help-fun-d-hapa-plz/capsule/README.md) — funding/simulator capsule UI artifact.

## Where to expand in the wiki

Concept routes:

- Hapa as a world/canon: [Canon/World Bible](../Hapa_Worldbuilding_Wiki/Canon/World%20Bible.md), [Canon/Living Canon Map](../Hapa_Worldbuilding_Wiki/Canon/Living%20Canon%20Map.md)
- Hapa for human readers: [Canon/Introduction for Humans](../Hapa_Worldbuilding_Wiki/Canon/Introduction%20for%20Humans.md)
- Hapa for AI agents: [Canon/Introduction for AIs](../Hapa_Worldbuilding_Wiki/Canon/Introduction%20for%20AIs.md)
- Node system: [Nodes/Index](../Hapa_Worldbuilding_Wiki/Nodes/Index.md), [Node Capability Matrix](../Hapa_Worldbuilding_Wiki/Nodes/Node%20Capability%20Matrix.md), [Node Graph v2](../Hapa_Worldbuilding_Wiki/Nodes/Node%20Graph%20v2.md)
- Cards/game grammar: [Cards/ChatGPT Export Cards/Index](../Hapa_Worldbuilding_Wiki/Cards/ChatGPT%20Export%20Cards/Index.md), [Systems/media-ingestion-to-card-wiki-loop](../Hapa_Worldbuilding_Wiki/Systems/media-ingestion-to-card-wiki-loop.md)
- Names and identities: [Names/Index of Names](../Hapa_Worldbuilding_Wiki/Names/Index%20of%20Names.md), [Names/Hapa.ai](../Hapa_Worldbuilding_Wiki/Names/Hapa.ai.md), [Names/Hapa Protocol](../Hapa_Worldbuilding_Wiki/Names/Hapa%20Protocol.md)
- Need/economy mechanics: [Systems/need-minting-protocol](../Hapa_Worldbuilding_Wiki/Systems/need-minting-protocol.md)
- Music as memory: [Systems/breathline-musical-memory-encoding](../Hapa_Worldbuilding_Wiki/Systems/breathline-musical-memory-encoding.md), [Systems/song-compression-every-song-is-a-zip-file-for-feeling](../Hapa_Worldbuilding_Wiki/Systems/song-compression-every-song-is-a-zip-file-for-feeling.md)
- UI gravity/pattern language: [Systems/mode-gravity-interface-pattern](../Hapa_Worldbuilding_Wiki/Systems/mode-gravity-interface-pattern.md), [Systems/Astro & Gravity Design System](../Hapa_Worldbuilding_Wiki/Systems/Astro%20%26%20Gravity%20Design%20System.md)
- Development priorities: [Development/Priority Ranking 1-10](../Hapa_Worldbuilding_Wiki/Development/Priority%20Ranking%201-10.md), [Development/Repository State Matrix](../Hapa_Worldbuilding_Wiki/Development/Repository%20State%20Matrix.md)
- Operations: [Operations/Index](../Hapa_Worldbuilding_Wiki/Operations/Index.md), [Operations/Overwatch Node Registry and Status Board](../Hapa_Worldbuilding_Wiki/Operations/Overwatch%20Node%20Registry%20and%20Status%20Board.md)

See `docs/WIKI_EXPANSION_MAP.md` for a longer routing table.

## How to use this repository

For a human collaborator:

1. Read the high-level model above.
2. Open the wiki intro pages to understand the fiction/canon frame.
3. Open `docs/NODE_MAP.md` to pick the node relevant to your task.
4. Read that node's README before changing anything.
5. If you learn something durable, write it back to the wiki or Overwatch, not only into chat.

For an AI agent:

1. Treat this repo as the front door, not the source of truth for every detail.
2. Check `.Overwatch` for current operational status.
3. Check the target node README and git status before editing.
4. Preserve local-first assumptions and provenance links.
5. Avoid canonizing speculative output directly into `Canon/` without explicit instruction; use draft/development/ledger areas when uncertain.

For development work:

1. Start with the owning node repo.
2. Use the node README to understand purpose, inputs, outputs, interfaces, related nodes, and operating contract.
3. Keep changes scoped.
4. Verify behavior locally.
5. Commit in the owning repo and, when the ecosystem map changes, update this master repo and `.Overwatch`.

## Interfaces and standards status

This repo is an active local Node Space/front-door app, but it is not the owning source repo for every Hapa node. Its local feature spine lives in `electron/hapa-local.js` and is exposed through:

- UI: `npm run desktop` opens the Electron Node Space; `site/index.html` is the static front-door site.
- CLI: `npm run cli -- help`, `npm run cli -- health`, and `npm run cli -- capabilities`.
- API: Electron IPC, the local CommonJS module, and an optional read-only loopback HTTP API are available. Start HTTP with `npm run api -- --port 8876`.

Truth status: partial compliance with the Hapa Node App Standard. The audit CLI gap is healed by `bin/hapa-node-space.js`, and the first read-only HTTP API is available, but full compliance still requires a persistent service manifest and a first-class Docs/README panel inside the Node Space Electron shell. See `docs/FEATURE_PARITY.md`, `docs/CLI.md`, and `docs/API.md`.

Verification:

```bash
cd $HAPA_DESKTOP_ROOT/hapa
npm run check
npm run smoke:cli
npm run smoke:desktop
```

## Website

A designed static front-door site now lives at:

- `site/index.html`

It introduces Hapa's why/what/how, wiki, lore, node ecosystem, cards, development progress, and next phases for both human readers and AI agents. Open it directly in a browser or serve it locally:

```bash
cd $HAPA_DESKTOP_ROOT/hapa/site
python3 -m http.server 8765 --bind 127.0.0.1
open http://127.0.0.1:8765/index.html
```

## Repository contents

- `README.md` — front-door introduction and high-level flowchart.
- `AGENTS.md` — AI-agent operating context, safe edit boundaries, and verification gates.
- `site/` — designed static Hapa website for humans and AI agents.
- `electron/` — Electron desktop wrapper and local feature spine for Hapa Node Space.
- `bin/hapa-node-space.js` — minimal scriptable CLI for health, capabilities, context, nodes, music, ships, services, and flow-explainer dry runs/writes.
- `docs/FEATURE_PARITY.md` — truthful API/CLI/UI parity matrix and remaining standards gaps.
- `docs/API.md` — local module/Electron IPC API contract and future HTTP shape.
- `docs/CLI.md` — CLI command reference.
- `docs/NODE_MAP.md` — thorough list of source repos/nodes with paths, roles, and ecosystem meaning.
- `docs/WIKI_EXPANSION_MAP.md` — routes from concepts to wiki pages.
- `docs/OPERATING_MODEL.md` — conventions for humans/agents working in Hapa.
- `docs/FLOWCHART.md` — Mermaid flowcharts for the ecosystem, onboarding, and card/media loop.
- `docs/PROCESS_FLOW_CARDS.md` — multi-node action scripts for teachable Hapa process cards.
- `docs/NODE_SPACE_DESKTOP.md` — Electron/local version of Node Space with wiki, song, node, filesystem, and protocol bridge.
- `docs/MAKE_FLOW_AND_EXPLAINER_PROTOCOL.md` — standard for turning multi-node flows into protocol records, explainers, and flow cards.
- `docs/assets/hapa-ecosystem-flowchart.html` — standalone browser-viewable diagram.

## Status

This repo is an onboarding and coordination hub. It intentionally contains documentation and maps, not the implementation code for every node.

Created from the local Hapa workspace inventory and the 2026-05-22 README quality pass across the Hapa source repos.
