# Implementation tickets

Requested work is tracked here before implementation. When work comes from Project Inbox feedback, captures stay in `inbox/` as source evidence and are linked from the matching ticket.

| ID | Cluster | Source | Status |
| --- | --- | --- | --- |
| UX-001 | Focused game shell, options, and theme | INBOX-20260924-113935-cb4050 | Done |
| PROG-001 | Named career slots and difficulty presets | INBOX-20260924-113935-cb4050 | Done |
| EDITOR-001 | Docked level-editor workspace | INBOX-20260924-114039-f15cb9 | Done |
| PROG-002 | Separate achievements and personal bests | INBOX-20260924-114116-69a61b | Done |
| TEST-001 | Open all campaign stages in local test builds | Direct request | Done |
| DATA-001 | Run telemetry and first-time gold rewards | Direct request | Done |
| PLAY-001 | Nightmare difficulty with deterministic ghost | Direct request | Done |
| UX-002 | Enter retry and centered death screen | Direct request | Done |
| API-001 | Version identity, named records, and leaderboard payloads | Direct request | Done |
| UX-003 | Readable type and improved item shop | Direct request | Done |
| EDITOR-002 | Fit editor without a page scrollbar | Direct request | Done |

## UX-001 — Focused game shell, options, and theme

Reduce the oversized campaign hero and supporting chrome so the playable room becomes the dominant element. Keep secondary tools discoverable through a compact Options dialog, including a global light/dark theme choice alongside sound and music controls. Preserve responsive layout and keyboard access.

Acceptance: the campaign heading uses substantially less vertical space; an Options control exposes theme and audio settings; theme persists after reload and applies consistently to panels, text, borders, and controls.

## PROG-001 — Named career slots and difficulty presets

Let players continue a named career or start a fresh one without overwriting another career. Store unlocks, currency, inventory, achievements, and runs per career. Add Easy, Medium, and Hard presets that adjust world hazard cadence; Easy also gives a small jump-height cushion. Keep Medium as the default so existing campaign layouts and replays retain their authored baseline.

Acceptance: legacy local progress migrates into a default career; new careers start clean; selecting a career restores its progress; difficulty persists per career and changes gameplay only through documented global modifiers.

## EDITOR-001 — Docked level-editor workspace

Keep the level canvas visible beside a compact vertical tool shelf and a contextual inspector. Show shared room/circuit/zoom controls and only the fine-tuning panel relevant to the selected tool; make advanced hazard settings collapsible instead of consuming the canvas' vertical space.

Acceptance: at desktop widths the canvas is the central, largest editor region; tools remain available in a left shelf; selecting a tool opens its controls in the inspector; narrow layouts stack without hiding the canvas; import/export/test still work.

## PROG-002 — Separate achievements and personal bests

Give achievements and per-stage personal best runs distinct destinations. Retain exported score data and direct links from a best run to replaying its stage.

Acceptance: the achievements page contains achievement progress only; a separate Best runs page contains stage records and export; navigating to either page stays independent; empty states point to the relevant action.

## TEST-001 — Open all campaign stages in local test builds

Let local Vite development builds open any of the 99 authored stages from stage select and previews, without changing production campaign progression rules.

Acceptance: every stage is selectable during local development; production builds retain sequential unlocks; completing a directly selected stage records its result normally.

## DATA-001 — Run telemetry and first-time gold rewards

Track deaths by cause, shop purchases, item activations, and stage starts per career. Persist which individual gold pickups have ever been collected in each stage; first-time pickups award one immediate bonus gold so the bonus is not lost if the run ends early.

Acceptance: telemetry survives reloads and exports with the score data; retries/stage starts increment the right level counter; collected pickup identities persist; repeat pickups give normal stage gold without the first-time bonus.

## PLAY-001 — Nightmare difficulty with deterministic ghost

Add an Extra Hard difficulty with a dangerous flying hunter whose randomized waypoint route is seeded by stage, making the flight pattern repeatable across retries and exports.

Acceptance: the difficulty is selectable and saved per career; its ghost is lethal and visible; the same stage uses the same seeded route on replay; other difficulties are unchanged.

## UX-002 — Enter retry and centered death screen

Make Enter retry immediately from the death card, or queue a retry if pressed during the death animation. Center the death card in both axes and add a blood-spattered backdrop without obscuring the action.

Acceptance: Enter and the existing retry button restart from the dead screen; it does nothing during ordinary play or while editing; reduced-motion preferences remain respected.

## API-001 — Version identity, named records, and leaderboard payloads

Display the semantic game version with a source revision identifier. Allow a separate runner name and structure local best runs by stage, difficulty, and assisted/unassisted category so a later VPS API can accept the same data. Support an optional update-manifest URL without requiring the API to exist yet.

Acceptance: version/hash appear in the UI and score export; update manifests can indicate a newer version; each category keeps its own best time; exported payload contains runner identity and category-separated records.

## UX-003 — Readable type and improved item shop

Raise all authored text sizes below 12 px to at least 12 px, then reflow affected layouts. Make shop choices more legible and visually distinct while retaining price, description, inventory, and purchase affordance.

Acceptance: no rendered CSS font-size declaration sets text below 12 px; desktop/mobile shop layouts remain usable and purchase behavior is unchanged.

## EDITOR-002 — Fit editor without a page scrollbar

Reflow the editor's room controls and tool settings into a compact two-column dock beside the canvas; retain internal scrolling only for the canvas if its room is larger than the viewport.

Acceptance: common desktop sizes fit the editor workspace without a page-level vertical scrollbar; the canvas, tools, room settings, and contextual settings remain available; small screens stack cleanly.
