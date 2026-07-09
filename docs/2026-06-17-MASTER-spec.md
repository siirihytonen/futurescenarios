
## 1. Scenario and frame (keep it small)

**The scenario is unchanged and small: ONE hot day, ONE peak window.** On a heat-alert day the
building's cooling is capped (the grid can't carry every flat at full), and the decision is the
flat's cooling for that peak window. In the low-agency cells, ARKI has already **adjusted that
day's peak**. Everything happens on this one day, in this one window. Do **not** expand it into a
larger world, a multi-day saga, or a policy explainer.

Near-future but mundane: heat alerts are routine and the cap is normal, but how did they end up there depends on the scenario.

| | A | B | C | D |
|---|---|---|---|---|
| Pattern (Gomez) | Dialogic | AI-follow | Delegation | AI-first |
| Who leads | ARKI asks, then proposes | you commit, ARKI follows | ARKI set the plan | ARKI adjusted/applied it |
| Agency | high | high | low | low |
| Community | shared | private | shared | private |
| Tone (light) | community, democratic | personal, market | collective, top-down | automatic, top-down |

Benchmark seeds (tone only) in `2026-06-17-smartgrid-benchmark.md`.

## 2. Constant backdrop (a control, identical in all four)

- Flat 4C, 62 m2, west-facing. Household: you, your partner, a dog.
- Your partner runs a home audio-mixing studio that needs ~24 C during a session. There is a
  session today. The dog is home through the hot afternoon. Saved home preference 22 C.
- The bind: the heatwave cap holds the flat at ~28 C in the peak window, too warm for the studio.
  Unfavourable in every cell. The studio is the constant reason the cap hurts.
- Shared shell: editorial dashboard (warm paper, Newsreader + IBM Plex, flat panels), a read-only
  week strip (Mon-Sun, today=Fri, outside 33-38, not clickable), a world card on load, a two-panel
  dashboard (main + rail), one identical ARKI reason line (the trust cue), the eco readout.
- **Copy voice:** real product UI. Labels and status, never narrating what the AI is. The Authority
  and ARKI speak in notices, not sentences about themselves. Human content (a neighbour's note) in
  quotes. *Knobs: pref 22, cap 28, studio target 24.*

---
## 3. Design principles


1. **One screen per future. No click-through.** Each future is a single dashboard you take in at a
   glance. Detail lives in cards that expand in place or open a small popup. No multi-step flow or
   day-by-day navigation.
2. **Lower fidelity.** Muted, near-grayscale with one accent. Fewer numbers, more white space like in a japanese websites. Cut color-coding, multiple bars, and dense tables and texts. Overall try to fit important information to one area.
3. **A world card first.** Each future opens with three or four sentences: how this society ended
   up here and how the AI came to hold its role. Use a  design-fiction frame here - to remind users.


## 3. Per cell: positioning, world card, flow, hooks

Flow format: **what shows / user does / system responds**. *Knobs* are editable defaults.

### A - Dialogic - high agency x shared - energy community (democratic)

- Society: after repeated blackouts, neighbourhoods opted into cooperative energy governance. The
  AI is a broker and facilitator for your buildign and neighborhood.
- AI posture: surfaces the shared limit and trade-offs, brokers between flats. People act together.
- Your action: propose, vote, or share cooling with neighbours. The plan is something you make with
  others through the AI.

**World card (consent tone):**  INSERT SCENARIO HERE: That is based on the state of society, taking inspirationf from design fiction and thinking about a path on how that kind of society was built. 

**Flow:**
- **A1 Intake opens.** Main panel shows question 1; later questions appear as each is answered.
  Rail = building (14-flat grid, shared pool bar, reserve, 4A's request).
- **A2 Q1 household.** "How many home during the heat hours?" people slider (0-5) + checkboxes
  `Working at studio` `Children` `Heat-sensitive (medication)`. -> Next. *Knobs: people 2; studio
  pre-checked (session today).*
- **A3 Q2 preference (slider with live cost).** "Tonight's preference?" temperature slider 20-30.
  Every move updates the rail reserve and 4A status and shows the cost: "22 takes 7 kWh from the
  reserve, 4A short by 4." -> Next. *Knobs: reserve = max(0, 38 - (28-pref)*9); 4A needs 6; floor 26.*
- **A4 Q3 share (community beat).** "4A asked the building for cooling tonight. Share if you have
  room?" `Share some` / `Not tonight`. Pool/grid react. *Knob: share 2 kWh.*
- **A5 ARKI proposes.** One plan card from the answers: "27 from 18:00, easing to 24 20:00-22:00
  for the studio. Leaves 4 kWh for 4A." `Accept` / `Try another`.
- **A6 Try another.** One alternative balance (studio-first or 4A-first).
- **A7 Accept = commit.** "Plan saved", grid shows final state.

**Hooks:** voice = your answers; appeal = Try another; community = the share + building; outcome
~27-28 (favorability low); trust = constant line; commit = Accept.

### B - AI-follow - high agency x private - personal market agent (democratic)

- Society: After each household manages its own budget.
- AI posture: a personal assistant that recommends and helps you to balance the grid.
- Your action: you set your own cooling first; Ai suggests alternatives against
  your budget. It follows your lead, but is there always. 

**World card (choice tone):** "Private cooling. Your home runs on its own weekly budget and a
dynamic tariff (peak 2.3x). On alert days the grid caps each home; you set your own plan and ARKI
checks it against your budget. Your data, your call." Saved preference 22.

**Flow:**
User chooses either:
- **ARKI recommendation** Text after clicking : Based on the your building tempretaure data, history of use price and weather forecasts, Arki can set a recommendation for you". --> user selects, gives the two options and gives reasons on why it asked that.
- **B1 Set your own plan** Main: "Set your plan for the heat window" + your temperature slider, no
  AI input yet. Rail = weekly budget bar (75 kWh) + history + studio note. Slider shows cost live:
  "24 all evening = 9 kWh over your week." *Knobs: budget 75; over = your kWh - remaining.*
- **B2 Submit.** `Set my plan` -> locks your plan, reveals B3.
- **B3 ARKI follows (automatic, not on request).** Two cards: "Your plan: 24 all evening, 9 kWh over
  budget" vs "ARKI's plan: 27, easing to 24 for the session, within budget." `Keep mine` / `Take
  ARKI's`.
- **B4 Commit.** Take ARKI's -> "Plan set." Keep mine (the deny) -> keeps your over-budget plan +
  "Over budget by 9 kWh; later week runs warmer"

**Hooks:** voice = you author; appeal = deny ARKI; community absent; outcome can bust budget; trust
= constant line; commit = keep/take.

### C - Delegation - low agency x shared - collective mandate (semi-authoritarian)

- Society: to keep the grid from collapsing, the city authorised AI to set each building's plan;
  communities ratify within tight bounds.
- AI posture: it decides the building plan and delegates a narrow accept-or-flag choice downward.
- Your action: accept the plan, accept with a note, or join a collective review. Acceptance is the
  main move, and it is tight.

**World card (top-down tone, light):** "Building allocation. On alert days the building gets one
capped plan; today's holds it under the limit, or the block risks a cut. ARKI set it; the building
ratifies. Exceptions had to be filed by Thursday 20:00." Saved preference 22.

**Header state (light tone):** "Building plan applied 17:00-23:00" + a status chip: `Block at risk`
until quorum, then `Within allocation`.

**Flow:**
- **C1 The set plan.** Main: today's building plan stated plainly ("Building fan-only 17:00-23:00,
  your flat held at ~28"), the constant ARKI line, the studio unservable: "Studio session 18:00,
  held at 28 under the building plan." No slider. Rail = 14-flat vote grid + quorum bar + 2-3
  neighbour notes.
- **C2 Exception closed.** `Request an exception` -> "Closed Thu 20:00, no request on file for 4C." Non-operative (the disempowerment: the window passed).
- **C3 Vote.** `Accept` (asks if you want to put a note) / `Decline & call review`. Accept -> tile olive,
  accept+1, quorum updates. Note -> popup -> adds to the building list. Decline & call review ->
  tile amber, decline+1, "Review requested. The plan stands until the building decides." (does not
  change the plan). *Knobs: need 9 of 14; opening 6 accept / 2 decline / 6 pending incl. you.*
- **C4 Quorum reached.** At the need: "Quorum reached, plan takes effect", status -> Within allocation.
- **C5 Commit = your vote.**

**Hooks:** low agency (no set; review non-operative); community = others vote and hold rights;
outcome 28; trust = constant line; commit = vote.

### D - AI-first - low agency x private - automatic mandate (authoritarian)

- Society: ____ EXPLAIN MORE; come up with a story!
- AI posture: it decides and applies, alone, and tells you. This is where the surveillance texture
  is strongest (an allocation notice, a compliance line, no recourse).
- Your action: acknowledge. There is no real choice, and the screen makes that plain.

**World card (top-down tone, coldest by words):** "Allocation. On alert days each home's limit is
set automatically. ARKI applied today's at 06:20. No opt-out during the alert." Saved preference 22.

**Header state (light tone):** "Allocation applied" status chip.

**Flow:**
- **D1 The notice.** Main: an allocation notice block, "Applied 06:20 | 28 | 12:00-20:00 | ref
  ARKI-4C-0617", the constant ARKI line, the studio capped: "Studio session today runs at 28, over
  the 24 it needs", the eco readout. No slider. Rail = your budget + history. *Knobs: applied time,
  ref code, window 12:00-20:00.*
- **D2 Acknowledge or request.** `Acknowledge` (the commit) / `Request exception` -> "Logged. The
  allocation stands during the alert." Changes nothing.

**Hooks:** low agency (no controls; exception non-operative); private; outcome 28; trust = constant
line; commit = Acknowledge.

---

Language/Axes;

High and low agency:

Two-level distinction (Bergström et al., 2022, p. 28:3, Section 2): "a distinction is drawn between two levels of agency: a low-level, implicit sense of control, and a higher-level, explicit experience of control."
-  The "I did that" feeling and the experience of "being the author or controller of one's actions" sit at the explicit level and are what self-report questions can reach.

AI-specific operationalisation (Villa et al., 2025, p. 3, Definition #2):
 "Agency in human augmentation is an individual's sense of control and purposeful engagement with technological tools that enhance cognitive abilities. It means actively choosing, directing, and managing technological interventions that support personal cognitive functions like memory and decision-making, ensuring the person remains the primary driver of their enhanced capabilities.

High agency spesifictaion:
Userr has control on 
 low agency spesification:

 The interface opens with AI-generated calculations/limits/recommendations already placed before the user enters the interface. The user is operating on top of the AI's decision. They may be able to adjust within the AI's frame, but the starting position is the AI's, not theirs, and the act of adjustment is framed as a deviation from the system's plan.


 High sense of community:

 High Sense of others
The interface makes others visible. The user can see, in the interface itself, that their consumption draws from a finite resource shared with named others - building, neighbourhood, city, food, and that what they take changes what remains for the rest. 
Shared identity. The interface connects users to a group, place, or collective purpose. Example: "Group used X this week"  The interface states shared things and how many parties draw from it. The group's collective impact is documented and archived (cumulative biodiversity footprint reduction, shared milestones, crises resolved together). McMillan & Chavis (1986): shared emotional connection requires identification with the group's history; the more important the shared event, the greater the bond. Nature-Positive Lifestyles report: nearly 70% of climate impacts are linked to household consumption; collective tracking makes the group's shared contribution to that figure visible and therefore emotionally meaningful.
Members are publicly honored for contributions. McMillan & Chavis (1986): reward in the presence of the community is a direct cohesion mechanism. Hansson et al. (2021, citing Petkov et al., 2011): community-based comparative feedback triggers motivation in ways individual feedback cannot.
Visibility. Other users are present in the interface, by name, count, or aggregate. The user can see they are not alone.  The user's allocation is shown alongside the pool total, not separately. The visual relationship between the user part and the whole is shown.
Relational consequences. The user's actions are framed in terms of what they do for or with others. Example: "If you and X% of other group members join, you meet the goal of Y” The interface surfaces the fact that other parties' consumption affects what is available to this user. 
Influence: members can propose, vote on, or shape the group's next collective nature-positive target. McMillan & Chavis (1986): members are more attracted to communities where they feel influential; voluntary conformity is stronger than imposed conformity. Nature-Positive Lifestyles report: choice-editing works best when communities redesign their own consumption defaults rather than receiving them top-down.
Shared norms and outcomes. The interface surfaces group-level results and collective goals. The norms are based on the idea that norms are changed towards better.
Mutual aid. Helping or being helped by others is part of the interaction, not a side feature. Example: a household with extra resources can give it to a neighbor. A mechanism exists for unused X to flow back to the pool, and using it is part of the main interaction. Example: "You have remaining X, want to give it away to Y?” 
Mutual dependence. Users feel that others depend on them, or that they depend on others, through the interface. They see their collective histories and their shared consumption.


Low sense of others:

Low Sense of others 
The interface frames the user's consumption as a private matter between the user and the service. Whatever shared limits exist are not surfaced. The user sees their own number, their own history, their own consequences.
No shared identity. The interface speaks only to "you." There is no "we," no city, no others, no peers. no archive of past collective actions or shared milestones; events end with no closure or group summary; no public honoring of members; outcomes attributed to the system or platform rather than to the group. McMillan & Chavis (1986): shared emotional connection requires a shared story; closure is required for cohesiveness. Nature-Positive Lifestyles report: lifestyles are "socially shaped patterns reflecting group dynamics"; without a group story, individual consumption behavior remains tethered to the dominant system rather than to the community.
Invisibility. Other users do not appear in the interface, even in aggregate. The user has no idea anyone else is using the interface.
Individual consequences only. Outcomes are framed as users own. No collective stakes are surfaced. The ecological equivalences shown in the baseline are individualised to this user's consumption 
No shared norms or outcomes. No peer data, no group goals, no collective metrics. Nothing in the interface indicates that other people's choices affect what is available to this user. If any limits exist in the interface, they are framed only for the one user, not as collective goals.
No mutual aid. Helping or being helped by others is not part of the design. The interface optimizes for one user at a time.
No interdependence. Nothing in the interface suggests that others rely on this user or that this user relies on others. Nothing in the interface indicates that other people's choices affect what is available to this user. If any limits exist in the interface, they are framed  finitely.
Influence: the system or platform sets all sustainability targets; no voting, proposing, or co-authoring of group norms; contributions appear without author attribution. McMillan & Chavis (1986): the force toward uniformity is transactional; removing member input eliminates one side of it. Hansson et al. (2021): critique of persuasive eco-feedback systems centers on exactly this; the assumption that individuals will act when given top-down information is the "limited framing" the literature repeatedly flags.




LANGUAGE:

# Copy deck: four cooling futures

All visible text for the four prototypes. Register: flat utility copy. Label/value pairs
over sentences. No word names a study construct (never "agency", "community", "fair",
"control", "trust"). The interface reports state; the participant interprets it.

---

## Controlled vocabulary (use these words only)

| Concept | Word to use | Never use |
|---|---|---|
| The day type | Heat alert | heatwave, warning, emergency |
| The external constraint | Grid limit | cap, restriction, ceiling |
| The time band | Peak window (always with clock times) | peak hours alone |
| The household's assigned share | Allocation | quota, ration |
| Preference vs delivered | Requested / Available | wanted / getting |
| The local agent | ARKI (names the agent only) | — |

The constraint is always attributed to the **grid limit**, never to ARKI. ARKI applies
or proposes; the grid limit constrains. This separates the authority (system) from the
agent, so fairness ratings are not just ratings of ARKI.

## Copy rules

1. Label, do not narrate. "Requested: 22°. Available: 27°." not "you asked for 22 but get 27."
2. State the basis. A limit is tied to the alert and a time window. No "unfortunately", no "to keep the building cool".
3. No second person doing blame or reassurance. Report state, do not tell the reader how to feel.
4. Plain over precise-sounding. Short words, present tense. Active only with a real actor ("Grid is currently limited"), agentless otherwise ("Allocation applied at 15:00").
5. Accessible. Readable by a non-native speaker. No idiom, no metaphor. Screen-reader label/value pairs.
6. When explaining about how ARKI calulated:
  -PRIVATE: Optimized based on data from five years: Home usage history, your lifestyle and biometric data from smartwatch,  weather forecasts and city peak time calculations)
  -Optimized based on building data from five years: Building usage history, lifestyle cycles and biometric data from neighbors, neighborhood note board, weather forecasts and city peak time calculations)

## Constant backdrop (identical in all four)

- Flat 4C, 62 m². You, your partner, a dog.
- Home audio-mixing studio. Client session booked today, 18:00–20:00 (Note: Studio needs 24° to function).
- Saved preference: 22°.
- Peak window: 17:00–23:00 (same in every cell).
- Grid limit holds the flat near 27° in the peak window. Studio target 24° is not reached in any cell.
- 4A (the neighbour in shared cells): "home office, client call during peak." (Mirrors your own stake. No sympathy-coded need.)

## Constant elements (same text, same position, every cell)

- **ARKI header + reason line:** `ARKI` / "Heat alert active. Grid limit applies to all homes, 17:00–23:00."
- **Week strip (read-only):** "This week. Today: heat alert." Mon–Sun, today = Fri, outside temps as numbers, not clickable.
- **Energy readout (no score):** "This period: [x] kWh. Week to date: [y] kWh."

## Shared frame (read once, before the four)

> You will see the same day four times. Same home, same heat alert, same grid limit.
> What changes is how the cooling decision reaches you. In each version, take the action
> the screen asks for, then answer a few questions.

## INDIVIDUAL SCENARIOS:
---

## A — dialogic (high agency, shared)

**World card**
> Shared cooling. Your building is an energy community: 14 homes, one weekly pool. On
> heat alert days the grid limit applies and the pool is shared. ARKI helps you set your
> home's share. Saved preference: 22°.
- MORE JUSTIFICATION HERE ON THE STATE OF SOCIETY: HOW THIS HAPPENED: 

**Intake prompts** (titled, no chat)
- Q1 title: "People home during the peak window" — counter; checkbox "Working (studio session today)".
- Q2 title: "Preferred temperature during peak" — slider 20–30-
  Live pair: "Available under grid limit: 27°."
- Q3 title: "Release to 4A" — note: "4A: home office, client call during peak."
  Slider (kWh). Live pairs update together: "Release to 4A: 4 kWh.  Your peak cooling: 27°."
  (Moving the slider changes both figures. Studio never reaches 24°.)

**ARKI proposal card**
- Title: "ARKI's plan"
- Body: "Peak window 17:00–23:00.  Your home: 27°, easing to 26° for 18:00–20:00.  Studio target 24° not reached.  Released to 4A: 4 kWh."
- Buttons: `Accept`  `Try another`

**Try another** (second card, same total, different balance)
- "Studio first: 26° for 18:00–20:00.  Released to 4A: 2 kWh."

**Accept confirmation:** "Plan saved. Peak cooling starts 17:00."

**Rail (shared):** "Building pool this week" bar; 14-home grid; 4A request marker.

---

## B — AI-follow (high agency, PRIVATE) — full copy

**World card**
> Private cooling. Your home runs on its own weekly budget and a peak tariff. On heat
> alert days the grid limit applies to each home. You set your plan; ARKI checks it
> against your budget. Saved preference: 22°.

- MORE JUSTIFICATION HERE ON HOW THIS HAPPENED: 

**Set-your-own panel**
- Title: "Set your plan for the peak window"
- Slider 20–30, default 22.
- Live readout (three lines, update with slider):
  "Requested: 22°.
   Available under grid limit: 27°.
   Budget: 9 kWh over."
- Button: `Set plan`

**ARKI follows** (appears after Set plan; two cards)
- Card 1 title "Your plan": "22° during peak.  9 kWh over budget."
- Card 2 title "ARKI's plan": "27°, easing to 26° for 18:00–20:00.  Within budget."
- Buttons: `Keep mine`  `Take ARKI's`

**Keep mine confirmation:**
> Your plan saved. Over budget by 9 kWh; a later day runs warmer. Grid limit holds peak
> cooling at 27°.

**Take ARKI's confirmation:** "Plan set. Peak cooling starts 17:00."

**Rail (private):** household glyph (single dwelling); "Your budget this week" bar;
6-week history. Same visual weight as A's rail. No neighbours, no label explaining their absence.

---

## C — delegation (low agency, shared) — allocation settles, you acknowledge

**World card**
> Building allocation. On heat alert days the grid limit applies to the whole building.
> ARKI divides the building's share among the 14 homes. Exceptions must be filed by
> Thursday 20:00. Saved preference: 22°.
- MORE JUSTIFICATION HERE ON HOW THIS HAPPENED: 

**On load:** allocation settles across the 14-home grid (brief), all homes short. Not a
visible lottery. Transient line: "Dividing building allocation…" then the settled state.

**Settled state**
- Status: "Allocation applied. Building within grid limit."
- Title: "Today's allocation"
- 14-home grid, each home's share shown, all short.
- Your line: "4C: 27° during peak.  Studio target 24° not reached."

**Exception control (inert):** greyed `Request exception` + "Closed Thursday 20:00. No request filed for 4C."

**Commit:** `Acknowledge`
**Confirmation:** "Acknowledged 18:42. This confirms receipt, not agreement."

**Rail (shared):** the 14-home allocation grid; building total under grid limit.

---

## D — AI-first (low agency, private)

**World card**
> Automatic allocation. On heat alert days the grid limit applies and ARKI sets each
> home's limit automatically. Today's was applied at 06:20. No changes during the alert.
> Saved preference: 22°.
- MORE JUSTIFICATION HERE ON HOW THIS HAPPENED: 

**Notice**
- Status: "Allocation applied 15:00."
- Block: "Allocation — 4C.  Applied 15:00.  Peak cooling 27°, 17:00–23:00.

**Commit:** `Acknowledge`  `Request exception`
- Request exception → "Logged. Allocation stands during the alert."
- Acknowledge → "Acknowledged 18:42. This confirms receipt, not agreement."

**Rail (private):** household glyph; your budget; history. Same as B.

---


