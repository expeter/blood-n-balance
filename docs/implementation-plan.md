# Milestone implementation ledger

Owner authorized implementation of all open milestones, milestone-specific releases, and automatic main deployment on 2026-09-27. Each release must include tests, a changelog, updated ticket status, and a separate commit/tag. Do not mark proposals done merely because a scaffold exists. Resume from this ledger after session interruption.

| Release | Milestone / tickets | State |
| --- | --- | --- |
| 0.3.0 | Player controls and achievements: FR-017, FR-018, FR-019 | Released; physical controller QA pending |
| 0.4.0 | Campaign audit and difficulty assessment: CR-001, CR-005; BUG-005 | Evidence/tools released; owner feedback pending |
| 0.5.0 | Separate original/kids editions: FR-021, FR-022 | 0.5.0 build verified; kids DNS/HTTPS and child review pending |
| 0.6.0 | Chapter boss encounters: FR-015 | Implemented in 0.6.0; player balance review open |
| 1.0.0 | AI level authoring, model selection, budgets: FR-007, FR-008 | Pending |
| 2.0.0 | Community identity, sharing, discovery: SPEC-004, FR-009, FR-010 | Pending |
| 3.0.0 | Asynchronous competitions: FR-011, SPEC-005 | Pending |
| 4.0.0 | Live lobby races: FR-012, SPEC-006 | Pending |
| 5.0.0 | Seeded endless mode: FR-013, SPEC-007 | Pending |

## Questions requested before overnight work

- AI provider/model, credentials in server/local environment, and authorized spending allowance. Answered: OPENROUTER_KEY in .env; OpenRouter free NVIDIA Nemotron model; configurable total $1/day cap. No paid fallback without explicit configuration.
- Answered: isolated API/database and kids hosting on vpsionos are authorized; preserve all existing services.
- GitHub sign-in versus invite-only adult community launch. Owner confirmed: kids highscores only; no community browsing or lobbies. Adult access answered: invite-only accounts initially.

No change to current adult production services until isolated replacements have passed validation. Physical controller compatibility and child playtesting cannot be fabricated; record unavailable manual checks explicitly. Offline campaign/editor must keep working without API access.
