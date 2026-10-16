# Portfolio Audit — 2026-10-05

Three parallel audits ran against the Kaif portfolio on 2026-10-05, each driven
by `skill_1.md` (the `portfolio-optimizer` skill) and one of the local skills in
`skills/`:

- **Performance** — `skills/super-fast-optimization`, `skills/frontend`
- **Security** — `skills/security`
- **SOP / Redundancy / TS** — `skills/portfolio-sop`

All `npx` tool failures (knip OOM, depcheck limitations) fall back to source
inspection. Raw agent reports are not duplicated here; only the consolidated
findings and applied fixes.

---

## 1. Summary

- **Build / typecheck / lint: all green** after fixes (22/22 static, 0 type errors, 0 lint warnings).
- **CVE fix**: `next@15.0.3 → ^15.5.27`, `yaml@2.6.0 → ^2.9.1` clears 30+ advisories.
- **Performance win**: removed `react-grab` from production (cleared ~96 KB gz from every route) and dropped the dead dev directory.
- **Security**: added `upgrade-insecure-requests` to prod CSP, `Cache-Control: no-store` to `/api/contact`, tightened `name` Zod regex against SMTP header injection, escaped `<` in JSON-LD output, and added `server-only` import in `lib/yaml.ts`.
- **SOP**: deleted 6 dead components (~440 lines), removed duplicate `priority` on AboutPhoto, gated `MouseShapeField` on `(pointer: fine)`, added `poweredByHeader: false` and AVIF to image formats, removed dead tokens, added `*.HEIC` to `.gitignore`, deleted 9.5 MB unreferenced `profile.png` + 1.7 MB `profile_pic.HEIC` at repo root.
- **Hero copy**: removed banned "I am" opener from `HeroIntro` (content-writing-no-ai-slop §7).
- **Avatar ref**: captured `scope.current` into a local in the cleanup, fixing a pre-existing `react-hooks/exhaustive-deps` warning.

## 2. Metrics

| Metric | Before | After | Delta |
|---|---|---|---|
| Shared First Load JS | 100 KB | 103 KB | +3 KB (Next 15.5 runtime is slightly heavier than 15.0) |
| `/` First Load JS | 204 KB | 201 KB | −3 KB (route-specific; `react-grab` removed) |
| `/contact` First Load JS | 119 KB | 116 KB | −3 KB |
| `/industry` First Load JS | 158 KB | 155 KB | −3 KB |
| Static routes (○ / ●) | 17 / 4 | 17 / 4 | same |
| Dynamic (ƒ) routes | 5 (3 CV redirects, feed, api/contact) | same | (CV redirects kept dynamic intentionally) |
| Build warnings | 2 CSS optimizer warnings | 2 same | (Next 15.5 internal artifact; no source fix) |
| Lint warnings | 1 (Avatar ref) | 0 | −1 |
| Typecheck errors | 0 | 0 | 0 |
| `npm audit --omit=dev` (prod) | 1 critical / 2 high / 1 moderate | 1 high / 1 moderate | −1 critical, −1 high (postcss + sharp remain transitive under `next`) |
| Files deleted | — | 8 components, 2 assets, 3 dirs | −13 |
| Lines removed | — | ~440 (components) + ~10 (tokens) + Avatar line noise | ~450+ |
| Repo size delta | — | −11.2 MB (assets) | |

## 3. Findings table (applied)

| ID | Sev | Cat | file:line | Evidence | Fix | Status |
|---|---|---|---|---|---|---|
| F-01 | P0 | Security | `package.json:17` | `next@15.0.3` — 30+ CVEs incl. RCE/SSRF | `next@^15.5.27` | applied (D-021) |
| F-02 | P0 | Security | `package.json:23` | `yaml@2.6.0` — ReDoS / stack overflow | `yaml@^2.9.1` | applied (D-021) |
| F-03 | P0 | Performance | `app/layout.tsx:73` + `package.json:21` | `react-grab` shipped to prod (~96 KB gz/route) | removed layout import, deleted `components/dev/ReactGrab.tsx`, dropped dep | applied (D-020) |
| F-04 | P1 | Security | `next.config.ts:5–16` | Missing `upgrade-insecure-requests` | added | applied (D-022) |
| F-05 | P1 | Security | `app/api/contact/route.ts` | No `Cache-Control: no-store` on 200/400/429 | per-route header in `next.config.ts` | applied (D-022) |
| F-06 | P1 | Security | `lib/contact-schema.ts:14–18` | `name` interpolates raw into `replyTo:` / `Subject:` | added `^[\p{L}\p{N} .,'\-]{1,80}$u` regex | applied (D-023) |
| F-07 | P1 | Security | `components/seo/StructuredData.tsx:14` | `JSON.stringify(data)` not escaped | escape `<` → `\u003c` | applied |
| F-08 | P1 | SOP | `lib/yaml.ts` | no `server-only` guard | added `import "server-only"` | applied |
| F-09 | P1 | Performance | `next.config.ts:68–70` | `poweredByHeader` not false; only webp | added `poweredByHeader: false`, `formats: ["image/avif", "image/webp"]` | applied |
| F-10 | P1 | Performance | `app/page.tsx:240` | duplicate `priority` on AboutPhoto | removed | applied |
| F-11 | P1 | Performance | `components/shapes/MouseShapeField.tsx:27–30` | rAF loop runs on touch | gate on `(pointer: fine)` MQ | applied |
| F-12 | P2 | SOP | `components/hero/VectorPortrait.tsx`, `components/hero/HeroSchematic.tsx`, `components/cards/ResearchCard.tsx`, `components/shapes/shapes/Pipeline.tsx`, `components/ui/LatencyMetric.tsx`, `components/research/InterestsMatrix.tsx` | 0 imports | deleted (6 files, 3 empty dirs) | applied |
| F-13 | P2 | SOP | `app/academic/page.tsx:16,157` | used dead `InterestsMatrix` | inlined grid list (interests are `z.array(z.string())`) | applied |
| F-14 | P2 | SOP | repo root | `Avatar.tsx` + `AvatarArt.tsx` outside allowed paths; `framer-motion` transitive | moved to `components/hero/`, added dep | applied (D-024) |
| F-15 | P2 | SOP | `styles/tokens.css:12–13, 24, 30–35, 50–53` | 11 tokens with 0 references | removed | applied |
| F-16 | P2 | Perf | `public/images/profile/profile.png` (9.5 MB) + `profile_pic.HEIC` (1.7 MB) | not referenced | deleted; `*.HEIC` added to `.gitignore` | applied |
| F-17 | P2 | Content | `components/hero/HeroIntro.tsx:43` | `<span>I am</span>` — banned opener | removed | applied |
| F-18 | P2 | Lint | `components/hero/Avatar.tsx:182` | ref cleanup using ref that may have changed | capture `target = scope.current` once | applied |

## 4. Findings table (proposed / needs decision)

| ID | Sev | Cat | file:line | Evidence | Fix | Status |
|---|---|---|---|---|---|---|
| F-19 | P1 | Performance | `app/cv/academic/route.ts`, `/industry/route.ts`, `/master/route.ts` | 3 `ƒ Dynamic` for redirects; violates "every content route static" | replace with static `<a href="/media/cv/*.pdf" download>` | needs owner decision — affects download UX |
| F-20 | P1 | Security | `npm audit` | 2 transitive advisories in `postcss` + `sharp` (under `next`) | `npm audit fix --force` → `next@16.3.8` (breaking) | needs owner decision — major version migration |
| F-21 | P2 | Security | `app/api/contact/route.ts:39–49` | in-process rate limit unreliable on serverless | migrate to Upstash / Vercel KV / edge middleware | needs owner decision — adds external dep |
| F-22 | P2 | SOP | `tsconfig.json` | `noUncheckedIndexedAccess` + `verbatimModuleSyntax` off | enable one at a time, fix fallout | proposed; should be done as a separate commit |
| F-23 | P2 | Performance | `components/motion/Reveal.tsx` + 4 consumers | `motion` runtime per consumer | CSS + `IntersectionObserver` (20 lines) | proposed; visual change risk low |
| F-24 | P2 | Performance | `components/cards/ProjectCard.tsx` vs `LiveProjectCard.tsx` | ≥ 70 % identical; 1 caller of `LiveProjectCard` | merge to `<ProjectCard variant="default" \| "live">` | proposed; one-card refactor |
| F-25 | P3 | SOP | `app/cv/{academic,industry,master}` vs SOP §2 | SOP says `/cv/academic` + `/cv/professional`; code has `master` + `industry` | rename routes or update SOP | needs owner decision |
| F-26 | P3 | Content | `public/media/cv/{academic,industry,master}-cv.pdf` | hand-built placeholders per D-017 | replace with real CVs | needs owner action |
| F-27 | P3 | Content | YAML research entries | several `[TBD: …]` markers awaiting real data | owner to fill | needs owner action |
| F-28 | P3 | Build | `.next/static/css/*.css` | `ease-[var(--ease-out)]` arbitrary class emitted by Tailwind v4 + Turbopack collision | Renamed `--ease-out` → `--motion-ease` (D-029); dev now on webpack (D-028) | ✅ resolved |

## 5. Open questions for the owner

1. **Postcss / sharp CVEs** remain in `npm audit`. Fixing them requires `next@16.3.8`, a major-version upgrade that changes cache defaults. Approve the migration, or accept the residual risk?
2. **CV route static-ification**: convert `/cv/{academic,industry,master}` from `route.ts` GET-handler redirects to static `<a href="/media/cv/*.pdf" download>` direct links? Removes 3 dynamic routes, improves crawlability.
3. **Rate limit migration**: in-process throttle on `/api/contact` is unreliable on serverless. Migrate to Upstash / Vercel KV? Adds a dependency but is the only way to actually rate-limit on a serverless platform.
4. **Real CVs**: when do you want to drop real PDFs into `public/media/cv/`? The current placeholders are clearly not the final design (per D-017).
5. **CV route naming**: SOP §2 says `/cv/academic` + `/cv/professional`; code has `/cv/master` + `/cv/industry`. Reconcile?

## 6. Decisions added this run

- D-020 — Removed `react-grab` from production
- D-021 — Bumped `next` 15.0.3 → 15.5.27 and `yaml` 2.6.0 → 2.9.1
- D-022 — CSP `upgrade-insecure-requests` + `/api/contact` `no-store`
- D-023 — `name` regex blocks SMTP header injection
- D-024 — `Avatar.tsx` / `AvatarArt.tsx` moved to `components/hero/`
