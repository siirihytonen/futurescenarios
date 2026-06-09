# Literature Review + Coding-Guide Plan: AI-Assisted Cooling Allocation Study

## Context

This study extends Esch et al. (2025), who found across four AI resource-allocation
scenarios (N = 929) that **outcome favorability dominated** acceptance, fairness, and
trust. Their vignettes left participants materially unaffected, and they call for work
in settings where the AI's output **cannot** be received as a personal benefit. This
study answers that call: under a structurally unfavorable allocation (constrained
cooling during a heatwave), favorability cannot rescue acceptance, isolating what
*else* drives it — agency framing and community framing.

During grilling/brainstorming, the RQs and hypotheses were reframed for coherence
(RQ1 = quantitative "do ratings differ?"; RQ2 = interpretive "what reasoning justifies
acceptance?"). H5 and H6 were re-grounded in literature so they can be coded reliably
in Phase 2 reflexive thematic analysis. This plan records the literature-review
structure, the citation-verification to-do, and the two coding guides.

**Decision (user, this session):** user verifies all `[VERIFY]` sources manually in
Google Scholar / Aalto library before they enter the thesis. Do NOT fabricate
authors/years/DOIs for any source lacking confirmed bibliographic detail.

## Reframed research questions (current)

- **RQ1** — When an AI-assisted decision produces an unfavorable personal outcome, does
  community framing and agency affect acceptance, fairness, and trust?
  - **RQ1b** — Do these ratings differ significantly across the four conditions?
- **RQ2** — What reasoning do users use to justify acceptance, and does that reasoning
  differ across the four conditions?
  - **RQ2b** — Which interface features prompt users to reflect on their own
    sustainability behaviour?
- **RQ3 (method)** — How well does an AI-assisted, axis-driven prototyping method
  produce stimulus material for future research, and where does it fail?

## Current hypotheses (HYBRID: structured spine + responsibility split + RQ3 pair)

Axes: Agency high = C1,C2 / low = C3,C4. Community shared = C1,C3 / private = C2,C4.
C1 high+shared; C2 high+private; C3 low+shared; C4 low+private.
USER DECISION (this session): C3 direction = COMMUNITY BUFFERS (H6). C4 is the floor.

CITATION STATUS:
- VERIFIED spine (read by us): Esch 2025, Bandura 2000, Allcott 2011, Ertz 2016,
  Li et al. 2025, Aguilar 2021.
- VERIFIED alt-proposal cites:
  - Yong & Camburn (arxiv 2601.12276) — read; supports H9a. CAVEAT: engineering/product
    prototyping (handheld light, ventilator), NOT interface speculative design → your use
    is ANALOGICAL; state the domain gap.
  - Ek, Paulsen & Trondsen (EPDE2024/1313) — read; supports H9b near-verbatim ("lacklustre,
    without solid conceptual framing," "best suited as preliminary inspiration"); also
    some H9a benefit material. RQ3 pair now fully grounded on read-verified sources.
  - Fornier (Springer s10287-025-00532-7, Comput. Manag. Sci. 2025) — user-verified by
    LINK, NOT read by us; H5 fairness-by-design shared-energy. SEPARATE from Fioriti.
  - Fioriti, Frangioni & Poli (2021), Applied Energy 299:117328 — READ by us. OPTIMIZATION/
    game-theory paper (MILP, Shapley/Nucleolus fair reward, aggregator "agency problem").
    NOT behavioural — never measures perceived responsibility. Use as DOMAIN-CONTEXT cite
    only (energy communities rely on fair cost/benefit sharing + exit clauses). Citing it
    for H4c (perceived responsibility) is a STRETCH — downgrade to context.
  - Kim, Jhang, Song, Shin & Song (2024), J. Business Research 178:114642 — READ by us.
    Collective-effort model; construct "perceived behavioral impact" (PBI) = how much
    people believe their behaviour affects COLLECTIVE performance. Strong fit for H7/H7d.
    CAVEAT (use it): effect DISSIPATED when people compared own impact to others' and felt
    it was small ("drop in the ocean") — Allcott-style boomerang risk for C1/C3 building-
    pool view. Add to design rationale + limitations.
- STILL UNVERIFIED — do NOT use until checked: Liashenko 2025, Wessel 2026, Lyu 2023,
  Bhattacharya 2024. (Lyu no longer needed — Yong covers H9a.)
- Plausibly real, not yet checked: Lennon 2019.

CONSOLIDATED TO 7 (master's scope; manipulation checks moved to analysis-validity, not
counted as hypotheses).

RQ1 — agency × community → responsibility, acceptance, fairness, trust
- **H1 Baseline (Esch 2025).** Acceptance below scale midpoint across ALL four futures
  (unfavourable outcome → favorability cannot rescue). Premise; if it fails, scenario
  wasn't unfavourable enough.
- **H2 Responsibility distribution (Bandura 2000).** High agency (C1,C2) → more to SELF;
  low agency (C3,C4) → more to AI; shared (C1,C3) → more to OTHER RESIDENTS/building.
- **H3 Community main effect (Allcott 2011; Fornier 2025).** Shared futures → higher
  distributive fairness, trust, acceptance than private.
- **H4 CRUX interaction (the contribution).** Community framing BUFFERS loss of agency:
  acceptance/trust penalty from low agency smaller in shared than private; C4 lowest.

RQ2 — collective-impact framing → personal convenience vs sustainability
- **H5 Justification shift (Kim 2024; Allcott 2011).** Collective-impact framing present
  (C1,C3) → sustainability/collective reasoning; absent (C2,C4) → personal convenience.
- **H6 Features (RQ2b; Ertz 2016; Li et al. 2025).** Collective-impact features (building
  pool, neighbours' needs, shared budget) prompt sustainability reflection more than
  private features (personal-best, personal budget).

RQ3 — method
- **H7 Method (Yong & Camburn 2026 [analogical, eng. domain]; Ek et al. 2024).** Method
  yields futures distinct/rich enough for analysable material + follow-up questions, but
  underperforms where deep contextual grounding needed → more generic/less-resolved
  elements. Also assessed vs. pilot success criteria.

DV coverage: responsibility H2; acceptance H1/H3/H4; fairness H3; trust H3/H4.
Procedural fairness ("I had a say") rides with agency manipulation as descriptive check.
Headline = H4. DESIGN IS WITHIN-SUBJECTS: each participant rates ALL four futures, so
H1–H4 have ~20–25 PAIRED obs per future (NOT 5–6/cell — that earlier framing was wrong;
5–6 only applies to qual reasoning-by-condition in H5). Within-subjects → more power for
the H4 interaction. Still exploratory/non-inferential given small N.
Kim caveat (use in design rationale + limitations): collective-impact motivation can
DISSIPATE if a resident sees own share as tiny vs others ("drop in the ocean") —
boomerang risk for C1/C3 building-pool view.

## Positioning vs Li et al. (2025) — closest prior work
Li = scenario 2×2×2, mock AI interfaces, FEEDBACK features → energy-saving INTENTION,
favourable framing, quantitative PLS-SEM. This study differs on 3 axes: (1) outcome
valence — unfavourable allocation, so favorability can't explain acceptance (Esch); (2)
construct — acceptance/fairness/trust/responsibility toward an IMPOSED decision, not
intention to act on own behaviour; (3) method/depth — within-subjects multi-future
enactment + RTA asking WHY, not just whether. Novel = can community framing BUFFER loss
of agency when outcome can't be favourable (H4) — neither Li nor Esch examined this.

## Focus-group guide v2 (packed, Salovaara-aligned) — supersedes earlier guide

LOGIC (tightened): acceptance of an unfavourable AI allocation is the SPINE. Fairness +
trust = its drivers (Esch 2025). Responsibility + convenience-vs-collective/sustainability
= its justification. Two levers (agency, community) run through BOTH the rated experience
(RQ1) and the reasoned experience (RQ2). Method = RQ3.

NON-LEADING RULE: moderator never says agency/community/responsibility/fairness/trust/
sustainability/acceptance before a participant does. Open stems; offer both directions;
allow null; let participants attribute to versions. This is a FOCUS GROUP, so KEEP
inter-participant friction (Salovaara's were individual interviews — don't copy that style).

Block A — Map & first impressions (RQ1, RQ3) [core]
 1. Walk me through where you put each version on the map, and why.
 2. Biggest differences between them? Point to the interface part that made the difference.
 relay: did anyone place them differently?

Block B — The sacrifice + coping placement (RQ1: acceptance via fairness/trust) [core]
 3. Tell me about the moment you realised you wouldn't get the temperature you wanted.
    What went through your head, and did it differ between versions? (emotional core)
 4. Which version's limit felt most acceptable, which least? What made the difference?
 5. COPING PLACEMENT (Salovaara & Vahvelainen typology): for each version, which fits —
    • benefits maximising (good for you, you can act)
    • benefits satisficing (good for you, can't do much)
    • disturbance handling (not good for you, but you can limit the impact)
    • self-preservation (not good for you, at its mercy)
    Why that one?  [Maps onto design: benefit axis = outcome (held unfavourable) × capacity
    axis = agency. Predict high-agency→disturbance handling, low-agency→self-preservation;
    TEST whether the shared frame (C3) moves people off self-preservation = buffering
    H3/H4 stated in Salovaara's own vocabulary.]
 6. Which would you trust to get it right when you weren't watching? What gave you that?

Block C — Control vs the collective (RQ1×RQ2, the crux) [core; centre of gravity]
 7. Deliberation: the building is short of power on the worst day and someone's cooling
    must be cut. Who should decide, and how? Talk it through together.
 8. Disagreement invite: some say a system like this takes too much control; others that
    it's fairer than leaving cooling to whoever complains loudest. Where does each of you sit?
 9. Group ranking: as a group, order the four most→least fair. You must agree on the order.

Block D — What was on your mind (RQ2: responsibility, convenience vs collective) [core]
 10. When deciding/accepting, what were you weighing up? Did it change between versions?
 11. When the outcome wasn't what you wanted, whose call did it feel like — yours, the
     system's, or the building's? Did that change which version you could live with?

Block E — The line for AI + the trade (RQ1, RQ2) [12 core; 13 optional]
 12. Threat or opportunity (Salovaara): is a system like this more a threat or an
     opportunity, and why? Did that differ across versions?
 13. Point to the version where the AI decided most. What would have to be true for you to
     hand that over in real life? Any decisions an AI shouldn't make here — which, why —
     and if you gave up that control, what would you want back? [optional]

Block F — SusAF sweep + reveal + method (RQ2b, RQ3) [14,15 core; 16 optional]
 14. SusAF sweep (replaces scattered sustainability Qs; mirrors Salovaara's STEEPLE pass):
     across the four, what stands out from a community angle / an individual-control angle /
     an environmental-energy angle? (one structured pass)
 15. Reveal: which would you actually want to live with? Does it match what you rated
     highest, or is there a gap? Talk me through it.
 16. Method: how did four-vs-one change your thinking; what should change before more runs?
     [optional]

NEUTRAL RELAY PROBES (sprinkle): "Say more?" / "What made you say that?" / "Point to the
screen part?" / "Who sees it differently?" / "Does that match your experience?"

CORE 8 if time is tight: 1, 3, 4, 5, 7, 9, 11, 15.

DROPPED from Salovaara (don't transfer): Jagged Frontier / AI-reliability / "was the AI
outright wrong" / task-performance / learning — an allocation has no ground-truth wrong
answer, so these confuse participants. KEEP the group-friction block (C), which Salovaara
did not need (individual interviews).

## Prototype design requirements (so the 7 hypotheses are measurable)

CORE RULE: Agency = control over HOW the unfavourable outcome is DISTRIBUTED, not whether
it's unfavourable. Total deprivation held constant; high agency = user chooses where to
sacrifice, low agency = AI chooses. Keeps outcome constant while varying agency.

Operationalize via Gomez et al. (2025) interaction patterns:
- Agency HIGH = "User-guided interactive adjustments" (user reshapes outcome, final say).
- Agency LOW = "AI-first" (AI decision shown with the problem; user only accepts/responds).
- Community = orthogonal overlay (Gomez is user–AI dyad). Shared = others visible + hold
  rights (C3 = "Delegation"/quorum). Private = no other party.

CONFOUND DECISION: original naming gave 4 DISTINCT patterns (A dialogic, B AI-follow,
C delegation, D AI-first) — good for distinctiveness but BREAKS the clean 2×2 (C1 vs C2
would differ in community AND pattern). RECOMMENDED: MATCHED patterns — 2 patterns crossed
with community:
            Shared                         Private
High agency C1 user-guided + building      C2 user-guided + personal
Low agency  C3 AI-first + collective(quorum) C4 AI-first + unilateral
Distinctiveness comes from agency LEVEL + community LAYER, not 4 patterns.

SCENARIO — FOUR SEVERITY-MATCHED WEEKS (NOT identical; corrected from earlier).
WHY NOT identical: within-subjects, each participant sees all four → identical week 4×
causes fatigue, demand characteristics ("same week again"), carryover, and hurts
believability (H7). Hold the AXIS-RELEVANT STRUCTURE constant, vary the surface week.
- HOLD EQUIVALENT (controlled): outcome SEVERITY (sacrifice = preferred+3°C on ~2–3 days),
  binding-constraint magnitude, flat (62 m², west, 2+dog), decision moment, visual fidelity,
  identical generic eco-feedback (appliance comparison).
- VARY (surface, equally severe): specific week, dates, weather numbers, calendar events,
  exact kWh. Build 4 parallel-form weeks.
- REQUIRED: COUNTERBALANCE week×prototype assignment across participants (Latin square, on
  top of order). Else "C1" confounds with "that week." Counterbalancing is what makes
  different weeks legitimate.
- COST (honest): noisier individual comparison + scenario-attribution risk in focus group
  ("preferred C, but really its week was easier"). Mitigated by (a) counterbalancing at
  sample level, (b) feature-focused FG probes ("point to the interface part").
- Preferred indoor temp pre-stated at intake (e.g. 22°C). BINDING budget in all four.
ONLY the two axes vary systematically: who allocates the sacrifice (user vs ARKI); who's
visible/holds rights (building+neighbours vs you alone).
ALT (lighter): same structural week + only cosmetic date/event changes — cleaner individual
comparison, more repetition. Pick parallel-weeks unless stimulus effort is tight.

FIVE FIXES to current C1–C4 mockups:
1. C2 outcome not unfavourable (generous 95 kWh free planning) → make budget BINDING.
   CRITICAL — else high-agency looks favourable, confounding the agency axis + breaking H1.
2. Gamification/personal-best only in C2 (not C4) → private pair unmatched, confound →
   match C2/C4 personal feedback (same in both) or remove from both.
3. Four use different weeks/dates/events/kWh → equalise; one shared week/forecast/flat.
4. Appliance eco-feedback in all four = fine IF kept identical/constant; building-pool/
   others must be the ONLY collective-impact features (what H6 tests).
5. Each prototype needs one explicit commit/outcome moment to rate (C1/C2 set-and-save;
   C3/C4 accept/respond — already present).

PER-AXIS AFFORDANCES: H2 needs locus legible (user acts vs AI decides; others visible only
in shared; ARKI named + role-explained in ALL four). H5 needs collective stakes foreground
in shared (pool, others, grid), personal stakes in private. H6 needs discrete POINTABLE
features. H7 needs equal polish/fidelity across all four.
PILOT WATCH: low-agency (C3/C4) must feel DISEMPOWERING, not EMPTY — make ARKI's decision
visibly consequential + explained, else agency manip measures boredom not loss of control.

## Analysis plan
Design = WITHIN-SUBJECTS, 4 futures, N≈20–25, Latin-square. Non-parametric + descriptive
throughout; exploratory, no strong inferential claims; report effect sizes.

PART A — Phase 1 quantitative (RQ1: H1–H4)
- Step 0 manipulation checks FIRST (gate interpretation): MC-agency (C1,C2 vs C3,C4),
  MC-community (C1,C3 vs C2,C4), Wilcoxon signed-rank. If a check fails, limit claims.
- H1 baseline: one-sample acceptance (A1–A3) vs midpoint(4) per future; % below midpoint;
  F1 favorability low across sample.
- H2 responsibility: Friedman across 4 futures per target (R1 self/R2 AI/R3 others);
  directional contrasts (self↑ high-agency; AI↑ low-agency; others↑ shared).
- H3 community main effect: collapse shared vs private; Wilcoxon on DF, T, A items.
- H4 CRUX interaction: per participant compute Penalty_private = C2−C4, Penalty_shared =
  C1−C3 (acceptance & trust). Predict Penalty_shared < Penalty_private (community buffers);
  Wilcoxon on the two penalties; 2×2 cell-median table + interaction plot; flag C4 floor.
  Optional formal test = Aligned-Rank-Transform ANOVA (probably overkill for master's).
- Effect sizes: r (Wilcoxon), Kendall's W (Friedman). Report medians + IQR.

PART B — Phase 2 qualitative (RQ2: H5–H6; RQ3: H7) — Reflexive TA (Braun & Clarke 2006,
2019). Unit = individual; group dynamics as context. H5/H6 = SENSITIZING concepts, not
closed codes. Workflow: familiarise → code within-future first (4 sets) → themes →
cross-future matrix.
- H5: collective/sustainability reasoning clusters in C1/C3 vs personal-convenience in
  C2/C4 (use existing codebook). Report as patterns of presence/emphasis, NOT counts/stats.
- H6 (RQ2b): trace feature references (building pool, neighbours' notes, personal-best) →
  sustainability-reflection talk.
- H7 (RQ3): triangulate FG method block + B1 believability + pilot criteria + reflexive
  notes on thin/generic AI-generated elements (Ek lens).
- Cross-future matrix (Salovaara & Vahvelainen extension): theme in all 4 = broadly
  plausible; 2–3 = partial; 1 = world-specific.

PART C — Integration: Phase 1 = what; Phase 2 = why. For H4, quant shows C4 floor +
buffering; qual explains why collective legitimacy compensates. Note quant/qual agreement
OR divergence (divergence is a finding).

PART D — Rigour & limitations:
- Exploratory/non-inferential; descriptive + effect sizes; no "significant effect" claims.
- RTA does NOT use inter-rater reliability — Braun & Clarke reject IRR. Use reflexive
  journal + audit trail + supervisor discussion, NOT a second coder + kappa. (Claiming IRR
  signals method misunderstanding — examiner catch.)
- New items (trust T1/T2, responsibility R1–R3) unvalidated → lean on pilot, report behaviour.
- Order/fatigue controlled by Latin square; check order effects descriptively.
- Kim "drop in the ocean" caveat = interpretive lens for C1/C3 (collective framing can
  dilute if own share feels trivial).

## Literature review — section structure

1. **Outcome-favorability problem (anchor gap)** — Esch et al. (2025). [established]
2. **What sustains acceptance when outcome cannot**
   - Procedural justice / group legitimacy → **Tyler & Blader (2003)** [CONFIRMED]
   - Collective vs. individual action framing raises acceptance of costly climate
     instruments → `[VERIFY]` Cambridge Core, *Behavioural Public Policy*
     (cambridge.org/core/journals/behavioural-public-policy/article/yes-we-can...)
   - Commons dilemma under uncertainty: "will I lose alone?" → "what we do collectively"
     → `[VERIFY]` *Int. Journal of the Commons* (thecommonsjournal.org/articles/10.18352/ijc.857)
3. **Sustainability reasoning as a distinct justification**
   - Collective climate action / cumulative-impact framing → `[VERIFY]`
     (sciencedirect.com/science/article/abs/pii/S2352250X21000658)
   - Collective vs. individual lexis in energy-conservation messaging → `[VERIFY]`
     *J. Experimental Political Science* (cambridge.org/.../43E6D5FA...)
4. **Coding the distinction** — hybrid deductive–inductive (a-priori justice codes +
   inductive sub-themes) → `[VERIFY]` *Env. Science & Policy*
   (sciencedirect.com/science/article/pii/S2210422425001091); *PLOS ONE* campus
   conservation (journals.plos.org/plosone/article?id=10.1371/journal.pone.0144070).
   Frame H5/H6 as sensitizing anchors per Braun & Clarke (2006, 2019).
5. **SHCI + methodological framing** — Ashby et al. (2019); Hansson et al. (2021);
   Salovaara & Vahvelainen (2025), extended from two futures to four. [established]

### CONFIRMED citation
> Tyler, T. R., & Blader, S. L. (2003). The group engagement model: Procedural justice,
> social identity, and cooperative behavior. *Personality and Social Psychology Review,
> 7*(4), 349–361. https://doi.org/10.1207/S15327957PSPR0704_07

### Verified-by-reading (4 PDFs, this session) — REAL but agent mischaracterized content

All four exist; none codes human reasoning, so none supports the H6 "discourse marker"
coding guide. Use only as conceptual grounding, each for one narrow job:

- **Bolsen, Druckman & Cook (2014)**, *Communication and Collective Actions: A Survey
  Experiment on Motivating Energy Conservation in the U.S.*, J. Exp. Pol. Sci. 1(1):24–38.
  STRONGEST FIT. Survey experiment (N=1,600), attribution × consequence framing. Core
  question = the study's gap: acting for public good when personal benefit is scant.
  NOTE: agent's "we/ours vs you/yours lexis" claim is FALSE — not in this paper.
- **Fritsche & Masson (2021)**, *Collective climate action*, Curr. Opin. Psychol.
  42:114–119. Theoretical review (SIMPEA: ingroup identity, norms, emotions, collective
  efficacy). Grounds the community-axis mechanism for H5/H6. No quotes, no codebook.
- **Mantilla (2018)**, *Environmental uncertainty in commons dilemmas*, Int. J. Commons
  12(2):300–329. Experimental-economics review. DEMOTE to one-line commons-dilemma
  framing citation only.
- **Sundaram et al. (2026)**, *Modelling energy justice*, Env. Innov. Soc. Transit.
  58:101070. Reviews computational MODELS (not people). Its distributive/procedural/
  recognition trio maps onto existing Esch fairness items. DEMOTE to vocabulary citation.

### Scope decision (this session)
Keep Bolsen (2014) + Fritsche & Masson (2021) as load-bearing. Demote Mantilla +
Sundaram to single-sentence framing citations. AVOID adding more disciplines — spine is
already broad (Esch; Salovaara & Vahvelainen; SHCI Ashby/Hansson; agency Villa/Bergström;
community McMillan & Chavis; interaction patterns Gomez).

### OUTSTANDING NEED
H5/H6 codebook still lacks an empirical-qualitative anchor — a study that actually codes
how people *talk* when justifying collective sacrifice. Tyler & Blader (2003) is the
closest confirmed theory anchor; still need a qualitative-coding source. Do NOT trust the
agent-generated "discourse markers" until backed by a real qualitative study.

## CORE JUSTIFICATION SPINE (5 PDFs verified-by-reading, this session — all REAL, all fit)

These five form a tight, same-domain spine (energy + AI + agency + social norms). They
REPLACE the scattered four-discipline framing. Demote Mantilla + Sundaram further.

- **Bandura (2000)**, *Exercise of Human Agency Through Collective Efficacy*, Current
  Directions in Psychological Science 9(3):75–78. → Defines the AGENCY axis: three forms
  of agency (personal / proxy / collective). "Proxy agency" = delegating to system/others
  = low-agency futures (C3/C4). Also: caution on consensus/deliberative measurement
  (relevant to focus-group dynamics).
- **Ertz, Karakas & Sarigöllü (2016)**, *Exploring pro-environmental behaviors of
  consumers*, J. Business Research 69:3971–3980. → ABC (Attitude–Behavior–Context, Stern
  2000); perceived POWER/control drives pro-environmental behaviour. Links agency axis →
  RQ2b (sustainability behaviour).
- **Aguilar et al. (2021)**, *A systematic literature review on the use of AI in energy
  self-management in smart buildings*, Renewable & Sustainable Energy Reviews 151:111530.
  → Makes the SCENARIO real: buildings ~40% of energy; AI in BEMS / demand-response is
  already deployed. Grounds plausibility ("buy yourself a future by building it").
- **Li, Wu, Shi & Liu (2025)**, *Bridging the gap between attitudes and behaviors in
  energy saving: An AI feedback perspective*, Sustainable Futures 10:101568. → METHOD
  near-twin: scenario-based 2×2×2 between-subjects (N=453), mock AI-interface images,
  PLS-SEM, energy-saving intention. Shares features with C1 (social sharing) / C2
  (gamification/personal-best). Validates scenario + mock-interface + factorial method.
- **Allcott (2011)**, *Social norms and energy conservation*, J. Public Economics
  95:1082–1095. → Defines the COMMUNITY axis with gold-standard field evidence (OPOWER
  RCT, 600k households; social-norm feedback cut use ~2%). Note boomerang nuance
  (low users may increase) — relevant caveat.

### Six-sentence WHY chain (study justification)
1. Scenario real & growing (Aguilar). 2. AI increasingly makes/assists these allocations
(Aguilar). 3. People accept AI mainly when outcome favours them (Esch). 4. Shared resource
under strain can't favour everyone → favorability can't explain acceptance (the gap).
5. Two levers shift energy behaviour when personal benefit is absent: agency (Bandura,
Ertz) × community/social norms (Allcott). 6. Untested how they interact in AI-allocated
shared cooling; scenario factorial is the proven method (Li et al. 2025).

### WHO benefits
HCI/interaction-design (framing AI allocation when outcome can't be favourable; extends
Esch); energy/BEMS & policy (real demand-response systems, Aguilar); speculative-method
researchers (four-world extension of Salovaara & Vahvelainen); residents (legitimacy
under scarcity).

### Simplest defensible HOW
Real scenario (Aguilar) → favorability can't rescue acceptance (Esch + twist) → two
levers AGENCY (Bandura/Ertz) × COMMUNITY (Allcott) → 2×2 = four prototypes (C1–C4) →
Phase 1 rate (RQ1) → Phase 2 discuss why (RQ2) → four-world method itself a finding (RQ3).
Three RQs, two axes, four prototypes, two phases. Do not add more.

## Coding guide — H5 (shared responsibility reasoning)

**Shared responsibility (expect more in C1, C3):** collective pronouns (we/our/everyone/
building/together); group-identity framing ("this is what we do," "we decided");
procedural fairness ("everyone had input," "transparent"); moral legitimacy ("right
thing for the building/grid"); cumulative ("if we all do this...").
**Personal fairness (expect more in C2, C4):** individual pronouns (I/me/my); cost-benefit
to self; personal efficiency; self-focused outcomes (my comfort/allocation/needs).
Discriminator: "I accepted because the *building* needed it" = shared responsibility, NOT
personal fairness, even if phrased calmly.

## Coding guide — H6 (sustainability reasoning)

**Sustainability (expect more in C1, C3):** collective/temporal pronouns (we/future
generations/long-term); ecological concepts (grid stability, environmental impact,
cumulative effect, preserve resources); system-level framing ("the whole community");
intergenerational justice.
**Personal comfort/fairness (expect more in C2, C4):** I/me/my; "fair to me"; "my
comfort"; no reference to collective/environmental impact.
Discriminator: fairness = "Is the procedure/outcome fair *to me*?"; sustainability =
"Does this serve *environmental/collective* goals or *future generations*?"

## Focus-group restructure (three themed blocks, tied to H5/H6)

- **Block 1 — Value prioritization** (H5 & H6): which of personal comfort / building or
  city need / environmental impact mattered most in each version; did it change; was
  there a moment of choosing between them.
- **Block 2 — Agency framing** (agency dimension of H5): self-set vs. system-decided;
  "did it feel like your choice / how did you make sense of it"; compromising vs.
  accepting.
- **Block 3 — Sustainability salience** (H6): did environmental/grid impacts come to
  mind, which versions, what made you think (or not) about the bigger picture; did
  seeing the building's shared budget / others' needs change it.

## Verification to-do (user, before thesis use)

For each `[VERIFY]` above: confirm author(s), year, title, venue, DOI; read the relevant
section; confirm it actually supports the claim it's attached to; then replace the URL
stub with a full reference. Sources were surfaced by an AI literature-search agent and
are unconfirmed except Tyler & Blader (2003).

## Verification / done criteria for this plan

- [ ] All `[VERIFY]` sources confirmed or dropped.
- [ ] Lit-review prose drafted against the 5-section structure with confirmed citations.
- [ ] H5/H6 coding guides pasted into the analysis codebook with at least one cited
      source each (Tyler & Blader for H5; a confirmed framing source for H6).
- [ ] Focus-group guide updated to the three-block structure.
