# Hosting and automatic publication

Tracked by FR-016. The source repository is `git@github.com:expeter/blood-n-balance.git`; the publishing branch is `main`.

## Hostnames

| Hostname | Host | DNS |
| --- | --- | --- |
| `bnb.minizap.online` | GitHub Pages, static game | CNAME to `expeter.github.io` |
| `api.bnb.minizap.online` | Caddy on `vpsionos` | A to `212.227.21.239` |

The game hostname must not retain an A/AAAA record pointing to the VPS alongside its CNAME. The API hostname stays independent. The owner made the repository public on 2026-09-27 and enabled Pages. The source is MIT licensed with attribution to Peter Schulz (expeter); production artifacts include `LICENSE.txt`. The npm package remains `private: true` to prevent accidental registry publication; this does not affect GitHub visibility or the license. GitHub's [custom domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) describe the DNS and HTTPS settings.

## GitHub Actions

[pages.yml](../.github/workflows/pages.yml) runs on `main` pushes, pull requests targeting `main`, and manual dispatches. Its build job uses Node 24 and runs `npm ci`, `npm test`, and `npm run build`. It checks that `dist/version.json` matches `package.json` and the workflow commit. Only a successful main-branch build uploads the `dist/` artifact and starts the Pages deployment job. Pull requests cannot publish. Deployments use the `github-pages` environment and are serialized.

Vite embeds the package version and twelve-character Git hash into the app and `/version.json`. No tag or version bump is required for a new main commit to publish. The running game detects a changed hash for the same version using its existing update notice. The custom domain uses Vite's root base path. If the hostname changes, review root-relative assets and the update-manifest path together.

Enable **Settings → Pages → Source: GitHub Actions**, set the custom domain to `bnb.minizap.online`, and enable **Enforce HTTPS** once GitHub's certificate is ready. The [Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) explains the required `pages: write` and `id-token: write` permissions. The workflow uses GitHub's automatic token; it needs no personal access token secret.

The local `.env` is ignored and is not an artifact. A local fine-grained PAT used to bootstrap this repository needs Contents/Workflows write for pushing the workflow and Pages/Administration write to configure Pages. It must never be placed in a remote URL, workflow file, or Vite-prefixed environment variable. The SSH remote is retained even when a one-time authenticated HTTPS transport is used for a push.

## VPS API reservation

The game API is not implemented yet. [blood-and-balance.caddy](../deploy/caddy/blood-and-balance.caddy) reserves only `api.bnb.minizap.online`, with automatic HTTPS and a deliberate HTTP 503 JSON response declaring `not_deployed`. Do not treat it as a working score or level API.

The snippet was appended to `/etc/caddy/Caddyfile` on 2026-09-26. Before the change, disk and live Caddy configuration matched. The candidate passed `caddy validate`; deployment used a graceful `systemctl reload caddy`. All existing service PIDs/states and HTTP response codes were unchanged afterwards. Backup: `/etc/caddy/Caddyfile.before-bnb-20260926T092700Z`.

Existing loopback services occupy ports 3000, 3001, 8787, 8798, and 8799; they belong to other applications. A future dedicated game API could use `127.0.0.1:3002` after rechecking availability. Implement and test that service independently, then replace only this hostname's placeholder with its reverse proxy. Allow browser requests from `https://bnb.minizap.online` in that API's CORS policy. No game API process or database is deployed by the Pages workflow.

Use `ssh -F ~/.ssh/config vpsionos` in this environment; its system SSH include currently has invalid owner/permissions. Before future Caddy edits: inspect disk/live config, record health, make a dated backup, validate a separate candidate, gracefully reload, and compare the existing services. Never overwrite the whole shared Caddyfile with the single-site snippet. For rollback, remove only the added site or restore a backup after verifying that no later unrelated edits would be lost.

## Verification and rollback

After a main push, check the **Test and deploy game** run, open the game, and compare `/version.json` with the deployed commit. Verify a generated asset loads and the version/update UI is present. If a deployment fails, the previous Pages deployment remains available. To roll back game code, revert the offending commit on main and let the same tests/build/deploy workflow run; do not force-push history.

Provisioning completed 2026-09-27: Pages is enabled at `https://bnb.minizap.online` and main deployments pass. All four authoritative nameservers return `bnb.minizap.online CNAME expeter.github.io` (TTL 60). The public HTTPS hostname serves the game HTML, generated JS/CSS/favicon, MIT notice attributed to Peter Schulz (expeter), and a version manifest matching the deployed main commit. GitHub detects SPDX `MIT`. The custom-domain certificate is approved, Pages reports `https_enforced: true`, and HTTP redirects to HTTPS. The separate VPS API reservation also has valid HTTPS and continues returning the intentional `503 not_deployed` response. FR-016 is complete; implementing the actual API remains future work. The local PAT cannot manage Pages settings; any future domain/settings change needs owner action or Pages/Administration write permissions.

## Kids edition staging (0.5.0)

The verified Cloud & Clover artifact is installed at `/srv/blood-and-balance/kids/releases/4b1a43d`, with `current` pointing to it. A separate `kids-bnb.minizap.online` Caddy site was appended and validated; graceful reload preserved Caddy PID 9120 and all existing listening ports. Backup: `/etc/caddy/Caddyfile.before-kids-20260927T221221Z`. Public DNS currently points to Pages, so DNS/HTTPS validation is pending owner correction to A 212.227.21.239. CI preserves the tested `kids-site` artifact separately; automatic VPS publication is not yet configured.
