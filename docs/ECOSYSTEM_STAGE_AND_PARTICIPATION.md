# Hapa Ecosystem Stage, Artist Kit, and Open Invite

**Status:** living first-pass guidance  
**Owner:** Hapa front door + Calder  
**Audience:** users, contributors, agents, for-profit teams, nonprofit organizations, and prospective integration partners

## Current ecosystem stage

Treat the Hapa ecosystem as **First Pass / Prototype Stage** unless a particular repository or capability explicitly declares a narrower, evidence-backed status.

That default means interfaces, data shapes, workflows, names, dependencies, and integration boundaries may change. Hapa does not make an ecosystem-wide promise of stability, compatibility, uptime, production support, fitness for a particular use, or preservation of every experimental surface.

A specific declaration may override the default only for the surface it names. For example, “Universal Hapa Card Plane v1 released,” “Verified Prototype 0.1,” “Working MVP,” or a passing smoke test has a bounded meaning; it does not automatically make the rest of that app—or the ecosystem around it—production-ready. In the node map, **Core** describes a component's present importance to Hapa operations, not a stability guarantee.

Before relying on a component, read its README and `AGENTS.md`, inspect its manifest and feature-parity notes when present, and verify the current checkout or runtime. Historical docs, screenshots, boards, and generated projections are evidence or discovery surfaces, not automatic proof of current health.

## Hapa as an artist kit: Paint and Paintbrush

Hapa is intended to help a person or team begin from accumulated work instead of a blank canvas. The ecosystem is an artist kit for problem-solving:

| Kit element | Hapa element | How to use it |
|---|---|---|
| Work surface or prepared paint | **Apps and nodes** | Start in the app whose existing capability is closest to the problem. Use its current interface and source boundary as a jump-off point, not a promise that the app is the final solution. |
| Swatch, recipe, stencil, or remembered technique | **Cards and Decks** | Reuse packaged context, constraints, evidence, provenance, and prior decisions. Adapt them while keeping their source and truth status visible. |
| Paintbrush or studio assistant | **Agents** | Give an agent a bounded task, relevant Cards, explicit authority, and a verification target. The agent applies and combines the kit; it does not turn inference into truth. |
| Canvas discipline and shared technique | **Hapa protocols** | Preserve custody, permissions, attribution, append-only history, reversibility, and writeback so collaborators can see how the work was made. |

The Paint/Paintbrush metaphor is practical, not a claim that every tool is interchangeable. The closest existing app, Card, agent pattern, or protocol is a **jump-off point**: pre-existing wisdom and a partially solved path that can shorten discovery. It should be inspected, adapted, and verified for the new task.

## A simple way to use the kit

1. **Name the problem and desired evidence.** Begin with the outcome, constraints, and how success will be checked.
2. **Find the nearest jump-off point.** Use the node map, public registry, Cards, boards, or existing flows to find prior work with similar inputs or responsibilities.
3. **Check the label on the paint.** Read the owning README, `AGENTS.md`, manifest, status, authority, custody, license, and upstream provenance before reuse.
4. **Choose the brush.** Give a human or agent the smallest useful set of tools, Cards, and permissions. Keep paid, destructive, external, or authority-crossing actions explicit.
5. **Make a bounded first pass.** Prefer a dry run, local prototype, adapter, reversible transaction, or small proof before broad integration.
6. **Verify and write back.** Record what worked, what failed, the evidence, attribution, and any reusable lesson in the owning repo, Card/event lineage, wiki, or append-only board.

## An open invite from Calder

I welcome **for-profit and nonprofit teams and organizations** that see a useful overlap with Hapa to propose a conversation, experiment, or integration. You may be interested in giving your service a clearly attributed presence in the ecosystem, connecting an existing capability to a Hapa app or agent flow, contributing a Card/Deck or protocol, supporting public-interest work, or exploring how an independently operated service could participate in Hapa's decentralization and longer-term commerce vision.

Possible forms of presence include:

- a directory or capability entry that points to an independently operated service;
- an adapter, connector, import/export path, or node contract;
- a source-labeled Card, Deck, skill, agent route, or reusable flow;
- an embedded or linked app surface with explicit auth, custody, and authority boundaries;
- a bounded pilot serving a community, nonprofit mission, research effort, creator workflow, or commercial use case.

Hapa's decentralization direction is to let participants keep appropriate custody and operational independence while exchanging explicit contracts, events, references, and receipts. **Attribution inheritance** means that artifacts and downstream work should continue to carry their source organization, creator, service, tool, license, and lineage where the integration supports it. It does not transfer ownership, create endorsement, or replace a separate license or agreement.

The decentralized-commerce idea is a direction for future work: services, agents, creators, and organizations may eventually be able to participate in attributable exchanges of capabilities, artifacts, and value. It is not a promise that a marketplace, payment rail, revenue share, token, legal structure, or commercial outcome currently exists.

## What to include in an integration suggestion

A useful first proposal can be short. Please name:

1. the organization, service, or capability and the people authorized to discuss it;
2. the user or community problem the integration would help solve;
3. the proposed Hapa presence—directory entry, Card/Deck, connector, node, app surface, agent skill, or protocol flow;
4. the smallest local or reversible prototype that could test the idea;
5. data custody, authentication, permissions, privacy, safety, and operator responsibilities;
6. source ownership, licenses, attribution, and what lineage must survive downstream use;
7. expected costs, dependencies, maintenance, and any proposed exchange of value;
8. evidence that would let both sides decide whether to continue.

You may copy [INTEGRATION_PROPOSAL_TEMPLATE.md](INTEGRATION_PROPOSAL_TEMPLATE.md) to structure the suggestion and first decision checkpoint.

Use an existing public contact, issue, or discussion channel associated with Calder or the relevant Hapa repository. Do not put credentials, confidential material, personal data, or binding commercial terms in a public issue.

## Invitation, not commitment

The open invite is permission to suggest and explore. It is not an announcement of partnership, endorsement, acceptance, technical compatibility, production support, decentralization, funding, nonprofit status, legal relationship, or commercial agreement. Those claims require separate evidence and explicit approval from the people or organizations involved.

For any experiment that proceeds, Hapa's preferred starting posture is: smallest useful proof, local-first where practical, least authority, explicit custody, inherited attribution, reversible steps, and a written record of what was actually verified.
