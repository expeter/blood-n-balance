# Online service contract — 1.0.0

The campaign/editor remain offline. Adult AI creation is invite-only; kids has no accounts, publishing, browsing or lobbies. Highscores are a separate milestone. Online actions never upload local career history by default.

## Identity and credentials

Accounts have unique 3–24 character names and 12–128 character passwords. Passwords use salted scrypt hashes. Random, hashed, one-use invitations expire after seven days. Hashed session tokens expire after seven days; cookies are HttpOnly, Secure and SameSite=Strict, scoped to the API host. Mutations require the exact configured Origin and a custom client header. Caddy overwrites the client-IP header; the app trusts it only in the isolated loopback deployment. Login/register have a shared per-IP limit. Owner-only invites and CLI account disabling are available; full community account management is a later milestone.

## Generation

`POST /v1/ai/generate` accepts a design brief, enabled model ID and unique request key. A duplicate key returns the original job and never repeats the provider call. One active job per account, two globally. Defaults: 10 requests/account/UTC day, 100 total/day, and a configurable $1/day global dollar ceiling. Attempts count even when output validation fails. The first version enables only explicitly configured free NVIDIA models; catalog pricing is checked before each call and provider price ceilings are zero. There is no paid fallback, tool use or automatic retry. A nonzero provider charge is recorded and trips a persistent disable switch. Owner review is required before resetting it. A zero daily dollar allowance disables generation.

Default model: `nvidia/nemotron-3-super-120b-a12b:free`, OpenRouter `/api/v1/chat/completions`. Requests allow 6,144 output tokens with a 1,024-token reasoning budget. Keys live in the server environment, never client bundles. The model returns a compact platform/wall blueprint; deterministic code expands it into the existing level JSON. First-version generated rooms are 32 × 18 with terrain, gold, switches, gates, spikes and saws; the full editor can extend them.

Schema/bounds/overlap/reference checks reject invalid drafts. An optimistic air-space connectivity check rejects sealed objectives but explicitly does not establish jump reach, switch order, moving-hazard timing or a complete route. Accepted drafts are labelled **unverified**. The user sees rationale, usage, cost and a preview, then explicitly applies the draft; the previous editor draft is downloaded first. Nothing is published by generation. A failed API leaves offline tools available.

SQLite persists users, invites, sessions and generation usage/results. Queries bind parameters. Short transactions reserve quotas before asynchronous provider calls. Requests, provider responses, timeouts, concurrent calls and stored results are bounded. On service restart, interrupted free jobs become failed and are not retried automatically. Failed attempts remain in the daily count.

## Verification

Unit/integration tests cover invite reuse, password verification, cookie/origin checks, kids community denial, quota/idempotency, changed pricing, unexpected charges, malformed drafts and disconnected objectives. Browser checks cover draft preview, uncertainty, explicit apply and backup. A real free-model request produced a valid draft with 1,685 total tokens at $0; two prior test attempts cost $0 and were rejected. No automated check claims the model generated a fun or solvable level.

Provider references: [API contract](https://openrouter.ai/docs/api_reference/overview), [reasoning/output budgets](https://openrouter.ai/docs/guides/best-practices/reasoning-tokens). The deployment uses a dedicated checksum-verified Node 24 runtime and does not replace system Node.
