# Measurement map

Every questionnaire item must have a matching element on the screen, or it measures nothing.
This file maps the default cooling study's Phase 1 instrument to the UI hooks each item needs,
and marks which hooks are present or absent by cell. When you swap an axis, rewrite this file
for the new instrument.

## The rule

For each item, ask: "What on the screen makes this item answerable, and in which cells does
that thing exist?" If the answer is "nothing", either add the hook or cut the item. An item
that is constant across all cells (like trust, by design) still needs its hook present
everywhere so the score is meaningful; it just should not vary.

## Default study: item -> hook

| Item (Phase 1) | Scale | On-screen hook | Present in |
|---|---|---|---|
| Outcome favorability: "result vs your preference" | VAS 0-100 | The personalised outcome shown against the intake preferred temp | all cells |
| Trust (S-TIAS): confident in / reliable / can trust ARKI | 0-7 | ARKI's stated reasoning + reliability cues (how it decided), identical wording everywhere | all cells (held constant; expected sticky DV) |
| Procedural fairness: "I could express my views" | 1-5 | A voice / input control (set, comment, state your situation) | high-agency cells only (C1, C2) |
| Procedural fairness: "I could appeal" | 1-5 | An appeal / override affordance | high-agency cells only |
| Procedural fairness: "based on accurate info about me" | 1-5 | A visible "what ARKI used about you" panel | high-agency cells expose it; low-agency cells show decision already made |
| Distributive fairness: "reflects my needs" / "limit is justified" | 1-5 | The allocation rationale; in shared cells, others' needs/claims alongside | rationale everywhere; others' needs in shared cells (C1, C3) |
| Acceptance: appropriate / I accept / willing to live with | 1-5 | The commit / accept moment (a clear primary action that finalises the outcome) | all cells |
| Believability: "real system in 2035" | 1-7 | Overall design-fiction fidelity | all cells |
| Agency manipulation check: "I was in control" | 1-7 | Axis fidelity (Gomez pattern) | varies by agency level (by design) |
| Community manipulation check: "own vs shared situation" | bipolar | Axis fidelity (building view present/absent) | varies by community level (by design) |
| RQ2 open: "I most often decided based on ___" | open | none (post-task reflection) | after all four |
| Forced choice: which would you live with | A/B/C/D | none (post-task) | after all four |

## The procedural-fairness items are the sharp ones

These three items are the clearest case of "item needs an affordance". They are essentially a
read-out of the agency manipulation:
- "express my views" -> is there a way to say what you want? High-agency: yes. Low-agency: no.
- "appeal" -> is there an appeal/override? High-agency: yes. Low-agency: at most a request that
  does not change the operative plan.
- "accurate info about me" -> can you see and correct what ARKI knows? High-agency: a visible,
  possibly editable panel. Low-agency: the decision is already made on that info.

If a low-agency cell accidentally exposes a full appeal flow, the agency manipulation leaks and
the procedural-fairness scores will not separate. The grill checklist verifies this.

## Trust is deliberately constant

Following Esch et al. (2025), trust behaves as a slow, process-facing assessment that tends not
to move with a single contextual manipulation. So the trust hook (ARKI's reasoning and
reliability cues) is identical across all four cells on purpose. A flat trust result is a
finding consistent with that, not a bug. Do not let trust cues drift between cells.

## When you swap an axis

Throw this table away and rebuild it for the new instrument. The method is the same: list every
item, name the hook, mark presence by cell, and make sure the manipulated axis is the thing
that turns the relevant hooks on and off.
