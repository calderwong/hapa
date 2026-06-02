# Kanban UI Ingress Audit

Last audited: 2026-05-31 14:58 PDT

## Purpose

Every Hapa node UI should give the operator a direct way into the node-specific Overwatch Kanban board. This audit tracks the current ingress surfaces and the verification commands used to prove coverage.

Canonical board UI:

- Overwatch Kanban: `http://127.0.0.1:5181/?project=<project-id>`
- Board configs: `$HAPA_CODEX_ROOT/2026-05-27/can-you-generate-me-some-concept/hapa-overwatch-kanban/config/projects`
- Quest Keeper audit: `$HAPA_DESKTOP_ROOT/hapa-quest-keeper/artifacts/audit/hapa-node-kanban-audit.json`

## Implemented UI Surfaces

- Hapa front door: `site/index.html` loads `site/kanban-ingress.js`; `site/app.js` injects a `Kanban` ingress on every `.node-card`.
- Hapa Node Space: `site/node-space.html` loads `site/kanban-ingress.js`; the selected-node inspector renders the board project and an open-board action.
- Hapa Second Brain node/capability views: `second_brain.py` attaches `kanban_project_id` and `kanban_url`; `public/app.js` and `public/node-capability-space.js` render open-board actions for node and node-capability records.
- Standalone node UIs: audited UI-like Quest Keeper nodes now include a small fixed `Kanban` ingress in their HTML entry files, keyed to the node's own Overwatch project ID.

## Shared Mapping

The shared browser mapping lives in `site/kanban-ingress.js`. It is intentionally small and deterministic:

- Exact project IDs are copied from Overwatch project config filenames.
- Aliases map UI labels such as `world-building-wiki`, `hapa-node-space`, and `hapa-media-node` to their owning board.
- Generated URLs use the local Overwatch Kanban base URL.

Second Brain has the same ownership logic in `OVERWATCH_KANBAN_PROJECT_ALIAS` plus a dynamic read of the Overwatch project config directory, so newly-created boards can be recognized without a full UI rebuild.

## Current Coverage

Validated on 2026-05-31:

- Quest Keeper board audit: 53 audited node boards, 53 up to protocol, 0 partial, 0 missing.
- Overwatch project config parity: 56 project configs, 56 browser-helper project IDs, 0 missing from helper, 0 stale in helper.
- Hapa front door: 12 node cards, 12 Kanban-linked, 0 missing.
- Hapa Node Space: 37 selected-node entries, 37 Kanban-linked, 0 missing.
- Standalone node UIs from the Quest Keeper audit: 30 UI-like audited nodes, 30 with Kanban ingress, 0 missing.
- Standalone ingress scripts: 30 inline `data-hapa-kanban-ingress` scripts parsed, 0 parse errors.
- Hapa Second Brain payload: 109 node records, 76 Kanban-linked; 218 node-capability records, 152 Kanban-linked; 327 node/capability graph entries, 228 Kanban-linked.
- Headless browser check: Hapa front door, Node Space, Second Brain capability detail, Overwatch Kanban, and sampled standalone node UIs all exposed live board URLs.

The unresolved Second Brain records are mostly source digests, folders, tests, imported document names, and conceptual records rather than Quest Keeper-audited node boards. When one of those becomes a real node board, add the board config first, then add or verify the alias.

## Refresh And Test

Run the board audit:

```bash
cd $HAPA_DESKTOP_ROOT/hapa-quest-keeper
npm run audit:boards
```

Run Hapa UI checks:

```bash
cd $HAPA_DESKTOP_ROOT/hapa
npm run check
```

Run Second Brain checks:

```bash
cd $HAPA_CODEX_ROOT/2026-05-25/can-you-grab-my-1-amazon/hapa_second_brain
python3 -m py_compile second_brain.py
npm run check
```

Health-check Overwatch Kanban:

```bash
curl http://127.0.0.1:5181/health
curl http://127.0.0.1:5181/v1/projects/hapa-app-hapa/state
```

## Maintenance Rule

When adding a new Hapa node UI, the UI should either:

- expose a direct `kanban_project_id` and `kanban_url`, or
- call `HAPA_KANBAN_INGRESS.projectIdForNode(node)` and render the resulting `HAPA_KANBAN_INGRESS.boardUrl(projectId)`.
- if it is a standalone HTML UI, include a `data-hapa-kanban-ingress` script that links to `http://127.0.0.1:5181/?project=<project-id>`.

If a UI only exposes a conceptual or imported source record, do not invent a dedicated board. Map it to the owning board only when ownership is clear.
