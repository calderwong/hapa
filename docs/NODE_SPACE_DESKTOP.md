# Hapa Node Space Desktop

Hapa Node Space Desktop is the local Electron version of `site/node-space.html`. It keeps the 3D operating graph, music visualizer, flow-card animation surface, and Hapa/Astros styling, then adds a preload bridge for local filesystem and local-network work.

## Local Sources

The desktop bridge scans these roots by default:

- Wiki: `$HAPA_DESKTOP_ROOT/Hapa_Worldbuilding_Wiki`
- Song registry: `$HAPA_DESKTOP_ROOT/hapa-song-registry/data/registry.json`
- Full song library: `$HAPA_DESKTOP_ROOT/suno-library`
- Main app: `$HAPA_DESKTOP_ROOT/hapa-dev-proto`
- Overwatch: `$HAPA_DESKTOP_ROOT/.Overwatch`
- Hapa Asset Viewer handoff: `$HAPA_DESKTOP_ROOT/hapa-dev-proto/data/hapa-asset-viewer`
- Hapa Asset Viewer workspace: `$HAPA_CODEX_ROOT/2026-05-24/i-want-to-create-a-spacehip`

Environment overrides:

- `HAPA_WIKI_ROOT`
- `HAPA_SONG_REGISTRY_ROOT`
- `HAPA_SONG_LIBRARY_ROOT`
- `HAPA_DEV_PROTO_ROOT`
- `HAPA_OVERWATCH_ROOT`
- `HAPA_ASSET_VIEWER_HANDOFF_ROOT`
- `HAPA_ASSET_VIEWER_WORKSPACE`
- `HAPA_ASSET_VIEWER_APP`

## Desktop Bridge Capabilities

- Load full wiki markdown inventory and section counts.
- Load the full Hapa song registry and play local audio via `file://` URLs.
- Read the node map from `docs/NODE_MAP.md`.
- Open the selected node's Overwatch Kanban board through the shared `site/kanban-ingress.js` mapping.
- Ping known localhost node endpoints.
- Open known Hapa roots in Finder.
- Create a "Flow + Explainer" protocol page in the wiki and a JSON sidecar under `site/generated/protocol-flows/`.
- Read the Hapa Asset Viewer registry, find registered `ship` runs, and expose their rigged `.glb` files to Armada Mode.

## Armada Mode

The `Armada` toggle swaps node spheres for ship silhouettes. In the Electron desktop app, each node gets a deterministic Asset Viewer ship assignment from the handoff registry, preferring carriers for host/core nodes, production ships for media nodes, dreadnought/cruiser forms for trust nodes, archive-heavy ships for wiki/Atlas nodes, and frigates for app/surface nodes.

Node Space starts with lightweight local hulls so the graph responds immediately. When running as the desktop app, it lazily loads the real rigged GLBs from the Asset Viewer output folders through the Electron `hapa-asset://` protocol, using the registry manifests in `hapa-dev-proto/data/hapa-asset-viewer` as the source of truth. The actual generated assets remain in the Asset Viewer workspace under `output/<asset-name>/`.

For performance, the full graph stays on the lightweight armada hulls and detailed Asset Viewer GLBs load on demand for the selected node, hovered node, and currently active flow-step nodes. The browser version at `http://127.0.0.1:9890/node-space.html` cannot access those local GLBs directly, so it displays the same deterministic armada assignments as procedural hulls; launch the desktop app when validating the actual rigged ships.

Ship assignment also records the GLB byte size and prefers lighter matching Asset Viewer ships when several ships fit the same node archetype. The bridge prefers each asset's `.rigged.glb` when available, falling back to tangent-heavy variants only when needed. This keeps the armada responsive without disconnecting the node card from the real generated ship library.

The renderer only receives these capabilities through `electron/preload.js`; Node integration stays off.

## Run

```bash
cd $HAPA_DESKTOP_ROOT/hapa
npm install
npm run desktop
```

Desktop launcher:

```bash
open "$HAPA_DESKTOP_ROOT/Launch Hapa Node Space.command"
```

## Checks

```bash
npm run check
npm run smoke:desktop
```

`npm run smoke:desktop` verifies wiki counts, music counts, node-map counts, Asset Viewer ship counts, and localhost endpoint reachability.

Kanban ingress coverage is tracked in `docs/KANBAN_UI_INGRESS_AUDIT.md`. Re-run that audit when adding or renaming node cards, Node Space seed nodes, or Overwatch project configs.
