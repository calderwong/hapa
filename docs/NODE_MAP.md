# Hapa Node Map

This page explains the current local source repos as parts of one Hapa ecosystem. Paths reflect Calder's local macOS workspace.

## Reading the map

- "Core" means actively important to current Hapa operation.
- "Prototype" means useful and concrete, but still exploratory or not yet fully integrated.
- "Archive/reference" means do not treat it as authoritative unless explicitly instructed.
- Individual node READMEs remain the source for run commands, dependencies, and verification details.
- This page maps the local operating workspace and is not the canonical public-repository inventory.
- The complete public inventory is [Hapa Awesome](https://github.com/calderwong/hapa-awesome), with 50 Hapa repositories in its [human catalog](https://github.com/calderwong/hapa-awesome/blob/main/docs/NODES.md), machine registry, and account-wide scope ledger.
- GitHub-rendered visual thumbnails for an earlier illustrated subset live in `docs/NODE_THUMBNAILS.md`.

## Public entry points

- [Hapa Awesome](https://github.com/calderwong/hapa-awesome) — canonical public source directory and scope boundary.
- [Hapa Node Atlas](https://calderwong.github.io/hapa-node-atlas/) — live visual atlas and embedded prototype surfaces.
- [Hapa Scroll Site](https://calderwong.github.io/hapa-scroll-site/) — live cinematic ecosystem and Hapa Card tour.
- [Hapa Graphify](https://github.com/calderwong/hapa-graphify) — source-backed relationship explorer.

## Front door and operations

| Node | Local path | Status | Role | Ecosystem meaning |
|---|---|---:|---|---|
| hapa | `$HAPA_DESKTOP_ROOT/hapa` | Core | Master onboarding repo | Introduces Hapa, links the node graph, and points readers into the wiki. |
| .Overwatch | `$HAPA_DESKTOP_ROOT/.Overwatch` | Core | Operations knowledgebase | Inventory, task inbox, reports, status board, source index, and cross-agent standards. |
| Hapa Worldbuilding Wiki | `$HAPA_DESKTOP_ROOT/Hapa_Worldbuilding_Wiki` | Core | Canon/wiki vault | Markdown graph for canon, systems, cards, names, raw sources, and development synthesis. |
| hapa-wiki-viewer | `$HAPA_DESKTOP_ROOT/hapa-wiki-viewer` | Core | Wiki UI | Local browser/desktop navigation for the wiki. |
| hapa-wiki-growth-agent | `$HAPA_DESKTOP_ROOT/hapa-wiki-growth-agent` | Core | Wiki expansion agent | Bounded passes that draft wiki articles, card drafts, media hooks, and ledger entries. |

## Primary app and work surfaces

| Node | Local path | Status | Role | Ecosystem meaning |
|---|---|---:|---|---|
| hapa-dev-proto | `$HAPA_DESKTOP_ROOT/hapa-dev-proto` | Core | Main Hapa AG app | Operator UI, card library, chat/workspace flows, SQLite projections, Hypercore/P2P experiments. |
| hapa-wisdom-studio | `$HAPA_DESKTOP_ROOT/hapa-wisdom-studio` | Working MVP | Card-guided writer's workbench | Source-labeled story objects, bounded Avatar Council evaluation, reversible revisions, and append-only Card Experience. Overwind publication remains planned. |
| hapa-avatar-builder | `$HAPA_AVATAR_BUILDER_ROOT` | Canonical local checkout / prototype | Avatar Card and Tarot workbench | Owns Avatar Card authoring, Tarot Library/Draw, and related media assembly. Canonical means the owning checkout, not a stable release. |
| hapa-roomlet | `$HAPA_ROOMLET_ROOT` | Working local prototype | Lightweight Tarot-room participant client | Opens Avatar Builder room invites and supports bounded local participation. Local/private-DHT proof does not establish distinct-network operation or notarized distribution. |
| hapa-subscriber-app | `$HAPA_DESKTOP_ROOT/hapa-subscriber-app` | First-pass static prototype | Subscriber-experience UI sketch | Static HTML/CSS/JS only; no service, persistence, authentication, Card acknowledgement, subscription contract, payment, or commerce authority. |
| hapa-language | `$HAPA_DESKTOP_ROOT/hapa-language` | Verified Prototype 0.1 | Multilingual Meaning Cards learning world | Local-first UI/API/CLI with provenance and private learner custody. Its ten bundled Cards remain candidate/inference and are not accepted for teaching. |
| hapa-character-sheet | `$HAPA_DESKTOP_ROOT/hapa-character-sheet` | Core/private | Character sheet / portfolio app | Local-first resume, RPG stat sheet, skill codex, timeline, profile dossier, and desktop/API projection over Hapa Second Brain. |
| hapa-chat-app | `$HAPA_DESKTOP_ROOT/hapa-chat-app` | Core/prototype | Chat/workroom | Rooms, participants, assets, agent visits, worker jobs, and conversation inspection. |
| hapa-spaceship-desktop-hijack | `$HAPA_DESKTOP_ROOT/hapa-spaceship-desktop-hijack` | Prototype | Janus desktop surface | Experiments with spaceship/native desktop metaphors and shared-memory interaction. |
| hapa-living-comic | `$HAPA_DESKTOP_ROOT/hapa-living-comic` | Prototype | Living comic app | Narrative panels and media-backed story presentation. |

## AI, generation, music, and media

| Node | Local path | Status | Role | Ecosystem meaning |
|---|---|---:|---|---|
| hapa-mlx-station | `$HAPA_MLX_STATION_ROOT` | Core | Media generation station | Apple Silicon media node and authenticated hub for local generation jobs. |
| hapa-llada-node | `$HAPA_DESKTOP_ROOT/hapa-llada-node` | Core | Local LLM node | Sovereign completions endpoint and UI for LLaDA/MLX experiments. |
| hapa-avatar-node | `$HAPA_DESKTOP_ROOT/hapa-avatar-node` | Prototype | Avatar/phamiliar generator | Character/avatar variants, poses, metadata, and forge/export bridge. |
| hapa-trellis | `$HAPA_TRELLIS_ROOT` | Phase 0/1 prototype | Image-to-3D queue and adapter | Hapa-owned provenance, queue, Card, API/CLI/UI, and adapter layer around separately owned Trellis Mac and Microsoft TRELLIS. Stub parity is not model-quality proof. |
| hapa-song-registry | `$HAPA_DESKTOP_ROOT/hapa-song-registry` | Core | Song registry | Suno/imported audio, lyrics, prompts, timing analysis, and music metadata. |
| hapa-luminastem-station | `$HAPA_DESKTOP_ROOT/hapa-luminastem-station` | Prototype | LuminaStem media station | 3D/audio stem visualization experiments and Gemini/Three-style media surfaces. |
| Cymatica | `$HAPA_DESKTOP_ROOT/Project Cymatica_Vision/cymatica` | Prototype | Spatial audio/RealityKit | Stems-to-3D and native macOS spatial media experimentation. |

## Reliability, coordination, identity, and trust

| Node | Local path | Status | Role | Ecosystem meaning |
|---|---|---:|---|---|
| hapa-telemetry-node | `$HAPA_DESKTOP_ROOT/hapa-telemetry-node` | Core | Telemetry/discovery | Health, metrics, launcher system, node registry, and service discovery. |
| hapa-open-tasks-node | `$HAPA_DESKTOP_ROOT/hapa-open-tasks-node` | Core | Task/Kanban node | Cross-agent and human operational task tracking. |
| hapa-lore-node | `$HAPA_DESKTOP_ROOT/hapa-lore-node` | Core | Chronicle/search | Daily progress, wisdom, and lore/operator history with searchable storage. |
| hapa-keys-node | `$HAPA_DESKTOP_ROOT/hapa-keys-node` | Core | Key vault | Local secrets and provider/node keys in one loopback-first service. |
| hapa-agent-registry-node | `$HAPA_DESKTOP_ROOT/hapa-agent-registry-node` | Core | Agent registry | Agent profiles, avatar jobs, identity, onboarding metadata. |
| hapa-crypto-node | `$HAPA_DESKTOP_ROOT/hapa-crypto-node` | Core | Crypto/trust | Encryption, signatures, identity proofs, and trust primitives. |
| hapa-red-team | `$HAPA_DESKTOP_ROOT/hapa-red-team` | Lovable local MVP | Defensive observation and evidence workbench | Authorized local observation, Findings, and repair memory. It does not provide arbitrary remote attack execution. |

## Cards, indexes, protocol, and world state

| Node | Local path | Status | Role | Ecosystem meaning |
|---|---|---:|---|---|
| hapa-anvil-node | `$HAPA_DESKTOP_ROOT/hapa-anvil-node` | Core | Card forge/evaluator | Standardizes, evaluates, and forges Hapa cards and artifact vault outputs. |
| hapa-overcard | `$HAPA_DESKTOP_ROOT/hapa-overcard` | `0.1.1` private pre-release | Shared Hand/Deck capability | Owns shared schemas, reducers, placement/formation, attachment, responsibility, adapters, and conformance; source records and permissions stay with consumers. |
| hapa-overwind-node | `$HAPA_DESKTOP_ROOT/hapa-overwind-node` | Bounded Card Plane release | Card subscriber history and projections | Preserves acknowledged append-only Card history and lineage, with rebuildable Redis/Elasticsearch projections. Non-Card surfaces remain bounded. |
| hapa-second-brain-node | `$HAPA_SECOND_BRAIN_ROOT` | Active local/private | Memory and capability discovery | Retrieval, turn mining, provenance, and capability discovery over private operator data; the private corpus is excluded from the public repository. |
| hapa-lance-node | `$HAPA_DESKTOP_ROOT/hapa-lance-node` | Core | Index/projection | Cards, wiki chunks, embeddings, multimodal records, and retrieval datasets. |
| hapa-janus-world-node | `$HAPA_DESKTOP_ROOT/hapa-janus-world-node` | Core/prototype | World truth kernel | Append-only world events, derived state snapshots, command ingestion. |
| Consul Node Proto | `$HAPA_DESKTOP_ROOT/Consul Node Proto` | Prototype | Proof harness | Warden/Heap/River proof experiments and environment-up validation. |
| hapa-cultivation-suite | `$HAPA_DESKTOP_ROOT/pulse-node-proto-dev/hapa-cultivation-suite` | Prototype | Protocol tooling | Pulse/cultivation monorepo for capsule apps, workers, and growth mechanics. |
| hapa-spec-scaffold | `$HAPA_DESKTOP_ROOT/hapa-spec-scaffold` | Prototype | Spec/test scaffold | Append-only specs and deterministic tests for protocol concepts. |

## Archives and capsules

| Node | Local path | Status | Role | Ecosystem meaning |
|---|---|---:|---|---|
| hapa-og | `$HAPA_DESKTOP_ROOT/hapa-og` | Archive/reference | Historical Hapa snapshot | Older integrated implementation used for archaeology and comparison. |
| Help Fund Hapa Capsule | `$HAPA_DESKTOP_ROOT/help-fun-d-hapa-plz/capsule` | Prototype | Funding/simulator capsule | Funding/simulator UI artifact and TypeScript capsule source. |

## Practical routes

### I want to understand Hapa lore

Start in the wiki:

1. `Canon/Introduction for Humans.md`
2. `Canon/World Bible.md`
3. `Canon/Living Canon Map.md`
4. `Names/Index of Names.md`
5. `Systems/Mechanics Glossary.md`

Then use `hapa-wiki-viewer` for navigation.

### I want to build the app

Start with:

1. `hapa-dev-proto`
2. `Hapa_Worldbuilding_Wiki`
3. `hapa-lance-node`
4. `hapa-telemetry-node`
5. `hapa-open-tasks-node`

### I want to build card/media pipelines

Start with:

1. `Cards/ChatGPT Export Cards/Index.md`
2. `Systems/media-ingestion-to-card-wiki-loop.md`
3. `hapa-anvil-node`
4. `hapa-mlx-station`
5. `hapa-avatar-node`
6. `hapa-wiki-growth-agent`

### I want agents to work safely

Start with:

1. `.Overwatch/README.md`
2. `.Overwatch/ecosystem/WORKSPACE_INVENTORY.md`
3. `Hapa_Worldbuilding_Wiki/Operations/Overwatch Agent Identity and Task Protocol.md`
4. Target node README
5. Target node git status
