---
name: video-engine
description: The render pipeline for HTML/CSS-to-video — set up Puppeteer + ffmpeg-static, render seekable HTML slides to PNG frames deterministically, and stitch them into MP4 with presets (YouTube 16:9, TikTok 9:16), FPS/scale (4K) control, persisted frames, and frames-only/video-only steps. Domain skill loaded on demand by video-studio workflows; pull it when you need the actual rendering/encoding layer.
compatibility: Requires Node.js 18+, network access to install npm packages (puppeteer, ffmpeg-static), and an emoji font (e.g. Noto Color Emoji) for emoji glyphs.
metadata:
  author: Kiro
  version: 1.0.0
  layer: domain
---

# video-engine — HTML → MP4 render pipeline

The deterministic rendering core. Turns a `slides.js` (content) + `style.js` (CSS/animation)
into MP4 by seeking each frame in headless Chromium and encoding with FFmpeg. This is the
layer the creation workflows (slideshow, comparison, explainer, ...) compose against.

## Setup

```bash
mkdir -p <project>/ && cd <project>
npm init -y
npm install puppeteer ffmpeg-static
```

- **No system ffmpeg** — use the `ffmpeg-static` npm binary via `require("ffmpeg-static")`.
- **Emoji font** — install so icons don't render as tofu (□). Amazon Linux/dnf:
  `sudo dnf install -y google-noto-emoji-color-fonts google-noto-emoji-fonts`. macOS has it.
- Verify Chromium launches with `--no-sandbox --disable-setuid-sandbox`.

## Files this skill provides (in `assets/`)

| Template | Copy to | Purpose |
|----------|---------|---------|
| `render.template.js`   | `render.js`   | Render/save frames + stitch video + mix music (flag-driven) |
| `preview.template.js`  | `preview.js`  | Screenshot chosen slides for a preset to check layout fast |
| `package.template.json`| `package.json`| Deps + npm scripts (`youtube`, `tiktok`, `all`, `frames`, `video`) |
| `run.template.sh`      | `run.sh`      | One-shot local runner (macOS/Linux): install + music + render |
| `run.template.bat`     | `run.bat`     | One-shot local runner (Windows) |

The workflow supplies `slides.js` and `style.js`; audio comes from `video-audio`
(`make-music.js` → `music.wav`).

## The composition contract

- `slides.js` exports an array of `{ id, duration (seconds), html }`.
- Each slide's root element is `.slide`; add a background class and `.slide-center` to center.
- Total video length = sum of `duration`s. `render.js` computes frame counts from FPS.
- Animations must be **seekable** (CSS `@keyframes` / WAAPI) — see `video-animation`. The engine
  pauses `document.getAnimations()` and sets `currentTime` per frame for deterministic output.

## Running

```bash
node render.js --preset youtube          # 16:9 landscape (default)
node render.js --preset tiktok           # 9:16 vertical (Shorts/Reels too)
node render.js --preset all              # both
```

### Control flags
| Flag | Meaning |
|------|---------|
| `--frames-only` | Render + save frames to `frames_<preset>/`, skip stitching |
| `--video-only`  | Stitch video from already-saved frames (no re-render) |
| `--reuse-frames`| Reuse existing frames if count is sufficient |
| `--clean`       | Delete the preset's frame dir before rendering |
| `--no-music`    | Output without background music |
| `--fps <n>` / `--scale <n>` | Frame rate / deviceScaleFactor (default 60 / 2 = 4K) |

**Resolution via `--scale`, not CSS:** layout stays at the preset base size; `scale 1` = base,
`2` = 4K, `3` = 8K. Never rewrite CSS to larger pixels. Render time ≈ `FPS × scale²`.

**Frames persist** in `frames_<preset>/` (deleted only with `--clean`) — render once, re-stitch
many times with `--video-only`.

## Verification (always)

Probe the output; a clean exit is not proof:
```bash
node -e "const{execFileSync}=require('child_process');const f=require('ffmpeg-static');try{execFileSync(f,['-i','OUTPUT.mp4'])}catch(e){console.log(e.stderr.toString().split('\n').filter(l=>/Duration|Stream/.test(l)).join('\n'))}"
```
Confirm resolution, FPS, duration, and an audio stream if music was requested. Read a
representative frame PNG to confirm layout, fonts/diacritics, and emoji.

See `references/pipeline.md` for internals (deterministic seeking, cross-fade, two-pass mux)
and troubleshooting.
