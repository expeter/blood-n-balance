# Review findings and calibration plan

Milestone 0.4 combines an automated sweep of all 99 rooms with targeted review of reported presentation problems. It is not a claim that a human has played every route or that every difficulty is balanced.

## Confirmed shared issues

- Stage 6's text was embedded under geometry; 0.2.4 removed decorative world lettering. Stage identity remains in the HUD.
- Stage 8's left control was a one-way latch drawn as a reversible lever; 0.2.4 introduced PRESS/SET buttons distinct from ON/OFF levers.
- Many late-room lessons mix goal, route, recovery, and hazard instructions. 0.4.0 shows the first sentence on the ready card and folds the rest under optional route guidance.
- BUG-005: replay tests previously left difficulty undefined, which happened to disable Medium's rebuilding crumble decks. The real Medium replay sweep exposed stages 66 and 69. Their routes were regenerated with rebuilding enabled; the engine and room geometry remain unchanged. The test harness now sets Medium explicitly, and collapse assertions observe whether a collapse occurred rather than requiring a deck still be absent at the exit.

## Design assessment

The opening sequence's evidence shows complete loops with two to ten wall kicks per recorded route. Stage 1 already requires an out-and-back switch trip; stage 5 adds sustained shaft traversal; stages 8–10 combine three circuit objectives. Those features give a stronger reason to retain exploration time than to tighten all clocks based on a solver's fast route.

Later chapters vary more by circuit-state/timing complexity than by raw route duration. A short recorded solution is not evidence that a first-time player finds the puzzle obvious. First calibrate clarity and recovery, then hazard windows, then optional speed targets. Avoid shortening every deadline or regenerating rooms simply to increase the failure rate.

## Next player sample

Use stages 1, 5, 6, 8, 10, 20, 40, 50, 60, 66, 69, 70, 90, and 99 as a representative set. The local review form stores stage/revision/difficulty, starts, best time, a simple difficulty/clarity rating, and a note. Export is explicit; nothing uploads automatically.

For each room, compare first completion attempts, common failure location, instruction confusion, and whether recovery feels useful. Use at least a new player and an experienced player before treating a rating as representative. A practical initial target is a clear lesson on introductions, 2–5 attempts for learned mechanics, and 5–15 for chapter finales, while retaining item-free solutions. These are calibration targets, not measured outcomes or mandatory quotas.

## Remaining uncertainty

The route diagrams and machine-readable reports disclose verified primary routes, the limited alternate-route fixtures, and differences when Medium input sequences are reused in Easy/Hard. A failed reused sequence is not proof of an impossible difficulty. Stages without a second fixture still need alternate-route inspection. CR-001's human difficulty calibration and CR-005's complete subjective visual pass remain open for exported player feedback; the reproducible audit and feedback workflow are delivered now.
