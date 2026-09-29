---
name: video-studio
description: Read first for any request to make, create, edit, animate, or render a video, animation, motion graphic, explainer, tutorial, comparison, product/launch clip, or social/TikTok/YouTube/Shorts video from HTML/CSS. The router and capability map for the video skill set — classifies the request, confirms the brief, and routes to the right creation workflow which composes the domain skills.
metadata:
  author: Kiro
  version: 1.0.0
  layer: router
---

# video-studio — router & capability map

The entry point for making videos from HTML/CSS (rendered to MP4 via headless Chromium +
FFmpeg). Read this first for any "make me a video / animation / motion graphic" request, pick a
workflow, confirm the brief, then let the workflow compose the domain skills.

## How this skill set is organized

```
video-studio (router — you are here)
│
├── creation workflows (pick ONE per request)
│   ├── video-slideshow        tutorial / how-to / step-by-step deck-style video
│   ├── video-comparison       A vs B (products, plans, options) with VS columns / charts
│   ├── video-explainer        explain a concept from text — typography / diagrams
│   ├── video-product-launch   promote a product / feature — hero + features + CTA
│   ├── video-motion-graphics  short (<~10s) kinetic type / stat hit / logo sting
│   └── video-social-promo     vertical 9:16 social clip, big text, upbeat, CTA
│
└── domain skills (composed by the workflows, loaded on demand)
    ├── video-engine     render pipeline (Puppeteer + FFmpeg, presets, flags, frames)
    ├── video-animation  seekable motion (@keyframes / WAAPI, staggers, transitions)
    ├── video-audio      royalty-free music generation + mixing
    └── video-design     style.js, components, palette, backgrounds, safe zones
```

## Routing — pick the workflow

| If the request is… | Route to |
|--------------------|----------|
| A how-to / tutorial / onboarding / feature walkthrough (steps) | `video-slideshow` |
| Compare two or more things (X vs Y, specs, plans, before/after) | `video-comparison` |
| Explain a concept / topic from text, no product | `video-explainer` |
| Market / launch / promote a product, app, or feature | `video-product-launch` |
| A very short punchy motion graphic (title sting, stat, logo) | `video-motion-graphics` |
| A vertical TikTok/Reels/Shorts social clip | `video-social-promo` |
| Doesn't fit / multi-purpose | default to `video-slideshow` and adapt |

More than one may fit (e.g. a vertical comparison clip): pick the primary intent for structure,
then set the preset (`tiktok`) via `video-engine`.

## Confirm the brief first (intent layer)

Before building, confirm these with the user (ask only what's unclear — infer sensible defaults
and state them):

1. **Topic / content** — what's it about; key points or script.
2. **Platform / aspect** — YouTube 16:9, TikTok/Reels/Shorts 9:16, or both. Default: youtube.
3. **Length** — total seconds (or per-section). Default: ~20–35s.
4. **Language** — e.g. Vietnamese/English (fonts + diacritics supported).
5. **Mood / music** — upbeat vs calm; or `--no-music`. Default: upbeat for promo/comparison/
   social, calm for tutorial/explainer.
6. **Resolution** — 1080p (fast) vs 4K (`--scale 2`). Default: 1080p in sandbox, 4K locally.

For time-sensitive/factual topics (specs, prices, releases), verify facts with web search and
cite sources; flag anything unreleased or rumored.

## Production loop (every workflow follows this)

1. **Plan** — outline slides `{ id, duration, html }` from the brief (see the workflow).
2. **Design** — write `style.js` from `video-design`; compose slides with its components.
3. **Animate** — add seekable `anim-*` classes per `video-animation`.
4. **Audio** — generate `music.wav` via `video-audio` (mood-matched, auto-length).
5. **Preview** — screenshot a couple slides (`preview.js <preset> <idx>`) and verify layout.
6. **Render** — `video-engine`: `node render.js --preset <youtube|tiktok|all> [--scale N]`.
7. **Verify** — probe the MP4 (resolution/FPS/duration/audio) and read a frame. A clean exit is
   not proof.

## Setup (once per project)

`npm install puppeteer ffmpeg-static`; ensure an emoji font is installed. Full setup and flags:
`video-engine`. Templates to copy: `render`, `preview`, `package`, `run` (engine); `style`
(design); `make-music` (audio). Each workflow supplies its own `slides.js`.
