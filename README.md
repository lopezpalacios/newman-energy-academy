# Newman Energy Sales Academy

A sales-enablement curriculum for the businessperson entering **Europe's commercial &
industrial (C&I) energy market** — power purchase agreements (PPAs), solar, battery storage
(BESS), the financial models behind them, how a project is built and sold to a fund, and how to
fund the build with EU grants. **Czechia is the recurring worked example; principles are EU-wide.**

Static site, no build step. Newman Energy v3 design system (light, flat, purple). Vanilla
HTML/CSS/JS with live financial calculators.

## Structure
```
index.html              Landing — 7-track curriculum grid
glossary.html           Plain-English glossary of every key term
tracks/                 28 lessons (4 per track)
assets/css/             newman.css (design system) + academy.css (course layer)
assets/js/              newman.js (UI) + academy.js (calculators + animations)
content/_prompts/       Master system prompt + lesson template (content engine)
content/_grounding/     EU/CZ market data, EU-funding facts, calculator markup, lesson map
```

## The 7 tracks
1. **Why this is a business** — the macro case (market, volatility, mandates, grid parity)
2. **The products** — solar, BESS, PPA structures, Energy-as-a-Service
3. **Financial models** — LCOE, customer savings, developer economics, BESS revenue stacking
4. **The sale** — qualify, pitch, objections, close
5. **Building the project** — origination to commercial operation
6. **The exit** — selling operating assets to funds at a discounted present value (yield compression)
7. **EU funding & grants** — Modernisation Fund, OP TAK, RES+, InvestEU, EIB; where to look & who to contact

## Calculators (in `assets/js/academy.js`)
LCOE builder · Customer savings · NPV/DCF exit valuation · BESS revenue stack. Each auto-binds to
a `[data-calc]` widget and animates its outputs.

## Run locally
```
python3 -m http.server 8765   # then open http://localhost:8765
```

## Deploy
GitHub Pages from the repo root (`.nojekyll` present). 

---
Educational material — not investment advice.
