#!/usr/bin/env python3
"""Confirm that two prototype cells differ ONLY on the axis they are supposed to differ on.

This is the confound check. If C1 and C2 are meant to differ only in "community", then after we
remove the community-specific regions from both files, what remains must be identical. Anything
left over is an uncontrolled difference, i.e. a confound that makes any result uninterpretable.

How it works: cell templates wrap axis-specific regions in HTML comment markers, e.g.

    <!--AXIS:community:start--> ...building view... <!--AXIS:community:end-->
    <!--AXIS:agency:start--> ...appeal control... <!--AXIS:agency:end-->

To compare a pair that differs in "community", we strip the community regions from both files,
normalise whitespace, and diff the rest. A clean pair produces no diff.

Usage:
    python matched_pairs_diff.py C1.html C2.html --axis community
    python matched_pairs_diff.py C1.html C3.html --axis agency
"""
import argparse
import re
import sys
import difflib


def strip_axis_regions(html, axis):
    """Remove every <!--AXIS:<axis>:start--> ... <!--AXIS:<axis>:end--> region."""
    pattern = re.compile(
        r"<!--AXIS:" + re.escape(axis) + r":start-->.*?<!--AXIS:" + re.escape(axis) + r":end-->",
        re.DOTALL,
    )
    return pattern.sub("", html)


def normalise(html):
    """Collapse whitespace so trivial formatting differences do not count as confounds."""
    html = re.sub(r"\s+", " ", html)
    return html.strip()


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("file_a")
    ap.add_argument("file_b")
    ap.add_argument("--axis", required=True,
                    help="the axis this pair is allowed to differ on (e.g. community, agency)")
    args = ap.parse_args()

    with open(args.file_a, encoding="utf-8") as f:
        a = f.read()
    with open(args.file_b, encoding="utf-8") as f:
        b = f.read()

    a_stripped = normalise(strip_axis_regions(a, args.axis))
    b_stripped = normalise(strip_axis_regions(b, args.axis))

    if a_stripped == b_stripped:
        print(f"PASS: outside the '{args.axis}' regions, {args.file_a} and {args.file_b} are "
              f"identical. No confound.")
        return 0

    print(f"FAIL: after removing the '{args.axis}' regions, the two cells still differ. "
          f"That difference is a confound. Diff (a vs b):\n")
    # Show a compact word-level diff so the reviewer can find the stray difference fast.
    diff = difflib.unified_diff(
        a_stripped.split(), b_stripped.split(),
        fromfile=args.file_a, tofile=args.file_b, lineterm="", n=3,
    )
    shown = 0
    for line in diff:
        print(line)
        shown += 1
        if shown > 200:
            print("... (diff truncated)")
            break
    print("\nFix: either move the difference inside an <!--AXIS:" + args.axis +
          ":...--> region (if it belongs to this axis) or make it identical across the pair.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
