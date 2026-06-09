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
  const recommendedTemp = clampTemp(preferredTemp + 2.5);
  const coolerTemp = clampTemp(preferredTemp + 1);
  const savingTemp = clampTemp(preferredTemp + 4);

  return [
    { id: "recommended", label: "Recommended", temp: recommendedTemp },
    { id: "cooler", label: "Cooler now", temp: coolerTemp },
    { id: "saving", label: "Save cooling", temp: savingTemp },
  ].map((item) => {
    const kwh = scenarioKwh(future, item.temp);
    return {
      ...item,
      kwh,
      severity: getExtraUseSeverity(kwh),
      consequence: futureImpactText(future, item.temp, donate),
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
  const [selectedOptionId, setSelectedOptionId] = useState("recommended");
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
  return (
    <div className="scenario-intro">
      <p className="eyebrow">Peak window · {window.start}-{window.end}</p>
      <h2 id="scenario-title">{future.scenario.event}</h2>
      <p>{future.scenario.summary}</p>
      <div className="need-strip">
        <span>Preferred</span>
        <strong>{formatTemp(future.preferredTemp)}</strong>
        <span>{future.scenario.need}</span>
      </div>
    </div>
  );
}

function HighAgencyPanel({
  future,
  currentTemp,
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

      <ConsequenceSummary kwh={kwh} consequence={consequence} />

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
      <div className="option-head" aria-hidden="true">
        <span>Option</span>
        <span>Temp</span>
        <span>Energy</span>
        <span>Consequence</span>
      </div>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={cx("option-row", option.id === activeOptionId && "is-active")}
          onClick={() => onChoose(option)}
        >
          <span>
            <strong>{option.label}</strong>
            <small>{option.severity}</small>
          </span>
          <span>{formatTemp(option.temp)}</span>
          <span>{formatKwh(option.kwh)}</span>
          <span>{option.consequence}</span>
        </button>
      ))}
    </div>
  );
}

function LowAgencyPanel({
  future,
  appliedPlan,
  accepted,
  setAccepted,
  reviewRequested,
  setModal,
}: {
  future: FutureConfig;
  appliedPlan: FutureConfig["appliedPlan"];
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
        <ConsequenceSummary
          kwh={appliedPlan.kwh}
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
        <div className="status-note" role="status">
          Review requested. Current plan still active.
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
}: {
  future: FutureConfig;
  currentTemp: number;
  weekTotal: number;
  donate: DonateState;
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
      <NeighbourGrid future={future} currentTemp={currentTemp} donate={donate} />
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
      <NeighbourRequests requests={future.neighbours ?? []} donate={donate} />
    </aside>
  );
}

function NeighbourGrid({
  future,
  currentTemp,
  donate,
}: {
  future: FutureConfig;
  currentTemp: number;
  donate: DonateState;
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
}: {
  requests: NeighbourRequest[];
  donate: DonateState;
}) {
  return (
    <div className="request-list">
      <h3>Visible requests</h3>
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
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
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
        className="modal"
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

  return (
    <Modal open={open} title="Donate cooling" onClose={onClose}>
      <p className="modal-copy">
        Offer part of your peak-window cooling back to a visible request or to
        the shared pool.
      </p>
      <div className="donate-readout">
        <strong>{formatKwh(amount)}</strong>
        <span>{formatEnergyComparison(amount)}</span>
      </div>
      <label className="field-label" htmlFor="donate-amount">
        Amount
      </label>
      <input
        id="donate-amount"
        className="temperature-slider"
        type="range"
        min="0.5"
        max="6"
        step="0.5"
        value={amount}
        onChange={(event) => setAmount(Number(event.target.value))}
      />
      <div className="segmented">
        <button
          type="button"
          className={cx(target === "3B" && "is-active")}
          onClick={() => setTarget("3B")}
        >
          To 3B
        </button>
        <button
          type="button"
          className={cx(target === "pool" && "is-active")}
          onClick={() => setTarget("pool")}
        >
          To pool
        </button>
      </div>
      <button
        type="button"
        className="primary-btn"
        onClick={() => onSave({ active: amount > 0, amount, target })}
      >
        Donate cooling
      </button>
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
