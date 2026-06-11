/* ARKI cooling study — energy model + the four cell configs.
 * One source of truth, read by app.js. The four cells share everything except
 * the two manipulated axes (agency: set vs accept; community: building vs
 * personal). Severity is held constant: every cell's peak window is capped at
 * the same calibrated warm temperature, personalised to the intake preference.
 */
(function (global) {
  "use strict";

  // ---- constants ----
  var KWH_PER_PEAK_HOUR = 1.5;
  var BUILDING_FLATS = 14;
  var WEEKLY_POOL_KWH = 1400;
  var BASELINE_SETPOINT = 24.5;

  function roundOne(v) { return Math.round(v * 10) / 10; }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  // Preferred indoor temp from intake (querystring ?pref=, else 22).
  function preferredTemp() {
    var p = new URLSearchParams(global.location.search).get("pref");
    var n = p ? parseFloat(p) : NaN;
    return isNaN(n) ? 22 : clamp(n, 16, 28);
  }

  // Discomfort calibration: the binding cap ARKI imposes on the peak window.
  // Held in the 27–29 °C "too hot" band, scaled gently to the participant's
  // own comfort point so the felt distance is similar for everyone.
  function capTemp(pref) { return clamp(roundOne(pref + 6), 27, 29); }

  // kWh used in the peak window at a given setpoint. Cooler setpoint = more kWh.
  function peakKwh(hours, setpoint) {
    var base = hours * KWH_PER_PEAK_HOUR;
    var factor = 1 + (BASELINE_SETPOINT - setpoint) * 0.14;
    return roundOne(Math.max(base * 0.4, base * factor));
  }

  function severity(kwh) {
    if (kwh < 3) return "Low extra use";
    if (kwh < 4.5) return "Moderate extra use";
    if (kwh < 6.5) return "High extra use";
    return "Very high extra use";
  }

  // Generic appliance comparison — IDENTICAL feedback in all four cells (not an
  // axis feature; it must not vary).
  function applianceCompare(kwh) {
    var hours = Math.max(1, Math.round(kwh / KWH_PER_PEAK_HOUR));
    return "about the same energy as " + hours + " hour" + (hours === 1 ? "" : "s") +
      " of running the oven";
  }

  function fmtKwh(kwh) { return roundOne(kwh).toFixed(1) + " kWh"; }
  function fmtTemp(t) { return (t % 1 === 0 ? t.toFixed(0) : roundOne(t).toFixed(1)) + " °C"; }
  function fmtSigned(v) {
    var r = roundOne(v);
    if (r === 0) return "0.0 kWh";
    return (r > 0 ? "+" : "−") + Math.abs(r).toFixed(1) + " kWh";
  }

  var RESIDENT = { flat: "4C", areaM2: 62, orientation: "west-facing", floor: "4th floor", household: "two adults" };

  // ARKI's reasoning — WORD-FOR-WORD identical in every cell (trust is a
  // deliberately constant DV; the wording must not leak agency or community).
  var ARKI_REASON =
    "ARKI capped the peak window to keep total cooling within the heatwave limit. " +
    "It used your set comfort temperature, today's forecast, your flat " +
    "(62 m², west-facing, 4th floor), and twelve months of your own use.";

  // "What ARKI used about you" — procedural-fairness hook, HIGH-AGENCY cells only.
  var ARKI_KNOWS = [
    "Your set comfort temperature (" , "°C)",  // filled with pref at render
    "62 m², west-facing, 4th floor",
    "Today's forecast and the seven-day outlook",
    "Twelve months of your own cooling use",
  ];

  // a day in the week strip
  function day(label, date, outside, event, state, temp, hours) {
    hours = hours || 4;
    return { label: label, date: date, outside: outside, event: event, state: state,
      plannedTemp: temp, kwh: peakKwh(hours, temp) };
  }

  // ---- the four cells (parallel, severity-matched weeks) ----
  var CELLS = {
    c1: {
      id: "c1", agency: "high", community: "shared",
      title: "Cooling week",
      reliability: "forecasts within 1 °C · 2 summers",
      scenario: { event: "Dinner at your flat", start: "18:00", end: "22:00", hours: 4, outside: 36,
        dayLabel: "Thu", dayDate: "17 Jul",
        consequence: "a 28 °C flat while you host dinner tonight" },
      week: [
        day("Mon", "14 Jul", 33, "Heatwave begins", "past", 26.5),
        day("Tue", "15 Jul", 34, "Work from home", "past", 27),
        day("Wed", "16 Jul", 35, "Warm evening", "past", 26.5),
        day("Thu", "17 Jul", 36, "Dinner at your flat", "today", 28),
        day("Fri", "18 Jul", 35, "Laundry evening", "future", 27),
        day("Sat", "19 Jul", 36, "Quiet night", "future", 27.5),
        day("Sun", "20 Jul", 34, "Heat eases", "future", 27),
      ],
      building: { poolKwh: WEEKLY_POOL_KWH, othersPlannedKwh: 890 },
      neighbours: [
        { flat: "3B", note: "heat-sensitive resident, guests until 21:00", asksTemp: 26 },
        { flat: "2D", note: "cooking for visiting family, kitchen runs hot", asksTemp: 26.5 },
      ],
      whyBullets: [
        "Demand is highest 18:00–22:00; most flats have already planned that window.",
        "Holding your flat cooler now pulls from the shared pool that 3B and 2D also draw on.",
        "Letting it stay at 28 °C leaves more in the reserve for the flats that asked.",
      ],
    },
    c2: {
      id: "c2", agency: "high", community: "private",
      title: "Cooling week",
      reliability: "forecasts within 1 °C · 2 summers",
      scenario: { event: "Recovering at home", start: "14:00", end: "18:00", hours: 4, outside: 35,
        dayLabel: "Tue", dayDate: "22 Jul",
        consequence: "a 28 °C flat while you are stuck at home resting a sprained ankle" },
      week: [
        day("Mon", "21 Jul", 34, "Heat carries over", "past", 27),
        day("Tue", "22 Jul", 35, "Recovering at home", "today", 28),
        day("Wed", "23 Jul", 36, "Remote errands", "future", 27),
        day("Thu", "24 Jul", 36, "Quiet day", "future", 27.5),
        day("Fri", "25 Jul", 35, "Evening open", "future", 27),
        day("Sat", "26 Jul", 34, "Recovery day", "future", 26.5),
        day("Sun", "27 Jul", 33, "Heat eases", "future", 27),
      ],
      personal: { targetKwh: 78, currentKwh: 31, recentAverageKwh: 82, personalBestKwh: 73,
        status: "Close to your best heatwave week" },
      whyBullets: [
        "Demand is highest 14:00–18:00 during the worst of the heat.",
        "Your household has a fixed cooling budget for the heatwave week.",
        "Holding 22 °C now would use budget that later peak windows still need.",
      ],
    },
    c3: {
      id: "c3", agency: "low", community: "shared",
      title: "Cooling week",
      reliability: "forecasts within 1 °C · 2 summers",
      scenario: { event: "Remote presentation", start: "13:00", end: "17:00", hours: 4, outside: 36,
        dayLabel: "Fri", dayDate: "8 Aug",
        consequence: "a 28 °C flat through your remote presentation this afternoon" },
      week: [
        day("Mon", "4 Aug", 33, "Heat advisory", "past", 27),
        day("Tue", "5 Aug", 34, "Work from home", "past", 26.5),
        day("Wed", "6 Aug", 35, "Long calls", "past", 27),
        day("Thu", "7 Aug", 36, "Forecast revised", "past", 27),
        day("Fri", "8 Aug", 36, "Remote presentation", "today", 28),
        day("Sat", "9 Aug", 34, "Cleaning", "future", 27),
        day("Sun", "10 Aug", 32, "Cooler evening", "future", 27),
      ],
      building: { poolKwh: WEEKLY_POOL_KWH, othersPlannedKwh: 940 },
      neighbours: [
        { flat: "3B", note: "heat-sensitive resident, guests until 21:00", asksTemp: 26 },
        { flat: "5A", note: "infant at home", asksTemp: 25.5 },
      ],
      appliedTemp: 28,
      log: [
        { t: "11:40", s: "Building peak limit set for 13:00–17:00 — grid contract." },
        { t: "11:42", s: "ARKI capped every flat's peak window to hold the building under the limit." },
        { t: "11:42", s: "5A (infant) and 3B (heat-sensitive) held at their requested cooling first." },
        { t: "11:43", s: "Your flat 4C set to 28 °C for the window." },
      ],
      whyBullets: [
        "The building is short of power 13:00–17:00 on the worst day of the heatwave.",
        "ARKI protected the flats that asked first — an infant in 5A, a heat-sensitive resident in 3B.",
        "Your 28 °C keeps the shared reserve from falling to a brownout for everyone.",
      ],
    },
    c4: {
      id: "c4", agency: "low", community: "private",
      title: "Cooling week",
      reliability: "forecasts within 1 °C · 2 summers",
      scenario: { event: "Early shift tomorrow", start: "20:00", end: "00:00", hours: 4, outside: 35,
        dayLabel: "Sat", dayDate: "23 Aug",
        consequence: "a 28 °C flat tonight before your 05:15 shift tomorrow" },
      week: [
        day("Mon", "18 Aug", 33, "Early shift", "past", 27),
        day("Tue", "19 Aug", 34, "Early shift", "past", 27),
        day("Wed", "20 Aug", 35, "Dentist after work", "past", 26.5),
        day("Thu", "21 Aug", 36, "Warm evening", "past", 27),
        day("Fri", "22 Aug", 35, "Groceries", "past", 27),
        day("Sat", "23 Aug", 35, "Early shift tomorrow", "today", 28),
        day("Sun", "24 Aug", 33, "Early shift", "future", 27),
      ],
      personal: { targetKwh: 78, currentKwh: 69, recentAverageKwh: 82, personalBestKwh: 73,
        status: "Near your personal heatwave target" },
      appliedTemp: 28,
      log: [
        { t: "19:30", s: "Household peak limit reached for the heatwave week." },
        { t: "19:31", s: "ARKI set tonight's peak window to hold the week under your budget." },
        { t: "19:31", s: "Your flat 4C set to 28 °C, 20:00–00:00." },
      ],
      whyBullets: [
        "Your household has used most of its cooling budget for the heatwave week.",
        "ARKI set tonight warmer so the rest of the week stays within the budget.",
        "Holding 22 °C tonight would push the budget over before the heat eases.",
      ],
    },
  };

  global.ARKI = {
    KWH_PER_PEAK_HOUR: KWH_PER_PEAK_HOUR, BUILDING_FLATS: BUILDING_FLATS,
    WEEKLY_POOL_KWH: WEEKLY_POOL_KWH, RESIDENT: RESIDENT, ARKI_REASON: ARKI_REASON,
    ARKI_KNOWS: ARKI_KNOWS, CELLS: CELLS,
    roundOne: roundOne, clamp: clamp, preferredTemp: preferredTemp, capTemp: capTemp,
    peakKwh: peakKwh, severity: severity, applianceCompare: applianceCompare,
    fmtKwh: fmtKwh, fmtTemp: fmtTemp, fmtSigned: fmtSigned,
  };
})(window);
