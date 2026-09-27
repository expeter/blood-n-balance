# Endless pursuit — 5.0.0

FR-013 / SPEC-007. Single-player offline mode, opened with the Endless navigation button. Adult presentation is a pursuing fire front; Cloud & Clover uses a sleepy cloud and gentle rest animation. Neither edition awards campaign currency, achievements or campaign records. No AI/provider calls occur during play. This first release uses curated motifs, not arbitrary AI geometry or online rankings.

## Reproduction and grammar

Identity consists of the displayed seed (1–48 characters), `chunks-1` generator version, `bnb-physics-1` physics rules, Easy/Medium/Hard and assistance policy. The same identity reproduces the same geometry and pursuit rules. Inputs still determine the outcome. Nightmare is not an endless option. Retry/Enter rebuilds the original seed and resets all run state. Each assist-enabled run grants one free use of each helper; no-helper and assisted records remain separate even if an assisted entrant declines to use their charges.

Chunks are 24×18 tiles, 30 pixels/tile, with a common floor at row 16. Six motifs provide flat recovery, a two-tile hurdle, a three-tile gap, paired spikes, stepped platforms and separated spike/hurdle combinations. Both ends reserve four unobstructed floor columns. High optional coins encourage jumping; a low continuation always exists. First two chunks and every fifth chunk are recovery stretches. The available motif pool expands as the run advances.

The trusted grammar is tested before release: 18 actual no-helper crossings (six motifs × three difficulties), 1,000 deterministic chunk/seam checks and 50-chunk continuous real-physics runs on each difficulty. These prove the recorded trajectories, not universal human accessibility. External/AI-generated chunks are not accepted at runtime; adding a motif requires new crossing evidence and a generator revision. Thus no online candidate rejection/retry can interrupt play.

## Streaming and pursuit

Four complete chunks remain ahead of the occupied chunk. Append whole chunks without changing previous geometry. Retire old terrain only after both player and pursuit have passed it with a full-chunk rear margin. Solids, hazards, coin records and collision lookup are pruned together; rendering grid lines are bounded to the viewport. A ten-minute maximum-speed stress test checks bounded terrain storage and continuous front movement. Endless disables map/survey rather than scaling an ever-growing world into an unreadable minimap.

The front starts 180 pixels left of the origin. Base speed is 40/55/70 pixels/sec by difficulty, rising two pixels/sec per reached chunk to a 125 cap. If the runner gets more than 800 pixels ahead, proportional catch-up increases its speed smoothly, capped at 420; it never teleports. A pause stops simulation; time freeze stops the front while active. Touching it ends the run even with a shield. Camera look-ahead and the standard movement controls remain in use. Gold is a run-only collectible, not spending money.

## Results and limits

Results show maximum forward distance from spawn (one tile displayed as one meter), run gold, elapsed simulation time, seed, difficulty and helper policy. Best distance saves on death, at most 50 identities per browser edition. Worse attempts do not overwrite a best. Storage failure is reported; campaign progress remains untouched. Seed sharing is by copying the seed text; there is no trusted global endless leaderboard or stored complete endless replay yet. Local records can be edited by their browser owner and are not authoritative competition evidence.

Human testing should review visibility, difficulty transitions and pursuit pressure. A richer vertical motif library and ranked endless events require separate design/replay work; this release does not claim them.
