#!/usr/bin/env python3
"""Automated parts of the Stage 4 grill checklist for one prototype cell.

This does not replace the human/model read of the grill checklist (contradiction quality,
believability, felt discomfort all need judgement). It catches the mechanical failures fast:
too much text, no single obvious action, and a measurement hook that is present when it should
be absent or vice versa.

Convention the cell template follows:
- The single primary action carries data-role="primary".
- Measurement hooks carry data-hook="voice" | "appeal" | "arki-info" | "others-needs" | "commit".
- Body copy that counts toward the text budget is outside any element marked data-chrome
  (chrome = persistent labels/nav that should not be penalised).

Usage:
    python check_prototype.py C1.html --agency high --community shared
    python check_prototype.py C4.html --agency low --community private --budget 120
"""
import argparse
import re
import sys

DEFAULT_TEXT_BUDGET = 120  # words of body copy per screen; low-text is a core principle

# Which measurement hooks must be PRESENT given the cell's levels. Absence-where-required and
# presence-where-forbidden are both failures, because they leak the manipulation.
REQUIRED_BY_AGENCY = {
    "high": ["voice", "appeal", "arki-info"],   # procedural-fairness affordances
    "low": [],
}
FORBIDDEN_BY_AGENCY = {
    "high": [],
    "low": ["voice", "appeal"],  # a low-agency cell must not expose a real voice/appeal flow
}
REQUIRED_BY_COMMUNITY = {
    "shared": ["others-needs"],
    "private": [],
}
FORBIDDEN_BY_COMMUNITY = {
    "shared": [],
    "private": ["others-needs"],
}


def strip_tags(html):
    html = re.sub(r"<script.*?</script>", " ", html, flags=re.DOTALL)
    html = re.sub(r"<style.*?</style>", " ", html, flags=re.DOTALL)
    # The text budget is about MAIN-FLOW copy. Collapsed <details> hold optional context and
    # persistent chrome (labels/nav) is not "narration", so neither counts toward the budget.
    html = re.sub(r"<details.*?</details>", " ", html, flags=re.DOTALL)
    # A top bar / app header is persistent chrome (brand, status pills), not body copy.
    html = re.sub(r"<header.*?</header>", " ", html, flags=re.DOTALL)
    html = re.sub(r'<[^>]*data-chrome[^>]*>.*?</[^>]+>', " ", html, flags=re.DOTALL)
    html = re.sub(r"<[^>]+>", " ", html)
    return re.sub(r"\s+", " ", html).strip()


def hooks_present(html):
    return set(re.findall(r'data-hook=["\']([a-z\-]+)["\']', html))


def count_primary(html):
    return len(re.findall(r'data-role=["\']primary["\']', html))


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("file")
    ap.add_argument("--agency", choices=["high", "low"], required=True)
    ap.add_argument("--community", choices=["shared", "private"], required=True)
    ap.add_argument("--budget", type=int, default=DEFAULT_TEXT_BUDGET)
    args = ap.parse_args()

    with open(args.file, encoding="utf-8") as f:
        html = f.read()

    # Strip HTML comments before counting. Comments hold guidance text and the AXIS markers;
    # neither should count toward primary actions, hooks, or the text budget. (The confound
    # check in matched_pairs_diff.py reads the original file, so the markers there are intact.)
    html = re.sub(r"<!--.*?-->", " ", html, flags=re.DOTALL)

    failures = []
    warnings = []

    # 1. text budget
    words = len(strip_tags(html).split())
    if words > args.budget:
        failures.append(f"text budget: {words} words of body copy > budget {args.budget}. "
                        f"Move context into the interface or behind a details affordance.")

    # 2. one core function
    n_primary = count_primary(html)
    if n_primary == 0:
        failures.append("no element marked data-role=\"primary\": the single core action is "
                        "not identifiable.")
    elif n_primary > 1:
        failures.append(f"{n_primary} elements marked data-role=\"primary\": there must be "
                        f"exactly one dominant action per screen.")

    # 3. measurement hooks present/absent by level
    present = hooks_present(html)
    for hook in REQUIRED_BY_AGENCY[args.agency] + REQUIRED_BY_COMMUNITY[args.community]:
        if hook not in present:
            failures.append(f"missing required hook data-hook=\"{hook}\" for "
                            f"agency={args.agency}/community={args.community}.")
    for hook in FORBIDDEN_BY_AGENCY[args.agency] + FORBIDDEN_BY_COMMUNITY[args.community]:
        if hook in present:
            failures.append(f"forbidden hook data-hook=\"{hook}\" present in a "
                            f"{args.agency}-agency/{args.community} cell: the manipulation leaks.")

    # 4. light hardcoded-colour smell test (prefer design-system tokens for consistency)
    inline_colours = re.findall(r'style=["\'][^"\']*(?:color|background)\s*:\s*#', html)
    if inline_colours:
        warnings.append(f"{len(inline_colours)} inline colour(s) found. Prefer design-system "
                        f"tokens so cells stay visually identical and contrast stays controlled.")

    print(f"== {args.file}  (agency={args.agency}, community={args.community}) ==")
    print(f"body words: {words} / {args.budget}    primary actions: {n_primary}    "
          f"hooks: {sorted(present) or 'none'}")
    for w in warnings:
        print(f"  WARN: {w}")
    if failures:
        for fmsg in failures:
            print(f"  FAIL: {fmsg}")
        print(f"\n{len(failures)} failure(s). Fix and re-run.")
        return 1
    print("  PASS (mechanical checks). Still do the human read: contradiction, believability, "
          "felt discomfort, accessibility.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
