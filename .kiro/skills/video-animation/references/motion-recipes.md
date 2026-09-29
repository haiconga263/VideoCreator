# Motion recipes

Blueprints and timing guidance for seekable animation. Load when composing a slide's motion.

## Easings (paste-ready)

| Feel | cubic-bezier |
|------|--------------|
| Smooth ease-out (default) | `cubic-bezier(.2,.7,.3,1)` |
| Gentle | `cubic-bezier(.25,.1,.25,1)` |
| Snappy overshoot | `cubic-bezier(.34,1.56,.64,1)` |
| Linear (charts/progress) | `linear` |

## Timing guidance

- Entrance duration: 0.5–0.9s. Longer feels sluggish on short clips.
- Stagger step: 0.12–0.2s between sibling elements.
- Give each slide ≥ ~1s of hold after its last element lands before the slide ends.
- Keep total motion inside the slide's `duration`; the engine seeks 0 → duration.

## Blueprints

### Title in + subtitle stagger
```html
<h1 class="anim-up">Headline</h1>
<p class="subtitle anim-up delay-1">Supporting line</p>
```

### List / cards stagger
Apply `anim-up` to each item with increasing `delay-1/2/3`. For >3 items, add `.delay-4`
(.72s) etc. in `style.js`.

### Chart grow (seekable)
```css
@keyframes grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
.bar { transform-origin: bottom; opacity:0; animation: grow .8s cubic-bezier(.2,.7,.3,1) forwards; }
```
Animate `transform: scaleY` (compositor-friendly) rather than `height` when possible.

### Logo / badge sting
```css
@keyframes pop { from {opacity:0; transform: scale(.6);} 70% {transform: scale(1.05);} to {opacity:1; transform: scale(1);} }
.anim-pop { opacity:0; animation: pop .8s cubic-bezier(.2,.7,.3,1) forwards; }
```

### Draw-in underline / divider
```css
@keyframes draw { from { transform: scaleX(0);} to { transform: scaleX(1);} }
.rule { transform-origin: left; animation: draw .6s ease-out forwards; }
```

### Kinetic emphasis word
Wrap a word in a span and pop it slightly after the line lands (`delay-1`), or tint with an
accent color for contrast.

## Anti-patterns
- `transition: all .3s` on hover/state → not seekable. Remove.
- Real-time JS counters (`setInterval` incrementing text) → non-deterministic. Use a keyframe on
  a visual property or precompute per-frame from `currentTime`.
- Infinite loops with no fixed period the engine can land on → avoid, or make the period divide
  evenly into the frame step.
