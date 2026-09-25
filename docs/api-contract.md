# VPS API preparation

The game stores campaign state locally. It does not submit scores online yet. Score export uses `schemaVersion: 2` so a later VPS endpoint can accept the same structure without reshaping browser saves.

```json
{
  "schemaVersion": 2,
  "game": "Blood & Balance",
  "gameVersion": "0.2.0",
  "gitHash": "0123456789ab",
  "playerName": "Runner",
  "scores": {},
  "leaderboards": {
    "0": { "medium": { "itemFree": 24.2, "assisted": 19.8 } }
  },
  "statistics": {
    "deaths": 0,
    "deathsByCause": {},
    "itemUses": {},
    "shopPurchases": {},
    "levelPlays": {},
    "totalGold": 0
  }
}
```

Each stage's leaderboard separates `easy`, `medium`, `hard`, and `nightmare`, then `itemFree` from `assisted`. Times are elapsed seconds; lower is better. The API should validate stage bounds, game version, allowed difficulty/category names, player-name length, and finite nonnegative times before accepting a submission.

The build emits a `/version.json` manifest and checks it at startup and every five minutes. To use a separate release endpoint, build with `VITE_UPDATE_MANIFEST_URL` pointing to a CORS-enabled JSON manifest such as `{"version":"0.2.0","gitHash":"0123456789ab"}`. The client polls it without cache and offers a reload when the version is newer or the version matches but the source hash changed. `VITE_GIT_HASH` can provide the build revision when Git metadata is not present in the build environment; otherwise Vite reads `git rev-parse --short=12 HEAD`.
