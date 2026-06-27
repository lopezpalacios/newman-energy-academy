# Calculator widgets — paste-ready markup

Four calculators are implemented in `assets/js/academy.js`. Drop the matching block into a
`<section id="calc">` and it auto-binds. Inputs carry `data-field`, outputs carry `data-out`,
range labels mirror via `data-val`. Tween animation is automatic.

Use a calculator ONLY in the lessons noted in lesson-map.md. Defaults below are realistic CZ/EU.

---
## 1 · NPV/DCF Exit  (`data-calc="exit"`)  — used in Track 07-exit lesson(s)
Already live in `tracks/exit-npv-dcf.html` — copy that block.
Fields: cf, capex, term, build, exit, tv · Outputs: sale, uplift, moic, compression, spread, devirr

---
## 2 · LCOE Builder  (`data-calc="lcoe"`)
```html
<div class="calc" data-calc="lcoe">
  <div class="calc-head"><h3>Levelised cost of energy (LCOE)</h3>
    <p>The all-in cost of a unit of generated power, per kWp of solar.</p></div>
  <div class="calc-body">
    <div class="inputs">
      <div class="row"><label for="lcapex">Capex <span class="val" data-val="capex"></span></label>
        <input id="lcapex" type="number" data-field="capex" value="600" step="25" min="0"> <small class="note">€ / kWp</small></div>
      <div class="row"><label for="lopex">Opex / yr <span class="val" data-val="opex"></span></label>
        <input id="lopex" type="number" data-field="opex" value="12" step="1" min="0"> <small class="note">€ / kWp / yr</small></div>
      <div class="row"><label for="lky">Specific yield <span class="val" data-val="kyield"></span></label>
        <input id="lky" type="range" data-field="kyield" data-val-target data-suffix=" kWh/kWp" value="1050" min="700" max="1400" step="10"></div>
      <div class="row"><label for="llife">Asset life <span class="val" data-val="life"></span></label>
        <input id="llife" type="range" data-field="life" data-val-target data-suffix=" yrs" value="25" min="10" max="35" step="1"></div>
      <div class="row"><label for="ldisc">Discount rate <span class="val" data-val="disc"></span></label>
        <input id="ldisc" type="range" data-field="disc" data-val-target data-suffix="%" value="7" min="3" max="14" step="0.5"></div>
      <div class="row"><label for="ltar">Grid tariff to beat <span class="val" data-val="tariff"></span></label>
        <input id="ltar" type="number" data-field="tariff" value="120" step="5" min="0"> <small class="note">€ / MWh</small></div>
    </div>
    <div class="outputs">
      <div class="kpi hero"><div class="k">LCOE</div><div class="v" data-out="lcoe">—</div></div>
      <div class="kpi"><div class="k">Margin vs grid</div><div class="v" data-out="margin">—</div></div>
      <div class="kpi"><div class="k">Discount to grid</div><div class="v" data-out="marginpct">—</div></div>
      <div class="kpi"><div class="k">Verdict</div><div class="v" data-out="verdict" style="font-size:20px">—</div></div>
    </div>
  </div>
</div>
```

---
## 3 · Customer Savings  (`data-calc="savings"`)
```html
<div class="calc" data-calc="savings">
  <div class="calc-head"><h3>Customer savings — grid vs PPA</h3>
    <p>What the client saves by buying covered load under a PPA instead of the grid.</p></div>
  <div class="calc-body">
    <div class="inputs">
      <div class="row"><label for="scons">Annual consumption <span class="val" data-val="cons"></span></label>
        <input id="scons" type="number" data-field="cons" value="5000" step="100" min="0"> <small class="note">MWh / yr</small></div>
      <div class="row"><label for="star">Grid tariff <span class="val" data-val="tariff"></span></label>
        <input id="star" type="number" data-field="tariff" value="120" step="5" min="0"> <small class="note">€ / MWh</small></div>
      <div class="row"><label for="sppa">PPA price <span class="val" data-val="ppa"></span></label>
        <input id="sppa" type="number" data-field="ppa" value="80" step="5" min="0"> <small class="note">€ / MWh</small></div>
      <div class="row"><label for="sshare">Share covered by PPA <span class="val" data-val="share"></span></label>
        <input id="sshare" type="range" data-field="share" data-val-target data-suffix="%" value="60" min="10" max="100" step="5"></div>
    </div>
    <div class="outputs">
      <div class="kpi hero"><div class="k">Saving / year</div><div class="v" data-out="save">—</div></div>
      <div class="kpi"><div class="k">% off covered bill</div><div class="v" data-out="savepct">—</div></div>
      <div class="kpi"><div class="k">10-year saving</div><div class="v" data-out="tenyr">—</div></div>
      <div class="kpi"><div class="k">New PPA bill</div><div class="v" data-out="ppabill">—</div></div>
    </div>
  </div>
</div>
```

---
## 4 · BESS Revenue Stack  (`data-calc="bess"`)
```html
<div class="calc" data-calc="bess">
  <div class="calc-head"><h3>Battery revenue stack</h3>
    <p>Stacked annual revenue of a grid battery: arbitrage + capacity + ancillary.</p></div>
  <div class="calc-body">
    <div class="inputs">
      <div class="row"><label for="bpow">Power <span class="val" data-val="power"></span></label>
        <input id="bpow" type="range" data-field="power" data-val-target data-suffix=" MW" value="5" min="1" max="50" step="1"></div>
      <div class="row"><label for="bdur">Duration <span class="val" data-val="dur"></span></label>
        <input id="bdur" type="range" data-field="dur" data-val-target data-suffix=" h" value="2" min="1" max="4" step="0.5"></div>
      <div class="row"><label for="bcyc">Cycles / yr <span class="val" data-val="cycles"></span></label>
        <input id="bcyc" type="number" data-field="cycles" value="365" step="5" min="0"></div>
      <div class="row"><label for="bspr">Arbitrage spread <span class="val" data-val="spread"></span></label>
        <input id="bspr" type="number" data-field="spread" value="60" step="5" min="0"> <small class="note">€ / MWh</small></div>
      <div class="row"><label for="bcap">Capacity payment <span class="val" data-val="cap"></span></label>
        <input id="bcap" type="number" data-field="cap" value="30000" step="1000" min="0"> <small class="note">€ / MW / yr</small></div>
      <div class="row"><label for="banc">Ancillary (FCR) <span class="val" data-val="anc"></span></label>
        <input id="banc" type="number" data-field="anc" value="15000" step="1000" min="0"> <small class="note">€ / MW / yr</small></div>
      <div class="row"><label for="bcx">Capex <span class="val" data-val="bcapex"></span></label>
        <input id="bcx" type="number" data-field="bcapex" value="350" step="10" min="0"> <small class="note">€ / kWh</small></div>
    </div>
    <div class="outputs">
      <div class="kpi hero"><div class="k">Total revenue / yr</div><div class="v" data-out="total">—</div></div>
      <div class="kpi"><div class="k">Arbitrage</div><div class="v" data-out="arb">—</div></div>
      <div class="kpi"><div class="k">Capacity</div><div class="v" data-out="capacity">—</div></div>
      <div class="kpi"><div class="k">Ancillary</div><div class="v" data-out="ancillary">—</div></div>
      <div class="kpi"><div class="k">Simple payback</div><div class="v" data-out="payback">—</div></div>
    </div>
  </div>
</div>
```
