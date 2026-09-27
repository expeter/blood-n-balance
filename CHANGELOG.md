# Changelog

User-visible changes are grouped under the game version from `package.json`. Ticket IDs use `BUG`, `SPEC`, `FR`, and `CR`; see [the ticket register](docs/tickets.md). Planned work is not listed here as released functionality.

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
