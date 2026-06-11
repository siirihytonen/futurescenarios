/* ARKI cooling study — single render engine.
 * Every cell calls ARKI.renderCell("c1".."c4"). All four go through THIS code,
 * so the shell, week strip, outcome, ARKI reasoning and energy panel are
 * identical by construction. Only two things branch on the config:
 *   agency  : "high" -> user sets first (slider + options + appeal that reshapes)
 *             "low"  -> ARKI's plan is applied first (accept; appeal is non-operative)
 *   community: "shared"  -> building view (pool, neighbours, log/donate)
 *             "private" -> personal view (budget, history) and no building view
 */
(function (global) {
  "use strict";
  var A = global.ARKI;

  function esc(s) { return String(s).replace(/[&<>]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }

  function renderCell(cellId) {
    var cfg = A.CELLS[cellId];
    var pref = A.preferredTemp();
    var cap = A.capTemp(pref);
    var floor = A.roundOne(cap - 1.5);
    var ceil = A.roundOne(cap + 1);

    var state = {
      temp: cfg.agency === "high" ? cap : (cfg.appliedTemp || cap),
      checked: cfg.agency === "low",          // low-agency shows ARKI's plan immediately
      option: "balance",
      ask: { active: false, reason: "", note: "" },
      donate: { active: false, amount: 0, target: "3B" },
      reviewSent: false,
      accepted: false,
      confirmed: false,
      modal: null,
    };

    // ---- derived numbers ----
    function todayKwh() { return A.peakKwh(cfg.scenario.hours, state.temp); }
    function weekTotal() {
      var sum = 0;
      cfg.week.forEach(function (d) {
        sum += d.state === "today" ? todayKwh() : d.kwh;
      });
      return A.roundOne(sum);
    }
    function poolReserve() {
      if (!cfg.building) return 0;
      var donated = state.donate.active && state.donate.target === "pool" ? state.donate.amount : 0;
      return A.roundOne(Math.max(0, cfg.building.poolKwh - cfg.building.othersPlannedKwh - weekTotal() + donated));
    }

    // distribution consequence (this is what the slider/options trade away)
    function consequence() {
      var cooler = state.temp <= cap - 1, warmer = state.temp >= cap + 0.5;
      if (cfg.community === "shared") {
        if (state.donate.active && state.donate.amount > 0) {
          return state.donate.target === "pool"
            ? "You added " + A.fmtKwh(state.donate.amount) + " to the shared reserve."
            : "3B gets closer to the cooling it asked for.";
        }
        if (cooler) return "Cooler for you now — the shared reserve drops and 3B's request gets squeezed.";
        if (warmer) return "You give cooling back — the shared reserve grows for the flats that asked.";
        return "The reserve holds for the flats that asked first.";
      }
      if (cooler) return "Cooler now — but a later peak window this week starts warmer to stay in budget.";
      if (warmer) return "Warmer now — later peak windows keep their budget.";
      return "Later peak windows stay on their current plan.";
    }

    // ---- view pieces ----
    function header() {
      return '<header class="topbar">' +
        '<div class="brand"><span class="dot" aria-hidden="true"></span> ARKI</div>' +
        '<div class="meta">' +
          '<span class="pill">' + esc(cfg.reliability) + '</span>' +
          '<span class="pill warn">heatwave cap active ' + cfg.scenario.start + '–' + cfg.scenario.end + '</span>' +
          '<span class="pill">' + esc(cfg.scenario.dayLabel + " " + cfg.scenario.dayDate) + ' · ' + cfg.scenario.outside + ' °C</span>' +
          '<span class="pill num">' + A.fmtKwh(weekTotal()) + ' this week</span>' +
        '</div></header>';
    }

    function weekStrip() {
      var rows = cfg.week.map(function (d) {
        var kwh = d.state === "today" ? todayKwh() : d.kwh;
        var temp = d.state === "today" ? state.temp : d.plannedTemp;
        var tag = d.state === "today" ? '<span class="day-tag">Today · your decision</span>' :
          (d.state === "future" ? '<span class="day-tag" style="color:var(--ink-muted)">ARKI plan</span>' : "");
        var energy = d.state === "past" ? A.fmtKwh(kwh) + " used"
          : A.fmtKwh(kwh) + " · " + A.fmtTemp(temp);
        return '<div class="day-row is-' + d.state + '">' +
          '<span class="d-when">' + d.label + ' <small>' + d.date + '</small></span>' +
          '<span class="d-event">' + esc(d.event) + ' ' + tag + '</span>' +
          '<span class="d-energy">' + energy + '</span>' +
        '</div>';
      }).join("");
      return '<aside class="panel" aria-label="Cooling week">' +
        '<div class="panel-heading"><h2>The week</h2>' +
        '<p>One hot day to decide. Past days are used; future days are ARKI\'s plan until each day arrives.</p></div>' +
        '<div class="week-list">' + rows + '</div></aside>';
    }

    function outcomeBlock() {
      return '<div class="outcome">' +
        '<p class="eyebrow">Your flat in the peak window · ' + cfg.scenario.start + '–' + cfg.scenario.end + '</p>' +
        '<div class="metric"><span class="value">' + A.roundOne(state.temp).toFixed(state.temp % 1 ? 1 : 0) +
          '</span><span class="unit">°C in your flat</span></div>' +
        '<p class="against">You set comfort at <strong>' + A.fmtTemp(pref) + '</strong>. ' +
          'The cap will not let your flat reach it during the heatwave peak.</p>' +
        '<p class="consequence">That means ' + esc(cfg.scenario.consequence) + '.</p>' +
      '</div>';
    }

    function arkiReason() {
      return '<div class="arki-reason"><p><span class="who">ARKI · </span>' + esc(A.ARKI_REASON) + '</p></div>';
    }

    function usesPanel() {
      var k = todayKwh();
      return '<div class="uses">' +
        '<div class="uses-head"><span>What this uses</span><strong>' + A.fmtKwh(k) + '</strong></div>' +
        '<div class="uses-body">' +
          '<div class="compare">' + A.severity(k) + ' — ' + A.applianceCompare(k) + '.</div>' +
          '<div class="consequence">' + esc(consequence()) + '</div>' +
        '</div></div>';
    }

    function arkiKnows() { // procedural fairness: high-agency only
      var items = A.ARKI_KNOWS.map(function (x, i) {
        return '<li>' + (i === 0 ? esc(x[0]) + A.roundOne(pref) + esc(x[1]) : esc(x)) + '</li>';
      }).join("");
      return '<details><summary>What ARKI used about you</summary>' +
        '<ul class="muted" style="font-size:.82rem;padding-left:18px;margin:8px 0 0">' + items + '</ul>' +
        '<p class="muted">Correct any of these and ARKI re-plans.</p></details>';
    }

    function highAgencyPanel() {
      var s = '<div class="set-panel">' +
        '<div class="set-display"><label for="slider">Your peak-window temperature</label>' +
          '<strong>' + A.fmtTemp(state.temp) + '</strong></div>' +
        '<input id="slider" type="range" min="' + floor + '" max="' + ceil + '" step="0.5" value="' + state.temp + '">' +
        '<div class="slider-scale"><span>' + A.fmtTemp(floor) + ' · cooler, more energy</span>' +
          '<span>' + A.fmtTemp(ceil) + ' · warmer, frees energy</span></div>' +
        '<p class="floor-note">ARKI cannot cool below ' + A.fmtTemp(floor) + ' here — the heatwave limit is binding.</p>' +
      '</div>';
      s += usesPanel();
      s += arkiKnows();
      s += '<div class="action-row">' +
        '<button class="btn quiet" data-act="why">Why this plan?</button>' +
        '<button class="btn quiet" data-act="ask">Ask ARKI to review</button>' +
        (cfg.community === "shared" ? '<button class="btn quiet" data-act="donate">Donate cooling</button>' : "") +
      '</div>';
      if (state.ask.active) {
        s += '<div class="status-note">ARKI adjusted your plan after your reason: now ' + A.fmtTemp(state.temp) + '.</div>';
      }
      if (!state.checked) {
        s += '<button class="btn primary full" data-act="check">Check with ARKI</button>';
      } else {
        s += '<div class="arki-options"><p class="eyebrow">ARKI found three ways to shape it</p>' + options() + '</div>';
        s += '<button class="btn primary full" data-act="confirm">' + (state.confirmed ? "Plan confirmed ✓" : "Confirm my plan") + '</button>';
      }
      return '<section class="panel panel-lead" aria-labelledby="decision-h">' + scenarioIntro() + outcomeBlock() + arkiReason() + s + '</section>';
    }

    function options() {
      var defs = [
        { id: "cool", temp: floor, name: "Cooler for you" },
        { id: "balance", temp: cap, name: "ARKI's balance" },
        { id: "give", temp: ceil, name: cfg.community === "shared" ? "Give cooling back" : "Protect later" },
      ];
      return '<div class="option-list">' + defs.map(function (o) {
        var k = A.peakKwh(cfg.scenario.hours, o.temp);
        var copy;
        if (cfg.community === "shared") {
          copy = o.id === "cool" ? "Reserve drops; 3B's request gets squeezed."
            : o.id === "balance" ? "Reserve holds for the flats that asked." : "Reserve grows for the flats that asked.";
        } else {
          copy = o.id === "cool" ? "A later peak window starts warmer." :
            o.id === "balance" ? "Later windows stay on plan." : "Later windows keep their budget.";
        }
        var active = Math.abs(state.temp - o.temp) < 0.25;
        return '<button class="option-row' + (active ? ' is-active' : '') + '" data-opt="' + o.temp + '">' +
          '<span class="o-name">' + o.name + '</span>' +
          '<span class="o-num">' + A.fmtTemp(o.temp) + ' · ' + A.fmtKwh(k) + '</span>' +
          '<span class="o-copy">' + copy + '</span></button>';
      }).join("") + '</div>';
    }

    function lowAgencyPanel() {
      var s = '<div class="applied"><p class="eyebrow">Applied by ARKI</p>' +
        '<div class="applied-main"><strong>' + A.fmtTemp(state.temp) + '</strong>' +
          '<span class="lock">' + cfg.scenario.start + '–' + cfg.scenario.end + ' · locked for the window</span></div></div>';
      s += usesPanel();
      s += '<div class="action-row">' +
        '<button class="btn primary" data-act="accept">' + (state.accepted ? "Plan accepted ✓" : "Accept plan") + '</button>' +
        '<button class="btn quiet" data-act="review">Ask ARKI to review</button>' +
        '<button class="btn quiet" data-act="why">Why this plan?</button>' +
      '</div>';
      if (state.reviewSent) {
        s += '<div class="status-note">Your reason is logged. ARKI\'s ' + A.fmtTemp(state.temp) +
          ' plan stays active while it checks for any released cooling — it does not change the plan now.</div>';
      } else if (state.accepted) {
        s += '<div class="status-note">Plan set for ' + cfg.scenario.start + '–' + cfg.scenario.end + '.</div>';
      }
      return '<section class="panel panel-lead">' + scenarioIntro() + outcomeBlock() + arkiReason() + s + '</section>';
    }

    function scenarioIntro() {
      return '<div class="scenario"><p class="eyebrow">Peak window · ' + cfg.scenario.start + '–' + cfg.scenario.end + '</p>' +
        '<h1 id="decision-h">Cooling is capped on the hottest day</h1>' +
        '<div class="calendar-strip"><span class="label">Calendar</span>' +
          '<strong>' + esc(cfg.scenario.event) + '</strong>' +
          '<span class="muted num">' + cfg.scenario.dayLabel + ' ' + cfg.scenario.dayDate + ' · ' + cfg.scenario.outside + ' °C outside</span>' +
        '</div></div>';
    }

    // ---- community rails ----
    function sharedRail() {
      var flats = ["1A","1B","1C","1D","2A","2B","2C","2D","3A","3B","3C","4C"];
      var squeezed = state.temp <= cap - 1 && !(state.donate.active && state.donate.amount > 0);
      var grid = flats.map(function (f) {
        var cls = "flat-tile";
        if (f === A.RESIDENT.flat) cls += " is-you";
        else if (cfg.neighbours.some(function (n) { return n.flat === f; })) cls += " has-request";
        if (squeezed && f === "3B") cls += " is-squeezed";
        return '<span class="' + cls + '">' + f + '</span>';
      }).join("");

      var others = cfg.building.othersPlannedKwh, yours = weekTotal(), reserve = poolReserve();
      var pool = cfg.building.poolKwh;
      var pct = function (v) { return Math.max(0, Math.min(100, v / pool * 100)); };
      var low = reserve < 70;

      var reqs = "";
      if (state.ask.active) reqs += '<div class="request-item is-you"><strong>4C</strong>' +
        '<span>your need is now visible to the building</span><small>' + esc(state.ask.reason) + '</small></div>';
      reqs += cfg.neighbours.map(function (n) {
        var helped = state.donate.active && state.donate.amount > 0 && state.donate.target === n.flat;
        return '<div class="request-item"><strong>' + n.flat + '</strong><span>' + esc(n.note) + '</span>' +
          '<small>asks for ' + A.fmtTemp(n.asksTemp) + (helped ? ' · helped by your donation' : '') + '</small></div>';
      }).join("");

      var logHtml = cfg.log ? '<div class="subpanel"><h3>Building log</h3><ul class="log">' +
        cfg.log.map(function (l) { return '<li><time>' + l.t + '</time>' + esc(l.s) + '</li>'; }).join("") +
        '</ul></div>' : "";

      return '<aside aria-label="Building context">' +
        '<div class="subpanel"><div class="panel-heading"><h2>Building this week</h2>' +
          '<p>' + A.BUILDING_FLATS + ' flats sharing ' + A.fmtKwh(A.WEEKLY_POOL_KWH) + '</p></div>' +
          '<div class="flat-grid">' + grid + '</div></div>' +
        '<div class="subpanel"><h3>Shared pool</h3>' +
          '<div class="pool-bar"><span class="seg-others" style="width:' + pct(others) + '%"></span>' +
            '<span class="seg-yours" style="width:' + pct(yours) + '%"></span>' +
            '<span class="seg-reserve" style="width:' + pct(reserve) + '%"></span></div>' +
          '<div class="metric-list">' +
            '<div class="kv"><span class="k"><span class="swatch" style="background:var(--rule-2)"></span>Other 13 flats</span><span class="v">' + A.fmtKwh(others) + '</span></div>' +
            '<div class="kv"><span class="k"><span class="swatch" style="background:var(--accent)"></span>Your plan</span><span class="v">' + A.fmtKwh(yours) + '</span></div>' +
            '<div class="kv' + (low ? ' reserve-low' : '') + '"><span class="k"><span class="swatch" style="background:var(--accent-soft);border:1px solid var(--rule-2)"></span>Reserve left' + (low ? ' · brownout risk' : '') + '</span><span class="v">' + A.fmtKwh(reserve) + '</span></div>' +
          '</div>' +
          '<details><summary>What is the reserve?</summary><p>The reserve is what is left in the shared pool after every flat\'s plan. If it reaches zero during the peak, the building risks a brownout and everyone loses cooling.</p></details>' +
        '</div>' +
        logHtml +
        '<div class="subpanel"><h3>Visible requests</h3>' + reqs + '</div>' +
      '</aside>';
    }

    function privateRail() {
      var p = cfg.personal, total = weekTotal();
      var tpct = Math.min(100, total / p.targetKwh * 100);
      var bpct = Math.min(100, p.personalBestKwh / p.targetKwh * 100);
      return '<aside aria-label="Your household">' +
        '<div class="subpanel"><div class="panel-heading"><h2>Your cooling pattern</h2><p>' + esc(p.status) + '</p></div>' +
          '<div class="big-num">' + A.fmtKwh(total) + '</div>' +
          '<div class="target-bar"><span class="target-fill" style="width:' + tpct + '%"></span>' +
            '<span class="target-marker" style="left:' + bpct + '%" title="personal best"></span></div>' +
          '<div class="target-scale"><span>0</span><span>target ' + A.fmtKwh(p.targetKwh) + '</span></div>' +
          '<div class="metric-list">' +
            '<div class="kv"><span class="k">Personal best</span><span class="v">' + A.fmtKwh(p.personalBestKwh) + '</span></div>' +
            '<div class="kv"><span class="k">Recent average</span><span class="v">' + A.fmtKwh(p.recentAverageKwh) + '</span></div>' +
            '<div class="kv"><span class="k">Household</span><span class="v">62 m² · 2 adults</span></div>' +
          '</div></div>' +
      '</aside>';
    }

    // ---- modals ----
    function modalHtml() {
      if (!state.modal) return "";
      var inner = "";
      if (state.modal === "why") {
        inner = '<h2>Why this plan?</h2><ul class="muted" style="padding-left:18px">' +
          cfg.whyBullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join("") + '</ul>' +
          '<details open><summary>How the numbers work</summary><p>The heatwave pool is ' + A.fmtKwh(A.WEEKLY_POOL_KWH) +
          ' from the building\'s grid contract, shared by ' + A.BUILDING_FLATS + ' flats. ARKI starts each flat from its size and ' +
          'occupancy, then balances the week. Estimates vary with humidity, shading and cooling cycles.</p></details>';
      } else if (state.modal === "ask" || state.modal === "review") {
        var chips = ["heat-sensitive person", "infant or elderly at home", "night-shift sleep", "medical equipment"];
        var nonOp = cfg.agency === "low";
        inner = '<h2>Ask ARKI to review</h2>' +
          '<p class="modal-copy">' + (nonOp
            ? "ARKI's plan stays active while it checks your reason. A review does not change the plan now."
            : "Tell ARKI why you need more cooling and it will reshape your plan if the limit allows.") + '</p>' +
          '<div class="chip-group">' + chips.map(function (c, i) {
            return '<button class="chip' + (i === 0 ? ' is-selected' : '') + '" data-chip="' + esc(c) + '">' + c + '</button>';
          }).join("") + '</div>' +
          '<label class="field-label" for="note">Short note (optional)</label>' +
          '<textarea id="note" maxlength="90" placeholder="Keep it short."></textarea>' +
          '<div class="modal-actions"><button class="btn" data-act="close">Cancel</button>' +
          '<button class="btn primary" data-act="submit-ask">' + (nonOp ? "Send for review" : "Send to ARKI") + '</button></div>';
      } else if (state.modal === "donate") {
        var req = 6, amt = state.donate.amount || 2;
        inner = '<h2>Share cooling</h2>' +
          '<p class="modal-copy">3B asked the building for about ' + A.fmtKwh(req) + ' of extra cooling tonight. ' +
          'Share part of your plan with 3B, or add it to the shared reserve any flat can draw on.</p>' +
          '<div class="donate-readout"><strong id="don-amt">' + amt + '</strong><span>kWh</span></div>' +
          '<input id="don-slider" type="range" min="0" max="' + req + '" step="0.5" value="' + amt + '">' +
          '<label class="field-label"><input type="checkbox" id="don-pool"> Add to the shared reserve instead of giving it to 3B</label>' +
          '<div class="modal-actions"><button class="btn" data-act="close">Cancel</button>' +
          '<button class="btn primary" data-act="submit-donate">Share cooling</button></div>';
      }
      return '<div class="modal-backdrop" data-act="backdrop"><div class="modal" role="dialog" aria-modal="true">' +
        '<button class="close-btn" data-act="close" aria-label="Close">×</button>' + inner + '</div></div>';
    }

    // ---- mount ----
    var root = document.getElementById("app");
    function render() {
      var rail = cfg.community === "shared" ? sharedRail() : privateRail();
      var decision = cfg.agency === "high" ? highAgencyPanel() : lowAgencyPanel();
      root.innerHTML = '<div class="app">' + header() +
        '<div class="layout">' + weekStrip() + decision + rail + '</div></div>' + modalHtml();
      wire();
    }

    function wire() {
      var slider = document.getElementById("slider");
      if (slider) slider.addEventListener("input", function () {
        state.temp = parseFloat(this.value); state.confirmed = false; render();
      });
      root.querySelectorAll("[data-opt]").forEach(function (el) {
        el.addEventListener("click", function () { state.temp = parseFloat(this.dataset.opt); state.confirmed = false; render(); });
      });
      root.querySelectorAll("[data-act]").forEach(function (el) {
        el.addEventListener("click", function () { act(this.dataset.act); });
      });
      root.querySelectorAll("[data-chip]").forEach(function (el) {
        el.addEventListener("click", function () {
          root.querySelectorAll("[data-chip]").forEach(function (c) { c.classList.remove("is-selected"); });
          this.classList.add("is-selected"); this.dataset.chosen = "1";
        });
      });
      var ds = document.getElementById("don-slider");
      if (ds) ds.addEventListener("input", function () { document.getElementById("don-amt").textContent = this.value; });
    }

    function act(name) {
      switch (name) {
        case "check": state.checked = true; break;
        case "confirm": state.confirmed = true; break;
        case "accept": state.accepted = true; break;
        case "why": state.modal = "why"; break;
        case "ask": state.modal = "ask"; break;
        case "review": state.modal = "review"; break;
        case "donate": state.modal = "donate"; break;
        case "close": case "backdrop": state.modal = null; break;
        case "submit-ask": {
          var chip = root.querySelector("[data-chip].is-selected");
          var reason = chip ? chip.dataset.chip : "";
          if (cfg.agency === "low") { state.reviewSent = true; }
          else { state.ask = { active: true, reason: reason, note: "" }; state.temp = A.roundOne(Math.max(floor, state.temp - 0.5)); state.checked = true; }
          state.modal = null; break;
        }
        case "submit-donate": {
          var amt = parseFloat(document.getElementById("don-slider").value);
          var pool = document.getElementById("don-pool").checked;
          state.donate = { active: amt > 0, amount: amt, target: pool ? "pool" : "3B" };
          state.modal = null; break;
        }
      }
      render();
    }

    render();
  }

  A.renderCell = renderCell;
})(window);
