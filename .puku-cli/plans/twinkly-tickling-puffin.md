# Plan — Landing Page Bento + Blueprint Overlay + Real Photo + Contact Form

## Context

The previous session shipped Phases 1–6 (Foundation, Visual identity, Landing, Industry, Academic, Detail pages). The landing page (`/`) is functional, not gamified — it uses a 5/7 hero, an About section with a paragraph, and two flat cards for Industry/Academia.

The user wants the landing page to adopt a **bento-grid layout** with:
- Content partitioned into clean modular rectangular cards of varying sizes that fit together
- A background overlay **grid lines** texture (technical-blueprint feel)
- Minimalist typography, **badge tags**, high contrast, wireframe cues

Plus three other requests:
1. **Education** section (which lives on the landing today via the Education snapshot, and is also rendered on `/academic` and `/industry`) should have proper **section-wise animation** when transitioning from college → university.
2. A real **profile photo** (`G:\portfolio\profile_pic.HEIC`) used in the About section, replacing the recolored `portfolio.svg`. The SVG stays available for OG images / future use.
3. A simple **Contact me** section with a form that posts to `/api/contact` (Server Action / route handler) and composes a mailto for the user.

User decisions (from clarifications):
- Bento lives on the **landing page only** (Industry + Academic stay linear).
- Photo card sits **inside the bento About section**.
- Form posts to `/api/contact` (Next.js route handler).
- Motion stays subtle: existing `Reveal` + per-card stagger.

---

## 1. HEIC → WebP/JPG conversion

`profile_pic.HEIC` (1.6 MB) cannot be served by Next.js's image pipeline directly. Convert with **ffmpeg** (already installed at `C:\Users\user\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0-full_build\bin\ffmpeg.exe`).

**Step**: decode HEIC → JPG (high quality), then optimize → WebP using `sharp` (already in `node_modules`).

Output files (commit these):
- `public/images/profile/profile.jpg` — 1200×1500 max, quality 82, ~80–150 KB. Used for `<Image>` (raster fallback).
- `public/images/profile/profile.webp` — same dimensions, quality 80, ~60–100 KB. Used by Next's WebP conversion.

Why both: Next/Image prefers WebP but some browsers / previewers want JPG. We let `next/image` do the conversion automatically (`formats: ["image/webp"]` already set), but committing a JPG ensures the raw photo is in version control.

Also: convert and commit a **square crop** for use as a smaller avatar (`profile-square.webp`, 480×480). Useful for tight spots (footer, og image, future avatar).

A small one-shot script `scripts/convert-heic.mjs` makes the script self-documenting.

---

## 2. New design tokens (blueprint / bento language)

Add to `styles/tokens.css`:

```css
/* ---- Blueprint grid ---- */
--grid-line: rgba(23, 105, 255, 0.06);   /* visible but very subtle */
--grid-line-strong: rgba(23, 105, 255, 0.10);
--grid-cell: 24px;                        /* matches Tailwind spacing-6 */

/* ---- Badge ---- */
--badge-fg: var(--blue-dark);
--badge-bg: var(--blue-50);
--badge-border: rgba(23, 105, 255, 0.30);
```

Add to `app/globals.css` `@theme` so Tailwind exposes utilities:
```css
--color-grid-line: rgba(23, 105, 255, 0.06);
--color-grid-line-strong: rgba(23, 105, 255, 0.10);
```

Add a `.bg-blueprint` utility class in the same file that paints a 24×24 cell grid using two stacked `linear-gradient`s:

```css
.bg-blueprint {
  background-image:
    linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

And a stronger variant for emphasis (`.bg-blueprint-strong`).

---

## 3. New components (landing-only)

### `components/layout/BentoGrid.tsx` — server component
A flexible 12-col CSS-grid wrapper. Children carry `col-span` / `row-span` classes. Mobile collapses to single column.

```tsx
type Props = {
  children: React.ReactNode;
  className?: string;
};
// Renders <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-12">
```

### `components/layout/BentoCard.tsx` — server component
The signature surface. Thin border, white bg, blueprint corner crop (optional), badge slot, content slot.

Props:
- `title?: string`
- `eyebrow?: string` (renders as `<Eyebrow>`)
- `index?: string` (renders as `01 / Title`)
- `badge?: string | string[]` (renders pill badges — `lucide-react` Hash icon optional)
- `className?: string` (callers pass `md:col-span-X | md:row-span-Y`)
- `tone?: "default" | "soft" | "dark" | "blueprint"` — `blueprint` paints the grid overlay
- `children: React.ReactNode`

Implementation notes:
- 1px border `border-border`, hover `hover:border-blue hover:bg-blue-50` (PLAN §39).
- When `tone === "blueprint"`, the card itself paints `.bg-blueprint`.
- A small `<span className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-widest text-fg-muted">` corner marker.
- Section corner ticks (top-left, top-right, bottom-left, bottom-right short L-shapes) drawn with `::before/::after` to give a wireframe cue — uses pure CSS borders, no SVG.

### `components/layout/Badge.tsx` — server component
Mono pill used for "AI/ML", "TypeScript", "Next.js" etc. Variants:
- `default` — outlined, blue text
- `soft` — `--blue-50` bg
- `solid` — `--blue` bg, white text

Props: `{ children, variant?, className? }`.

### `components/about/AboutPhoto.tsx` — server
Wraps `<Image src="/images/profile/profile.webp" ...>` with a recolor wrapper that adds a subtle multiply overlay (no saturate — that's for the SVG).

### `components/about/EducationTimeline.tsx` — server (new — distinct from `education/ExperienceTimeline.tsx`)
For the landing-page Education card. Animated **college → university** sequence:
- Vertical blue line at left.
- Each milestone: year marker (mono), label, short description.
- Uses `motion/react` `whileInView` per milestone with a 100ms stagger via `delay = i * 0.1`.
- Honors `prefers-reduced-motion` (already handled by `Reveal`).

The YAML will be extended with prior education entries (the schema already accepts `Education[]`).

---

## 4. Landing page rewrite — `app/page.tsx`

New section order (landing only):

```
1. Hero (split 5/7, no change)
2. About (bento 3-column grid with: photo card, bio card, badge-tags card, education card, location card)
3. Industry / Academia split (becomes a 2-column bento with blueprint tone)
4. Selected Work (4-card bento — 2 industry + 2 academic)
5. Contact (form + alt channels, with blueprint tone)
```

### About bento (md:grid-cols-12)

| Card | col-span | row-span | tone | content |
|---|---|---|---|---|
| Photo | md:col-span-4, md:row-span-2 | — | blueprint | AboutPhoto + name + role |
| Bio | md:col-span-8 | — | default | h3 "About" + bio text |
| Education timeline | md:col-span-8 | — | default | EducationTimeline (college → university, with stagger) |
| Tech tags | md:col-span-6 | — | soft | "Tech stack" Eyebrow + 8–12 Badge pills (skills.groups flat) |
| Now | md:col-span-6 | — | soft | "Currently" Eyebrow + 1-line status |
| Location / availability | md:col-span-12 | — | blueprint | "Available for engineering & research work" Meta strip + location |

### Industry / Academia split (md:grid-cols-2)

Both cards become **bento cards** with `tone="blueprint"`:
- Eyebrow + h3 + description + footer link
- Each card has 1 corner wireframe tick (top-left + bottom-right)

### Selected Work (md:grid-cols-12)

Pick 4 highlights from `getProjects()` + `getResearchProjects()`:
- 1 large featured industry card (md:col-span-7, md:row-span-2) — uses ProjectCard with size variation
- 1 small featured industry card (md:col-span-5)
- 1 medium research card (md:col-span-6)
- 1 medium client work card (md:col-span-6)

### Contact (md:grid-cols-12)

| Card | col-span | tone | content |
|---|---|---|---|
| Form | md:col-span-7 | default | Inline contact form (see §5) |
| Alt channels | md:col-span-5 | blueprint | Email/GitHub/LinkedIn meta + location |

---

## 5. Contact form — route handler approach

The user picked "posts to /api/contact". React 18.3.1 (D-015) makes Server Actions experimental, so we use a **Route Handler**.

CSP already has `form-action 'self' mailto:` — `'self'` covers `/api/contact`. No CSP change.

`app/api/contact/route.ts`:
```ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  const { name, email, message } = data ?? {};
  // Server-side validation: name, email, message required; email regex; length limits.
  // Build mailto URL with subject "Portfolio contact: <name>" and body containing all fields.
  // Return { ok: true, mailto: "mailto:hello@...?..." }.
}
```

The route handler returns the mailto URL. The client then `window.location.href = mailto`.

Validation rules:
- `name`: 1–80 chars, trim.
- `email`: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- `message`: 1–2000 chars, trim.
- All three required.
- Returns 400 + `{ error }` on invalid; 200 + `{ ok, mailto }` on success.

`components/contact/ContactForm.tsx` — client component:
- Three fields + Submit button.
- Uses `useState` for field values and submission state.
- On submit: POST → on success, sets `window.location.href = mailto`.
- Disabled while pending. Errors inline next to fields.

Form input styles:
- `border border-border bg-bg px-4 py-3 text-base text-fg`
- `focus-visible:border-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2`
- Label: `font-mono text-xs uppercase tracking-widest text-fg-muted`

---

## 6. Section-wise animation (college → university)

Two layers:
1. **Per-section Reveal**: existing `Reveal` already covers each Section. Keep as-is.
2. **Per-milestone stagger** in the new EducationTimeline:
   - Each milestone is a `<Reveal delay={i * 0.1}>`.
   - The blue connecting line draws from top to bottom on scroll-in via SVG `pathLength` motion (single `<svg>` overlay, optional but high-impact).

Implementation choice: ship the SVG line-draw for the Education card **inside the bento card**. It's visually distinctive and matches the "blueprint / wireframe" theme.

---

## 7. Files to create / modify

### Create
- `public/images/profile/profile.jpg` (from HEIC conversion)
- `public/images/profile/profile.webp` (sharp output)
- `public/images/profile/profile-square.webp` (480×480 crop)
- `components/layout/BentoGrid.tsx`
- `components/layout/BentoCard.tsx`
- `components/layout/Badge.tsx`
- `components/about/AboutPhoto.tsx`
- `components/about/EducationTimeline.tsx` — **distinct from** `components/education/ExperienceTimeline.tsx`. Different name to avoid confusion.
- `components/contact/ContactForm.tsx`
- `app/api/contact/route.ts`
- `scripts/convert-heic.mjs` — one-shot HEIC → JPG/WebP. Run during setup, not at build time.

### Modify
- `app/page.tsx` — landing-only rewrite to bento.
- `styles/tokens.css` — add blueprint + badge tokens.
- `app/globals.css` — add `.bg-blueprint` utility + expose Tailwind tokens.
- `content/shared/education.yaml` — extend to include HSC + SSC entries (pre-university).
- `content/shared/person.yaml` — update `portrait_path` so it points to the photo when used on landing. Keep the SVG accessible as `/portfolio.svg` for OG / future.

### Do NOT modify
- All Industry / Academic / Detail / CV / contact-list / sitemap pages — out of scope this plan.
- `components/hero/VectorPortrait.tsx` — keep as-is (still used as fallback if photo missing, plus OG image).
- The recolored `VectorPortrait` recolor CSS — kept; not used by landing anymore.
- `lib/content.ts`, `lib/schemas.ts`, all `content/industry/*`, all `content/academic/*` — out of scope.

---

## 8. Reuse of existing primitives

| Need | Reuse |
|---|---|
| Section wrapper | `Section` (spacing, tone) |
| Container | `Container` |
| Grid | `Grid` — but Bento uses a custom 12-col layout via `BentoGrid`. We keep `Grid` available. |
| Section heading | `SectionHeading` |
| Mono label | `Eyebrow` |
| Metadata strip | `Meta` |
| Reveal animation | `Reveal` (now also wrapping bento card inner content for stagger) |
| Buttons | `Button` (existing; the Contact section will use `<Button>` as the submit trigger or alongside) |
| Image | `next/image` with `priority` on the hero photo, lazy on subsequent placements |

---

## 9. Verification

1. **Conversion runs cleanly** — `node scripts/convert-heic.mjs` produces three files in `public/images/profile/`. Validate WebP files open.
2. **`npm run typecheck`** — passes.
3. **`npm run build`** — succeeds. The `/api/contact` route shows up as a dynamic POST route.
4. **`npm run lint`** — clean.
5. **`npm run dev`** then `curl -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d '{"name":"X","email":"a@b.co","message":"hi"}'` returns `{ ok: true, mailto: "mailto:hello@example.com?..." }`.
6. **Manual**: `/` shows:
   - Hero (5/7) — unchanged from Phase 3 visually.
   - About bento — 5 cards in a clean 12-col grid, blueprint overlay visible on tone=blueprint cards, photo on the left with a wireframe tick, education card shows the college → university animated timeline.
   - Industry/Academia split — 2 cards with blueprint tone and corner ticks.
   - Selected Work — 4 cards in a bento layout (1 large, 3 smaller).
   - Contact — form on the left (3 fields), alt channels on the right.
7. **Mobile (375px)** — single column, no broken grid lines, form remains usable.
8. **Reduced motion** — all reveals + line draw are disabled; cards still render.
9. **CSP** — no CSP violations. The `form-action 'self'` covers `/api/contact`.
10. **Visual rhythm** — confirm we haven't created the "every section is a grid of cards" failure mode (PLAN §61). The Hero stays 5/7; the Education snapshot is now a single bento card; only the About and Selected Work sections adopt the grid layout.

---

## 10. Execution order (single pass)

```
A. Convert HEIC → JPG/WebP/Square (ffmpeg + sharp, one-shot script)
B. Add tokens (blueprint, badge) + bento + badge + about components
C. Add /api/contact route handler + ContactForm
D. Extend education.yaml with HSC/SSC entries
E. Rewrite app/page.tsx as bento landing
F. Update progress/STATUS.md + INDEX.md + DECISIONS.md (D-019)
G. Final typecheck + build + dev smoke test
```