# Campaign: 99 rooms, ten sectors

All 99 stages are authored and playable, with a new mechanic introduced at each sector boundary. Every room has a recorded, hazard-active solution without purchased items. The final sector introduces linked alarms and ends in a 96 × 56, six-switch escape.

## Opening puzzle rooms — implemented (layout revision 3)

The original small rooms have been replaced again. The first ten are now 48–64 columns by 24–36 rows (1,440–1,920 by 720–1,080 world pixels). The camera follows at the original tile/character scale. Hold **M**, or toggle the map button, to pause and survey the entire room. The minimap tracks the camera, switches, gates, and exit. Fullscreen expands the play area.

Every room has an exit circuit: touch all of its required lettered switches to unlock the exit. Each switch also opens matching striped gates. Progress within a room resets on retry. The rooms include loops, revisited hubs, roof entries, shorter gated returns, and dangerous optional crossings.

| Stage | Room | Size | Puzzle and route choices |
| --- | --- | --- | --- |
| 01 | False start | 48×24 | Start beside a locked exit. Cross the room for A; return through its newly opened low gate or back over the balconies. |
| 02 | Two sides | 48×28 | A opens a low crossing to B. The top of the central divide offers another connection. Return to the hub with both switches. |
| 03 | The switchyard | 64×24 | Two circuits divide the yard. Weigh dangerous low crossings against elevated bridges and ledges. |
| 04 | Inside out | 48×32 | One switch is outside the vault and one inside. Choose the roof entrance or unlocked side passage, then enter the inner exit cage. |
| 05 | Double helix | 48×36 | Climb one shaft for A, traverse to B in the second, visit C outside, then use C's return gate to escape west. |
| 06 | Down payment | 64×32 | A opens a near trapdoor; the long descent remains possible. B must be collected on the middle floor before escaping from the bottom. Recovery ledges allow a return climb. |
| 07 | The grinder | 64×28 | The low gate and high suspended route offer different exposure to saws. Both switch objectives remain mandatory. |
| 08 | Three keys, one lie | 64×36 | Three switches surround a central exit. A low crawlway, opened shortcuts, and the high rim connect the wings. |
| 09 | Security theater | 64×36 | Break into two vaults through roofs or unlocked entries, then climb the final eastern escape tower. |
| 10 | Meat machine | 64×36 | Start in the central machine. C opens its roof. Visit both outer switches and return to the original central exit. Lower corridors provide risky recovery routes. |

The goals are spatial reasoning, remembering changed connections, deciding when to return, and executing a route under danger. Gold remains optional. Timers allow 120–180 seconds so players can solve the room rather than blindly race along one line. Survey pauses the countdown, effects, and hazards.

### Movement and failure

- A wall is detected by contact/proximity, not by requiring an inward key. Descending contact produces a distinct braced sliding pose and friction sparks.
- Press away from the wall, then Jump within 140 ms, to kick away. The contact opportunity is consumed on takeoff; pressing Jump again in open air does not create a double jump. A short push-off interval prevents an inward key from immediately cancelling the kick.
- Saw blades visibly rotate and travel. Spikes are sharp metal teeth. Both produce an immediate fatal hit unless the shield absorbs it.
- Fatal hits scatter a skull, ribcage, limbs, and scarf with gravity, spin, and surface bounces. Blood droplets collide with terrain and leave surface stains. Saws can hit fallen debris again. The death sequence runs for 1.6 seconds before the retry prompt; **R** retries immediately. Retry clears the debris, stains, and circuit state.
- Impact shake and flash respect the browser's reduced-motion preference. Sound still has its independent mute control.

Every authored stage has a recorded input replay in `tests/fixtures/`. Tests run the real simulation with active hazards, closed gates, every required switch, and no items. These establish at least one complete solution per room; they do not replace human playtesting of puzzle difficulty or guarantee every improvised route is viable.

## Pulse — implemented (stages 11–20, layout revision 2)

Ten distinct rooms teach the dark crossing interval, amber charge warning, solid cover, and lettered shutdowns. Lasers stop at walls and closed gates; opening a gate can expose a new firing lane. Rooms grow to 64×40 tiles. All ten have recorded hazard-active, item-free solutions.

| Stage | Room | Puzzle |
| --- | --- | --- |
| 11 | Dead air | Cross one column, shut it down with A, and collect B on the upper balcony before returning. |
| 12 | Negative space | Use shaft ledges to wait out horizontal pulses, then open the eastern wing. |
| 13 | Split second | Cross three staggered clocks; the first remains active on the return. |
| 14 | Sundial | Orbit a solid core; paired switches open a short return through its base. |
| 15 | Blind corner | Opening A removes laser cover; climb above the lane to reach its shutdown. |
| 16 | Quiet room | Pillars split the floor into firing bays; an upper loop connects the objectives. |
| 17 | Lightwell | Climb three timing bands and visit both upper wings; opened bottom gates provide a separate return. |
| 18 | Check valve | Three chamber circuits progressively release passages and shut down beams. |
| 19 | Afterimage | Choose a wing to clear first, then climb the central exit tower. |
| 20 | Blackout protocol | Shut down three towers and cross one final beam that cannot be disabled. |

## Crossfire — implemented (stages 21–30, layout revision 2)

Turrets have fixed directions, visible muzzle warnings, deterministic firing cadence, and optional shutdown circuits. They can fire either straight bullets or slow heat-seeking rockets; rockets turn gradually and can be baited into solid cover. Walls and closed gates stop shots. Already-fired bullets survive shutdown. The editor supports direction, cadence, projectile type, phase, speed, and switch links. Every room has a recorded item-free solution with live projectiles. Tracking sentries retain their visible lock-on followed by a straight aimed shot.

| Stage | Room | Puzzle |
| --- | --- | --- |
| 21 | Firing line | Cross covered bays, shut down the far gun, and return. |
| 22 | Cross stitch | Alternate shelves in a shaft with crossing fire. |
| 23 | Downrange | Open a trapdoor, descend through firing galleries, and collect the lower control. |
| 24 | The pillbox | Clear both wings and enter the central bunker through its unlocked roof. |
| 25 | Bullet teeth | Choose floor cover or the high bridge across staggered firing lanes. |
| 26 | Rain chamber | Climb one side, cross falling shots at the crown, then descend and return across the lower bridge. |
| 27 | Return fire | Make an elevated outbound crossing and unlock a low return corridor. |
| 28 | Switchback battery | Opening the shaft doors exposes the lower cannon lane. |
| 29 | Ceasefire is a lie | Shut down both wing guns, enter the central vault, then climb around its interior exit shelf. |
| 30 | No man's land | Three batteries combine covered approaches, shutdowns, lasers, and a final exposed climb. |

## Undertow — implemented (stages 31–40, layout revision 2)

Green decks travel on visible rails with short boarding pauses. They carry riders, accept landings from above, and allow jumping through from below. Rails have enforced headroom rather than crushing puzzles. Freeze stops their motion; decks also provide moving cover against beams and projectiles. Each room has a complete recorded solution including its boarding waits and rides.

| Stage | Room | Puzzle |
| --- | --- | --- |
| 31 | The ferry | A single shuttle crosses a pit and returns to the original exit. |
| 32 | Service elevator | Ride to an upper control balcony, then return through the safe side of the room. |
| 33 | Change at the island | Transfer between two ferries in both directions. |
| 34 | Counterweight | Two lifts overlap at a central balcony; visit both outer controls before returning below. |
| 35 | Passenger crossing | Time a ferry crossing through a pulsing beam, shut it down, and visit the upper dock. |
| 36 | Duck and cover | Two gun heights make standing and jumping expose different risks. |
| 37 | Around the crown | Central terraces and three rides form a loop through both upper wings. |
| 38 | Lift under siege | Side shelves offer waiting places between the lift's laser and firing-lane crossings. |
| 39 | Round trip ticket | A lower ferry and eastern lift lead to an upper ferry for the return. |
| 40 | The undertow engine | Three shutdowns, a tall lift, a transfer bay, and a final exposed exit shelf combine the sector's rules. |

## Cause & effect — implemented (stages 41–50, layout revision 2)

Reversible levers trigger once on entering their circle and rearm after leaving. Gates can require combinations of ON and OFF states, displayed beside the door. Open doors defer closure while occupied. Exit state requirements appear in the objective bar. Every recorded solution in this sector reverses at least one lever and visits every control.

| Stage | Room | Puzzle |
| --- | --- | --- |
| 41 | Change your mind | Open the outward door, collect B, then reverse A to open the original exit door. |
| 42 | Either side | Alternate wing access and restore the hub's exit state. |
| 43 | Truth table | Set two inputs ON together, cross the combined gate, then reset only A. |
| 44 | Up for debate | The upper control chooses which low wing is accessible; revisit it after collecting both objectives. |
| 45 | Airlock | A lever inside the chamber swaps its entrance and exit doors. |
| 46 | Circuit breaker | A disables the ferry laser but closes the exit door; restore it only after returning. |
| 47 | Exclusive access | Each wing needs exactly one of two levers ON; the final exit needs both OFF. |
| 48 | The relay loft | Lower and upper levers jointly open a return shortcut from the eastern wing. |
| 49 | Double negative | Open and escape the inner vault, reset both inputs, then use the third lever to release the lower exit pocket. |
| 50 | State of emergency | Coordinate three levers, a combined vault gate, and a final revisit that restores the required exit state. |

## Borrowed time — implemented (stages 51–60, layout revision 2)

Timed switches use the world clock and visibly count down on the switch, gate, and HUD. Re-entering refreshes a timer; standing on it does not. Expiry restores the circuit's OFF state, including resuming linked hazards. Permanent objective switches open recovery routes so a missed deadline does not require a room restart. Stages 56, 59, and 60 include additional recorded solutions that deliberately expire every timer before recovering.

| Stage | Room | Puzzle |
| --- | --- | --- |
| 51 | Borrowed doorway | An eight-second low door leads to a permanent upper return. |
| 52 | Stacked deadlines | Climb to a middle doorway before its twelve-second window ends. |
| 53 | Relay race | Pass a six-second window from one chamber to the next, then unlock the low return. |
| 54 | Last call | Board a ferry in time for the far door; use a lower boarding perch to return after expiry. |
| 55 | Temporary truce | A timer briefly opens a door and disables a beam; the beam resumes its normal cycle for the return. |
| 56 | Two clocks | Reach the exit while two separately started timers remain ON; permanent shortcuts allow another attempt. |
| 57 | The express lift | Wait for the lift before starting the upper-door countdown. |
| 58 | The delayed exit | Turn a lever ON, then deliberately let the entry timer expire to open the final OFF-state gate. |
| 59 | Pressure circuit | Let the first timer expire while keeping the two later clocks live. |
| 60 | Borrowed time | Coordinate a ferry deadline, lift-dock timer, and upper timer; the last objective opens a shorter recovery loop. |


## Unstable — implemented (stages 61–70, layout revision 2)

Tan decks crack on first landing and collapse after a visible countdown. Leaving does not cancel collapse. On Easy and Medium, broken decks rebuild after 3.5 world-seconds; on Hard and Nightmare they stay broken until retry. Freeze and survey pause collapse and rebuild timers. Broken decks also stop providing bullet/laser cover. Solid waiting docks and alternate return paths distinguish these puzzles from a simple jumping chain.

| Stage | Room | Puzzle |
| --- | --- | --- |
| 61 | Hairline fracture | Learn the warning on a short upper circuit with solid recovery ledges. |
| 62 | Burning staircase | Spend a crumbling ascent, then descend the permanent eastern balconies. |
| 63 | Two bridges | Preserve the lower crossing for the return after the upper bridge falls. |
| 64 | Trapdoor thesis | Intentionally collapse three floors to reach the release switch. |
| 65 | Unreliable roof | The outbound route removes cover from the return below falling shots. |
| 66 | Missing connection | Climb to a solid ferry dock, then return by a lower collapsing chain. |
| 67 | Count your steps | Beat a timed doorway before the staircase disappears. |
| 68 | One-way argument | Reverse a central lever between two wings, each with a permanent upper return. |
| 69 | Choose your ruins | Clear either collapsing wing first, then climb the permanent center. |
| 70 | No going back | Link a collapsing tower, lift, timed bridge, and separate low exit route. |



## Tripwire — implemented (stages 71–80, layout revision 2)

Pressure plates warn before remotely raising spikes or firing a dart. Matching T numbers and dotted wires show the link; the plate must be left and re-entered after its cooldown to arm again. Switches can disable traps, and freeze stops their clocks. Standing still cannot repeatedly trigger a plate. All rooms have active-trap, item-free replays; stage 79 additionally verifies the opposite branch order.

| Stage | Room | Puzzle |
| --- | --- | --- |
| 71 | Mind the click | Learn the warning, clear a spike bed, and disable it before returning. |
| 72 | The other side of the wire | Bait an upper bridge from below, wait, then climb through its reset window. |
| 73 | Call and response | Wake remote darts while climbing out of their lanes; descend through A’s door. |
| 74 | Borrowed shelter | Cross three trapped bays, then take an elevated loop back to B. |
| 75 | Do not wait here | Time boarding from a trap-free waiting step, not the trapped ferry dock. |
| 76 | Open circuit, loaded floor | Reverse a central lever to change access and rearm a western trap. |
| 77 | A second to spare | Climb under a door deadline while leaving triggered dart lanes behind. |
| 78 | Floor plan for a panic | Let remote spikes reset before spending crumbling outward and return bridges. |
| 79 | Three invitations | Clear either wing first, then bait the traps guarding the final central climb. |
| 80 | Everything is connected | Combine a trapped climb, timed lift crossing, cracking bridge, and released low return. |


## Pursuit — implemented (stages 81–90, layout revision 2)

Stationary tracking eyes acquire a visible player, show a filling lock ring and reticle, then fire a straight aimed shot. Breaking sight resets the lock. Terrain, gates, moving decks, and intact crumbling decks all provide cover. Shutdown clears tracking; existing shots remain dangerous. These rooms use shelter, elevation changes, and different approach/return conditions. Stage 89 has verified solutions for both branch orders.

| Stage | Room | Puzzle |
| --- | --- | --- |
| 81 | Blink first | Cross between pillars, break a lock, and disable the eye before returning. |
| 82 | Down the blind side | Descend a sheltered western route, then climb watched eastern balconies. |
| 83 | The roof has eyes | Choose roofs or exposed upper shortcuts between watched courtyards. |
| 84 | Moving blind spot | Ride a deck through an eye’s field of view, then release a low return. |
| 85 | Close the curtains | A lever changes both access and cover; restore its OFF state before escaping. |
| 86 | Seven seconds unseen | Use a temporary shutdown, with solid steps and a low recovery route after expiry. |
| 87 | The shield you spent | The collapsing outward bridge removes cover from the lower return. |
| 88 | Caught looking | Follow a loop through eyes and plate traps, planning the landing before dodging. |
| 89 | Mutual surveillance | Each wing disables the other wing’s eye; choose which watcher to face first. |
| 90 | No place to stare | Link a watched climb, lift, timed shutdown, cracking bridge, and lower objective. |


## The last nine — implemented (stages 91–99, layout revision 2)

An alarm links familiar hazards to a circuit’s ON or OFF state. Waking a group gives a visible 1–4 second startup warning, followed by its configured firing, tracking, or plate behavior. Turning it off cancels pending attacks; existing projectiles remain. Every reactivation warns again. Matching alarm labels, survey wires, and grouped HUD status make changes visible. The finales combine routes, recovery choices, and shutdown order rather than introducing surprise attacks.

| Stage | Room | Puzzle |
| --- | --- | --- |
| 91 | Pull the alarm | Open a door and wake a laser/gun group; shut it down and restore the lever before leaving. |
| 92 | Which side wakes | Opposite alarm banks make the same lever protect one wing while exposing the other. |
| 93 | Wait out the siren | Use a timed crossing, then deliberately let its alarm expire behind cover. |
| 94 | Boarding under protest | Switch between ferry guns and a lower laser, then restore the entry state. |
| 95 | After the bridge burns | A quiet outward bridge disappears as the lower return’s alarm wakes. |
| 96 | Alarm at the bottom | Collapse through a shaft into an armed room, bait a remote trap, then shut the room down. |
| 97 | The two shutdowns | Clear either wing first, reset the shared alarm, then climb under a final timer. |
| 98 | Exit interview | Plan a long descent before A wakes its hazards; each objective quiets part of the escape. |
| 99 | The last escape | Six controls link a western ascent, lift, timed door, cracking bridge, alarmed eastern chamber, return climb, and central exit. |

## One new system every ten stages

| Stages | Sector | New system | Introduction → mastery |
| --- | --- | --- | --- |
| 11–20 | Pulse (implemented) | Cycled lasers | One beam and a safe waiting bay → staggered beams → beam crossings during wall jumps |
| 21–30 | Crossfire (implemented) | Turrets and projectiles | Visible wind-up and fixed cadence → solid cover → overlapping firing lanes plus lasers |
| 31–40 | Undertow (implemented) | Moving platforms | Safe shuttle → vertical lift → midair transfers → timing rides through known hazards |
| 41–50 | Cause & effect (implemented) | Multi-state circuits | Reversible relays → gates requiring combined states → changing the route without locking yourself out |
| 51–60 | Borrowed time (implemented) | Timed switches | Generous visible countdown → repeatable race → chained gates and shortcuts |
| 61–70 | Unstable (implemented) | Crumbling platforms | One cracking tile with a safe landing → irreversible platform chains → crumbling routes over familiar hazards |
| 71–80 | Tripwire (implemented) | Triggered traps | Telegraphing pressure plate → bait-and-retreat → delayed darts/spikes combined with platforms |
| 81–90 | Pursuit (implemented) | Tracking sentries | Long visible lock-on → break sight behind cover → sentry corridors with moving cover |
| 91–99 | The last nine (implemented) | Linked alarm states | A switch visibly changes established hazard patterns → route selection under alert → final multi-system escape |

Within a normal ten-stage sector:

- **1–2: teach.** Give the new system room, a safe observation point, and a readable failure.
- **3–4: vary.** Change orientation, timing, or route length without changing the rule.
- **5–6: combine.** Pair it with one already learned mechanic.
- **7–8: pressure.** Narrow the timing or landing margin; add optional risky gold.
- **9: twist.** Require a different use of the same rule, such as opening a return route.
- **10: trial.** Combine skills in one memorable room, with no surprise new behavior.

The last sector has nine stages: stage 99 is the trial. Keep room silhouettes diverse—towers, central voids, loops, shafts, chambers, split routes, and descents. Avoid ten cosmetic variants of a single route.

## Rules that keep difficulty fair

- Every main route must work without an item. Items improve recovery or open optional shortcuts.
- Telegraph danger visually: laser charge lines, turret wind-ups, cracking surfaces, switch countdowns, and sentry lock-on. Sound reinforces this but is never required.
- Give the player a safe spawn and a chance to observe a new hazard. No offscreen, instant, unannounced damage.
- Reset hazard phases, gates, traps, and timers on retry. Use deterministic timings so repeated attempts teach something.
- Use walls as real cover. Projectiles stop at the first solid impact; use swept collision so fast bullets cannot tunnel through terrain or the player.
- Moving platforms carry the player consistently. First implementations should avoid crushing puzzles; gates should defer closing while the player occupies their space.
- Levers trigger on entering their interaction zone, not every simulation tick. Label paired gates with both shape/ID and color.
- Trap delays must leave a no-item escape window. Collapsing platforms must visibly crack before they stop supporting the player.
- Slow seeking rockets need visible launch cues, a forgiving turn rate, and nearby solid cover that gives players a way to bait a miss. Lasers cue their warning, firing, and shutdown transitions with sound; audio is reinforcement, never the only warning.
- Keep speedrun time separate from world countdowns. Freeze may buy survival time but must not create artificially faster personal bests.

## A practical balance loop

The 99 rooms already have deterministic, item-free solution replays. Treat those as a solvability floor, not a difficulty score. Do not retune every room after one easy or hard report. Use the existing ten-room rhythm as a sampling plan: test one teaching room, one combination room, one pressure room, and the sector capstone before considering a sector-wide change.

For each sample, record player experience, difficulty, attempts, deaths by cause, clear time, item use, and the first point of confusion. Ask the player to think aloud once, then replay silently; this separates a puzzle-reading problem from a movement-execution problem. A useful initial target is for a new mechanic's first room to be understood and cleared in one to three attempts, while a capstone takes several meaningful attempts without requiring a purchased item. Adjust those targets with the intended audience rather than treating them as universal scores.

When a pattern fails, fix the smallest shared cause: add or move a safe observation ledge, change one hazard's cadence, widen a landing, reveal a return route, or combine one more known mechanic. Keep room topology and mechanics tagged so parameter changes can be shared. Only replace a room when its puzzle idea itself is weak. Rerun its existing replay and a few adjacent-stage playtests after each change; this avoids another full 99-stage rewrite.

## Item interactions

| Item | Expected interaction |
| --- | --- |
| Time freeze | Freeze hazard motion, projectiles, firing phases, platform movement, crumble countdowns, timed gates, and the level clock. Player movement and elapsed score time continue. |
| High jump | Extend reachable recovery/bonus routes; never make it necessary for the main route. |
| Rocket boost | Cross exposure windows or recover from a missed platform. Solid walls still block it. |
| Shield | Absorb one damage event, followed by a brief grace period. It must not make a sustained laser permanently harmless. |
| Glider | Provide descent control; do not turn it into hovering or immunity to hazards. |

These interactions are implemented for the campaign mechanics. The five items remain optional. Time freeze stops live saw motion, laser phases, and the level countdown; active beams remain lethal and switch activation remains player-controlled.

## Implementation and verification workflow

1. Build one hazard's simulation, visual warning, collision, freeze/shield behavior, and reset behavior.
2. Extend the editor and a versioned JSON schema with explicit hazard parameters and bounded validation. Keep version-1 imports supported. The version-3 editor supports larger dimensions, lettered switches, gates, exit requirements, configurable lasers, turrets, moving platforms, reversible levers, timed switches, crumbling decks, pressure traps, tracking sentries, linked alarms, combined gate rules, and exit states.
3. Author that sector's ten distinct rooms. Preserve useful safe waiting and retry positions.
4. Add deterministic, hazard-active, item-free input replays for every room. Test the new mechanic independently as well as in combinations.
5. Playtest without items, music, and prior knowledge. Tune first-clear difficulty separately from optional gold routes and record times.
6. Bump revisions for replaced layouts. Preserve campaign unlocks and earned achievements; do not compare scores from different geometry.

The VPS score/level-sharing API remains a separate milestone. When scores are posted later, include the layout revision so leaderboards cannot mix different versions of a stage.

## Current save compatibility

The original browser save key is retained. Existing gold, inventory, unlocked stages, and earned achievements survive this update. First-ten scores from the earlier layouts are marked **PREVIOUS LAYOUT**; completing an updated room starts its new-layout record. Stages 11–99 now use revision 2 and also separate older records. Layout revisions are included in JSON score exports.
