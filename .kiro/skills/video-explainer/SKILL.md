---
name: video-explainer
description: Create a faceless explainer video that teaches a concept or topic from text — no product, no website capture; every visual is invented (typography, diagrams, pipelines, simple data-viz). Use when the request is to explain how something works or what something is. Composes the video-engine, video-design, video-animation, and video-audio domain skills.
metadata: { author: Kiro, version: 1.0.0, layer: workflow }
---

# video-explainer — concept explainer video

Explains an idea from a brief/script with invented visuals. Reached via `video-studio`.
No starter slides — build `slides.js` from the topic.

## Build

1. **Outline the narrative** — hook → 2–4 concept beats → summary. One idea per slide.
2. **Plan slides** (`slides.js`):
   - Hook/title (`gradient-bg`).
   - Concept slides on `dark-bg`: big `h2` claim + a supporting visual — `pipeline` for a
     process, `cards` for parts of a whole, `bars` for a comparison/stat, or clean typography.
   - Summary / takeaway slide.
   - Durations 4–6s so viewers can read.
3. **Design** — `style.template.js` → `style.js` (`video-design`). Lean on typography + one
   diagram per slide; avoid clutter.
4. **Animate** — stagger points with `anim-up` + `delay-*`; grow charts with `scaleY`
   (`video-animation`).
5. **Audio** — calm/ambient keeps focus on the explanation (`video-audio`).
6. **Preview → Render → Verify** — `video-engine`.

## Tips
- Turn abstract ideas into a diagram (`pipeline`) or a 2-bar contrast (`bars`) rather than a
  paragraph.
- Keep on-screen text to a headline + a few words; the visual does the explaining.
- If the topic is factual/current, verify with web search and cite sources.
