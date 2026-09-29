---
name: video-audio
description: Background music and audio for HTML-to-video — generate a royalty-free soundtrack in code (upbeat ~124 BPM beat-driven, or calm ambient/lo-fi), auto-match its length to the total slide duration, and mux it into the MP4 as AAC. Covers choosing a mood, tuning tempo/energy, and volume. Domain skill loaded on demand by video-studio workflows.
compatibility: Pure Node.js (no external libraries); writes a PCM WAV. Muxing uses the ffmpeg-static binary from video-engine.
metadata:
  author: Kiro
  version: 1.0.0
  layer: domain
---

# video-audio — soundtrack generation & mixing

Self-synthesized, royalty-free background music (no copyright, no external assets). Two ready
styles; pick by mood, then tune.

## Assets (in `assets/`)

| Template | Copy to | Style |
|----------|---------|-------|
| `make-music.template.js`         | `make-music.js` | **Upbeat** ~124 BPM — kick (4-on-the-floor), snare backbeat, hi-hats, groovy bass, bright arpeggio. Good for tech/product/social. |
| `make-music-ambient.template.js` | `make-music.js` | **Calm ambient/lo-fi** — soft pad, slow arpeggio, light kick. Good for tutorials/explainers. |

Copy the one matching the mood to `make-music.js`. Run `node make-music.js` → writes
`music.wav`. The engine mixes it automatically unless `--no-music`.

## Auto-matched length (important)

The generator computes duration from the project's slides so the track always fits:
```js
let DURATION = 23;
try { const slides = require("./slides"); DURATION = Math.ceil(slides.reduce((n,s)=>n+s.duration,0)+0.3); } catch(e){}
```
Always regenerate `music.wav` after changing slide durations, or the engine's `-shortest` mux
will trim the video to the music length.

## Choosing a mood

| Video type | Recommended |
|------------|-------------|
| Product launch, comparison, social promo, motion graphics | Upbeat (124 BPM) |
| Tutorial, faceless explainer, calm walkthrough | Ambient/lo-fi |

## Tuning (in `make-music.js`)

**Upbeat:**
- `BPM` — raise for more energy (128–140 = EDM-ish), lower (100–115) for laid-back.
- Drum gains — kick `0.9`, snare `0.30`, hats `0.06–0.10`. Raise hats for drive.
- `prog` — chord progression (default Am–F–C–G). Swap for a different color.
- Master gain (`* 0.62`) — overall loudness; keep audio below the voice if narration is added.

**Ambient:**
- Chord `barDur`, pad/arp gains; drop the kick for pure ambient.

## Mixing details

The engine muxes with: `-c:v copy -c:a aac -b:a 192k -shortest`. To lower music volume relative
to a future voiceover, reduce the master gain in `make-music.js` (simplest) or add an FFmpeg
`-filter:a "volume=0.5"` step. Sourcing external audio (real songs) is out of scope — this skill
only generates copyright-free music in code.

See `references/synthesis.md` for how the WAV synthesis works (voices, envelopes, WAV header).
