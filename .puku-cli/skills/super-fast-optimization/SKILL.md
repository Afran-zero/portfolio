---
name: super-fast-optimization
description: Performance playbook for the Kaif portfolio — Core Web Vitals targets, JS budget, image/font optimization, CDN caching, build-time strategy. Load when measuring, auditing, or optimizing page speed.
---

# Super-Fast Optimization Skill

This skill is the single source of truth for **performance** in the Kaif portfolio. The site is a personal portfolio — it should feel **instant** to open, navigate, and read. If a decision trades even 50ms of speed for "niceness", it is the wrong decision.

Load this skill when:

- Adding a new page or route.
- Adding or changing images, fonts, or third-party scripts.
- Adding any client-side JS.
- Auditing Core Web Vitals.
- Investigating a Lighthouse regression.
- Building for production / measuring on real networks.

The full architecture plan is in `PLAN.md`; this skill encodes the *measurable rules*.

---

## 1. Performance targets (hard)

| Metric                       | Target (p75)         | Measurement                      |
| ---------------------------- | -------------------- | -------------------------------- |
| **LCP** (Largest Contentful Paint) | **≤ 1.5s**     | Mobile, Slow 4G throttling       |
| **INP** (Interaction to Next Paint) | **≤ 100ms**  | Field + lab                      |
| **CLS** (Cumulative Layout Shift) | **≤ 0.05**       | 75th percentile                 |
| **TTFB** (Time to First Byte)     | **≤ 200ms**    | Vercel edge                      |
| **TBT** (Total Blocking Time)     | **≤ 100ms**    | Lighthouse mobile                |
| **Speed Index**                   | **≤ 2.0s**     | Lighthouse mobile                |
| Lighthouse Performance (mobile)   | **≥ 95**       | `lighthouse --preset=mobile`     |
| Lighthouse Performance (desktop)  | **≥ 98**       |                                  |
| Lighthouse Accessibility         | **≥ 95**       |                                  |
| Lighthouse Best Practices         | **≥ 95**       |                                  |
| Lighthouse SEO                    | **≥ 95**       |                                  |

**Budgets (in addition to the metrics):**

```text
Initial JS (gzipped):     ≤ 90 KB
Initial CSS (gzipped):    ≤ 30 KB
Hero image:               ≤ 300 KB
Project thumbnail:        ≤ 120 KB
Font payload:             ≤ 80 KB (2 families, Latin subset)
Total page weight:        ≤ 1.5 MB
Third-party requests:     0
Webfonts loaded async:    0 (use next/font)
```

If a change breaks any of these, the change is wrong.

---

## 2. Architectural strategy

### Static-first

Every page is **statically generated** at build time. There is no runtime database, no ISR, no SSR for content.

```text
GitHub (YAML)
   ↓
pnpm build (Next.js)
   ↓
SSG output (.next/...)
   ↓
Vercel CDN (edge cache)
   ↓
Browser
```

### React Server Components by default

- Default to **Server Components**.
- `"use client"` only where browser interaction is unavoidable (mobile menu, shape interactivity, contact form, theme toggle).
- Each `"use client"` boundary is an opportunity to ship JS. Limit them.

### Route map

```text
/                              SSG
/industry                      SSG
/industry/projects/[slug]      SSG (generateStaticParams)
/academic                      SSG
/academic/research/[slug]      SSG (generateStaticParams)
/academic/publications         SSG
/cv/academic                   SSG → redirect to PDF
/cv/professional               SSG → redirect to PDF
/contact                       SSG
/404                           SSG
```

No `dynamic = "force-dynamic"` anywhere in the codebase.

### Edge cache headers

```ts
// next.config.ts
async headers() {
  return [
    {
      source: "/_next/static/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400",
        },
      ],
    },
  ];
}
```

---

## 3. JavaScript budget discipline

### Why the budget matters

A portfolio is a static document. The HTML, CSS, and minimal JS for the React runtime should be **all** the user downloads on first paint. Anything beyond that must earn its place.

### What ships by default

```text
next.js runtime:    ~70 KB gz
react-dom:          ~40 KB gz
app code:           < 5 KB gz
```

That leaves us with **~20 KB of headroom** for the rest of the app.

### What's allowed to ship

- The mobile menu (~3 KB).
- The shape interactivity (`MouseShapeField` + `ScrollShapeField`, ~6 KB combined).
- The scroll reveal helper (`Reveal`, ~2 KB).
- Total target: **< 90 KB gz** initial route.

### What's forbidden

- `framer-motion` for general use (we use `motion` and only for ≤ 5 specific interactions).
- Full `lodash` (import per-function).
- `moment` (use `Intl` or `date-fns` per-function).
- Polyfills (target evergreen browsers; ship modern JS).
- Source maps in production.
- Any analytics script.
- Any chat widget.
- Any "A/B test" or "feature flag" client.

### Audit JS in CI

```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true next build",
    "size": "next build && bundlesize"
  }
}
```

Use `@next/bundle-analyzer` to inspect. Fail CI if any route exceeds 90 KB gz initial.

```ts
// next.config.ts
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({});
```

---

## 4. Image optimization

### Format rules

| Use case            | Format    | Why                              |
| ------------------- | --------- | -------------------------------- |
| Hero / large photo  | WebP      | Universal, ~30% smaller than JPEG |
| Project thumbnail   | WebP      | Same                             |
| Logo / icon         | SVG       | Vector, no raster fallback needed|
| Photo fallback      | WebP only | All evergreen browsers support it|

PNG and JPEG are forbidden in committed assets.

### Sizing

- Hero image: **≤ 300 KB** on disk, **≤ 1500 px wide** on desktop, **≤ 800 px wide** on mobile.
- Project thumbnail: **≤ 120 KB** on disk, **≤ 800 px wide** on desktop, **≤ 400 px** on mobile.
- Use `sizes` correctly so the browser only downloads what it needs.

```tsx
<Image
  src="/images/projects/cms-pt/hero.webp"
  alt="CMS Muon pT regression architecture"
  width={1200}
  height={675}
  sizes="(min-width: 1024px) 1200px, (min-width: 768px) 800px, 100vw"
  priority={false}
/>
```

### Above-the-fold vs below

- Only the **hero image** (and the portrait) is `priority`.
- Everything else is lazy by default.
- `loading="lazy"` is the default for non-priority.

### Compression pipeline

Generate images with:

```bash
# WebP, q=80
cwebp -q 80 input.png -o output.webp
```

Or use `sharp` in a build step. Commit WebP only. Do not commit source PNGs.

### Forbidden

- Autoplay video backgrounds.
- GIFs > 200 KB.
- PNG files > 200 KB.
- Images that depend on JavaScript to render.

---

## 5. Font optimization

### Strategy

- Self-host via `next/font` (Geist + Geist Mono).
- `display: swap`.
- `preload: true` for primary.
- Subset: **Latin only**.
- No external CDN (Google Fonts, Typekit, etc.).

```ts
// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});
```

### Limits

- 2 families.
- 1 weight per family (regular + medium + semibold for sans; regular for mono).
- No icon fonts (use `lucide-react`).

---

## 6. CSS optimization

### Tailwind v4 setup

- Tree-shaking is automatic; we keep utility classes lean.
- Avoid `@apply` chains deeper than 3 levels.
- No CSS-in-JS at runtime.

### Critical CSS

- Next.js inlines critical CSS automatically. We do not need to manage it manually.

### Allowed

- CSS variables for tokens.
- `@layer base` for resets.
- `@layer components` for component-level utilities (sparingly).

### Forbidden

- `@import url("https://fonts.googleapis.com/...")`.
- `* { transition: all 0.3s; }`.
- Global selectors that override Tailwind's preflight.
- `filter: blur(...)` on large areas (expensive).

---

## 7. Third-party script policy

**None.**

The portfolio does not load any third-party scripts:

- No analytics.
- No chat widget.
- No font CDN.
- No error tracking.
- No A/B testing.

If a feature truly requires one, it must be reviewed and approved before being added.

---

## 8. Preloading & hints

### `<head>` directives (managed by Next.js)

- `next/font` adds `<link rel="preload">` for primary font.
- `next/image` adds `srcset` automatically.

### Manual preconnect

Only when actually needed (Vercel CDN is same-origin, so no preconnect needed).

---

## 9. Animation performance

### Only transform + opacity

```css
.thing {
  transition: transform 220ms var(--ease-out), opacity 220ms var(--ease-out);
  will-change: transform, opacity;
}
```

- Animate `transform` and `opacity` only.
- Never animate `width`, `height`, `top`, `left`, `margin`, `padding`, `box-shadow` on large elements.
- Use `will-change` sparingly and only for elements actively animating.
- Remove `will-change` after animation ends.

### Reduce motion

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

`motion` library users: gate with `useReducedMotion()` and short-circuit to no-op.

---

## 10. Measuring performance

### Local Lighthouse

```bash
pnpm build
pnpm start
# in another terminal
lighthouse http://localhost:3000 --preset=mobile --view
lighthouse http://localhost:3000/industry --preset=mobile --view
lighthouse http://localhost:3000/academic --preset=mobile --view
```

### Bundle analysis

```bash
ANALYZE=true pnpm build
```

Inspect `.next/analyze/*.html`. Look for:

- Any package > 30 KB gz that's not in the allowed list.
- Duplicate copies of `react` / `react-dom`.
- Server-only code accidentally bundled to client.

### Production checks (Vercel)

- Open Vercel Analytics → Web Vitals tab.
- Filter to p75.
- Alert if p75 LCP > 1.8s, INP > 200ms, CLS > 0.1.

### Real-user monitoring

Not used in v1. If added in v2:

- Cloudflare Web Analytics (free, no cookies, edge-native).
- Vercel Speed Insights (1.5 KB gz, no cookies).
- NOT Google Analytics, NOT Hotjar, NOT FullStory.

---

## 11. Pre-deploy checklist (performance)

Run before every deploy:

- [ ] `pnpm build` succeeds with no warnings.
- [ ] `ANALYZE=true pnpm build` reviewed; no surprise dependencies.
- [ ] Initial JS bundle per route ≤ 90 KB gz.
- [ ] No PNG / JPEG in `public/`.
- [ ] All images use `next/image` with correct `sizes`.
- [ ] Hero image ≤ 300 KB.
- [ ] Fonts are `next/font`, self-hosted.
- [ ] No third-party scripts.
- [ ] No `useEffect` for static data.
- [ ] No new `"use client"` boundary without justification.
- [ ] Lighthouse mobile ≥ 95 on `/`, `/industry`, `/academic`.
- [ ] CLS verified on a slow CPU throttled run.

---

## 12. Common regressions to watch for

| Symptom                          | Likely cause                                  | Fix                                       |
| -------------------------------- | --------------------------------------------- | ----------------------------------------- |
| LCP > 2.5s                       | Hero image not `priority`, or too large       | Set `priority`, downscale, use WebP       |
| INP > 200ms                      | Heavy JS on input, or main-thread blocking   | Move work off main thread, debounce       |
| CLS > 0.1                        | Image without dimensions, late-loading font   | Always set width/height, `next/font`      |
| Bundle bloat                     | New `"use client"` chain, or lib with tree-shake issues | Move to server, replace dependency        |
| Slow Time to First Byte          | Edge function blocking render                 | Remove `force-dynamic`, use SSG           |
| Font flash                       | `display: auto` instead of `swap`             | Set `display: swap`                       |

---

## 13. When NOT to optimize

Optimization that doesn't move the needle is **wasted engineering time**.

Do **not** spend time on:

- Micro-optimizing the CSS for 1 KB savings.
- Replacing the React runtime (we use Next.js by design).
- Adding a service worker (the site is already edge-cached).
- Hand-rolling a custom router.
- Polyfilling for IE11 (we don't support it).
- Preloading every image (only above-the-fold).

Focus on the **one or two** changes that move p75 LCP, INP, or CLS, and ship.

---

## 14. Performance review cadence

- **Per PR**: Lighthouse mobile on the affected route. Required if a PR touches a page, image, font, or adds client JS.
- **Weekly**: Vercel Web Vitals p75 dashboard review.
- **Per release**: Full Lighthouse suite + bundle analysis diff.
- **Quarterly**: Re-evaluate targets as Vercel/Next.js improve baselines.

---

## 15. The one-line performance rule

> If a change doesn't ship to the user faster, smaller, or cleaner — it isn't worth the byte.
