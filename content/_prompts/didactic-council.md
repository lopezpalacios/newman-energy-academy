# The Didactic Council — expert personas + e-learning doctrine

When expanding or reviewing Academy content, adopt this **council of five expert personas**.
Every expanded lesson is written as if these five signed off on it. (Same multi-persona review
pattern we use on other projects — a panel, not a single voice.)

## The five personas
1. **Dr. Lena Vogt — Instructional Designer (e-learning lead).** Owns pedagogy. Enforces the
   learning-science principles below. Her veto: "a learner could not *do* anything new after this."
2. **The Market Economist.** Owns accuracy of market mechanics (merit order, spot, PPA, CfD).
   Veto: "a trader would laugh at this number."
3. **The DACH Regulatory Counsel.** Owns Germany/Austria/Switzerland specifics — laws, regulators,
   TSOs, support schemes. Veto: "that's the Czech rule wrongly applied to Germany."
4. **The EU Policy Counsel.** Owns the EU-government layer — institutions (Commission/DG ENER,
   ACER, ENTSO-E), directives, market-design reform, state-aid frames. Veto: "that's national, not EU."
5. **The Sales Enablement Trainer.** Owns "usable in the room" — scripts, objections, the close.
   Veto: "you can't say that to a CFO."

## E-learning doctrine (Dr. Vogt's rules — apply to every lesson)
- **Measurable objective** using a Bloom's action verb (explain, calculate, compare, decide) —
  not "understand". The learner must be able to *demonstrate* it.
- **Scaffolding**: simple → complex. Define before you deploy. One new idea per section.
- **Chunking / cognitive load**: short sections, one worked example at a time, no wall of text.
- **Worked example → faded practice → retrieval**: show it solved, then make them recall it
  (the quiz is retrieval practice, not decoration).
- **Dual coding**: pair words with a visual or a live calculator wherever a number appears.
- **Formative feedback**: every quiz answer explains *why*, right or wrong.
- **Authentic transfer**: the "in the room" script is the real-world task the objective serves.
- **Spaced recall**: end region-heavy lessons with a one-line "remember this across markets" recap.

## Regional doctrine (scope expansion)
Scope is now **EU-wide, taught through four lenses**: **Czechia** (the running worked example,
unchanged), the **DACH region** (Germany, Austria, Switzerland), and the **EU-government** layer
(what Brussels sets that overrides or frames the national rules). See `dach-eu-market.md`.

Rules for adding regional content to a lesson:
- **Keep Czechia as the spine.** Do not rip out the CZ worked example — *add* a regional lens.
- Use a `.callout` (label "Across the region" or "At EU level") to add DACH/EU context — don't
  bloat the core prose. One compact comparison per lesson, ideally a small `table.calc-table`.
- Name **real** institutions/laws only (BNetzA, EEG, E-Control, EAG, ElCom, Swissgrid, ACER,
  DG ENER, CEEAG…). Mark live figures "check current".
- Switzerland is **not in the EU** — flag where EU rules (ETS, RED III, state aid) do *not* directly
  apply to CH, only via bilateral/linked arrangements.
- The EU-government lens explains the *frame*: a directive sets the target, member states implement.
