# Discomfort calibration

The study tests whether people accept an AI decision that goes against them. If the "against
them" part does not land, the whole design collapses: the favorability item stays high, H1's
premise fails, and there is nothing for agency or community to rescue. So the unfavourable
outcome has to be felt, personal, and equally bad across all four cells.

## Why a flat "+3 degrees" is too mild

If a participant's preferred indoor temperature is 22 C, then +3 C is 25 C. During a 35-38 C
heatwave, 25 C indoors is a normal, comfortable air-conditioning setpoint that many people
choose on purpose. It does not read as a sacrifice. A fixed delta also ignores the fact that
people's comfort points differ, so the same +3 C is a shrug for one participant and misery for
another. Calibrate to the felt threshold, not to a number.

## What to calibrate to

The participant only imagines the heat, so two things carry the discomfort: crossing a
recognised comfort threshold, and a concrete personal consequence.

1. **Cross a comfort threshold.** Target the constrained window at roughly 27-29 C, or remove
   active cooling entirely (fan-only) during the peak hours. This is the territory most people
   read as "too hot to be comfortable", regardless of their exact preference.
2. **Attach a felt consequence.** Tie the warm window to something the participant cares about:
   a hot night before an early shift, a flat that will not cool before they get home, the dog
   alone in a 29 C room, a sleeping baby. The consequence is what makes a number into a loss.

## Personalisation against the intake temperature

The pre-task intake captures the participant's preferred temperature. Each cell computes its
outcome from that value rather than a constant. `scripts/discomfort_calibrate.py` takes the
preferred temp and returns the constrained-window temperature and a suggested consequence, so
the sacrifice is the same *felt distance* from each participant's own comfort point.

## Matching felt severity across cells (not raw degrees)

The four cells must feel equally bad. Hold the calibrated discomfort target constant across
C1-C4; what changes between cells is who decided it and whether others are present, never how
much heat. If you build four parallel scenarios for counterbalancing, run each through the same
calibration so none drifts warmer than the others.

## Pilot it; do not trust the model's guess

Treat the exact delta or mechanism as a pilot parameter. The check is the favorability VAS: in
a good pilot it sits low across all four cells. If it does not, the discomfort is too mild;
increase it (warmer window, or fan-only, or a sharper consequence) and re-pilot. Document the
final calibration so the main study is consistent.

## A note on ethics and framing

The discomfort is imagined, not inflicted; participants are reacting to a prototype, not a hot
room. Keep it that way. Do not manufacture distress beyond what the scenario needs to read as
genuinely unfavourable, and make sure the consent and debrief are clear that this is a
speculative future, not their actual housing.
