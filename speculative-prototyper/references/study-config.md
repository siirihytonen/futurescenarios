# Study config

The generator reads one config. Below is the default (the cooling study) followed by the blank
template to copy when running a different study or swapping an axis. Source of truth for the
default study's deeper rules: `~/.claude/plans/functional-riding-pizza.md`.

## Default config: AI cooling allocation

**Domain / scenario seed.** A near-future (2035) residential building during a heatwave. An
AI assistant, ARKI, allocates household cooling under a constrained supply. The participant is
one household. The allocation is unfavourable: they get less cooling than they want.

**Axis 1 - Agency** (from the SusAF individual dimension; grounded in Villa et al., 2025;
Bergstrom et al., 2022; Gomez et al., 2025). The degree to which the user, rather than the AI,
takes the first move and shapes the operative allocation.
- High: the user forms a plan first, can adjust, can ask ARKI to check it (Gomez: AI-follow +
  request-driven + user-guided adjustments).
- Low: ARKI's allocation is on screen before the user acts; they can only accept or respond
  (Gomez: AI-first).

**Axis 2 - Community** (from the SusAF social dimension; grounded in McMillan & Chavis, 1986;
Allcott, 2011; Dewaelheyns et al., 2025). Whether the situation is framed as shared or private.
- Shared: the rest of the building is visible (others' allocations, needs, decisions) and holds
  some rights over the outcome.
- Private: only the participant's own household is present.

**Cells (matched 2x2).**
- C1 high agency, shared.
- C2 high agency, private.
- C3 low agency, shared.
- C4 low agency, private.

**Held-constant outcome.** Unfavourable, severity-matched across all four. Personalised to the
participant's stated preferred temperature via `scripts/discomfort_calibrate.py`. See
`discomfort-calibration.md`. The outcome valence is held constant so that differences between
cells are attributable to the axes, not the result (this also protects the agency reading from
Tajima et al.'s outcome bias on perceived agency).

**Dependent variables and measurement map.** See `measurement-map.md`. In short: outcome
favorability (VAS), trust (S-TIAS 0-7), procedural fairness (3 items, agency-gated
affordances), distributive fairness (2 items), acceptance (3 items), believability, plus the
agency and community manipulation checks.

**Hypotheses the prototypes must keep testable.**
- H1 baseline: the outcome reads as unfavourable in all four (favorability item low).
- H2 community main effect: shared cells should be able to score higher on distributive
  fairness and acceptance, so the shared cells must make the collective legitimacy visible.
- H3 buffering / community contrast: the shared cells must make others' needs and the
  collective stake legible enough that a low-agency-but-shared cell (C3) can still feel
  acceptable.
- Manipulation checks H5/H6: the agency and community differences must be perceptible.

## Template (copy this to define a new study or swap an axis)

```
Domain / scenario seed: <one paragraph: who, when, what AI decides, why the outcome is
  unfavourable>

Axis 1 - <name> (grounding: <citations>):
  Definition: <what the construct is>
  Operationalisation: <how it shows up on screen>
  High / present level: <interaction pattern + visible cues>
  Low / absent level: <interaction pattern + visible cues>

Axis 2 - <name> (grounding: <citations>):
  Definition:
  Operationalisation:
  High / present level:
  Low / absent level:

Cells (matched 2x2): C1 = A-high B-high; C2 = A-high B-low; C3 = A-low B-high; C4 = A-low B-low

Held-constant outcome: <the unfavourable result; what makes it felt; how it is personalised;
  how felt severity is matched across cells>

Dependent variables: <list>
Measurement map: <item -> on-screen hook> for each item (fill measurement-map.md)
Hypotheses to keep testable: <list, each with which cells / DVs it touches>
```

## Rule when swapping an axis

Re-derive, do not rename. A swapped axis changes the interaction flow and the measurement
hooks, so re-run Stage 1 and rewrite `measurement-map.md`. Keep the matched-2x2 discipline:
whatever the two axes are, each matched pair must differ on exactly one of them.
