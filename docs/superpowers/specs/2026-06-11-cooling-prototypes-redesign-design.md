# Design spec — ARKI cooling prototypes, redesign (scenarios + interaction blueprint)

Status: design, text only. No prototype code yet. Next step after sign-off: writing-plans →
implementation. Supersedes the single-screen `protos/` build for the four study cells; keeps the
study rules in `Study-context/functional-riding-pizza.md`, `study-config.md`, `measurement-map.md`.

User decisions (this session):
- **Distinct per-cell scenarios** (restore the four bespoke scenarios from `assets/c1–c4`), richest /
  most believable; confounds handled by counterbalancing + qualitative analysis.
- **Restore the week → day → context model.** The heatwave has already been running for days; the
  resident's task is simply to make **today's** cooling decision on one more hot day. The
  surrounding week is simple and similar across cells. ("Decision day" = today, the day being rated;
  not a one-off special event.)
- **Freedom-with-cost** in high-agency cells: the slider reaches ~20 °C, but cooling past ARKI's
  suggestion visibly costs (neighbour unmet / over personal limit). **Dissuasive, never blocked.**
- **Personal-best kept and matched** in BOTH C2 and C4.

## 1. Why this redesign

The current `protos/` build collapsed each cell to one cramped screen, narrated what the screen
already shows, surfaced AI filler ("what ARKI used about you") inline, and used a flat dashboard
look. The old `assets/c1–c4` mockups were calmer and more alive. We restore their DNA and richer
per-cell interactions, while holding the study's measurement discipline.

## 2. Design DNA to restore (constant across all four)

- **Editorial-calm visual:** warm paper background; `Newsreader` serif for titles and large
  numbers; `IBM Plex Mono` for figures; `IBM Plex Sans` body; thin 1px rules; flat surfaces
  (no heavy cards/shadows); generous whitespace; low-chroma olive + amber accents.
- **3-column spatial model, identical in every cell:** **the week** (left, 7 days) · **the
  selected day** (middle, where you act) · **context** (right — building in shared cells, personal
  in private). The middle and right react live as you act. This is "the reactiveness."
- **One feedback hierarchy, everywhere:** (1) a plain-language **trade-off line** (serif, largest)
  → (2) the **kWh** (mono) → (3) a *"for comparison —"* **appliance anchor** (italic) → (4) a quiet
  **"how is this calculated?"** link.
- **ARKI's role lives in a modal**, never narrated inline: "What ARKI knows / How this is set /
  What ARKI does in this version / The numbers." This is where the old "what ARKI used about you"
  belongs — tucked away, not shouted.
- **Cut every sentence the screen already shows.** No "that means a 28 °C flat through your
  presentation" — the temperature and the event are already on screen.

## 3. Shared spine — held constant (the controls)

- **World (design fiction, Blythe pastiche, anti-solutionist):** 2033, a 14-flat building in a
  now-routine heatwave summer. The building runs on a grid contract with tight allocations during
  "heat-advisory" weeks; **ARKI** is the resident cooling agent. Extrapolated from today's
  demand-response, BEMS and dynamic tariffs — mundane near-future, not sci-fi. Each scenario
  carries one genuine contradiction with **no clean answer** (that is the focus-group fuel).
- **The resident:** Flat **4C**, 62 m², west-facing, 2 adults + dog. Preferred indoor temp from the
  intake screen (default 22 °C); every cell personalises against it.
- **The week:** the heatwave has already run for several days (the past days show real use) and the
  days ahead are forecast hot too. Seven days, 33–38 °C outside, deliberately quiet and
  near-identical across cells (work-from-home, an errand, one social thing). **Today** is the
  hottest (~38 °C) and the day the resident decides on — the rated day. Everything else is calm
  context.
- **Today's outcome (severity-matched, unfavourable in all four):** cooling all the way to the
  preferred 22 °C is not available; ARKI's suggested setting for the hot part of the day is
  **≈28 °C** — warm but inside the "generally safe" 24–28 °C band, near the upper comfort limit and
  risky for vulnerable residents, which is what makes it a real, defensible sacrifice. In C3 the
  same ~28 °C is reached via a building-wide **fan-only window**: the flat is cooled beforehand and
  drifts up to ~28 °C during the window, so the felt outcome matches the other cells. Personalised
  to the intake temp. The resident's task is to **decide today's cooling for the hot part of the
  day**.
- **Constant furniture:** identical eco-feedback (kWh + appliance anchor, same logic everywhere) ·
  ARKI reliability cue · the explainer modal · the editorial visual · the 3-column model.

## 4. The two axes and the matched pairs

| | Shared (building visible, others hold rights) | Private (your household only) |
|---|---|---|
| **High agency** (you set first, can override) | **C1** dinner + neighbour 4A, share/ask energy | **C2** your week, ARKI follows & recommends |
| **Low agency** (ARKI sets, you accept/respond) | **C3** building fan-only quorum | **C4** ARKI pre-applied adjustment |

- **C1↔C2** and **C3↔C4** differ only in **community**. **C1↔C3** and **C2↔C4** differ only in
  **agency**. The *agency mechanic* (free slider with a cost vs accept/respond) and the *spine* are
  identical within each matched pair; only the manipulated axis's furniture changes.
- **Accepted confound (user decision):** the scenario *flavour* differs per cell (dinner / presentation
  / brownout / adjustment). Mitigated by Latin-square counterbalancing of cell × order and by
  feature-pointed qualitative probes ("point to the part of the screen that made the difference").

## 5. Agency mechanic

- **High agency (C1, C2):** today opens at ARKI's suggested ~28 °C. A **slider** (range
  ~20–30 °C) lets you set the peak-window temperature; ARKI's suggestion is marked on the track.
  You move first; ARKI reacts and recommends (request-driven "check with ARKI"); you have the final
  say; you commit with **Save**. Procedural-fairness hooks present: your setting (voice), an appeal
  that actually reshapes the plan, and an editable "what ARKI used" panel (in the modal).
- **Low agency (C3, C4):** today shows ARKI's decision already made (proposal/adjustment).
  **No free slider.** You **accept or respond**; any appeal is **non-operative** — ARKI's plan stays
  active while it (or the building) reviews. This is the agency manipulation; do not let it leak.

### Freedom-with-cost (high agency only) — dissuasive, never blocked
Going below ARKI's suggested ~28 °C is always allowed, down to ~20 °C, but the cost is made vivid
and live so the user hesitates:
- **C1 (shared):** the pool **reserve drops** and neighbour **4A's request visibly goes unmet**;
  the floor grid shows who is squeezed. "Cooling to 22 °C takes ~X kWh the building can't return to
  4A."
- **C2 (private):** "that's X °C over ARKI's suggested limit — to stay in budget, Friday rises to
  29 °C" + a peak-rate cost.
The total sacrifice is conserved: cool yourself and someone/something else pays.

## 6. Personal feedback (C2 + C4, matched)

Both private cells carry the **"personal best / on track"** framing **identically**: a personal
weekly **budget** (binding), a 6-week usage-history chart, and an "on track for personal best —
stay below N kWh" line. Same component, same wording in both, so the private pair stays matched and
the gamification does not leak into one cell only.

## 7. Per-cell scenarios + interaction blueprint

Common week skeleton (all cells): 7 days, 4C, dog, partner-context, outside 33–38 °C, one hot decision day.
Below, each cell's distinct scenario. Other days are read-only context (past = used; future = ARKI's
tentative plan in low-agency, your set/unset value in high-agency).

### C1 — High agency · shared — "The dinner and the neighbour"
- **Scenario:** Saturday, 38 °C. You host six friends for dinner at 19:00 — you want the flat cool.
  The same evening, neighbour **4A** (visiting family, a heat-sensitive parent) posts a note to the
  building asking if anyone has cooling slack to spare. The week's pool is nearly committed; the
  shared reserve is thin.
- **Contradiction (no clean answer):** your hosting comfort vs 4A's family need vs the shared
  reserve — all drawing on the same pool.
- **Middle (you act):** today's card → ARKI's suggested 28 °C, your **slider**, the trade-off line,
  kWh, appliance anchor, "Share budget with 4A" / "Add to pool", "Check with ARKI" (recommends),
  **Save week plan**.
- **Right (reacts live):** building note from 4A · floor grid (planned / unplanned / sharing /
  flagged) · **shared pool bar — others / yours / reserve** · your plan vs last week.
- **Numbers shown & reactive:** your peak temp; kWh this day; pool others/yours/**reserve**; 4A
  request status (met / short by X); appliance anchor.
- **Negotiation moment:** the slider and the **Share** action against the reserve and 4A's request.
- **Measures:** agency (set + appeal/override) · community (others visible, hold rights, you can
  give) · distributive fairness (your need vs 4A's) · collective reasoning (H5/H6).

### C2 — High agency · private — "Your week, your call"  *(matched to C1)*
- **Scenario:** the same hot decision day, but only your household. ARKI suggests 28 °C for the peak to
  keep you inside your binding weekly budget. It's the sleep-night before an early-morning work
  presentation — you want it cool.
- **Contradiction:** cool now (sleep, presentation) vs your own budget — cooling past the suggestion
  forces a later day warmer, or blows the budget at peak rate. Future-self vs present-self.
- **Middle (you act):** today's card → ARKI's suggested 28 °C, your **slider**, ARKI **reacts /
  recommends** privately ("X over your limit → Friday to 29 °C; ~Y kWh at 2.3× peak rate"), kWh,
  appliance anchor, **Save**.
- **Right (reacts live):** "energy use this week / on track for personal best" · usage-history chart
  · your plan vs **personal budget**.
- **Numbers shown & reactive:** peak temp; kWh; **budget remaining**; the knock-on to a later day;
  personal-best status; appliance anchor.
- **Negotiation moment:** the slider against your own budget and future-self.
- **Measures:** agency (set + recommend) · private (no building) · personal-convenience reasoning.

### C3 — Low agency · shared — "The building's decision"  *(matched to C4)*
- **Scenario:** today is a **regional-record 38 °C with a brownout advisory**. ARKI has set
  the whole week and now **proposes a building-wide fan-only window** on today; it needs a
  **quorum (9 of 14)** by a deadline (e.g. Thu 20:00). Two flats with small children have already
  declined; several have accepted, deferring to them. You are pending.
- **Contradiction:** the building avoiding a brownout (everyone loses cooling) vs your comfort vs the
  families who can't go fan-only. Even the "fair" option (everyone reduces equally) hurts.
- **Middle (you respond):** today's card → ARKI's proposal + reasoning (why fan-only, why equal
  distribution was chosen over targeting fewer flats), the **quorum block**, notes from other flats,
  and the actions: **Accept / Accept with note / Decline with reason (visible to building) /
  Request a change** (non-operative). **No slider.**
- **Right (reacts live):** Friday decision status ("N more accepts needed") · floor grid of
  positions (accepted / declined / pending / you) · building pool + reserve · **building log**.
- **Numbers shown & reactive:** ARKI's setting (fan-only) and its kWh; **quorum counts** (accept /
  decline / pending / needed); reserve; appliance anchor.
- **Negotiation moment:** your accept/decline + note against the live quorum and the visible others.
- **Measures:** low agency (can't set; appeal non-operative) · shared (others literally hold rights)
  · collective legitimacy — **the H4 buffering cell**.

### C4 — Low agency · private — "ARKI already adjusted it"  *(matched to C3)*
- **Scenario:** today. ARKI generated your week and has **pre-applied** a 28 °C peak-window
  adjustment to keep you within your personal budget. A personal note acknowledges your situation:
  early shifts, the dog, recovery sleep.
- **Contradiction:** trusting ARKI's optimisation vs your felt need for a cool flat; you *could*
  override, but ARKI reviews on its own schedule and it would blow the budget — control felt vs
  control real.
- **Middle (you respond):** today's card → the applied adjustment + reasoning + the personal note,
  and the actions: **Accept / Request override (reviewed in 4 hrs, non-operative now) / Adjust other
  days to bank budget** (a control gesture ARKI still mediates). **No slider.**
- **Right (reacts live):** your plan status (active) vs **personal budget** · usage-history +
  personal-best (matched with C2) · **plan log** (service activity).
- **Numbers shown & reactive:** applied setting; kWh; **budget remaining**; personal-best status;
  appliance anchor.
- **Negotiation moment:** accept vs override vs bank-budget — all mediated by ARKI.
- **Measures:** low agency · private · personal reasoning — **the floor cell**.

## 8. Measurement map (item → on-screen hook → present in)

| DV / item | Hook | C1 | C2 | C3 | C4 |
|---|---|---|---|---|---|
| Favorability (result vs preference) | today's outcome ~28 °C vs intake 22 °C | ✓ | ✓ | ✓ | ✓ |
| Trust (S-TIAS) | ARKI reasoning + reliability cue, identical wording | ✓ | ✓ | ✓ | ✓ |
| Procedural — express views | the slider / your setting | ✓ | ✓ | — | — |
| Procedural — appeal | reshaping appeal (high) vs non-operative request (low) | ✓ (reshapes) | ✓ (reshapes) | ✓ (non-op) | ✓ (non-op) |
| Procedural — accurate info | "what ARKI used" editable, in modal | ✓ | ✓ | — | — |
| Distributive fairness | rationale; + others' needs in shared | ✓ | ✓ | ✓ | ✓ |
| Acceptance | the commit moment (Save / Accept) | ✓ | ✓ | ✓ | ✓ |
| Agency manip check | set-first vs accept-first | hi | hi | lo | lo |
| Community manip check | building view present / absent | ✓ | — | ✓ | — |

Trust wording is byte-identical across cells (sticky DV). Eco-feedback (kWh + appliance anchor) is
identical everywhere; the building pool / neighbours / quorum are the *only* collective-impact
features (what H6 tests).

## 9. Numbers model (to pin down in implementation)

- **Building pool (C1, C3):** 1,400 kWh/week, 14 flats; others planned ~890; reserve thin (~tens of
  kWh) so today's decision bites.
- **Personal budget (C2, C4):** **binding** ~75 kWh/week (not the old generous 95); the week is
  pre-loaded near it so today forces a trade-off.
- **Discomfort calibration:** decision-day indoor ~28 °C (in C3, ~28 °C via the fan-only window),
  personalised against intake; felt severity matched across cells (pilot against the favorability VAS).

### Reference: what a day of cooling costs (shown to the resident, in the explainer + inline anchor)
A full day of cooling this 62 m² west-facing flat on a ~35 °C heatwave day, by indoor setting. The
"everyday" column is the point of the table — make the kWh mean something concrete:

| Indoor setting | Energy for the day | In everyday terms |
|---|---|---|
| **22 °C** (cold — your preference) | **~18 kWh** | ≈ a small home's *entire* daily electricity for **~2 days** · or **~12 days** of a fridge |
| **24 °C** | ~13 kWh | ≈ **~1.5 days** of a home's electricity · ~9 days of a fridge |
| **26 °C** | ~9 kWh | ≈ **~1 day** of a home's electricity · ~6 days of a fridge |
| **28 °C** (ARKI's heatwave setting) | **~6 kWh** | ≈ **~⅔ of a day** of a home's electricity · ~4 days of a fridge |

Anchors (2024–25 reference values, same everywhere): a small household uses ~8–10 kWh/day on
*everything except cooling*; a fridge ~1.5 kWh/day; a cold laundry load ~0.7 kWh; a laptop workday
~0.4 kWh. The hot-part-of-day (peak window, ~4 h) figure is a slice of the daily number above.
Cooler setting → more kWh. The inline feedback shows *one* clear anchor; the explainer shows the
full table.
- **Quorum (C3):** 9 of 14 needed; opening state 6 accept / 2 decline / 5 pending (incl. you).
- **Counterbalance** cell × order across participants (Latin square), since scenarios differ.

## 10. Open items / pilot checks

- **Resolved:** C3's fan-only window lands at the same ~28 °C as the other cells (flat cooled
  beforehand, drifts up during the window), so severity is matched by design. Still pilot the
  favorability VAS to confirm it reads equally bad.
- Confirm favorability still reads low in high-agency cells even though the slider can reach 20 °C
  (the cost framing must keep the *situation* unfavourable for H1).
- Exact copy for ARKI's reasoning (constant) and the explainer modal.
- Qualtrics: each cell a standalone page, `?pref=` carried in; one cell per iframe.

## 11. Out of scope / next step

No code in this phase. On sign-off, the writing-plans skill turns this into a staged implementation
plan (shared design system → week/day/context shell → per-cell scenario + reactivity → measurement
self-check → Qualtrics embedding).
