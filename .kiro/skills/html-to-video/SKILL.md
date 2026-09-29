---
name: html-to-video
description: Create MP4 videos (tutorials, explainers, slideshows, promos) by designing slides in HTML/CSS, rendering each frame with headless Chromium (Puppeteer), and stitching them with FFmpeg. Optionally generates royalty-free background music. Use when the user wants to make a video from HTML/CSS, turn slides/frames into a video, build an animated explainer or tutorial video, or add background music to a generated video.
compatibility: Requires Node.js 18+, network access to install npm packages (puppeteer, ffmpeg-static), and an emoji font (e.g. Noto Color Emoji) if slides use emoji.
metadata:
  author: Kiro
  version: 1.0.0
---

# HTML/CSS → Video Generator

Build a video by (1) designing each slide as HTML/CSS, (2) rendering frames with headless
Chromium at a fixed FPS using **deterministic animation seeking**, (3) stitching frames into
an MP4 with FFmpeg, and (4) optionally mixing in a self-generated, royalty-free soundtrack.

This pipeline produces crisp output at any resolution (including 4K) because slides are pure
CSS (vector), so scaling up stays sharp.

## When to use

- "Make a tutorial / explainer / promo video"
- "Turn these slides (or HTML) into a video"
- "Create a video from frames I render from HTML/CSS"
- "Add background music to the video"

## Prerequisites (verify first)

1. Check the sandbox / environment for Node.js (18+) and network access.
2. FFmpeg is usually **not** preinstalled — do **not** assume a system `ffmpeg`. Use the
   `ffmpeg-static` npm package instead (it ships a static binary; reference it via
   `require("ffmpeg-static")`).
3. If slides use emoji, install an emoji font or icons render as tofu (□). On Amazon Linux /
   dnf: `sudo dnf install -y google-noto-emoji-color-fonts google-noto-emoji-fonts`.

## Setup

```bash
mkdir -p <project>/frames && cd <project>
npm init -y
npm install puppeteer ffmpeg-static
```

Verify Chromium launches (headless needs sandbox flags):

```bash
node -e "(async()=>{const p=require('puppeteer');const b=await p.launch({args:['--no-sandbox','--disable-setuid-sandbox']});console.log('ok');await b.close();})()"
```

## Files to create

Copy the templates in `assets/` into the project and rename them (drop `.template`):

| Template asset | Copy to | Purpose |
|----------------|---------|---------|
| `assets/slides.template.js`      | `slides.js`      | Slide content + per-slide HTML (edit text here) |
| `assets/style.template.js`       | `style.js`       | Shared CSS + `@keyframes` animations (seekable); per-preset layouts |
| `assets/make-music.template.js`  | `make-music.js`  | Generates royalty-free `music.wav` (ambient/lo-fi) |
| `assets/render.template.js`      | `render.js`      | Renders/saves frames + stitches video + mixes music (flag-driven) |
| `assets/preview.template.js`     | `preview.js`     | Screenshot a couple slides for a preset to check layout fast |
| `assets/package.template.json`   | `package.json`   | Deps + npm scripts (`music`, `youtube`, `tiktok`, `all`, ...) |
| `assets/run.template.sh`         | `run.sh`         | One-shot local runner (macOS/Linux): install + music + render |
| `assets/run.template.bat`        | `run.bat`        | One-shot local runner (Windows) |

Then customize `slides.js` (content) and `style.js` (look). See
`references/customization.md` for the full guide to slide structure, animation classes,
resolution/FPS knobs, and the music generator.

## Run

For the user's local machine, ship `run.template.sh` (→ `run.sh`, macOS/Linux) and
`run.template.bat` (→ `run.bat`, Windows) plus `package.template.json` (→ `package.json`).
These handle dependency install, music generation, and rendering. Rendering locally is far
faster than in a sandbox.

```bash
./run.sh                         # install + music + render all presets
node make-music.js               # optional: create background music (music.wav)
node render.js --preset youtube  # 16:9 landscape (default) -> *-youtube.mp4
node render.js --preset tiktok   # 9:16 vertical -> *-tiktok.mp4 (also for Shorts/Reels)
```

### render.js control flags
`node render.js [--preset youtube|tiktok|youtube,tiktok|all] [flags]`

| Flag | Meaning |
|------|---------|
| `--frames-only` | Render and **save** frames to `frames_<preset>/`, skip video stitching |
| `--video-only`  | Skip rendering; **stitch video from already-saved frames** |
| `--reuse-frames`| Reuse existing frames if the count is sufficient (skip render) |
| `--clean`       | Delete the preset's frame dir before rendering |
| `--no-music`    | Output video without background music |
| `--fps <n>` / `--scale <n>` | Frame rate / deviceScaleFactor (defaults 60 / 2) |

**Frames are persisted** in `frames_<preset>/` (never auto-deleted unless `--clean`). This
lets you render once and re-stitch multiple times with `--video-only`. Separate-step example:

```bash
node render.js --preset all --frames-only    # 1) render + save all frames
node render.js --preset youtube --video-only # 2) stitch YouTube video from saved frames
node render.js --preset tiktok  --video-only # stitch TikTok video, no re-render
```

## Platform aspect ratios (YouTube vs TikTok)

Different platforms need different orientations — you cannot just rotate; the layout must be
re-flowed. The templates support both via a `--preset` flag that sets dimensions and a
`body[data-preset]` attribute the CSS keys off.

| | YouTube (landscape) | TikTok / Shorts / Reels (vertical) |
|---|---|---|
| Aspect ratio | 16:9 | 9:16 |
| Resolution (SCALE=2) | 3840×2160 | 2160×3840 |
| Layout | side-by-side (rows) | stacked (columns), larger text |
| Safe zone | full frame usable | reserve right (~120px) + bottom (~250–300px) for UI |
| Duration | any | short, best 15–60s |

Vertical-layout rules baked into `style.template.js` (`body[data-preset="tiktok"]`):
- Cards/pipeline stack vertically instead of in a row.
- Fonts enlarged for phone readability.
- Extra top/bottom padding reserves the TikTok safe zone (buttons on the right, caption
  below) so nothing important gets covered.
- Horizontal arrows are replaced with CSS-border triangles (a rotated "→" glyph renders as
  tofu; drawing the triangle with borders avoids any font dependency).

Use `preview.template.js` (copy to `preview.js`) to screenshot a couple of slides for a
preset quickly before committing to a full render: `node preview.js tiktok`.

## Key techniques (why this works well)

- **Deterministic rendering:** pause all CSS animations with the Web Animations API, then set
  `animation.currentTime = frameTimeMs` per frame before screenshotting. This makes motion
  perfectly smooth and independent of machine speed (no real-time `setTimeout` jitter).
- **Resolution via device scale, not CSS:** keep the CSS layout at 1920×1080 and set Puppeteer
  `deviceScaleFactor` — `SCALE = 1` → Full HD, `SCALE = 2` → 4K (3840×2160), `SCALE = 3` → 8K.
  No CSS changes needed; text/graphics stay razor sharp.
- **Emoji fonts:** install Noto Color Emoji before rendering or icons appear as tofu boxes.
- **`setContent` waitUntil:** use `domcontentloaded` (not `networkidle0`) plus a short settle
  delay, so rendering doesn't hang waiting on network.
- **Two-pass FFmpeg:** encode frames → silent H.264 MP4, then mux in AAC audio with `-shortest`.

## Verification (always do this)

After rendering, confirm the result actually matches the request — a clean exit is not proof:

```bash
node -e "const{execFileSync}=require('child_process');const f=require('ffmpeg-static');try{execFileSync(f,['-i','OUTPUT.mp4'])}catch(e){console.log(e.stderr.toString().split('\n').filter(l=>/Duration|Stream/.test(l)).join('\n'))}"
```

Check the reported resolution, FPS, duration, and that an audio stream exists if music was
requested. Also read a representative frame PNG to confirm layout, fonts (Vietnamese/accents),
and emoji rendered correctly.

## Common pitfalls

- No system ffmpeg → use `ffmpeg-static`.
- Emoji/symbols show as □ → missing emoji font.
- Jittery motion → you're rendering in real time; switch to `currentTime` seeking.
- Blurry 4K → you scaled CSS instead of using `deviceScaleFactor`.
- 4K × 60fps is slow (minutes) and large; offer 30fps or Full HD if speed/size matters.
