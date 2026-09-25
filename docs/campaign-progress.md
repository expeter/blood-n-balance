# Campaign implementation status

All 99 stages have distinct authored puzzle layouts and hazard-active, item-free solution replays. All ten sector mechanics are implemented. The original staircase generator has been removed; stage 99 is a 96 × 56 room with six controls and a multi-part escape.

## Completed

- 01–10: large switch circuits, gates, return loops, wall-jump shafts, saws and spikes; layout revision 3.
- 11–20: ten distinct laser rooms with warning phases, cover, staggered cycles, and linked shutdowns; layout revision 2.
- 21–30: ten distinct turret rooms with cover, wind-up, crossing lanes, and mixed laser/projectile puzzles; layout revision 2.
- 31–40: ten distinct moving-platform rooms with shuttles, lifts, transfer bays, and mixed-hazard rides; layout revision 2.
- 41–50: ten distinct reversible-circuit rooms with paired/combined gate states, initial states, and OFF-state exit requirements; layout revision 2.
- 51–60: ten distinct timed-switch rooms with countdowns, chained windows, deadline combinations, and permanent recovery shortcuts; layout revision 2.
- 61–70: ten crumbling-route puzzles with break-through floors, disappearing cover, alternate returns, and timer/ferry/lever combinations; layout revision 2.
- 71–80: ten triggered-trap puzzles with remote spike beds, dart launchers, safe baiting docks, and circuit/ferry/crumble combinations; layout revision 2.
- 81–90: ten tracking-sentry rooms with visible lock-on, line-of-sight cover, temporary shutdowns, route-dependent exposure, and alternate wing orders; layout revision 2.
- 91–99: nine linked-alarm finales with ON/OFF hazard groups, startup warnings, timed alerts, shutdown choices, and a six-switch final escape; layout revision 2.
- Away-direction wall jumping without double jump; braced sliding pose and friction sparks.
- Physical skeleton debris, blood spray, surface stains, repeated saw impacts, and delayed death overlay.
- Scrolling camera, minimap, paused room survey, fullscreen, large-room editor.
- Version 3 laser/turret/platform/relay/timer/crumble/trap/sentry/alarm import/export and painting; older file formats remain supported.
- Turrets now offer fixed straight rounds and slow, wall-baitable homing rockets; laser transitions and projectile launches/impacts have effect cues.
- Easy and Medium crumble decks rebuild after 3.5 world-seconds; Hard and Nightmare keep the original permanent-gap behavior.
- Six additional achievements cover clean clears, shop breadth, item mastery, Nightmare clears, and sector visits.

## Verification

- 194 unit/physics tests pass across `tests/game.test.js`, `tests/devices.test.js`, `tests/platforms.test.js`, `tests/circuits.test.js`, `tests/crumbles.test.js`, `tests/traps.test.js`, `tests/sentries.test.js`, and `tests/alarms.test.js`.
- Every stage 01–99 has a deterministic full input replay through the actual simulation, with hazards enabled and no items. Every required switch must be collected.
- Chromium keyboard replay completed all 99 rooms. Browser checks also covered map pause, gore/death overlay, large version 3 import, laser/turret/platform painting and export, unsafe rail rejection, resizing, custom test, paused navigation, and mobile layout. Relay checks cover initial state, actual keyboard toggling, combined gate/exit export, and the mobile objective display. Timer checks cover duration export, actual keyboard activation, countdown HUD, freeze, survey pause, and expiry. Crumble checks cover width/delay export, natural landing, collapse, freeze, survey pause, retry, whole-deck erase, import, and mobile layout. Trap checks cover linked-target export, invalid-target rollback, keyboard triggering, warning/active phases, freeze, survey, dismemberment, retry, endpoint erase, import, dart placement, and mobile layout. Sentry checks cover placement, shutdown export, invalid range rollback, natural target acquisition, lock rings, freeze, survey, aimed-shot death, retry, switch-link cleanup, import, erase, and mobile layout. Alarm checks cover links on all four hazard types, ON/OFF banks, startup HUD, invalid-warning rollback, keyboard switching, freeze, survey, retry, link cleanup, import/export, and mobile layout. The editor checks reported no browser errors.
- Additional item-free replays for stages 56, 59, and 60 verify recovery after deliberately letting every timer expire, without restarting the room.
- Stages 79, 89, and 97 have additional no-item replays proving either wing can be cleared first.
- Production build passes.
- Automated solutions prove reachability; they are not a substitute for human puzzle/difficulty playtesting.

## Completion audit

- All 99 names and canonical solid-tile layouts are unique; all rooms validate and have complete input fixtures.
- Every sector introduces its intended mechanic. The first ten have distinct progression lessons and difficulty metadata from 1 to 10.
- All 99 layout payloads preserve their terrain, objectives, circuits, hazards, and moving/crumbling platforms through JSON validation.
- Browser verification completed all 99 stages with no page errors, checked all seven achievements, exported all 99 scores, synthesized and muted sound/music, reloaded the saved state, confirmed 99 replayable stage buttons and thumbnails, and checked the finale at mobile width.
- Completed stages retain replay access. Existing saves, gold, inventory, and achievements are preserved; old-layout scores are separated by revision.
- Completing the campaign without items unlocks both **The long run** and **Nothing but ninja**.
- The production build is a static browser game. Public level browsing and the VPS score/level API remain milestone two; local JSON level and score sharing are implemented.

Human playtesting remains useful for tuning difficulty and puzzle clarity. Automated replays establish complete no-item solutions, not that every improvised route is recoverable or that every player will find the same rooms equally difficult.
