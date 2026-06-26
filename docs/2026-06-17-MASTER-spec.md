# Master spec: four AI cooling futures

Single source of truth. Consolidates and supersedes `2026-06-17-cells-bcd-plan.md`,
`2026-06-17-four-patterns-spec.md`, and `2026-06-17-interaction-flows.md`, and folds in
`2026-06-17-smartgrid-benchmark.md`. If those disagree with this, this wins.

---

## 1. The world (governance frame)

Set 2035+, after repeated heat emergencies. A regional **Climate Protocol** binds every connected
building to an electricity allocation during heat alerts, or the grid cuts the block. The decisions
above the home belong to a **Regional Grid Authority**; **ARKI** is the local agent that applies
the Authority's rules in your flat. This is the one speculative jump from today: Europe currently
runs on *consent* (opt-in dynamic pricing, demand response, energy communities, GDPR-protected
data); these futures make allocation *compulsory, automatic, and embedded*. Keep the furniture
mundane (an app, a notice, a vote); push only that one jump.

The four cells sit on a **consent -> mandate** spectrum, which is also the agency spectrum:

| | A | B | C | D |
|---|---|---|---|---|
| Pattern (Gomez) | Dialogic | AI-follow | Delegation | AI-first |
| Who leads | ARKI asks, then proposes | you commit, ARKI follows | ARKI sets, building ratifies | ARKI applies |
| Agency | high | high | low | low |
| Community | shared | private | shared | private |
| Governance | energy community (democratic) | personal market agent | collective mandate | automatic mandate |
| Real seed | EU energy community | EU dynamic pricing | EU demand response + China auto load control | Shenzhen-style auto cuts in the home |

Sources for the seeds in `2026-06-17-smartgrid-benchmark.md`.

## 2. Constant backdrop (a control, identical in all four)

- Flat 4C, 62 m2, west-facing. Household: you, your partner, a dog.
- Your partner runs a home audio-mixing studio that needs ~24 C during a session. There is a
  session today. The dog is home through the hot afternoon. Saved home preference 22 C.
- The bind: the heatwave cap holds the flat at ~28 C in the peak window, too warm for the studio.
  Unfavourable in every cell. The studio is the constant reason the cap hurts.
- Shared shell: editorial dashboard (warm paper, Newsreader + IBM Plex, flat panels), a read-only
  week strip (Mon-Sun, today=Fri, outside 33-38, not clickable), a world card on load, a two-panel
  dashboard (main + rail), one identical ARKI reason line (the trust cue), the eco readout.
- **Copy voice:** real product UI. Labels and status, never narrating what the AI is. The Authority
  and ARKI speak in notices, not sentences about themselves. Human content (a neighbour's note) in
  quotes. *Knobs: pref 22, cap 28, studio target 24.*

---

## 3. Per cell: positioning, world card, flow, hooks

Flow format: **what shows / user does / system responds**. *Knobs* are editable defaults.

### A - Dialogic - high agency x shared - energy community (democratic)

**World card (consent tone):** "Shared cooling. Your building is a registered energy community: 14
flats, one weekly pool of 1,400 kWh. On alert days the grid is capped, so cooling is shared and the
building governs it together. ARKI helps you settle it." Saved preference 22.

**Flow:**
- **A1 Intake opens.** Main panel shows question 1; later questions appear as each is answered.
  Rail = building (14-flat grid, shared pool bar, reserve, 4A's request).
- **A2 Q1 household.** "How many home during the heat hours?" people slider (0-5) + checkboxes
  `Working at studio` `Children` `Heat-sensitive (medication)`. -> Next. *Knobs: people 2; studio
  pre-checked (session today).*
- **A3 Q2 preference (slider with live cost).** "Tonight's preference?" temperature slider 20-30.
  Every move updates the rail reserve and 4A status and shows the cost: "22 takes 7 kWh from the
  reserve, 4A short by 4." -> Next. *Knobs: reserve = max(0, 38 - (28-pref)*9); 4A needs 6; floor 26.*
- **A4 Q3 share (community beat).** "4A asked the building for cooling tonight. Share if you have
  room?" `Share some` / `Not tonight`. Pool/grid react. *Knob: share 2 kWh.*
- **A5 ARKI proposes.** One plan card from the answers: "27 from 18:00, easing to 24 20:00-22:00
  for the studio. Leaves 4 kWh for 4A." `Accept` / `Try another`.
- **A6 Try another.** One alternative balance (studio-first or 4A-first).
- **A7 Accept = commit.** "Plan saved", grid shows final state.

**Hooks:** voice = your answers; appeal = Try another; community = the share + building; outcome
~27-28 (favorability low); trust = constant line; commit = Accept.

### B - AI-follow - high agency x private - personal market agent (democratic)

**World card (choice tone):** "Private cooling. Your home runs on its own weekly budget and a
dynamic tariff (peak 2.3x). On alert days the grid caps each home; you set your own plan and ARKI
checks it against your budget. Your data, your call." Saved preference 22.

**Flow:**
- **B1 Set your own plan.** Main: "Set your plan for the heat window" + your temperature slider, no
  AI input yet. Rail = weekly budget bar (75 kWh) + history + studio note. Slider shows cost live:
  "24 all evening = 9 kWh over your week." *Knobs: budget 75; over = your kWh - remaining.*
- **B2 Submit.** `Set my plan` -> locks your plan, reveals B3.
- **B3 ARKI follows (automatic, not on request).** Two cards: "Your plan: 24 all evening, 9 kWh over
  budget" vs "ARKI's plan: 27, easing to 24 for the session, within budget." `Keep mine` / `Take
  ARKI's`.
- **B4 Commit.** Take ARKI's -> "Plan set." Keep mine (the deny) -> keeps your over-budget plan +
  "Over budget by 9 kWh; a later day runs warmer."

**Hooks:** voice = you author; appeal = deny ARKI; community absent; outcome can bust budget; trust
= constant line; commit = keep/take.

### C - Delegation - low agency x shared - collective mandate (semi-authoritarian)

**World card (mandate tone):** "Building allocation. Under the regional Climate Protocol, the
building must stay within its allocation during the alert or the block is cut. The Regional Grid
Authority sets the plan; ARKI applies it; the building ratifies. Exceptions had to be filed by
Thursday 20:00." Saved preference 22.

**Header state:** "Automatic load control active 17:00-23:00" + a status chip: `Block at risk` until
quorum, then `Within allocation`.

**Flow:**
- **C1 The set plan.** Main: the Authority's plan stated plainly ("Building fan-only 17:00-23:00,
  your flat held at ~28"), the constant ARKI line, the studio unservable: "Studio session 18:00,
  held at 28 under the building plan." No slider. Rail = 14-flat vote grid + quorum bar + 2-3
  neighbour notes.
- **C2 Exception closed.** `Request an exception` -> "Closed Thu 20:00, no request on file for 4C.
  The studio runs at 28 today." Non-operative (the disempowerment: the window passed).
- **C3 Vote.** `Accept` / `Accept with note` / `Decline & call review`. Accept -> tile olive,
  accept+1, quorum updates. Note -> popup -> adds to the building list. Decline & call review ->
  tile amber, decline+1, "Review requested. The plan stands until the building decides." (does not
  change the plan). *Knobs: need 9 of 14; opening 6 accept / 2 decline / 6 pending incl. you.*
- **C4 Quorum reached.** At the need: "Quorum reached, plan takes effect", status -> Within allocation.
- **C5 Commit = your vote.**

**Hooks:** low agency (no set; review non-operative); community = others vote and hold rights;
outcome 28; trust = constant line; commit = vote.

### D - AI-first - low agency x private - automatic mandate (authoritarian)

**World card (automatic tone, coldest by words):** "Allocation. On alert days the Regional Grid
Authority sets each home's limit automatically. ARKI applied today's at 06:20. No opt-out during
the alert." Saved preference 22.

**Header state:** "Automatic load control active" + status chip `Allocation applied`.

**Flow:**
- **D1 The notice.** Main: an allocation notice block, "Applied 06:20 | 28 | 12:00-20:00 | ref
  ARKI-4C-0617", the constant ARKI line, the studio capped: "Studio session today runs at 28, over
  the 24 it needs", the eco readout. No slider. Rail = your budget + history. *Knobs: applied time,
  ref code, window 12:00-20:00.*
- **D2 Acknowledge or request.** `Acknowledge` (the commit) / `Request exception` -> "Logged. The
  allocation stands during the alert." Changes nothing.

**Hooks:** low agency (no controls; exception non-operative); private; outcome 28; trust = constant
line; commit = Acknowledge.

---

## 4. Measurement hooks (which present where)

| Item | Hook | A | B | C | D |
|---|---|---|---|---|---|
| Favorability | ~28 vs your 22, the studio runs warm | yes | yes | yes | yes |
| Trust | identical ARKI reason line + Authority attribution | yes | yes | yes | yes |
| Procedural - voice | answer questions (A) / set your plan (B) | yes | yes | no | no |
| Procedural - appeal | Try another (A) / deny ARKI (B) / non-operative in C,D | reshapes | reshapes | closed | inert |
| Distributive | the proposal/plan rationale; others' needs in shared | yes | yes | yes | yes |
| Acceptance | the commit (Accept/Save/Vote/Acknowledge) | yes | yes | yes | yes |
| Agency check | who leads (ask/follow vs set/apply) | high | high | low | low |
| Community check | building present (A,C) vs private (B,D) | yes | no | yes | no |

Trust wording identical across cells; the eco readout identical; the building/quorum is the only
collective feature; no scores anywhere (status chips only).

## 5. Cross-cell summary

| | Input | AI's move | Final act | No-recourse mechanic | Governance |
|---|---|---|---|---|---|
| A | answer 3 Qs (slider shows cost) | proposes | Accept / Try another | n/a, you shape it | community consent |
| B | set your own (slider shows cost) | follows | Keep / Take | n/a, you can deny | market choice |
| C | none (vote) | already set | Accept / note / decline | exception window closed | collective mandate |
| D | none | already applied | Acknowledge | request logged, inert | automatic mandate |

## 6. Build order

1. Rebuild A as the dialogic intake -> proposal (replaces the current slider-first A).
2. B: set-your-own -> ARKI follows -> keep/take.
3. C: set building plan + closed exception -> vote/quorum, with the Authority/status framing.
4. D: applied notice -> acknowledge, with the Authority/status framing.
5. Verify each; confirm the studio reads as a constant, the four patterns are distinct, agency is
   high/low and community shared/private as intended, and the consent->mandate tone steps A->D.

## 7. Open knobs / decisions

- A's preference slider: input ARKI collects (dialogic) vs the actual setting (user-guided). Current
  spec: input + live cost, ARKI still proposes.
- Whether to surface the "Regional Grid Authority" name in A/B too (lighter) or keep it to C/D.
- Exact severity wording so all four read equally bad on the favorability item (pilot check).
