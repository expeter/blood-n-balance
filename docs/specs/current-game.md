# Current game specification

Status: implemented browser-game baseline, version `0.1.0`.

## Product

N / Momentum is a single-player browser precision platformer inspired by compact, high-risk platform games. It runs as a static web app and does not require an account or server. Campaign progress, settings, careers, inventory, achievements, editor drafts, and local records live in browser storage.

## Play loop

Players navigate rooms using momentum, jumps, wall slides, and wall jumps; gather gold; activate switches and levers; avoid hazards; and reach an exit. Death triggers a physical debris/blood effect and supports immediate retry. Gold gathered during a run is banked only after clearing the room. Shop purchases provide optional single-use helpers.

## Campaign and difficulty

- There are 99 authored campaign levels in ten themed sectors, with every completed level replayable.
- All levels are selectable in the local development build for testing.
- Rooms combine movement, alternate routes, switches, gates, return paths, and sector-specific hazards. Layout revision separates records when a room changes.
- Difficulties are Easy, Medium, Hard, and Nightmare. Nightmare uses a repeatable seeded hunter. Easy/Medium restore crumbling decks; Hard/Nightmare keep them collapsed.
- Item-free campaign completion and other play milestones award achievements.

## Movement, hazards, and helpers

Movement supports keyboard and touch controls, buffered jumps, coyote time, wall contact grace, wall sliding, and away-direction wall jumps. Hazards include spikes, saws, pulsing lasers, straight and slow homing turret projectiles, moving platforms, reversible/timed circuits, crumbling platforms, pressure-triggered spikes/darts, tracking sentries, and linked alarm groups. Hazards telegraph relevant state changes; reduced-motion preferences suppress strong flashes and shake.

The shop sells time freeze, high jump, rocket boost, shield, and glider charges. Helpers are optional for campaign completion. Their activation affects assisted/unassisted record categories.

## Progress, audio, and presentation

- Named local careers isolate progress, currency, inventory, difficulty, achievements, and records.
- Per-level records distinguish difficulty, helper use, and layout revision. Score JSON can be exported; there is no network leaderboard yet.
- Death causes, shop use, helper use, level starts, and gold collection are recorded locally.
- Sound effects and synthesized music have independent mute controls and start muted.
- Day/night themes, full-screen play, a minimap/survey, pause-on-blur, version/hash display, and mobile controls are available.

## Editor and files

The editor supports large rooms, terrain and hazard tools, circuits, contextual settings, free test runs, validated JSON import/export, and local drafts. Level-file versions 1–3 are supported; imports validate schema and bounds, not human playability. JSON level files and score files can be shared manually. Public hosting, online browsing, and server scores are not implemented.

## Verification boundary

Automated unit/physics tests and deterministic no-item replays exercise all 99 authored rooms through the game simulation. These establish that recorded routes work under their fixture conditions; they do not establish human difficulty, readability, or fun. Human playtests remain necessary for balance.

## Runtime and deployment

`npm run dev` serves the Vite development app on `0.0.0.0`; `npm run build` creates a static production bundle in `dist/`. Deployment to the user's VPS and a GitHub remote are pending separate instructions. No credentials belong in the repository.
