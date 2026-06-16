# Recommendation plan: low-fidelity redesign of the four futures

Post-pilot direction. The pilot confirmed the prototypes were too complex and too polished, that
people learned the system, and that the value is qualitative. This plan turns the four cells into
four low-fidelity "alternative futures," each a single dashboard with a distinct AI interaction
model and its own short story of how that society got there. Built for speculative enactment, not
for product realism.

## Reframed goal (what the prototypes now serve)

The AI-assisted prototype is a **mediator** for sustainability and communal decisions. We study,
qualitatively, how that mediation shapes agency, acceptance, fairness, sense of community, and
trust, and above all **under what conditions people accept the AI as an authority**. Esch et al.
already measured these constructs; we go deeper through design fiction and speculative enactment,
exploring the design space of AI-assisted decision making rather than testing point hypotheses.

So the prototypes are **probes**, not products. Lower fidelity is an asset: a rough, sketch-like
artifact invites projection and reflection and resists being read as a finished solution.

## Design principles for the rebuild

1. **One screen per future. No click-through.** Each future is a single dashboard you take in at a
   glance. Detail lives in cards that expand in place or open a small popup. No multi-step flow, no
   day-by-day navigation.
2. **Lower fidelity.** Muted, near-grayscale with one accent. Fewer numbers, more white space, a
   slightly wireframe feel. Cut color-coding, multiple bars, and dense tables.
3. **One obvious action per future,** and it is the interaction model itself. Everything else is
   glanceable context behind a collapsed card.
4. **A world card first.** Each future opens with three or four sentences: how this society ended
   up here and how the AI came to hold its role. This is the design-fiction frame and the thing
   participants reflect against.
5. **Show, do not narrate.** Drop every sentence the screen already states. The AI speaks in short
   notices, never in chat.

## Inspiration: how real systems set restrictions and allocations

Borrow the *texture* of algorithmic allocation, kept legible and low-fi:

- **China, city-brain and social-credit style.** Top-down allocation and restriction framed as
  collective good, opaque criteria, status tiers, public visibility of compliance, rationing by
  decree. Feeds **Future C and D**: the plan comes down, you fall in line, the framing is necessity.
- **Amazon, algorithmic management.** The algorithm as boss: quotas, rates, task allocation, "meet
  the target," ranking against others, the system reassigns without asking. Feeds **Future C and D**
  too: an allocation handed to you by a manager you cannot argue with.
- **Both** share allocation-by-optimization, comparison to others, and restriction-as-default. Use
  diegetic fragments (an allocation notice, a compliance line, a building ranking) rather than full
  systems, and keep Future A and B deliberately *unlike* this, so the contrast across futures is felt.

## The four futures (each a different society and AI posture)

The underlying situation is the same in all four: a heatwave, your flat capped at about 28 C, an
unfavourable outcome. What changes is who the AI is in that society and what you can do.

**Future A, dialogic. High agency x high community.**
- Society: after repeated blackouts, neighbourhoods opted into cooperative energy governance. The
  AI is a broker and facilitator, not a boss.
- AI posture: surfaces the shared limit and trade-offs, brokers between flats. People act together.
- Your action: propose, vote, or share cooling with neighbours. The plan is something you make with
  others through the AI.

**Future B, AI-follow. High agency x low community.**
- Society: cooling stayed a private, metered commodity. Each household manages its own budget.
- AI posture: a personal assistant that recommends when you ask, and otherwise stays out of the way.
- Your action: you set your own cooling first; you can ask the AI to suggest alternatives against
  your budget. It follows your lead.

**Future C, delegation. Low agency x high community.**
- Society: to keep the grid from collapsing, the city authorised AI to set each building's plan;
  communities ratify within tight bounds.
- AI posture: it decides the building plan and delegates a narrow accept-or-flag choice downward.
- Your action: accept the plan, accept with a note, or join a collective review. Acceptance is the
  main move, and it is tight.

**Future D, AI-first. Low agency x low community.**
- Society: after a grid catastrophe, emergency powers automated rationing for everyone. There is no
  opting out; compliance is framed as survival.
- AI posture: it decides and applies, alone, and tells you. This is where the surveillance texture
  is strongest (an allocation notice, a compliance line, no recourse).
- Your action: acknowledge. There is no real choice, and the screen makes that plain.

These map onto the 2x2 (agency x community) exactly as before, so the manipulation logic survives,
but each cell now also carries a distinct future and aesthetic. See the trade-off note below.

## Simplified flow (identical skeleton, four postures)

1. **World card** (3 to 4 sentences, the society and the AI's role). Continue.
2. **Dashboard, one screen.** Top: today's allocation (about 28 C, the bind), stated once. Below:
   two or three collapsed cards (why this / the building or your budget / others, where relevant).
3. **One primary action** matching the future (propose-or-share / set-and-ask / accept / acknowledge).
4. **Cards expand in place** to reveal detail. No navigation away from the dashboard.

## What to cut (the junk that made people think too hard)

- The seven-day click-through. Replace with a small, non-interactive week strip for context only.
- The fine-tune slider everywhere except where setting is the point (A and B), and even there keep
  it minimal.
- Dense kWh tables, stacked progress bars, the three-cell eco-feedback grid, and every duplicate
  consequence sentence.
- Inline "what ARKI used about you." Move it into one collapsed card.
- Colour coding and multiple accents. One accent, muted.

## The trade-off to decide with your professor

Giving each future its own society and aesthetic is great for the design-fiction goal and for the
"how did we get here" reflection, but it reintroduces variation that is confounded with the cells
(the futures differ in more than the two axes). For the new **qualitative, design-space** goal this
is acceptable and even desirable: the point is to explore how people feel across distinct futures,
not to run a clean factorial. If any quantitative comparison stays in, note this openly as a limit
and lean on the manipulation checks plus counterbalancing.

## Generation prompt (paste into v0)

```
Build four low-fidelity, single-screen "speculative future" dashboards for a research probe about
an AI that rations household cooling during a heatwave. Plain React + one shared CSS file, no
router, no backend, no auth, no dark mode. These are rough probes, not a product: muted near-
grayscale with ONE accent colour, lots of white space, a faintly wireframe feel, minimal numbers.

Shared shell (identical in all four):
- A dismissible "world card" on load: 3-4 sentences of backstory (passed in as a prop).
- A single dashboard screen. Top shows today's outcome once: "Your flat: ~28 C in the heat window"
  against a stated preference of 22 C. No multi-day navigation; show a small static week strip for
  context only.
- 2-3 collapsed cards that expand IN PLACE on click (no page changes, no modals-as-navigation):
  "Why this", "The building" or "Your budget", and where relevant "Other flats".
- One short AI notice line (terse, infrastructural, never a chatbot).
- Exactly ONE primary action, which differs per future.

The four futures differ ONLY in the AI's posture and the primary action:
- Future A (dialogic): you act WITH the AI and neighbours. Primary action: propose / vote / share
  cooling with another flat. Show the shared pool as one simple bar.
- Future B (AI-follow): you act first. Primary action: set your own temperature, then an optional
  "Ask the AI to suggest" that returns 2-3 options against your private budget. No building view.
- Future C (delegation): the AI set the building plan; you ratify. Primary action: Accept / Accept
  with note / Join review. No free setting. Show a simple acceptance count for the building.
- Future D (AI-first): the AI decided and applied it; no opt-out. Primary action: Acknowledge only.
  Strongest "allocation handed down" tone: an allocation notice with a reference code, a one-line
  compliance status, no controls.

Constraints: do NOT add charts, gauges, multiple progress bars, gamification, or more than one
accent colour. Keep total on-screen text minimal. Each dashboard must be readable in a Qualtrics
iframe at ~800px wide. Output one file per future plus one shared CSS, no extra abstractions.
```

🎯 Target: v0. 💡 Scoped hard against v0's default bloat (no router/auth/dark-mode/charts), locks
the shared shell so the four stay matched, and pins the one-action-per-future contrast and the
low-fi look so it does not come back glossy.

## Next step

Stress-test this with grill-me, then on sign-off turn it into an implementation plan. No prototype
code is being changed yet.
