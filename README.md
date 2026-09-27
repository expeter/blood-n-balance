# Blood & Balance

A standalone browser precision platformer. No account, backend, or external assets are required to play. Fonts use Google Fonts with local system fallbacks.

Created by [Peter Schulz (expeter)](https://github.com/expeter). Licensed under the [MIT License](LICENSE). Production builds include the same copyright and permission notice in `LICENSE.txt`.

## Run

```sh
npm install
npm run dev
```

The game is published from passing `main` builds to `bnb.minizap.online`. See [deployment instructions](docs/deployment.md) for the GitHub Pages workflow, initial provisioning status, and the separate VPS API hostname.

`npm run build` creates a static site in `dist/`. Serve it over HTTP from any static host. `npm test` runs progression, economy, level format, and physics tests, including hazard-active, item-free input replays through all 99 authored rooms. The developer tool `node scripts/solve-opening.mjs` can regenerate those fixtures by searching the actual physics along intended routes; optional zero-based stage indices limit its scope. `node scripts/solve-pulse.mjs` generates stages 11–20 and `node scripts/solve-crossfire.mjs` generates stages 21–30. `node scripts/solve-undertow.mjs` generates stages 31–40, including recorded waits and rides. `node scripts/solve-relay.mjs` generates stages 41–50 and records lever reversals. `node scripts/solve-timed.mjs` generates stages 51–60; `node scripts/solve-timed-recovery.mjs` records successful recovery runs after deliberately letting every timer expire in stages 56, 59, and 60. `node scripts/solve-unstable.mjs` generates stages 61–70, including deliberate floor-collapse waits. `node scripts/solve-tripwire.mjs` generates stages 71–80; `node scripts/solve-tripwire-alternate.mjs` verifies the opposite branch order in stage 79. `node scripts/solve-pursuit.mjs` generates stages 81–90; `node scripts/solve-pursuit-alternate.mjs` verifies both branch orders in stage 89. `node scripts/solve-finale.mjs` generates stages 91–99; `node scripts/solve-finale-alternate.mjs` verifies the opposite shutdown order in stage 97.

## Current version 0.2.1

The current feature set and editor behavior are described in the [current game specification](docs/specs/current-game.md). Proposed AI and community modes are documented separately in [community and AI-assisted modes](docs/specs/community-and-ai-modes.md) and the [AI level design and QA specification](docs/specs/ai-level-qa.md). The [ticket register](docs/tickets.md) groups implementation work into provisional milestones; we will agree on milestone sequencing before starting those features. User-visible changes are recorded in the [changelog](CHANGELOG.md).

## Current game features

- Canvas platforming: acceleration, buffered jumps, coyote time, and wall-contact grace. Wall slides have a braced animation and friction sparks. Steering away before jumping kicks off the wall without a double jump.
- 99 authored campaign stages in ten sectors. All are large switch-and-gate puzzles (48–96 × 24–56 tiles) with locked exits, alternate approaches, dangerous shortcuts, and return loops. A following camera keeps the ninja at a readable size; hold M or use the map button to pause and survey. A collapsible minimap sits in the top-right game header, outside the playfield; click it for the paused survey. Its visibility is remembered and starts collapsed on phones. Fullscreen mode also helps exploration. Stages 11–20 introduce pulsing lasers with warnings, solid cover, staggered cycles, and switch-linked shutdowns. Stages 21–30 add telegraphed turrets, projectile cover, and mixed firing lanes. Stages 31–40 add moving shuttles, lifts, transfers, and mixed-hazard rides. Stages 41–50 add reversible levers, combined gate conditions, and exit states. Stages 51–60 add timed switches, chained gates, deadline combinations, and permanent recovery shortcuts. Stages 61–70 add crumbling decks, break-through floors, disappearing cover, and alternate return routes. Stages 71–80 add pressure-triggered spike beds, dart launchers, remote bait-and-wait puzzles, and trap/circuit combinations. Stages 81–90 add tracking sentries, line-of-sight cover, timed shutdowns, and watched return routes. Stages 91–99 add linked alarm groups, opposite alert states, timed alerts, and a six-switch finale. See [the campaign design](docs/campaign-design.md).
- Spikes and rotating saws cause a 1.6-second physical death sequence: separated skull, ribcage, limbs, blood spray, terrain stains, and bouncing debris that saws can hit again. R retries immediately. Reduced-motion preferences suppress shake and flash.
- Existing unlocks, currency, and achievements survive this update. First-ten scores from previous layouts are labelled separately; replays create layout-revision-3 records. Stages 11–99 use revision 2.
- Gold is banked on completion; replays earn gold. Start with 40 gold. Buy single-use time freeze, high jump, rocket boost, shield, and glider charges. Consumed items stay consumed after death/restart. Free custom tests do not affect campaign gold, scores, or achievements.
- Seven achievements, including completing every stage without items, now have their own destination; per-stage best runs and score export live in a separate Best runs destination.
- Independent synthesized sound/music controls, initially muted. No audio downloads.
- Browser-local named careers, inventory, settings, scores, and editor draft. Existing `n-momentum-v1` saves migrate into the default Player career; each new career has independent unlocks, gold, achievements, inventory, last stage, and difficulty. Choose Easy, Medium, or Hard in Options: Medium preserves authored timing, Easy slows world hazards and adds a small jump-height cushion, and Hard speeds world hazards and shots. Each best run records its difficulty. The global Day/Night theme saves separately. Clearing browser data removes progress. Unavailable storage falls back to session-only play.
- Level editor: a left tool shelf and contextual inspector keep the canvas visible while painting platforms, spikes, saws, gold, start/exit, and lettered switches, reversible levers, timed switches, and gates, pulsing lasers, turrets, and moving decks; resize rooms, zoom, free test runs, and validated JSON import/export. Arrow keys and Enter also paint. Place a switch before its linked gate. New switches are added to the exit requirements; removing a switch removes every gate that requires it, removes its exit rule, and clears its device shutdown links. Imported rectangular gates are erased as whole objects. New level downloads a backup of your current draft. A new import replaces the current draft; export it first if you wish to keep it.
- JSON score export for sharing personal bests offline. No scores are sent to a server.
- Keyboard and touch controls; automatic pause on tab/window blur.

Move: arrows or A/D. Jump/wall jump: Space, W, or Up. Retry: R. Pause: P/Escape. Survey: hold M or use the map button. Items: 1–5 or click the loadout.

## Level file format

```json
{
  "version": 1,
  "name": "My first escape",
  "time": 90,
  "spawn": { "x": 2, "y": 15 },
  "exit": { "x": 29, "y": 15 },
  "tiles": [{ "x": 2, "y": 16, "type": "solid" }],
  "coins": [{ "x": 4, "y": 14 }]
}
```

Version 1 uses a 32×18 grid. Each cell is 30 pixels. The `drone` terrain identifier is preserved for file compatibility; it now renders as a rotating saw. Version 2 adds explicit dimensions (32–96 columns, 18–64 rows) and circuits:

```json
{
  "version": 2,
  "name": "A locked exit",
  "width": 64,
  "height": 36,
  "time": 150,
  "spawn": { "x": 2, "y": 33 },
  "exit": { "x": 5, "y": 33 },
  "tiles": [{ "x": 2, "y": 34, "type": "solid" }],
  "coins": [],
  "switches": [{ "id": "A", "x": 40, "y": 10 }],
  "gates": [{ "switchId": "A", "x": 25, "y": 30, "w": 1, "h": 4 }],
  "exitRequires": ["A"]
}
```

This is a schema example, not a finished playable room. Use up to eight unique switch IDs A–H and up to 64 rectangular gates. Gate cells cannot overlap terrain, another gate, gold, switches, the spawn, or the exit. References must resolve to existing switches. Time limit is 10–300 seconds; optional `droneSpeed` is 0.2–3. Imports validate structure and bounds, not reachability: authors must test their levels. Files are capped at 150 KB. Version-1 files remain supported.

Version 3 adds a `devices` array to version 2. Example emitter:

```json
{"type":"laser","x":8,"y":4,"dir":"down","length":20,"period":4.6,"on":1.4,"phase":0,"offSwitch":"A"}
```

`offSwitch` is optional. Directions are up/down/left/right; length is 1–96 tiles and the endpoint must remain inside the room. Period is 2–12 seconds, firing time is at least 0.25 seconds, and each cycle needs at least 0.7 seconds off. Phase is in `[0, period)`. Up to 64 emitters are allowed. Walls and closed gates stop beams. The last 0.45 seconds before firing are an amber warning. Freeze holds the current phase, so an active beam stays lethal; shield absorbs one hit with 1.5 seconds of grace. The editor preserves version 3 through resizing and export, and previews beams against closed gates.

Version 3 also supports turrets:

```json
{"type":"turret","x":4,"y":10,"dir":"right","period":3.2,"phase":0,"speed":240,"offSwitch":"A"}
```

A turret warns for 0.6 seconds before each shot. Period is 1.2–12 seconds, phase is in `[0, period)`, and speed is 120–600 pixels per second. Bullets stop at their first solid or closed-gate impact, expire after five seconds, and use swept collision. Shutdown prevents new shots without recalling existing ones. Freeze stops bullets and firing clocks; touching a frozen bullet remains dangerous. All devices share the 64-device limit.

Version 3 supports a separate `platforms` array:

```json
{"x":8,"y":13,"toX":18,"toY":13,"w":4,"period":6,"phase":0}
```

A deck travels between axis-aligned endpoints, pausing for 10% of its cycle at each end. Width is 2–8 tiles; period is 2–20 seconds; phase is in `[0, period)`; speed cannot exceed 200 pixels/second. Up to 24 decks are allowed. The entire rail and two tiles of headroom must stay clear of solid terrain and gates. Players land on top, ride with the deck, and can jump through it from below. Moving decks block beams and bullets. Freeze and survey pause their motion. The editor paints the starting anchor using direction, travel, width, cycle, and phase controls; erasing a cell of that starting deck removes the whole platform.

Version 3 adds reversible circuits. A switch can specify `"mode":"toggle"` and an optional boolean `initial` state (default OFF). Ordinary switches remain latched. A lever flips once when entered; move outside its circle before entering again.

```json
{
  "switches": [{"id":"A","x":5,"y":15,"mode":"toggle","initial":false}, {"id":"B","x":12,"y":15}],
  "gates": [{"switchId":"A","x":8,"y":13,"w":1,"h":3,"states":{"A":true,"B":false}}],
  "exitRequires": ["B"],
  "exitStates": {"A":false}
}
```

This fragment illustrates the circuit fields, not a complete level file. Every gate condition must match; omitted `states` means its primary switch must be ON. An open gate defers closing while the player occupies its doorway. `exitStates` must match in addition to all `exitRequires` switches; contradictory ON/OFF requirements are rejected. A toggle linked to a laser or turret can resume that device when switched OFF. Retry restores initial states. The editor's circuit controls set initial lever state, one or two gate inputs, and per-letter exit rules; imports preserve up to eight gate conditions.

Version 3 switches can also use `"mode":"timed"` with a `duration` of 2–30 seconds:

```json
{"id":"A","x":5,"y":15,"mode":"timed","duration":8}
```

Touching a timer turns its circuit ON for that many world-clock seconds. Leaving its circle and re-entering refreshes the full duration; remaining on it does not. The circuit turns OFF at expiry, with safe deferred gate closure. Freeze and survey pause countdowns while elapsed score time remains independent. Timed circuits can control gates, temporarily disable devices, or appear in `exitStates` with either ON or OFF requirements. The HUD, switch rings, and linked gate labels show remaining time. The editor supports timer placement and duration controls; new timers do not automatically become exit requirements.

Version 3 supports a separate `crumbles` array:

```json
{"x":8,"y":13,"w":4,"delay":1.2}
```

Up to 128 crumbling decks are allowed, each 1–8 tiles wide with a 0.4–3 second collapse delay. First landing starts a visible crack warning and shrinking bar. Leaving does not cancel the countdown; collapse is permanent until retry. Decks are one-way platforms and block beams and bullets until broken. Freeze and survey pause collapse. Deck footprints cannot overlap other objects or moving rails. The editor supports width/delay controls, full-deck erase, and JSON round trips.

Version 3 supports a separate `traps` array with a pressure plate and a remote hazard:

```json
{"type":"spikes","x":5,"y":15,"tx":9,"ty":15,"w":4,"delay":1.2,"active":1.6,"cooldown":2}
```

A `dart` trap uses `dir` and `speed` instead of spike width. Up to 32 traps are allowed. Warning is 0.6–3 seconds, active time 0.5–4 seconds, cooldown 1–6 seconds, spike width 1–8 tiles, dart speed 120–600 pixels/second. Optional `offSwitch` disables and cancels pending activation, but does not recall launched darts. Matching T numbers and a dotted wire connect each plate to its target. Entering a plate arms it once; leave and return after RESET to rearm. Dart traps fire one shot per activation. Freeze/survey stop trap clocks; active spikes and frozen darts remain dangerous. Shields absorb one hit with the usual grace period. Retry resets traps. The editor paints a plate with target offsets, validates the entire footprint, and erases the full pair from either endpoint.

Version 3 supports a separate `sentries` array:

```json
{"x":12,"y":8,"range":18,"lock":1.2,"cooldown":1.5,"speed":250,"offSwitch":"A"}
```

Up to 16 stationary tracking eyes are allowed. Range is 6–32 tiles; continuous lock time is 0.7–3 seconds; cooldown is 0.8–5 seconds; bullet speed is 120–600 pixels/second. An eye tracks the visible player with a sight line, reticle, and filling ring, then fires a straight shot at their current position. Shots do not home. Solid terrain, closed gates, moving decks, and intact crumbling decks block sight and erase a partial lock. Freeze pauses aim, lock, cooldown, and bullets; survey pauses the whole simulation. Optional `offSwitch` clears the lock but does not recall existing bullets. Retry resets the eye and shots. The editor previews range and supports parameter controls, shutdown links, import, export, and erase.

Version 3 lasers, turrets, pressure traps, and sentries can share an `alarm` link:

```json
{"switchId":"A","on":true,"delay":1.5}
```

Add this object as the hazard’s `alarm` field. The switch must exist; `on` chooses the ON or OFF bank, and `delay` is a 1–4 second startup warning. Nonmatching groups are dormant. Each activation starts a fresh countdown; laser/turret cycles restart relative to that activation. Configured phase offsets still apply, so an active laser phase can follow immediately after startup. Sentries still need their lock and traps still need their plate warning. A shutdown switch overrides an alarm and resets its startup; existing projectiles are not recalled. Freeze pauses startup and hazard clocks. HUD group labels report QUIET, countdown, or LIVE; matching labels and survey wires identify linked hazards. The editor’s shared alarm controls apply to all four hazard tools. Removing a circuit clears its alarm links.

## Milestone two: VPS API (not implemented)

Recommended boundaries are `POST /api/scores`, `GET /api/leaderboards`, `POST /api/levels`, and `GET /api/levels` with pagination. Add identity/authentication, rate limiting, server-side schema validation, moderation, and versioned levels before publishing. Client-side times and local save data are editable and must be treated as untrusted; competitive leaderboards need server verification or replay validation. The local JSON format can serve as the initial level payload. No backend credentials or mock online submissions are included in milestone one.
