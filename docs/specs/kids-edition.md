# Kids edition — nonviolent presentation, shared puzzles

Status: specification for ages **10–12**; implementation and deployment are proposed (SPEC-009 / FR-022). Requested hostname: `kids-bnb.minizap.online`. The original Blood & Balance edition remains separate. This document does not claim the kids site is live or suitable based on a completed child playtest.

## Product direction

Keep the satisfying running, jumping, wall kicks, exploration, gold routes, and circuit puzzles. Replace the brutal training setting with a playful obstacle garden: flowers, unicorns, water games, harmless foam toys, and sleepy magical mishaps. Use confident, concise language for 10–12-year-olds; avoid baby talk. Children should understand why an attempt ended without frightening imagery or realistic violence.

A failed attempt is a short, friendly reset: a splash, soft bump, soap bubble, or character dozing on a cloud and waking at the start. No skeletons, dismemberment, blood particles/stains, screams, gore-shaped confetti, or violent death text. “Schubsen” means a playful visual bump followed by reset, not changed knockback physics or encouragement to hurt others. Failure and warning sounds must be gentle but distinguishable.

## Shared rules, different presentation

Use one source of level geometry, collision boxes, movement physics, seeds, circuits, timings, and replay rules. Edition choice changes presentation through explicit registries, not duplicated levels or scattered hostname checks. Select a build-time edition (`original` / `kids`), default safely per build, and validate all presentation keys. The kids build must not fall back to adult assets or language when an entry is missing; fail its build instead.

| Mechanic | Kids presentation | Required clarity |
| --- | --- | --- |
| Ninja | Agile explorer or unicorn-themed runner | Same silhouette footprint and collision box |
| Gold / first-time bonus | Stars / flower tokens with a special first-discovery ring | Same payout and optional collection |
| Spikes | Prickly-looking-free splash pads or bouncy flower beds | Contact clearly resets; do not imply a usable spring |
| Saws / roaming drones | Rotating sprinklers or floating water balloons | Visible motion and original contact footprint |
| Lasers | Pulsing magic rainbow ribbons | Preserve warning, active, and safe phases; show reset consequence |
| Straight turret | Clearly toy-like foam-ball launcher | No realistic gun shapes; same projectile speed and cover |
| Homing rocket | Slow pursuing soap bubble or water balloon | Same turning radius; pops on walls |
| Tracking sentry | Garden owl launching a soft water blob | Clear tracking and warning cue |
| Pressure trap | Surprise fountain / pillow-pop pad | Matching remote labels and reset countdown |
| Crumbling deck | Cloud that dissolves | Same difficulty-dependent return time |
| Ghost hunter | Playful cloud or butterfly pursuer | Same seeded route and contact reset |
| Shield / rocket / freeze / glider / jump | Bubble shield / sparkle dash / pause charm / leaf parasol / spring shoes | Same effects, duration, costs, and assistance classification |
| Exit / switches / gates | Garden portal / buttons / garden gates | Same letter links and on/off states |

The reskin must not change obstacle footprints or make dangerous surfaces look safely standable. Prefer shape plus motion over color alone. Keep optional hints short and expandable. Adult level names, lessons, achievements, item descriptions, status messages, shop text, editor tools, exported metadata, loading/errors, favicon, social previews, and audio all need kid-specific coverage. Examples such as “Meat machine,” “STRUCTURAL FAILURE,” and blood references cannot leak into this edition.

## Build, storage, and hosting

- Produce two explicit build artifacts from one commit, each with its own manifest including edition, version, and Git hash. Edition-specific update checks must never offer the other edition's artifact.
- Deploy the original to its existing GitHub Pages domain without alteration. Use a separate deployment target for `kids-bnb.minizap.online`; a single Pages site's custom domain is not a second independent edition. Decide the separate Pages repository or isolated VPS static root before provisioning. If using Caddy, add only the new host and validate/gracefully reload without disrupting existing services.
- DNS/TLS and public exposure follow a passing kids-artifact audit and an owner/child playtest. No DNS or VPS changes are made by this specification.
- Use separate browser storage namespaces and edition identifiers in exports. A subdomain already isolates origin storage; explicit namespacing also protects local builds. Do not silently copy adult profile text, imported room names, or achievements into the kids edition.
- Shared geometry imports can retain validation and physics, but arbitrary imported/public names and text are not automatically child-friendly. Initially use curated campaign text; arbitrary public discovery, chat, voice, direct messaging, and unmoderated AI text are out of scope. Owner clarification: kids edition has highscores only; no lobbies or community browsing. Highscores use moderated display names and no messaging or profile links. Future multiplayer requires a separate explicit request and specification.
- Choose a friendly display name before release. The requested technical hostname may stay; the visible title/icon must not advertise blood or brutality.

## Acceptance and review

1. All 99 campaign geometry/rule snapshots and representative replays are identical across editions; presentation never changes ranking inputs. Include an edition marker in future API payloads and decide whether leaderboards are shared separately.
2. Automated catalog checks require kids entries for every hazard, effect, audio cue, item, achievement, level title/lesson, and UI status. Asset/string scans help but do not replace visual review.
3. Exercise each hazard contact, every failure reason (including timeout/fall), all helper effects, Nightmare, death-to-retry transitions, editor/test mode, menus, and achievements. No blood/debris path or adult audio can be invoked in the kids build.
4. Capture a review sheet of every replacement. Playtest with an adult and the intended 10–12 audience for comprehensibility, intensity, reading load, and frustration. Friendly art alone is not evidence of appropriate difficulty.
5. Deploy only the reviewed kids artifact; verify hostname, HTTPS, favicon, page metadata, storage isolation, update behavior, and independence from the original deployment.

Implementation slices: edition configuration and manifest → complete presentation catalogs → effects/audio and hazard replacements → UI/editor/content audit → side-by-side parity tests → reviewed deployment. FR-021's bloodier original icon is independent and must never be included in the kids artifact.
