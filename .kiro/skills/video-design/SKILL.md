---
name: video-design
description: Visual design system for HTML-to-video — the shared style.js (palette, typography, backgrounds) plus reusable slide components (cards, VS columns, spec-rows, CSS phone mockups, bar charts, code blocks, pipelines) and the per-preset layout rules including the TikTok 9:16 safe zone. Domain skill loaded on demand by video-studio workflows when composing how a slide looks.
metadata:
  author: Kiro
  version: 1.0.0
  layer: domain
---

# video-design — look & layout system

Owns `style.js`: the CSS shared by every slide. Copy `assets/style.template.js` → `style.js`
and compose slides using the components below. Layout adapts per preset via
`body[data-preset="youtube"|"tiktok"]`.

## Backgrounds

| Class | Look |
|-------|------|
| `dark-bg`     | Deep tech background: subtle grid + blue (top-left) & orange (bottom-right) glows. Default for content slides. |
| `gradient-bg` | Vivid multi-color mesh (purple/blue/pink). Use for intro/outro/hero slides. |

Content sits above the grid via `.slide > * { z-index: 1 }`. To recolor, edit the radial/linear
gradients in `style.js`.

## Palette & type

- Accent yellow `#ffe066` (`.accent`), accent blue `#64d2ff`, hot orange `#ff9f0a`.
- Headings 800 weight; `h1` ~108px, `h2` ~84px (auto-enlarged on TikTok).
- Body `.body` ~40px, `.subtitle` ~40px. Keep line lengths readable.

## Reusable components (all pre-styled)

| Component | Markup sketch | Use for |
|-----------|---------------|---------|
| Step tag  | `<div class="step-tag">Bước 1</div>` | Section label pill |
| Logo badge| `<div class="logo-badge">📱</div>` | Hero icon |
| Cards     | `.cards > .card (.card-icon/.card-title/.card-desc)` | Feature list (row; stacks on TikTok) |
| Chat      | `.chat > .msg.user / .msg.bot` | Conversation mock |
| Pipeline  | `.pipeline > .pipe-item (.num) + .pipe-arrow` | Step flow (row; vertical on TikTok) |
| Code block| `.code-block` with `.c-com`/`.c-key` spans | Code snippet w/ highlight |
| VS columns| `.vs > .vs-col (.hot) + .vs-mid` | Side-by-side comparison |
| Spec row  | `.spec-row > .spec-a / .spec-label / .spec-b (.win)` | A-vs-B feature table row |
| Phone mock| `.phone (.p17/.p18) > .screen > .island + .cam` | CSS phone illustration |
| Laptop mock| `.laptop (.black) > .lid > .notch + .display; .base` | CSS laptop illustration (`.black` = Space Black) |
| Bar chart | `.bars > .bar-group > .bar (.b17/.b18) + .bar-label` | Simple 2-bar comparison chart |

All accept the `anim-*` / `delay-*` classes from `video-animation`.

## Preset layout rules

- **youtube (16:9):** slide padding `120px 140px`; cards/pipeline in a row.
- **tiktok (9:16):** slide padding `220px 96px 380px 96px` — the big top/bottom padding is the
  **safe zone**: keeps content clear of TikTok's right-side buttons and bottom caption/username.
  Cards & pipeline stack vertically; fonts enlarged. Horizontal `→` arrows become CSS-border
  triangles (rotating the glyph renders as tofu).

## Illustrations without stock images

Prefer CSS/SVG-drawn visuals (phone mockups, bar charts, diagrams) over bitmap images — they
scale sharp at 4K and carry no licensing concerns. Emoji work as lightweight icons if the emoji
font is installed.

See `references/design-guide.md` for building new components, safe-zone measurements, and
composition patterns per video type.
