# Video skill set (HTML → MP4)

A HyperFrames-style set of Kiro skills for making videos from HTML/CSS: design slides, wire
seekable animations, generate royalty-free music, and render to MP4 with headless Chromium +
FFmpeg. Organized as one router → creation workflows → domain skills.

```
video-studio  (router — read first)
├── workflows (pick one)          ├── domain skills (composed on demand)
│   video-slideshow               │   video-engine     render pipeline (Puppeteer+FFmpeg)
│   video-comparison              │   video-animation  seekable @keyframes / WAAPI
│   video-explainer               │   video-audio      royalty-free music + mixing
│   video-product-launch          │   video-design     style.js, components, backgrounds
│   video-motion-graphics
│   video-social-promo
```

## How to use

Just ask for a video — e.g. "make a 30s comparison of X vs Y for TikTok" or
"create a tutorial video explaining how to set up Z". Kiro matches the request to `video-studio`
(the router), which confirms the brief and routes to the right workflow. You can also invoke a
skill directly as a slash command, e.g. `/video-comparison`.

## Production loop (every workflow)

plan slides → design (`style.js`) → animate (`anim-*`) → music (`make-music.js`) → preview →
render (`node render.js --preset youtube|tiktok|all [--scale 2]`) → verify the MP4.

## Requirements

- Node.js 18+, `npm install puppeteer ffmpeg-static`
- An emoji font (macOS has one; Linux: `fonts-noto-color-emoji`)
- FFmpeg is bundled via `ffmpeg-static` — no separate install

## Layers at a glance

| Skill | Role |
|-------|------|
| `video-studio` | Router: classify request, confirm brief, route to a workflow |
| `video-slideshow` | Tutorial / how-to / step-by-step deck video |
| `video-comparison` | A vs B (VS columns, spec-rows, bar charts, device mockups) |
| `video-explainer` | Explain a concept from text (typography + diagrams) |
| `video-product-launch` | Product / feature promo (hero, features, stat, CTA) |
| `video-motion-graphics` | Short kinetic type / stat / logo sting (<~10s) |
| `video-social-promo` | Vertical 9:16 TikTok / Reels / Shorts clip |
| `video-engine` | Render pipeline: presets, flags, frames, ffmpeg mux |
| `video-animation` | Seekable motion; never CSS transitions |
| `video-audio` | Generate upbeat or ambient music, auto-length, mix |
| `video-design` | `style.js`: palette, type, components, backgrounds, safe zones |

Presets: **YouTube 16:9** and **TikTok/Reels/Shorts 9:16**. Resolution via `--scale`
(1 = base, 2 = 4K). Frames persist per preset so you can re-stitch without re-rendering.

## Note on scope

These skills use a self-contained pipeline (Puppeteer + `ffmpeg-static`) that runs directly in
Kiro — inspired by [HyperFrames](https://github.com/heygen-com/hyperframes) but independent of
its CLI/plugins. Music is synthesized in code (copyright-free); no stock media is fetched.
