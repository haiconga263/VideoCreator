---
name: video-slideshow
description: Create a tutorial, how-to, onboarding, or step-by-step walkthrough video as a deck-style slideshow rendered to MP4. Use when the request is to explain how to use/do something in ordered steps. Composes the video-engine, video-design, video-animation, and video-audio domain skills.
metadata: { author: Kiro, version: 1.0.0, layer: workflow }
---

# video-slideshow — tutorial / how-to video

For step-by-step content: intro → numbered steps → outro. Reached via `video-studio`.

## Build

1. **Plan slides** — start from `assets/slides.template.js` → `slides.js`. Structure:
   - Hero intro (`gradient-bg`, `logo-badge`, title + subtitle).
   - One slide per step: `step-tag` ("Bước 1") + `h2` + a primary component
     (`cards`, `code-block`, `pipeline`, or `chat`) from `video-design`.
   - Outro (`gradient-bg`, CTA).
   - Typical durations 3.5–5s/slide.
2. **Design** — copy `style.template.js` (from `video-design`) → `style.js`.
3. **Animate** — `anim-up`/`anim-left` + `delay-*` on step elements (`video-animation`).
4. **Audio** — calm/ambient mood suits tutorials (`video-audio`: use the ambient generator).
5. **Preview → Render → Verify** — per `video-engine` (`--preset youtube` default).

## Tips
- One idea per slide; keep step text short, let the component carry detail.
- Use `code-block` for CLI/config, `pipeline` for a process, `cards` for options.
- For a vertical version, also render `--preset tiktok` (layout auto-stacks).
