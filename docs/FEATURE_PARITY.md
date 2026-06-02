# Hapa Node Space Feature Parity

Status terms follow `$HAPA_DESKTOP_ROOT/Hapa_Worldbuilding_Wiki/Operations/Hapa Node App Standards.md`.

## Repo determination

`$HAPA_DESKTOP_ROOT/hapa` is an active Hapa front-door/node app. It contains:

- a static Hapa front-door website in `site/`;
- an Electron desktop surface, Hapa Node Space, in `electron/` + `site/node-space.*`;
- local feature-spine logic in `electron/hapa-local.js` for wiki summaries, node map summaries, music library summaries, provider/local compute cost survey access, ship assets, local service checks, and flow-explainer creation.

It is not the owning implementation repo for every node listed in the ecosystem map.

## Parity matrix

| Capability | API | CLI | UI | Data source | Auth | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Local health/counts | `electron/hapa-local.js#getContext()` via Electron IPC; optional HTTP `GET /health` through `npm run api` | `npm run cli -- health` | Node Space desktop summary panels | Known Hapa roots and local files | Local filesystem only | `npm run smoke:cli`, `npm run smoke:desktop` | partial |
| Capabilities/parity disclosure | `bin/hapa-node-space.js` capabilities object; optional HTTP `GET /capabilities` through `npm run api` | `npm run cli -- capabilities` | Docs/readme references in README and static docs surfaces | This repo docs | none | `npm run smoke:cli` | partial |
| Node inventory | `getContext().nodes` / `summarizeNodes()` | `npm run cli -- nodes` | 3D Node Space graph and static site repo/node sections | `docs/NODE_MAP.md` | none | `npm run cli -- nodes` | partial |
| Wiki summary | `getContext().wiki` / `summarizeWiki()` | `npm run cli -- context` | Node Space desktop and static wiki reader snapshots | `HAPA_WIKI_ROOT` or Desktop wiki | none | `npm run smoke:desktop` | partial |
| Music library | `getMusicLibrary()` | `npm run cli -- music` | Node Space music widget | `hapa-song-registry` registry or `suno-library` fallback | none | `npm run cli -- music` | partial |
| Ship assets | `getShipAssets()` | `npm run cli -- ships` | Node Space ship/armada views | `hapa-dev-proto` asset handoff or asset viewer manifest | none | `npm run cli -- ships` | partial |
| Local service checks | `checkLocalServices()` | `npm run cli -- services` | Node Space service/pulse views | loopback URLs in `electron/hapa-local.js` | none | `npm run cli -- services` | partial |
| Provider cost survey | `getProviderCostSurvey(options)` via local module, Electron IPC, and optional HTTP `GET /v1/provider-costs` / `/v1/provider-costs/rows` | `npm run cli -- provider-costs` | Node Space desktop bridge includes survey row count; wiki page is browsable in the Second Brain | `Hapa_Worldbuilding_Wiki/Operations/Hapa Provider Cost Survey.md` | none | `npm run cli -- provider-costs --hosted --task video` | partial |
| Flow explainer creation | `createFlowExplainer(payload)` | `npm run cli -- flow-explainer ...` | Node Space flow authoring UI | Wiki Operations folder + `site/generated/protocol-flows` | local filesystem write access | `npm run cli -- flow-explainer --dry-run ...` | partial |
| README/Markdown viewing | Static site `site/app.js` Markdown renderer escapes HTML and renders wiki/repo snapshots | CLI docs available in `docs/CLI.md`; no CLI Markdown rendering needed | Static front-door has wiki/repo Markdown reader; Node Space desktop explicit Docs panel still missing | local generated snapshots, README/docs | none | `npm run check` syntax only; visual smoke still manual | partial |

## Compliance status

Partial. The CLI gap from the audit is healed with a minimal scriptable CLI backed by the same local feature spine used by Electron. A read-only loopback HTTP API now exists, but full standard compliance is not claimed because:

1. the HTTP API is opt-in and read-only rather than a continuously running node service;
2. the Node Space Electron shell does not yet expose a dedicated Docs/README/Protocol/Help panel for this repo README;
3. UI Markdown/README verification was syntax-checked but not visually smoke-tested in this pass.

## Next hardening tasks

- Harden the optional loopback HTTP server with a persistent launch profile, service manifest, and smoke tests for `/health`, `/capabilities`, and `/v1/provider-costs`.
- Add a first-class Docs/README panel to `site/node-space.html` / `site/node-space.js` with provenance, raw/open/copy affordances, and safe Markdown rendering.
- Add automated static DOM smoke tests for the static Markdown reader and Node Space Docs panel once implemented.
