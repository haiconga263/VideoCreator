---
name: video-animation
description: Seekable animation for HTML-to-video — author entrance/exit motion, staggers, and slide cross-transitions as CSS @keyframes or Web Animations API (WAAPI) so the render engine can seek each frame deterministically. Covers the atomic motion rules, ready-to-use animation classes, and why CSS transitions must never be used. Domain skill loaded on demand by video-studio workflows.
metadata:
  author: Kiro
  version: 1.0.0
  layer: domain
---

# video-animation — seekable motion

Motion that renders identically every time. The engine (`video-engine`) pauses all animations
and sets `currentTime` per frame, so every animation MUST be **seekable**.

## The one hard rule

- ✅ Use CSS `@keyframes` (with `animation: ... forwards`) or WAAPI (`element.animate(...)`).
- ❌ Never use CSS `transition` for entrance/exit effects. Transitions fire on state change and
  cannot be seeked to an arbitrary time — they produce jitter or blank frames when rendered.

Rule of thumb: if motion can't be reproduced by setting a single `currentTime`, it's wrong.

## Ready-to-use entrance classes

Add these to any element; the shared `style.js` defines them. Start state is `opacity: 0`.

| Class | Effect |
|-------|--------|
| `anim-up`   | fade + slide up (40px) |
| `anim-left` | fade + slide in from left |
| `anim-pop`  | fade + scale pop (good for badges/logos/numbers) |

Stagger children with delay classes: `.delay-1` (.18s), `.delay-2` (.36s), `.delay-3` (.54s).

```html
<h2 class="anim-up">Title</h2>
<p class="anim-up delay-1">Subtitle appears slightly later</p>
<div class="card anim-up delay-2">…</div>
```

## Defining a new keyframe animation

```css
@keyframes slideRight { from { opacity:0; transform: translateX(-40px);} to {opacity:1; transform:none;} }
.anim-right { opacity: 0; animation: slideRight .7s cubic-bezier(.2,.7,.3,1) forwards; }
```
Requirements: start from `opacity: 0` (or your intended pre-state), use `forwards` to hold the
end state, and keep durations ~0.5–0.9s for a snappy but smooth feel.

## WAAPI alternative (for JS-driven motion)

```js
const a = el.animate(
  [{ opacity: 0, transform: "translateY(40px)" }, { opacity: 1, transform: "none" }],
  { duration: 700, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" }
);
a.pause(); // engine will seek it; leaving it paused is fine
```
WAAPI animations are automatically picked up by `document.getAnimations()`, so the engine seeks
them too — no extra wiring.

## Slide cross-transitions

Handled by the engine, not per-slide: a full-screen `#__fade` overlay fades in at each slide
boundary (`fadeDur` seconds). Don't build your own between-slide fades — author only the
in-slide entrance motion.

## Bar-fill / count-style reveals

For charts or numbers, animate the visual property with a keyframe (e.g. bar `height` from 0 to
target, or `clip-path`) rather than counting text in real time. Keep it seekable.

See `references/motion-recipes.md` for easings, timing guidance, and common blueprints
(title in, list stagger, chart grow, logo sting).
