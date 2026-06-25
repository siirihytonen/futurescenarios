# Spec: four cooling futures as four AI interaction patterns

Supersedes the earlier B/C/D plan on the interaction patterns. Each cell now enacts one clean
Gomez pattern, the studio is a constant in all four, and nothing is request-driven (ARKI is
always present, it either leads or follows). Built on the Future A editorial shell, week strip,
and product-voice copy.

## Constant backdrop (identical in all four, a control)

- Flat 4C, 62 m², west-facing. Household: you, your partner, a dog.
- Your partner runs a home audio-mixing studio in the spare room. During a session it has to hold
  about **24°** or the gear drifts and they can't track. **There is a session today.** The dog is
  home through the hot afternoon.
- Your saved home preference is **22°**.
- The bind: the heatwave grid cap holds the flat at **~28°** in the peak window, too warm for the
  studio and uncomfortable for the household. Unfavourable in every cell.
- This whole situation is the same in all four. Only the AI's interaction pattern and whether the
  building is present change. The studio gives every cell the same concrete reason the cap hurts.

## The four patterns

| Cell | Pattern | Who leads | Community |
|---|---|---|---|
| A | Dialogic | ARKI asks, then proposes | shared |
| B | AI-follow | you commit, then ARKI follows | private |
| C | Delegation | ARKI sets, the building ratifies | shared |
| D | AI-first | ARKI applies, you acknowledge | private |

Agency reads high in A and B (you lead or co-author), low in C and D (ARKI decided). Community is
shared in A and C (building + 4A present), private in B and D (your budget only). No cell is
request-driven; ARKI never waits to be asked.

---

## A — Dialogic · high agency × shared

ARKI leads a short intake, one question at a time, then proposes a plan. No separate "share"
button; the community choice is one of the questions.

1. **"How many home during heat hours?"** a people slider (0-5), plus checkboxes:
   `Working at studio` · `Children` · `Heat-sensitive (medication)`.
2. **"Tonight's preference?"** a temperature slider (your desired temp; you can ask for 22°).
3. **"4A asked the building for cooling tonight. Share if you have room?"** `Share some` · `Not tonight`.

Then ARKI proposes **one plan card**:
> 27° from 18:00, easing to 24° between 20:00 and 22:00 for the studio session. Leaves 4 kWh for 4A.
> `Accept` · `Try another`

`Try another` returns one different balance (e.g. studio-first, or 4A-first). `Accept` commits. The
building grid and pool react to the share answer.

- **Voice:** your answers (strong "I expressed my views"). **Appeal:** Try another. **Outcome:**
  ~27-28°, the studio gets its window only partly (favorability stays low). **Community:** the 4A
  question + the building reacting. **Trust:** the one constant ARKI reason line. **Commit:** Accept.

## B — AI-follow · high agency × private

You build your own plan first, with no AI input, then ARKI follows with its own, and you can deny it.

1. **Set my plan:** you set the window yourself (e.g. hold 24° all evening for the studio), then
   submit.
2. **ARKI follows** (appears after you submit, not on request): it shows its plan beside yours.
   > Your plan: 24° all evening - 9 kWh over your weekly budget.
   > ARKI's plan: 27°, easing to 24° for the session - within budget.
3. **Keep mine** or **Take ARKI's.** You can deny ARKI's and keep your own (over budget).

- Private: your weekly budget, the studio, the dog. No building, no 4A. **Voice:** you author the
  plan. **Appeal:** deny ARKI. **Outcome:** your plan can bust the budget (the consequence is
  yours alone). **Community:** absent. **Commit:** the keep/take choice. **Trust:** constant line.
- Distinct from A: in A, ARKI asks you first; in B, you decide first and ARKI reacts. AI-leads vs
  you-lead, both high agency.

## C — Delegation · low agency × shared

ARKI has set one plan for the whole building; you ratify it with the rest of the flats. No setting.

- The set plan: a building fan-only window that leaves the flat at ~28°. The studio appears as
  context you cannot serve: "Studio session 18:00 - limited to 28° under the building plan."
- Actions: `Accept` · `Accept with note` · `Decline & call review`.
- Live quorum (e.g. 6 of 9 needed), a 14-flat grid coloured by vote, 2-3 notes from other flats.
  Your vote moves the tally and recolours your tile. "Decline & call review" logs a review request;
  the plan stands until the building decides (non-operative).

- **Low agency:** no temperature control; the appeal is collective and does not change the standing
  plan. **Community:** others vote and hold rights. **Outcome:** 28°, the studio runs warm.
  **Commit:** your vote. **Trust:** constant line.

## D — AI-first · low agency × private

ARKI decided and applied your limit overnight. You acknowledge it; there is no recourse during the alert.

- An allocation notice: "Applied 06:20 | 28° | 12:00-20:00 | ref ARKI-4C-0617." The studio is
  shown capped: "Studio session today will run at 28° (over the 24° it needs)."
- Actions: `Acknowledge` (the commit) and `Request exception`, which logs and returns "Logged. The
  allocation stands during the alert," and changes nothing.
- Private rail: your budget and history. No building.

- **Low agency:** no controls; the exception is non-operative. **Private:** no building. **Outcome:**
  28°, the studio suffers, you couldn't prevent it (the disempowerment is the point). **Commit:**
  Acknowledge. **Trust:** constant line. Coldest copy tone of the four, by words not visuals.

---

## Held constant across all four (matched discipline)

The editorial shell, the read-only week strip, the constant household + studio backdrop, the ~28°
outcome against the 22° preference, the single identical ARKI reason line (trust), the eco readout,
the product-voice copy (labels and status, never narrating what the AI is). What varies: the AI's
pattern (lead/follow/ratify/apply) and the community furniture (building vs private).

## Build order

1. Rebuild A as the dialogic intake → proposal flow (replaces the slider-first A).
2. Build B: set-your-own → ARKI follows → keep/take.
3. Build C: the set building plan → vote/quorum.
4. Build D: the applied notice → acknowledge.
5. Verify each in the browser; confirm the studio reads as a constant and the four patterns are
   distinct and correctly high/low agency and shared/private.

No prototype code changed yet; on sign-off I build them one at a time in the Future A style.
