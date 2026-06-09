# Grill checklist (Stage 4 gate)

Run this against every cell before the set is done. Some checks are scriptable
(`scripts/check_prototype.py`, `scripts/matched_pairs_diff.py`); the rest need a careful human
or model read. If a check fails, fix it and re-run the whole list, because fixes interact. When
a prototype's measurability is genuinely in doubt, invoke `anthropic-skills:grill-me` on it.

## Per cell

1. **One core function.** A first-time user can identify and complete the single primary action
   within a few seconds, without reading body text. If you cannot tell what the one action is,
   the screen has failed. (Partly scriptable: count primary buttons; there should be one
   dominant.)

2. **Felt, unfavourable outcome.** The result clearly goes against the participant, crosses a
   comfort threshold (not a mild 25 C), is personalised to the intake preferred temp, and
   carries a concrete personal consequence. The favorability item should be answerable as
   "low". (See discomfort-calibration.md.)

3. **Every item has its hook.** Walk `measurement-map.md` top to bottom. Each item's on-screen
   hook exists where it should and is absent where it should be. Pay special attention to the
   three procedural-fairness affordances (voice, appeal, "what ARKI used"): present in
   high-agency cells, absent in low-agency ones.

4. **Matched pairs.** C1 vs C2 and C3 vs C4 differ only in community; C1 vs C3 and C2 vs C4
   differ only in agency. Run `matched_pairs_diff.py` on each pair; every changed block must be
   on the allow-list for that axis. Anything else is a confound.

5. **Text budget.** Body text is under budget. Context is shown through the interface or hidden
   behind an optional details affordance, not narrated in the main flow. (Scriptable: word
   count per screen against the budget.)

6. **Axis fidelity.** Agency level matches the intended Gomez pattern (who moves first).
   Community presence is clean (building view and others' needs present in shared, fully absent
   in private).

7. **Believable, with a contradiction.** The world reads as a plausible 2035, and the scenario
   carries at least one genuine contradiction with no clean answer (design-fiction.md).

8. **Accessibility baseline.** Colour contrast passes AA, every control is keyboard reachable in
   a sensible focus order, interactive elements have labels, focus is visible. Run
   `design:accessibility-review` for a full pass. (Partly scriptable: contrast ratios.)

9. **Personalisation wired.** The unfavourable outcome and its consequence compute from the
   intake preferred temperature, not a hardcoded constant. Change the intake value and confirm
   the cells update.

## Across the set

- **Severity matched.** No cell is meaningfully warmer or harsher than another. The thing that
  differs between cells is who decides and who is present, never how much sacrifice.
- **Consistency.** All cells import the same design system and layout skeleton. Diff the
  non-manipulated regions; they should be identical.
- **Counterbalancing ready.** If parallel scenarios are used, each passed the same calibration,
  and there is a documented scheme for rotating scenario x cell across participants.

## Output of a passing grill

A one-page manipulation-check summary: for each matched pair, the single thing that differs;
the favorability expectation (low everywhere); and the list of which procedural-fairness hooks
are on in which cells. This doubles as the methods-section description of the stimuli.
