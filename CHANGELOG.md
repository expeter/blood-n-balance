# Changelog

User-visible changes are grouped under the game version from `package.json`. Ticket IDs use `BUG`, `SPEC`, `FR`, and `CR`; see [the ticket register](docs/tickets.md). Planned work is not listed here as released functionality.

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
