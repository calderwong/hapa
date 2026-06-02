# Hapa Node Space CLI

The CLI exposes the same local feature spine used by the Electron desktop host: `electron/hapa-local.js`.

## Quickstart

```bash
cd $HAPA_DESKTOP_ROOT/hapa
npm run cli -- help
npm run cli -- health
npm run cli -- capabilities
npm run cli -- provider-costs --hosted --task video
```

If the package is linked or installed, the bin name is:

```bash
hapa-node-space health
```

## Commands

All data commands print JSON for scriptability.

| Command | Purpose | Write behavior |
| --- | --- | --- |
| `health` | Report root existence and local feature counts. | read-only |
| `capabilities` | Report API/CLI/UI surfaces and standard status. | read-only |
| `context` | Emit full local context from `electron/hapa-local.js#getContext()`. | read-only |
| `nodes` | Emit node inventory from `docs/NODE_MAP.md`. | read-only |
| `music` | Emit music library summary/tracks. | read-only |
| `ships` | Emit ship asset summary. | read-only |
| `services` | Probe known loopback Hapa endpoints. | read-only network probes |
| `provider-costs` | Emit the Second Brain provider/local compute cost survey as structured JSON. | read-only |
| `flow-explainer` | Create a flow explainer wiki page and generated JSON record. | writes documented flow files unless `--dry-run` is passed |
| `serve-api` | Start the read-only loopback HTTP API. | read-only while running |

## Provider cost survey

The provider survey is stored in the Second Brain at:

`$HAPA_DESKTOP_ROOT/Hapa_Worldbuilding_Wiki/Operations/Hapa Provider Cost Survey.md`

Examples:

```bash
npm run cli -- provider-costs --hosted --task video
npm run cli -- provider-costs --provider fal --limit 5
npm run cli -- provider-costs --local --query qwen
```

Supported filters:

- `--provider <text>`
- `--model <text>`
- `--task <text>`
- `--query <text>` or `--q <text>`
- `--table <text>`
- `--local`
- `--hosted`
- `--limit <n>`
- `--markdown`

## Loopback API

```bash
npm run api -- --port 8876
curl 'http://127.0.0.1:8876/v1/provider-costs/rows?task=video&hosted=true'
```

## Flow explainer dry run

```bash
npm run cli -- flow-explainer \
  --name "Example Flow" \
  --objective "Show a safe route." \
  --steps "hapa -> .Overwatch [DATA]: publish standard" \
  --dry-run
```

Remove `--dry-run` only when you intend to write:

- `Hapa_Worldbuilding_Wiki/Operations/Flow Explainers/<id>.md`
- `site/generated/protocol-flows/<id>.json`
- `docs/PROCESS_FLOW_EXPLAINER_REGISTRY.md`

## Environment roots

The CLI honors the same environment overrides as the desktop feature spine:

- `HAPA_DESKTOP_ROOT`
- `HAPA_DOCUMENTS_ROOT`
- `HAPA_WIKI_ROOT`
- `HAPA_SONG_REGISTRY_ROOT`
- `HAPA_SONG_LIBRARY_ROOT`
- `HAPA_DEV_PROTO_ROOT`
- `HAPA_OVERWATCH_ROOT`
- `HAPA_ASSET_VIEWER_APP`
- `HAPA_ASSET_VIEWER_WORKSPACE`
- `HAPA_ASSET_VIEWER_HANDOFF_ROOT`

## Verification

```bash
npm run check
npm run smoke:cli
npm run smoke:desktop
```
