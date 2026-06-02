# Make a Flow and Explainer Protocol

Use this protocol whenever a new Hapa action crosses multiple nodes and should become teachable, playable, narratable, or reusable for content production.

## Required Fields

- Flow name
- Action verb
- Objective
- Participating nodes
- Ordered route script using `source -> target [UI|API|CLI|DATA]: handoff`
- Blue Architect explainer text for TTS
- Card hooks, effect, risk, and stats
- Production notes for action images, audio, video, or later cards
- Record rule naming the source-of-truth layer

## Output Records

The Node Space Desktop bridge writes:

- Wiki protocol page: `Hapa_Worldbuilding_Wiki/Operations/Flow Explainers/<flow-id>.md`
- Machine-readable sidecar: `site/generated/protocol-flows/<flow-id>.json`
- Registry entry: `docs/PROCESS_FLOW_EXPLAINER_REGISTRY.md`

## Agent Skill

Codex skill installed at:

`$CODEX_HOME/skills/hapa-flow-explainer/SKILL.md`

Use `$hapa-flow-explainer` when documenting or generating any Hapa multi-node process flow, flow card, TTS-ready step narration, or protocol sidecar.

## Quality Bar

Every saved flow should answer:

- What does this action accomplish?
- Which node owns each handoff?
- What should a player/operator learn by watching or playing it?
- What can fail?
- Where does the durable record land?
