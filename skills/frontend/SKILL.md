---
name: frontend
description: Frontend conventions for the Kaif portfolio — Next.js App Router, RSC discipline, Tailwind v4 tokens, responsive system, component philosophy. Use when building, editing, or reviewing any UI in this repo.
---

# Frontend Skill

This skill encodes the frontend conventions for the **Kaif portfolio**. Load it whenever you are writing, editing, or reviewing UI in this repository.

The full architectural plan lives in `PLAN.md`. This skill captures the *concrete rules* that should be applied by default in every PR.

---

## 1. Stack (locked)

| Concern              | Decision                                                                 |
| -------------------- | ------------------------------------------------------------------------ |
| Framework            | **Next.js 15+** (App Router, RSC default)                                |
| UI runtime           | **React 19**                                                             |
| Language             | **TypeScript** (strict)                                                  |
| Styling              | **Tailwind CSS v4** + CSS variables for tokens                           |
| Icons                | `lucide-react` only                                                      |
| Class composition    | `clsx` + `tailwind-merge` via `cn()` helper                             |
| Animation            | `motion` (≤ 5 places only) — prefer CSS transitions                      |
| Fonts                | `next/font` (Geist + Geist Mono)                                         |
| Package manager      | **pnpm** (lockfile committed)                                            |
| Deploy               | Vercel                                                                   |
| Linter / formatter   | ESLint (Next.js preset) + Prettier                                       |
| Schema validation    | `zod` for YAML at build time                                             |
| YAML parsing         | `gray-matter` + `yaml`                                                   |

### Explicitly disallowed

- Three.js / WebGL / R3F (no, not for the portfolio).
- GSAP (too heavy).
- Styled-components / Emotion.
- Any state library (Zustand, Redux, Jotai). RSC + URL state is enough.
- `useEffect` for anything that can be done at build time.
- `useState` for static content.

---

## 2. Server vs Client Components

### Default rule

**Everything is a Server Component** unless one of these is true:

- It uses `onClick`, `onChange`, `onSubmit`, or any browser event.
- It uses `useState`, `useReducer`, `useEffect`, or hooks that depend on browser APIs.
- It depends on `window`, `document`, `localStorage`, or `navigator`.
- It uses `IntersectionObserver` or `requestAnimationFrame` directly.

### Allowed client components in this repo

- `MobileMenu`
- `MouseShapeField` (background shapes reacting to pointer)
- `ScrollShapeField` (background shapes reacting to scroll)
- `Reveal` (scroll-triggered reveal)
- `ContactForm` (when added in v2)
- `ThemeToggle` (when added in v2)

### Pattern

```tsx
// components/MobileMenu.tsx
"use client";

import { useState } from "react";
// ...
```

Everything else stays server-rendered and ships zero JS.

---

## 3. Design Tokens

Tokens live in `styles/tokens.css` and are consumed via Tailwind's CSS variable theme.

### Required tokens

```css
:root {
  /* Color */
  --bg:            #FFFFFF;
  --bg-elevated:   #F5F8FF;
  --bg-soft:       #EAF2FF;
  --bg-dark:       #080808;
  --bg-dark-2:     #111111;

  --fg:            #111111;
  --fg-muted:      #667085;
  --fg-on-dark:    #FFFFFF;

  --blue:          #1769FF;
  --blue-dark:     #0B3D91;
  --blue-soft:     #EAF2FF;
  --blue-50:       #F5F8FF;

  --border:        #D9DEE8;
  --border-dark:   rgba(255, 255, 255, 0.12);

  /* Radius */
  --radius-sm: 2px;
  --radius-md: 6px;

  /* Space */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 40px;
  --space-2xl: 64px;

  /* Type */
  --font-sans: 'Geist', system-ui, -apple-system, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, SFMono-Regular, monospace;

  /* Motion */
  --ease-out: cubic-bezier(0.2, 0, 0, 1);
  --dur-fast: 150ms;
  --dur-base: 220ms;
  --dur-slow: 400ms;
}

@media (prefers-color-scheme: dark) {
  /* dark mode is opt-in for v1 — do not enable by default */
}
```

### Color proportion rule (enforce visually)

```text
White / neutral      70–80%
Black / typography   15–20%
Blue / accents       5–10%
```

If a layout starts feeling "all blue", it's wrong.

### Blue is allowed only for

- Links (default + visited).
- Button hover/active.
- Active nav indicator.
- Section labels (mono small).
- Selected filter.
- A single accent word in the hero.
- A single geometric shape per section.

---

## 4. Typography

### Families

- **Sans**: Geist.
- **Mono**: Geist Mono.

Maximum **2 families**. No additional weights beyond what's needed.

### Scale (final)

| Token          | Desktop | Mobile | Use                            |
| -------------- | ------- | ------ | ------------------------------ |
| `text-xs`      | 12px    | 12px   | metadata, eyebrow labels       |
| `text-sm`      | 14px    | 13px   | small UI text                  |
| `text-base`    | 17px    | 15px   | body                           |
| `text-lg`      | 20px    | 18px   | large body, lead paragraph     |
| `text-xl`      | 24px    | 22px   | small heading                  |
| `text-2xl`     | 32px    | 28px   | section heading (mobile+)      |
| `text-3xl`     | 40px    | 32px   | section heading (desktop)      |
| `text-4xl`     | 56px    | 40px   | hero sub                       |
| `text-display` | clamp(48px, 7vw, 96px) | same | hero display        |

### Hierarchy rules

- Exactly **one `<h1>` per page**.
- Heading order strictly `h1 → h2 → h3 → h4` (no skipping).
- Section eyebrows use `<p>` with mono and uppercase.
- Body max measure: 68–72 characters.
- Body line-height: 1.6.

### Where mono is used

- Section labels (`01 / RESEARCH`).
- Project metadata (year, stack).
- Date markers.
- DOI / arXiv IDs.
- Inline technical annotations.

### Where mono is forbidden

- Headings.
- Long-form body text.
- Hero display.

---

## 5. Layout & Grid

### Breakpoints

```text
mobile:  < 768px     single column
tablet:  768–1023px  8-col grid
desktop: ≥ 1024px    12-col grid
wide:    ≥ 1440px    12-col grid, larger gutters
```

### Grid

- Desktop: 12 columns, 24px gutter, content max-width **1200px**, full-bleed background.
- Tablet: 8 columns, 20px gutter.
- Mobile: single column, 16–24px horizontal padding.

### Allowed layout patterns

- 5/7 split (text/visual).
- 7/5 split (text/visual).
- 12-col full-width typography.
- 2-col (6/6) symmetric.
- 3-col (4/4/4) — sparingly, for skills groups.

### Forbidden

- 3-col hero with stock photo.
- Pure card grid for every section.
- Centered everything layouts.

---

## 6. Components

### Naming

- PascalCase.
- One component = one UI concept.
- Co-locate styles. Tailwind classes in the component file; no separate `.module.css` unless absolutely needed.

### File structure

```text
components/
├── layout/
│   ├── Container.tsx
│   ├── Section.tsx
│   └── Grid.tsx
├── navigation/
│   ├── DesktopNav.tsx
│   ├── MobileMenu.tsx        ← "use client"
│   └── Footer.tsx
├── hero/
│   ├── HeroLanding.tsx
│   ├── HeroIndustry.tsx
│   ├── HeroAcademic.tsx
│   └── VectorPortrait.tsx
├── shapes/
│   ├── ShapeBackground.tsx
│   ├── MouseShapeField.tsx   ← "use client"
│   └── ScrollShapeField.tsx  ← "use client"
├── cards/
│   ├── ProjectCard.tsx
│   ├── ResearchCard.tsx
│   ├── ClientCard.tsx
│   └── GitHubCard.tsx
├── ui/
│   ├── Button.tsx
│   ├── SectionHeading.tsx
│   ├── Eyebrow.tsx
│   ├── Meta.tsx
│   └── SkipToContent.tsx
└── motion/
    └── Reveal.tsx             ← "use client"
```

### Component rules

- A component must be used **≥ 3 times** before abstracting.
- No `BlueLine` / `SmallText` / `TinyBox` micro-components.
- All async data fetching happens in Server Components; pass typed props down.
- No business logic in `app/`. Logic lives in `lib/`.

### Example button

```tsx
// components/ui/Button.tsx
import { clsx } from "clsx";
import { ArrowRight } from "lucide-react";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: Array<string | undefined | null | false>) =>
  twMerge(clsx(inputs));

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export function Button({
  variant = "secondary",
  size = "md",
  withArrow = false,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2",
        size === "sm" && "h-8 px-3 text-sm",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-12 px-5 text-base",
        variant === "primary" && "bg-fg text-fg-on-dark hover:bg-fg/90",
        variant === "secondary" &&
          "border border-border bg-bg hover:bg-blue-50 hover:border-blue",
        variant === "ghost" && "hover:underline underline-offset-4",
        className
      )}
      {...props}
    >
      {children}
      {withArrow && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
    </button>
  );
}
```

---

## 7. Responsive Workflow

### Mobile-first

Write the mobile styles first. Add `md:` / `lg:` overrides.

```tsx
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">
```

### Test

- Chrome DevTools (375, 768, 1024, 1440).
- iOS Safari (real device if possible).
- Android Chrome (real device if possible).
- `prefers-reduced-motion: reduce` enabled.

### Mobile navigation

- Hamburger sheet, full-height, scroll-locked body.
- `Esc` and outside-tap close.
- Focus trap.
- `aria-expanded` on trigger.

---

## 8. Accessibility (built-in, not bolted on)

Every component must:

- Use semantic HTML (`<button>` not `<div onClick>`).
- Have a visible focus ring (2px `--blue`, 2px offset).
- Have a real `<label>` for any form input.
- Have an `aria-label` on icon-only buttons.
- Have an `alt` attribute (or `alt=""` for decorative).
- Use `prefers-reduced-motion` to gate motion.

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export function Reveal({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 9. Performance hygiene (frontend-specific)

- Use `next/image` for all raster images.
- Use `next/font` for fonts.
- Use `next/link` for internal links (auto-prefetch).
- Don't import client libs into server components.
- Lazy-load below-the-fold heavy components with `next/dynamic`.
- `dynamic = "force-static"` on pages that don't need request-time data.

```tsx
// app/industry/page.tsx
import dynamic from "next/dynamic";
const MouseShapeField = dynamic(() =>
  import("@/components/shapes/MouseShapeField").then((m) => m.MouseShapeField)
);
```

---

## 10. Code style

- **No `any`**. Use `unknown` + narrowing if needed.
- **No `useEffect` for derived state**. Compute at the top of the component.
- **No inline styles** unless truly dynamic (a CSS variable based on scroll position is fine).
- **No `console.log`** in committed code.
- **No dead code**. If a function isn't called, delete it.
- Prefer `const` and arrow functions.
- `interface` for object shapes that may be extended, `type` for unions/intersections.
- Co-locate `interface` and `type` near their consumer, not in a global `types.ts` dump.

---

## 11. Pre-PR checklist (frontend)

Before opening a PR, verify:

- [ ] No `"use client"` added unless justified in `app/` tree.
- [ ] No new dependencies added without updating `package.json` (with rationale in the PR body).
- [ ] No purple gradients / glassmorphism / 3D introduced.
- [ ] Border-radius ≤ 8px everywhere.
- [ ] Color contrast verified (≥ 4.5:1 for body text).
- [ ] Keyboard navigation works end-to-end.
- [ ] Reduced-motion path tested.
- [ ] Mobile (375px) renders cleanly.
- [ ] Lighthouse (local) ≥ 95 for Perf, A11y, Best Practices, SEO.
- [ ] `pnpm lint` and `pnpm typecheck` pass.

---

## 12. Anti-patterns (forbidden in this repo)

| Anti-pattern                                           | Why                                   |
| ------------------------------------------------------ | ------------------------------------- |
| `<div onClick={...}>`                                  | Use `<button>` / `<a>`                 |
| Inline `style={{ ... }}` for static values             | Use Tailwind classes                  |
| `useEffect` for fetching data on a static page         | Use a Server Component                |
| Hidden scrollbars / `overflow: hidden` on `body`     | Accessibility issue                   |
| `framer-motion` for every section                      | Reserve motion for 5 specific places  |
| Tailwind `!important` utilities                        | Fix the cascade instead               |
| `bg-gradient-to-r from-purple-500 to-pink-500`         | Literally no.                         |
| `rounded-3xl` cards                                    | Max is `rounded-md` (6px)             |
| Default browser focus ring                             | Override with `focus-visible:ring-2`  |
| `useState` for static content                         | Compute at top                        |
| `localStorage.getItem` during SSR                      | Guard with `useEffect` / client only  |

---

## 13. Quick-start (new file in this repo)

```tsx
// components/ui/SectionHeading.tsx
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: Props) {
  return (
    <header
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-widest text-blue">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-medium tracking-tight text-fg md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-fg-muted md:text-lg">
          {description}
        </p>
      )}
    </header>
  );
}
```

If you're writing a new component, follow this template unless you have a specific reason not to.
