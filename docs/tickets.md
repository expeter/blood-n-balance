# Ticket register

Use only four ticket types: `BUG` for incorrect behavior, `SPEC` for a decision or durable product/technical contract, `FR` for user-visible capability, and `CR` for a requested change to existing behavior or scope. Feature areas can be tags in the description, not ticket types. IDs are stable and never reused.

Tickets are grouped by versioned milestones. The owner authorized implementation of all milestones on 2026-09-27. “Done” means present in this repository and checked; “Proposed” means not implemented. Completed items in version 0.1.0 are historical records, not a promise that their behavior can never change.

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
| CR-001 | CR | Calibrate campaign difficulty using representative playtests | Evidence/tools delivered; player calibration pending |

The baseline supports offline single-player play. Level JSON schema validation does not prove playability; replay fixtures cover authored campaign routes but do not measure perceived difficulty. Details are in [the current game specification](specs/current-game.md) and [campaign design](campaign-design.md).

## Version 0.2.0 — Blood & Balance identity and story

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| SPEC-008 | SPEC | Blood & Balance game vision and story | Done |
| FR-014 | FR | Rename the game and apply Blood & Balance branding | Done |
| FR-015 | FR | Add a gatekeeper boss encounter every ten stages | Implemented in 0.6.0; player balance review open |
| FR-016 | FR | Deploy passing main builds to GitHub Pages; reserve the VPS API hostname | Done |
| CR-002 | CR | License the public repository under MIT with Peter Schulz attribution | Done |

**CR-002 acceptance:** include the standard MIT license with `Copyright (c) 2026 Peter Schulz (expeter)`; declare MIT in package metadata and link the license and author from the README. Keep the npm package private to prevent accidental registry publication. Verify GitHub detects the repository license as MIT after pushing.

Verified 2026-09-27: GitHub reports SPDX `MIT`; the production build's `LICENSE.txt` matches the source notice, and the automatic main deployment succeeded. FR-016's workflow, VPS, and custom-domain DNS checks pass. The game HTML/assets/version/license load over HTTPS with a valid certificate, HTTP redirects to HTTPS, and Pages reports HTTPS enforcement enabled. The API reservation retains its explicit HTTPS 503 response until the backend is implemented.

**FR-016 acceptance:** `origin` uses `git@github.com:expeter/blood-n-balance.git` with existing history preserved on `main`. Pull requests run tests/build; only passing `main` builds publish to `bnb.minizap.online`, with the source hash in the version manifest. Keep `.env` and credentials out of commits and artifacts. Configure `api.bnb.minizap.online` independently in Caddy, validate before graceful reload, and verify existing services remain healthy. The API implementation remains future work; any reserved endpoint must report that clearly. See [deployment instructions](deployment.md).

**FR-015 acceptance direction:** place a distinct boss encounter at stages 10, 20, 30, 40, 50, 60, 70, 80, 90, and a final encounter at 99. Support more than one interaction style, including stomping a boss's head and activating arena controls that expose a shot/window. Telegraph attacks and vulnerable states; make patterns deterministic and learnable; provide safe retry; do not require purchased items; preserve ordinary platforming controls and accessibility settings. Each boss should test the chapter's learned movement/hazard skills. 0.6.0 adds ten named guardian chambers following the unchanged chapter puzzles, with stomp, alternating-button, and either-method variants, deterministic warning/wave/open cycles, story fragments, and full-stage retry. The first set uses two shared encounter mechanics with increasing health/pace; a more individually authored set and subjective balance review remain future refinements.

## Version 0.2.1 — Playfield visibility

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| BUG-002 | BUG | Minimap covers exits and hazards in the bottom-right playfield | Done |

**Acceptance:** move the minimap to its own collapsible area in the top-right game header, outside the gameplay canvas. Show player, exit, objectives, and camera position; clicking the map opens paused survey. Remember visibility in this browser, start compact on phones, and retain survey access while collapsed. Verify normal, narrow, and fullscreen layouts and existing campaign replays.

Verified: separate canvas rendering and saved preferences have regression coverage. Chromium checked an exit placed under the former overlay, keyboard hide/show without jumping, survey pause/resume, persisted visibility, DPR 2, phone defaults, 320–1440px layouts, fullscreen, and the large final campaign room. The full campaign replay suite remains passing. Survey instructions also stay outside the playfield.

## Milestone 0.3 — Focused play and player controls

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| CR-003 | CR | Fit the playfield to laptop screens and cycle compact/full/hidden maps | Done |
| BUG-003 | BUG | Restore Enter for the visible primary game action | Done |
| FR-017 | FR | Expand achievements across movement, mastery, exploration, and challenge runs | Done |
| FR-018 | FR | Let players rebind gameplay keys | Done |
| FR-019 | FR | Add controller input and controller-friendly menus | Implemented; physical-device QA pending |

**CR-003 acceptance:** prioritize the playfield over dashboard chrome; initial laptop view includes the full canvas and retry/pause controls without scrolling. Fold notes, loadout, and stage recommendations away. M and a labelled button cycle small map → paused full-room survey → no map → small map. Small map is translucent, top-right inside the playfield, and yields when the player or exit is beneath it. Remember small/hidden preference; never reload into a paused survey. Test 1366×768 and 1280×720 laptop viewports, narrower screens, fullscreen, and large rooms.

**CR-003 verified in 0.2.2:** all 231 tests and the production build pass. Chromium checked full canvas/control visibility with zero initial scroll at 1366×768, 1280×720, 1440×900, 1024×600, 390×844, and 320×740; map cycle and paused time; saved hidden preference; player/exit occlusion; fullscreen; stage 99; and navigation to/from the editor.

**BUG-003 acceptance:** Enter and Numpad Enter start a ready stage, resume a paused run, retry after death (including a queued retry during the death animation), and activate the completion card’s primary action. Preserve native activation for deliberately focused controls and typing/modal/editor isolation; holding Enter must not repeat actions.

**BUG-003 verified in 0.2.3:** 232 tests and production build pass; Chromium verified real Enter/Numpad presses for start/resume/retry/queued death retry/next stage, native focused map-button activation, held-key suppression, dialog text isolation, and no focus-induced scrolling.

**FR-017 acceptance direction:** design at least 40 total distinct achievements with visible progress and clear criteria: wall-jump mastery, clean chapters, gold exploration, close-call escapes, hazard-specific challenges, speed targets, difficulty progression, and helper experiments. Include accessible early goals and demanding long-term goals, avoid rewarding idle grinding, retain earned IDs across updates, and separate assisted/unassisted conditions. Add any missing event counters before wiring unlocks; test each threshold and no duplicate awards. Existing saves must retain their achievements.

**FR-018 acceptance direction:** Options → Controls supports movement, jump, retry, pause, map cycle, and all five helpers; allow alternate keys, show conflicts before replacement, provide reset defaults and cancel capture, persist locally, and update all hints. Typing in inputs must never move the player. Clear held input after remapping, blur, or modal changes; preserve simultaneous movement/jump and wall-jump behavior. Keep an accessible route back to settings even after remapping.

**FR-019 acceptance direction:** use the browser Gamepad API with D-pad/left stick movement, configurable dead zone, jump, retry, pause, map cycle, and helpers. Poll before simulation; support connection/reconnection, clear held input and pause on disconnect, and avoid double-triggering actions. Provide button hints and menu focus navigation. Feature-detect gracefully; keyboard/touch remain available. Validate with at least an Xbox-style and PlayStation-style controller on supported browsers before claiming device support. Technical reference: https://www.w3.org/TR/gamepad/ . This feature is not implemented yet.

## Milestone 0.4 — Level authoring and readable guidance

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| FR-020 | FR | Physics-based editor jump probe and campaign copy editing | Done |
| BUG-004 | BUG | World text collides with terrain; latching switches look reversible | Done |
| CR-004 | CR | Replace the overwhelming help wall with short basics and optional topics | Done |
| CR-005 | CR | Audit campaign presentation and puzzle clarity in batches | Automated sweep delivered; subjective review pending |
| BUG-005 | BUG | Replay harness omits Medium crumble respawn rules | Done |

**FR-020 acceptance:** hover a takeoff surface with a jump tool; click/Enter to pin a character and left/right jump traces while placing obstacles. Select difficulty and standing/running takeoff; traces use the real movement/collision engine, stop on landing/hazard, and do not mutate the draft, gameplay, inventory, or saves. Clearly state fresh-level timing, held direction, no helpers, and no proof of full-route solvability. Invalid/unsupported positions explain why no jump is shown. Import a campaign stage as an editable copy with a draft backup. Keyboard and zoom coordinates must work.

**BUG-004 acceptance:** remove redundant decorative text embedded under terrain (reported on stage 6); use distinct visuals for one-way switches and reversible levers (stage 8's left switch is a latch, not a toggle). Keep circuit letters and state readable without changing puzzle geometry or campaign revision.

**CR-004 acceptance:** help initially shows only essential movement/objective/retry/map guidance. Advanced mechanics use short, expandable topics. Remove outdated hold-M wording.

**Verified in 0.2.4:** 235 tests and production build pass. Jump-preview regression coverage checks supported/invalid origins, standing/running/Easy differences, collision with walls/ceilings, hazard termination, reproducibility, and draft isolation. Chromium checks campaign-copy backup, hover/pin, editing with a pinned trace, export isolation, zoom, keyboard placement, compact help, and rendering stages 6/8. The kids contract is documented; its build, art, audio, icon, and hostname remain proposed work.

**CR-005 acceptance direction:** inspect batches of 10 stages for readable labels, clear switch roles, redundant or misleading hints, safe recovery, and route quality. Record intended solution and an alternate route, difficulty-specific concerns, and a screenshot per issue. Automated replays establish reachability only; keep subjective review separate. Fix confirmed shared rendering problems once; do not regenerate all 99 stages or claim they have all been playtested. First reported examples: stage 6 decorative text and stage 8 switch presentation (BUG-004).

## Milestone 0.5 — Separate presentation editions (0.5.0)

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| FR-021 | FR | Bloodier icon for the original edition | Done in 0.5.0 |
| SPEC-009 | SPEC | Nonviolent kids edition sharing the same level designs | Done |
| FR-022 | FR | Build and deploy the kids edition at kids-bnb.minizap.online | Deployed in 0.5.0; DNS/HTTPS verified; child review pending |

**FR-021 acceptance direction:** recognizable compact B&B/ninja silhouette with stylized crimson ink/blood droplets, readable at 16–48px. Provide favicon and app-icon variants; keep the kids build's artwork separate. Implemented in 0.5.0 as an original-only vector favicon; kids uses its own unicorn icon.

**FR-022 acceptance direction:** use the edition contract in [kids edition](specs/kids-edition.md). Shared level IDs/geometry/physics with separate child-friendly art, effects, text, sounds, metadata, storage, and deployment. No blood, skeletons, dismemberment, realistic weapons, frightening death wording, or adult branding in the kids build. Validate the entire hazard and reward catalog and both deployments before enabling the hostname.

## Milestone 1 — AI-assisted level authoring and QA (1.0.0)

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| SPEC-002 | SPEC | AI creation, community modes, competitions, and endless mode contract | Done |
| SPEC-003 | SPEC | Level brief format, route QA, and AI-assisted design workflow | Done |
| FR-007 | FR | Generate and revise an editor level from a user prompt | Implemented in 1.0.0 (free-model first version) |
| FR-008 | FR | Allow owner model selection and creation budgets (initial provider: OpenRouter free Nemotron) | Implemented in 1.0.0 (free-model first version) |

**Acceptance direction:** generation returns existing-schema JSON and a change summary; the user can preview/edit/test/export; generation has bounded retries and visible estimated/actual usage; local validation remains free; AI never self-certifies or controls the player. Route QA checks mandatory objectives and a route back to the exit using conservative movement/state checks, reporting pass/fail/unverified. AI outage does not block ordinary editor use.

## Milestone 2 — Invited level sets and discovery (2.0.0)

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| SPEC-004 | SPEC | Online identity, API trust boundaries, moderation, and privacy | Implemented in 2.0.0; invite-only launch |
| FR-009 | FR | Publish immutable level-set revisions and share them | Implemented in 2.0.0; invite-only launch |
| FR-010 | FR | Browse, search, bookmark, vote, and report public content | Implemented in 2.0.0; invite-only launch |

**Acceptance direction:** published levels pass server-side schema/security checks; revisions remain reproducible; authorship and game/schema version are shown; rate limits and abuse/report controls exist; offline campaign and local export continue to work without the API.

## Milestone 3 — Async timed competitions (3.0.0)

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| FR-011 | FR | Run a time-window competition on a fixed level set | Implemented in 3.0.0 |
| SPEC-005 | SPEC | Competition fairness, replay evidence, and ranking rules | Implemented in 3.0.0 |

**Acceptance direction:** entrants use identical level revisions, difficulty, and helper rules; ranks are split into compatible difficulty/assistance ladders; retries, pauses, and run completion are explicit; server-side results do not trust client time alone. Competition event windows use server time.

## Milestone 4 — Live lobby races (4.0.0)

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| FR-012 | FR | Join a synchronized lobby race on a shared level set | Implemented in 4.0.0 |
| SPEC-006 | SPEC | Lobby lifecycle, reconnects, latency, and race fairness | Implemented in 4.0.0 |

**Acceptance direction:** ready/start state, late join, disconnect/reconnect, lobby host departure, and result authority are specified and tested. Other players cannot grief movement unless the mode explicitly says so. This milestone does not block asynchronous competitions.

## Milestone 5 — Seeded endless run (5.0.0)

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| FR-013 | FR | Stream a reproducible endless sequence of validated level chunks | Implemented in 5.0.0; local curated grammar |
| SPEC-007 | SPEC | Chunk grammar, seam safety, difficulty pacing, and replay identity | Implemented in 5.0.0; human pacing review open |

**Acceptance direction:** chunks are prepared ahead of the player and never alter occupied/upcoming geometry; connectors and routes pass deterministic checks; a fixed seed and generator/rules version reproduce the run; failed chunks are replaced without stopping play; local bests work before ranked online play.

## Playtest follow-up — 5.0.1 / 5.1 / 5.2

Source: owner feedback, 2026-09-28. Implement without marking stages completed or changing earned balances.

| ID | Type | Ticket | Status |
| --- | --- | --- | --- |
| CR-006 | CR | Temporarily unlock all 99 stages in both published editions | Done in 5.0.1 |
| FR-023 | FR | Dressing room with outfit previews and permanent gold/flower accessories | Done in 5.1.0 |
| FR-024 | FR | One feature-test arena covering every obstacle, circuit and helper | Done in 5.1.0 |
| FR-025 | FR | Rectangle selection and validated multi-object copy/paste in editor | Done in 5.1.0 |
| FR-026 | FR | Undo/redo editor history, grouping paint strokes and retaining drafts | Done in 5.1.0 |
| BUG-006 | BUG | Improve editor and kids text contrast and consistent flower currency wording | Done in 5.1.0 |
| BUG-007 | BUG | Repair endless setup form and readable start/result layouts | Done in 5.1.0 |
| CR-007 | CR | Add vertical endless routes, increasing combinations and intentional raised escape exits about every 500m | In progress, 5.2 |

Acceptance: test published unlocks without fabricated progress; persist owned cosmetics without physics advantages; validate pasted references and reject collisions atomically; undo one paint stroke at a time and redo until a new edit; exercise shared arena geometry in both editions; verify readable forms on laptop/mobile; run actual physics routes across new endless motifs and verify raised exits cannot be entered by simply running along the floor.

## Workflow and release rules

- Register work here before implementation and link inbox evidence when applicable. Inbox captures remain separate source evidence.
- Keep tickets small and outcome-based; add acceptance criteria where useful. Do not create separate ticket types for implementation domains such as audio, UI, or gameplay.
- For implementation, mark the ticket In progress, run focused tests, update the relevant specification and changelog entry under the package version, then mark Done only after verification.
- Group changes by milestone in versioned changelog entries. A version entry must distinguish shipped behavior from proposals.
- Keep secrets, API tokens, and deployment credentials out of Git. Do not push, publish, or deploy without explicit instruction.

## Previous ticket identifiers

The first implementation register used area names such as `UX-001`, `GAME-001`, and `API-001`. Those tickets are consolidated into the version 0.1.0 baseline records above; links from old inbox captures remain valid. New work uses only the four ticket types defined here.

Milestone 0.4 evidence: [campaign audit](audits/README.md) and [review findings](audits/review-findings.md). The release includes reproducible metrics, 99 route diagrams, fixed Medium fixtures, optional route guidance, and local review/export; it does not claim human calibration is finished.
