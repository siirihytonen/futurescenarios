import {
  estimatePeakKwh,
  formatTemp,
  getExtraUseSeverity,
  type ExtraUseSeverity,
} from "../lib/energyModel";

export type Agency = "high" | "low";
export type Community = "shared" | "private";
export type FuturePattern =
  | "communal-dialogic"
  | "ai-follow"
  | "shared-ai-first"
  | "private-ai-first";
export type DayState = "past" | "scenario" | "future";

export interface WeekDay {
  id: string;
  label: string;
  date: string;
  outside: number;
  event: string;
  state: DayState;
  usedKwh?: number;
  plannedTemp?: number;
  plannedKwh?: number;
}

export interface PeakWindow {
  start: string;
  end: string;
  hours: number;
}

export interface NeighbourRequest {
  flat: string;
  note: string;
  requestedTemp: number;
  currentTemp: number;
}

export interface PersonalProgress {
  targetKwh: number;
  currentKwh: number;
  recentAverageKwh: number;
  personalBestKwh: number;
  status: string;
}

export interface AppliedPlan {
  temp: number;
  kwh: number;
  consequence: string;
}

export interface FutureConfig {
  id: string;
  route: string;
  launcherLabel: string;
  agency: Agency;
  community: Community;
  pattern: FuturePattern;
  scenarioDayId: string;
  preferredTemp: number;
  baselineSetpoint: number;
  title: string;
  scenario: {
    event: string;
    summary: string;
    need: string;
    peakWindow: PeakWindow;
  };
  week: WeekDay[];
  neighbours?: NeighbourRequest[];
  building?: {
    poolKwh: number;
    othersPlannedKwh: number;
    reserveKwh: number;
  };
  personal?: PersonalProgress;
  appliedPlan?: AppliedPlan;
  whyBullets: string[];
}

export const residentProfile = {
  flat: "4C",
  areaM2: 62,
  orientation: "west-facing",
  household: "two adults",
};

function plannedTempKwh(hours: number, temp: number) {
  return estimatePeakKwh(hours, temp);
}

function day(
  id: string,
  label: string,
  date: string,
  outside: number,
  event: string,
  state: DayState,
  temp: number,
  hours = 4,
): WeekDay {
  const kwh = plannedTempKwh(hours, temp);
  return state === "past"
    ? { id, label, date, outside, event, state, usedKwh: kwh, plannedTemp: temp }
    : { id, label, date, outside, event, state, plannedTemp: temp, plannedKwh: kwh };
}

function applied(temp: number, hours: number, consequence: string): AppliedPlan {
  const kwh = plannedTempKwh(hours, temp);
  return {
    temp,
    kwh,
    consequence,
  };
}

export function severityForPlan(plan: AppliedPlan): ExtraUseSeverity {
  return getExtraUseSeverity(plan.kwh);
}

export const futures: FutureConfig[] = [
  {
    id: "communal-dialogic",
    route: "/weeks/jul-17",
    launcherLabel: "17 Jul dinner",
    agency: "high",
    community: "shared",
    pattern: "communal-dialogic",
    scenarioDayId: "thu",
    preferredTemp: 22,
    baselineSetpoint: 24.5,
    title: "Cooling week",
    scenario: {
      event: "Dinner at Flat 4C",
      summary: "Guests arrive during the hottest indoor hours.",
      need: "You want the flat close to 22 C for dinner.",
      peakWindow: { start: "18:00", end: "22:00", hours: 4 },
    },
    week: [
      day("mon", "Mon", "14 Jul", 33, "Heatwave begins", "past", 25),
      day("tue", "Tue", "15 Jul", 34, "Work from home", "past", 24.5),
      day("wed", "Wed", "16 Jul", 35, "Warm evening", "past", 25),
      day("thu", "Thu", "17 Jul", 36, "Dinner at Flat 4C", "scenario", 24.5),
      day("fri", "Fri", "18 Jul", 35, "Laundry evening", "future", 24.5),
      day("sat", "Sat", "19 Jul", 36, "Quiet night", "future", 25),
      day("sun", "Sun", "20 Jul", 34, "Heat eases", "future", 25.5),
    ],
    neighbours: [
      {
        flat: "3B",
        note: "guests until 21:00",
        requestedTemp: 24,
        currentTemp: 24,
      },
      {
        flat: "2D",
        note: "cooking for visiting family, kitchen runs hot",
        requestedTemp: 24,
        currentTemp: 24.5,
      },
    ],
    building: {
      poolKwh: 1400,
      othersPlannedKwh: 890,
      reserveKwh: 116,
    },
    whyBullets: [
      "Demand is highest from 18:00-22:00; most flats have already planned that window.",
      "ARKI used your 22 C preference, today's 36 C forecast, and two visible neighbour requests.",
      "Taking more cooling can warm 3B's plan; donating cooling can improve a request or the reserve.",
    ],
  },
  {
    id: "private-follow",
    route: "/weeks/jul-22",
    launcherLabel: "22 Jul afternoon",
    agency: "high",
    community: "private",
    pattern: "ai-follow",
    scenarioDayId: "tue",
    preferredTemp: 22,
    baselineSetpoint: 24.5,
    title: "Cooling week",
    scenario: {
      event: "Sprained ankle at home",
      summary: "You are stuck inside during the hottest afternoon.",
      need: "You want the flat close to 22 C while you rest.",
      peakWindow: { start: "14:00", end: "18:00", hours: 4 },
    },
    week: [
      day("mon", "Mon", "21 Jul", 34, "Heat carries over", "past", 24.5),
      day("tue", "Tue", "22 Jul", 35, "Sprained ankle at home", "scenario", 24.5),
      day("wed", "Wed", "23 Jul", 36, "Remote errands", "future", 24.5),
      day("thu", "Thu", "24 Jul", 36, "Work calls", "future", 25),
      day("fri", "Fri", "25 Jul", 35, "Evening open", "future", 24.5),
      day("sat", "Sat", "26 Jul", 34, "Recovery day", "future", 24),
      day("sun", "Sun", "27 Jul", 33, "Heat eases", "future", 25.5),
    ],
    personal: {
      targetKwh: 78,
      currentKwh: 31,
      recentAverageKwh: 82,
      personalBestKwh: 73,
      status: "Close to your best heatwave week",
    },
    whyBullets: [
      "Your household has 47 kWh left for the rest of this heatwave week.",
      "ARKI used your 22 C preference, today's 35 C forecast, and already-used kWh from Monday.",
      "Keeping 22 C through the afternoon would make Saturday's peak window warmer.",
    ],
  },
  {
    id: "shared-applied",
    route: "/weeks/aug-08",
    launcherLabel: "8 Aug presentation",
    agency: "low",
    community: "shared",
    pattern: "shared-ai-first",
    scenarioDayId: "fri",
    preferredTemp: 22,
    baselineSetpoint: 24.5,
    title: "Cooling week",
    scenario: {
      event: "Remote presentation",
      summary: "Your presentation lands in the hottest afternoon window.",
      need: "You would prefer 22 C, but ARKI has already applied the shared plan.",
      peakWindow: { start: "13:00", end: "17:00", hours: 4 },
    },
    week: [
      day("mon", "Mon", "4 Aug", 33, "Heat advisory", "past", 25),
      day("tue", "Tue", "5 Aug", 34, "Work from home", "past", 24.5),
      day("wed", "Wed", "6 Aug", 35, "Long calls", "past", 24.5),
      day("thu", "Thu", "7 Aug", 36, "Forecast revised", "past", 25),
      day("fri", "Fri", "8 Aug", 36, "Remote presentation", "scenario", 25.5),
      day("sat", "Sat", "9 Aug", 34, "Cleaning", "future", 25),
      day("sun", "Sun", "10 Aug", 32, "Cooler evening", "future", 25.5),
    ],
    neighbours: [
      {
        flat: "3B",
        note: "guests until 21:00",
        requestedTemp: 24,
        currentTemp: 24.5,
      },
      {
        flat: "5A",
        note: "remote exam",
        requestedTemp: 23.5,
        currentTemp: 24.5,
      },
    ],
    building: {
      poolKwh: 1400,
      othersPlannedKwh: 940,
      reserveKwh: 78,
    },
    appliedPlan: applied(
      25.5,
      4,
      "3B stays at 24.5 C and 5A stays at 24.5 C during the same window.",
    ),
    whyBullets: [
      "Demand is highest from 13:00-17:00 and the shared reserve is down to 78 kWh.",
      "ARKI used your preference, today's 36 C forecast, and two visible neighbour requests.",
      "This applied plan keeps all shown requests below 26 C without moving the whole burden to one flat.",
    ],
  },
  {
    id: "private-applied",
    route: "/weeks/aug-23",
    launcherLabel: "23 Aug evening",
    agency: "low",
    community: "private",
    pattern: "private-ai-first",
    scenarioDayId: "sat",
    preferredTemp: 22,
    baselineSetpoint: 24.5,
    title: "Cooling week",
    scenario: {
      event: "Early shift tomorrow",
      summary: "You need sleep before an early shift.",
      need: "You would prefer 22 C, but ARKI has already warmed the evening window.",
      peakWindow: { start: "20:00", end: "00:00", hours: 4 },
    },
    week: [
      day("mon", "Mon", "18 Aug", 33, "Early shift", "past", 24.5),
      day("tue", "Tue", "19 Aug", 34, "Early shift", "past", 24.5),
      day("wed", "Wed", "20 Aug", 35, "Dentist after work", "past", 24),
      day("thu", "Thu", "21 Aug", 36, "Warm evening", "past", 25),
      day("fri", "Fri", "22 Aug", 35, "Groceries", "past", 24.5),
      day("sat", "Sat", "23 Aug", 35, "Early shift tomorrow", "scenario", 25.5),
      day("sun", "Sun", "24 Aug", 33, "Early shift", "future", 24.5),
    ],
    personal: {
      targetKwh: 78,
      currentKwh: 69,
      recentAverageKwh: 82,
      personalBestKwh: 73,
      status: "ARKI is keeping the week near your personal target",
    },
    appliedPlan: applied(
      25.5,
      4,
      "Sunday stays at 24.5 C instead of warming above 26 C.",
    ),
    whyBullets: [
      "Your household has 9 kWh left before passing the 78 kWh heatwave target.",
      "ARKI used your 22 C preference, today's 35 C forecast, and used kWh from Mon-Fri.",
      "Keeping 22 C tonight would push Sunday's peak window above 26 C.",
    ],
  },
];
