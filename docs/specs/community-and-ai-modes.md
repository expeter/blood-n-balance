# Community and AI-assisted game modes

Status: AI authoring is implemented in 1.0.0 under the [online service contract](online-service.md). Community, competitions, lobbies, and endless remain pending in this document.

## Shared principles

- Campaign play remains available offline and does not depend on accounts, AI, or a backend.
- Community features use versioned level JSON and server-side validation. Treat submitted levels, names, votes, scores, and replay data as untrusted.
- AI proposes content; deterministic game rules and validation decide whether a candidate can be tested or published. A model must not certify its own work.
- The AI authoring model is configurable. Owner selected free NVIDIA Nemotron through OpenRouter for the first release; GPT-6 remains a possible later choice. The enabled model and approximate token cost are visible before generation. A later settings change can select another supported model.
- Generation is a user action, never an unbounded background process. Per-user budgets, daily limits, maximum retries, and usage records prevent surprise spend.

## Prompt-assisted level creation

### Player flow

1. In the editor, choose **Create with AI** and specify a level name, design goal, difficulty, room size, available mechanics, required puzzle elements, and optional theme.
2. The service returns a candidate in the existing level JSON format, a short design explanation, and a change summary.
3. The client validates schema and bounds, loads a preview, and runs available route/reachability checks. The user may test, edit, regenerate a bounded number of times, or discard.
4. The user explicitly saves the result to a level set or exports it as JSON. Publishing requires passing platform safety and schema checks; an uncertain route check is labelled unverified.

### Generation constraints

- Include a concise design brief for lesson, expected route, required points of interest and order, route alternatives, timing pressure, recovery opportunities, and constraints to preserve.
- Return JSON only through a structured response contract, plus separate rationale metadata. The model cannot modify application code or access player controls.
- Keep validation and generation separate. Validate dimensions, object limits, bounds, overlaps, references, spawn/exit placement, and likely reachability.
- A route graph uses conservative movement envelopes based on real game physics and circuit states. It checks mandatory objectives, required order, and a return route to the exit. Results include pass, fail, or unverified with reasons.
- AI QA may critique clarity and difficulty from the brief and metrics, but it cannot replace human playtesting.

### Token allowance

Players receive a configurable creation allowance. Show estimated input/output cost before each operation, charge only for model calls, and make local validation free. Enforce per-operation and per-period limits, cap retries, log model/version/token usage, and allow the owner to change model/provider and budget. The product must work when AI is unavailable. Owner set a configurable $1/day total cap; initial free models additionally have per-user and total daily request allowances. Paid models are disabled.

## Level sets and community publishing

- A level set contains an ordered list of immutable level revisions, a title, description, creator identity, tags, difficulty estimate, rules, and version.
- Authors can create a set from editor levels, preview the complete sequence, revise it, and publish a new version without mutating the old published revision.
- Users can browse/search public levels and sets, view author and version, play, bookmark, upvote/downvote, and report abuse.
- Prevent repeat voting by the same account; apply rate limits and moderation to publication and voting. Public pages show play counts and clear completion/abandonment statistics where available.
- Users retain JSON export. Deletion, moderation, and attribution policies must be specified before public launch.

## Timed competitions and lobbies

### First competition mode: shared timed set

- Publish a fixed set and rules for a time window. Every entrant receives the same level revisions, difficulty, and helper policy.
- Store per-level completion times and the overall elapsed time. Submit results with level revisions, ruleset/game version, difficulty, helper category, and optional replay/proof data.
- Rank only comparable runs; provide distinct assisted and item-free ladders and difficulty divisions.
- Server is authoritative for competition windows and accepted results. Client-submitted time alone is untrusted. Define pause/retry policy and disconnect behavior before launch.

### Later mode: live lobby race

- Players join a room, ready up, and start the same frozen competition set together.
- Show competitor progress and final standings without allowing collision or griefing to affect platforming unless a separate rule explicitly enables it.
- Specify lobby size, late join, reconnect, host departure, matchmaking, latency tolerance, anti-cheat, and privacy before implementation.
- Prefer asynchronous shared-set events first; live synchronization is a separate, higher-complexity milestone.

## Endless generated run

- The game streams finite, authored/generated chunks ahead of the player, creating an apparently continuous run. The generator never changes geometry under or immediately in front of the player.
- Chunks use a bounded grammar of tested room motifs, connectors, difficulty bands, and hazard combinations. AI may select/recombine or propose chunks offline; real-time play uses deterministic local assembly from validated content.
- Each seam must provide compatible floor/ceiling/route geometry, a safe continuation, and a valid player movement envelope. Avoid forced damage and impossible jumps; preserve emergency recovery at configured intervals.
- Use a run seed to make the sequence reproducible for retries, leaderboards, and replays. Record seed, generator/rules version, chunk IDs/revisions, difficulty, and item use.
- Difficulty increases in measured steps and may insert breather chunks. A chunk that fails validation is replaced locally without pausing play.
- Initial release can be a single-player endless mode with local bests. Online ranked play follows only after deterministic reproduction and replay verification work.

## Service boundary and privacy

Online levels, votes, competitions, identity, and token accounting require an API milestone. Do not send local career saves or telemetry by default. Send only fields required for the explicit online action; give users clear controls for name, publication, and deletion. Keep API secrets server-side and rate-limit AI endpoints.

## Release gates

- Offline campaign/editor work when the API is down.
- Schema and security validation on both client and server.
- Candidate route checks expose uncertainty; seeded content reproduces exactly.
- Model and allowance can be changed without altering level format.
- Moderation, privacy, deletion, and abuse controls are ready before public submissions open.
- Human playtests sample generated levels and endless transitions before ranking them.
