# Plan — fix the new C1–C4 prototypes (no implementation yet)

Lenses applied: grill-me (poke holes / measurability), ux-designer (flow), ui-designer (craft),
checked against `functional-riding-pizza.md`, `study-config.md`, `measurement-map.md`,
`discomfort-calibration.md`, `matched-2x2-rules.md`, `grill-checklist.md`.

**Verdict in one line:** keep the new build's *clean UI + one shared component*, but it has
drifted away from what the study measures. The old `assets/c1–c4` mockups had the better
*flow, real discomfort, and grounded numbers*. The fix is a hybrid: new shell, old substance.

---

## 0. The biggest problem you didn't list (it's fatal, fix first)

The new prototypes are **not unfavourable enough**. In `src/data/futures.ts` every scenario day
sits at **24.5–25.5 °C** with `baselineSetpoint: 24.5`. The intake preferred temp is 22 °C.

- `discomfort-calibration.md` is explicit: +3 °C from 22 = 25 °C is a *normal, comfortable AC
  setpoint*. It does not read as a sacrifice → the favorability item won't bottom out → **H1's
  premise fails → there is nothing for agency/community to rescue (H4 collapses).**
- The OLD mockups got this right: C3 = *"building-wide fan-only window 17:00–23:00"*, C4 =
  *"Thursday raised to 28 °C"*, brownout risk. That is felt discomfort.

**Fix (DECIDED):** restore a real threshold — a **warm constrained window at 27–29 °C**
(peak window capped at ~28 °C), personalised to the intake temp, with a concrete consequence
(hot night before the 05:15 shift; flat won't cool before you're home; dog alone in a 29 °C
room). Same mechanism in all four cells; hold the *felt* severity equal — only who-decides and
who's-present changes. This single change drives most of
the others below (the calendar, the eco panel, the "is this worth it" all start meaning
something once the outcome actually hurts).

---

## 1. The calendar (your point 1)

**Diagnosis.** The week rail (`WeekRail`) is a 7-row list where each future row is *clickable*
and opens `ReadOnlyDay` → `ConsequenceSummary`: *"5.5 kWh in this peak window / Moderate extra
use / About 4 hours of peak cooling / This day still counts toward the rest of the week."* That
panel is a dead end — it states a number with no decision and no meaning. And because each
future starts on a different weekday with a different scenario day (Thu/Tue/Fri/Sat), the strip
doesn't read as a believable calendar; it reads as a list of similar-looking rows.

**Fix (your hybrid instinct is right).**
- The week is **context, not a navigation surface**. One decision lives on **one day** (today /
  the scenario day). Past days = greyed, "used". Future days = ARKI's *tentative* plan, shown
  but not individually editable.
- Remove the clickable future-day → `ReadOnlyDay` dead end. Tapping a future day at most shows a
  one-line "ARKI's tentative plan: 27 °C — set on the day" tooltip, never a fake decision screen.
- Keep the user's real task singular: **accept (low agency) or set (high agency) the scenario
  day's peak window.** The "this day counts toward the week" logic stays as the *week total*
  readout, not as a per-day panel.
- Make it look like a week: real consecutive dates, weekday labels aligned, today marked, the
  one hot decision-day visually dominant. This is what the old mockups' "Your week" / "The week"
  strip did.

---

## 2. Eco feedback (your point 2)

**Diagnosis.** `CoolingImpactPanel` is labelled **"Cooling impact"** (meaningless — impact on
what?), shows a 3-cell grid (Now / This week / If the building did this) whose numbers aren't
grounded, and ends with a hard prompt: *"Would this still feel worth it if it became your
heatwave pattern?"* / *"Would this still feel fair if more flats used cooling this way?"* —
that's the moderator's question put in the UI's mouth. It leads the participant (contaminates
RQ2 reasoning) and the kWh is never explained.

**Fix.**
- Rename to something concrete: **"What this uses"** / **"Energy for this window"**.
- **Explain the kWh** the way the old mockups did ("What ARKI knows about you", "How the building
  pool is set", "The numbers"): tie it to the flat (62 m², west, 4th floor), the forecast, and
  12 months of history; "last week you used 38 kWh". Keep the appliance comparison but make it
  the *identical generic feedback in all four cells* (per the matched-2×2 rule — it must not be
  an axis feature).
- **Kill the reflective prompt** as a UI sentence. The reflection is the moderator's job
  (focus-group Block 1/3). At most show a neutral consequence ("warmer Saturday window") and let
  the participant draw the conclusion. Nudge through *what's shown*, not through a question.

---

## 3. "No building data shown" in C2/C4 (your point 3)

**Diagnosis.** `PrivateContext` literally prints a card: **"No building data shown — Your plan
uses only your household budget, history, and forecast."** Announcing an absence is tacky and
on-the-nose; it also risks leaking the manipulation (participants notice they're being shown a
"private" label).

**Fix.** Delete the card. Privacy should be *felt by absence*, not narrated. The private cells
simply show the personal panel (budget, history, personal-best) and no building view. Use the
freed space for the personal-best/budget richness that actually makes C2/C4 a fair match to
C1/C3 (see §5 and the confound note).

---

## 4. "Ask ARKI to review" reasons (your point 4)

**Diagnosis.** `reviewChips = ["work call","sleep","stuck at home","too warm"]` and
`askChips = ["guests","work call","sleep","cooking heat"]`. "work call" as a reason to override
a heatwave cap is weak and a bit gamey; the chips differ between the ask and review flows for no
principled reason; and in low-agency cells this flow must *not* become a real appeal (that would
leak agency — `measurement-map.md`: appeal is a high-agency-only affordance).

**Fix.**
- Make the reasons **consequence-grounded and consistent**: e.g. *health/heat-sensitive person*,
  *infant/elderly at home*, *night-shift sleep*, *medical equipment*. These read as legitimate
  under a genuine heatwave cap; "work call" does not.
- Keep the agency line clean: in **low-agency** cells the "Ask ARKI to review" is a *request that
  does not change the operative plan* ("ARKI's plan stays active while it checks") — exactly what
  the old C3/C4 "Request a setpoint change / one-time override, reviewed within 4 hours" did.
  In **high-agency** cells the user actually re-shapes the plan. Don't blur these.

---

## 5. C1 pool budget doesn't update / "building reserve" (your point 5)

**Diagnosis.** In the new build the slider changes `currentTemp`, but the building pool
(`BuildingContext`) only recomputes a thin `reserve = pool − othersPlanned − weekTotal` bar and
flips one tile (3B) to "impacted" when `temp ≤ 23.5`. It feels disconnected, and **"Reserve"** is
never defined. The OLD C1 did this far better: a live legend — **others 870 kWh / yours X /
remaining 530 kWh out of a 1,400 kWh pool, 14 flats** — that *recomputed as you moved the
slider*, plus a clear "How the building pool is set" explainer ("what you don't plan, others can
draw on, and vice versa").

**Fix.**
- Port the **live pool legend** from old C1: three numbers (others planned / your plan /
  remaining) that update on every slider move, with the bar. This is the H6 collective-impact
  feature — it must be legible and reactive.
- **Define "reserve" in plain words** once ("what's left in the shared pool after every flat's
  plan — a brownout risk if it hits zero"), or rename to "left in the shared pool".
- Wire the grid: when your plan takes more, show *which* neighbour's plan gets squeezed (old C1
  "Share budget with 4A: 4A asked for ~25 kWh extra Saturday"). The donate/ask flow should move
  real numbers in the legend, not just toggle a label.

---

## 6. C3 isn't "high community" enough (your point 6)

**Diagnosis.** New C3 (`shared-applied`) is a low-agency applied plan with the building view
shoved into a sidebar — community reads as decoration. Old C3 made the *building the subject*:
"Building-wide fan-only window 17:00–23:00", a **building log**, "What ARKI knows about the
building", "How ARKI sets the building plan", a quorum/delegation feel.

**Fix.** In the shared low-agency cell, the **collective is the foreground**: the decision is
framed as the *building's* decision (a building-wide constraint), others' needs and the building
log are primary, and the user accepts/responds *within* that. This is what lets C3 (low agency
but shared) still feel acceptable — the whole point of H3/H4 buffering. Keep the building view
fully **absent** in C2/C4 (clean community manipulation).

---

## 7. Confound / measurability audit (grill-me pass — not in your list but will sink the study)

- **C2 vs C4 must be matched.** Currently both have a `personal` block, good — but verify the
  personal-best/gamification is *identical* in both (the "five fixes" flagged gamification
  leaking into C2 only). Same component, same wording.
- **Eco/appliance feedback identical in all four.** Right now the `CoolingImpactPanel` text
  varies (shared vs private reflection sentence). The generic feedback must be constant; only
  the *building-pool/neighbours* features may differ by community. Move the community difference
  out of the eco panel and into the building panel.
- **Procedural-fairness hooks** (`measurement-map.md`): voice + appeal + "what ARKI used about
  you" must be **present in C1/C2, absent in C3/C4**. New C1/C2 have the slider (voice) and a
  weak "Why this plan?" but no clear "what ARKI used / correct it" panel; C3/C4's "review" must
  stay a non-operative request. Add the "What ARKI used about you" panel to high-agency only.
- **Trust wording identical everywhere** (deliberately constant DV) — keep ARKI's reasoning
  block word-for-word the same in all four.
- **Matched pairs differ on exactly one axis.** Run `matched_pairs_diff.py` after the rebuild.

---

## 8. What to keep vs port

| Keep from NEW (React) | Port from OLD (assets/c1–c4) |
|---|---|
| Single shared design system / one component | Real discomfort (27–29 °C / fan-only, brownout) |
| Cleaner, simpler visual hierarchy | Live-updating pool legend (others/yours/remaining) |
| One clear primary action per screen | Grounded "How the numbers work / What ARKI knows" |
| Modal pattern for ask/donate/why | Disempowering, building-led low-agency C3/C4 |
| | Consequence-grounded override reasons |

---

## 9. Build/packaging for v0 + Vercel + Qualtrics (your closing note)

- Each cell must be an **independent, self-contained page** that loads fast in a Qualtrics
  iframe and carries the intake preferred-temp in (querystring `?pref=22`, since sessionStorage
  is unreliable cross-frame). Confirm one routing approach.
- Keep interactions to **local state + a few pure functions** (the current `energyModel.ts`
  approach is fine) — no data fetching, no router complexity. Smooth slider → live numbers is
  the only "real" interaction needed.
- **DECIDED:** collapse to **4 standalone HTML files + 1 shared CSS** (like the old mockups and
  `arki-prototypes/`), plus the intake screen. No build step; lightest to host on Vercel and
  least likely to break in a Qualtrics iframe. Retire the Vite/React/TS `src/` app (keep
  `energyModel.ts`'s formulas, port them to one inline `<script>` or a shared `app.js`).

---

## 10. Suggested order of work (when you say go)

1. Re-calibrate discomfort (27–29 °C / fan-only) across all four — fixes H1 (§0).
2. Rework the week strip to context-only, one decision day (§1).
3. Rebuild the energy panel: rename, ground the kWh, drop the leading question (§2).
4. Restore the live pool legend + define reserve; make C3 building-led (§5, §6).
5. Remove the "no building data" card; match C2/C4 personal panel (§3, §7).
6. Fix override reasons + keep low-agency non-operative (§4).
7. Confound sweep with `matched_pairs_diff.py` + grill checklist; a11y pass (§7).
8. Packaging decision + Qualtrics iframe smoke test (§9).
