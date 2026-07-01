# Study instrument, grounded in Colquitt (2001) and Tyler & Blader (2003)

Purpose: the research questions, the fairness/acceptance measures, and what each prototype must
show so those measures have something on screen to attach to. Theory does the anchoring; the
prototypes are speculative probes.

## 1. What the two papers give us

**Colquitt (2001), organizational justice = four dimensions**, each with validated items (his
Table 1), tailorable by swapping the "(outcome)" and "(authority figure)" parts. Here the authority
is ARKI.
- **Procedural** (how the decision was reached): voice, influence/control, consistency, bias-free,
  accurate information, appealability, ethicality.
- **Distributive** (the outcome itself): appropriate, justified, reflects your contribution/need.
- **Interpersonal** (how the authority treated you): polite, dignity, respect.
- **Informational** (how the authority explained it): candid, thorough, reasonable, timely,
  tailored to your needs.
- **Agent-system split:** interpersonal + informational justice drive reactions to the *agent*
  (trust in ARKI itself); procedural + distributive drive reactions to the *system* (the allocation
  scheme). So you can separate "do I trust ARKI" from "is the scheme fair."

**Tyler & Blader (2003), the group engagement model, = why people accept an authority.**
- Procedural fairness and relational treatment (respect, being heard) shape **legitimacy**, and
  legitimacy, more than the favourability of the outcome, drives whether people accept and defer to
  an authority's decisions.
- **Voice matters even when it changes nothing**, but only if the authority seems to be *considering*
  you (that is interpersonal respect, not instrumental control).
- Acceptance flows through **identity** (pride, respect, identification with the group), so the
  *group/collective* can be a source of legitimacy on its own.

**The novelty:** all of this was established for human authorities. Your study asks whether these
mechanisms transfer to an AI authority in a sustainability setting, and where they break.

## 2. Research questions (sharpened, grounded)

- **RQ1 (design check).** Do users map the four prototypes onto the intended agency x community
  space? (manipulation check.)
- **RQ2 (descriptive).** How do the prototypes shape perceived procedural, distributive,
  interpersonal, and informational justice, and acceptance and trust? (Colquitt's four dimensions +
  acceptance/legitimacy as DVs.)
- **RQ3 (interpretive, the headline).** Under what conditions do people grant an AI legitimacy as an
  authority over a shared sustainability decision, and which justice dimensions carry that
  legitimacy when the authority is an AI rather than a human? (Tyler's legitimacy mechanism, tested
  on an AI authority.)

Theory-grounded expectations to explore (not to test inferentially):
- Procedural voice (the agency axis) raises acceptance of the *same* unfavourable outcome (Tyler:
  procedure over outcome).
- The collective (the community axis) can supply legitimacy when personal voice is low, so C
  (collective, low agency) is accepted more than D (pure top-down, low agency). This is the
  buffering effect, now grounded: group-based legitimacy substitutes for personal procedural voice.
- Interpersonal/informational treatment by ARKI drives trust in ARKI specifically, and may or may
  not "land" from a machine, that gap is the novel finding.

## 3. The questions (measures)

Use these as interview probes first; keep the short rating version as a light quant anchor
(Colquitt's 5-point, 1 = to a small extent, 5 = to a large extent). All refer to "the cooling
decision ARKI made for you today."

**Procedural (about how ARKI reached it):**
- Could you express your views before ARKI decided?
- Did you have any influence over what you ended up with?
- Was the process applied the same way for everyone?
- Was it free of bias?
- Was it based on accurate information about you and your home?
- Could you appeal or change it?
- Did it hold to standards you think are right?

**Distributive (about the outcome):**
- Is the cooling you got appropriate, given your situation (the studio, the household)?
- Is it justified, given what you and others need?
- Does it reflect a fair share compared with the other flats?

**Interpersonal (about ARKI as the actor):**
- Did ARKI treat you with respect? With dignity? As a person rather than a meter?

**Informational (about ARKI's explanation):**
- Was ARKI candid with you? Did it explain the decision thoroughly, in a way that made sense, in
  time, and tailored to your situation?

**Acceptance / legitimacy (Tyler):**
- Are you willing to go along with ARKI's decision?
- Does ARKI have the right to make this call?
- Would you defer to it another time?

**Trust (agent):** keep your existing trust items, and read them as trust in ARKI specifically.

**The novel qualitative probes (RQ3):**
- **The transfer test:** when you could give input, did it feel like ARKI was *considering* you, or
  just collecting data? (Tyler's voice-as-respect, tested on a machine.)
- **The swap:** if a person, a building manager or a neighbour committee, had made the same call,
  would you accept it more or less? Why? (AI vs human legitimacy for the same loss.)
- **The line:** where is the line between an AI decision you can live with and one you can't, and
  what moves it?
- **Redesign it:** change one thing so you could accept the version you rejected. (Reveals which
  justice dimension they reach for.)

## 4. What each prototype must show (justice hooks)

For a dimension to be *perceived*, the prototype has to *show* it. Map each dimension to an on-screen
element, present or absent by cell. This is what grounds the agency x community design in justice
theory.

| Justice element | On-screen hook | A advises | B reviews | C enforces | D decides |
|---|---|---|---|---|---|
| Procedural: voice | a control (slider / your own plan / a vote) | slider | your plan | vote only | none |
| Procedural: influence | can your action change the outcome | yes | yes | no (vote is non-binding on the plan) | no |
| Procedural: appeal | an appeal affordance | share/ask reshapes | deny ARKI | call review (inert) | request exception (inert) |
| Procedural: accuracy/neutrality | "what this is based on" (the data used) | present | present | present | present |
| Distributive | outcome vs your preference/need; others' shares in shared cells | shown + others | shown | shown + others | shown |
| Interpersonal (ARKI's treatment) | the tone of ARKI's copy: does it acknowledge your situation | considering, warm | considering | correct, distant | flat, procedural |
| Informational | quality of "why this" + explanation | full, tailored | full | terse, rule-based | notice only |
| Legitimacy source | who holds the authority | you (ARKI advises) | you (ARKI reviews) | the collective (ratified) | ARKI alone |

Two design consequences:
- **Interpersonal justice is carried by copy tone**, and it should be a deliberate, held-consistent
  gradient A -> D (considering -> flat), not accidental. This lets you ask whether a machine's
  "respect" registers at all.
- **Legitimacy source is the community axis in Tyler's terms:** C sources legitimacy from the group
  (the building ratified it); D has none but the machine's. That is the cleanest test of whether
  the collective can make an unfavourable AI decision acceptable.

## 5. The contribution

You are extending the group engagement model and the four-factor justice measure from human
authorities to an AI authority allocating a scarce sustainability resource. The novel questions:
does procedural voice still buy acceptance when the decider is an AI; does a machine's respectful
treatment count as relational respect or read as hollow; and can collective legitimacy (the
building) substitute for personal agency when an AI holds the power. That is a sharper, more
publishable frame than "do people like AI decisions."
