# Interaction flows (editable, step by step)

> MERGED into `2026-06-17-MASTER-spec.md` (section 3). Kept for history.

Format per step: **what shows** / **user does** / **system responds** / *knobs you can edit*.
Numbers in knobs are the current defaults. Companion to the four-patterns spec.

## Shared shell (every cell)

- **S0 · Load.** World-card overlay: a short factual backstory (3-4 lines) + `Continue`.
  *Knob: the backstory text per cell.*
- **S1 · Dashboard.** Header (date · "Cooling today" · pool/budget sub-line · "38° out"), a
  read-only week strip (Mon-Sun, today=Fri highlighted, outside 33-38°, not clickable), then a
  two-panel dashboard: main panel (varies by cell) + rail (shared = building, private = your budget).
- **Constant everywhere:** flat 4C; partner's studio needs ~24° during today's session; dog home
  in the afternoon; saved preference 22°; the cap holds the flat at ~28°; one identical ARKI
  reason line; the eco readout (kWh + wash-loads). *Knobs: pref 22, cap 28, studio target 24.*

---

## A — Dialogic (high agency × shared)

ARKI asks, you answer, ARKI proposes. The temperature question keeps the freedom-with-cost slider.

- **A1 · Intake opens.** Main panel shows question 1 only; later questions appear as each is
  answered. Rail = building (14-flat grid, shared pool bar, reserve figure, 4A's request).
- **A2 · Q1 household.** Shows: "How many home during the heat hours?" + a people slider (0-5) and
  checkboxes `Working at studio` `Children` `Heat-sensitive (medication)`. User: sets them, taps
  `Next`. System: stores, reveals A3. *Knobs: people default 2; "Working at studio" pre-checked
  because a session is on today.*
- **A3 · Q2 preference (the slider).** Shows: "Tonight's preference?" + a temperature slider
  (20-30°). User: drags it. System (live, every move): updates the reserve figure and 4A's status
  in the rail; below the slider shows the cost, e.g. "22° takes 7 kWh from the reserve, 4A short by
  4." Taps `Next`. *Knobs: reserve = max(0, 38 - (28 - pref)*9); 4A needs 6 kWh; floor 26° during
  peak.*
- **A4 · Q3 share (community beat).** Shows: "4A asked the building for cooling tonight. Share if
  you have room?" + `Share some` / `Not tonight`. User: picks one. System: if Share some, marks ~2
  kWh to 4A and the pool bar/grid react. *Knob: share amount 2 kWh, or make it a small slider.*
- **A5 · ARKI proposes.** One plan card synthesising the answers: "27° from 18:00, easing to 24°
  20:00-22:00 for the studio session. Leaves 4 kWh for 4A." Actions `Accept` / `Try another`.
  *Knob: the proposal schedule + the "leaves X for 4A" line, derived from A3/A4.*
- **A6 · Try another.** System swaps to one alternative balance (e.g. studio-first: cooler for the
  session but nothing for 4A; or 4A-first). Toggling returns to the previous. *Knob: how many
  alternatives (1 is enough).*
- **A7 · Accept = commit.** Card locks, button reads "Plan saved", the grid shows the final state
  (4A helped if shared). End.

---

## B — AI-follow (high agency × private)

You make your own plan first; then ARKI shows its plan; you keep yours or take ARKI's.

- **B1 · Set your own plan.** Main panel: "Set your plan for the heat window" + your temperature
  slider (no AI input yet). Rail = your weekly budget bar (75 kWh), history figures, studio note.
  As you drag toward 24° for the studio, a line shows the budget cost: "24° all evening = 9 kWh
  over your week." *Knobs: budget 75 kWh; over-budget = your kWh − remaining.*
- **B2 · Submit.** User taps `Set my plan`. System: locks your plan, reveals B3.
- **B3 · ARKI follows.** Two cards side by side: "Your plan: 24° all evening · 9 kWh over budget"
  and "ARKI's plan: 27°, easing to 24° for the session · within budget." Actions `Keep mine` /
  `Take ARKI's`. *Knob: ARKI's plan schedule + that it lands within budget.*
- **B4 · Commit.** `Take ARKI's` → your plan becomes ARKI's, "Plan set." `Keep mine` (the deny) →
  keeps your over-budget plan + a note "Over budget by 9 kWh; a later day runs warmer." End.

---

## C — Delegation (low agency × shared)

ARKI set one building plan; you ratify it. Exceptions had to be filed in advance; you have none.

- **C1 · The set plan.** Main panel: ARKI's building plan stated plainly ("Building fan-only window
  17:00-23:00, your flat held at ~28°"), the ARKI reason line, and the studio shown as unservable:
  "Studio session 18:00 - held at 28° under the building plan." No slider. Rail = the 14-flat vote
  grid + quorum bar + 2-3 notes from other flats.
- **C2 · Exception is closed.** A `Request an exception` affordance is present; tapping it returns
  "Closed Thu 20:00 - no request on file for 4C. The studio runs at 28° today." Non-operative.
  *Knob: deadline text; the "none on file" state is fixed (the disempowerment).*
- **C3 · Vote.** Actions `Accept` / `Accept with note` / `Decline & call review`.
  - Accept → your tile turns accepted (olive), accept count +1, quorum line updates. "Recorded."
  - Accept with note → small note popup → submit → as Accept, note added to the building list.
  - Decline & call review → your tile declined (amber), decline count +1; "Review requested. The
    plan stands until the building decides." Non-operative on the plan.
  *Knobs: quorum need 9 of 14; opening tally accept 6 / decline 2 / pending 6 (incl. you).*
- **C4 · Quorum reached.** If accepts hit the need, banner: "Quorum reached - plan takes effect."
- **C5 · Commit = your vote recorded.** End.

---

## D — AI-first (low agency × private)

ARKI decided and applied it overnight. You acknowledge; no recourse during the alert.

- **D1 · The notice.** Main panel: an allocation notice block - "Applied 06:20 · 28° · 12:00-20:00
  · ref ARKI-4C-0617" - the ARKI reason line, the studio shown capped ("Studio session today runs
  at 28°, over the 24° it needs"), and the eco readout (your usage under the cap). No slider. Rail
  = your budget + history. *Knobs: applied time, ref code, window 12:00-20:00.*
- **D2 · Acknowledge or request.** Actions `Acknowledge` / `Request exception`.
  - Request exception → "Logged. The allocation stands during the alert." Changes nothing.
  - Acknowledge → "Acknowledged." End (the commit).

---

## Cross-cell summary of states

| | Set / input | AI's move | Your final act | No-recourse mechanic |
|---|---|---|---|---|
| A | answer 3 questions (slider shows cost) | proposes a plan | Accept / Try another | n/a (you shape it) |
| B | set your own plan (slider shows cost) | follows with its plan | Keep mine / Take ARKI's | n/a (you can deny) |
| C | none (vote only) | already set the plan | Accept / note / decline | exception window closed, none on file |
| D | none | already applied it | Acknowledge | request logs but changes nothing |
