import { useMemo, useState } from "react";
import {
  BUILDING_FLAT_COUNT,
  KWH_PER_BUILDING_COOL_DAY,
  WEEKLY_BUILDING_POOL_KWH,
  clampTemp,
  estimatePeakKwh,
  formatEnergyComparison,
  formatKwh,
  formatTemp,
  getExtraUseSeverity,
  roundOne,
} from "../lib/energyModel";
import {
  type FutureConfig,
  type NeighbourRequest,
  type WeekDay,
  residentProfile,
} from "../data/futures";

type ModalName = "why" | "ask" | "donate" | "review" | null;

interface OptionRow {
  id: string;
  label: string;
  temp: number;
  kwh: number;
  severity: string;
  consequence: string;
}

interface AskState {
  active: boolean;
  reason: string;
  note: string;
}

interface DonateState {
  active: boolean;
  amount: number;
  target: "3B" | "pool";
}

const askChips = ["guests", "work call", "sleep", "cooking heat"];
const reviewChips = ["work call", "sleep", "stuck at home", "too warm"];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function scenarioKwh(future: FutureConfig, temp: number) {
  return estimatePeakKwh(
    future.scenario.peakWindow.hours,
    temp,
    future.baselineSetpoint,
  );
}

function weekDayKwh(day: WeekDay) {
  if (day.state === "past") return day.usedKwh ?? 0;
  return day.plannedKwh ?? 0;
}

function formatSignedKwh(value: number) {
  const rounded = roundOne(value);
  if (rounded === 0) return "0.0 kWh";
  return `${rounded > 0 ? "+" : "-"}${Math.abs(rounded).toFixed(1)} kWh`;
}

function futureWindowCount(future: FutureConfig) {
  return future.week.filter((day) => day.state === "future").length;
}

function weeklyPatternText(future: FutureConfig, kwh: number) {
  const windows = futureWindowCount(future);
  const moderateKwh = scenarioKwh(future, future.baselineSetpoint);
  const delta = roundOne((kwh - moderateKwh) * windows);

  if (Math.abs(delta) < 0.8) {
    return {
      value: "No change",
      detail: "Future initial plans stay close to the current week plan.",
    };
  }

  const direction = delta > 0 ? "adds" : "keeps";
  return {
    value: formatSignedKwh(delta),
    detail:
      delta > 0
        ? `If repeated for ${windows} later peak windows, this ${direction} ${formatKwh(delta)} to the week.`
        : `If repeated for ${windows} later peak windows, this ${direction} ${formatKwh(Math.abs(delta))} flexible.`,
  };
}

function systemPatternText(future: FutureConfig, kwh: number, weekTotal: number) {
  const moderateKwh = scenarioKwh(future, future.baselineSetpoint);
  const deltaPerFlat = roundOne(kwh - moderateKwh);

  if (future.community === "shared" && future.building) {
    const reserve = future.building.poolKwh - future.building.othersPlannedKwh - weekTotal;
    const allFlatsDelta = roundOne(deltaPerFlat * BUILDING_FLAT_COUNT);

    if (Math.abs(allFlatsDelta) < 1) {
      return {
        label: "If the building did this",
        value: "Reserve stable",
        detail: `Shared reserve stays near ${formatKwh(reserve)}.`,
      };
    }

    return {
      label: "If the building did this",
      value: formatSignedKwh(allFlatsDelta),
      detail:
        allFlatsDelta > 0
          ? `The shared reserve would drop to about ${formatKwh(Math.max(0, reserve - allFlatsDelta))}.`
          : `The shared reserve would grow to about ${formatKwh(reserve + Math.abs(allFlatsDelta))}.`,
    };
  }

  const personal = future.personal;
  if (personal) {
    const projected = roundOne(weekTotal + deltaPerFlat * futureWindowCount(future));
    return {
      label: "If this became normal",
      value: formatKwh(projected),
      detail:
        projected > personal.targetKwh
          ? "ARKI would start a later peak window warmer to recover the target."
          : "Your target stays reachable without warming a later peak window.",
    };
  }

  return {
    label: "If this became normal",
    value: formatSignedKwh(deltaPerFlat),
    detail: "ARKI would carry this pattern into later initial plans.",
  };
}

function futureImpactText(future: FutureConfig, temp: number, donate: DonateState) {
  if (future.community === "shared") {
    if (donate.active && donate.amount > 0) {
      return donate.target === "3B"
        ? `3B gets more cooling tonight: 25.5 C -> 24.5 C`
        : `Building reserve improves by ${formatKwh(donate.amount)}`;
    }

    if (temp <= 23.5) {
      return "3B gets less cooling tonight: 24 C -> 25.5 C";
    }

    if (temp >= 25.5) {
      return "3B and 2D stay close to their requested cooling.";
    }

    return "Neighbour requests stay within the shared plan.";
  }

  if (temp <= 23.5) {
    return future.id === "private-follow"
      ? "Saturday gets warmer: 24 C -> 25.5 C"
      : "Sunday gets warmer: 24.5 C -> 26 C";
  }

  if (temp >= 25.5) {
    return future.id === "private-follow"
      ? "Saturday stays near 24 C."
      : "Sunday stays near 24.5 C.";
  }

  return "Later peak windows stay close to the current plan.";
}

function makeOptions(
  future: FutureConfig,
  preferredTemp: number,
  donate: DonateState,
): OptionRow[] {
  const coolTemp = clampTemp(preferredTemp - 1);
  const middleTemp = clampTemp(future.baselineSetpoint);
  const savingTemp = clampTemp(preferredTemp + 5);
  const middleLabel = future.community === "shared" ? "Share" : "Balance";

  function optionConsequence(optionId: string, temp: number) {
    if (future.community === "shared") {
      if (optionId === "cool") {
        return "4C stays cool. 3B gets less cooling: 24 C -> 25.5 C.";
      }
      if (optionId === "middle") {
        return "4C stays usable. 3B and 2D keep their requested plans.";
      }
      return "4C is warm. Extra cooling stays in the shared pool.";
    }

    if (optionId === "cool") {
      return future.id === "private-follow"
        ? "Cool now. Saturday starts warmer: 24 C -> 25.5 C."
        : "Cool now. Sunday starts warmer: 24.5 C -> 26 C.";
    }
    if (optionId === "middle") {
      return "Usable now. Later peak windows stay unchanged.";
    }
    return future.id === "private-follow"
      ? "Warm now. Saturday stays near 24 C."
      : "Warm now. Sunday stays near 24.5 C.";
  }

  return [
    { id: "cool", label: "Cool", temp: coolTemp },
    { id: "middle", label: middleLabel, temp: middleTemp },
    { id: "saving", label: "Save", temp: savingTemp },
  ].map((item) => {
    const kwh = scenarioKwh(future, item.temp);
    return {
      ...item,
      kwh,
      severity: getExtraUseSeverity(kwh),
      consequence: optionConsequence(item.id, item.temp),
    };
  });
}

function selectedDayKwh(
  future: FutureConfig,
  day: WeekDay,
  currentTemp: number,
  lowAgencyPlanKwh: number,
) {
  if (day.id !== future.scenarioDayId) return weekDayKwh(day);
  return future.agency === "high" ? scenarioKwh(future, currentTemp) : lowAgencyPlanKwh;
}

function calculateYourWeekTotal(
  future: FutureConfig,
  currentTemp: number,
  lowAgencyPlanKwh: number,
) {
  return roundOne(
    future.week.reduce(
      (sum, day) => sum + selectedDayKwh(future, day, currentTemp, lowAgencyPlanKwh),
      0,
    ),
  );
}

export function FutureView({ future }: { future: FutureConfig }) {
  const [selectedDayId, setSelectedDayId] = useState(future.scenarioDayId);
  const [currentTemp, setCurrentTemp] = useState(future.preferredTemp);
  const [arkiShown, setArkiShown] = useState(future.agency === "low");
  const [selectedOptionId, setSelectedOptionId] = useState("middle");
  const [ask, setAsk] = useState<AskState>({
    active: false,
    reason: "",
    note: "",
  });
  const [donate, setDonate] = useState<DonateState>({
    active: false,
    amount: 0,
    target: "3B",
  });
  const [reviewRequested, setReviewRequested] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [modal, setModal] = useState<ModalName>(null);

  const selectedDay =
    future.week.find((day) => day.id === selectedDayId) ?? future.week[0];
  const scenarioSelected = selectedDay.id === future.scenarioDayId;
  const appliedPlan = future.appliedPlan;
  const lowAgencyPlanKwh = appliedPlan?.kwh ?? scenarioKwh(future, currentTemp);
  const options = useMemo(
    () => makeOptions(future, future.preferredTemp, donate),
    [future, donate],
  );
  const activeOption =
    options.find((option) => option.id === selectedOptionId) ?? options[0];
  const currentKwh =
    future.agency === "high" ? scenarioKwh(future, currentTemp) : lowAgencyPlanKwh;
  const weekTotal = calculateYourWeekTotal(future, currentTemp, lowAgencyPlanKwh);

  function chooseOption(option: OptionRow) {
    setSelectedOptionId(option.id);
    setCurrentTemp(option.temp);
    setArkiShown(true);
  }

  return (
    <main className="app-shell">
      <Header future={future} weekTotal={weekTotal} />
      <div className="future-grid">
        <WeekRail
          future={future}
          selectedDayId={selectedDayId}
          setSelectedDayId={setSelectedDayId}
          currentTemp={currentTemp}
          lowAgencyPlanKwh={lowAgencyPlanKwh}
        />
        <section className="scenario-card" aria-labelledby="scenario-title">
          {scenarioSelected ? (
            <>
              <ScenarioIntro future={future} />
              {future.agency === "high" ? (
                <HighAgencyPanel
                  future={future}
                  currentTemp={currentTemp}
                  weekTotal={weekTotal}
                  setCurrentTemp={(nextTemp) => {
                    setCurrentTemp(nextTemp);
                    setArkiShown(true);
                    setConfirmed(false);
                  }}
                  options={options}
                  activeOption={activeOption}
                  chooseOption={chooseOption}
                  arkiShown={arkiShown}
                  setArkiShown={setArkiShown}
                  ask={ask}
                  donate={donate}
                  setModal={setModal}
                  confirmed={confirmed}
                  setConfirmed={setConfirmed}
                />
              ) : (
                <LowAgencyPanel
                  future={future}
                  appliedPlan={appliedPlan}
                  weekTotal={weekTotal}
                  accepted={accepted}
                  setAccepted={setAccepted}
                  reviewRequested={reviewRequested}
                  setModal={setModal}
                />
              )}
            </>
          ) : (
            <ReadOnlyDay day={selectedDay} />
          )}
        </section>
        {future.community === "shared" ? (
          <BuildingContext
            future={future}
            currentTemp={currentTemp}
            weekTotal={weekTotal}
            donate={donate}
            userAskActive={ask.active || reviewRequested}
          />
        ) : (
          <PrivateContext future={future} weekTotal={weekTotal} />
        )}
      </div>
      <WhyPlanModal future={future} open={modal === "why"} onClose={() => setModal(null)} />
      <AskCoolingModal
        future={future}
        open={modal === "ask"}
        onClose={() => setModal(null)}
        onSave={(nextAsk) => {
          setAsk(nextAsk);
          setArkiShown(true);
          setModal(null);
        }}
      />
      <DonateCoolingModal
        open={modal === "donate"}
        donate={donate}
        onClose={() => setModal(null)}
        onSave={(nextDonate) => {
          setDonate(nextDonate);
          setArkiShown(true);
          setModal(null);
        }}
      />
      <ReviewModal
        future={future}
        open={modal === "review"}
        onClose={() => setModal(null)}
        onSubmit={() => {
          setReviewRequested(true);
          setModal(null);
        }}
      />
    </main>
  );
}

function Header({
  future,
  weekTotal,
}: {
  future: FutureConfig;
  weekTotal: number;
}) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">ARKI Cooling</p>
        <h1>{future.title}</h1>
      </div>
      <div className="header-meta" aria-label="Flat and week summary">
        <span>{residentProfile.flat}</span>
        <span>{residentProfile.areaM2} m2</span>
        <span>{residentProfile.orientation}</span>
        <strong>{formatKwh(weekTotal)} this week</strong>
      </div>
    </header>
  );
}

function WeekRail({
  future,
  selectedDayId,
  setSelectedDayId,
  currentTemp,
  lowAgencyPlanKwh,
}: {
  future: FutureConfig;
  selectedDayId: string;
  setSelectedDayId: (dayId: string) => void;
  currentTemp: number;
  lowAgencyPlanKwh: number;
}) {
  return (
    <aside className="week-panel" aria-label="Cooling week">
      <div className="panel-heading">
        <h2>The week</h2>
        <p>Past days count toward the remaining plan.</p>
      </div>
      <div className="week-list" role="list">
        {future.week.map((day) => {
          const selected = day.id === selectedDayId;
          const kwh = selectedDayKwh(future, day, currentTemp, lowAgencyPlanKwh);
          const temp =
            day.id === future.scenarioDayId && future.agency === "high"
              ? currentTemp
              : day.plannedTemp;
          return (
            <button
              key={day.id}
              className={cx(
                "day-row",
                day.state === "past" && "is-past",
                day.state === "scenario" && "is-scenario",
                selected && "is-selected",
              )}
              type="button"
              onClick={() => setSelectedDayId(day.id)}
              aria-current={selected ? "true" : undefined}
            >
              <span className="day-date">
                <strong>{day.label}</strong>
                <small>{day.date}</small>
              </span>
              <span className="day-event">{day.event}</span>
              <span className="day-energy">
                {day.state === "past" ? `${formatKwh(kwh)} used` : formatKwh(kwh)}
                {temp ? <small>{formatTemp(temp)}</small> : null}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function ScenarioIntro({ future }: { future: FutureConfig }) {
  const window = future.scenario.peakWindow;
  const scenarioDay = future.week.find((day) => day.id === future.scenarioDayId);
  const sharedCopy =
    future.community === "shared"
      ? "Cooling used in this window draws from the building pool and can change what remains for other flats."
      : "Cooling used in this window counts against your household target and can change later peak windows.";

  return (
    <div className="scenario-intro">
      <p className="eyebrow">Peak window · {window.start}-{window.end}</p>
      <h2 id="scenario-title">Cooling demand is at its peak</h2>
      <p>{sharedCopy}</p>
      <div className="calendar-strip" aria-label="Calendar event during peak cooling">
        <span>Calendar</span>
        <strong>{future.scenario.event}</strong>
        <small>
          {scenarioDay?.label} {scenarioDay?.date} · {scenarioDay?.outside} C outside
        </small>
      </div>
    </div>
  );
}

function HighAgencyPanel({
  future,
  currentTemp,
  weekTotal,
  setCurrentTemp,
  options,
  activeOption,
  chooseOption,
  arkiShown,
  setArkiShown,
  ask,
  donate,
  setModal,
  confirmed,
  setConfirmed,
}: {
  future: FutureConfig;
  currentTemp: number;
  weekTotal: number;
  setCurrentTemp: (temp: number) => void;
  options: OptionRow[];
  activeOption: OptionRow;
  chooseOption: (option: OptionRow) => void;
  arkiShown: boolean;
  setArkiShown: (shown: boolean) => void;
  ask: AskState;
  donate: DonateState;
  setModal: (modal: ModalName) => void;
  confirmed: boolean;
  setConfirmed: (confirmed: boolean) => void;
}) {
  const kwh = scenarioKwh(future, currentTemp);
  const consequence = futureImpactText(future, currentTemp, donate);

  return (
    <div className="decision-stack">
      <div className="setpoint-panel">
        <div className="setpoint-display">
          <span>Your peak plan</span>
          <strong>{formatTemp(currentTemp)}</strong>
        </div>
        <label htmlFor="temperature-slider">Peak-window temperature</label>
        <input
          id="temperature-slider"
          className="temperature-slider"
          type="range"
          min="20"
          max="28"
          step="0.5"
          value={currentTemp}
          onChange={(event) => setCurrentTemp(Number(event.target.value))}
        />
        <div className="slider-scale" aria-hidden="true">
          <span>cooler · more energy</span>
          <span>warmer · less energy</span>
        </div>
      </div>

      <CoolingImpactPanel
        future={future}
        kwh={kwh}
        weekTotal={weekTotal}
        consequence={consequence}
      />

      <div className="action-row">
        {future.community === "shared" ? (
          <>
            <button type="button" className="secondary-btn" onClick={() => setModal("ask")}>
              Ask for more cooling
            </button>
            <button type="button" className="secondary-btn" onClick={() => setModal("donate")}>
              Donate cooling
            </button>
          </>
        ) : null}
        <button type="button" className="secondary-btn" onClick={() => setModal("why")}>
          Why this plan?
        </button>
      </div>

      {future.community === "shared" && (ask.active || donate.active) ? (
        <div className="status-note" role="status">
          {ask.active ? <span>4C need shared: {ask.reason || "cooling needed"}</span> : null}
          {donate.active && donate.amount > 0 ? (
            <span>
              Donating {formatKwh(donate.amount)} to{" "}
              {donate.target === "pool" ? "the shared pool" : donate.target}
            </span>
          ) : null}
        </div>
      ) : null}

      {!arkiShown ? (
        <button type="button" className="primary-btn" onClick={() => setArkiShown(true)}>
          Check with ARKI
        </button>
      ) : (
        <>
          <div className="arki-response">
            <div>
              <p className="eyebrow">ARKI response</p>
              <h3>ARKI found three possible plans</h3>
            </div>
            <OptionList
              options={options}
              activeOptionId={activeOption.id}
              onChoose={chooseOption}
            />
          </div>
          <button
            type="button"
            className="primary-btn"
            onClick={() => setConfirmed(true)}
          >
            {confirmed ? "Plan confirmed" : "Confirm this plan"}
          </button>
        </>
      )}
    </div>
  );
}

function OptionList({
  options,
  activeOptionId,
  onChoose,
}: {
  options: OptionRow[];
  activeOptionId: string;
  onChoose: (option: OptionRow) => void;
}) {
  return (
    <div className="option-list" role="list" aria-label="ARKI options">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={cx("option-row", option.id === activeOptionId && "is-active")}
          onClick={() => onChoose(option)}
        >
          <span className="option-name">
            <strong>{option.label}</strong>
            <small>{formatTemp(option.temp)} · {formatKwh(option.kwh)}</small>
          </span>
          <span className="option-copy">{option.consequence}</span>
        </button>
      ))}
    </div>
  );
}

function LowAgencyPanel({
  future,
  appliedPlan,
  weekTotal,
  accepted,
  setAccepted,
  reviewRequested,
  setModal,
}: {
  future: FutureConfig;
  appliedPlan: FutureConfig["appliedPlan"];
  weekTotal: number;
  accepted: boolean;
  setAccepted: (accepted: boolean) => void;
  reviewRequested: boolean;
  setModal: (modal: ModalName) => void;
}) {
  if (!appliedPlan) return null;

  return (
    <div className="decision-stack">
      <div className="locked-plan">
        <p className="eyebrow">Applied by ARKI</p>
        <div className="locked-main">
          <strong>{formatTemp(appliedPlan.temp)}</strong>
          <span>{future.scenario.peakWindow.start}-{future.scenario.peakWindow.end}</span>
        </div>
        <CoolingImpactPanel
          future={future}
          kwh={appliedPlan.kwh}
          weekTotal={weekTotal}
          consequence={appliedPlan.consequence}
        />
      </div>
      <div className="action-row">
        <button
          type="button"
          className="primary-btn"
          onClick={() => setAccepted(true)}
        >
          {accepted ? "Plan accepted" : "Accept plan"}
        </button>
        <button type="button" className="secondary-btn" onClick={() => setModal("review")}>
          {future.community === "shared" ? "Ask for more cooling" : "Ask ARKI to review"}
        </button>
        <button type="button" className="secondary-btn" onClick={() => setModal("why")}>
          Why this plan?
        </button>
      </div>
      {reviewRequested ? (
        <ReviewReaction future={future} accepted={accepted} />
      ) : null}
      {accepted && !reviewRequested ? (
        <div className="status-note" role="status">
          Plan set for {future.scenario.peakWindow.start}-{future.scenario.peakWindow.end}.
          Eco feedback has been added to this week's record.
        </div>
      ) : null}
    </div>
  );
}

function ConsequenceSummary({
  kwh,
  consequence,
}: {
  kwh: number;
  consequence: string;
}) {
  return (
    <div className="consequence-summary" aria-live="polite">
      <strong>{formatKwh(kwh)} in this peak window</strong>
      <span>{getExtraUseSeverity(kwh)}</span>
      <span>{formatEnergyComparison(kwh)}</span>
      <em>{consequence}</em>
    </div>
  );
}

function CoolingImpactPanel({
  future,
  kwh,
  weekTotal,
  consequence,
}: {
  future: FutureConfig;
  kwh: number;
  weekTotal: number;
  consequence: string;
}) {
  const weekPattern = weeklyPatternText(future, kwh);
  const systemPattern = systemPatternText(future, kwh, weekTotal);
  const reflection =
    future.community === "shared"
      ? "Would this still feel fair if more flats used cooling this way?"
      : "Would this still feel worth it if it became your heatwave pattern?";

  return (
    <section className="cooling-impact" aria-live="polite" aria-label="Cooling impact">
      <div className="impact-heading">
        <span>Cooling impact</span>
        <strong>{formatKwh(kwh)}</strong>
      </div>
      <div className="impact-grid">
        <div>
          <span>Now</span>
          <strong>{formatEnergyComparison(kwh)}</strong>
          <small>{consequence}</small>
        </div>
        <div>
          <span>This week</span>
          <strong>{weekPattern.value}</strong>
          <small>{weekPattern.detail}</small>
        </div>
        <div>
          <span>{systemPattern.label}</span>
          <strong>{systemPattern.value}</strong>
          <small>{systemPattern.detail}</small>
        </div>
      </div>
      <p>{reflection}</p>
    </section>
  );
}

function ReviewReaction({
  future,
  accepted,
}: {
  future: FutureConfig;
  accepted: boolean;
}) {
  if (future.community === "shared") {
    return (
      <div className="review-reaction" role="status">
        <div>
          <p className="eyebrow">Building review updated</p>
          <h3>4C was added to visible cooling needs</h3>
        </div>
        <div className="review-steps" aria-label="Shared review status">
          <span className="is-done">4C ask visible</span>
          <span>ARKI checks released cooling</span>
          <span>Plan still active</span>
        </div>
        <p>
          The current {formatTemp(future.appliedPlan?.temp ?? future.baselineSetpoint)} plan
          stays active while ARKI looks for unused cooling in the building pool.
        </p>
      </div>
    );
  }

  return (
    <div className="review-reaction" role="status">
      <div>
        <p className="eyebrow">ARKI review sent</p>
        <h3>{accepted ? "Plan remains set while ARKI checks it" : "Current plan stays active"}</h3>
      </div>
      <div className="review-steps" aria-label="Private review status">
        <span className="is-done">Reason received</span>
        <span>Budget checked</span>
        <span>Later window protected</span>
      </div>
      <p>
        ARKI will only loosen this window if your household target can still stay under
        the weekly limit.
      </p>
    </div>
  );
}

function ReadOnlyDay({ day }: { day: WeekDay }) {
  const kwh = weekDayKwh(day);
  return (
    <div className="read-only-day">
      <p className="eyebrow">{day.state === "past" ? "Already lived" : "Planned"}</p>
      <h2>{day.event}</h2>
      <p>
        {day.label} {day.date} · {day.outside} C outside
      </p>
      <ConsequenceSummary
        kwh={kwh}
        consequence={
          day.state === "past"
            ? "This day is locked because it has already passed."
            : "This day still counts toward the rest of the week."
        }
      />
    </div>
  );
}

function BuildingContext({
  future,
  currentTemp,
  weekTotal,
  donate,
  userAskActive,
}: {
  future: FutureConfig;
  currentTemp: number;
  weekTotal: number;
  donate: DonateState;
  userAskActive: boolean;
}) {
  const building = future.building;
  if (!building) return null;

  const planned = building.othersPlannedKwh + weekTotal;
  const donatedToPool = donate.active && donate.target === "pool" ? donate.amount : 0;
  const reserve = Math.max(0, building.poolKwh - planned + donatedToPool);
  const reservePct = Math.max(0, Math.min(100, (reserve / building.poolKwh) * 100));
  const yoursPct = Math.max(0, Math.min(100, (weekTotal / building.poolKwh) * 100));
  const othersPct = Math.max(0, Math.min(100, (building.othersPlannedKwh / building.poolKwh) * 100));

  return (
    <aside className="context-panel" aria-label="Building context">
      <div className="panel-heading">
        <h2>Building this week</h2>
        <p>{BUILDING_FLAT_COUNT} flats sharing {formatKwh(WEEKLY_BUILDING_POOL_KWH)}</p>
      </div>
      <NeighbourGrid
        future={future}
        currentTemp={currentTemp}
        donate={donate}
        userAskActive={userAskActive}
      />
      <div className="pool-card">
        <h3>Shared pool</h3>
        <div className="pool-bar" aria-label="Shared pool allocation">
          <span className="pool-others" style={{ width: `${othersPct}%` }} />
          <span className="pool-yours" style={{ width: `${yoursPct}%` }} />
          <span className="pool-reserve" style={{ width: `${reservePct}%` }} />
        </div>
        <dl className="metric-list">
          <div>
            <dt>Other flats</dt>
            <dd>{formatKwh(building.othersPlannedKwh)}</dd>
          </div>
          <div>
            <dt>Your week</dt>
            <dd>{formatKwh(weekTotal)}</dd>
          </div>
          <div>
            <dt>Reserve</dt>
            <dd>{formatKwh(reserve)}</dd>
          </div>
        </dl>
      </div>
      <NeighbourRequests
        requests={future.neighbours ?? []}
        donate={donate}
        userAskActive={userAskActive}
      />
    </aside>
  );
}

function NeighbourGrid({
  future,
  currentTemp,
  donate,
  userAskActive,
}: {
  future: FutureConfig;
  currentTemp: number;
  donate: DonateState;
  userAskActive: boolean;
}) {
  const flats = [
    "1A",
    "1B",
    "1C",
    "2A",
    "2B",
    "2C",
    "2D",
    "3A",
    "3B",
    "3C",
    "3D",
    "4A",
    "4B",
    "4C",
  ];
  const impacted = currentTemp <= 23.5 && !(donate.active && donate.amount > 0);

  return (
    <div className="neighbourhood">
      <h3>Neighbourhood grid</h3>
      <div className="flat-grid" role="grid" aria-label="Flats in the building">
        {flats.map((flat) => (
          <span
            key={flat}
            className={cx(
              "flat-tile",
              flat === residentProfile.flat && "is-you",
              flat === residentProfile.flat && userAskActive && "has-request",
              future.neighbours?.some((request) => request.flat === flat) && "has-request",
              impacted && flat === "3B" && "is-impacted",
            )}
            role="gridcell"
          >
            {flat}
          </span>
        ))}
      </div>
    </div>
  );
}

function NeighbourRequests({
  requests,
  donate,
  userAskActive,
}: {
  requests: NeighbourRequest[];
  donate: DonateState;
  userAskActive: boolean;
}) {
  return (
    <div className="request-list">
      <h3>Visible requests</h3>
      {userAskActive ? (
        <div className="request-item is-you">
          <strong>4C</strong>
          <span>{residentProfile.flat} need added for this peak window</span>
          <small>visible in the building review</small>
        </div>
      ) : null}
      {requests.map((request) => {
        const improved =
          donate.active && donate.amount > 0 && donate.target === request.flat;
        return (
          <div className="request-item" key={request.flat}>
            <strong>{request.flat}</strong>
            <span>{request.note}</span>
            <small>
              asks for {formatTemp(request.requestedTemp)}
              {improved ? " · helped by your donation" : ""}
            </small>
          </div>
        );
      })}
    </div>
  );
}

function PrivateContext({
  future,
  weekTotal,
}: {
  future: FutureConfig;
  weekTotal: number;
}) {
  const personal = future.personal;
  if (!personal) return null;

  const targetPct = Math.min(100, (weekTotal / personal.targetKwh) * 100);
  const bestPct = Math.min(100, (personal.personalBestKwh / personal.targetKwh) * 100);

  return (
    <aside className="context-panel" aria-label="Private household context">
      <div className="panel-heading">
        <h2>Your cooling pattern</h2>
        <p>{personal.status}</p>
      </div>
      <div className="personal-progress">
        <div className="progress-number">{formatKwh(weekTotal)}</div>
        <div className="target-bar" aria-label="Week total against personal target">
          <span className="target-fill" style={{ width: `${targetPct}%` }} />
          <span className="target-marker" style={{ left: `${bestPct}%` }} />
        </div>
        <div className="target-scale">
          <span>0</span>
          <span>target {formatKwh(personal.targetKwh)}</span>
        </div>
      </div>
      <dl className="metric-list">
        <div>
          <dt>Personal best</dt>
          <dd>{formatKwh(personal.personalBestKwh)}</dd>
        </div>
        <div>
          <dt>Recent average</dt>
          <dd>{formatKwh(personal.recentAverageKwh)}</dd>
        </div>
        <div>
          <dt>Household</dt>
          <dd>{residentProfile.areaM2} m2 · {residentProfile.household}</dd>
        </div>
      </dl>
      <div className="private-note">
        <strong>No building data shown</strong>
        <span>Your plan uses only your household budget, history, and forecast.</span>
      </div>
    </aside>
  );
}

function Modal({
  open,
  title,
  children,
  onClose,
  variant,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  variant?: "donate";
}) {
  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={cx("modal", variant === "donate" && "modal-donate")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
          x
        </button>
        <h2 id="modal-title">{title}</h2>
        {children}
      </section>
    </div>
  );
}

function WhyPlanModal({
  future,
  open,
  onClose,
}: {
  future: FutureConfig;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} title="Why this plan?" onClose={onClose}>
      <ul className="reason-list">
        {future.whyBullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <div className="numbers-note">
        <h3>How the numbers work</h3>
        <p>
          The heatwave building pool is {formatKwh(WEEKLY_BUILDING_POOL_KWH)}
          from the building's grid contract. ARKI starts each flat from size and
          occupancy, then reopens unused planned cooling for the week. One full
          building cool day is about {formatKwh(KWH_PER_BUILDING_COOL_DAY)}.
          Estimates vary with humidity, shading, door opening, and cooling cycles.
        </p>
      </div>
    </Modal>
  );
}

function AskCoolingModal({
  future,
  open,
  onClose,
  onSave,
}: {
  future: FutureConfig;
  open: boolean;
  onClose: () => void;
  onSave: (ask: AskState) => void;
}) {
  const [reason, setReason] = useState(askChips[0]);
  const [note, setNote] = useState("");

  return (
    <Modal
      open={open}
      title={future.community === "shared" ? "Ask for more cooling" : "Cooling need"}
      onClose={onClose}
    >
      <p className="modal-copy">
        Keep it short. Your note helps ARKI place your peak-window need against
        the rest of the plan.
      </p>
      <ChipGroup chips={askChips} selected={reason} onSelect={setReason} />
      <label className="field-label" htmlFor="ask-note">
        Short note
      </label>
      <textarea
        id="ask-note"
        value={note}
        maxLength={80}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Guests arrive at 18:30."
      />
      <button
        type="button"
        className="primary-btn"
        onClick={() => onSave({ active: true, reason, note })}
      >
        Share need
      </button>
    </Modal>
  );
}

function DonateCoolingModal({
  open,
  donate,
  onClose,
  onSave,
}: {
  open: boolean;
  donate: DonateState;
  onClose: () => void;
  onSave: (donate: DonateState) => void;
}) {
  const [amount, setAmount] = useState(donate.amount || 2);
  const [target, setTarget] = useState<DonateState["target"]>(donate.target);
  const requestTotal = 6;
  const requestPercent = Math.round((amount / requestTotal) * 100);
  const targetLabel = target === "pool" ? "the shared pool" : "3B";
  const modalTitle =
    target === "pool" ? "Share cooling with the building pool" : "Share cooling budget with 3B";

  return (
    <Modal open={open} title={modalTitle} onClose={onClose} variant="donate">
      <p className="modal-copy">
        3B asked the building for about {formatKwh(requestTotal)} of extra cooling
        tonight. You can share part of your weekly budget, or add it to the shared
        pool so any flat can draw on it.
      </p>
      <div className="donate-readout" aria-live="polite">
        <div>
          <strong>{roundOne(amount).toFixed(amount % 1 === 0 ? 0 : 1)}</strong>
          <span>kWh</span>
        </div>
        <em>{requestPercent}% of 3B's request</em>
      </div>
      <input
        id="donate-amount"
        className="donate-slider"
        type="range"
        min="0"
        max={requestTotal}
        step="0.5"
        value={amount}
        onChange={(event) => setAmount(Number(event.target.value))}
        aria-label="Amount of cooling to donate"
      />
      <div className="donate-scale" aria-hidden="true">
        <span>0 kWh</span>
        <span>half request</span>
        <span>full request ({requestTotal})</span>
      </div>
      <label className="pool-check">
        <span>
          Or contribute <strong>{formatKwh(amount)}</strong> to the shared building pool
          so any flat can draw from it through ARKI.
        </span>
        <input
          type="checkbox"
          checked={target === "pool"}
          onChange={(event) => setTarget(event.target.checked ? "pool" : "3B")}
        />
        <strong>To pool</strong>
      </label>
      <div className="modal-actions">
        <button type="button" className="secondary-btn" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="primary-btn"
          disabled={amount === 0}
          onClick={() => onSave({ active: amount > 0, amount, target })}
        >
          {target === "pool"
            ? `Add ${formatKwh(amount)} to pool`
            : `Share ${formatKwh(amount)} with ${targetLabel}`}
        </button>
      </div>
    </Modal>
  );
}

function ReviewModal({
  future,
  open,
  onClose,
  onSubmit,
}: {
  future: FutureConfig;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [reason, setReason] = useState(reviewChips[0]);

  return (
    <Modal
      open={open}
      title={future.community === "shared" ? "Ask for more cooling" : "Ask ARKI to review"}
      onClose={onClose}
    >
      <p className="modal-copy">
        Current plan stays active while ARKI checks your reason.
      </p>
      <ChipGroup chips={reviewChips} selected={reason} onSelect={setReason} />
      <label className="field-label" htmlFor="review-note">
        Optional note
      </label>
      <textarea id="review-note" maxLength={80} placeholder="Keep it short." />
      <button type="button" className="primary-btn" onClick={onSubmit}>
        Send request
      </button>
    </Modal>
  );
}

function ChipGroup({
  chips,
  selected,
  onSelect,
}: {
  chips: string[];
  selected: string;
  onSelect: (chip: string) => void;
}) {
  return (
    <div className="chip-group" role="group" aria-label="Reason choices">
      {chips.map((chip) => (
        <button
          type="button"
          key={chip}
          className={cx("chip", chip === selected && "is-selected")}
          onClick={() => onSelect(chip)}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
