<!-- HAPA-CONNECTIVITY-DOC:BEGIN -->
# Hapa Connectivity

Generated: 2026-06-01T23:45:00.000Z

This file is a publication-safe cross-link for humans and AIs. It describes how this repo fits into the Hapa system without embedding private local paths, secrets, heavy assets, DB payloads, or generated media.

## Identity

- Node id: `hapa`
- Repo name: `hapa`
- Hapa system group: `apps/front-door` (Apps / Front Door)
- Target assembly path: `hapa-system/apps/front-door/hapa`
- Link mode: `publish_source_with_vault_pointers`

## Role

This repo is the Hapa front door: it orients humans and AIs to the ecosystem and should point outward to nodes, wiki, quest boards, and vault-backed content.

## Reads From

- Hapa ecosystem docs and node manifests.
- Wiki pages or operations docs when this node needs canonical human context.
- Second Brain relation exports or memory summaries when this node needs durable recall.
- Private assets and generated media through `$HAPA_VAULT_ROOT`, not checked-in binaries.

## Writes To

- Source-safe docs, schemas, manifests, or small fixtures that can pass publication preflight.
- User-facing build artifacts only when they are intentionally release assets; generated caches stay ignored.

## Related Hapa Nodes

| Node | Relationship |
| --- | --- |
| `Hapa_Worldbuilding_Wiki` | Canonical wiki and operations knowledge. |
| `hapa_second_brain` | Durable memory, SQLite relation exports, and recall surface. |
| `hapa-overwatch-kanban` | Append-only project board and event protocol. |
| `hapa-quest-keeper` | Consolidated Quest board overview and board coverage audit. |

## Shared Control Surfaces

- `hapa`: front door, operator map, and ecosystem entry point.
- `Hapa_Worldbuilding_Wiki`: canonical human-readable lore, operations, and node documentation.
- `hapa_second_brain`: durable memory, relation exports, and local-first recall surface.
- `hapa-overwatch-kanban`: append-only board/event protocol for node work.
- `hapa-quest-keeper`: consolidated board overview and app coverage audit.
- `$HAPA_VAULT_ROOT`: private companion root for heavy assets, runtime DBs, generated media, and relation exports.

## Publication Boundary

- Publication strategy: `publish_source_with_vault_pointers`
- Publication wave: `checkpoint_under_review`
- Current assembly gate: `operator_remote_intent`

Source code, docs, schemas, and tiny fixtures are Git candidates after preflight. Runtime DBs, WAL/SHM files, local tokens, generated media, model weights, logs, app bundles, and vault exports stay out of public Git and should be represented by pointer manifests or rebuild instructions.

Vault pointer policy:

- Future pointer path: `vault/site-data-hapa-index-json.hapa-vault-pointer.json`
- Apply only after: vault copy and hash verification

## Open Gates

- Execute or approve vault/private route before public source publication.
- Apply hapa.vault.pointer.v1 only after vault copy and hash verification.
- Choose GitHub owner, repo name, and private/public visibility before remote creation.

## Safe Next Commands

- `git status --short`
- `npm run check`
- `npm run smoke:cli`
- `npm run smoke:desktop`
- `Apply vault pointer manifests only after vault copy and hash verification.`
- `Commit only intentional docs/source changes after reviewing the dirty worktree.`
- `Choose GitHub owner, repo name, and private/public visibility before remote creation.`
- `Run gitleaks/history scan before public release.`
- `Do not move repos, create remotes, push, purge, copy heavy assets, or rewrite history without the matching approval gate.`

## Verification

Run the fastest local checks that exist for this repo before publication or assembly:

```bash
git status --short
npm run check
```

<!-- HAPA-CONNECTIVITY-DOC:END -->
