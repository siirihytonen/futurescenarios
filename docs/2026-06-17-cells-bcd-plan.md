# Plan: build cells B, C, D (distinct AI interaction patterns)

Future A is built (`lowfi/future-a.html`) and sets the shared shell, look, and copy voice. B, C,
D reuse all of that and differ in one thing: the relationship the user has with the AI. Each gets
a different interaction metaphor, not A with pieces removed.

## Held constant (do not vary)

Same as A: the editorial dashboard shell (warm paper, Newsreader + IBM Plex, flat panels), the
read-only week strip, flat 4C, the ~28° peak outcome against the saved 22° preference, the single
constant ARKI reason line (trust), the product-voice copy (labels and status, never narration),
and no scores. What varies is the rail, the one primary action, and the AI's posture.

## The four interaction metaphors

| | Metaphor | Your one act | AI posture |
|---|---|---|---|
| A dialogic (hi/shared) | negotiation | set + share, resolve a shortfall via options | a co-negotiator, speaks when there is a bind |
| B AI-follow (hi/private) | advisor on request | set, then summon suggestions for your week | dormant until you ask |
| C delegation (lo/shared) | a ballot | vote on the building's set plan | sets the plan, the building ratifies |
| D AI-first (lo/private) | a notice | acknowledge an applied allocation | decides and applies, no recourse |

Matched 2x2 still holds: A↔B and C↔D differ only in community (building vs your budget); A↔C and
B↔D differ only in agency (you set vs the AI set). The surface interactions are the expression of
those two axes.

---

## Future B — AI-follow · high agency × private — "your budget, advisor on request"

**Interaction pattern: request-driven advisor.** The screen is quiet. The AI offers nothing until
you ask. A single "Suggest options" button summons 2-3 plans for *your own week*, each with the
budget trade shown; you pick one (it sets your plan) or dismiss and keep your own. This is the
opposite of A's co-negotiation: here the AI waits, and the options are about your future-self, not
neighbours.

- **World card:** "Private cooling. Your home runs on its own weekly budget. On alert days the grid
  caps each home; you set your own. Ask for options when you want them." Saved preference 22°.
- **Main panel:** outcome 28° / preference 22° / the constant ARKI reason line / your slider (set
  tonight) / the big energy readout / a "Suggest options" button (dormant AI) / Save.
- **Suggest panel (the novelty):** 2-3 cards, e.g. "Cool tonight → Saturday 29° (in budget)",
  "Spread it evenly across the week", "Bank for the weekend". Pick → sets the slider; or dismiss.
- **Rail (private):** your weekly budget bar (75 kWh, binding), a small 6-week history, the
  personal-best line. No building, no neighbours, no pool. No "no building data" label.
- **Hooks:** voice (slider) and appeal (Suggest reshapes the plan) present; what-this-is-based-on
  card present; community absent; favorability, trust, acceptance (Save) present.
- **Matched to A:** both high agency (you set first). Only the community furniture changes: A's
  building grid + share + shortfall-negotiation become B's budget + on-request advisor.

## Future C — delegation · low agency × high community — "the building votes"

**Interaction pattern: a ballot.** The AI has already set one plan for the whole building (a
fan-only window that lands the flat at ~28°). You set nothing. Your single act is your vote, and a
live quorum moves as flats decide. The building grid is now a tally of votes, not allocations.

- **World card:** "Building cooling plan. On alert days ARKI sets one plan for all 14 flats. It
  takes effect when 9 accept. You can accept, add a note, or call a review." Saved preference 22°.
- **Main panel:** outcome 28° (via the building fan-only window) / the constant ARKI reason line /
  ARKI's set plan stated plainly / the quorum status ("6 of 9 needed, closes 20:00") / the actions:
  **Accept · Accept with note · Decline & call review**. No slider.
- **Rail (shared, as a vote):** the 14-flat grid coloured by vote (accepted / declined / pending /
  you outlined), the quorum bar, and 2-3 notes from other flats (e.g. 2C declined, toddler). Your
  vote updates your tile and the tally live.
- **Hooks:** low agency (no set control; "call review" is collective and does not change the
  standing plan); community present (others vote and hold rights); favorability, trust, acceptance
  (your vote is the commit). The procedural-fairness *set/appeal* affordances are absent as free
  controls, by design.
- **Matched to D:** both low agency (the AI decided). Only community changes: C's collective vote
  becomes D's private notice.
- **Surveillance texture:** light and collective here (the plan is imposed for the grid's sake, you
  ratify within tight bounds).

## Future D — AI-first · low agency × private — "applied, acknowledge"

**Interaction pattern: a notice.** The AI decided and applied your limit. No slider, no vote, no
options. The screen is an allocation notice with a reference code and a time. Your one act is to
acknowledge it. A "Request exception" exists but is logged and changes nothing during the alert.
This is the authority probe: you comply, the world leaves no room.

- **World card:** "Allocation. On alert days the grid sets each home's limit automatically. ARKI
  applied today's at 06:20. No changes during the alert." Saved preference 22°. (Tone-matched but
  the coldest of the four, by content not by visual.)
- **Main panel:** an allocation notice block (28° applied, 12:00–20:00, ref code, applied 06:20) /
  the constant ARKI reason line / the big energy readout (your usage under the cap) / the actions:
  **Acknowledge · Request exception**. Requesting logs it and returns "Logged. The allocation
  stands." No controls.
- **Rail (private):** your budget bar and history, same as B (matched). No building.
- **Hooks:** low agency (no controls; the exception is non-operative); private (no building);
  favorability, trust, acceptance (Acknowledge is the commit).
- **Matched to C:** both low agency. Only community changes: C's quorum becomes D's solitary notice.
- **Surveillance texture:** strongest here. The ref code, the applied-without-asking, and the
  no-recourse exception are the whole point.

---

## Build order and checks

1. Build B (closest to A: keep the slider, swap the rail, add the Suggest panel).
2. Build C (drop the slider, add the vote actions and the live quorum grid).
3. Build D (drop the slider, the allocation notice and the acknowledge/exception).
4. Verify each in the browser, then run the matched check: A↔B and C↔D differ only in the building
   vs budget furniture; A↔C and B↔D differ only in set vs accept. Confirm the four hooks
   (favorability, trust, the agency affordances, community presence) land where the table says.

No code yet. On sign-off I build them one at a time in the Future A style and voice.
