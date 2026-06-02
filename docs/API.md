# Hapa Node Space API

## Current API status

Status: partial.

This repo now has two local-first API surfaces:

1. `electron/hapa-local.js` exports the canonical CommonJS feature spine.
2. `electron/main.js` exposes that feature spine to the desktop renderer through Electron IPC handlers.
3. `bin/hapa-node-space.js` exposes the same feature spine through a scriptable CLI.
4. `npm run api -- --port 8876` starts an optional read-only loopback HTTP server.

The HTTP server binds to `127.0.0.1` by default and exposes read-only `/health`, `/capabilities`, and `/v1/*` endpoints. It is not started automatically by Electron.

## Local module contract

Import:

```js
const local = require('./electron/hapa-local');
```

Exports:

| Export | Purpose | Side effects |
| --- | --- | --- |
| `roots` | Resolved Hapa root paths. | none |
| `assertAllowedPath(targetPath)` | Guard file paths to known Hapa roots. | throws on disallowed path |
| `getContext()` | Summarize wiki, nodes, music, flows, and ships. | read-only |
| `getMusicLibrary()` | Read song registry or local song library fallback. | read-only |
| `getProviderCostSurvey(options)` | Read the Second Brain provider/local compute cost survey, parse Markdown tables, and return filterable rows. | read-only |
| `getShipAssets()` | Read ship assets from handoff registry or viewer manifest. | read-only |
| `checkLocalServices()` | Probe known loopback Hapa service URLs. | loopback GET requests |
| `createFlowExplainer(payload)` | Create a protocol flow explainer. | writes wiki/generated/registry files |

## Electron IPC handlers

Registered in `electron/main.js`:

| IPC channel | Backing function |
| --- | --- |
| `hapa:get-context` | `local.getContext()` |
| `hapa:get-music-library` | `local.getMusicLibrary()` |
| `hapa:get-provider-cost-survey` | `local.getProviderCostSurvey(options)` |
| `hapa:get-ship-assets` | `local.getShipAssets()` |
| `hapa:create-flow-explainer` | `local.createFlowExplainer(payload)` |
| `hapa:check-services` | `local.checkLocalServices()` |
| `hapa:open-path` | `local.assertAllowedPath()` then `shell.openPath()` |
| `hapa:show-path` | `local.assertAllowedPath()` then `shell.showItemInFolder()` |

## Loopback HTTP API

Start it explicitly:

```bash
cd $HAPA_DESKTOP_ROOT/hapa
npm run api -- --port 8876
```

Endpoints:

- `GET /health` -> root existence and count summary, equivalent to `npm run cli -- health`.
- `GET /capabilities` -> parity/status object, equivalent to `npm run cli -- capabilities`.
- `GET /v1/context`
- `GET /v1/nodes`
- `GET /v1/music`
- `GET /v1/ships`
- `GET /v1/services`
- `GET /v1/provider-costs`
- `GET /v1/provider-costs/rows`

Flow-explainer creation remains available through Electron IPC and CLI. The HTTP server is intentionally read-only for now.

Provider survey query parameters:

| Parameter | Meaning |
| --- | --- |
| `provider` | Match provider/local-provider or model text, such as `openai`, `fal`, or `hapa`. |
| `model` | Match model/route text, such as `sora-2` or `veo`. |
| `task` | Match task text, such as `video`, `coding`, or `image`. |
| `query` / `q` | Full-row text search. |
| `local=true` | Return only local Mac Studio rows. |
| `hosted=true` | Return only hosted provider rows. |
| `limit=n` | Return the first `n` matching flattened rows. |
| `markdown=true` | Include the source Markdown page in `/v1/provider-costs`. |

Examples:

```bash
curl 'http://127.0.0.1:8876/v1/provider-costs/rows?task=video&hosted=true'
curl 'http://127.0.0.1:8876/v1/provider-costs?provider=fal&limit=5'
```

## Verification

```bash
npm run check
npm run smoke:cli
npm run smoke:desktop
```
