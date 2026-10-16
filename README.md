# Kaif Portfolio

> A high-end personal digital portfolio for **Md Kaif Afran Khan** — Industry + Academia in a single static-first site.

This README is written for **two audiences**:

1. **Humans** cloning the repo to run or deploy it.
2. **Coding agents** (`puku-cli`, Claude Code, etc.) navigating the repo to make changes.

If you are an agent, jump to **[Agent navigation guide](#agent-navigation-guide)**.

---

## Quick start

Requires **Node.js 20+** (Next.js 15 minimum). No database, no env vars, no external services.

```bash
# 1. Install
npm install

# 2. Start the dev server (Turbopack, hot reload, port 3000)
npm run dev

# 3. Open
# http://localhost:3000
```

### Other commands

| Command           | What it does                                                         |
| ----------------- | -------------------------------------------------------------------- |
| `npm run dev`     | Start the Next.js dev server with hot reload.                        |
| `npm run build`   | Production build. Fails if any YAML in `content/` violates its schema. |
| `npm run start`   | Serve the production build (after `build`).                          |
| `npm run lint`    | ESLint via `eslint-config-next`.                                     |
| `npm run typecheck` | `tsc --noEmit` over the entire project (no JS emitted).            |

### Smoke test after `npm run dev`

```bash
curl -I http://localhost:3000/             # 200
curl -I http://localhost:3000/industry     # 200
curl -I http://localhost:3000/academic     # 200
curl    http://localhost:3000/sitemap.xml  # lists every route
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"t@x.com","message":"hi"}'
# → 200 + { "ok": true, "mailto": "mailto:..." }
```

### One-off asset conversion

The raw HEIC portrait at `profile_pic.HEIC` was converted via `scripts/convert-heic.mjs` (requires `ffmpeg` + `sharp` available in the env). Re-run it only if the source photo changes:

```bash
node scripts/convert-heic.mjs
# Outputs to public/images/profile/profile.{webp,jpg} and profile-square.webp
```

---

## Project layout

```
portfolio/
├── app/                          Next.js 15 App Router routes (RSC by default)
│   ├── page.tsx                  Landing (bento layout)
│   ├── industry/                 /industry + /industry/projects/[slug]
│   ├── academic/                 /academic + /academic/research/[slug]
│   ├── contact/                  /contact
│   ├── cv/{academic,professional}/  Static PDF routes
│   ├── api/contact/              POST handler — validates + returns mailto:
│   ├── not-found.tsx
│   ├── robots.ts                 /robots.txt
│   ├── sitemap.ts                /sitemap.xml (driven by content getters)
│   ├── layout.tsx                Root layout: NavShell, ScrollShapeField, MouseShapeField, Footer
│   └── globals.css               Tailwind v4 entry, blueprint/ticks utilities
│
├── components/
│   ├── ui/                       Primitives: Button, Eyebrow, Meta, SectionHeading, SkipToContent
│   ├── layout/                   Container, Section, Grid, Badge, BentoGrid, BentoCard
│   ├── navigation/               NavShell, DesktopNav, MobileMenu, Footer
│   ├── shapes/                   ShapeBackground, MouseShapeField, ScrollShapeField, shapes/
│   ├── motion/                   Reveal (respects prefers-reduced-motion)
│   ├── hero/                     VectorPortrait, HeroIndustry, HeroAcademic
│   ├── about/                    AboutPhoto, EducationTimeline
│   ├── education/                ExperienceTimeline (industry), EducationAcademic
│   ├── cards/                    ProjectCard, ResearchCard, ClientCard, GitHubCard, PublicationItem
│   ├── research/                 InterestsMatrix
│   └── contact/                  ContactForm ("use client")
│
├── content/                      YAML content — single source of truth
│   ├── shared/                   person.yaml, education.yaml, skills.yaml, certifications.yaml,
│   │                             languages.yaml, hobbies.yaml, contact.yaml
│   ├── industry/                 experience.yaml, projects.yaml, client-work.yaml, github.yaml
│   └── academic/                 research.yaml, publications.yaml, thesis.yaml,
│                                 conferences.yaml, research-projects.yaml
│
├── lib/
│   ├── schemas.ts                Zod schemas (one per YAML file)
│   ├── yaml.ts                   readYAML() — fs-based, build-time only
│   ├── content.ts                Typed getters: getPerson(), getProjects(), getResearchProject(slug), ...
│   └── utils.ts                  cn() helper (clsx + tailwind-merge)
│
├── styles/
│   └── tokens.css                Design tokens: --blue, --bg, --fg, --grid-line, --badge-*, etc.
│
├── public/                       Static assets served at /
│   ├── images/profile/           Converted WebP/JPG variants of profile_pic.HEIC
│   ├── media/cv/                 Placeholder academic + professional CV PDFs
│   └── portfolio.svg             Signature portrait — only used on the landing page
│
├── scripts/
│   └── convert-heic.mjs          ffmpeg + sharp: HEIC → WebP/JPG
│
├── skills/                       Companion skill briefs (frontend, perf, security, 2D, writing)
├── progress/                     Living project log: STATUS.md, INDEX.md, DECISIONS.md, GLOSSARY.md
│
├── PLAN.md                       Master plan (75 sections) — the source of truth for structure
├── next.config.ts                Strict CSP + security headers + cache strategy
├── tsconfig.json                  Strict TS, paths alias "@/*" → repo root
├── postcss.config.mjs            Tailwind v4 PostCSS plugin
└── package.json
```

---

## Architecture rules (do not break)

These are the non-obvious conventions an agent must respect. Full rationale lives in `PLAN.md` and `progress/DECISIONS.md`.

1. **Server Components by default.** Add `"use client"` only when you need state, effects, or DOM events. Current `"use client"` files: `MobileMenu`, `Reveal`, `MouseShapeField`, `ContactForm`.
2. **Strict CSP.** `next.config.ts` ships a Content-Security-Policy that disallows `unsafe-eval`, third-party scripts, and cross-origin assets. Do not add external CDN scripts, fonts, or analytics — they will be blocked. If you need an exception, update the CSP and document it.
3. **Content = YAML.** Never hardcode copy, project lists, or experience in components. Add a field to the appropriate schema in `lib/schemas.ts` and the matching YAML file. The build will fail loudly if YAML does not parse — this is intentional.
4. **Design tokens over hardcoded colors.** Use `bg-bg`, `text-fg`, `border-border`, `text-blue`, `bg-blue-50`, etc. New tokens go in `styles/tokens.css` and are exposed to Tailwind via `@theme` in `app/globals.css`.
5. **Reuse primitives.** Reach for `Container`, `Section`, `Grid`, `SectionHeading`, `Eyebrow`, `Meta`, `Reveal`, `Button`, `Badge`, `BentoCard` before creating new layout components. The "every section is a grid of cards" failure mode is explicitly called out in PLAN §61 — alternate layouts intentionally.
6. **No third-party CSS frameworks.** Tailwind v4 only. No styled-components, no Emotion, no CSS-in-JS.
7. **`motion` is for ≤ 5 micro-interactions.** Hero shape parallax, Reveal. Do not animate every heading or every card on hover.
8. **Images**: use `next/image`. The HEIC source lives at the repo root; converted variants live in `public/images/profile/`. The signature `portfolio.svg` is only ever referenced from the landing page hero — nowhere else.
9. **Reduced motion is honored.** `Reveal` no-ops under `prefers-reduced-motion`. Do not introduce motion that ignores it.

---

## Working with content (YAML)

1. Edit the right file in `content/`.
2. If you need a new field, add it to `lib/schemas.ts` first.
3. Run `npm run typecheck` and `npm run build` — Zod errors point to the exact YAML path that failed.
4. Restart `npm run dev` if you added a new file (Next dev caches the YAML read).

Schema-first order matters: the schema is the contract, the YAML conforms, and the component receives a fully-typed object.

---

## Deployment

The site is a static-friendly Next.js 15 app with no runtime data. The simplest deployment is:

```bash
npm run build
npm run start              # listens on :3000
```

For a static export, add `output: "export"` to `next.config.ts` and use `npx serve out`. The CSP and security headers are only set in the Node server runtime — when exporting statically, configure them at your edge (Vercel, Netlify, Cloudflare, Nginx).

CV PDFs at `public/media/cv/{academic,professional}-cv.pdf` are placeholders. Replace them before launch.

---

# Agent navigation guide

> Read this first if you are an AI coding assistant picking up work in this repo.

## Mission

Ship a publication-grade personal portfolio for Md Kaif Afran Khan covering two identities (Industry + Academia) on a single static site. Quality bar (PLAN §4): a professor or hiring manager should understand who Kaif is, what he does, and how to engage within 5 seconds — without the website itself being the spectacle.

## Required reading (in this order)

1. **`PLAN.md`** — 75 sections. Authoritative for structure, section order, design rules, and the "do not" list (PLAN §3 — AI-slop tells to avoid).
2. **`progress/STATUS.md`** — what's built, what's in progress, what's blocked.
3. **`progress/DECISIONS.md`** — every non-obvious structural call (D-001 through latest). Read recent entries before proposing new ones.
4. **`progress/INDEX.md`** — file inventory and what each module owns.
5. **`progress/GLOSSARY.md`** — project vocabulary.
6. **`skills/`** — five skill briefs that encode constraints (frontend, performance, security, 2D shape language, content writing). Each is short; skim before designing.

## Hard constraints (any agent must respect)

These will fail review if violated:

- **No purple/pink gradients, no glassmorphism orbs, no 3D blobs, no Lottie, no Three.js, no per-word scroll reveals, no neon glow.** See PLAN §3.
- **No external CDN scripts / fonts / analytics.** CSP blocks them.
- **No hardcoded copy in components.** Add YAML + schema.
- **No third-party CSS.** Tailwind v4 only.
- **Server Components by default.** `"use client"` is the exception, not the rule.
- **No new state libraries.** URL state and RSC props only.
- **Mobile-first.** Verify every layout at 375px before declaring done.
- **`prefers-reduced-motion` must be respected.** If you add motion, gate it.

## File ownership map (where to make what change)

| You want to…                                   | Touch                                                                                |
| ---------------------------------------------- | ------------------------------------------------------------------------------------ |
| Change landing copy / structure                | `app/page.tsx`, `content/shared/*.yaml`                                              |
| Add an industry project                        | `content/industry/projects.yaml` (must satisfy `ProjectSchema` in `lib/schemas.ts`)  |
| Add a research project + its detail page       | `content/academic/research-projects.yaml` — slug becomes the route automatically    |
| Change hero on `/industry` or `/academic`      | `components/hero/HeroIndustry.tsx`, `HeroAcademic.tsx`                               |
| Add a new card type                            | `components/cards/<Name>Card.tsx` + wire into the relevant page                     |
| Add a new design token                         | `styles/tokens.css` + expose via `@theme` in `app/globals.css`                      |
| Change the nav                                 | `components/navigation/{NavShell,DesktopNav,MobileMenu,Footer}.tsx`                  |
| Change the sitemap                             | `app/sitemap.ts` — driven by `getProjects()` and `getResearchProjects()`             |
| Tweak contact form validation / mailto shape   | `app/api/contact/route.ts`                                                           |
| Update CV PDF                                  | Drop a new PDF at `public/media/cv/{academic,professional}-cv.pdf`                   |
| Replace the portrait                           | Replace `profile_pic.HEIC` then run `node scripts/convert-heic.mjs`                  |

## Common workflows for an agent

### Add a new project (case study) on `/industry`

1. Append an entry to `content/industry/projects.yaml` matching `ProjectSchema` (see `lib/schemas.ts`). Include a unique `slug`, set `case_study: true` if you want a dedicated detail page.
2. Add a top-level `summary`, `impact` (optional), and `stack`. Detail page sections derive from these (see `app/industry/projects/[slug]/page.tsx`).
3. Run `npm run typecheck && npm run build` — Zod will surface any schema mismatch.
4. Detail page is auto-routed at `/industry/projects/<slug>`; sitemap updates itself.

### Add a research project on `/academic`

Same pattern, file is `content/academic/research-projects.yaml`, schema is `ResearchProjectSchema`, route is `/academic/research/<slug>`.

### Add a new section to a page

1. Pick the page (`app/<route>/page.tsx`) and find its section list (PLAN §15 for Industry, §27 for Academic).
2. If the section requires new content, add a YAML file + schema + getter in `lib/content.ts`.
3. Compose from `Section`, `Container`, `SectionHeading`, `Eyebrow`, `Meta`, `Reveal`. Wrap cards in `BentoCard` only if the section is genuinely card-shaped.
4. Alternate `tone="default"` / `tone="soft"` to create rhythm — do not stack identical tones.

### Add a new design token

1. Define `--your-token` in `styles/tokens.css`.
2. Add the right `--color-*` / `--text-*` / `--spacing-*` entry under `@theme` in `app/globals.css` so Tailwind can use it as a utility class (e.g. `bg-your-token`, `text-your-token`).
3. Use the utility class. Do not reference the CSS variable directly from components.

## Verification before claiming done

Run all four. A task is not done until they pass:

```bash
npm run typecheck
npm run lint
npm run build
npm run dev   # then curl the affected routes
```

Spot-check:
- Mobile width 375px (DevTools responsive mode)
- `prefers-reduced-motion: reduce` enabled in DevTools Rendering tab
- DevTools console has zero CSP violations and zero React hydration warnings

## Things you should never do in this repo

- `git commit --no-verify` or `--no-gpg-sign`
- `git push --force` to `main` / `master`
- `npm install <random-package>` — every dependency must justify itself against PLAN §6 and the bundle budget (initial JS ≤ 90 KB gz)
- Add environment variables without updating `.env.example`
- Edit `node_modules/`
- Add a README inside `app/` or `components/` (this README is the only README)

## When you are unsure

1. Find the matching PLAN section number and the matching DECISIONS entry.
2. If still unclear, ask the user — never guess on architecture.
3. Do not invent files outside the `app/`, `components/`, `content/`, `lib/`, `styles/`, `public/`, `scripts/`, `progress/` directories.

---

Last updated alongside `progress/STATUS.md` — keep them in step.