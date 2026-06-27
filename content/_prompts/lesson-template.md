# Lesson template — structure every lesson copies

**Reference implementation to clone:** `tracks/exit-npv-dcf.html`. Open it; copy the `<head>`,
the `<nav>`, the `.lesson-head`, the `.lesson` grid (aside TOC + main), and the footer **verbatim**,
changing only the content and the trail/title. This guarantees a consistent site.

## Page skeleton (slots in CAPS)
```
<head> … title = "LESSON TITLE — Newman Energy Sales Academy", meta description …
  links: ../assets/css/newman.css , ../assets/css/academy.css , Google Fonts (Montserrat+Inter)
<nav>            ← copy verbatim from reference (white logo SVG on accent pill)
<header class="lesson-head">
  .trail   = "Track NN · TRACK NAME · Lesson L of N"
  h1       = LESSON TITLE
  .sub     = one-paragraph hook, may use <em>
  .facts   = Level / Time / Tool / Example chips
<div class="lesson">
  <aside class="lesson-aside"> back-link + .toc (one <a href="#id"> per section)
  <main class="lesson-main">
    <section id="objective"> .callout.objective — learning objective
    <section id="…">         h2 + concept prose (define terms, bold them)
    <section id="…">         .callout.keyterm for each KEY TERM
    <section id="worked">    .worked box(es): table.calc-table + .formula
    <section id="calc">      [OPTIONAL] live calculator widget (see calculators.md)
    <section id="script">    .script — "in the room" sales line
    <section id="objections">.objections → .obj (q / tag / a) ×3
    <section id="check">     .quiz → .q-item ×3 (radio .q-opt, data-correct, .q-feedback)
    .pager  prev / next
<footer>         ← copy compact footer from reference
<script src="../assets/js/newman.js"></script>
<script src="../assets/js/academy.js"></script>
```

## Design invariants (do not violate)
- Light canvas, flat, **one purple accent `#621558`**. No gradients in UI chrome.
- Headings use the classes already styled (`.lesson-main h2/h3`). Don't add inline colors except
  the small accent links already shown in the reference.
- Use `data-rise` (+ optional `data-delay="1..4"`) on cards/blocks you want to fade-in on scroll.
- Keep paragraphs short. One idea per `<section>`.

## Component cheat-sheet (classes from academy.css)
- `.callout` / `.callout.objective` / `.callout.keyterm` — `.lbl` + `<p>`
- `.worked` — `.lbl` + `table.calc-table` (`td.num`, `tr.total`) + `.formula`
- `.script` — dark navy quote block, `.lbl` + `<p>` (quotes auto-added)
- `.objections` > `.obj` — `.q` (auto-quoted) + `.tag` "Rebuttal" + `.a`
- `.quiz` > `.q-item` — `.stem` + `.q-opts` > `.q-opt[data-correct]` (radio) + `.q-feedback`
- `.pager` — `a.prev` / `a.next`, each with `<small>` label

## Tone reminder
Define jargon. Real numbers. Usable in the room. Illustrative, never advice.
