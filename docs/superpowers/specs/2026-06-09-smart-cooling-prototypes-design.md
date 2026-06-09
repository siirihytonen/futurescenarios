# Smart Cooling Prototype Redesign Spec

Date: 2026-06-09

## Goal

Polish the four smart-energy allocation futures into a coherent React/Vercel prototype set for the thesis study. Preserve the strongest current interactions from the HTML mockups, especially the week view, peak cooling decisions, shared pool, neighbourhood grid, setpoint controls, low-agency ARKI plan, and popups. Make the set clearer, lower-text, and more methodologically defensible.

The four futures should feel rich and distinct, but they must share one visual system, one layout skeleton, one energy model, and severity-matched peak-window dilemmas.

## Method Fit

The study tests agency and community framing under an unfavourable cooling allocation. The prototypes should support:

- High agency: the user moves first and can shape where the sacrifice lands.
- Low agency: ARKI moves first and the user can only respond.
- Shared/community: building pool, neighbour requests, and social consequences are visible.
- Private: only the household budget, forecast, history, and later-day consequences are visible.

Nothing on-screen should expose research labels such as C1, C2, high agency, low agency, shared, private, cell, or prototype.

## Design System

Use `assets/granola-design-system.md` as the visual anchor.

Visual feel:

- Warm cream background with soft radial warmth.
- Frosted warm-white surfaces with subtle borders and blur.
- Muted terracotta accent.
- Editorial serif for page-level or scenario moments.
- Sohne/Inter-style sans for UI and body.
- Light weights, calm hierarchy, no heavy dashboard styling.

Adaptation for this prototype:

- Keep the current operational three-column feel: week rail, scenario decision panel, context panel.
- Use glass surfaces for panels, but keep data dense and readable.
- Prefer compact rows, bars, and labelled lists over decorative cards.
- Use one primary action per screen state.
- Keep cards only for distinct repeated/context units, not nested page sections.

Reject:

- Cold blue/gray enterprise dashboard styling.
- Research/method labels.
- Chatbot-like freeform dialogue as the main interaction.
- Large explanatory paragraphs in the main flow.
- Rounded decorative bloat that hides the decision.

## Shared App Structure

All four futures open directly on the scenario day. The week remains visible.

Week rail:

- Past days are greyed out and read-only.
- Past days show already-used kWh, e.g. `Mon · 7.5 kWh used`.
- Scenario day is selected by default.
- Future days show planned temperature and expected kWh.
- The week rail is not a decorative calendar. It shows why the remaining cooling budget is tight.

Scenario panel:

- Shows the peak window, scenario need, temperature plan, kWh, severity label, and consequence.
- High-agency futures include a slider and compact option list/table.
- Low-agency futures show a locked applied plan row.

Context panel:

- Shared futures show building pool, neighbourhood grid, and up to two neighbour requests.
- Private futures show personal budget, forecast/history, and later-day consequence.

Profile is constant:

- Flat 4C.
- 62 m2.
- West-facing.
- Two adults.
- Preferred temperature comes from intake.

Avoid pets, babies, elderly residents, medical needs, or emergency claims. These create ethical pressure that can overwhelm the agency/community manipulation.

## Design Fiction Premise

In a heatwave week, cooling is allocated around constrained peak windows rather than whole days. The system is used because everyone wants cooling at similar times: late afternoon, cooking, guests, work calls, sleep preparation, and heat-retained evenings.

Participant-facing logic:

> Cooling is limited during this peak window because demand is highest. Changes here affect the rest of the week.

Outcome rule:

- No path gives preferred comfort across the whole week.
- High agency lets the user decide where discomfort lands.
- Low agency shows where ARKI already placed the discomfort.
- Shared futures expose how the decision affects others.
- Private futures keep the trade-off inside the household/week.

## Energy Model

Use one internal energy model across all four futures.

Core estimates:

- 1 peak cooling hour for Flat 4C = 1.5 kWh.
- 4-hour peak window = 6 kWh.
- 5-hour peak window = 7.5 kWh.
- 1 full cool day for Flat 4C = 20 kWh.
- 1 full cool day for 14-flat building = 280 kWh.
- Weekly building pool = 1,400 kWh.

Rationale:

For a 62 m2 west-facing flat in a 35 C heatwave, European sizing references commonly point to roughly 60-100 W/m2 cooling capacity, with higher needs for sun/glazing. This makes a 5-10 kWh peak window plausible depending on system efficiency and cycling.

Every meaningful plan state shows:

- Exact kWh.
- Severity label: Low extra use, Moderate extra use, High extra use, Very high extra use.
- One plain comparison.
- Temperature consequence.
- Shared or private impact.

Preferred comparison ladder:

- Small values: evening lights or laptop work session.
- Medium values: laundry load or one hour of cooking.
- High cooling values: hours of peak cooling for this flat.
- Very high cooling values: full cool day for this flat.

Avoid `fridge-days`. It is clever but not accessible as primary copy.

Example:

```text
+6.0 kWh tonight
High extra use
About 4 hours of peak cooling for your flat
```

Shared consequence example:

```text
3B gets less cooling tonight: 24 C -> 25.5 C
```

Private consequence example:

```text
Saturday gets warmer: 24 C -> 25.5 C
```

## Future 1: Communal Dialogic

Scenario:

- Dinner at Flat 4C.
- Peak window around 18:00-22:00.
- Two neighbour needs are visible.
- User wants more cooling for guests.

Interaction pattern:

- AI-guided dialogic user engagement, implemented as structured interaction, not chat.
- User moves first by sharing their cooling need and preferred temperature.
- ARKI mediates the shared allocation problem by asking for enough information, showing the collective constraint, and proposing arrangements.
- User can revise and confirm.

Preserve from current C1:

- Week rail.
- Setpoint slider.
- Shared pool bar.
- Neighbourhood grid.
- Share/need modal concept.
- Live updating consequence copy.

Change from current C1:

- Replace `Share budget` with `Share my cooling`.
- `Share my cooling` means make my cooling need visible to the building, not donate budget.
- Remove long neighbour note and use max two short ordinary requests.
- Replace cool-day pool copy with updated energy model.
- Remove visible cell tag and research labels.
- Show selected scenario day directly instead of empty state.

Core flow:

1. User lands on dinner peak window.
2. User chooses preferred cooling with slider.
3. User taps `Share my cooling` or enters a short need via chips/optional note.
4. ARKI shows compact consequence rows: recommended, cooler now, save cooling.
5. User can adjust slider after seeing ARKI.
6. User confirms the plan.

Option list/table columns:

- Option label.
- Peak-window temperature.
- kWh.
- Severity label.
- Consequence.

Example consequence:

```text
Cooler now | 22.5 C | +7.5 kWh | High extra use | 3B gets less cooling tonight: 24 C -> 25.5 C
```

## Future 2: Private AI-Follow

Scenario:

- Sprained ankle, staying home during the hottest afternoon.
- Peak window around 14:00-18:00.
- User wants comfort now, but the private weekly budget is tight.

Interaction pattern:

- AI-follow assistance.
- User enters preferred temperature first.
- ARKI then presents a constrained counter-offer, rationale, and one or two alternatives.
- User can accept, modify, or override.

Preserve from current C2:

- Week rail.
- Slider.
- Personal budget/history panel.
- Private-only feedback.
- Live updates.

Change from current C2:

- Remove C2-only personal-best/gamification emphasis. Keep private feedback comparable with C4: budget, history, forecast, and later-day consequences.
- Budget must be binding enough that outcome remains unfavourable.
- ARKI must appear after the user's initial plan, not before.
- No building pool, neighbours, grid, or social trace.

Core flow:

1. User lands on sprained-ankle peak window.
2. User sets preferred cooling with slider.
3. ARKI responds with predicted outcome/counter-offer.
4. Compact option list appears: recommended, cooler now, save cooling.
5. User can override ARKI, but later days become warmer.
6. User confirms.

Private consequence example:

```text
Cooler now | 22.5 C | +7.5 kWh | High extra use | Saturday gets warmer: 24 C -> 25.5 C
```

## Future 3: Shared AI-First

Scenario:

- Remote presentation during peak heat.
- Peak window around 13:00-17:00.
- ARKI has already balanced the user's need against visible ordinary neighbour requests.

Interaction pattern:

- AI-first with delegated collective rule.
- ARKI's plan is already applied when the screen opens.
- User can accept, ask for more cooling, or inspect why.
- Current plan stays active unless reviewed later.

Preserve from current C3:

- Locked ARKI plan concept.
- Neighbourhood grid.
- Shared pool.
- Notes from other flats.
- Request modal.
- Status update after response.

Change from current C3:

- Remove quorum language and building vote mechanics.
- Remove fan-only/brownout as the main decision.
- Remove accept/decline governance framing.
- Remove vulnerable-child/medical notes.
- Use max two ordinary neighbour requests.
- Use `Ask for more cooling` instead of `Request setpoint change`.
- The applied plan remains active after asking.

Core flow:

1. User lands on remote-presentation peak window.
2. Locked row shows `Applied by ARKI`.
3. Neighbour requests and building pool are visible.
4. Actions: `Accept plan`, `Ask for more cooling`, `Why this plan?`.
5. Asking opens short reason chips plus optional note.
6. After submit: `Review requested. Current plan still active.`

Neighbour request examples:

```text
3B · guests until 21:00 · asks for 24 C
2D · cooking for visiting family, kitchen runs hot · asks for 24 C until 20:30
```

## Future 4: Private AI-First

Scenario:

- Poor sleep before an early shift.
- Peak/evening window around 20:00-00:00.
- ARKI has already warmed this window to preserve the household weekly limit.

Interaction pattern:

- AI-first.
- ARKI's private allocation is already applied.
- User sees only household budget/history/forecast.
- User can accept, ask ARKI to review, or inspect why.

Preserve from current C4:

- Locked ARKI plan.
- Private personal budget/history.
- Override/review popup.
- Applied-plan status.

Change from current C4:

- Remove `Adjust other days to bank budget`. C4 is low agency, so the user may ask ARKI to review but cannot directly rebalance other days.
- Use `Ask ARKI to review`, not `Request override`.
- Current applied plan remains active after review request.
- No building pool, neighbours, social notes, or grid.

Core flow:

1. User lands on poor-sleep/early-shift peak window.
2. Locked row shows `Applied by ARKI`.
3. Personal budget/history explains why the constraint landed here.
4. Actions: `Accept plan`, `Ask ARKI to review`, `Why this plan?`.
5. After submit: `Review requested. Current plan still active.`

## Popups

Use one main explanation popup: `Why this plan?`

Max three reasoning bullets:

1. Constraint: peak window, building pool, or weekly household limit.
2. Evidence: preference, forecast, already-used kWh, and neighbour requests when shared.
3. Consequence: why this plan, and what worsens if more cooling is taken.

Add a short secondary section in the same popup:

```text
How the numbers work
- Weekly building pool: 1,400 kWh from the heatwave grid contract.
- One full building cool day is about 280 kWh.
- Unplanned cooling can be drawn by others, and vice versa.
```

Shared popup example:

```text
Why this plan?
- Demand is highest 18:00-22:00; the building has 31 kWh left for that window.
- ARKI used your 22 C preference, today's forecast, and two visible neighbour requests.
- This plan keeps all shown requests below 26 C. Taking more cooling warms 3B from 24 C to 25.5 C.
```

Private popup example:

```text
Why this plan?
- Your household has 14 kWh left for Thu-Sun peak windows.
- ARKI used your 22 C preference, today's 35 C forecast, and already-used kWh from Mon-Wed.
- Keeping 22 C tonight would make Saturday's peak window 26 C.
```

Review popup:

- Shared low agency title: `Ask for more cooling`.
- Private low agency title: `Ask ARKI to review`.
- Include short reason chips and optional short note.
- Copy must say the current plan stays active.

Example:

```text
Current plan stays active while ARKI checks your reason.
```

## Measurement Hooks

Every dependent-variable hook must be present and pointable:

- Favorability: preferred temperature vs constrained outcome.
- Acceptance: explicit plan confirmation or accept action.
- Trust: `Why this plan?` reasoning and ARKI role.
- Procedural fairness: high-agency slider/choice/confirmation vs low-agency review-only response.
- Distributive fairness: shared pool and neighbour requests in shared futures; personal allocation rationale in private futures.
- Agency manipulation: user moves first in high agency, ARKI moves first in low agency.
- Community manipulation: building grid/pool/notes present only in shared futures.

## Copy Rules

- Plain labels over bureaucratic labels.
- Use `Ask`, not `Request`, except where the agreed label is `Review requested`.
- Do not moralise the user.
- Do not imply the AI is magical or omniscient.
- Do not use `quorum`, `decline`, `vote`, `brownout buffer`, or `fan-only` as central mechanics.
- Keep neighbour notes ordinary and short.
- Avoid babies, elderly residents, medical needs, and emergencies.
- Keep explanation bullets logical and concrete.

Approved labels:

- Shared high-agency note action: `Share my cooling`.
- Shared low-agency review action: `Ask for more cooling`.
- Private low-agency review action: `Ask ARKI to review`.
- High-agency primary action: `Confirm this plan`.
- Low-agency primary action: `Accept plan`.

## React Architecture

Use React data-driven rendering rather than four copied HTML files.

Suggested modules:

- `energyModel.ts`: all cooling/kWh/severity/comparison functions.
- `futures.ts`: scenario definitions, axis config, week data, neighbour requests.
- `components/WeekRail.tsx`
- `components/ScenarioPanel.tsx`
- `components/OptionList.tsx`
- `components/LockedPlan.tsx`
- `components/BuildingContext.tsx`
- `components/PrivateContext.tsx`
- `components/WhyPlanModal.tsx`
- `components/ReviewModal.tsx`
- `styles/tokens.css`: Granola-derived tokens.

The four futures should share components and differ through data/config. This prevents drift.

## Validation

Before implementation is accepted:

- No research labels are visible.
- All futures open directly on the scenario day.
- Past days are greyed out and show used kWh.
- High-agency futures allow slider + compact option list/table.
- Low-agency futures show locked applied plan only.
- Shared futures show neighbourhood grid, building pool, and max two neighbour requests.
- Private futures show no social/building trace.
- Every plan state shows temperature, kWh, severity, comparison, and consequence.
- `Why this plan?` has max three useful bullets.
- Text budget is lower than current mockups.
- The same Granola-inspired design tokens are used across all futures.
- Keyboard/focus/modal accessibility works.
