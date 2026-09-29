# Design guide

Load when composing slide visuals or adding a new component to `style.js`.

## Composition patterns by video type

| Video type | Slide arc |
|------------|-----------|
| Slideshow / tutorial | hero intro → numbered steps (step-tag + cards/code/pipeline) → outro |
| Comparison (A vs B)  | intro → VS overview (phone mockups) → per-topic spec-rows / bar chart → verdict → CTA |
| Explainer            | hook → concept slides (typography + diagram/pipeline) → summary |
| Product launch       | logo/hero → feature cards → highlight stat (bar/number) → CTA |
| Motion graphics      | 1–3 punchy beats, mostly kinetic type + one stat/logo hit |
| Social promo (9:16)  | short hook → 2–4 quick points stacked → CTA; big text, safe zone respected |

## Slide skeleton

```html
<div class="slide dark-bg">
  <div class="step-tag anim-left">Label</div>
  <h2 class="anim-up">Slide title</h2>
  <!-- one primary component (cards / spec-rows / chart / mockups) -->
</div>
```
Center-style hero/outro slides:
```html
<div class="slide slide-center gradient-bg">
  <div class="logo-badge anim-pop">📱</div>
  <h1 class="anim-up">Title</h1>
  <p class="subtitle anim-up delay-1">Subtitle</p>
</div>
```

## TikTok safe zone (9:16)

- Reserve roughly the top ~11% and bottom ~16–20% of the frame. The template's
  `220px` top / `380px` bottom padding (at 1080×1920 base) handles this.
- Keep the single most important line vertically centered, not near the bottom.
- Big fonts: titles ~92–120px, body ~52px at base — readable on a phone.

## Adding a new component

1. Add base CSS under a clear section comment in `style.js`.
2. Add `body[data-preset="tiktok"] .yourthing { … }` overrides (stack, enlarge, safe-area).
3. Make any entrance motion seekable (see `video-animation`).
4. Avoid rotating text glyphs; draw arrows/shapes with borders/SVG.
5. Preview with `preview.js <preset> <slideIndex>` before a full render.

## Color usage
- One accent per emphasis role: yellow = side A / neutral highlight, blue = side B / "winner",
  orange = "newest/hot". Don't overload a slide with all three.
- Keep body text high-contrast on `dark-bg` (`#e8ecf5` on deep navy).

## Illustration recipes
- **Phone mockup:** rounded rect body + inset `.screen`, a `.island` pill, a `.cam` square with
  two lens pseudo-elements. Variant classes (`.p18`) tweak color/island size.
- **Bar chart:** flex row of `.bar-group`; set each `.bar` height inline as a percentage of the
  chart height; label below. Animate with `scaleY` grow (see motion-recipes).
- **Diagram/flow:** reuse `.pipeline` (auto-vertical on TikTok).
