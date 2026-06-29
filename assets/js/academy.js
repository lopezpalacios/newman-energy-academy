/* ============================================================
   Newman Energy Sales Academy — academy.js
   Lesson interactivity + 4 financial calculators + animations.
   Dependency-free IIFE. Calculators auto-bind by [data-calc].
   Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var REDUCE = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* ---------- formatters ---------- */
  var fmt = {
    eur: function (n) { return isFinite(n) ? "€" + Math.round(n).toLocaleString("en-IE") : "—"; },
    eur1: function (n) { return isFinite(n) ? "€" + n.toLocaleString("en-IE", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) : "—"; },
    pct: function (n) { return isFinite(n) ? n.toFixed(1) + "%" : "—"; },
    mult: function (n) { return isFinite(n) ? n.toFixed(2) + "×" : "—"; },
    yrs: function (n) { return isFinite(n) ? n.toFixed(1) + " yrs" : "—"; },
    num: function (n) { return isFinite(n) ? Math.round(n).toLocaleString("en-IE") : "—"; }
  };

  /* ---------- finance ---------- */
  function pvAnnuity(cf, n, r, tv) {
    var pv = 0; for (var t = 1; t <= n; t++) pv += cf / Math.pow(1 + r, t);
    if (tv) pv += tv / Math.pow(1 + r, n); return pv;
  }
  function irrFlat(capex, cf, n, tv) {
    var lo = -0.9, hi = 2.0, mid = 0, f = function (r) { return -capex + pvAnnuity(cf, n, r, tv); };
    if (f(lo) * f(hi) > 0) return NaN;
    for (var i = 0; i < 80; i++) { mid = (lo + hi) / 2; var v = f(mid); if (Math.abs(v) < 1) break; if (f(lo) * v < 0) hi = mid; else lo = mid; }
    return mid;
  }
  /* general IRR over an explicit cashflow array (cf[0] is t=0, usually negative) */
  function npvArr(r, cfs) { var v = 0; for (var t = 0; t < cfs.length; t++) v += cfs[t] / Math.pow(1 + r, t); return v; }
  function irrArr(cfs) {
    var lo = -0.9, hi = 2.0, mid = 0;
    if (npvArr(lo, cfs) * npvArr(hi, cfs) > 0) return NaN;
    for (var i = 0; i < 100; i++) { mid = (lo + hi) / 2; var v = npvArr(mid, cfs); if (Math.abs(v) < 1) break; if (npvArr(lo, cfs) * v < 0) hi = mid; else lo = mid; }
    return mid;
  }

  /* ---------- animated output rendering (tween numbers) ---------- */
  function render(root, map) {
    Object.keys(map).forEach(function (k) {
      var el = root.querySelector('[data-out="' + k + '"]');
      if (!el) return;
      var spec = map[k];
      var target = spec.n, f = spec.fmt;
      if (REDUCE || el._noTween) { el.firstChild ? setText(el, f(target)) : el.textContent = f(target); el._cur = target; return; }
      var from = (typeof el._cur === "number") ? el._cur : target;
      var start = null, dur = 420;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var e = 1 - Math.pow(1 - p, 3); // easeOutCubic
        var v = from + (target - from) * e;
        setText(el, f(v));
        if (p < 1) requestAnimationFrame(step); else { el._cur = target; }
      }
      requestAnimationFrame(step);
    });
  }
  // write only the number, preserving any trailing <small> node
  function setText(el, str) {
    var small = el.querySelector("small");
    el.textContent = str;
    if (small) el.appendChild(small);
  }

  /* ---------- input binding ---------- */
  function bind(root) {
    var state = { onchange: null };
    var inputs = root.querySelectorAll("[data-field]");
    function read() {
      inputs.forEach(function (el) {
        var k = el.getAttribute("data-field");
        state[k] = parseFloat(el.value) || 0;
        var lbl = root.querySelector('[data-val="' + k + '"]');
        if (lbl) {
          var v = parseFloat(el.value) || 0, suf = el.getAttribute("data-suffix") || "";
          lbl.textContent = (el.getAttribute("data-money") ? "€" + v.toLocaleString("en-IE") : v.toLocaleString("en-IE")) + suf;
        }
      });
    }
    inputs.forEach(function (el) { el.addEventListener("input", function () { read(); if (state.onchange) state.onchange(); }); });
    read();
    return state;
  }

  /* ============================================================
     CALCULATORS
     ============================================================ */
  var CALCS = {};

  /* 1 — NPV / DCF EXIT (yield compression) */
  CALCS.exit = function (root) {
    var f = bind(root);
    function calc() {
      var cf = f.cf, n = f.term, rb = f.build / 100, re = f.exit / 100, capex = f.capex, tv = f.tv;
      var sale = pvAnnuity(cf, n, re, tv), basis = pvAnnuity(cf, n, rb, tv);
      var devIrr = irrFlat(capex, cf, n, tv);
      render(root, {
        sale: { n: sale, fmt: fmt.eur },
        uplift: { n: sale - capex, fmt: fmt.eur },
        moic: { n: sale / capex, fmt: fmt.mult },
        compression: { n: sale - basis, fmt: fmt.eur },
        devirr: { n: isNaN(devIrr) ? NaN : devIrr * 100, fmt: fmt.pct },
        spread: { n: (rb - re) * 100, fmt: function (x) { return " · " + x.toFixed(1) + " pt gap"; } }
      });
    }
    f.onchange = calc; calc();
  };

  /* 2 — LCOE BUILDER */
  CALCS.lcoe = function (root) {
    var f = bind(root);
    function calc() {
      var capex = f.capex, opex = f.opex, kyield = f.kyield, n = f.life, r = f.disc / 100, tariff = f.tariff;
      // discounted energy + discounted opex over life (per kWp basis)
      var dEnergy = 0, dOpex = 0;
      for (var t = 1; t <= n; t++) { dEnergy += kyield / Math.pow(1 + r, t); dOpex += opex / Math.pow(1 + r, t); }
      var lcoeKwh = (capex + dOpex) / dEnergy;      // €/kWh
      var lcoe = lcoeKwh * 1000;                     // €/MWh
      var margin = tariff - lcoe;
      render(root, {
        lcoe: { n: lcoe, fmt: fmt.eur1 },
        margin: { n: margin, fmt: fmt.eur1 },
        marginpct: { n: tariff ? (margin / tariff) * 100 : NaN, fmt: fmt.pct },
        verdict: { n: margin, fmt: function (x) { return x > 0 ? "Below grid — sellable" : "Above grid — no case"; } }
      });
    }
    f.onchange = calc; calc();
  };

  /* 3 — CUSTOMER SAVINGS */
  CALCS.savings = function (root) {
    var f = bind(root);
    function calc() {
      var cons = f.cons, tariff = f.tariff, ppa = f.ppa, share = f.share / 100;
      var covered = cons * share;
      var gridCost = covered * tariff, ppaCost = covered * ppa;
      var save = gridCost - ppaCost;
      var savepct = gridCost ? (save / gridCost) * 100 : NaN;
      render(root, {
        save: { n: save, fmt: fmt.eur },
        savepct: { n: savepct, fmt: fmt.pct },
        tenyr: { n: save * 10, fmt: fmt.eur },
        ppabill: { n: ppaCost, fmt: fmt.eur }
      });
    }
    f.onchange = calc; calc();
  };

  /* 4 — BESS REVENUE STACK */
  CALCS.bess = function (root) {
    var f = bind(root);
    var EFF = 0.86; // round-trip efficiency
    function calc() {
      var power = f.power, dur = f.dur, cycles = f.cycles, spread = f.spread, cap = f.cap, anc = f.anc, bcapex = f.bcapex;
      var energy = power * dur;                              // MWh usable
      var arb = energy * cycles * spread * EFF;              // arbitrage €
      var capacity = power * cap;                            // capacity payments €
      var ancillary = power * anc;                           // ancillary/FCR €
      var total = arb + capacity + ancillary;
      var capexTotal = energy * 1000 * bcapex;               // €/kWh * kWh
      var payback = total ? capexTotal / total : NaN;
      render(root, {
        total: { n: total, fmt: fmt.eur },
        arb: { n: arb, fmt: fmt.eur },
        capacity: { n: capacity, fmt: fmt.eur },
        ancillary: { n: ancillary, fmt: fmt.eur },
        payback: { n: payback, fmt: fmt.yrs }
      });
    }
    f.onchange = calc; calc();
  };

  /* 5 — DEVELOPER PROJECT FINANCE (equity IRR, DSCR, debt sizing) */
  CALCS.devfin = function (root) {
    var f = bind(root);
    function calc() {
      var capex = f.capex, dpct = f.debt / 100, rate = f.rate / 100, tenor = f.tenor, rev = f.rev, life = f.life;
      var debt = capex * dpct, equity = capex - debt;
      var ds = tenor > 0 ? (rate > 0 ? debt * rate / (1 - Math.pow(1 + rate, -tenor)) : debt / tenor) : 0; // level annual debt service
      var dscr = ds > 0 ? rev / ds : Infinity;
      var projIrr = irrFlat(capex, rev, life, 0);
      // equity cashflow stream: -equity now; rev-ds during loan; rev after loan repaid
      var stream = [-equity];
      for (var t = 1; t <= life; t++) stream.push(t <= tenor ? rev - ds : rev);
      var eqIrr = irrArr(stream);
      // equity payback (cumulative crosses zero)
      var cum = -equity, pb = NaN;
      for (var y = 1; y <= life; y++) { cum += (y <= tenor ? rev - ds : rev); if (cum >= 0) { pb = y - (cum / (y <= tenor ? rev - ds : rev)); break; } }
      render(root, {
        projirr: { n: isNaN(projIrr) ? NaN : projIrr * 100, fmt: fmt.pct },
        equityirr: { n: isNaN(eqIrr) ? NaN : eqIrr * 100, fmt: fmt.pct },
        dscr: { n: dscr, fmt: function (x) { return isFinite(x) ? x.toFixed(2) + "×" : "—"; } },
        equity: { n: equity, fmt: fmt.eur },
        debtservice: { n: ds, fmt: fmt.eur },
        payback: { n: pb, fmt: fmt.yrs }
      });
    }
    f.onchange = calc; calc();
  };

  function initCalcs() {
    document.querySelectorAll("[data-calc]").forEach(function (root) {
      var fn = CALCS[root.getAttribute("data-calc")];
      if (fn) fn(root);
    });
  }

  /* ============================================================
     ANIMATIONS
     ============================================================ */

  /* scroll progress bar (lesson pages) */
  function initProgress() {
    if (!document.querySelector(".lesson-main")) return;
    var bar = document.createElement("div");
    bar.className = "read-progress"; bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    function upd() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
      bar.style.transform = "scaleX(" + p + ")";
    }
    document.addEventListener("scroll", upd, { passive: true });
    upd();
  }

  /* count-up for any [data-countup] (stat numbers etc.) */
  function initCountUp() {
    var els = document.querySelectorAll("[data-countup]");
    if (!els.length) return;
    if (REDUCE || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.textContent = el.getAttribute("data-countup"); }); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, raw = el.getAttribute("data-countup");
        var target = parseFloat(raw.replace(/[^0-9.]/g, "")) || 0;
        var pre = raw.match(/^[^0-9]*/)[0], suf = raw.match(/[^0-9.]*$/)[0];
        var start = null, dur = 1100;
        function step(ts) {
          if (start === null) start = ts;
          var p = Math.min(1, (ts - start) / dur), v = (1 - Math.pow(1 - p, 3)) * target;
          el.textContent = pre + Math.round(v).toLocaleString("en-IE") + suf;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* reveal on scroll for [data-reveal] not already handled by newman.js, plus [data-rise] */
  function initReveal() {
    var els = document.querySelectorAll("[data-rise]");
    if (!els.length) return;
    if (REDUCE || !("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* TOC scrollspy */
  function initScrollspy() {
    var links = document.querySelectorAll(".lesson-aside .toc a");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) { var id = a.getAttribute("href").slice(1); var s = document.getElementById(id); if (s) map[id] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { links.forEach(function (a) { a.classList.remove("active"); }); if (map[e.target.id]) map[e.target.id].classList.add("active"); }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  /* quiz */
  function initQuiz() {
    document.querySelectorAll(".q-item").forEach(function (item) {
      var opts = item.querySelectorAll(".q-opt");
      opts.forEach(function (opt) {
        opt.addEventListener("click", function () {
          if (item.classList.contains("answered")) return;
          var correct = opt.getAttribute("data-correct") === "true";
          opt.classList.add(correct ? "correct" : "wrong");
          if (!correct) opts.forEach(function (o) { if (o.getAttribute("data-correct") === "true") o.classList.add("correct"); });
          item.classList.add("answered");
          var inp = opt.querySelector("input"); if (inp) inp.checked = true;
        });
      });
    });
  }

  function boot() {
    initCalcs(); initScrollspy(); initQuiz();
    initProgress(); initCountUp(); initReveal();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.Academy = { pvAnnuity: pvAnnuity, irrFlat: irrFlat, calcs: CALCS, fmt: fmt };
})();
