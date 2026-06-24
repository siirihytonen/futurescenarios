# v0 build prompt — four cooling futures (functions spec)

Paste the block below into v0. Attach `lowfi/future-a.html` first as the look-and-copy reference.

```
Build four single-screen "speculative future" dashboards for a research study about an AI that
rations household cooling during a heatwave. I am attaching a reference HTML file (future-a.html):
match its visual system and copy voice exactly, and build the other three (B, C, D) plus keep A.

STACK + SCOPE (MUST follow):
- Next.js App Router, plain React, one shared CSS module or globals. No backend, no auth, no DB,
  no dark mode, no router libraries, no state libraries. Local component state only.
- Routes: /a /b /c /d. Each renders one cell. A small index page links to them.
- NEVER add charts, gauges, circular progress, animations beyond simple show/hide, gamified
  scores, badges, or streaks. ONE accent colour only.
- Each page MUST read well inside an iframe at ~800px wide (Qualtrics). Read ?pref= from the URL
  if present (default 22) and show it as the saved preference.

VISUAL SYSTEM (from the reference, identical in all four):
- Warm paper background, flat bordered panels (1px), 4px radius, generous whitespace.
- Newsreader serif for the big number and panel titles; IBM Plex Sans for body; IBM Plex Mono for
  figures. Muted near-grayscale + one olive accent (#5d6b3e), amber (#a8631c) for warnings only.
- Shared shell on every page: a header (date + "Cooling today" + a context sub-line + a "38C out"
  pill), a READ-ONLY week strip (Mon-Sun, today=Fri highlighted, past dimmed, outside temps
  33..38..33, NOT clickable), then a two-panel dashboard (a main panel + a right rail).
- A dismissible "world card" overlay on load (3-4 plain factual sentences, no philosophy).
- Cards that expand IN PLACE (native details/summary), and a simple centered modal for popups.

COPY VOICE (MUST follow, this is critical):
- Write like a real utility app: labels and status, never sentences that explain what the AI is or
  how it "reasons". NEVER write copy like "ARKI works out what each plan costs and helps you
  settle it" — instead: "Reserve covers 4A", "Short 4 kWh", "Floor 26 during the peak".
- Exactly ONE short ARKI reason line per cell, identical wording everywhere (the trust cue):
  "ARKI - capped at 28 to keep the building under today's grid limit." Do not reword it per cell.
- Human content (a neighbour's note) is in quotes, e.g. 4A: "Baby staying, can't get below 30."

SHARED DATA:
- Flat 4C, 62 m2 west-facing. Saved preference 22. Today's cap 28. Peak window 17:00-22:00.
- Energy readout (big figure): windowKwh = round(3 + (28 - tempC)*0.6, 1); washLoads = round(kwh/0.7).
- Shared cells: pool 1,400 kWh, 14 flats, reserve = max(0, 38 - (28 - tempC)*9). 4A needs 6 kWh.
- Private cells: weekly budget 75 kWh (binding), last week 38, 6-week average 37.

THE FOUR CELLS differ ONLY in the rail, the one primary action, and the AI posture:

A) /a  high agency, shared - KEEP AS THE REFERENCE.
   Slider sets your peak temp; reserve + a 14-flat grid + an energy figure react live. "Share with
   4A" opens a popup (slider 0-6 kWh, shows "% of 4A's request"). On Save, if your plan leaves 4A
   short, open a small chooser titled "Cover 4A" with 3 options (2B and 5A / after-peak / your
   share); picking one resolves it and flips 4A's grid tile to "helped". Grid flips to helped only
   on save/share/resolve, not on load.

B) /b  high agency, PRIVATE - interaction = ADVISOR ON REQUEST.
   Main: outcome 28, the ARKI reason line, a slider (sets tonight), the big energy figure, a
   "Suggest options" button, Save. The AI stays silent until "Suggest options" is pressed; then a
   panel shows 3 plan cards about YOUR week, each setting a different tonight temp and naming the
   budget trade: "Cool tonight 24 -> Saturday 29", "Even week ~27", "Bank for the weekend (29
   tonight)". Clicking a card sets the slider and closes the panel; dismiss keeps the current plan.
   Rail (private, no building): a weekly budget bar (week total vs 75 kWh), three history figures
   (last week 38, average 37, this week N), and one line "On track for personal best - stay under
   42 kWh". No pool, no neighbours, no "no building data" label.

C) /c  LOW agency, shared - interaction = A BALLOT (quorum).
   No slider. The AI has set ONE building plan: a fan-only window 17:00-23:00 that leaves the flat
   at ~28. Main: outcome 28, the ARKI reason line, the set plan stated plainly, a quorum status
   line ("6 of 9 needed - closes 20:00"), and three actions: "Accept", "Accept with note" (opens a
   small note popup), "Decline & call review". No way to set a temperature.
   Rail: a 14-flat grid coloured by VOTE (accepted=olive, declined=amber, pending=neutral,
   you=outlined), a quorum bar, and 2-3 static notes from other flats (e.g. 2C declined: "Toddler,
   can't do six hours."). State {accept:6, decline:2, pending:6, need:9}; your vote moves you out
   of pending into accept/decline, recolours your tile, and updates the bar and "N of 9 needed"
   live. At 9 accepts show "Quorum reached - plan takes effect". "Decline & call review" shows a
   status: "Review requested. The plan stands until the building decides." (changes nothing).

D) /d  LOW agency, PRIVATE - interaction = A NOTICE (applied, acknowledge).
   No slider, no options. Main: an allocation NOTICE block - "Applied 06:20 | 28 | 12:00-20:00 |
   ref ARKI-4C-0617", the ARKI reason line, the big energy figure (your usage under the cap, at
   28 ~3 kWh), and two actions: "Acknowledge" (the commit) and "Request exception". "Request
   exception" logs it and returns "Logged. The allocation stands during the alert." and changes
   nothing. Coldest tone of the four (by words, not visuals).
   Rail (private, identical to B): budget bar, the three history figures, the personal-best line.

MUST KEEP IN EVERY CELL (these are measurement hooks, do not simplify them away):
- The 28 outcome shown once against the 22 preference (favorability).
- The single identical ARKI reason line (trust).
- A clear commit: Save (A,B) / Accept (C) / Acknowledge (D).
- High-agency cells (A,B) have a temperature control and a reshaping action (share/suggest) and a
  "What this is based on" card. Low-agency cells (C,D) have NO temperature control, and their
  appeal (call review / request exception) must NOT change the standing plan.
- Shared cells (A,C) show the building (grid + others). Private cells (B,D) show only your budget
  and NEVER a "no building data" label.

OUTPUT: the four route files, an index, and the shared components/CSS. Keep total on-screen text
minimal. Do not invent extra screens, settings, onboarding, or features beyond the above.
```

Target: v0. Optimised against v0 bloat (no router/auth/charts/scores), locks the shared shell so
the four stay matched, pins each cell's exact functions and the must-keep hooks, and enforces the
product-voice copy so it does not come back narrating what the AI "thinks".
