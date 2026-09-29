---
name: video-comparison
description: Create an A-vs-B comparison video (products, phones, plans, options, before/after) rendered to MP4 — VS columns, spec-row tables, bar charts, and CSS device mockups. Use when the request is to compare two or more things. Composes the video-engine, video-design, video-animation, and video-audio domain skills.
metadata: { author: Kiro, version: 1.0.0, layer: workflow }
---

# video-comparison — A vs B video

Side-by-side comparison. Reached via `video-studio`. Starter: `assets/slides.template.js`
(the iPhone 17 vs 18 Pro example) → adapt to the user's subjects.

## Build

1. **Verify facts first** — for products/specs/prices/releases, use web search and cite
   sources; flag anything rumored or unreleased. Don't invent numbers.
2. **Plan slides** (`slides.js`):
   - Intro (`gradient-bg`, title "X vs Y").
   - Overview: `vs` columns with `phone`/logo mockups + headline spec each; mark the standout
     column `.hot` with a badge.
   - Per-topic slides: `spec-row`s (label in the middle, `.win` on the better side) or a `bars`
     chart for a headline metric.
   - Verdict: who should pick which.
   - CTA outro.
3. **Design** — `style.template.js` → `style.js` (`video-design` has `vs`, `spec-row`, `phone`,
   `bars` components).
4. **Animate / Audio** — upbeat mood fits comparisons (`video-audio`).
5. **Preview → Render → Verify** — `video-engine`.

## Tips
- Consistent color roles: side A = neutral/yellow, side B = blue `.win`, "newest" = orange badge.
- Prefer a `bars` chart over text for a big performance delta.
- Keep each topic to 3 spec-rows max for readability.
