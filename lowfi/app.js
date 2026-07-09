/* ARKI cooling study — single render engine.
 * Every cell calls ARKI.renderCell("c1".."c4"). All four go through THIS code,
 * so the shell, week calendar, outcome, ARKI reasoning, options and energy panel
 * are identical by construction. Two things branch on the config:
 *   agency  : "high" -> options are choosable + a fine-tune slider + reshaping appeal
 *             "low"  -> ARKI's plan is applied; options are read-only (its pick is
 *                       badged); accept; the appeal is non-operative
 *   community: "shared"  -> building view (pool, neighbours, log/donate)
 *             "private" -> personal view (budget, history); no building view
 * The slider updates the page SURGICALLY (no full re-render) so dragging is smooth.
 */
(function (global) {
  "use strict";
  var A = global.ARKI;

  function esc(s) { return String(s).replace(/[&<>]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function el(id) { return document.getElementById(id); }

  function renderCell(cellId) {
    var cfg = A.CELLS[cellId];
    var pref = A.preferredTemp();
    var limit = A.capTemp(pref);                 // ARKI's binding limit (held-constant outcome)
    var floor = A.roundOne(limit - 1.5);         // coolest you can shape to
    var ceil = A.roundOne(limit + 1);            // warmest (frees energy)
    var todayId = cfg.week.reduce(function (acc, d, i) { return d.state === "today" ? i : acc; }, 0);

    var optionDefs = [
      { id: "cool", temp: floor, name: "Cooler for you" },
      { id: "balance", temp: limit, name: "ARKI's balance" },   // ARKI's recommended pick
      { id: "give", temp: ceil, name: cfg.community === "shared" ? "Give cooling back" : "Protect later" },
    ];

    var state = {
      selectedDay: todayId,
      temp: cfg.agency === "high" ? limit : (cfg.appliedTemp || limit),
      ask: { active: false, reason: "" },
      donate: { active: false, amount: 0, target: "3B" },
      reviewSent: false,
      accepted: false,
      confirmed: false,
      modal: null,
    };

    // ---- derived numbers ----
    function todayKwh() { return A.peakKwh(cfg.scenario.hours, state.temp); }
    function weekTotal() {
      return A.roundOne(cfg.week.reduce(function (s, d) {
        return s + (d.state === "today" ? todayKwh() : d.kwh);
      }, 0));
    }
    function poolReserve(extraDonatedToPool) {
      var donated = (state.donate.active && state.donate.target === "pool") ? state.donate.amount : 0;
      return A.roundOne(Math.max(0, cfg.building.poolKwh - cfg.building.othersPlannedKwh - weekTotal() + donated));
    }
    function consequence() {
      var cooler = state.temp <= limit - 1, warmer = state.temp >= limit + 0.5;
      if (cfg.community === "shared") {
        if (state.donate.active && state.donate.amount > 0)
          return state.donate.target === "pool"
            ? "You added " + A.fmtKwh(state.donate.amount) + " to the shared reserve."
            : "3B gets closer to the cooling it asked for.";
        if (cooler) return "Cooler for you now — the shared reserve drops and 3B's request gets squeezed.";
        if (warmer) return "You give cooling back — the shared reserve grows for the flats that asked.";
        return "The reserve holds for the flats that asked first.";
      }
      if (cooler) return "Cooler now — but a later peak window this week starts warmer to stay in budget.";
      if (warmer) return "Warmer now — later peak windows keep their budget.";
      return "Later peak windows stay on their current plan.";
    }

    // ============ view ============
    function header() {
      return '<header class="topbar">' +
        '<div class="brand"><span class="dot" aria-hidden="true"></span> ARKI</div>' +
        '<div class="meta">' +
          '<span class="pill">' + esc(cfg.reliability) + '</span>' +
          '<span class="pill warn">heatwave limit ' + cfg.scenario.start + '–' + cfg.scenario.end + '</span>' +
          '<span class="pill num" id="week-pill">' + A.fmtKwh(weekTotal()) + ' this week</span>' +
        '</div></header>';
    }

    function weekStrip() {
      var days = cfg.week.map(function (d, i) {
        var kwh = d.state === "today" ? todayKwh() : d.kwh;
        var temp = d.state === "today" ? state.temp : d.plannedTemp;
        var flag = d.state === "today" ? '<span class="flag">Today · decide</span>'
          : d.state === "future" ? '<span class="flag">ARKI plan</span>'
          : '<span class="flag">used</span>';
        return '<button class="day is-' + d.state + (state.selectedDay === i ? ' is-selected' : '') +
          '" data-day="' + i + '" aria-label="' + esc(d.label + " " + d.date + ", " + d.event) + '">' +
          '<span class="dow">' + d.label + '</span><span class="date">' + d.date + '</span>' +
          flag +
          '<span class="temp"' + (d.state === "today" ? ' id="cal-today"' : '') + '>' + A.fmtTemp(temp) + '</span>' +
        '</button>';
      }).join("");
      return '<section class="card week" aria-label="The cooling week">' +
        '<div class="card-head"><h2>Your week</h2><p>Tap any day to see its plan. The hot day in green is the one you decide now.</p></div>' +
        '<div class="week-grid">' + days + '</div></section>';
    }

    function scenarioIntro() {
      return '<div class="scenario"><p class="eyebrow">Peak window · ' + cfg.scenario.start + '–' + cfg.scenario.end + '</p>' +
        '<h1>Cooling is limited on the hottest day</h1>' +
        '<div class="calendar-strip"><span class="label">Calendar</span><strong>' + esc(cfg.scenario.event) + '</strong>' +
          '<span class="muted num">' + cfg.scenario.dayLabel + ' ' + cfg.scenario.dayDate + ' · ' + cfg.scenario.outside + ' °C outside</span>' +
        '</div></div>';
    }

    function outcomeBlock() {
      return '<div class="outcome"><p class="eyebrow">Your flat in the peak window</p>' +
        '<div class="metric"><span class="value" id="out-temp">' + tnum(state.temp) + '</span><span class="unit">°C in your flat</span></div>' +
        '<p class="against">You set comfort at <strong>' + A.fmtTemp(pref) + '</strong>. ' +
          'The limit will not let your flat reach it during the heatwave peak.</p>' +
        '<p class="consequence">That means ' + esc(cfg.scenario.consequence) + '.</p></div>';
    }
    function tnum(t) { return A.roundOne(t).toFixed(t % 1 ? 1 : 0); }

    function arkiReason() {
      return '<div class="arki-reason"><p><span class="who">ARKI · </span>' + esc(A.ARKI_REASON) + '</p></div>';
    }

    function optionsBlock() {
      var choosable = cfg.agency === "high";
      var rows = optionDefs.map(function (o) {
        var k = A.peakKwh(cfg.scenario.hours, o.temp);
        var copy = cfg.community === "shared"
          ? (o.id === "cool" ? "Reserve drops; 3B's request gets squeezed."
             : o.id === "balance" ? "Reserve holds for the flats that asked." : "Reserve grows for the flats that asked.")
          : (o.id === "cool" ? "A later peak window this week starts warmer."
             : o.id === "balance" ? "Later windows stay on plan." : "Later windows keep their budget.");
        var active = Math.abs(state.temp - o.temp) < 0.25;
        var isArki = o.id === "balance";
        var badge = isArki ? '<span class="badge">ARKI\'s choice</span>'
          : (!choosable ? '<span class="badge ghost">considered</span>' : "");
        var cls = "option" + (active ? " is-active" : "") + (!choosable && !active ? " is-dim" : "");
        var tag = choosable ? "button" : "div";
        return '<' + tag + ' class="' + cls + '"' + (choosable ? ' data-opt="' + o.temp + '"' : "") + '>' +
          '<span class="o-name">' + o.name + ' ' + badge + '</span>' +
          '<span class="o-num">' + A.fmtTemp(o.temp) + ' · ' + A.fmtKwh(k) + '</span>' +
          '<span class="o-copy">' + copy + '</span></' + tag + '>';
      }).join("");
      var head = choosable ? "Pick a plan, or fine-tune it below" : "ARKI chose for you";
      return '<div class="plan"><div class="plan-head"><h3>ARKI\'s plan for the window</h3>' +
        '<span class="muted" style="font-size:.85rem">' + head + '</span></div>' +
        '<div class="option-list">' + rows + '</div></div>';
    }

    function fineTune() {
      return '<div class="fine"><div class="fine-head"><label for="slider">Fine-tune the exact temperature</label>' +
        '<strong id="fine-val">' + A.fmtTemp(state.temp) + '</strong></div>' +
        '<input id="slider" type="range" min="' + floor + '" max="' + ceil + '" step="0.5" value="' + state.temp + '">' +
        '<div class="scale"><span>' + A.fmtTemp(floor) + ' · cooler</span><span>' + A.fmtTemp(ceil) + ' · warmer</span></div>' +
        '<p class="floor-note">ARKI cannot cool below ' + A.fmtTemp(floor) + ' here — the heatwave limit is binding.</p></div>';
    }

    function usesPanel() {
      var k = todayKwh();
      return '<div class="uses"><div class="uses-head"><span>What this uses</span><strong id="uses-kwh">' + A.fmtKwh(k) + '</strong></div>' +
        '<div class="uses-body"><div class="compare" id="uses-compare">' + A.severity(k) + ' — ' + A.applianceCompare(k) + '.</div>' +
        '<div class="consequence" id="uses-conseq">' + esc(consequence()) + '</div></div></div>';
    }

    function arkiKnows() {
      var items = A.ARKI_KNOWS.map(function (x, i) {
        return '<li>' + (i === 0 ? esc(x[0]) + A.roundOne(pref) + esc(x[1]) : esc(x)) + '</li>';
      }).join("");
      return '<details><summary>What ARKI used about you</summary>' +
        '<ul style="padding-left:18px;margin:8px 0 0">' + items + '</ul>' +
        '<p class="muted">Correct any of these and ARKI re-plans.</p></details>';
    }

    function decisionCard() {
      var d = cfg.week[state.selectedDay];
      if (d.state !== "today") return readOnlyDay(d);

      var body = scenarioIntro() + outcomeBlock() + arkiReason() + optionsBlock();
      if (cfg.agency === "high") {
        body += fineTune() + usesPanel() + arkiKnows();
        body += '<button class="btn primary" data-act="confirm">' + (state.confirmed ? "Plan confirmed ✓" : "Confirm my plan") + '</button>';
        body += '<div class="actions">' +
          '<button class="btn quiet" data-act="ask">Ask ARKI to review</button>' +
          (cfg.community === "shared" ? '<button class="btn quiet" data-act="donate">Donate cooling</button>' : "") +
          '<button class="btn quiet" data-act="why">Why this plan?</button></div>';
        if (state.ask.active) body += '<div class="status">ARKI reshaped your plan after your reason — now ' + A.fmtTemp(state.temp) + '.</div>';
      } else {
        body += usesPanel();
        body += '<button class="btn primary" data-act="accept">' + (state.accepted ? "Plan accepted ✓" : "Accept plan") + '</button>';
        body += '<div class="actions">' +
          '<button class="btn quiet" data-act="review">Ask ARKI to review</button>' +
          '<button class="btn quiet" data-act="why">Why this plan?</button></div>';
        if (state.reviewSent) body += '<div class="status">Your reason is logged. ARKI\'s ' + A.fmtTemp(state.temp) +
          ' plan stays active while it checks for any released cooling — it does not change the plan now.</div>';
        else if (state.accepted) body += '<div class="status">Plan set for ' + cfg.scenario.start + '–' + cfg.scenario.end + '.</div>';
      }
      return '<section class="card card-lead">' + body + '</section>';
    }

    function readOnlyDay(d) {
      var past = d.state === "past";
      return '<section class="card card-lead readonly"><p class="eyebrow">' + (past ? "Already used" : "ARKI's plan for this day") + '</p>' +
        '<h1>' + esc(d.event) + '</h1>' +
        '<p class="muted">' + d.label + ' ' + d.date + ' · ' + d.outside + ' °C outside · peak window</p>' +
        '<div class="big" style="margin-top:12px">' + A.fmtTemp(d.plannedTemp) + '</div>' +
        '<div class="uses" style="margin-top:8px"><div class="uses-head"><span>This window</span><strong>' + A.fmtKwh(d.kwh) + '</strong></div>' +
        '<div class="uses-body"><div class="compare">' + A.severity(d.kwh) + ' — ' + A.applianceCompare(d.kwh) + '.</div></div></div>' +
        '<p class="muted" style="margin-top:12px">' + (past
          ? "This day has already passed, so its setting is locked."
          : "This is ARKI's plan for now. You make the real decision when the day arrives.") + '</p>' +
        '<button class="btn primary" data-day="' + todayId + '" style="margin-top:12px">Back to today\'s decision</button></section>';
    }

    // ---- community rails ----
    function sharedRail() {
      var flats = ["1A","1B","1C","1D","2A","2B","2C","2D","3A","3B","3C","3D","4A","4C"];
      var squeezed = state.temp <= limit - 1 && !(state.donate.active && state.donate.amount > 0);
      var grid = flats.map(function (f) {
        var cls = "flat";
        if (f === A.RESIDENT.flat) cls += " is-you";
        else if (cfg.neighbours.some(function (n) { return n.flat === f; })) cls += " has-request";
        if (f === "3B" && squeezed) cls += " is-squeezed";
        return '<span class="' + cls + '" id="flat-' + f + '">' + f + '</span>';
      }).join("");
      var others = cfg.building.othersPlannedKwh, yours = weekTotal(), reserve = poolReserve();
      var pool = cfg.building.poolKwh, pct = function (v) { return Math.max(0, Math.min(100, v / pool * 100)); };
      var reqs = (state.ask.active ? '<div class="request is-you"><strong>4C</strong><span>your need is now visible to the building</span><small>' + esc(state.ask.reason) + '</small></div>' : "") +
        cfg.neighbours.map(function (n) {
          var helped = state.donate.active && state.donate.amount > 0 && state.donate.target === n.flat;
          return '<div class="request"><strong>' + n.flat + '</strong><span>' + esc(n.note) + '</span><small>asks for ' + A.fmtTemp(n.asksTemp) + (helped ? ' · helped by your donation' : '') + '</small></div>';
        }).join("");
      var logHtml = cfg.log ? '<section class="card"><h3>Building log</h3><ul class="log">' +
        cfg.log.map(function (l) { return '<li><time>' + l.t + '</time>' + esc(l.s) + '</li>'; }).join("") + '</ul></section>' : "";
      return '<section class="card"><div class="card-head"><h2>Building this week</h2><p>' + A.BUILDING_FLATS + ' flats sharing ' + A.fmtKwh(A.WEEKLY_POOL_KWH) + '</p></div>' +
        '<div class="flat-grid">' + grid + '</div>' +
        '<h3 style="margin-top:20px">Shared pool</h3>' +
        '<div class="pool-bar"><span class="seg-others" style="width:' + pct(others) + '%"></span>' +
          '<span class="seg-yours" id="bar-yours" style="width:' + pct(yours) + '%"></span>' +
          '<span class="seg-reserve" id="bar-reserve" style="width:' + pct(reserve) + '%"></span></div>' +
        '<div class="kvs">' +
          '<div class="kv"><span class="k"><span class="swatch" style="background:var(--rule-2)"></span>Other 13 flats</span><span class="v">' + A.fmtKwh(others) + '</span></div>' +
          '<div class="kv"><span class="k"><span class="swatch" style="background:var(--accent)"></span>Your plan</span><span class="v" id="val-yours">' + A.fmtKwh(yours) + '</span></div>' +
          '<div class="kv' + (reserve < 70 ? ' low' : '') + '" id="kv-reserve"><span class="k"><span class="swatch" style="background:var(--accent-soft);border:1px solid var(--rule-2)"></span>Reserve left</span><span class="v" id="val-reserve">' + A.fmtKwh(reserve) + '</span></div>' +
        '</div>' +
        '<details><summary>What is the reserve?</summary><p>The reserve is what is left in the shared pool after every flat\'s plan. If it reaches zero during the peak, the building risks a brownout and everyone loses cooling.</p></details>' +
        '</section>' + logHtml +
        '<section class="card"><h3>Visible requests</h3>' + reqs + '</section>';
    }

    function privateRail() {
      var p = cfg.personal, total = weekTotal();
      return '<section class="card"><div class="card-head"><h2>Your cooling pattern</h2><p>' + esc(p.status) + '</p></div>' +
        '<div class="big-num" id="big-total">' + A.fmtKwh(total) + '</div>' +
        '<div class="target-bar"><span class="target-fill" id="tgt-fill" style="width:' + Math.min(100, total / p.targetKwh * 100) + '%"></span>' +
          '<span class="target-marker" style="left:' + Math.min(100, p.personalBestKwh / p.targetKwh * 100) + '%" title="personal best"></span></div>' +
        '<div class="target-scale"><span>0</span><span>target ' + A.fmtKwh(p.targetKwh) + '</span></div>' +
        '<div class="kvs">' +
          '<div class="kv"><span class="k">Personal best</span><span class="v">' + A.fmtKwh(p.personalBestKwh) + '</span></div>' +
          '<div class="kv"><span class="k">Recent average</span><span class="v">' + A.fmtKwh(p.recentAverageKwh) + '</span></div>' +
          '<div class="kv"><span class="k">Household</span><span class="v">62 m² · 2 adults</span></div>' +
        '</div></section>';
    }

    // ---- modals ----
    function modalHtml() {
      if (!state.modal) return "";
      var inner = "";
      if (state.modal === "why") {
        inner = '<h2>Why this plan?</h2><ul style="padding-left:18px">' +
          cfg.whyBullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join("") + '</ul>' +
          '<details open><summary>How the numbers work</summary><p>The heatwave pool is ' + A.fmtKwh(A.WEEKLY_POOL_KWH) +
          ' from the building\'s grid contract, shared by ' + A.BUILDING_FLATS + ' flats. ARKI starts each flat from its size and occupancy, then balances the week. Estimates vary with humidity, shading and cooling cycles.</p></details>';
      } else if (state.modal === "ask" || state.modal === "review") {
        var chips = ["heat-sensitive person", "infant or elderly at home", "night-shift sleep", "medical equipment"];
        var nonOp = cfg.agency === "low";
        inner = '<h2>Ask ARKI to review</h2><p class="modal-copy">' + (nonOp
            ? "ARKI's plan stays active while it checks your reason. A review does not change the plan now."
            : "Tell ARKI why you need more cooling and it will reshape your plan if the limit allows.") + '</p>' +
          '<div class="chips">' + chips.map(function (c, i) { return '<button class="chip' + (i === 0 ? ' is-selected' : '') + '" data-chip="' + esc(c) + '">' + c + '</button>'; }).join("") + '</div>' +
          '<label class="field-label" for="note">Short note (optional)</label><textarea id="note" maxlength="90" placeholder="Keep it short."></textarea>' +
          '<div class="modal-actions"><button class="btn" data-act="close">Cancel</button>' +
          '<button class="btn primary" data-act="submit-ask">' + (nonOp ? "Send for review" : "Send to ARKI") + '</button></div>';
      } else if (state.modal === "donate") {
        var req = 6, amt = state.donate.amount || 2;
        inner = '<h2>Share cooling</h2><p class="modal-copy">3B asked the building for about ' + A.fmtKwh(req) +
          ' of extra cooling tonight. Share part of your plan with 3B, or add it to the shared reserve any flat can draw on.</p>' +
          '<div class="donate-readout"><strong id="don-amt">' + amt + '</strong><span>kWh</span></div>' +
          '<input id="don-slider" type="range" min="0" max="' + req + '" step="0.5" value="' + amt + '">' +
          '<label class="field-label"><input type="checkbox" id="don-pool"> Add to the shared reserve instead of giving it to 3B</label>' +
          '<div class="modal-actions"><button class="btn" data-act="close">Cancel</button><button class="btn primary" data-act="submit-donate">Share cooling</button></div>';
      }
      return '<div class="modal-backdrop" data-act="backdrop"><div class="modal" role="dialog" aria-modal="true">' +
        '<button class="close-btn" data-act="close" aria-label="Close">×</button>' + inner + '</div></div>';
    }

    // ---- surgical update (slider/options; no full re-render) ----
    function patchDynamic() {
      var k = todayKwh(), wt = weekTotal();
      if (el("out-temp")) el("out-temp").textContent = tnum(state.temp);
      if (el("fine-val")) el("fine-val").textContent = A.fmtTemp(state.temp);
      if (el("slider")) el("slider").value = state.temp;
      if (el("uses-kwh")) el("uses-kwh").textContent = A.fmtKwh(k);
      if (el("uses-compare")) el("uses-compare").textContent = A.severity(k) + " — " + A.applianceCompare(k) + ".";
      if (el("uses-conseq")) el("uses-conseq").textContent = consequence();
      if (el("week-pill")) el("week-pill").textContent = A.fmtKwh(wt) + " this week";
      if (el("cal-today")) el("cal-today").textContent = A.fmtTemp(state.temp);
      root.querySelectorAll("[data-opt]").forEach(function (o) {
        o.classList.toggle("is-active", Math.abs(parseFloat(o.dataset.opt) - state.temp) < 0.25);
      });
      if (cfg.community === "shared") {
        var others = cfg.building.othersPlannedKwh, reserve = poolReserve(), pool = cfg.building.poolKwh;
        var pc = function (v) { return Math.max(0, Math.min(100, v / pool * 100)); };
        if (el("bar-yours")) el("bar-yours").style.width = pc(wt) + "%";
        if (el("bar-reserve")) el("bar-reserve").style.width = pc(reserve) + "%";
        if (el("val-yours")) el("val-yours").textContent = A.fmtKwh(wt);
        if (el("val-reserve")) el("val-reserve").textContent = A.fmtKwh(reserve);
        if (el("kv-reserve")) el("kv-reserve").classList.toggle("low", reserve < 70);
        var sq = state.temp <= limit - 1 && !(state.donate.active && state.donate.amount > 0);
        if (el("flat-3B")) el("flat-3B").classList.toggle("is-squeezed", sq);
      } else if (cfg.personal) {
        if (el("tgt-fill")) el("tgt-fill").style.width = Math.min(100, wt / cfg.personal.targetKwh * 100) + "%";
        if (el("big-total")) el("big-total").textContent = A.fmtKwh(wt);
      }
    }

    // ---- mount ----
    var root = document.getElementById("app");
    function render() {
      var rail = cfg.community === "shared" ? sharedRail() : privateRail();
      root.innerHTML = '<div class="app">' + header() + weekStrip() + decisionCard() + rail + '</div>' + modalHtml();
      wire();
    }

    function wire() {
      var slider = el("slider");
      if (slider) slider.addEventListener("input", function () {
        state.temp = parseFloat(this.value); state.confirmed = false; patchDynamic();
      });
      root.querySelectorAll("[data-opt]").forEach(function (o) {
        o.addEventListener("click", function () { state.temp = parseFloat(this.dataset.opt); state.confirmed = false; patchDynamic(); });
      });
      root.querySelectorAll("[data-day]").forEach(function (b) {
        b.addEventListener("click", function () { state.selectedDay = parseInt(this.dataset.day, 10); render(); });
      });
      root.querySelectorAll("[data-act]").forEach(function (b) {
        b.addEventListener("click", function () { act(this.dataset.act); });
      });
      root.querySelectorAll("[data-chip]").forEach(function (c) {
        c.addEventListener("click", function () {
          root.querySelectorAll("[data-chip]").forEach(function (x) { x.classList.remove("is-selected"); });
          this.classList.add("is-selected");
        });
      });
      var ds = el("don-slider");
      if (ds) ds.addEventListener("input", function () { el("don-amt").textContent = this.value; });
    }

    function act(name) {
      switch (name) {
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
          if (cfg.agency === "low") state.reviewSent = true;
          else { state.ask = { active: true, reason: reason }; state.temp = A.roundOne(Math.max(floor, state.temp - 0.5)); }
          state.modal = null; break;
        }
        case "submit-donate": {
          var amt = parseFloat(el("don-slider").value);
          state.donate = { active: amt > 0, amount: amt, target: el("don-pool").checked ? "pool" : "3B" };
          state.modal = null; break;
        }
      }
      render();
    }

    render();
  }

  A.renderCell = renderCell;
})(window);
