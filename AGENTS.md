# AGENTS.md

## Repo role

`$HAPA_DESKTOP_ROOT/hapa` is the Hapa front-door and Node Space desktop host. It is an active local node app, but it is mostly an orientation/documentation shell plus an Electron desktop surface that reads other Hapa roots. It is not the owning source repo for every Hapa node.

## Source-of-truth files

- `README.md` — human onboarding map and quickstart.
- `docs/NODE_MAP.md` — node inventory used by the desktop context loader.
- `docs/NODE_SPACE_DESKTOP.md` — Node Space desktop behavior and operating notes.
- `docs/FEATURE_PARITY.md` — API/CLI/UI parity status and remaining gaps.
- `docs/API.md` — local API/feature-spine contract.
- `docs/CLI.md` — scriptable CLI commands.
- `electron/hapa-local.js` — canonical local feature spine shared by Electron IPC, smoke checks, and the CLI.
- `electron/main.js` and `electron/preload.js` — Electron IPC bridge.
- `site/node-space.html`, `site/node-space.js`, `site/node-space.css` — Node Space desktop UI.
- `site/index.html`, `site/app.js`, `site/styles.css` — static front-door site and Markdown/repo reader.

## Safe edit boundaries

- Prefer adding app behavior through `electron/hapa-local.js` first, then expose it through Electron IPC, CLI, and UI as appropriate.
- Do not hard-code secrets or provider tokens. This repo should only read local Hapa paths and public/static assets.
- Do not mutate sibling Hapa repos from this repo except for documented flow-explainer output paths already owned by `electron/hapa-local.js`.
- Preserve local-first path defaults. The feature spine infers the Desktop root from this repo path when it lives under `Desktop`, and also supports `HAPA_DESKTOP_ROOT`, `HAPA_DOCUMENTS_ROOT`, and more specific `HAPA_*_ROOT` overrides.
- Treat generated snapshots in `site/generated/` as derived artifacts; update their source/process docs when changing generation behavior.

## Verification gates

Run the fastest local gates before handing off:

```bash
npm run check
npm run smoke:cli
npm run smoke:desktop
```

`npm run smoke:desktop` executes the desktop feature spine in Node; it does not open the Electron window. For UI visual changes, also run `npm run desktop` and inspect the app manually.

## Multi-agent Overwatch protocol

When a task is split across multiple Codex threads, use the registered Overwatch Multi-Agent Kanban Orchestration protocol:

- Start from one shared objective and one Kanban project.
- For every new Hapa app build, create or reuse a project in `$HAPA_CODEX_ROOT/2026-05-27/can-you-generate-me-some-concept/hapa-overwatch-kanban` before implementation work spreads across agents.
- Assign avatar lanes with owned paths, such as Blue for truth/data, Red for build/scene/visuals, Green for interaction/demo, and Overwatch for protocol/integration.
- Require every agent to append progress, blockers, handoffs, and verification notes to the Kanban event log.
- Treat the board as a projection; verify against live files, endpoints, tests, and source docs before moving cards to `done`.
- Register useful new routes as Flow Explainers, generated protocol sidecars, process-flow cards, and Second Brain skill evidence.

Canonical record: `Hapa_Worldbuilding_Wiki/Operations/Flow Explainers/Overwatch Multi-Agent Kanban Orchestration.md`.

## Board refresh skill

When the user asks to refresh board states, audit Kanban coverage, fill Hapa boards, reconcile Quest Keeper metrics, or make the work state visible to all humans and agents, use the registered `$hapa-board-keeper` skill.

Canonical runner:

```bash
$CODEX_HOME/skills/hapa-board-keeper/scripts/refresh_hapa_boards.sh
```

This flow must preserve append-only Kanban history. It may create or repair board configs, seed missing logs, append source-labeled backlog cards from local docs, and update Quest Keeper audit artifacts. It must not mutate app source files unless the human explicitly asks for implementation fixes.

Canonical records:

- `Hapa_Worldbuilding_Wiki/Skills/Hapa Board Keeper.md`
- `Hapa_Worldbuilding_Wiki/Operations/Flow Explainers/Hapa Board Keeper.md`

## Known caveats

- The API surface is Electron IPC plus the local CommonJS module, with an opt-in read-only loopback HTTP service via `npm run api`. `docs/FEATURE_PARITY.md` tracks the remaining service-manifest and UI docs gaps.
- The static front-door site includes safe Markdown/repo rendering. The Node Space Electron shell still needs an explicit in-app Docs/README panel before full UI docs compliance can be claimed.
- Many capabilities depend on sibling roots such as `Hapa_Worldbuilding_Wiki`, `.Overwatch`, `hapa-song-registry`, and `hapa-dev-proto`; missing roots should be reported truthfully instead of hidden.
