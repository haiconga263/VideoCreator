# Pipeline internals & troubleshooting

Load this when you need to modify `render.js` behavior or debug rendering.

## Deterministic seeking (why motion is smooth)

Per slide, `render.js`:
1. Loads HTML with `waitUntil: "domcontentloaded"` + a short settle delay (avoid `networkidle0`
   which can hang).
2. Grabs `document.getAnimations()` and pauses them all.
3. For each frame `f`: sets every animation's `currentTime = (f / FPS) * 1000` ms, adjusts the
   cross-fade overlay, then screenshots.

This makes output identical regardless of CPU speed — no real-time `setTimeout` jitter. It is
also why animations MUST be keyframe/WAAPI based, not CSS `transition` (transitions can't be
seeked frame-accurately).

## Resolution model

Viewport stays at the preset base (`youtube` 1920×1080, `tiktok` 1080×1920). `deviceScaleFactor`
= `--scale`. Final pixels = base × scale. Keep CSS authored at base size; the browser
supersamples. This keeps text/vector art razor sharp at 4K/8K.

## Presets

```js
const PRESETS = {
  youtube: { w: 1920, h: 1080, out: "...-youtube.mp4" }, // 16:9
  tiktok:  { w: 1080, h: 1920, out: "...-tiktok.mp4"  }, // 9:16
};
```
Body gets `data-preset="<name>"`; `style.js` keys layout off `body[data-preset="..."]`.
Frames go to `frames_<preset>/` so presets don't clobber each other.

### Adding a preset (e.g. Instagram square 1:1)
1. Add `square: { w: 1080, h: 1080, out: "...-square.mp4" }` to `PRESETS`.
2. Add `body[data-preset="square"]` layout rules in `style.js`.
3. Run `node render.js --preset square`.

## Two-pass FFmpeg mux

1. Frames → silent H.264: `-framerate <FPS> -i frame_%06d.png -c:v libx264 -pix_fmt yuv420p
   -crf 18 -preset medium`.
2. Mux audio: `-i silent.mp4 -i music.wav -c:v copy -c:a aac -b:a 192k -shortest`.

For higher quality (YouTube 4K archive), lower `-crf` to ~16 or set an explicit `-b:v`. Flat
slide content compresses very well, so bitrate is naturally low — that's expected.

## Cross-fade between slides
A fixed `#__fade` overlay (bg `#0d1220`) fades from opaque→transparent over `fadeDur` seconds at
the start of each slide after the first. Tune `fadeDur` in `render.js`.

## Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| `ffmpeg: not found` | Use `ffmpeg-static`, don't assume system ffmpeg |
| Icons show as □ | Missing emoji font — install Noto Color Emoji |
| `setContent` timeout | Use `waitUntil: "domcontentloaded"` + settle delay, not `networkidle0` |
| Jittery motion | You're not seeking `currentTime`; ensure animations are paused + seeked |
| Blurry 4K | You scaled CSS instead of using `--scale` |
| Video cut short | Music shorter than video + `-shortest` — make music match total slide duration |
| Rotated arrow tofu | Don't rotate a `→` glyph; draw a CSS-border triangle instead |
