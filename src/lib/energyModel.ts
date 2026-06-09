export const KWH_PER_PEAK_COOLING_HOUR = 1.5;
export const KWH_PER_FLAT_COOL_DAY = 20;
export const BUILDING_FLAT_COUNT = 14;
export const KWH_PER_BUILDING_COOL_DAY = 280;
export const WEEKLY_BUILDING_POOL_KWH = 1400;

export type ExtraUseSeverity =
  | "Low extra use"
  | "Moderate extra use"
  | "High extra use"
  | "Very high extra use";

export function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}

export function estimatePeakKwh(
  windowHours: number,
  setpoint: number,
  baselineSetpoint = 24.5,
) {
  const baseline = windowHours * KWH_PER_PEAK_COOLING_HOUR;
  const setpointFactor = 1 + (baselineSetpoint - setpoint) * 0.18;
  return roundOne(Math.max(baseline * 0.45, baseline * setpointFactor));
}

export function getExtraUseSeverity(kwh: number): ExtraUseSeverity {
  if (kwh < 4) return "Low extra use";
  if (kwh < 6.5) return "Moderate extra use";
  if (kwh < 10) return "High extra use";
  return "Very high extra use";
}

export function formatKwh(kwh: number) {
  return `${roundOne(kwh).toFixed(1)} kWh`;
}

export function formatTemp(temp: number) {
  return `${roundOne(temp).toFixed(temp % 1 === 0 ? 0 : 1)} C`;
}

export function formatEnergyComparison(kwh: number) {
  if (kwh < 0.6) return "About one evening of lights";
  if (kwh < 1.2) return "About one laptop work session";
  if (kwh < 2.5) return "About two laundry loads";
  if (kwh < 4.5) return "About two hours of cooking";
  if (kwh < KWH_PER_FLAT_COOL_DAY) {
    const hours = Math.max(1, Math.round(kwh / KWH_PER_PEAK_COOLING_HOUR));
    return `About ${hours} hours of peak cooling for your flat`;
  }

  const days = roundOne(kwh / KWH_PER_FLAT_COOL_DAY);
  return `About ${days.toFixed(days % 1 === 0 ? 0 : 1)} full cool days for your flat`;
}

export function clampTemp(temp: number) {
  return Math.min(29, Math.max(20, roundOne(temp)));
}
