# Changelog

User-visible changes are grouped under the game version from `package.json`. Ticket IDs use `BUG`, `SPEC`, `FR`, and `CR`; see [the ticket register](docs/tickets.md). Planned work is not listed here as released functionality.

## [1.0.0] - 2026-09-27 — Milestone 1: AI workshop

- **FR-007 / FR-008** — Generate editor drafts through a configurable free NVIDIA Nemotron model on OpenRouter. Preview and explicitly apply validated drafts with a previous-draft backup. Show route uncertainty, usage and cost; preserve offline editing on service failure.
- Enforce invite-only access, one-use invitations, secure sessions, per-user/global request quotas and the configured $1/day ceiling. Keep keys server-side, prohibit paid fallback and automatic retries, and record generation usage durably in SQLite.
- Add isolated API/Node service deployment and automatic tested API/kids publication with a restricted SSH key, pinned host key, commit identity checks and rollback on failed health checks. System Node and unrelated VPS services stay unchanged. Kids DNS and HTTPS are now verified.

## [0.6.0] - 2026-09-27 — Milestone 0.6: chapter guardians

- **FR-015** — Follow each chapter-ending puzzle with a named guardian chamber. Read its warning waves and vulnerable head, or use alternating arena buttons. Clear both parts to bank gold, earn achievements, and reveal a story fragment. Retry restarts the full stage; times and assistance combine across both parts.
- Advance chapter-ending layout revisions and clear incomparable ladder entries while retaining previous completion history. Verify 30 boss routes across Easy/Medium/Hard without helpers. Physical/player balance and Nightmare boss route review remain open.
- **FR-022 deployment** — Stage the isolated kids artifact on the VPS and validate/gracefully reload its Caddy host without changing other services. Public kids DNS/HTTPS remains pending.

## [0.5.0] - 2026-09-27 — Milestone 0.5: two editions

- **FR-021** — Give the original game a crimson ink/ninja favicon.
- **FR-022** — Add the separate Cloud & Clover kids build, with garden art, gentle failure effects and sounds, safe UI wording, unicorn icon, and isolated browser storage. Keep all 99 room geometries and rules identical. Build and check both artifacts in CI; update checks reject the other edition.
- Kids hostname DNS/HTTPS and owner/child playtesting remain pending; this release does not claim those checks are complete.

## [0.4.0] - 2026-09-27 — Milestone 0.4: campaign audit and review tools

- **BUG-005** — Set Medium explicitly in replay tests and regenerate stage 66/69 routes with rebuilding crumble decks enabled. Verify actual collapse events; preserve campaign geometry and revisions.
- **CR-005** — Add a reproducible 99-room audit, route diagrams, circuit activation order, timing/wall-kick metrics, and explicit alternate-route/difficulty uncertainty. Shorten ready cards with optional expanded route hints.
- **CR-001** — Add local stage/difficulty review notes and explicit JSON export for calibration. Automated evidence is complete; subjective difficulty calibration and the remaining visual/player review stay open.

## [0.3.0] - 2026-09-27 — Milestone 0.3: controls and achievements

- **FR-017** — Expand from 13 to 52 achievements, with visible progress, chapter/clean-chapter goals, difficulty clears, exploration, wall-jump mastery, close finishes, and successful helper combinations. Preserve earned IDs and migrate new counters safely.
- **FR-018** — Add browser-saved keyboard rebinding with alternate keys, conflict feedback, clear/cancel/reset, refreshed control hints, and fixed Enter/Escape/Tab escape routes. Track keyboard/touch/controller holds independently.
- **FR-019** — Add standard-mapped gamepad movement, actions, D-pad menu navigation, configurable dead zone, disconnect pause, and held-button suppression across menu transitions. Automated and simulated-browser controller checks pass; physical Xbox/PlayStation testing remains open and is stated in the UI.

## [0.2.4] - 2026-09-27

- **FR-020** — Add a physics-based editor Jump probe with hover/pin placement, standing/running takeoff, difficulty selection, collision/hazard-aware trajectories, and tile-distance readouts. Add campaign-stage copy editing with a downloaded draft backup. Preview data stays out of level exports.
- **BUG-004** — Remove decorative text hidden by terrain (reported on stage 6) and draw latching switches as PRESS/SET buttons rather than reversible levers (reported on stage 8). Level geometry and rules are unchanged.
- **CR-004** — Replace the long help wall with essentials and expandable mechanic topics; correct the old hold-M hint.
- **SPEC-009 / planning only** — Specify a nonviolent kids edition for ages 10–12 sharing the level designs. Register **FR-021** for a bloodier original-edition icon, **FR-022** for the kids build/site, and **CR-005** for campaign usability audits. Those implementations and the kids hostname are not shipped here.

## [0.2.3] - 2026-09-27

- **BUG-003** — Restore Enter/Numpad Enter for the primary Start, Resume, Retry, and completion actions. Focus the game card’s primary button without scrolling, show its Enter hint, and preserve native keyboard activation of focused controls. Keep queued death retries and prevent held-key repeats.

## [0.2.2] - 2026-09-27

- **CR-003** — Prioritize the playfield: compact navigation and stage controls, viewport-fitted canvas, and folded stage notes/equipment/recommendations. Replace the header map dock with a translucent top-right overlay that yields to the player or exit. M and the map button cycle small map, paused full survey, and hidden; remember small/hidden preference.
- **Planning only:** registered **FR-017** (expanded achievements), **FR-018** (custom keybindings), and **FR-019** (controller support) under Milestone 0.3. These features are not included in this release.

## [0.2.1] - 2026-09-27

- **BUG-002** — Move the minimap out of the gameplay canvas into a collapsible dock in the top-right header, keeping exits and hazards visible. Remember visibility in this browser, start collapsed on phones, and open paused survey by clicking the map. Remove the survey's bottom overlay as well. Keep the map sharp on high-DPI displays and fit the controls at narrow widths and in fullscreen.

## [0.2.0] - 2026-09-25

Licensing and publication update 2026-09-27:

- **CR-002** — License the public repository under MIT, copyright 2026 Peter Schulz (expeter), and include the notice in production artifacts.
- **FR-016** — Complete GitHub Actions publication at `https://bnb.minizap.online`; verify the custom-domain certificate, HTTP-to-HTTPS redirect, game assets, version manifest, and MIT attribution. The separate VPS API hostname has HTTPS and an explicit not-deployed response.

Deployment setup added 2026-09-26:

- **FR-016** — Add a Node 24 test/build workflow that publishes successful `main` builds to GitHub Pages with the commit hash. Configure the requested SSH remote and ignore local environment secrets. Reserve `api.bnb.minizap.online` in Caddy with an explicit not-deployed response; public game activation is tracked in [deployment status](docs/deployment.md).

- **FR-014** — Rename the game to **Blood & Balance** across the app title, sidebar identity, version metadata, and score exports.
- **SPEC-008** — Add the core vision and story: a masked runner attempts the Blood & Balance Dojo's lethal trials to earn the Red Sash and challenge its reigning Princess champion. Ten chapters map the existing campaign skills and reveal the Balance Sutra mystery.
- **FR-015** — Add a gatekeeper boss every ten stages (and a final stage 99 encounter) to the backlog. Boss fights are not implemented in this version.

## [0.1.0] - 2026-09-25 — repository baseline

This entry records the current working baseline for version 0.1.0; it is not a deployment announcement.

- **FR-001** — Complete the browser campaign with 99 replayable authored stages, four difficulties, seeded Nightmare hunter, movement hazards, switches, gates, puzzle routes, and deterministic no-item replay fixtures.
- **FR-002** — Add named local careers, saved progression and settings, gold economy, optional helper items, achievements, death/item/play statistics, and per-level personal bests.
- **FR-003** — Add sound/music controls, themes, wall-slide/wall-jump presentation, death effects, responsive keyboard/touch play, map survey, pause-on-blur, and fullscreen.
- **FR-004** — Add a large-room editor with hazard/circuit tools, free testing, JSON import/export, validation, and local draft saving.
- **FR-005** — Keep run gold temporary until completion and reward first-time collected gold distinctly.
- **FR-006** — Add straight and slow homing turret projectiles, projectile/laser cues, difficulty-dependent crumble restoration, and additional achievements.
- **BUG-001** — Guard version metadata when the application entry is run without Vite compile-time substitutions.
- **SPEC-001** — Document current game behavior, file compatibility, verification boundaries, and deployment shape.
- **SPEC-002** — Specify proposed AI-assisted creation/QA, community levels, competitions/lobbies, and endless mode.
- **CR-001** — Define a sampling-based balance process rather than rewriting all 99 levels without playtest evidence.

The local physics/replay suite and production build are the release checks for this baseline. A source revision is shown alongside the app version; deployment still requires the project owner's GitHub/VPS instructions.
