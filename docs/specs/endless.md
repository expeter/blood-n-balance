# Endless pursuit — 5.2.0

FR-013 / SPEC-007. Single-player offline mode, opened with the Endless navigation button. Adult presentation is a pursuing fire front; Cloud & Clover uses a sleepy cloud and gentle rest animation. Neither edition awards campaign currency, achievements or campaign records. No AI/provider calls occur during play. This first release uses curated motifs, not arbitrary AI geometry or online rankings.

## Reproduction and grammar

Identity consists of the displayed seed (1–48 characters), `chunks-2` generator version, `bnb-physics-1` physics rules, Easy/Medium/Hard and assistance policy. The same identity reproduces the same geometry and pursuit rules. Inputs still determine the outcome. Nightmare is not an endless option. Retry/Enter rebuilds the original seed and resets all run state. Each assist-enabled run grants one free use of each helper; no-helper and assisted records remain separate even if an assisted entrant declines to use their charges.

Chunks are 24×18 tiles, 30 pixels/tile, with matching floor connectors at row 16. Ten motifs now include flat recovery, hurdles, gaps, paired spikes, low steps, mixed spike/hurdle sections, six-tile terraced climbs, wide gaps with raised footholds, climbs with a hazardous descent, and optional raised-exit sections. Four columns at both ends remain clear. Climbing is required by the terraced wall; high footholds are needed to cross the wide gap. Optional upper coins add route choices. The first chunk is a recovery stretch, the second teaches low steps, and vertical challenges begin at the third. Every fifth chunk is a breather unless it contains an exit. Advanced climb/descent combinations enter the pool after ten chunks.

Every 21 chunks (504m) an optional exit stands on a raised platform at row 9, reached by three jumps. The first exit is about 494m from spawn: the recorded Medium browser route reaches it in about 58 seconds, but human times vary. Running along the floor passes beneath it. Touching an exit completes and records the chase; continuing past it keeps the run and increasing pressure going. Successful escape is shown in the finish screen; Enter retries the same seed. Chase collectibles remain run statistics, not campaign currency.

The trusted grammar is tested before release: 30 actual no-helper crossings (ten motifs × three difficulties), 1,000 deterministic chunk/seam checks, 50-chunk continuous real-physics runs on each difficulty, and three intentional raised-exit routes. Browser tests follow real inputs through the first 20 sections and finish/retry at the raised exit in both editions. These prove recorded trajectories, not universal human accessibility. External/AI-generated chunks are not accepted at runtime; adding a motif requires new crossing evidence and a generator revision. No online candidate rejection can interrupt play.

## Streaming and pursuit

Four complete chunks remain ahead of the occupied chunk. Append whole chunks without changing previous geometry. Retire old terrain only after both player and pursuit have passed it with a full-chunk rear margin. Solids, hazards, coin records and collision lookup are pruned together; rendering grid lines are bounded to the viewport. A ten-minute maximum-speed stress test checks bounded terrain storage and continuous front movement. Endless disables map/survey rather than scaling an ever-growing world into an unreadable minimap.

The front starts 180 pixels left of the origin. Base speed is 40/55/70 pixels/sec by difficulty, rising two pixels/sec per reached chunk to a 125 cap. If the runner gets more than 800 pixels ahead, proportional catch-up increases its speed smoothly, capped at 420; it never teleports. A pause stops simulation; time freeze stops the front while active. Touching it ends the run even with a shield. Camera look-ahead and the standard movement controls remain in use. Gold is a run-only collectible, not spending money.

## Results and limits

Results show maximum forward distance from spawn (one tile displayed as one meter), run gold, elapsed simulation time, seed, difficulty and helper policy. Best distance saves on death or successful escape, at most 50 identities per browser edition. Worse attempts do not overwrite a best. Storage failure is reported; campaign progress remains untouched. Seed sharing is by copying the seed text; there is no trusted global endless leaderboard or stored complete endless replay yet. Local records can be edited by their browser owner and are not authoritative competition evidence.

Human testing should review visibility, difficulty transitions and pursuit pressure. Further motif expansion and ranked endless events require separate design/replay work; this release does not claim them.

Version 5.0 records remain stored under `chunks-1`; `chunks-2` identities cannot overwrite those earlier bests.
