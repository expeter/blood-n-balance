# AI-assisted level design and QA specification

Status: proposed; implementation ticket `SPEC-003`.

## Objective

Let a player request a custom level in plain language, receive a useful draft quickly, and understand what was and was not checked before playing or sharing it. Reduce repetitive hand-authoring without pretending automated checks can judge fun.

## Inputs

The generation request should carry:

- The user prompt, selected difficulty, room-size bounds, and allowed hazard/mechanic set.
- A normalized level-design brief: intended lesson, required objectives and order, route topology, risk/recovery budget, expected player knowledge, and constraints the revision must preserve.
- Current level JSON when revising, plus a compact summary of its route, entities, and validation issues.
- Schema and game-physics version identifiers so later engine changes can re-check stored levels.

Keep context to one level and its relevant constraints. A generator should not need all 99 campaign levels or source-code write access.

## Output and interaction

Return a structured object containing candidate level JSON, a concise design rationale, a concise change summary, and optional risk notes. Validate the JSON before import. Show a preview with controls to edit, free-test, request a bounded revision, export, save locally, or publish if online sharing is available. Never overwrite the user's draft without an explicit action; preserve undo/export behavior.

The user can select a model from supported options. GPT-6 is the initial preferred default when API access allows it. Before generation, display the chosen model and estimated token/currency use; afterwards show actual use. Enforce configurable quotas and per-request caps. Disable generation gracefully if the provider or allowance is unavailable.

## Automated checks

Checks run locally or on a trusted service, independently of the generation model:

1. **Format:** supported schema version, dimensions, entity limits, finite parameters, and valid references.
2. **Geometry:** in-bounds entities, legal overlaps, safe spawn, and exit reachable in the encoded room area.
3. **Movement graph:** conservatively discretize stable landing regions and test jump transitions using a movement envelope derived from the current game physics. Mark transitions near the envelope edge as risky rather than certainly reachable.
4. **Puzzle-state graph:** represent switches, lever/timer states, gates, alarms, and required objectives; verify required objective order and at least one route from spawn through objectives to exit.
5. **Hazard notes:** flag unavoidable spawn damage, untelegraphed immediate threat, zero-slack timed paths, single narrow transitions without recovery, long waits, or no safe reset/observation point. These are warnings for review, not universal bans.
6. **Engine replay, where a route fixture exists:** run candidate button inputs through the actual simulation, hazard-active and item-free, and report the exact tested conditions. Do not infer broad playability from a route that depends on unbounded perfect inputs.

Each level gets a machine-readable report with `pass`, `fail`, or `unverified` for each check and actionable reasons. Schema/geometry failures block import or publication. Unverified playability is clearly disclosed. A model critique is advisory and cannot upgrade a failed or unverified mechanical check.

## Design QA and telemetry

Track interpretable metrics such as objective count/order, route branches, return-path count, number of tight movement transitions, timing slack, safe waiting points, recovery routes, hazard exposure, and optional reward risk. Use them to compare candidates against a brief, not to compress difficulty into one opaque score.

With explicit consent, playtests can report attempts, deaths by cause, duration, helper use, completion/abandonment, and the first point of confusion. Aggregate only what is needed; do not upload local campaign telemetry by default. Human review remains the authority for clarity, fairness, and fun.

## Batch workflow for designers

For campaign tuning, choose a small representative subset instead of rewriting all levels. Generate isolated candidates from stable briefs, run mechanical checks, ask a separate reviewer to critique against the brief, and compare the candidate with actual player feedback. Keep candidate JSON, prompt/brief version, model/version, token usage, validation output, and accepted revision together. Parallelize only independent levels and never allow two workers to edit the same canonical file. Promote reviewed candidates explicitly and update layout revision/replay fixtures.

## Security and limits

Treat prompts, imported level JSON, model output, and public descriptions as untrusted data. Constrain output size and entity counts; use schema-constrained output where available; never execute generated code. Rate-limit provider calls, keep credentials server-side, cap retries, and log usage without storing unnecessary personal data. The current local level validator is structural; these proposed reachability and puzzle-state checks are additional work.
