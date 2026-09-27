# Changelog

User-visible changes are grouped under the game version from `package.json`. Ticket IDs use `BUG`, `SPEC`, `FR`, and `CR`; see [the ticket register](docs/tickets.md). Planned work is not listed here as released functionality.

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
