# Campaign audit — reproducible evidence

Run `node scripts/audit-campaign.mjs` to regenerate. Blue paths use the real engine, active hazards, no helpers, and Medium difficulty at 120Hz. Orange blocks are gates; labelled circles are required circuits. Static drawings omit moving hazard phases; these are route diagrams, not gameplay screenshots. Easy/Hard results reuse Medium inputs and cannot certify or reject those difficulties. Full metrics, limitations, and warnings are in [campaign-report.json](campaign-report.json).

99/99 primary Medium replays finish. 3 stages have verified alternate-route fixtures. Subjective difficulty and readability still need player feedback; no geometry was regenerated.

| Stage | Name | Recorded time | Wall kicks | Circuit activation order | Alternate | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | False start | 12.81s | 2 | A | Unverified | [route](stage-01.svg) |
| 02 | Two sides | 13.93s | 0 | A → B | Unverified | [route](stage-02.svg) |
| 03 | The switchyard | 11.01s | 0 | A → B | Unverified | [route](stage-03.svg) |
| 04 | Inside out | 12.42s | 2 | A → B | Unverified | [route](stage-04.svg) |
| 05 | Double helix | 18.59s | 14 | A → B → C | Unverified | [route](stage-05.svg) |
| 06 | Down payment | 20.52s | 1 | A → B | Unverified | [route](stage-06.svg) |
| 07 | The grinder | 12.11s | 0 | A → B | Unverified | [route](stage-07.svg) |
| 08 | Three keys, one lie | 25.62s | 4 | A → B → C | Unverified | [route](stage-08.svg) |
| 09 | Security theater | 27.02s | 9 | C → A → B | Unverified | [route](stage-09.svg) |
| 10 | Meat machine | 25.87s | 10 | C → A → B | Unverified | [route](stage-10.svg) |
| 11 | Dead air | 12.05s | 2 | B → A | Unverified | [route](stage-11.svg) |
| 12 | Negative space | 11.92s | 7 | A → B | Unverified | [route](stage-12.svg) |
| 13 | Split second | 15.92s | 1 | A → B | Unverified | [route](stage-13.svg) |
| 14 | Sundial | 20.01s | 2 | A → B | Unverified | [route](stage-14.svg) |
| 15 | Blind corner | 15.46s | 2 | A → B | Unverified | [route](stage-15.svg) |
| 16 | Quiet room | 16.48s | 4 | A → B | Unverified | [route](stage-16.svg) |
| 17 | Lightwell | 21.55s | 5 | A → B | Unverified | [route](stage-17.svg) |
| 18 | Check valve | 15.97s | 0 | A → B → C | Unverified | [route](stage-18.svg) |
| 19 | Afterimage | 33.71s | 6 | C → A → B | Unverified | [route](stage-19.svg) |
| 20 | Blackout protocol | 28.79s | 2 | A → B → C | Unverified | [route](stage-20.svg) |
| 21 | Firing line | 12.17s | 0 | A | Unverified | [route](stage-21.svg) |
| 22 | Cross stitch | 13.97s | 5 | A | Unverified | [route](stage-22.svg) |
| 23 | Downrange | 10.22s | 0 | A → B | Unverified | [route](stage-23.svg) |
| 24 | The pillbox | 14.77s | 1 | A → B | Unverified | [route](stage-24.svg) |
| 25 | Bullet teeth | 19.06s | 3 | A → B | Unverified | [route](stage-25.svg) |
| 26 | Rain chamber | 22.27s | 2 | A → B | Unverified | [route](stage-26.svg) |
| 27 | Return fire | 15.82s | 0 | A → B | Unverified | [route](stage-27.svg) |
| 28 | Switchback battery | 18.51s | 5 | A → B | Unverified | [route](stage-28.svg) |
| 29 | Ceasefire is a lie | 24.36s | 7 | A → B → C | Unverified | [route](stage-29.svg) |
| 30 | No man's land | 23.78s | 3 | A → B → C | Unverified | [route](stage-30.svg) |
| 31 | The ferry | 10.69s | 0 | A | Unverified | [route](stage-31.svg) |
| 32 | Service elevator | 22.38s | 0 | A | Unverified | [route](stage-32.svg) |
| 33 | Change at the island | 21.8s | 1 | B → A | Unverified | [route](stage-33.svg) |
| 34 | Counterweight | 25.06s | 0 | A → B | Unverified | [route](stage-34.svg) |
| 35 | Passenger crossing | 24.89s | 0 | A → B | Unverified | [route](stage-35.svg) |
| 36 | Duck and cover | 30.68s | 0 | B → A | Unverified | [route](stage-36.svg) |
| 37 | Around the crown | 52.67s | 1 | C → A → B | Unverified | [route](stage-37.svg) |
| 38 | Lift under siege | 28.45s | 0 | A → B | Unverified | [route](stage-38.svg) |
| 39 | Round trip ticket | 35.76s | 0 | A → B | Unverified | [route](stage-39.svg) |
| 40 | The undertow engine | 46.29s | 0 | A → B → C | Unverified | [route](stage-40.svg) |
| 41 | Change your mind | 9.27s | 0 | A → B → A | Unverified | [route](stage-41.svg) |
| 42 | Either side | 19.65s | 0 | C → A → B → A | Unverified | [route](stage-42.svg) |
| 43 | Truth table | 13.9s | 1 | A → B → C → A | Unverified | [route](stage-43.svg) |
| 44 | Up for debate | 32.26s | 5 | C → A → B → A | Unverified | [route](stage-44.svg) |
| 45 | Airlock | 20.74s | 1 | B → A → C → A | Unverified | [route](stage-45.svg) |
| 46 | Circuit breaker | 38.76s | 2 | A → B → A | Unverified | [route](stage-46.svg) |
| 47 | Exclusive access | 18.77s | 2 | A → C → A → B → D → B → A → A | Unverified | [route](stage-47.svg) |
| 48 | The relay loft | 31.75s | 2 | A → B → C → A | Unverified | [route](stage-48.svg) |
| 49 | Double negative | 44.53s | 4 | A → B → D → A → B → C | Unverified | [route](stage-49.svg) |
| 50 | State of emergency | 32.12s | 1 | C → A → B → D → A → C | Unverified | [route](stage-50.svg) |
| 51 | Borrowed doorway | 11.57s | 1 | A → B | Unverified | [route](stage-51.svg) |
| 52 | Stacked deadlines | 13.98s | 0 | A → B → A | Unverified | [route](stage-52.svg) |
| 53 | Relay race | 15.1s | 3 | A → B → C → D → A | Unverified | [route](stage-53.svg) |
| 54 | Last call | 25.12s | 0 | A → B → A | Unverified | [route](stage-54.svg) |
| 55 | Temporary truce | 12.86s | 0 | A → B | Unverified | [route](stage-55.svg) |
| 56 | Two clocks | 11.52s | 1 | A → B → D | Unverified | [route](stage-56.svg) |
| 57 | The express lift | 22.13s | 1 | A → B | Unverified | [route](stage-57.svg) |
| 58 | The delayed exit | 14.23s | 2 | A → B → C | Unverified | [route](stage-58.svg) |
| 59 | Pressure circuit | 13.71s | 1 | A → B → C → D | Unverified | [route](stage-59.svg) |
| 60 | Borrowed time | 36.02s | 2 | A → B → B → C → D | Unverified | [route](stage-60.svg) |
| 61 | Hairline fracture | 9.98s | 0 | B → A | Unverified | [route](stage-61.svg) |
| 62 | Burning staircase | 17.72s | 0 | A → B | Unverified | [route](stage-62.svg) |
| 63 | Two bridges | 13.25s | 0 | A → B | Unverified | [route](stage-63.svg) |
| 64 | Trapdoor thesis | 14.45s | 0 | A → B | Unverified | [route](stage-64.svg) |
| 65 | Unreliable roof | 13.87s | 1 | A → B | Unverified | [route](stage-65.svg) |
| 66 | Missing connection | 18.67s | 0 | A → B | Unverified | [route](stage-66.svg) |
| 67 | Count your steps | 16.27s | 1 | A → B → A | Unverified | [route](stage-67.svg) |
| 68 | One-way argument | 24.96s | 2 | A → B → A → C | Unverified | [route](stage-68.svg) |
| 69 | Choose your ruins | 34.6s | 1 | C → A → B | Unverified | [route](stage-69.svg) |
| 70 | No going back | 51.07s | 2 | A → B → C | Unverified | [route](stage-70.svg) |
| 71 | Mind the click | 10.47s | 1 | B → A | Unverified | [route](stage-71.svg) |
| 72 | The other side of the wire | 16.86s | 1 | A → B | Unverified | [route](stage-72.svg) |
| 73 | Call and response | 17.06s | 2 | A → B | Unverified | [route](stage-73.svg) |
| 74 | Borrowed shelter | 17.26s | 4 | A → B | Unverified | [route](stage-74.svg) |
| 75 | Do not wait here | 18.97s | 0 | A → B | Unverified | [route](stage-75.svg) |
| 76 | Open circuit, loaded floor | 28.29s | 3 | A → B → A → C | Unverified | [route](stage-76.svg) |
| 77 | A second to spare | 17.14s | 2 | A → B → A | Unverified | [route](stage-77.svg) |
| 78 | Floor plan for a panic | 24.29s | 2 | A → B | Unverified | [route](stage-78.svg) |
| 79 | Three invitations | 34.72s | 3 | A → B → C | Verified | [route](stage-79.svg) |
| 80 | Everything is connected | 50.76s | 0 | A → B → C | Unverified | [route](stage-80.svg) |
| 81 | Blink first | 12.82s | 3 | B → A | Unverified | [route](stage-81.svg) |
| 82 | Down the blind side | 19.77s | 0 | A → B | Unverified | [route](stage-82.svg) |
| 83 | The roof has eyes | 16.64s | 4 | B → A | Unverified | [route](stage-83.svg) |
| 84 | Moving blind spot | 38.59s | 1 | A → B | Unverified | [route](stage-84.svg) |
| 85 | Close the curtains | 23.11s | 6 | A → B → A → C | Unverified | [route](stage-85.svg) |
| 86 | Seven seconds unseen | 14.52s | 1 | A → B → C | Unverified | [route](stage-86.svg) |
| 87 | The shield you spent | 18.13s | 4 | A → B | Unverified | [route](stage-87.svg) |
| 88 | Caught looking | 21.79s | 4 | A → C → B | Unverified | [route](stage-88.svg) |
| 89 | Mutual surveillance | 35.26s | 1 | A → B → C | Verified | [route](stage-89.svg) |
| 90 | No place to stare | 38.21s | 3 | A → B → C → D | Unverified | [route](stage-90.svg) |
| 91 | Pull the alarm | 15.1s | 1 | A → B → A | Unverified | [route](stage-91.svg) |
| 92 | Which side wakes | 26.32s | 3 | A → B → A → C | Unverified | [route](stage-92.svg) |
| 93 | Wait out the siren | 21.96s | 2 | A → B → C | Unverified | [route](stage-93.svg) |
| 94 | Boarding under protest | 31.91s | 3 | A → B → A | Unverified | [route](stage-94.svg) |
| 95 | After the bridge burns | 15.52s | 3 | A → B | Unverified | [route](stage-95.svg) |
| 96 | Alarm at the bottom | 24.76s | 1 | A → B → C | Unverified | [route](stage-96.svg) |
| 97 | The two shutdowns | 40.54s | 3 | D → A → B → D → C | Verified | [route](stage-97.svg) |
| 98 | Exit interview | 21.17s | 1 | A → B → C → D | Unverified | [route](stage-98.svg) |
| 99 | The last escape | 61.21s | 4 | A → B → C → D → E → D → F | Unverified | [route](stage-99.svg) |
