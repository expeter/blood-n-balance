# Current game specification

Status: implemented browser-game baseline, version `0.2.0`.

## Product

**Blood & Balance** is a fast, brutal ninja platformer about training focus, balance, and reaction inside a lethal proving ground. The player chains jumps, wall runs, puzzle choices, gold grabs, and escapes under pressure. It runs as a static web app and does not require an account or server. Campaign progress, settings, careers, inventory, achievements, editor drafts, and local records live in browser storage.

## Story vision

The fictional Blood & Balance Dojo is a sealed mountain fortress built as a survival trial. A masked runner enters to claim the Red Sash and earn the final pass: the right to challenge the Princess, the dojo's reigning champion and the author of the trials. Old songs promise the victor her hand in marriage, but she is no prize; she chooses whether to accept a proposal, and the final contest is between equals. The immediate motivation is to become the best runner alive; the deeper reason for the deadly trials is revealed through ten fragments of the Balance Sutra, found by solving the temple's chambers. Gold is training merit that buys temporary tools, while the fragments reveal who built the trial, what the dojo is protecting, and why the Princess has reopened it.

The 99-stage campaign is framed as ten chapters. Each chapter teaches a skill and ends with a gatekeeper encounter; a short story reveal reframes the trials before the next skill is tested. A provisional chapter map is: Footwork (1–10), Sight (11–20), Crossfire (21–30), Moving Ground (31–40), Reversal (41–50), Borrowed Time (51–60), Impermanence (61–70), Tripwire (71–80), Pursuit (81–90), and Mastery (91–99). These are narrative labels for the existing hazard sectors, not a claim that chapter scenes or bosses are implemented.

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

`npm run dev` serves the Vite development app on `0.0.0.0`; `npm run build` creates a static production bundle in `dist/`. Passing `main` builds are configured to publish the game on GitHub Pages at `bnb.minizap.online`; `api.bnb.minizap.online` is reserved on the VPS for the future API. See [deployment status and instructions](../deployment.md). No credentials belong in the repository.
