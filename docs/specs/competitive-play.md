# Verified scores and timed events — 3.0.0

## Deterministic evidence

The browser simulates at 120 fixed steps/second, separately from display refresh. Versioned input tapes record direction, jump edges, helper activations, and input clearing (including pause). They are bounded to 40,000 steps per room and compressed into runs. Cosmetic randomness is not part of collision or scoring. The rules identifier is `bnb-physics-1`; a physics change must advance it.

Server worker threads replay the submitted tape on the same engine with the trusted level, difficulty and seed. A tape must reach the exit exactly at its final step. Invalid schemas, unsupported rules, early endings, post-finish inputs and illegal helper use are rejected. Two simultaneous verification workers, four-second deadlines and worker memory limits bound CPU/memory work. Competitive rooms allow at most 150 hazards. The server computes time from verified steps rather than a supplied time field. These checks establish a valid game trajectory; they do not establish human input or rule out a tool-assisted replay.

## Campaign leaderboards

Sharing is an explicit post-win action. Upload only the successful replay(s), stage/revision, edition and difficulty. A chapter ending needs both puzzle and guardian tapes; leftover helper effects are carried over during verification. Rankings separate edition, current layout revision, rules version, difficulty and item-free/assisted category. Assisted campaign verification checks simulation/helper durations; local shop ownership is not an authoritative online economy. Best verified time per player/category replaces a slower one.

Adult publication uses the invited account name with clear disclosure. Kids publication creates an opaque anonymous score credential and a preset nickname such as CloverFox123; it accepts no free-form name or profile/chat data. Kids-origin requests cannot read adult boards/replays or access community routes. Each board exposes at most 100 scores. A verified replay can be watched in an isolated canvas without changing the campaign save. Score credentials, keys, passwords and sessions are never returned in public board/replay data.

## Asynchronous events

A creator freezes a published 1–12-level set with its JSON, hashes, attribution, difficulty, deterministic seed, rules ID, helper policy, entry window and per-attempt duration. Later author edits/hides do not replace frozen geometry. Entry windows are at most 30 days; attempts last 1–60 minutes and cannot extend past event closure.

The server assigns start/deadline timestamps. Its elapsed wall clock continues through pauses, retries, disconnects and page closure. Reopening the event resumes the account's active attempt at its next unverified level. Successful levels must submit in order; duplicate accepted submissions are idempotent. A verified cumulative simulation duration cannot exceed elapsed server time (100ms transport/scheduling tolerance). The final score is server receipt time minus start time, including network delay; worker verification time is excluded. Only complete verified sets appear in standings, using each player's best attempt, with equal times ordered by submission time. No collision/interaction with other players exists.

Item-free events reject all helpers. Assisted events permit one charge of each helper per level; retry resets this fixed loadout and the clock continues. Campaign difficulty settings cannot change an active event's rules. A network/provider failure cannot fabricate a finish: the player can retry a submission while time continues. Expired attempts cannot advance. Replays are stored and available to their owner through the attempt API.

## Checks and limits

Unit/API checks cover reconstruction, forged claimed times, invalid replays, assistance, revision/order/ownership checks, quotas and deadlines, duplicate submission, and kids nickname isolation. A browser test used actual keyboard inputs to complete a short event, capture its tape, verify it on the server and finish on the server clock. All 99 puzzle and 30 boss routes still pass. Browser testing also covers score sharing and replay viewing. This is a first competition implementation; adversarial automation detection, off-host backups and sampled human fairness review remain open operational/design work.
