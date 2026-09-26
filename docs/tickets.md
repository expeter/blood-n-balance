# Ticket register

Use only four ticket types: `BUG` for incorrect behavior, `SPEC` for a decision or durable product/technical contract, `FR` for user-visible capability, and `CR` for a requested change to existing behavior or scope. Feature areas can be tags in the description, not ticket types. IDs are stable and never reused.

Tickets are grouped by proposed milestones so we can agree on sequencing before implementation. “Done” means present in this repository and checked; “Proposed” means not implemented. Completed items in version 0.1.0 are historical records, not a promise that their behavior can never change.

## Milestone 0 — Browser game baseline (version 0.1.0)

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| SPEC-001 | SPEC | Current game and editor specification | Done |
| FR-001 | FR | 99-level campaign, movement, hazards, difficulties, and replays | Done |
| FR-002 | FR | Local careers, progression, shop, achievements, and personal bests | Done |
| FR-003 | FR | Presentation, audio, controls, themes, survey, and responsive play | Done |
| FR-004 | FR | Level editor, custom testing, and versioned JSON import/export | Done |
| FR-005 | FR | Completion-banked gold and first-time pickup bonus | Done |
| FR-006 | FR | Projectile variants, hazard cues, crumble rules, and achievements | Done |
| BUG-001 | BUG | App crashes when Vite version define is absent | Done |
| CR-001 | CR | Calibrate campaign difficulty using representative playtests | Proposed |

The baseline supports offline single-player play. Level JSON schema validation does not prove playability; replay fixtures cover authored campaign routes but do not measure perceived difficulty. Details are in [the current game specification](specs/current-game.md) and [campaign design](campaign-design.md).

## Version 0.2.0 — Blood & Balance identity and story

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| SPEC-008 | SPEC | Blood & Balance game vision and story | Done |
| FR-014 | FR | Rename the game and apply Blood & Balance branding | Done |
| FR-015 | FR | Add a gatekeeper boss encounter every ten stages | Proposed |
| FR-016 | FR | Deploy passing main builds to GitHub Pages; reserve the VPS API hostname | In progress |

**FR-016 acceptance:** `origin` uses `git@github.com:expeter/blood-n-balance.git` with existing history preserved on `main`. Pull requests run tests/build; only passing `main` builds publish to `bnb.minizap.online`, with the source hash in the version manifest. Keep `.env` and credentials out of commits and artifacts. Configure `api.bnb.minizap.online` independently in Caddy, validate before graceful reload, and verify existing services remain healthy. The API implementation remains future work; any reserved endpoint must report that clearly. See [deployment instructions](deployment.md).

**FR-015 acceptance direction:** place a distinct boss encounter at stages 10, 20, 30, 40, 50, 60, 70, 80, 90, and a final encounter at 99. Support more than one interaction style, including stomping a boss's head and activating arena controls that expose a shot/window. Telegraph attacks and vulnerable states; make patterns deterministic and learnable; provide safe retry; do not require purchased items; preserve ordinary platforming controls and accessibility settings. Each boss should test the chapter's learned movement/hazard skills. Bosses, story scenes, and Sutra-fragment reveals are backlog scope, not delivered by the branding update.

## Milestone 1 — AI-assisted level authoring and QA (proposed)

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| SPEC-002 | SPEC | AI creation, community modes, competitions, and endless mode contract | Done |
| SPEC-003 | SPEC | Level brief format, route QA, and AI-assisted design workflow | Done |
| FR-007 | FR | Generate and revise an editor level from a user prompt | Proposed |
| FR-008 | FR | Allow the owner to select model/provider, default to GPT-6, and set token budget | Proposed |

**Acceptance direction:** generation returns existing-schema JSON and a change summary; the user can preview/edit/test/export; generation has bounded retries and visible estimated/actual usage; local validation remains free; AI never self-certifies or controls the player. Route QA checks mandatory objectives and a route back to the exit using conservative movement/state checks, reporting pass/fail/unverified. AI outage does not block ordinary editor use.

## Milestone 2 — Public level sets and discovery (proposed)

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| SPEC-004 | SPEC | Online identity, API trust boundaries, moderation, and privacy | Proposed |
| FR-009 | FR | Publish immutable level-set revisions and share them | Proposed |
| FR-010 | FR | Browse, search, bookmark, vote, and report public content | Proposed |

**Acceptance direction:** published levels pass server-side schema/security checks; revisions remain reproducible; authorship and game/schema version are shown; rate limits and abuse/report controls exist; offline campaign and local export continue to work without the API.

## Milestone 3 — Async timed competitions (proposed)

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| FR-011 | FR | Run a time-window competition on a fixed level set | Proposed |
| SPEC-005 | SPEC | Competition fairness, replay evidence, and ranking rules | Proposed |

**Acceptance direction:** entrants use identical level revisions, difficulty, and helper rules; ranks are split into compatible difficulty/assistance ladders; retries, pauses, and run completion are explicit; server-side results do not trust client time alone. Competition event windows use server time.

## Milestone 4 — Live lobby races (proposed, after async events)

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| FR-012 | FR | Join a synchronized lobby race on a shared level set | Proposed |
| SPEC-006 | SPEC | Lobby lifecycle, reconnects, latency, and race fairness | Proposed |

**Acceptance direction:** ready/start state, late join, disconnect/reconnect, lobby host departure, and result authority are specified and tested. Other players cannot grief movement unless the mode explicitly says so. This milestone does not block asynchronous competitions.

## Milestone 5 — Seeded endless run (proposed)

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| FR-013 | FR | Stream a reproducible endless sequence of validated level chunks | Proposed |
| SPEC-007 | SPEC | Chunk grammar, seam safety, difficulty pacing, and replay identity | Proposed |

**Acceptance direction:** chunks are prepared ahead of the player and never alter occupied/upcoming geometry; connectors and routes pass deterministic checks; a fixed seed and generator/rules version reproduce the run; failed chunks are replaced without stopping play; local bests work before ranked online play.

## Workflow and release rules

- Register work here before implementation and link inbox evidence when applicable. Inbox captures remain separate source evidence.
- Keep tickets small and outcome-based; add acceptance criteria where useful. Do not create separate ticket types for implementation domains such as audio, UI, or gameplay.
- For implementation, mark the ticket In progress, run focused tests, update the relevant specification and changelog entry under the package version, then mark Done only after verification.
- Group changes by milestone in versioned changelog entries. A version entry must distinguish shipped behavior from proposals.
- Keep secrets, API tokens, and deployment credentials out of Git. Do not push, publish, or deploy without explicit instruction.

## Previous ticket identifiers

The first implementation register used area names such as `UX-001`, `GAME-001`, and `API-001`. Those tickets are consolidated into the version 0.1.0 baseline records above; links from old inbox captures remain valid. New work uses only the four ticket types defined here.
