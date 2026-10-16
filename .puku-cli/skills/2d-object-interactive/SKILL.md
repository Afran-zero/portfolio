---
name: 2d-object-interactive
description: 2D vector shape language and interaction system for the Kaif portfolio — shape vocabulary, SVG primitives, mouse + scroll reactivity, reduced-motion support, performance budget. Load when designing, adding, or reviewing any background shapes, hero illustration, or interactive visual.
---

# 2D Object Interactive Skill

This skill defines the **2D visual language** of the Kaif portfolio: the geometric shapes, the SVG implementation, and the subtle interactivity that makes the site feel **alive but never busy**.

The portfolio's signature is **"blue geometric shape system + vector portrait"** (see `PLAN.md` §62). This skill is how we make that signature real — consistently, performantly, and accessibly.

Load this skill when:

- Adding a background shape to any page or section.
- Building the hero illustration (vector portrait).
- Adding scroll- or mouse-driven interaction to shapes.
- Reviewing or refactoring the visual system.
- Designing a new data-visualization element (e.g., the data pipeline).

---

## 1. Visual principles (the why)

### Subtlety over spectacle

The shapes are **support**, not subject. They sit behind type, mark transitions, and breathe with the user's interaction. They never compete for attention with content.

### Geometric, not illustrative

We build from primitives: circles, lines, rectangles, arcs. No organic blobs, no gradients, no shading. The grammar is **Swiss editorial + technical diagram**, not "designer's portfolio 2018".

### Two dimensions, not three

No shadows that imply depth (except a single 1px shadow on the project detail hero — see `PLAN.md` §10). No perspective. No faux-3D. The site is **flat 2D**.

### One accent color, used once

Blue (`#1769FF`) appears on **at most one shape per section**, and only on small surfaces. Soft blue (`#EAF2FF`) and very-light blue (`#F5F8FF`) carry the rest of the weight.

### Animation must answer "why"

Every animated shape must answer: does this improve understanding, navigation, or personality? If not, delete it. (See `PLAN.md` §60.)

---

## 2. Shape vocabulary

### Allowed primitives

| Shape              | Use                                          | Notes                                |
| ------------------ | -------------------------------------------- | ------------------------------------ |
| Circle (filled)    | Hero accent, divider markers                 | Solid `--blue` or `--blue-soft` only |
| Circle (outlined)  | Abstract diagrams, dot grids                 | Stroke 1px or 2px                    |
| Semicircle         | Section dividers                             | Flat side down                       |
| Rectangle (filled) | Data pipeline stages, badges                 | Sharp corners preferred              |
| Rectangle (outlined) | Cards, frames                            | Stroke 1px                            |
| Rounded rectangle  | Buttons, chips                               | Max radius 6px                       |
| Line (1px)         | Timelines, separators, grid                  | `--fg` at 60% opacity, or `--blue`   |
| Line (2px)         | Hero accents, signature lines                | Use sparingly                        |
| Arc                | Decorative flourishes                        | Max 90°                              |
| Dot grid           | Background texture, data visualization       | 8–16px spacing                       |
| Polygon (outlined) | Abstract decorative shapes                   | 3–8 sides, no organic curves         |
| Grid fragment      | Background depth                              | 1px lines, 40px spacing              |

### Forbidden

- Spheres, ellipses with shading.
- 3D primitives.
- Blobs (radial gradient + blur).
- Drop shadows on shapes.
- Gradients as shape fill.
- Curved organic paths.
- Emoji as shape.
- Star bursts, sparkle shapes, "AI brain" illustrations.

### Stroke / fill discipline

- **Stroke width**: 1px or 2px only. No 1.5px, no 3px.
- **Stroke color**: `--fg` (60% opacity) on white, or `--blue`.
- **Fill color**: `--blue`, `--blue-soft`, `--blue-50`, or `--fg` (rare).
- **Opacity**: 0.0 to 1.0 in 0.1 steps. No arbitrary values.

### Sizes

- Hero shape: 200–600px.
- Section accent: 60–200px.
- Decorative: 16–80px.
- Marker dots: 4–8px.

---

## 3. Color usage in shapes

### Allowed

- Solid `--blue` (used for at most **one shape per section**).
- Solid `--blue-soft` (`#EAF2FF`).
- Solid `--blue-50` (`#F5F8FF`).
- Outlined `--fg` at 60% opacity.
- Outlined `--blue`.

### Forbidden

- Gradients of any kind.
- Blue + black mix on the same shape.
- Multiple blue shapes adjacent in the same view.

### Rule of thumb

> If a shape is "noticeable but not loud", it's correct.
> If you can describe a shape without effort, it's too loud.
> If you can't tell whether a shape is there, it's fine — but maybe redundant.

---

## 4. Composition rules

### Grid

All shapes are placed on a **40px subgrid**. Larger shapes snap to 80px or 120px.

### Position

- A shape is always **partially off-screen** (cropped by the viewport) OR **fully inside** its container. Never floating awkwardly mid-screen.
- Shapes sit in **negative space** — never overlapping body text.
- At most **one** large background shape per viewport.

### Asymmetry

Prefer off-center placement. Center-symmetric compositions feel static.

### Stack ordering

```text
background shape (lowest)
↓
text (middle)
↓
interactive shape (top, but behind UI)
```

In SVG terms: `<g data-bg>` → `<g data-text>` → `<g data-interactive>`.

---

## 5. Implementation: SVG

### Why SVG, not canvas

- Resolution-independent.
- CSS-controllable.
- Accessible (`<title>`, `aria-label`).
- Tiny payload when optimized.
- Animatable via CSS (cheap) or `motion` (when needed).

### When SVG is the wrong tool

- A shape needs **per-pixel mouse interaction** (we use CSS variables instead).
- A shape needs **complex physics** (we don't have any).
- A shape must be **drawn at runtime from data** — use SVG with computed attributes, not canvas.

### File structure

```text
components/
├── shapes/
│   ├── ShapeBackground.tsx     # server-rendered, static
│   ├── MouseShapeField.tsx      # client, mouse-reactive
│   ├── ScrollShapeField.tsx     # client, scroll-reactive
│   └── shapes/
│       ├── Circle.tsx
│       ├── GridFragment.tsx
│       ├── Pipeline.tsx
│       └── Timeline.tsx
└── hero/
    └── VectorPortrait.tsx       # the signature portrait
```

### Static shape (server component)

```tsx
// components/shapes/Circle.tsx
type Props = {
  size?: number;
  color?: "blue" | "soft" | "50" | "fg";
  stroke?: boolean;
  className?: string;
};

const COLOR_MAP = {
  blue: "fill-blue",
  soft: "fill-blue-soft",
  "50": "fill-blue-50",
  fg: "fill-fg/60",
};

export function Circle({
  size = 320,
  color = "soft",
  stroke = false,
  className,
}: Props) {
  const fill = COLOR_MAP[color];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      {stroke ? (
        <circle
          cx="50"
          cy="50"
          r="49"
          className="fill-none stroke-fg/60"
          strokeWidth="1"
        />
      ) : (
        <circle cx="50" cy="50" r="50" className={fill} />
      )}
    </svg>
  );
}
```

Rules:

- Always `aria-hidden="true"` on decorative shapes.
- Always `viewBox` on SVGs.
- Always explicit `width` and `height` (no missing intrinsic size → no CLS).
- Use Tailwind classes for fill/stroke (not inline `style`).
- No `<defs>` complexity unless reused 3+ times.

---

## 6. The signature: Vector Portrait

### Style spec

- Flat 2D, geometric, simplified.
- No face shading. No skin gradient.
- Hair as a single shape, with one accent stroke for direction.
- Glasses as two outlined ellipses + a bridge line.
- Clothing as 2–3 solid shapes.
- Background: a single soft blue shape or no background.
- Color palette: `--fg`, `--blue`, `--blue-soft`, `--bg`.

### Identity rules (per `PLAN.md` §12)

Preserve: hairstyle, glasses, clothing, general proportions.

### Implementation

- Single inline SVG component.
- No external file (we want it in the bundle, not another request).
- Eye groups have `id="eyes"` for animation targeting.
- Mouth is one `<path>` with a stable `d` attribute.

### Animation

- Total duration: **≤ 5s**, then static.
- Only transform/opacity changes on `#eyes` group.
- Implementation: CSS keyframes with `transform-origin: center`.
- Pause on `prefers-reduced-motion: reduce`.

```css
@keyframes look-around {
  0%   { transform: translateX(0); }
  30%  { transform: translateX(-1.5px); }
  60%  { transform: translateX(1.5px); }
  100% { transform: translateX(0); }
}

#eyes {
  transform-origin: center;
  animation: look-around 5s var(--ease-out) 1;
}

@media (prefers-reduced-motion: reduce) {
  #eyes { animation: none; }
}
```

---

## 7. Mouse-reactive background (`MouseShapeField`)

### Concept

A small number of background shapes translate **4–8px** in response to pointer position. The result is "the page breathes" without being distracting.

### Implementation principles

- **Single `requestAnimationFrame` loop** for all shapes. Not one rAF per shape.
- **Lerp** toward target each frame. No instant follow.
- **Throttle on `pointermove`** with `passive: true` listener.
- **Touch devices**: ignore (no pointer) — falls back to static.
- **Reduced motion**: short-circuit to static end-state.

### Component sketch

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const LERP = 0.08;        // 0..1, higher = snappier
const MAX_OFFSET = 6;     // px

export function MouseShapeField({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const onPointer = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // -1..1 normalized
      target.current.x = (e.clientX / w) * 2 - 1;
      target.current.y = (e.clientY / h) * 2 - 1;
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * LERP;
      current.current.y += (target.current.y - current.current.y) * LERP;
      if (ref.current) {
        ref.current.style.setProperty(
          "--mx",
          `${current.current.x * MAX_OFFSET}px`
        );
        ref.current.style.setProperty(
          "--my",
          `${current.current.y * MAX_OFFSET}px`
        );
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [reduced]);

  return (
    <div ref={ref} className="[--mx:0px] [--my:0px]">
      <div style={{ transform: "translate(var(--mx), var(--my))" }}>
        {children}
      </div>
    </div>
  );
}
```

### Performance rules

- Translate via CSS variable + `transform`. Never write to `style.transform` directly in the rAF loop.
- Set `will-change: transform` **only on the inner element being transformed**.
- Do not bind to `mousemove` — use `pointermove` (covers touch + pen + mouse).
- Pause the loop when `document.visibilityState === "hidden"`.
- Throttle: do not run the rAF on every pointer event — the loop runs continuously, the input only sets a target.

### Reduced motion

```tsx
if (reduced) {
  return <div>{children}</div>;
}
```

No rAF, no listener, no transform. Static.

---

## 8. Scroll-reactive background (`ScrollShapeField`)

### Concept

A small set of background shapes translate vertically **±12px** as the user scrolls the full page height. The effect is a parallax that is too subtle to notice consciously but adds depth.

### Implementation

- A single `scroll` listener (rAF-throttled).
- Update a single CSS variable: `--scroll-progress` (0..1).
- Shapes apply `transform: translateY(calc(var(--scroll-progress) * var(--scroll-amount)))`.

```tsx
"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";

export function ScrollShapeField({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let raf: number | null = null;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? window.scrollY / max : 0;
        document.documentElement.style.setProperty(
          "--scroll-progress",
          String(progress)
        );
        raf = null;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return <>{children}</>;
}
```

In `app/layout.tsx`, wrap the page content with this.

### Performance rules

- `passive: true` on the scroll listener (no `preventDefault`).
- Throttle via rAF (one update per frame max).
- Use CSS variable, not `style.transform` directly.
- Disable entirely on reduced-motion.

---

## 9. The data pipeline (Data Engineering section)

This is the strongest 2D diagram in the portfolio. Treat it as a small, hand-built SVG.

### Concept

```text
API → INGESTION → BRONZE → SILVER → GOLD → DASHBOARD
```

### Implementation

- Horizontal layout on desktop, vertical on mobile.
- Each stage: rounded rectangle (4px radius), `--bg` background, 1px `--border`, mono label inside.
- Connector: 2px line with a 6px filled circle at each end.
- Color: stages that represent **transformation** (Silver, Gold) get a `--blue-soft` background tint.

### SVG

```tsx
// components/shapes/Pipeline.tsx
export function Pipeline() {
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 800 80" className="w-full max-w-3xl h-auto" aria-hidden="true">
        {/* stages */}
        {[
          { x: 40, label: "API" },
          { x: 180, label: "INGESTION" },
          { x: 340, label: "BRONZE" },
          { x: 480, label: "SILVER" },
          { x: 620, label: "GOLD" },
          { x: 760, label: "DASHBOARD" },
        ].map((s) => (
          <g key={s.label} transform={`translate(${s.x - 50}, 25)`}>
            <rect
              width="100"
              height="30"
              rx="4"
              className="fill-bg stroke-border"
              strokeWidth="1"
            />
            <text
              x="50"
              y="20"
              textAnchor="middle"
              className="fill-fg font-mono"
              fontSize="11"
            >
              {s.label}
            </text>
          </g>
        ))}
        {/* arrows */}
        {[120, 270, 410, 550, 690].map((x) => (
          <g key={x} transform={`translate(${x}, 40)`}>
            <line x1="0" y1="0" x2="20" y2="0" className="stroke-fg/60" strokeWidth="1" />
            <polygon points="20,-3 26,0 20,3" className="fill-fg/60" />
          </g>
        ))}
      </svg>
    </div>
  );
}
```

Rules:

- Static. No animation.
- `aria-hidden="true"` (the labels appear as text in the page below).
- Real `<text>` elements (not converted to paths) for accessibility.
- `<title>` per stage if it's the only representation.

---

## 10. The education timeline

A vertical line with role entries.

```text
2026
│
├── Role / Title
│   Company
│
2025
│
├── Role / Title
```

### Implementation

- Vertical line: 1px `--blue` line, `absolute` positioned on the left.
- Year markers: mono, 14px, `--blue-dark`.
- Entry cards: `--bg` background, no border, just spacing and a small `→` on hover.

### SVG alternative (optional)

- Render as inline SVG for crispness on retina.
- Each entry: `<g>` with `<line>` + `<text>` + `<foreignObject>` (or just an HTML card next to it).

Recommendation: keep the timeline as **HTML** (cards), with a single absolutely-positioned 1px blue line. SVG is overkill here.

---

## 11. The research interests matrix

```text
┌──────────────────┐
│ MACHINE LEARNING │
└──────────────────┘
┌──────────────────┐
│ QUANTUM ML       │
└──────────────────┘
...
```

### Implementation

- CSS grid: 1 column mobile, 2 columns tablet, 3 columns desktop.
- Each box: 1px `--border`, `--bg-elevated` background, mono uppercase text, 16px padding, 6px radius.
- Hover: border becomes `--blue`, no transform.

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
  {interests.map((i) => (
    <div
      key={i}
      className="border border-border bg-blue-50 px-4 py-6 font-mono text-xs uppercase tracking-widest text-fg transition-colors hover:border-blue"
    >
      {i}
    </div>
  ))}
</div>
```

---

## 12. Card hover treatment (ProjectCard, ResearchCard)

### Default

```css
border: 1px solid var(--border);
background: var(--bg);
```

### Hover

```css
border-color: var(--blue);
background: var(--blue-50);
```

Optional 2–4px translation of the thumbnail image **inside** the card (the card itself does not move).

```tsx
<article className="group border border-border bg-bg p-6 transition-colors hover:border-blue hover:bg-blue-50">
  <div className="overflow-hidden">
    <Image
      className="transition-transform duration-base ease-out group-hover:-translate-y-0.5"
      ...
    />
  </div>
  ...
</article>
```

### Forbidden

- Scale > 1.02 on the card itself.
- Shadow growth.
- Color flash (use transitions, not jumps).
- 3D `perspective` rotations.

---

## 13. Page transitions

If implemented at all:

- Use Next.js's default navigation (instant). No transition needed.
- If a transition is required: 100ms fade on the new page's root, via `app/template.tsx` (not `layout.tsx`).
- Never block the user with an animation.

```tsx
// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-[fade-in_120ms_ease-out]">{children}</div>
  );
}
```

---

## 14. Reduced-motion support (mandatory)

### The two rules

1. **CSS animations**: gate behind `@media (prefers-reduced-motion: reduce)`.
2. **JS animations**: gate behind `useReducedMotion()` from `motion/react`.

### Global override

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### `motion` users

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export function ShapeReveal({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

### Test it

In Chrome DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`. Reload. The site should look **complete**, not broken.

---

## 15. Performance budget for shapes

Shapes are tiny, but they appear on every page. Keep them in budget.

| Asset                | Budget         |
| -------------------- | -------------- |
| Inline SVG icons     | < 1 KB each    |
| Hero background SVG  | < 4 KB         |
| Vector portrait SVG  | < 8 KB         |
| Pipeline diagram SVG | < 3 KB         |
| Total SVG per route  | < 20 KB        |
| Animation JS         | < 6 KB gz      |
| rAF loop             | 1 per page max |

### Optimization

- Strip `id`/`class` from SVGs with SVGO.
- Use `currentColor` for SVGs that should inherit text color.
- Avoid embedding raster images inside SVG.
- Use `<use>` for repeated symbols.
- Never include a 1 MB logo as inline SVG.

---

## 16. Common mistakes (and the fix)

| Mistake                                                | Fix                                                  |
| ------------------------------------------------------ | ---------------------------------------------------- |
| Using `motion.div` for a static element                | Use a plain `<div>` or a CSS animation              |
| Setting `style.transform` directly in a rAF loop       | Use a CSS variable + `transform: translate(var(...))` |
| Animating `width` / `height` on shapes                 | Animate `transform: scale()` instead                 |
| Multiple rAF loops for multiple shapes                 | One rAF, multiple CSS variable writes               |
| A `motion` import in a Server Component                | Move to a client component file                      |
| `will-change: transform` on every child                | Apply only to actively animating elements            |
| Shapes that are also focusable                         | Set `tabindex="-1"` and `aria-hidden="true"`         |
| Using `<canvas>` for static diagrams                   | Use SVG                                              |
| Drop shadows on every card to "lift" them              | Use a 1px border and a soft hover background         |
| Background shapes that follow the cursor 1:1           | Lerp with `LERP = 0.08` for smoothness               |

---

## 17. Anti-patterns (forbidden)

- **No Three.js / WebGL**. Ever.
- **No canvas** for static shapes.
- **No Lottie** for trivial UI states.
- **No 3D CSS transforms** (perspective, rotate3d).
- **No `backdrop-filter: blur` glassmorphism** on cards.
- **No animated SVG paths** that change `d` (expensive, rarely worth it).
- **No shape that has both a CSS animation AND a JS animation** simultaneously.
- **No `setInterval` for animation** — only `requestAnimationFrame`.
- **No animation on the body's `background-position`**.
- **No auto-playing video backgrounds.**

---

## 18. Per-section shape recipe (cheat sheet)

| Section                    | Shape                                              | Reactivity                  |
| -------------------------- | -------------------------------------------------- | --------------------------- |
| Landing hero               | 1 large soft-blue circle, 1 outlined circle, grid  | Mouse (4–6px)               |
| Landing About              | 1 thin horizontal line                             | Static                      |
| Industry/Academic split    | 1 small blue dot                                   | Static                      |
| Selected Work              | ProjectCard hover (border + bg)                    | Hover                       |
| Experience timeline        | Vertical blue line                                 | Static                      |
| Data Engineering           | Pipeline diagram                                   | Static                      |
| Research interests         | Box matrix                                         | Hover (border only)         |
| Publications               | Status pill                                        | Static                      |
| Footer                     | Small blue dot                                     | Static                      |
| 404                        | Outlined triangle + circle                         | Static                      |

---

## 19. Reviewing shapes in PRs

When reviewing a PR that adds or changes a shape, ask:

- [ ] Is the shape built from allowed primitives?
- [ ] Is the color from the allowed set (no gradient, no off-palette)?
- [ ] Is `aria-hidden="true"` set?
- [ ] Are `viewBox`, `width`, `height` set?
- [ ] Is animation gated by `prefers-reduced-motion`?
- [ ] Is the rAF loop paused when tab is hidden?
- [ ] Is the shape's `transform` (not `top`/`left`) animated?
- [ ] Is the SVG payload under budget (page total < 20 KB)?
- [ ] Is the shape positioned on the 40px subgrid?
- [ ] Does the shape sit in negative space, not over text?
- [ ] Does the shape contribute to understanding, navigation, or personality? (If not, remove it.)

---

## 20. The one-line shape rule

> A shape must make the page **clearer, calmer, or more personal** — never just prettier.
