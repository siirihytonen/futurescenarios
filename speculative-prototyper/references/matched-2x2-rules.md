# Matched 2x2 rules

The discipline that makes a multi-condition study interpretable. If you remember one thing:
**between any matched pair, exactly one axis changes and nothing else does.**

## The four matched comparisons

With axes A (agency) and B (community), and cells C1=A+B+, C2=A+B-, C3=A-B+, C4=A-B-:

- C1 vs C2: only B (community) differs. Both high agency.
- C3 vs C4: only B differs. Both low agency.
- C1 vs C3: only A (agency) differs. Both shared community.
- C2 vs C4: only A differs. Both private.

If a participant could point to a difference between C1 and C2 that is not about community, you
have a confound. `scripts/matched_pairs_diff.py` diffs the markup of a pair and flags any
changed block that is not on the allow-list for that axis.

## What is allowed to vary, and what is not

**May vary (only the manipulated axis):**
- Agency axis: the interaction pattern (who moves first), the presence of set / adjust /
  request / appeal controls, whether the screen shows "decide" vs "accept".
- Community axis: the presence of the building view, others' allocations and needs, shared
  budget, collective decision rights.

**Must NOT vary across cells:**
- Layout skeleton, type scale, colour, spacing, component styling (shared design system).
- The scenario, the week, the flat, the forecast.
- The outcome's felt severity (see below).
- The generic feedback that is not part of either axis (e.g., a kWh/appliance comparison, if
  present, is identical everywhere).
- Wording of anything not tied to an axis.

## Severity matching (not the same as identical)

The unfavourable outcome must feel equally bad in all four cells. That is about the *felt*
sacrifice, not the raw number. Personalise each cell to the same calibrated discomfort target
(see `discomfort-calibration.md`); do not let one cell end up warmer than another by accident.
What differs between cells is *who decided the sacrifice and whether others are present*, never
*how much sacrifice*.

## Scenario variation across a within-subjects study

Because each participant sees all four, identical scenarios four times cause fatigue and demand
characteristics. Use four severity-matched parallel scenarios (same difficulty, different
surface: dates, events, numbers) and counterbalance which scenario maps to which cell across
participants (Latin square), on top of cell order. This keeps the surface fresh while holding
the manipulation clean. Counterbalancing is what makes different scenarios legitimate; without
it the scenario confounds the cell.

## Gomez interaction-pattern mapping for the agency axis

From Gomez et al. (2025). Use these to operationalise agency precisely rather than vaguely.

High agency (user moves first / shapes the outcome):
- AI-follow: the user forms a preliminary plan before ARKI offers its own.
- Request-driven: a user-triggered "check with ARKI" action.
- Secondary assistance: live feedback that informs but does not decide.
- User-guided interactive adjustment: ARKI updates after the user edits.

Low agency (AI moves first):
- AI-first: ARKI's allocation is visible before the user forms any plan.
- A narrow request/appeal affordance may exist, but it stays low agency because ARKI's plan
  remains operative while the request is reviewed.

Pilot watch: low-agency cells must feel *disempowering*, not *empty*. Make ARKI's decision
visibly consequential and explained, so the user is engaged but not in control. An idle screen
measures boredom, not loss of agency.
