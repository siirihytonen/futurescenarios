# Plan: build a skill that generates study-fit speculative prototypes

## Context

The thesis study (agency × community framing → acceptance/fairness/trust of an unfavourable
AI cooling-allocation decision, four prototypes C1–C4, within-subjects + focus groups) needs
better prototypes. The current C1–C4 mockups have three concrete problems the user named:
(1) they lack the functionality to actually measure the hypotheses, (2) the UI drifts /
is inconsistent across the four, (3) too much text/context and the core interactive function
is unclear. The full prototype requirements already exist in
`~/.claude/plans/functional-riding-pizza.md` (matched-2×2 discipline, severity-matched
scenarios, Gomez interaction patterns for agency, the five fixes).

We are building a reusable skill that generates these prototypes correctly. No off-the-shelf
skill fits (find-skills surfaced only low-install creative-writing/mockup skills). The skill
orchestrates strong already-installed skills and encodes the study's methodological rules.

User decisions (this session):
- Workflow = STAGED with checkpoints (ProtoFlow: intent → flow → scenario → build → grill).
- Scope = GENERAL generator, with the agency×community cooling study as the default config;
  axis-swap is first-class and re-derives manipulation + measurement hooks.
- Output = SHARED design system + per-cell files (one CSS token/component layer all cells
  import, so UI is identical except the parts the two axes deliberately change).

## Skill: `speculative-prototyper` (working name)

A staged generator that turns a study config (domain + two axes + hypotheses + held-constant
outcome) into a matched set of measurable, low-text, accessible speculative-future HTML
prototypes, validated by an internal grill checklist.

### Inputs — the study config (default = cooling study; swappable)
- Domain + scenario seed (default: AI cooling allocation, heatwave, 2035).
- Two AXES, each with: name, definition, operationalization (how it's manipulated on screen),
  two levels, grounding. Default: Agency (Gomez patterns: high = user-guided adjustments /
  AI-follow; low = AI-first) × Community (shared building visible + rights vs private).
- Cells = matched 2×2 = four prototypes.
- Hypotheses + DVs (acceptance, fairness, trust) + a MEASUREMENT MAP (which on-screen
  moment/element elicits which DV).
- Held-constant outcome: unfavourable, severity-matched across cells. NOT a flat +3°C
  (too mild; 25°C reads as a normal setpoint). The skill runs a DISCOMFORT-CALIBRATION
  step: pick a delta/mechanism that clearly crosses a thermal-comfort threshold (constrained
  window ≈ 27–29°C, or fan-only at peak) AND attaches a concrete personal consequence
  (hot night before an early shift; dog alone in a 29°C flat). Hold FELT severity matched
  across cells, not raw °C. Personalised against the participant's stated preferred temp.

### Staged workflow (the skill's procedure)
- Stage 0 — Load config. Read study rules from `functional-riding-pizza.md` + the skill's
  default config. Confirm axes, hypotheses, DVs, held-constant outcome.
- Stage 1 — ProtoFlow design reasoning (Kim et al. 2026 logic). Translate research intent
  into a concrete interaction flow: per axis level derive the Gomez pattern and the ONE core
  function per screen; produce a flow spec + measurement map. CHECKPOINT: user approves flow.
- Stage 2 — Design-fiction scenario (Blythe 2023 pastiche + Ek et al. 2024 anti-solutionism).
  Build the severity-matched 2035 world; borrow believable near-future tropes but inject
  sociotechnical friction so it is not solutionist. The scenario must be INTERESTING and
  built on real CONTRADICTIONS, not bland. The skill explicitly generates ≥1 genuine tension
  per scenario, e.g.: your comfort vs a neighbour's medical need; your control vs the grid
  staying up; fairness-to-you vs fairness-to-all; short-term relief vs the building's reserve.
  Contradictions must have no clean answer (that is what drives focus-group discussion).
  Run the DISCOMFORT-CALIBRATION here (see held-constant outcome) and make the felt loss
  vivid and personal. CHECKPOINT: user approves scenario + its contradiction(s).
- Stage 3 — Build. Generate the SHARED design system (tokens + components) first, then four
  per-cell HTML files that import it. Enforce: only the two axes vary; UI consistent; low
  text; one clear core function. Apply ui-designer (visual craft) + ux-designer (flow/usability)
  + accessibility-review for the look, within the consistency/matched-2x2 constraints.
- Stage 4 — Grill validation. Run the grill checklist against each prototype; flag failures;
  iterate until pass.
- Stage 5 — Output package: four prototypes + measurement map + manipulation-check summary +
  accessibility report.

### Pre-preferred-temperature window + personalisation
Before the four prototypes, an intake screen captures the participant's preferred indoor temp
(and the felt-discomfort point). Every prototype is parameterised against that value: the
unfavourable outcome and its consequence are computed per participant (preferred temp →
calibrated constrained window), so the sacrifice is personal and reliably felt, not a generic
number. The skill emits this intake screen plus the personalisation logic the cells share.

### Measurement map (aligned to the current Phase 1 items + Phase 2 blocks)
Each Phase 1 item must have a matching on-screen hook, present or absent by cell. The skill
generates the UI element that each item interrogates, and the grill step checks it exists:
- Favorability VAS ("result vs your preference") → personalised outcome vs the intake temp.
- Trust (S-TIAS, 0–7) → ARKI's stated reasoning + reliability cues, identical across cells
  (expected sticky DV).
- Procedural fairness (3 items) → these are AFFORDANCES the agency axis turns on/off:
  "express my views" = a voice/input mechanism; "appeal" = an appeal/override affordance;
  "based on accurate information" = a visible "what ARKI used about you" panel. High-agency
  cells expose these; low-agency cells show the decision already made.
- Distributive fairness (2 items) → the allocation rationale + (in shared cells) others'
  needs/claims.
- Acceptance (3 items, incl. "willing to live with") → the commit/accept moment.
- Believability (1–7) + agency manip check + community manip check → handled by axis fidelity
  and the 2035 design fiction.
- RQ2 open field ("I most often decided based on ___") + forced choice → no UI, post-set.
Phase 2 blocks (map/control/community/sustainability/method) are served by the same hooks:
the contradiction (Stage 2) is what powers Block 3's deliberation and the fairness ranking.

### Grill checklist (the "ensure the outcome is correct" gate)
Per prototype: (1) Core function completable by a first-time user in ≤ a few seconds without
reading body text. (2) Outcome clearly unfavourable: crosses a comfort threshold (not a mild
+3°C), personalised to the intake temp, with a vivid personal consequence; FELT severity
matched across cells. (3) Every Phase 1 item has its on-screen hook — voice / appeal /
"what ARKI used about you" present in high-agency cells and absent in low-agency ones,
others' needs visible in shared cells. (4) Matched pairs: C1/C2 and C3/C4 differ ONLY in
community; C1/C3 and C2/C4 differ ONLY in agency. (5) Text under budget; context shown via UI
or an optional details affordance, not narrated. (6) Axis fidelity: agency level matches the
intended Gomez pattern; community presence clean. (7) Believable 2035 AND carries ≥1 genuine
contradiction with no clean answer. (8) Accessibility baseline: contrast, keyboard, labels,
focus order. (9) Personalisation wired: the unfavourable outcome computes from the intake
preferred temp, not a fixed constant.

### Design principles the skill enforces (fixes the three complaints)
- Consistency: shared design system; identical layout skeleton; only manipulated parts differ.
- Low text: per-screen text budget; "show via the interface, don't narrate"; context behind
  an optional "details"/"how this works" affordance.
- One clear core function: each prototype has exactly one visually dominant primary action
  (set / accept / respond); everything else is secondary.
- Measurability: the measurement map ties each UI element to a DV/hypothesis.

### Axis-swap
Config is parameterized. To swap an axis the user supplies name + definition +
operationalization + two levels + grounding. The skill re-runs Stage 1 (flow), re-derives the
manipulation and the measurement hooks, and preserves the matched-2×2 discipline. Default
config stays the cooling study.

## Files to create — skill-creator anatomy (skill at `~/.claude/skills/speculative-prototyper/`)

Built with `anthropic-skills:skill-creator` (draft → test → review → iterate → package),
following progressive disclosure: lean SKILL.md body, detail in `references/`, deterministic
work in `scripts/`, output templates in `assets/`.

`SKILL.md` (frontmatter + workflow body, target < 500 lines):
- name: `speculative-prototyper`
- description (pushy, triggers + what it does): "Generates study-fit speculative-future HTML
  prototypes for HCI/UX research — a matched 2×2 (or axis-swappable) set of interactive mockups
  with design-fiction scenarios, built-in contradictions, calibrated discomfort, a pre-task
  preference intake, a shared design system, and a grill-me validation gate so each prototype is
  actually measurable against the study's hypotheses. Use whenever the user wants to build,
  generate, or fix interactive prototypes / mockups for a user study, speculative-design probes,
  design-fiction scenarios, a 2×2 condition design, or A/B/C/D experimental UI conditions — even
  if they just say 'make the prototypes' or mention cells / conditions / futures."
- body: the 6 stages, design principles, the grill gate, pointers into references/.

`references/` (loaded as needed):
- `study-config.md` — cooling study default config (axes + operationalisation, scenario,
  hypotheses, Phase 1 item → on-screen hook map). The template a user copies to swap axes.
- `matched-2x2-rules.md` — only-axes-vary, severity-matched scenarios, counterbalancing,
  Gomez pattern → agency-level mapping.
- `design-fiction.md` — pastiche + contradiction-generation + anti-solutionism / friction.
- `discomfort-calibration.md` — preferred-temp → constrained window + felt consequence; why
  flat +3°C is too mild; pilot against the favorability VAS.
- `measurement-map.md` — Phase 1 items (favorability VAS, S-TIAS trust, procedural/distributive
  fairness, acceptance, believability, manip checks) → which UI element each needs.
- `grill-checklist.md` — the Stage 4 validation checklist.

`scripts/` (deterministic, so each run doesn't re-derive):
- `discomfort_calibrate.py` — preferred temp → personalised unfavourable outcome per cell.
- `matched_pairs_diff.py` — diff two cells' markup; assert only the manipulated blocks differ.
- `check_prototype.py` — automated parts of the grill (text budget, contrast, presence/absence
  of required affordances per cell).

`assets/` (used in output):
- `design-system.css` — shared tokens + components (consistency + a11y defaults).
- `intake-template.html` — pre-preferred-temperature screen.
- `cell-template.html` — per-cell skeleton that imports the design system.

## Reuse (do not reinvent)
- `anthropic-skills:web-artifacts-builder` / `anthropic-skills:frontend` — Stage 3 build.
- `anthropic-skills:ui-designer` — Stage 3 visual craft / look.
- `anthropic-skills:ux-designer` — Stage 1 flow check + Stage 3 usability of the core action.
- `design:accessibility-review` — Stage 3/4 a11y pass.
- `anthropic-skills:grill-me` — Stage 4 validation (skill embeds its own checklist too).
- `design:user-research` — measurement-map / method alignment.
- `anthropic-skills:skill-creator` — used to scaffold and lint this skill during build.
- Study rules source: `~/.claude/plans/functional-riding-pizza.md`.

## Build process (skill-creator loop)
1. Draft `SKILL.md` + references/scripts/assets per the anatomy above.
2. Write 2–3 realistic test prompts to `evals/evals.json` (e.g., "make my four cooling
   prototypes", "swap the agency axis for transparency", "my prototypes have too much text and
   the core action is unclear, fix them").
3. Run each prompt with-skill vs baseline (no skill) via subagents; capture outputs + timing.
4. Generate the eval viewer (`generate_review.py`) so the user reviews real outputs before any
   self-grading; collect feedback.
5. Iterate the skill on feedback; rerun; repeat until the user is happy.
6. Optionally run the description optimizer, then package with `package_skill.py`.

## Verification (how we'll know it works)
1. Run the skill with the default cooling config → produces an intake (pre-preferred-temp)
   screen + 4 prototypes + measurement map + a11y report.
2. Intake personalisation: set preferred temp, confirm each cell's unfavourable outcome and
   its consequence recompute from that value (not a fixed constant) and cross a comfort
   threshold (warm/uncomfortable, not a normal 25°C setpoint).
3. Open all four: each has one obvious core action; matched pairs differ only on the intended
   axis (diff the markup); each scenario carries ≥1 real contradiction with no clean answer.
4. Item-hook check: every Phase 1 item has its on-screen hook — voice/appeal/"what ARKI used"
   present in high-agency cells, absent in low; others' needs visible in shared cells.
5. Grill checklist passes on all four.
6. Accessibility: contrast, keyboard nav, focus order, labels all pass.
7. Axis-swap smoke test: replace one axis (e.g., Agency → Transparency) and confirm the skill
   re-derives the flow + measurement hooks and still emits a clean matched 2×2.

## Open design note (answering "is +2–3°C enough?")
No, not reliably. +3°C from a 22°C preference = 25°C, a normal AC setpoint that reads as
comfortable, so the favorability item would not bottom out and H1's premise weakens. The
skill calibrates discomfort to clearly cross a comfort threshold (constrained window ≈
27–29°C, or fan-only at peak) tied to a concrete personal consequence, personalised to the
intake temp, with FELT severity matched across cells. Treat the exact delta as a pilot
parameter, checked against the favorability VAS.
