# Status Snapshot

> **Purpose**: Quick answer to "what's done, what's next, what's blocked?"
> **Last updated**: 2026-10-05

---

## Current phase

**Phases 1, 2, 3, 4, 5, 6, and 7 (security + bundle cleanup + Next 16 migration + rate-limiter + static CV redirects + dev-server webpack switch) are shipped.** Industry, Academic, and detail pages are live with real (placeholder-fill) content end-to-end. Dev server back to 200 OK on port 3000.

**Next 16 migration (D-025–D-029) shipped**:
- `next` 15.5.27 → 16.3.8, `eslint` 8.5 → 9.36, `eslint-config-next` synced to 16. Flat `eslint.config.mjs` (Next 16 removed `next lint`).
- Rate limiter migrated to `@upstash/ratelimit` + `@upstash/redis` (HTTP) with in-process fallback.
- 4 CV routes declared as static 308 redirects in `next.config.ts`; per-route handlers deleted.
- `/cv/master` renamed to `/cv/academic`; `/cv/professional` added as SOP-aligned alias.
- `dev` script switched to `next dev --webpack` to bypass Turbopack's Windows PostCSS-worker crash (`0xc0000142`).
- `--ease-out` token renamed to `--motion-ease` to escape a Tailwind v4 utility collision that became a hard 500 under Next 16.

Next up is **Phase 8 — content polish** (apply `content-writing-no-ai-slop` skill to YAML + page copy) and remaining F-19–F-28 audit items. See `progress/AUDIT.md` for full findings.

---

## Built

- ✅ Master plan (`PLAN.md`) — 75 sections.
- ✅ Skills index — 5 skills covering frontend, performance, security, 2D shape language, and writing.
- ✅ Progress folder — INDEX, STATUS, DECISIONS, GLOSSARY.
- ✅ **Phase 1 — Foundation**: Next.js 15 + React 18 + TS strict + Tailwind v4 + tokens + Zod + YAML loader + security headers + CI-ready `next.config.ts`.
- ✅ **Phase 2 — Visual identity**: `VectorPortrait`, `ShapeBackground`, `MouseShapeField`, `ScrollShapeField`, `Reveal`, `Button`, `SectionHeading`, `Eyebrow`, `Meta`, `SkipToContent`, `Container`, `Section`, `Grid`, `Footer`, `NavShell`, `DesktopNav`, `MobileMenu`.
- ✅ **Phase 3 — Landing**: `/` (Hero + About + Industry/Academia split cards + Education snapshot + Contact CTA dark section). `/contact`, `/industry`, `/academic`, `/cv/{academic,professional}`, `/not-found`, `/sitemap`, `/robots` all wired.
- ✅ Placeholder PDFs at `public/media/cv/{academic,professional}-cv.pdf` so CV routes resolve.
- ✅ **Phase 4 — Industry**: `HeroIndustry`, `ExperienceTimeline`, `ProjectCard`, `ClientCard`, `GitHubCard`, `Pipeline` (data-engineering medallion SVG). `/industry` rewritten with the full PLAN §15 section order (Hero → Summary → Education → Core Skills → Experience → Selected Projects → AI/Data/Full-Stack → Client Work → GitHub → Certifications → Languages → Beyond Work → Contact).
- ✅ **Phase 5 — Academic**: `HeroAcademic`, `ResearchCard`, `PublicationItem` (status badge, collapsible abstract), `InterestsMatrix`, `EducationAcademic`. `/academic` rewritten with PLAN §27 order (Hero → Research Profile → Education → Research Interests → Publications → Thesis → Research Projects → Conferences → Methods → Certifications → Languages → Academic CV → Contact).
- ✅ **Phase 6 — Detail pages**: `/industry/projects/[slug]` (case studies with `generateStaticParams` filtered to `case_study: true`) and `/academic/research/[slug]` (full research detail template). `app/sitemap.ts` driven from content getters.
- ✅ **Landing redesign — bento + blueprint + real photo + contact form**: `BentoGrid`, `BentoCard` (with `tone="blueprint"` and wireframe corner ticks), `Badge`, `AboutPhoto` (real photo, recolor skipped), `EducationTimeline` (SSC → HSC → university animated sequence with per-milestone stagger), `ContactForm` (client) + `/api/contact` route handler (server-side validation + mailto composition). Tokens: `--grid-line`, `--grid-line-strong`, `--grid-cell`, `--badge-*`. `.bg-blueprint` utility + `.ticks` corner marks. `app/page.tsx` rewritten to a bento 5-section landing (Hero → About → Industry/Academia split → Selected Work → Contact). HEIC → WebP/JPG conversion one-shot via `scripts/convert-heic.mjs`.

## In progress

- 🚧 Nothing currently active.

## Planned (next)

Ordered by `PLAN.md` §71:

1. **Phase 7 — Optimization** — Lighthouse + bundle audit + Web Vitals. Hard targets: LCP ≤ 1.5s, INP ≤ 100ms, CLS ≤ 0.05, JS ≤ 90 KB gz initial.
2. **Phase 8 — Content polish** — voice pass using `skills/content-writing-no-ai-slop` once real content replaces the placeholder scaffolding.
3. **Phase 9 — Security pass** — CSP enforce, headers verify, dep audit.

## Blocked

- None.

---

## Open questions

Track in `DECISIONS.md` if resolved, or carry in the back of your mind:

- Domain name — TBD.
- Analytics in v2? — Out of scope for v1 (see `PLAN.md` §65).
- Contact form v2 — Nodemailer SMTP (Gmail App Password) shipped in D-019; in-process rate limit unreliable on serverless (F-21).
- Dark mode? — Out of scope for v1.
- Real CV PDFs — placeholders stand until user provides real files.
- Real content for `content/**/*.yaml` — copy pass shipped via `skills/content-writing-no-ai-slop`; `[TBD: …]` markers remain for unverifiable specifics.
- Thesis PDF URL in `content/academic/thesis.yaml` — omitted for now; thesis section renders the `[Download PDF]` button only when the field is set.
- `/academic/publications` standalone route — out of scope for v1 (publications live as a section on `/academic`, per PLAN §27).
- Next 16 upgrade? — blocked by F-20 (postcss / sharp CVEs); approve migration to clear.
- CV route static-ification (F-19) — owner decision pending.
- CV route naming (F-25) — `/cv/{academic,industry,master}` vs SOP `/cv/{academic,professional}`.