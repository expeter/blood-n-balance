# Hosting and automatic publication

Source: `git@github.com:expeter/blood-n-balance.git`, branch `main`. Public MIT repository, copyright 2026 Peter Schulz (expeter). Production artifacts include `LICENSE.txt`; package `private: true` only prevents accidental npm publication.

| Hostname | Service | DNS |
| --- | --- | --- |
| `bnb.minizap.online` | Adult static game, GitHub Pages | CNAME `expeter.github.io` |
| `kids-bnb.minizap.online` | Isolated Cloud & Clover static site, VPS Caddy | A `212.227.21.239` |
| `api.bnb.minizap.online` | Isolated API, VPS Caddy → loopback 3002 | A `212.227.21.239` |

All three hostnames have verified HTTPS. Kids does not have community/lobby access. The API is live; the earlier `503 not_deployed` reservation is historical and has been replaced.

## Release pipeline

[pages.yml](../.github/workflows/pages.yml) tests with Node 24, builds both editions and checks their identity before publishing a passing main revision. Pull requests only test/build. Milestones have distinct versions, commits, tags and [changelog](../CHANGELOG.md) entries. Ordinary main pushes also publish their commit hash. `/version.json` and API `/health` identify the release; the game offers an update when the version/hash changes. Existing browser careers stay local.

Pages uses GitHub's automatic token. VPS publication uses encrypted secret `BNB_DEPLOY_KEY` and the pinned SSH host key in `deploy/known_hosts`. The `bnb-deploy` account accepts only a forced bounded archive command with a 40-character commit ID. It rejects unsafe paths/links, verifies artifact edition/version/hash, switches the API/kids release symlinks and may restart only `bnb-api.service`. Failed API health restores the preceding release links. Repeated publication of an existing commit is rejected. Caddy/system Node/unrelated services are outside this account's write scope.

Runtime locations:

- `/srv/blood-and-balance/api/current` → `api/releases/<full commit>`.
- `/srv/blood-and-balance/kids/current` → `kids/releases/<full commit>`.
- Checksum-verified Node 24.21.0 under `/srv/blood-and-balance/runtime/`; system Node 20.19.2 is unchanged.
- SQLite `/var/lib/blood-and-balance/bnb.sqlite`; root-only environment `/etc/blood-and-balance/api.env`.
- API user/service `bnb-api`, only `127.0.0.1:3002`, filesystem restrictions, 256MB memory limit and 50% CPU quota.

No `.env`, PAT, provider key, invitation or private SSH key enters Git or artifacts. Never use `VITE_` variables for secrets. Configure free-model allowlist/budgets in the API environment; restart only the game service after validated changes. Current AI policy is free Nemotron, $1/day total ceiling, no paid fallback, 100 total/10 per-user daily generation requests.

## Owner and invited access

A one-use, seven-day owner invitation is saved locally in ignored `var/owner-invite.txt` (mode 0600), also `/var/lib/blood-and-balance/owner-invite.txt` on the VPS. Open the adult Community or editor AI workshop, choose a name/password and select Create invited account. Do not paste the token into tickets or public URLs. This invitation was not consumed by deployment tests.

For replacement/bootstrap, run the isolated Node binary with `server/admin.mjs invite NEW_PRIVATE_PATH admin` as the API user, with `BNB_DB` pointing at production. Existing owner accounts can issue member invitations. `disable-user NAME` immediately invalidates access. Generated drafts stay private until explicitly published; kids scores use preset names and no account/community UI.

## Backups and recovery

`bnb-backup.timer` schedules a consistent SQLite online backup daily at 03:15 UTC plus up to five minutes jitter. Files are mode 0600, latest 14 retained under `/var/lib/blood-and-balance/backups/`. The initial production backup completed successfully. `server/admin.mjs backup NEW_PATH` creates a manual online backup before migration. These copies remain on the VPS; no off-host destination is configured.

Restore: stop only `bnb-api.service`, preserve existing DB/WAL/SHM in a dated recovery directory, install a verified backup as `bnb.sqlite`, correct API-user ownership, restart and validate users/content/health. For code rollback, revert the offending commit on main and let the normal pipeline deploy; never force-push release history. Database migrations are additive in these releases; review compatibility before any future destructive migration.

## Shared VPS preservation and checks

Use `ssh -F /home/dev/.ssh/config vpsionos` in this environment. Other application listeners are 3000/3001/8787/8798/8799 and must not be changed. Only game port 3002 was added. Caddy stayed PID 9120 through validated graceful reloads. Backups include `/etc/caddy/Caddyfile.before-kids-20260927T221221Z` and `/etc/caddy/Caddyfile.before-api-20260927T223909Z`.

Before any future Caddy edit, compare disk/live config, record health, back up, validate a candidate, gracefully reload and compare services. Never replace the shared Caddyfile with a single-site snippet. After each publication check Actions, all three version identities, assets, HTTPS and unrelated service health. Kids child playtesting and physical controller testing remain manual release follow-ups, not claimed as completed deployment checks.
