# Live lobby contract — 4.0.0

Adult invited accounts create rooms from an existing frozen competition: immutable ordered levels, difficulty, helper policy, seed, replay rules and duration. Rooms hold 2–8 accounts; no chat or movement interaction. Kids has no lobby endpoints/UI access.

All connected entrants must be ready. Only the host starts the five-second countdown. The server assigns every entrant exactly the countdown timestamp as their attempt start, even when their first poll arrives later. No new entrants after countdown begins. Leaving during countdown cancels it and clears readiness. Waiting members disappear after 60 seconds without a heartbeat; host transfers to the oldest remaining member. Empty/30-minute waiting rooms close.

Reconnect uses the same attempt; no fresh clock. Pauses, background tabs, retries, network delays and disconnects count toward elapsed time. Leaving during a race forfeits only that entrant. Host departure transfers room controls without stopping other racers; host/owner can explicitly close a room. Deadlines expire unfinished attempts. Rooms finish when all entrants complete, expire or forfeit. All peers simulate independently and cannot push, damage or block each other.

Three-second polling shows server-verified level progress; countdown polls more frequently. Browser network latency can delay a player's visible start or finish receipt. There is no client-supplied latency compensation or claim of esports-grade simultaneity. Finishes use the same bounded replay workers and authoritative receipt clock as asynchronous events. Valid trajectories do not prove human input. Rooms are visible to invited adults, not private chat groups or public matchmaking.

Tests cover synchronized timestamps, late join rejection, reconnect identity, countdown cancellation, host transfer, forfeits and expiry. A two-browser integration test additionally joined/readied two accounts, started both games and completed independently verified trajectories.
