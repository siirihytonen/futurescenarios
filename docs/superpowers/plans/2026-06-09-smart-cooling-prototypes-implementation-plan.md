# Smart Cooling Prototype Implementation Plan

Date: 2026-06-09

Design source:

- `docs/superpowers/specs/2026-06-09-smart-cooling-prototypes-design.md`
- `assets/granola-design-system.md`
- Existing HTML references in `assets/c1-mockup_4.html`, `assets/c2-mockup_2.html`, `assets/c3-mockup_2.html`, and `assets/c4-mockup_2.html`

## Current Repo State

The repo currently has no React/Vite/Next scaffold. It contains static HTML prototype references, design/research notes, and local skills. Implementation should add a small Vite React app at the repo root and keep the old HTML files as reference artifacts.



## Implementation Strategy

Build one shared React app with four data-driven futures. Avoid four copied screens. All futures should share:

- One layout shell.
- One Granola-inspired token system.
- One energy model.
- One week rail component.
- One modal system.
- One context-panel structure.

The futures vary through typed data and a small set of interaction modes:

- `agency: "high" | "low"`
- `community: "shared" | "private"`
- `pattern: "communal-dialogic" | "ai-follow" | "shared-ai-first" | "private-ai-first"`

Research labels can exist in code and file names, but must never appear in participant-facing UI.

## Phase 1: Scaffold React/Vite

Files to add:

- `package.json`
- `index.html`
- `vite.config.ts`
- `tsconfig.json`
- `src/main.tsx`
- `src/App.tsx`
- `src/styles/tokens.css`
- `src/styles/app.css`

Dependencies:

- `@vitejs/plugin-react`
- `vite`
- `typescript`
- `react`
- `react-dom`

Avoid adding a component framework. The UI is custom, restrained, and based on the existing prototype feel.

Acceptance checks:

- `npm install` completes.
- `npm run dev` starts locally.
- `npm run build` produces a Vercel-ready static build.

## Phase 2: Design Tokens And App Shell

Create Granola-derived tokens in `src/styles/tokens.css`.

Token groups:

- Warm background and radial gradients.
- Frosted surfaces.
- Terracotta accent.
- Ink/text colors.
- Borders and soft shadows.
- 4/8px spacing scale.
- Type scale from the Granola note, adapted for dense app UI.
- Radius scale, with panels around 12-14px and inner controls smaller.

App shell layout:

- Header area with product/world framing only, no method labels.
- Three-column desktop layout:
  - week rail
  - scenario decision panel
  - context panel
- Responsive layout:
  - stack scenario panel first on narrow screens
  - week rail becomes a horizontal strip
  - context panel follows the decision panel

Preserve the current prototype feel:

- calm warm surfaces
- compact data rows
- soft panel borders
- serif only for page/scenario moments
- clear operational controls

Acceptance checks:

- No visible research labels.
- Text stays readable at small desktop and mobile widths.
- Main action remains visually dominant.

## Phase 3: Energy Model

Create `src/lib/energyModel.ts`.

Constants:

```ts
export const KWH_PER_PEAK_COOLING_HOUR = 1.5;
export const KWH_PER_FLAT_COOL_DAY = 20;
export const BUILDING_FLAT_COUNT = 14;
export const KWH_PER_BUILDING_COOL_DAY = 280;
export const WEEKLY_BUILDING_POOL_KWH = 1400;
```

Functions:

- `estimatePeakKwh(windowHours, setpoint, baselineSetpoint)`
- `getExtraUseSeverity(kwhDelta)`
- `formatEnergyComparison(kwhDelta)`
- `formatTemperatureImpact(target)`
- `calculateWeekTotal(days, scenarioPlan)`
- `calculateBuildingPoolState(futureState)`
- `makeOptionRows(preferredTemp, currentState, futureConfig)`

Comparison rules:

- small: evening lights or laptop session
- medium: laundry load or one hour of cooking
- high: hours of peak cooling for Flat 4C
- very high: full cool day for Flat 4C

Do not use `fridge-days`.

Acceptance checks:

- The same kWh input produces the same severity and comparison in every future.
- C1 shared impact and C2 private impact use the same base energy math.
- No stale 12 kWh cool-day math remains in new code.

## Phase 4: Data Model And Scenario Config

Create `src/data/futures.ts`.

Core types:

- `FutureConfig`
- `WeekDay`
- `PeakWindow`
- `NeighbourRequest`
- `PlanOption`
- `PrivateProgress`
- `BuildingPool`

Shared profile in one place:

```ts
const residentProfile = {
  flat: "4C",
  areaM2: 62,
  orientation: "west-facing",
  household: "two adults",
};
```

Future configs:

1. Communal dialogic:
   - dinner at Flat 4C
   - peak window `18:00-22:00`
   - two neighbour requests
   - actions: ask for more cooling, donate cooling, confirm plan

2. Private AI-follow:
   - sprained ankle, homebound afternoon
   - peak window `14:00-18:00`
   - personal-best/self-history feedback
   - user moves first, ARKI responds

3. Shared AI-first:
   - remote presentation
   - peak window `13:00-17:00`
   - ARKI plan already applied
   - two visible neighbour requests
   - actions: accept plan, ask for more cooling, why this plan

4. Private AI-first:
   - poor sleep before early shift
   - peak window `20:00-00:00`
   - ARKI plan already applied
   - personal-best/self-history feedback
   - actions: accept plan, ask ARKI to review, why this plan

Acceptance checks:

- All futures have past days with used kWh.
- All futures open on the scenario day.
- Shared futures have max two neighbour requests.
- Private futures have zero social/building data.

## Phase 5: Core Components

Create:

- `src/components/PrototypeShell.tsx`
- `src/components/WeekRail.tsx`
- `src/components/ScenarioPanel.tsx`
- `src/components/TemperatureSlider.tsx`
- `src/components/OptionList.tsx`
- `src/components/ConsequenceSummary.tsx`
- `src/components/LockedPlan.tsx`
- `src/components/BuildingContext.tsx`
- `src/components/PrivateContext.tsx`
- `src/components/NeighbourGrid.tsx`
- `src/components/PoolBar.tsx`
- `src/components/WhyPlanModal.tsx`
- `src/components/ReviewModal.tsx`
- `src/components/DonateCoolingModal.tsx`
- `src/components/AskCoolingModal.tsx`

Component rules:

- `WeekRail` handles past/selected/future states but does not own energy math.
- `ScenarioPanel` chooses high-agency or low-agency flow from config.
- `OptionList` is a compact table/list, not cards.
- `LockedPlan` displays `Applied by ARKI` and has no disabled slider.
- `BuildingContext` is never rendered in private futures.
- `PrivateContext` is never rendered in shared futures.
- Modal components handle focus, Escape, backdrop click, and return focus to trigger.

Acceptance checks:

- High-agency futures show slider + option list.
- Low-agency futures show locked applied plan only.
- C1 shows both `Ask for more cooling` and `Donate cooling`.
- C3 shows `Ask for more cooling` but no donate control.
- C4 shows `Ask ARKI to review`.

## Phase 6: Interaction State

Use local React state first. No backend is needed.

State shape:

- selected future
- selected day, initially scenario day
- preferred temperature from intake/default
- current setpoint/option selection
- ARKI response shown or not
- C1 ask note state
- C1 donate amount and recipient/pool state
- low-agency review requested state
- accepted/confirmed state

High-agency flow:

1. User enters/adjusts preferred temperature.
2. ARKI response appears after initial input.
3. Option list updates from energy model.
4. Slider remains active.
5. Confirm locks the current plan visually but can still be edited if the participant changes their mind during exploration.

Low-agency flow:

1. ARKI applied plan appears immediately.
2. User can accept, ask/review, or open explanation.
3. Asking/reviewing changes status copy only.
4. Applied plan remains active.

Acceptance checks:

- In C2, ARKI is not visible as a counter-offer until after the user has made an initial temperature choice.
- In C3/C4, ARKI plan is visible immediately.
- Review requested never changes the applied temperature.
- Donate cooling changes shared pool/neighbour consequence, not private futures.

## Phase 7: Copy And Explanation Pass

Replace old long copy with short, useful copy.

Main-surface copy budget:

- scenario summary: 1 short line
- peak window: 1 line
- energy consequence: 3 visible lines max
- neighbour/private consequence: 1 line
- option rows: compact labels

`Why this plan?` popup:

- three reasoning bullets
-  `How the numbers work` section, where one kwh is traslated
- no long paragraphs

Copy constraints:

- Do not use vulnerable-person stakes.
- Do not use `fridge-days`.
- Do not expose research labels.

Acceptance checks:

- `rg` finds no visible method labels in rendered strings.
- `rg` finds no banned central mechanics in `src`.
- `Why this plan?` never exceeds three reasoning bullets per future.

## Phase 8: Routing And Study Use

Use routes or query parameters that are useful for the researcher without exposing labels in UI.

Suggested routes:

- `/futures/communal-dialogic`
- `/futures/private-follow`
- `/futures/shared-applied`
- `/futures/private-applied`

Optional root route:

- A simple researcher launcher with four links.
- It should not be used as a participant screen.
- If included, label it clearly as a researcher-only launcher.

Participant screens themselves must not show future/cell/method labels.

Acceptance checks:

- Each future can be opened directly via URL.
- Direct URL opens on scenario day.
- Browser refresh preserves the same future.

## Phase 9: Verification

Run:

- `npm run build`
- manual browser check at desktop width
- manual browser check at mobile width
- keyboard navigation through slider, option rows, primary actions, and modals

If Browser tooling is available, inspect:

- no overlapping text
- modal focus works
- week rail usable at small width
- shared grid visible and not visually dominant over the decision
- private futures contain no building/social trace

Script checks to add if time allows:

- basic text grep for banned labels/copy
- unit checks for energy model outputs
- route smoke test

Acceptance checklist:

- No research labels visible.
- All futures open directly on scenario day.
- Past days greyed out and show used kWh.
- Energy feedback visible on main surface.
- C1 has both ask and donate.
- C2 and C4 both show comparable personal-best/self-history framing.
- C3 has shared ARKI-applied plan and review-only interaction.
- C4 has private ARKI-applied plan and review-only interaction.
- Build passes.

## Phase 10: Implementation Order

Recommended commit sequence:

1. Scaffold Vite React app.
2. Add Granola tokens and static layout shell.
3. Add energy model and scenario config.
4. Build week rail and shared/private context panels.
5. Build high-agency flow for C2 first, because it is the simplest user-first case.
6. Build C1 by adding shared context plus ask/donate actions.
7. Build C4 low-agency private locked plan.
8. Build C3 low-agency shared locked plan.
9. Add popups and accessibility polish.
10. Run final verification and fix visual/text issues.

This order keeps the first working slice small, then layers the harder shared behaviours without duplicating code.

## Open Implementation Decisions

These can be decided during implementation without changing the research design:

- Whether the researcher launcher is included in the production Vercel build or kept as a dev-only page.
- Exact route names.
- Exact personal-best target numbers, as long as C2 and C4 use comparable private framing.
- Exact neighbour flat numbers and ordinary notes.

Do not reopen:

- Four data-driven futures, not four copied HTML pages.
- Granola visual direction.
- C1 has both ask and donate.
- C2 and C4 keep comparable personal-best/self-history framing.
- Low agency means locked applied plan with review-only response.
