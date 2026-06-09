---
name: speculative-prototyper
description: >-
  Generates study-fit speculative-future HTML prototypes for HCI/UX research: a matched 2x2
  (or axis-swappable) set of interactive mockups with design-fiction scenarios, built-in
  contradictions, calibrated discomfort, a pre-task preference intake, a shared design system,
  and a validation gate so each prototype is actually measurable against the study's
  hypotheses. Use this whenever the user wants to build, generate, fix, or improve interactive
  prototypes or mockups for a user study, speculative-design probes, design-fiction scenarios,
  a 2x2 condition design, or A/B/C/D experimental UI conditions, even if they only say "make
  the prototypes" or mention cells, conditions, futures, or framing manipulations rather than
  naming this skill. Especially relevant when the prototypes must be measurable against
  hypotheses, must vary on specific axes while holding everything else constant, or when the
  user complains their current prototypes are inconsistent, too wordy, or do not let them
  study what they intend.
---

# Speculative prototyper

Turn a research intent into a matched set of interactive HTML+ react prototypes that a study can
actually measure. The hard part of research prototypes is not making them look good; it is
making them *differ only on the variables you are testing*, *fail in a way that is felt*, and
*expose a hook for every measure you will collect*. This skill keeps those three things honest.

## When this applies

A user is running (or piloting) a study where participants compare several UI conditions, and
the prototypes have to support a measurement instrument and a set of hypotheses. The default
worked example is a 2x2 of **agency x community** for an AI cooling-allocator, but the two axes
are swappable. If the user has only one condition, or wants production UI rather than study
stimuli, this skill is the wrong tool; say so.

## The non-negotiables (why this skill exists)

These three failures are what make research prototypes useless, and each maps to a stage below.

1. **Confounds.** If cell A and cell B differ in more than the one axis you are manipulating,
   any result is uninterpretable. The matched-pairs discipline (Stage 3) and
   `scripts/matched_pairs_diff.py` exist to catch this.
2. **An outcome that is not felt.** A study about accepting an unwanted decision dies if the
   "unwanted" outcome reads as fine. Calibrated, personalised discomfort (Stage 2,
   `references/discomfort-calibration.md`) exists to catch this.
3. **A measure with no hook.** If your questionnaire asks "I could appeal the decision" but no
   cell has an appeal affordance, the item measures nothing. The measurement map (Stage 1,
   `references/measurement-map.md`) ties every item to an on-screen element.

## Inputs: the study config

Everything the generator needs lives in one config. The default is the cooling study; to run a
different study or swap an axis, copy and edit `references/study-config.md`. A config has:

- Domain and scenario seed.
- Two axes, each with a name, a definition, an **operationalisation** (how it shows up on
  screen), two levels, and a grounding citation.
- The cells (matched 2x2).
- Hypotheses, dependent variables, and a measurement map (item -> on-screen hook).
- The held-constant outcome and its discomfort calibration.

## Workflow (staged, with checkpoints)

Do not skip the checkpoints. The whole point is to catch a broken design before you have built
four copies of it.

**Stage 0 - Load the config.** Read `references/study-config.md` (and, for the default study,
the source rules in `~/.claude/plans/functional-riding-pizza.md`). Confirm with the user: the
two axes and their levels, the dependent variables, and the held-constant outcome.

**Stage 1 - Design reasoning (ProtoFlow logic).** Translate intent into a concrete interaction
flow. For each axis level, name the interaction pattern (for agency, use the Gomez mapping in
`references/matched-2x2-rules.md`) and the **single core function** of each screen. Use
`anthropic-skills:ux-designer` to pressure-test the flow, the information architecture, and the
single-core-function decision for usability before anything is built. Produce a flow spec and a
measurement map (`references/measurement-map.md`). **Checkpoint: show the user the flow + map
and get approval before building anything.**

**Stage 2 - Design-fiction scenario.** Build the world. Read `references/design-fiction.md`.
Two demands here that a model tends to skip:
- Build a real **contradiction** with no clean answer (your comfort vs a neighbour's medical
  need; your control vs the grid; fairness-to-you vs fairness-to-all). A bland scenario yields
  a bland focus group.
- **Calibrate the discomfort** (`references/discomfort-calibration.md`). Personalise it to the
  participant's stated preferred temperature and make sure it crosses a felt threshold. A flat
  "+3 degrees" is usually too mild.
  **Checkpoint: show the user the scenario and its contradiction and get approval.**

**Stage 3 - Build.** Generate `assets/design-system.css` first, then the intake screen, then
the cells from `assets/cell-template.html`, all importing the shared system. Hold the line on
the design principles below. For the look and feel, lean on the dedicated design skills:
`anthropic-skills:ui-designer` for visual craft (typography, spacing, colour, hierarchy,
shadows, the shared design system itself) and `anthropic-skills:ux-designer` for the flow and
usability of the core action. Then run `design:accessibility-review` for the a11y pass. The
study constraints still win where they conflict: consistency across cells and the matched-2x2
discipline are not negotiable, so apply the design skills *within* those limits (polish the
shared system once, not per cell).

**Stage 4 - Grill.** Run `references/grill-checklist.md` against every cell. Run
`scripts/check_prototype.py` and `scripts/matched_pairs_diff.py` for the parts a script can
verify. Fix and re-run until it passes. When in doubt about whether a prototype actually lets
the user study what they intend, invoke `anthropic-skills:grill-me` on it.

**Stage 5 - Package.** Output: the intake screen, the cells, the measurement map, a
manipulation-check summary (what changes between which cells), and the accessibility report.

## Design principles (these fix the three usual complaints)

- **Consistency.** All cells import the same design system and the same layout skeleton. Only
  the blocks the axes touch may differ. This is what kills cross-cell drift.
- **Low text.** Set a text budget per screen. Show context through the interface; do not
  narrate it. Anything explanatory goes behind an optional "details / how this works"
  affordance, not in the main flow.
- **One core function per screen.** Each cell has exactly one visually dominant action (set,
  accept, or respond). Everything else is secondary and quieter. If a first-time user cannot
  tell what the one action is within a few seconds, the screen has failed.
- **Measurability.** Every dependent variable has a concrete on-screen moment that elicits it.
  No orphan items, no orphan affordances.

## Swapping the axes

The config is parameterised. To swap an axis, the user gives a new name, definition,
operationalisation, two levels, and grounding. Re-run Stage 1 (the flow and the measurement map
change), then Stages 2-5. Keep the matched-2x2 discipline whatever the axes are. The default
config stays the cooling study so there is always a worked example to copy.

## Reference map

- `references/study-config.md` - the default config and the template to copy for a new study.
- `references/matched-2x2-rules.md` - only-axes-vary discipline, severity matching,
  counterbalancing, and the Gomez interaction-pattern mapping for the agency axis.
- `references/design-fiction.md` - pastiche, contradiction-building, anti-solutionism.
- `references/discomfort-calibration.md` - turning a preferred temperature into a felt,
  personalised, matched sacrifice.
- `references/measurement-map.md` - every questionnaire item mapped to the UI element it needs.
- `references/grill-checklist.md` - the Stage 4 gate.
- `scripts/` - `discomfort_calibrate.py`, `matched_pairs_diff.py`, `check_prototype.py`.
- `assets/` - `design-system.css`, `intake-template.html`, `cell-template.html`.
