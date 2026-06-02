# Hapa Operating Model

This document defines how this master repo should be used by humans and agents.

## Source-of-truth hierarchy

1. Working source code lives in each node repo.
2. Canon and conceptual structure live in `Hapa_Worldbuilding_Wiki`.
3. Operational status, inventories, reports, and cross-agent handoffs live in `.Overwatch`.
4. This master repo is the front door and routing layer.

When facts conflict, inspect the current repo/wiki files before assuming the newest-looking summary is correct.

## What belongs here

Put durable onboarding material here:

- Ecosystem overview.
- Node map and repo links.
- Reading routes into the wiki.
- Flowcharts and high-level architecture.
- Rules for how to navigate the Hapa ecosystem.

Do not put large generated assets, app build artifacts, raw source exports, or implementation code here unless the master repo later becomes a real product shell.

## Human workflow

1. Begin at this repo.
2. Decide whether the task is lore/canon, node/app development, media/card production, operations, or provenance research.
3. Follow the matching wiki/source links.
4. Work in the owning repo or wiki folder.
5. Update this repo only if the ecosystem map, onboarding route, or high-level model changes.

## Agent workflow

Before editing a node:

1. Read this repo's README or relevant docs page.
2. Read `.Overwatch/README.md` and the workspace inventory/status docs if the task crosses repos.
3. Read the target repo README.
4. Check `git status --short` in the target repo.
5. Avoid overwriting user or previous-agent changes.
6. Verify changes with the smallest meaningful command/test.
7. Commit in the target repo if the task is complete and local conventions expect committed work.

Before editing the wiki:

1. Determine whether the change is canon, draft, development, operation, card, raw provenance, or generated media.
2. Use draft/development/operation areas for uncertain synthesis.
3. Add provenance links for generated or interpreted material.
4. Avoid unsupported canon claims.

## Node contract pattern

Each node README should answer:

- Purpose: why the node exists.
- Current status: active, prototype, archive, partial, blocked, etc.
- Inputs: what data/events/assets it consumes.
- Outputs: what it produces.
- Interfaces: CLI/API/UI/files/ports.
- Related Hapa nodes: how it connects to the ecosystem.
- Operating contract: what future agents must preserve.

This master repo depends on those node-level contracts staying fresh.

## Common routes

### App feature

`hapa` -> `.Overwatch` -> `hapa-dev-proto` -> related node -> wiki page -> test/commit.

### Canon/lore feature

`hapa` -> `Hapa_Worldbuilding_Wiki` -> source/provenance page -> canon/draft page -> related cards/names -> viewer/index verification.

### Media/card feature

`hapa` -> wiki card/system page -> `hapa-anvil-node` -> `hapa-mlx-station` -> asset/provenance sidecars -> `hapa-dev-proto`/registry projection.

### Multi-node flow/protocol feature

`hapa` -> Node Space Desktop -> Make Flow + Explainer -> wiki `Operations/Flow Explainers` -> `site/generated/protocol-flows` -> process card docs/skill.

### Agent/operation feature

`hapa` -> `.Overwatch` -> `hapa-open-tasks-node`/`hapa-agent-registry-node` -> target node -> status/report update.

## Safety and honesty rules

- Distinguish scaffolding from tested behavior.
- Distinguish prototype UI from working integration.
- Do not claim a node is running unless it was launched or health-checked.
- Do not claim a wiki link resolves unless checked on disk.
- Preserve raw sources and provenance.
- Prefer small, committed increments across repos.
- If a pass is speculative, label it as draft, thought, or open question.
