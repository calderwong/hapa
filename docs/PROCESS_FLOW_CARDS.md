# Hapa Process Flow Cards

This catalog turns multi-node Hapa actions into teachable process cards. Each card describes a workflow that moves through two or more nodes, leaves evidence behind, and teaches a player or operator why the route matters.

The matching animated scenarios live in `site/node-space.js` as `FLOW_SCENARIOS` and `FLOW_STEP_EXPLANATIONS`. Those entries carry the longer Blue Architect narration for UI playback and future TTS.

## Process Card Standard

Use this schema when adding a new flow:

- `id`: Stable lowercase scenario id.
- `name`: Player-facing process card name.
- `objective`: What action the flow completes.
- `teaches`: What the player/operator should learn.
- `nodes`: The nodes that must appear in the route.
- `script`: Ordered route beats using `source -> target [layer]`.
- `card hooks`: Mechanics, risks, and failure states that can become game card text.
- `record rule`: What source-of-truth layer should remember the result.

## Make a Flow + Explainer

Node Space Desktop includes a local "Make Flow + Explainer" form. Use it when a workflow should become both a protocol record and a content-production asset.

The form writes:

- A wiki page under `Hapa_Worldbuilding_Wiki/Operations/Flow Explainers/`.
- A JSON sidecar under `site/generated/protocol-flows/`.
- A registry entry in `docs/PROCESS_FLOW_EXPLAINER_REGISTRY.md`.

For agent work, use the installed Codex skill at `$CODEX_HOME/skills/hapa-flow-explainer/SKILL.md`.

## Protocol And Parity Flows

### Hapa Sequential Pass Triad

Objective: Route Hapa work through For The Throat, Every Which Way, and With Flair so speed, optionality, and production value all leave durable memory.

Teaches: A fast pass can ship without becoming memoryless; an exploration pass can improve without drifting; a production pass can teach without hiding the source structure.

Nodes: `Context`, `For The Throat`, `Hapa Foundations`, `Every Which Way`, `With Flair`, `Protocol Cards`, `Hapa Second Brain`.

Script:

1. `Context -> For The Throat [DATA|CLI|API|UI]`: Compress the objective, deadline, constraints, and tolerance into the fastest acceptable solution.
2. `For The Throat -> Hapa Foundations [DATA]`: Leave UI/API/CLI intent, dependency notes, registry hooks, turn/card lineage, and next-pass gaps.
3. `Hapa Foundations -> Every Which Way [DATA|API|CLI]`: Reopen the result while compute or time is available, compare alternatives, and decide whether to append, replace, or redeploy.
4. `Every Which Way -> With Flair [DATA|UI]`: Hand the best structural answer to a production-value pass that teaches the why, preserves lineage, and improves retention.
5. `With Flair -> Protocol Cards [DATA]`: Mint or update Protocol Cards, Skill Cards, Lore Cards, Song Cards, loop hooks, docs, and demos from the learned pattern.
6. `Protocol Cards -> Hapa Second Brain [DATA|API|CLI]`: Index the cards, pass records, lineage, and sharpening notes for future retrieval.

Card hooks: For The Throat cuts to a minimum acceptable output; Every Which Way branches alternatives; With Flair turns working structure into ecosystem wisdom.

Record rule: The wiki owns canonical pass language; Node Space owns the generated flow; Protocol Cards own playable summaries; Second Brain owns retrieval and sharpening.

### Hapa Protocol Standards Consolidation

Objective: Consolidate scattered Hapa standards from hapa-dev-proto, the wiki, Second Brain, Hermes, avatars, and Node Space into one source-linked operating contract.

Teaches: A Hapa capability becomes trustworthy when Love gathers context, Truth validates it, and Conviction ships it through UI/API/CLI surfaces with tests, provenance, and durable memory.

Nodes: `hapa-dev-proto`, `Hapa Wiki`, `Hapa Second Brain`, `Hermes`, `Hapa Avatars`, `Node Space`.

Script:

1. `hapa-dev-proto -> Hapa Protocol Standards [DATA]`: Reference docs, validation rules, API contracts, topology, UI standards, and Love/Truth/Conviction language establish the spine.
2. `Hapa Wiki -> Hapa Protocol Standards [DATA]`: Node standards, Overwatch protocols, Flow Explainer rules, and wiki schema contribute canon and status language.
3. `Hapa Second Brain -> Hapa Protocol Standards [API|CLI|DATA]`: Context, sharpening, sync, lineage, agents, node skills, and bridges define enrichment expectations.
4. `Hermes -> Hapa Protocol Standards [API|CLI|UI]`: Profiles, skills, memory, schedules, gateways, and harness identity define long-running agent parity.
5. `Hapa Avatars -> Hapa Protocol Standards [DATA|API]`: Avatar indexes, lineage manifests, generated interpretations, and Trellis prep decisions define identity media standards.
6. `Hapa Protocol Standards -> Node Space [DATA]`: The standard becomes a generated protocol-flow JSON and registry entry.
7. `Hapa Protocol Standards -> Hapa Second Brain [DATA]`: The standard becomes searchable context for future node work and deployment opportunities.

Card hooks: Protocol Spine unifies surfaces; Parity Gate blocks silent gaps; Roll The Tapes preserves evidence; Sharpening Pass improves retrieval; Avatar Lineage Lock protects identity media; Hermes Delegation Seal controls autonomous work.

Record rule: The wiki owns canonical protocol language; Node Space owns generated flow storage and registry; Second Brain owns indexed retrieval, enrichment, and deployment opportunities; node repos own runnable implementation and tests.

## Record And Recovery Flows

### Atlas Healing Sweep

Objective: Inventory cards, media, docs, wiki entries, orphan assets, and analysis queues, then push clean records into retrieval and telemetry.

Teaches: Atlas is the local source-of-record spine. A healing pass is not just a scan; it rebuilds confidence by finding gaps, relationships, stale files, and missing metadata.

Nodes: `.Overwatch`, `Master View`, `Atlas`, `Worldbuilding Wiki`, `Library`, `hapa-media-node`, `hapa-ltx-node`, `hapa-lance-node`, `hapa-telemetry-node`.

Script:

1. `.Overwatch -> Master View [CLI]`: Operator standards trigger a controlled health sweep.
2. `Master View -> Atlas [API]`: Master View launches Atlas healing and watches source-of-record state.
3. `Worldbuilding Wiki -> Atlas [DATA]`: Wiki canon and documentation are indexed with provenance.
4. `Library -> Atlas [DATA]`: Card and media records replay into the inventory.
5. `hapa-media-node -> Atlas [DATA]`: Image assets report analysis metadata for reuse.
6. `hapa-ltx-node -> Atlas [DATA]`: Loop videos attach generation and recognition metadata.
7. `Atlas -> hapa-lance-node [DATA]`: Clean entities bridge into retrieval indexes.
8. `Atlas -> hapa-telemetry-node [API]`: Health, size, queue, and orphan counts return to ops telemetry.

Card hooks: Healing Sweep finds orphan resources; Source Of Truth restores broken relationships; Stale Index penalty applies if Lance is not refreshed.

Record rule: Atlas records inventory state, orphan counts, relationships, and repair timestamps; Telemetry records health deltas.

### Card Media Backfill

Objective: Detect cards missing images or loop videos, run local or paid provider lanes, preview outputs, and persist the result.

Teaches: The Library is an active maintenance bay, not passive storage. Media queues should be fed from known gaps and return visible outputs plus cost/timing telemetry.

Nodes: `Library`, `Atlas`, `hapa-media-node`, `hapa-ltx-node`.

Script:

1. `Library -> Atlas [DATA]`: Library asks Atlas which cards are missing media.
2. `Atlas -> hapa-media-node [API]`: Image candidates are dispatched to the media provider lane.
3. `hapa-media-node -> Library [DATA]`: Generated images return with model, timing, and artifact metadata.
4. `Library -> hapa-ltx-node [API]`: Loop tasks move into the video queue.
5. `hapa-ltx-node -> Library [DATA]`: Completed loops return to card previews and output telemetry.
6. `Library -> Atlas [DATA]`: Final assets, relationships, costs, and analysis are persisted.

Card hooks: Backfill Queue creates missing media; Preview Discipline avoids bad attachments; Provider Cost applies when paid lanes are used.

Record rule: Atlas stores asset relationships, prompts, provider metadata, costs, and recognition descriptions.

### Legacy Card Migration

Objective: Recover Hapa OG cards and media, normalize them through Anvil, expose them in the Library, repair missing assets, and record migration lineage.

Teaches: Archives are lineage, not trash. Migration should preserve where old material came from and what changed during repair.

Nodes: `hapa-og`, `hapa-anvil-node`, `Atlas`, `Library`, `hapa-media-node`, `hapa-ltx-node`, `Worldbuilding Wiki`.

Script:

1. `hapa-og -> hapa-anvil-node [DATA]`: Legacy cards and media are handed to Anvil for archaeology.
2. `hapa-anvil-node -> Atlas [DATA]`: Normalized legacy cards land in Atlas with migration notes.
3. `Atlas -> Library [DATA]`: Library exposes migrated cards for inspection and repair.
4. `Library -> hapa-media-node [API]`: Missing legacy images are queued for backfill.
5. `Library -> hapa-ltx-node [API]`: Missing legacy loops are queued for motion repair.
6. `Atlas -> Worldbuilding Wiki [DATA]`: Recovered lineage and migration notes return to canon.

Card hooks: Archive Archaeology recovers a hidden card; Broken Link creates a repair quest; Lineage Bonus applies when provenance is preserved.

Record rule: Atlas stores migration notes and repaired asset relationships; the wiki receives durable migration summaries.

## Creation And Canon Flows

### Forge To Duel

Objective: Move canon and card ingredients through Forge and Anvil, write lineage into Atlas, and load playable attributes into the Game Engine.

Teaches: Creation needs both imagination and standardization. Cards can carry append-only context attributes for specific games without corrupting canonical identity.

Nodes: `Worldbuilding Wiki`, `Hapa's Forge`, `hapa-anvil-node`, `Atlas`, `Game Engine`, `hapa-janus-world-node`.

Script:

1. `Worldbuilding Wiki -> Hapa's Forge [DATA]`: Canon, tags, and source notes feed card combination prompts.
2. `Hapa's Forge -> hapa-anvil-node [API]`: Anvil standardizes the card shape, rarity, and provenance.
3. `hapa-anvil-node -> Hapa's Forge [API]`: Validated artifact output returns to Forge.
4. `Hapa's Forge -> Atlas [DATA]`: New card lineage and append-only context attributes land in Atlas.
5. `Atlas -> Game Engine [DATA]`: The game loads playable cards plus game-specific attributes.
6. `Game Engine -> hapa-janus-world-node [API]`: Duel results can become world events and state deltas.

Card hooks: Fusion Heat combines cards; Context Attribute adds game-specific stats; Duel Telemetry writes a result into world state.

Record rule: Atlas stores lineage and contextual attributes; Janus stores world events created by play.

### Website To Card Capture

Objective: Capture a website target, extract card candidates and provenance, standardize them, and make them searchable.

Teaches: Outside material must be captured with source anchors, not copied blindly. The system should create both compressed cards and readable provenance.

Nodes: `AI Model Chat`, `Thor's Hamma`, `hapa-anvil-node`, `Worldbuilding Wiki`, `Atlas`, `Library`, `hapa-lance-node`.

Script:

1. `AI Model Chat -> Thor's Hamma [API]`: Operator target and capture intent become a website card mission.
2. `Thor's Hamma -> hapa-anvil-node [API]`: Source anchors and use cases are extracted into card candidates.
3. `Thor's Hamma -> Worldbuilding Wiki [DATA]`: Site-derived notes and provenance land in the wiki.
4. `hapa-anvil-node -> Atlas [DATA]`: Standardized website cards are written to Atlas with lineage.
5. `Atlas -> Library [DATA]`: Library exposes the captured cards for inspection.
6. `Library -> hapa-lance-node [DATA]`: Captured source fragments become searchable retrieval context.

Card hooks: Boarding Scan extracts a source hook; Provenance Lock prevents unverified cards; Retrieval Echo makes captured material callable later.

Record rule: Atlas stores card lineage; the wiki stores source notes; Lance indexes approved fragments.

### Canon Growth Loop

Objective: Run a bounded wiki growth pass, review drafts, and propagate approved material into retrieval, lore, and card search.

Teaches: Canon growth is governed. Generated drafts should remain reviewable before they become retrieval authority.

Nodes: `.Overwatch`, `hapa-wiki-growth-agent`, `Worldbuilding Wiki`, `hapa-wiki-viewer`, `hapa-lance-node`, `hapa-lore-node`, `Library`.

Script:

1. `.Overwatch -> hapa-wiki-growth-agent [CLI]`: Operator standards bound a wiki growth pass.
2. `hapa-wiki-growth-agent -> Worldbuilding Wiki [CLI]`: Draft articles, card hooks, and ledgers are proposed to the wiki.
3. `Worldbuilding Wiki -> hapa-wiki-viewer [UI]`: The viewer renders new canon for human review.
4. `Worldbuilding Wiki -> hapa-lance-node [DATA]`: Approved wiki pages are chunked into retrieval indexes.
5. `Worldbuilding Wiki -> hapa-lore-node [DATA]`: Canon changes become chronicle and briefing material.
6. `hapa-lance-node -> Library [DATA]`: Updated retrieval context improves card search and filters.

Card hooks: Growth Pass creates draft canon; Review Gate blocks premature indexing; Canon Echo improves search.

Record rule: The wiki owns approved text; Lance owns retrieval projections; Lore records why the change mattered.

### Song To Card Canon

Objective: Turn songs, lyrics, prompts, and audio metadata into canon notes, card seeds, retrieval context, standardized cards, and game attributes.

Teaches: Music is a memory channel. Song-backed cards can carry mood, timing, motifs, and mechanics.

Nodes: `hapa-song-registry`, `Worldbuilding Wiki`, `Library`, `hapa-lance-node`, `hapa-anvil-node`, `Atlas`, `Game Engine`.

Script:

1. `hapa-song-registry -> Worldbuilding Wiki [DATA]`: Song prompts and lyric lore are written into canon.
2. `hapa-song-registry -> Library [DATA]`: Music-backed card seeds enter the Library.
3. `Worldbuilding Wiki -> hapa-lance-node [DATA]`: Lyrics and song lore become retrieval context.
4. `Library -> hapa-anvil-node [API]`: Music-backed card candidates are sent for standardization.
5. `hapa-anvil-node -> Atlas [DATA]`: Validated song cards and lineage return to Atlas.
6. `Atlas -> Game Engine [DATA]`: Game Engine receives song-backed card attributes.

Card hooks: Anthem Signal grants morale; Lyric Ledger creates a lore hook; Resonance Attribute affects game play.

Record rule: Song Registry owns audio metadata; Atlas stores card relationships; Game Engine reads contextual mechanics.

## Operations, Trust, And Provider Flows

### Master Ops Launch

Objective: Use Master View as the cockpit for node health, credentials, task queues, and launchable provider lanes.

Teaches: A master dashboard should not only open UIs; it should show readiness, health, and source-of-record state before action.

Nodes: `Master View`, `hapa-telemetry-node`, `hapa-keys-node`, `hapa-open-tasks-node`, `hapa-ltx-node`, `hapa-media-node`, `Atlas`.

Script:

1. `Master View -> hapa-telemetry-node [API]`: Dashboard polls node registry and service health.
2. `hapa-telemetry-node -> Master View [API]`: Live status returns for the operator shell.
3. `Master View -> hapa-keys-node [API]`: Provider and node credentials are checked before launch.
4. `Master View -> hapa-open-tasks-node [API]`: Outstanding work queues and recovery tasks are loaded.
5. `Master View -> hapa-ltx-node [API]`: Video generation lanes can be booted from the master.
6. `Master View -> hapa-media-node [API]`: Image provider lanes can be booted from the master.
7. `Master View -> Atlas [API]`: Atlas record health anchors the whole view.

Card hooks: Cockpit Sync reveals node readiness; Boot Lane starts an offline provider; Missing Atlas disables durable memory bonuses.

Record rule: Telemetry owns service status; Master View owns operator display state.

### Agent Onboarding And Trust

Objective: Onboard an agent through registry profile, avatar identity, cryptographic proof, credential readiness, and chat availability.

Teaches: Agents are participants with identity, visual memory, proof, permissions, and rooms where they act.

Nodes: `Master View`, `hapa-agent-registry-node`, `hapa-avatar-node`, `hapa-crypto-node`, `hapa-keys-node`, `hapa-chat-app`.

Script:

1. `Master View -> hapa-agent-registry-node [API]`: Master View starts an agent onboarding pass.
2. `hapa-agent-registry-node -> hapa-avatar-node [DATA]`: Profile facts request avatar and Phamiliar identity assets.
3. `hapa-avatar-node -> hapa-agent-registry-node [DATA]`: Avatar variants return with metadata and profile links.
4. `hapa-agent-registry-node -> hapa-crypto-node [API]`: Identity facts are bound to cryptographic proof.
5. `hapa-crypto-node -> hapa-keys-node [API]`: Trusted identity is allowed to request guarded credentials.
6. `hapa-agent-registry-node -> hapa-chat-app [API]`: The onboarded agent becomes available inside shared rooms.

Card hooks: Crew Manifest creates an agent card; Identity Proof unlocks permissions; Compromised Identity can issue false orders.

Record rule: Agent Registry owns profiles; Crypto owns proofs; Keys owns credential readiness.

### Secure Provider Generation

Objective: Route provider-backed generation through keys, crypto, media output, Atlas asset records, Library review, and telemetry.

Teaches: Paid or guarded generation should be authorized, measured, previewed, and recorded with cost context.

Nodes: `AI Model Chat`, `hapa-keys-node`, `hapa-crypto-node`, `hapa-media-node`, `Atlas`, `Library`, `hapa-telemetry-node`.

Script:

1. `AI Model Chat -> hapa-keys-node [API]`: Provider-backed generation asks for credential readiness.
2. `hapa-keys-node -> hapa-crypto-node [API]`: The request is signed and authenticated before provider use.
3. `hapa-crypto-node -> hapa-media-node [API]`: A trusted image request is released to the media provider lane.
4. `hapa-media-node -> Atlas [DATA]`: Generated image output returns with provider metadata and cost context.
5. `Atlas -> Library [DATA]`: The Library receives the trusted asset relationship for review.
6. `Library -> hapa-telemetry-node [API]`: Queue cost, timing, and success metrics report to telemetry.

Card hooks: Authorized Generation prevents wasted calls; Cost Burn tracks spend; Provenance Return attaches model and timing.

Record rule: Atlas stores asset lineage and cost context; Telemetry stores throughput and success/failure metrics.

### Prototype To Task

Objective: Turn a prototype idea into a wiki spec, tasks, readiness checks, credential checks, and lore briefings.

Teaches: Prototypes become real through documentation, task slicing, environment readiness, and historical memory.

Nodes: `Prototype`, `Worldbuilding Wiki`, `hapa-open-tasks-node`, `Master View`, `hapa-telemetry-node`, `hapa-keys-node`, `hapa-lore-node`.

Script:

1. `Prototype -> Worldbuilding Wiki [DATA]`: A prototype concept is recorded as a source-backed spec.
2. `Prototype -> hapa-open-tasks-node [CLI]`: The spec becomes implementation tasks and recovery checkpoints.
3. `hapa-open-tasks-node -> Master View [API]`: Master View receives the work queue for operator planning.
4. `Master View -> hapa-telemetry-node [API]`: Telemetry checks whether required nodes are online.
5. `Master View -> hapa-keys-node [API]`: Credential readiness is checked before paid or guarded work.
6. `hapa-open-tasks-node -> hapa-lore-node [DATA]`: Task decisions become chronicle entries and future briefings.

Card hooks: Questline Draft creates tasks; Readiness Check blocks impossible work; Chronicle Reward preserves decision history.

Record rule: Wiki owns specs; Open Tasks owns active work; Lore owns durable decision memory.

## Collaboration And Protocol Flows

### Overwatch Multi-Agent Kanban Orchestration

Objective: Coordinate multiple Codex avatar threads toward one Hapa MVP using scoped prompts, owned paths, append-only Kanban events, communications, telemetry, and Overwatch verification.

Teaches: Parallel agent work becomes trustworthy when each avatar has a lane, every handoff is recorded, and Overwatch reconciles the board against live source truth before claiming progress.

Nodes: `Human`, `Codex CLI`, `hapa-overwatch-kanban`, `hapa-fleet-compiler`, `hapa-space`, `$HAPA_DESKTOP_ROOT/hapa`, `Hapa Worldbuilding Wiki`, `Hapa Second Brain`.

Script:

1. `Human -> Overwatch [UI]`: The project owner names the shared MVP objective and asks for avatar-scoped Codex work.
2. `Overwatch -> hapa-overwatch-kanban [DATA]`: Overwatch creates task cards, project messages, blockers, and checkpoints as append-only events.
3. `Overwatch -> Codex CLI [CLI]`: Overwatch issues distinct Blue, Red, and Green prompts with owned paths and verification gates.
4. `Blue -> Fleet Manifest [DATA]`: Blue converts live Hapa repo facts into deterministic ship definitions and metrics snapshots.
5. `Red -> Unity Scene [DATA|UI]`: Red consumes the manifest and builds the Black Horizon fleet scene.
6. `Green -> Interaction Layer [DATA|UI]`: Green wires semantic commands, card sockets, and safe duty-card hooks.
7. `Agents -> Overwatch Kanban [CLI|API]`: Agents append progress, blockers, handoffs, and verification notes.
8. `Overwatch -> Hapa Protocol Registry [DATA]`: Overwatch promotes the proven coordination pattern into wiki, Second Brain, process cards, and generated sidecars.

Card hooks: Crew Assignment splits work safely; Append-Only Comms preserves truth; Board Reconciliation catches drift; Integration Smoke gates completion; Duty Card Handoff turns a task into a playable action.

Record rule: Kanban event log owns coordination facts; owning repos and Unity own implementation truth; wiki owns canonical protocol language; Second Brain owns retrieval and redeployment memory.

### Black Horizon Repo-To-Ship World Loop

Objective: Convert Hapa repositories into playable world objects while keeping verified repo truth, inferred game mapping, mythopoetic lore, and speculative future mechanics in separate lanes.

Teaches: A Hapa repository can become a ship/card/room/duty object when the mapping remains provenance-backed, review-gated, and unable to mutate real repos, services, scenes, prefabs, credentials, or generated asset promotion state.

Nodes: `Human`, `hapa-overwatch-kanban`, `hapa-fleet-compiler`, `hapa-space`, `Hapa Worldbuilding Wiki`, `Hapa Second Brain`, `hapa-janus-world-node`, `hapa-anvil-node`, `hapa-lance-node`, `hapa-lore-node`.

Script:

1. `Human -> Overwatch [UI]`: The human frames the desired playable operating metaphor and names the MVP goal.
2. `Overwatch -> Kanban Event Log [DATA]`: Overwatch records task cards, agent starts, checkpoints, review gates, and telemetry as append-only events.
3. `hapa-fleet-compiler -> Repo Facts [CLI|DATA]`: The compiler reads local node map, repo paths, generated metrics, and proof reports.
4. `Repo Facts -> Ship Definitions [DATA]`: Deterministic rules produce ship class, stats, rooms, crew slots, duties, and card drafts.
5. `Ship Definitions -> Unity World [DATA|UI]`: Unity renders ships, interiors, cards, sockets, orbit lanes, stations, black holes, artifact markers, and safe controls.
6. `Overwatch -> Orbit Clock [DATA]`: Board progress becomes the epic clock and time-dilation state while human acceptance stays review-gated.
7. `Unity/Phone -> Safe Command Router [UI|API]`: Local, WebSocket, and phone controls route visual commands and safe duties only.
8. `Reviewed Ship/Card Records -> Janus/Anvil/Lance [DATA]`: Future accepted snapshots should flow into Janus world-state, Anvil card forge, and Lance retrieval projections.
9. `Overwatch/Wiki/Second Brain -> Future Agents [DATA]`: The route writes back durable evidence so agents can retrieve it before converting nodes into world objects.

Card hooks: Repo Projection creates a ship candidate; Truth Lane Audit separates fact/inference/lore/future; Review Gate prevents false baseline; Janus Handoff proposes world-state events; Card Forge Export prepares Anvil/Lance review.

Record rule: Overwatch owns coordination events; fleet compiler owns generated manifests/cards/stats; Unity owns runtime visualization; wiki owns canonical truth-status explanation; Second Brain owns retrieval; Janus/Anvil/Lance own future reviewed world/card/index records after bridges exist.

### Chat To Lore Memory

Objective: Preserve room decisions through Lore, promote durable notes to the wiki, index them, and return grounded context to later conversations.

Teaches: Collaboration should remember its decisions. Chat becomes stronger when it loops through identity, lore, canon, retrieval, and back into the room.

Nodes: `hapa-chat-app`, `hapa-agent-registry-node`, `hapa-lore-node`, `Worldbuilding Wiki`, `hapa-lance-node`, `AI Model Chat`.

Script:

1. `hapa-chat-app -> hapa-agent-registry-node [API]`: Chat loads known agents, roles, and panel membership.
2. `hapa-chat-app -> hapa-lore-node [DATA]`: A room decision is recorded into lore memory.
3. `hapa-lore-node -> Worldbuilding Wiki [DATA]`: Durable decisions become wiki-ready canon notes.
4. `Worldbuilding Wiki -> hapa-lance-node [DATA]`: Decision notes are indexed for retrieval.
5. `hapa-lance-node -> AI Model Chat [DATA]`: Future model conversations retrieve the decision context.
6. `AI Model Chat -> hapa-chat-app [API]`: The assistant brings grounded context back into the room.

Card hooks: Decision Capture records a room effect; Canon Promotion upgrades memory; Grounded Recall prevents repeated mistakes.

Record rule: Lore records the decision; wiki stores approved notes; Lance exposes retrieval context.

### Protocol To Cultivation

Objective: Run specs and cultivation mechanics through Consul proofs, promote validated events into Janus, playtest them, and return findings to tasks and Overwatch.

Teaches: Protocol work becomes robust when specs, proof harnesses, world state, game tests, and operating standards all participate.

Nodes: `hapa-spec-scaffold`, `hapa-cultivation-suite`, `Consul Node Proto`, `hapa-janus-world-node`, `Game Engine`, `hapa-open-tasks-node`, `.Overwatch`.

Script:

1. `hapa-spec-scaffold -> Consul Node Proto [CLI]`: Append-only specs are run through Consul protocol proofs.
2. `hapa-cultivation-suite -> Consul Node Proto [CLI]`: Cultivation mechanics test capsule and worker behavior.
3. `Consul Node Proto -> hapa-janus-world-node [DATA]`: Validated protocol events become world-state candidates.
4. `hapa-janus-world-node -> Game Engine [API]`: Game Engine receives derived world rules for playtesting.
5. `Game Engine -> hapa-open-tasks-node [API]`: Playtest failures become implementation tasks.
6. `hapa-open-tasks-node -> .Overwatch [CLI]`: Protocol findings return to Overwatch as operating standards.

Card hooks: Proof Harness validates a rule; Playtest Pressure reveals exploit risk; Standards Return improves future protocol work.

Record rule: Consul records proof output; Janus stores candidate world events; Open Tasks and Overwatch record repairs and standards.
