---
name: video-motion-graphics
description: Create a short (under ~10s) design-led motion graphic rendered to MP4 — kinetic typography, a single stat or chart hit, a logo sting, a lower-third, or an animated headline. Use for brief, punchy, usually unnarrated pieces. Composes the video-engine, video-design, video-animation, and video-audio domain skills.
metadata: { author: Kiro, version: 1.0.0, layer: workflow }
---

# video-motion-graphics — short kinetic piece

A tight, design-forward clip (typically 3–10s, 1–3 beats). Reached via `video-studio`. Build a
minimal `slides.js` — often just 1–3 slides.

## Build

1. **Pick the beat(s)** — one of: kinetic title, single stat/number reveal, logo sting, animated
   quote/headline, lower-third. Keep it to 1–3 short slides.
2. **Plan slides** (`slides.js`):
   - Usually `slide-center` on `gradient-bg` or `dark-bg`.
   - Big type (`h1`), optional accent word, or one component (`bars`/number/`logo-badge`).
   - Durations 1.5–3.5s each.
3. **Design** — `style.template.js` → `style.js` (`video-design`). Maximize contrast; minimal
   elements.
4. **Animate** — this is the point: strong `anim-pop`/`anim-up` with overshoot easing
   (`cubic-bezier(.34,1.56,.64,1)`), tight staggers (see `video-animation`).
5. **Audio** — short upbeat sting; or `--no-music` for an overlay asset.
6. **Preview → Render → Verify** — `video-engine`.

## Tips
- Fewer elements, bolder motion. One idea, executed cleanly.
- For an overlay to composite elsewhere, render on a solid bg and key it later, or keep it full
  and use as a bumper. (Transparent-alpha export isn't built in — plan a solid background.)
- Great as an intro/outro bumper reused across other videos.
