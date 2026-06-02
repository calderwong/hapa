# Hapa Protocol Standards

This is the app-facing implementation summary for the canonical wiki page at `$HAPA_DESKTOP_ROOT/Hapa_Worldbuilding_Wiki/Operations/Hapa Protocol Standards.md`.

## Purpose

Hapa protocol standards make a capability behave consistently across UI, API, CLI, agent harnesses, node-to-node flows, and durable memory. A standard is complete when it has a source of truth, a feature spine, parity expectations, a testable success output, and a writeback path into the wiki, Second Brain, or app protocol storage.

## Core Standards

- Source truth hierarchy: live source and endpoints first, wiki canon second, `.Overwatch` ops evidence third, Node Space/front-door routing fourth, Second Brain retrieval and enrichment as the connection layer.
- Feature spine: one canonical contract, fixture set, and validation harness should feed UI/API/CLI surfaces.
- API: loopback by default, public `/health`, authenticated `/capabilities` and `/v1/*`, explicit status/stage/progress/errors, no secrets in docs or frontend state.
- CLI: JSON output, `0` only on success or valid dry run, non-zero with machine-readable error, `--dry-run` for writes where practical.
- UI: README/docs viewer, provenance, truth-safe statuses, payload/log visibility, reduced motion, and no silent partial states.
- Test output: deterministic report with `ok`, `run_id`, `steps_results[]`, task/artifact summaries, durations, errors, and provenance.
- Documentation: frontmatter where appropriate, source links, status labels, route scripts, and explicit separation of verified facts from inference or lore.
- Inter-node interoperability: stable identity, capabilities, jobs, artifacts, route beats, and named record owners.
- Human + AI parity: humans get UI and readable docs; agents get AGENTS.md, API/CLI handles, structured context, and writeback targets.
- Multi-agent orchestration: when two or more agents work toward one artifact, use scoped avatar lanes, owned paths, append-only Kanban events, explicit blockers, and Overwatch reconciliation before claiming integration progress.
- Sync/update: after significant protocol changes, refresh Second Brain skill maps, topic maps, ecosystem maps, node skills, agents, turn lineage, and capability bridges.
- Bruce Lee compression: absorb the useful rule, discard noise, add Hapa-specific context, and keep source links.
- Continuous sharpening: context requests should capture purpose, objective, priority, returned sources, feedback, and future improvements.
- Love / Truth / Conviction: Love connects context and benefit; Truth validates and records; Conviction ships and records lineage.
- Hermes: treat Hermes as a long-running agent/harness with profiles, skills, memory, schedules, gateways, and explicit delegation writebacks.
- Avatars: treat avatar media as identity artifacts with source images, generated variants, reviewed facts, lineage manifests, and Trellis-safe prep decisions.
- Sequential pass triad: use For The Throat for fast acceptable output, Every Which Way for alternatives and appendable lanes, and With Flair for production value and teaching.
- Protocol Cards: promote reusable protocols into card records with source context, mechanics, record rules, and Second Brain retrieval hooks.

## Incremental Adoption Cases

1. Node app minimum: README, AGENTS.md, docs viewer, `/health`, `/capabilities`, CLI health/capabilities, and feature parity matrix.
2. Parity spine: add `contract_version`, schema, fixtures, deterministic harness, UI/API/CLI surface reports, and smoke output.
3. Flow standardization: add a wiki Flow Explainer, generated JSON sidecar, and registry entry for every cross-node route.
4. Multi-agent MVP run: create Overwatch Kanban cards, assign scoped avatar lanes, require append-only comms/writebacks, and run an integration smoke before marking the slice done.
5. Second Brain enrichment: index the protocol, query it with purpose/objective/priority, register creation lineage, and refresh capability bridges.
6. Hermes delegation: verify profile, capabilities, schedule/tool access, and writeback target before trusted automation.
7. Avatar promotion: decide `use_existing`, `use_existing_review`, or `needs_generation`; write manifest before 3D or Trellis work.
8. Sequential pass run: name the pass, resource stance, minimum acceptable output, next-pass trigger, and record owner.
9. Protocol Card promotion: create or update the card page, machine library entry, Second Brain article, and app-facing sidecar when the protocol should be reused.

## Successful Smoke Shape

```json
{
  "ok": true,
  "run_id": "run-id",
  "steps_results": [
    {
      "name": "health",
      "ok": true,
      "duration_seconds": 0.1,
      "error": null,
      "data": {}
    }
  ],
  "tasks": [],
  "downloads": []
}
```

## App Storage

- Canonical wiki page: `$HAPA_DESKTOP_ROOT/Hapa_Worldbuilding_Wiki/Operations/Hapa Protocol Standards.md`
- Flow explainer: `$HAPA_DESKTOP_ROOT/Hapa_Worldbuilding_Wiki/Operations/Flow Explainers/Hapa Protocol Standards Consolidation.md`
- Generated flow: `$HAPA_DESKTOP_ROOT/hapa/site/generated/protocol-flows/hapa-protocol-standards-consolidation.json`
- Multi-agent orchestration flow: `$HAPA_DESKTOP_ROOT/hapa/site/generated/protocol-flows/overwatch-multi-agent-kanban-orchestration.json`
- Repo-to-ship world loop flow: `$HAPA_DESKTOP_ROOT/hapa/site/generated/protocol-flows/black-horizon-repo-to-ship-world-loop.json`
- Sequential pass flow: `$HAPA_DESKTOP_ROOT/hapa/site/generated/protocol-flows/hapa-sequential-pass-triad.json`
- Protocol Card library: `$HAPA_DESKTOP_ROOT/hapa/site/generated/protocol-cards/protocol-card-library.json`
- Registry: `$HAPA_DESKTOP_ROOT/hapa/docs/PROCESS_FLOW_EXPLAINER_REGISTRY.md`
- Second Brain article: `hapa-protocol-standards`
