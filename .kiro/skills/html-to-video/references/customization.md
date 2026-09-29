# Customization Guide

Detailed reference for tailoring the HTML→video pipeline. Load this only when you need to
change content, styling, resolution, FPS, or music.

## 1. Slide content — `slides.js`

Export an array of slide objects. Each slide:

```js
{
  id: "step1",        // unique id (used in logs / frame grouping)
  duration: 4,        // seconds this slide is shown
  html: `<div class="slide dark-bg"> ... </div>`,  // slide markup
}
```

Rules:
- Every slide's outer element should be `.slide` (fills 1920×1080). Add `.slide-center` to
  center content, and a background class (`.dark-bg` or `.gradient-bg`).
- Total video length = sum of all `duration` values.
- Use the animation classes (below) on child elements to animate them in.

### Reusable building blocks (already styled in style.js)
- `h1`, `h2`, `.subtitle`, `.body` — typography
- `.step-tag` — pill label (e.g. "Bước 1")
- `.logo-badge` — rounded icon badge
- `.cards` > `.card` (`.card-icon`, `.card-title`, `.card-desc`) — feature cards
- `.chat` > `.msg.user` / `.msg.bot` — chat bubbles (`code` inside supported)
- `.pipeline` > `.pipe-item` (`.num`) + `.pipe-arrow` — step pipeline
- `.code-block` with `.c-com` (comment) / `.c-key` (keyword) spans — code snippet

Add your own components by extending `style.js`.

## 2. Animations — `style.js`

Animations use CSS `@keyframes` so they can be **seeked** deterministically by `render.js`.

Available entrance classes:
- `.anim-up`   — fade + slide up
- `.anim-left` — fade + slide from left
- `.anim-pop`  — fade + pop/scale (good for badges/logos)

Stagger with delay classes: `.delay-1` (.18s), `.delay-2` (.36s), `.delay-3` (.54s).

To add a new animation: define a `@keyframes`, then a class that applies it with
`animation: <name> <dur> <easing> forwards;` and start from `opacity: 0`. Do NOT use CSS
`transition` for entrance effects — transitions cannot be seeked frame-accurately.

Change colors/fonts by editing the CSS custom values (backgrounds, `.accent`, font sizes).

## 3. Resolution & FPS — `render.js`

Top-of-file constants:

```js
const FPS = 60;      // 30 = faster render/smaller file; 60 = smoother
const WIDTH = 1920;  // CSS layout width — keep at 1920
const HEIGHT = 1080; // CSS layout height — keep at 1080
const SCALE = 2;     // deviceScaleFactor: 1=1080p, 2=4K(3840x2160), 3=8K
```

- Prefer changing `SCALE` for resolution — never rewrite the CSS to larger pixel sizes.
- Render time scales roughly with `FPS × SCALE²`. 4K@60 can take several minutes.
- `fadeDur` controls the cross-fade between slides (seconds).

### How deterministic seeking works
For each slide, `render.js`:
1. Loads HTML, waits a short settle delay.
2. Grabs `document.getAnimations()` and pauses them all.
3. Per frame, sets `animation.currentTime = (frame/FPS)*1000` and adjusts a fade overlay,
   then screenshots.
This yields identical, smooth output regardless of CPU speed.

## 4. Background music — `make-music.js`

Self-synthesized (no copyright). Generates `music.wav` at 44.1kHz, 16-bit mono.

Knobs inside the file:
- `DURATION` — must match total video length (sum of slide durations).
- `chords` — the chord progression (array of note-name arrays). Default: I–V–vi–IV, calm.
- Layers: pad, arpeggio, bass, soft kick — adjust their gain multipliers to change the mix.
- Global fade-in (1s) / fade-out (1.5s) and master gain (`* 0.7`).
- For a different mood: raise tempo by shortening bars, change the chord set, or increase
  arpeggio/kick gain for energy; lower gains and drop the kick for calmer ambient.

The `NOTE` map provides frequencies; `voice()` mixes harmonics; `softClip()` prevents
clipping.

## 5. Muxing (in render.js)
Two FFmpeg passes:
1. `frame_%06d.png` → silent H.264 MP4 (`-crf 18 -pix_fmt yuv420p`).
2. Mux `music.wav` as AAC (`-c:v copy -c:a aac -b:a 192k -shortest`).

For higher quality (e.g. YouTube 4K), lower `-crf` (e.g. 16) or set an explicit high
`-b:v`. Flat slide content compresses very well, so bitrate is naturally low.

## 6. Checklist before declaring done
- Output resolution/FPS/duration match the request (probe with ffmpeg `-i`).
- Audio stream present when music was requested.
- Spot-check a frame PNG: layout intact, fonts + diacritics correct, emoji not tofu.
