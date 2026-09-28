# Current game specification

Status: implemented browser-game baseline, version `5.2.0`.

## Product

**Blood & Balance** is a fast, brutal ninja platformer about training focus, balance, and reaction inside a lethal proving ground. The player chains jumps, wall runs, puzzle choices, gold grabs, and escapes under pressure. It runs as a static web app and does not require an account or server. Campaign progress, settings, careers, inventory, achievements, editor drafts, and local records live in browser storage.

## Story vision

The fictional Blood & Balance Dojo is a sealed mountain fortress built as a survival trial. A masked runner enters to claim the Red Sash and earn the final pass: the right to challenge the Princess, the dojo's reigning champion and the author of the trials. Old songs promise the victor her hand in marriage, but she is no prize; she chooses whether to accept a proposal, and the final contest is between equals. The immediate motivation is to become the best runner alive; the deeper reason for the deadly trials is revealed through ten fragments of the Balance Sutra, found by solving the temple's chambers. Gold is training merit that buys temporary tools, while the fragments reveal who built the trial, what the dojo is protecting, and why the Princess has reopened it.

The 99-stage campaign is framed as ten chapters. Each chapter teaches a skill and ends with a gatekeeper encounter; a short story reveal reframes the trials before the next skill is tested. A provisional chapter map is: Footwork (1–10), Sight (11–20), Crossfire (21–30), Moving Ground (31–40), Reversal (41–50), Borrowed Time (51–60), Impermanence (61–70), Tripwire (71–80), Pursuit (81–90), and Mastery (91–99). Guardian encounters and story fragments are implemented at all ten chapter endings (0.6.0).

## Play loop

Players navigate rooms using momentum, jumps, wall slides, and wall jumps; gather gold; activate switches and levers; avoid hazards; and reach an exit. Death triggers a physical debris/blood effect and supports immediate retry. Gold gathered during a run is banked only after clearing the room. Shop purchases provide optional single-use helpers.

## Campaign and difficulty

- There are 99 authored campaign levels in ten themed sectors, with every completed level replayable.
- All 99 levels are temporarily selectable in both published editions for owner playtesting (5.0.1); completions remain earned.
- Rooms combine movement, alternate routes, switches, gates, return paths, and sector-specific hazards. Layout revision separates records when a room changes.
- Difficulties are Easy, Medium, Hard, and Nightmare. Nightmare uses a repeatable seeded hunter. Easy/Medium restore crumbling decks; Hard/Nightmare keep them collapsed.
- Item-free campaign completion and other play milestones award achievements.

## Movement, hazards, and helpers

Movement supports keyboard and touch controls, buffered jumps, coyote time, wall contact grace, wall sliding, and away-direction wall jumps. Hazards include spikes, saws, pulsing lasers, straight and slow homing turret projectiles, moving platforms, reversible/timed circuits, crumbling platforms, pressure-triggered spikes/darts, tracking sentries, and linked alarm groups. Hazards telegraph relevant state changes; reduced-motion preferences suppress strong flashes and shake.

The shop sells time freeze, high jump, rocket boost, shield, and glider charges. Helpers are optional for campaign completion. Their activation affects assisted/unassisted record categories.

## Progress, audio, and presentation

- Named local careers isolate progress, currency, inventory, difficulty, achievements, and records.
- Per-level records distinguish difficulty, helper use, and layout revision. Score JSON can be exported; explicit uploads can enter replay-verified online ladders (3.0.0).
- Death causes, shop use, helper use, level starts, and gold collection are recorded locally.
- Sound effects and synthesized music have independent mute controls and start muted.
- Day/night themes, full-screen play, a translucent top-right minimap inside the playfield that yields to the player/exit (M cycles small → paused survey → hidden; small/hidden preference is remembered), pause-on-blur, version/hash display, and mobile controls are available.

## Editor and files

The editor supports large rooms, terrain and hazard tools, circuits, contextual settings, free test runs, validated JSON import/export, and local drafts. Level-file versions 1–3 are supported; imports validate schema and bounds, not human playability. JSON level files and score files can be shared manually. Invited adults can publish and discover immutable levels/sets, generate AI drafts, and enter timed events/lobbies. Online features are optional; see the service contracts below.

## Verification boundary

Automated unit/physics tests and deterministic no-item replays exercise all 99 authored rooms through the game simulation. These establish that recorded routes work under their fixture conditions; they do not establish human difficulty, readability, or fun. Human playtests remain necessary for balance.

## Runtime and deployment

`npm run dev` serves the Vite development app on `0.0.0.0`; `npm run build` creates a static production bundle in `dist/`. Passing `main` builds are configured to publish the game on GitHub Pages at `bnb.minizap.online`; `api.bnb.minizap.online` hosts the isolated live API on the VPS; `kids-bnb.minizap.online` serves the separate Cloud & Clover build. See [deployment status and instructions](../deployment.md). No credentials belong in the repository.

## Focused play layout (0.2.2)

The play screen uses compact navigation, a single stage/time/gold row, circuit objectives, the canvas, and a control bar. The full playfield and retry/pause controls fit the available laptop viewport without scrolling; sizing measures actual chrome and preserves 16:9 and high-DPI rendering. Stage notes, equipment, achievement hints, and stage recommendations are folded below the game. Opening these optional details may scroll the page. The editor and records retain their separate layouts.

M is a press-to-cycle action, not a held key. Small → full survey → hidden → small; only survey pauses the simulation, and leaving it restores the prior ready/playing/paused state. Key repeat does not advance the cycle. Escape closes survey safely; changing levels does not retain a survey pause. Small-map transparency and automatic occlusion avoidance preserve nearby player/exit visibility. Hiding the map does not change the camera or physics.

Enter (including Numpad Enter) activates the visible game card’s primary action: start, resume, retry, next stage, final achievements, or return from a custom run to the workshop. Cards focus that button without scrolling. A press during the death animation queues one retry; repeated keydown events do not trigger repeated actions. Deliberately focused buttons/links retain native Enter behavior; text fields, dialogs, and the editor are isolated from gameplay shortcuts.

## Editor jump probe (0.2.4)

FR-020 adds a non-destructive jump probe. Hover a supporting solid/gate/deck or the cell above it; click or use keyboard arrows/Enter to pin the character. The pin persists while using building tools and trajectories refresh after edits. Difficulty (Easy, Medium, Hard) and standing/full-speed takeoff select the same physics used by Game.update at 120 simulation steps per second. Independent headless room copies keep the live run, draft, saved state, inventory, and audio untouched. Preview metadata is not exported. Unsupported or obstructed origins show a reason instead of a misleading arc.

Two paths hold left or right until the first landing, hazard contact, exit, or three-second limit. Readouts show actual horizontal travel and peak rise in tiles; endpoints distinguish landing, hazard, and other termination. Simulations start with fresh circuit/hazard timing, no helpers, and no ghost. Running assumes already having maximum horizontal speed; it does not prove there is sufficient run-up. This is not an envelope of every possible steering choice, wall-jump chain, or a solver for the full puzzle. Moving decks/hazards may differ when reached later during a real run.

The campaign-copy selector downloads the current draft as backup, then opens an independent editable copy of any stage. JSON export/test use that draft; the source campaign and its revision remain unchanged.

BUG-004 removes decorative world lettering behind terrain and distinguishes latching PRESS/SET buttons from reversible ON/OFF levers. Help (CR-004) presents four short basics and optional expandable mechanic topics. A batch campaign usability audit is tracked as CR-005; existing replays alone do not establish design quality.

## Controls and achievements (0.3.0)

Options includes Controls with alternate keyboard bindings, conflict rejection, Backspace-to-clear, Escape-to-cancel, and reset defaults. Bindings and gamepad dead zone save separately from careers. Enter confirms primary cards, Escape pauses, and Tab keeps focus navigation. All gameplay controls use action mappings; held keyboard and controller inputs do not cancel each other on release. Modal close restores primary-card focus. The help and shop show configured keys.

Standard-mapped Gamepad API controllers support stick/D-pad movement, A jump, Y retry, Start pause, Back map, and LB/RB/X/B/left-stick click for helpers. D-pad navigates menus, A confirms, B backs out; left/right changes focused select choices. Disconnect pauses and clears held input. Unknown mappings are ignored. Browser simulation verifies these behaviors; real Xbox/PlayStation compatibility is not yet physically tested.

52 achievements retain the original stable IDs and add visible progress. Successful runs record wall kicks, circuit activations, complete gold collection, close/fast finishes, shield/glider/combo use, and recovery after a failed attempt. Failed runs do not farm successful-run mastery counters. Saved progress migrates without discarding earned achievements.

## 0.6.0 chapter guardians

Stages 10/20/30/40/50/60/70/80/90/99 now continue into named guardian chambers after their puzzle exits. Three or four hits clear a guardian: stomp its exposed head, activate alternating floor controls during OPEN, or choose either method, depending on the chapter. Warning waves are jumpable. Both segments must finish before gold and achievements are banked; retry or reloading discards temporary progress. Scores sum both segment times, assistance flags and mastery statistics; chapter layout revisions advance to keep old scores separate. Ready/pause cards do not run timers. Existing puzzle geometry remains unchanged. Thirty boss input replays cover Easy/Medium/Hard without helpers. Nightmare adds the existing seeded ghost and still needs a dedicated route review. Ten short story fragments reveal that the artifact represents learned practice rather than a weapon. Kids encounters use festival friends and harmless pulse/water presentation.

## Optional online modes and endless play

- [AI service](online-service.md): invited adult prompt/revision drafts, free Nemotron through OpenRouter, configurable model allowlist and $1/day total cap. Keys stay on the server; generated routes remain unverified until tested.
- [Community](community-release.md): immutable attributed levels/sets, sharing, browsing, bookmarks, votes, reports, moderation and account controls.
- [Competitions and scores](competitive-play.md): fixed 120Hz replay evidence, server-verified campaign ladders, ordered timed sets and replay viewing. Kids only has preset-name highscores.
- [Live lobbies](live-lobbies.md): 2–8 invited adults, shared countdown, independent simulation, verified progress, reconnect/forfeit/host transfer.
- [Endless](endless.md): seeded local chunk streaming, pursuing fire/cloud, same-seed retry and separate local bests. No online endless ranking.

The kids edition uses the same campaign geometry and physics with independent nonviolent art, effects, sounds, wording and storage. Human child playtesting, physical controller testing and subjective campaign/boss calibration remain outstanding; automated checks do not replace these.

## Dressing room and editor tools (5.1.0)

Dressing room previews earned outfits plus eight permanent accessories in head/back/pin slots. Purchases spend current-career gold (flowers in Cloud & Clover), never affect physics, and ownership/equipment survive reload. Locked chapter outfits still require real completions.

Editor Select drags a rectangular region. Copy includes intersecting whole objects; Paste places their offsets at the last canvas cursor. Start/exit remain unique and use their own tools. Copied switches receive unused A–H letters and internal references follow; external links remain connected to existing letters. Bounds, collisions and references validate before the draft changes. Ctrl/Cmd+C/V and toolbar buttons work; text fields keep native clipboard behavior.

Undo/redo uses Ctrl/Cmd+Z, Shift+Z or Y and toolbar buttons. A full pointer stroke or focused metadata edit is one step. New edits clear redo; imports/new drafts/campaign copies/AI replacements remain undoable. Browser history is bounded to 60 entries and approximately 900KB serialized text. A larger draft still saves independently; storage errors are reported. History is local, not included in level exports.

The editor's Feature test arena opens a separate shared level with named station shortcuts in its expanded equipment/notes panel. It contains all current obstacle families and circuit variants, a guardian, gold/flowers and an exit; helpers are free. Choose Nightmare and reopen it for the roaming visitor. No campaign rewards are committed by arena runs.
