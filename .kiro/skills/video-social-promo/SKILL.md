---
name: video-social-promo
description: Create a vertical 9:16 social clip for TikTok, Instagram Reels, or YouTube Shorts rendered to MP4 — short hook, a few big-text points, upbeat music, and a call-to-action, all inside the platform safe zone. Use when the request targets vertical social platforms. Composes the video-engine, video-design, video-animation, and video-audio domain skills.
metadata: { author: Kiro, version: 1.0.0, layer: workflow }
---

# video-social-promo — vertical 9:16 social clip

Short, punchy, phone-first. Reached via `video-studio`. Always renders `--preset tiktok`
(1080×1920). Build a lean `slides.js`.

## Build

1. **Hook first** — the opening 1–2s must grab attention: a bold claim/question as `h1`.
2. **Plan slides** (`slides.js`), keep total ~15–40s:
   - Hook (`slide-center gradient-bg`, huge title).
   - 2–4 point slides on `dark-bg`: big `h2` + short line or a stacked `cards`/`spec-row`.
   - CTA (follow / link / "try it").
   - Durations 2.5–4s.
3. **Design** — `style.template.js` → `style.js` (`video-design`). The `tiktok` preset already
   reserves the **safe zone** (top ~11%, bottom ~16–20%) and enlarges fonts — keep the key line
   vertically centered, not near the bottom.
4. **Animate** — quick, energetic `anim-up`/`anim-pop`, short staggers (`video-animation`).
5. **Audio** — upbeat (`video-audio`).
6. **Preview → Render → Verify** — `video-engine`:
   `node render.js --preset tiktok`. Preview with `node preview.js tiktok <idx>` first.

## Tips
- Big text, few words per slide — assume viewing on a small screen with sound.
- Never place important text in the bottom ~20% (caption/username) or far right (buttons).
- The same file works for TikTok, Reels, and YouTube Shorts.
