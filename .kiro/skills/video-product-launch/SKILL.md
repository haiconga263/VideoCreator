---
name: video-product-launch
description: Create a product launch or feature-announcement promo video rendered to MP4 — hero title, feature cards/highlights, a standout stat, and a call-to-action. Use when the request is to market, launch, or promote a product, app, or feature. Composes the video-engine, video-design, video-animation, and video-audio domain skills.
metadata: { author: Kiro, version: 1.0.0, layer: workflow }
---

# video-product-launch — promo / launch video

Sells a product or feature. Reached via `video-studio`. Build `slides.js` from the brief
(product name, key features, one big number, CTA).

## Build

1. **Gather the brief** — product/feature name, 2–4 selling points, a headline stat if any,
   the CTA (e.g. "Available today", URL, "Pre-order now").
2. **Plan slides** (`slides.js`):
   - Hero (`gradient-bg`, `logo-badge`/name, tagline).
   - Feature slides: `cards` (icon + title + one-line benefit), one theme per slide.
   - Highlight: a `bars` chart or a big number for the standout metric.
   - CTA outro (`gradient-bg`, action + where/when).
   - Punchy durations 3–4.5s.
3. **Design** — `style.template.js` → `style.js` (`video-design`); use the vivid `gradient-bg`
   for hero/CTA, `dark-bg` for features.
4. **Animate** — snappy `anim-pop` on the logo/number, `anim-up` staggers on features.
5. **Audio** — upbeat/energetic (`video-audio`).
6. **Preview → Render → Verify** — `video-engine`. Consider `--preset all` for both platforms.

## Tips
- Lead with the single biggest benefit; don't list specs like a datasheet.
- One clear CTA. End on it and hold ~1s.
- Keep brand claims accurate; verify any public facts.
