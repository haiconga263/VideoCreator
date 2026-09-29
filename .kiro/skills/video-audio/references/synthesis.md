# Audio synthesis internals

Load when editing `make-music.js` beyond simple tuning.

## Output format
16-bit PCM mono WAV at 44100 Hz, written by hand (44-byte RIFF/WAVE/fmt/data header + samples).
Samples are `Float32` in `[-1, 1]`, soft-clipped with `tanh`, then scaled to int16.

## Signal path (upbeat)
Per sample at time `t`, sum these layers then apply fades + master gain:
1. **Kick** — sine sweep (≈130→48 Hz) with exponential decay, on every beat (4-on-the-floor).
2. **Snare/clap** — filtered noise burst + short tone on beats 2 & 4 (backbeat).
3. **Hi-hat** — decaying noise every 1/16 note; slightly open on the offbeat 16th for groove.
4. **Bass** — `saw()` on the chord root, retriggered each 1/8 note with a pluck envelope.
5. **Arp** — `saw()` plucks running the chord tones an octave up, each 1/16 note.
6. **Pad** — soft sustained sines of the chord for body.

Timing derives from `BPM`: `beatDur = 60/BPM`, `barDur = beatDur*4`, `step16 = beatDur/4`.
The chord for a bar is `prog[barIndex % prog.length]`.

## Helpers
- `saw(w)` — band-limited-ish sawtooth from summed harmonics (brighter than a sine).
- `noise()` — white noise for percussion.
- `softClip(x)` — `tanh(x*1.1)` to tame peaks.

## Envelopes & fades
- Percussion/pluck use `Math.exp(-t*k)` decays; larger `k` = shorter/tighter.
- Global fade-in (~0.5s) and fade-out (~1.2s) prevent clicks at start/end.
- Master gain multiplier keeps the mix from clipping and sits it under any future narration.

## Ambient variant
Same WAV writer; the signal path is a slow chord pad + arpeggio + light kick, with a calmer
progression and longer bars. Remove the kick layer for pure ambient.

## Changing length
`DURATION` (seconds) drives sample count `N = SAMPLE_RATE * DURATION`. It auto-reads the slides'
total; override by editing the fallback if generating music standalone.
