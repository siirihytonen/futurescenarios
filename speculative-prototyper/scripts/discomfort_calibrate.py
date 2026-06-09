#!/usr/bin/env python3
"""Turn a participant's preferred indoor temperature into a felt, personalised, unfavourable
cooling outcome for the study prototypes.

Why this exists: a flat "+3 C" is too mild (preferred 22 -> 25 C reads as a normal AC
setpoint), and people's comfort points differ, so the same delta is misery for one participant
and a shrug for another. Calibrate to a felt threshold, not a fixed number. See
references/discomfort-calibration.md.

Usage:
    python discomfort_calibrate.py --preferred 22
    python discomfort_calibrate.py --preferred 21 --min-delta 5 --threshold 27 --json
"""
import argparse
import json

# Defaults reflect the design guidance: target the constrained window in the 27-29 C band, and
# never let the felt distance from the participant's own preference fall below MIN_DELTA.
DEFAULT_THRESHOLD = 27.0   # lower edge of "too hot to be comfortable" for most people
DEFAULT_MIN_DELTA = 5.0    # minimum felt distance from preferred, in C
HARD_CAP = 30.0            # do not push the imagined indoor temp past this

CONSEQUENCES = [
    "a hot night before an early shift",
    "the flat will not cool down before you get home",
    "the dog is alone in the warm flat through the afternoon",
    "trying to get a child to sleep in the heat",
]


def calibrate(preferred, min_delta=DEFAULT_MIN_DELTA, threshold=DEFAULT_THRESHOLD,
              hard_cap=HARD_CAP):
    """Return the constrained-window temperature and metadata for one participant.

    The constrained window is the larger of (preferred + min_delta) and the comfort threshold,
    capped at hard_cap. Felt distance is how far that sits from the participant's own preference,
    which is the thing we hold matched across cells.
    """
    target = max(preferred + min_delta, threshold)
    constrained = min(target, hard_cap)
    felt_distance = round(constrained - preferred, 1)
    fan_only = constrained >= hard_cap  # at the cap, prefer a fan-only framing over a number
    return {
        "preferred_c": preferred,
        "constrained_window_c": round(constrained, 1),
        "felt_distance_c": felt_distance,
        "mechanism": "fan-only at peak" if fan_only else f"hold at {round(constrained,1)} C",
        "suggested_consequences": CONSEQUENCES,
        "favorability_expectation": "low (this is the H1 check; pilot against the VAS)",
        "note": ("Hold felt_distance_c matched across all four cells. What differs between "
                 "cells is who decides and who is present, never how much heat."),
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--preferred", type=float, required=True,
                    help="participant's stated preferred indoor temperature, in C")
    ap.add_argument("--min-delta", type=float, default=DEFAULT_MIN_DELTA,
                    help=f"minimum felt distance from preferred (default {DEFAULT_MIN_DELTA})")
    ap.add_argument("--threshold", type=float, default=DEFAULT_THRESHOLD,
                    help=f"comfort threshold floor (default {DEFAULT_THRESHOLD})")
    ap.add_argument("--json", action="store_true", help="print JSON only")
    args = ap.parse_args()

    result = calibrate(args.preferred, args.min_delta, args.threshold)
    if args.json:
        print(json.dumps(result, indent=2))
        return
    print(f"Preferred:            {result['preferred_c']} C")
    print(f"Constrained window:   {result['constrained_window_c']} C  ({result['mechanism']})")
    print(f"Felt distance:        {result['felt_distance_c']} C  (hold this matched across cells)")
    print(f"Favorability:         {result['favorability_expectation']}")
    print("Suggested consequence (pick one, make it concrete):")
    for c in result["suggested_consequences"]:
        print(f"  - {c}")


if __name__ == "__main__":
    main()
