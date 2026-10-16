# Decisions Log

> **Purpose**: Append-only record of non-trivial decisions. Format: **what was decided → why → alternatives considered → consequence.**
>
> Agents and future-you should read this **before** re-opening any of these questions.

---

## D-001 — Static-first architecture (no DB, no CMS, no API for v1)

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §1, §45, §50, §65

**Decision**: v1 has no database, no headless CMS, no server-side API. All content lives in YAML files in git. Build is fully static. Vercel serves from CDN.

**Why**:
- The content is small (~30 entries max). A CMS adds operational overhead with no payoff.
- Static SSG + edge cache is the fastest, cheapest, most secure default.
- Recruiter/professor trust signal: the portfolio is open-source by default — they can read the repo.
- No analytics, no DB, no API → the simplest possible attack surface (see `skills/security`).

**Alternatives considered**:
- Headless CMS (Sanity, Contentful, Notion-as-CMS) — adds cost, latency, auth, and a second system to keep in sync.
- Supabase + Postgres — overkill for 30 entries; introduces auth + RLS complexity.
- MDX-only — works, but YAML is better for typed structured data; we keep MDX optional.

**Consequence**:
- Content updates require a git commit + Vercel build (≤ 60s).
- Adding real-time features later (e.g., comments) requires revisiting.

---

## D-002 — Next.js 15 App Router + RSC by default

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §2, §46

**Decision**: Next.js 15+ App Router. Every component is a Server Component unless it requires browser APIs or interactivity.

**Why**:
- RSC eliminates most client JS by default — directly improves Core Web Vitals.
- Server Components can read YAML at build time without exposing data fetching to the client.
- App Router is the modern, supported direction.

**Alternatives considered**:
- Pages Router — older, less aligned with current Next.js direction.
- Plain React + Vite — no SSR, no RSC, worse SEO.
- Astro — great for content sites but weaker for components with state.

**Consequence**:
- `"use client"` boundaries are deliberate and minimal (mobile menu, shape fields, reveal, future form).
- Bundle stays under 90 KB gz initial.

---

## D-003 — Tailwind CSS v4 + CSS variables for tokens

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §2, §70, §sk

**Decision**: Tailwind v4 with tokens defined as CSS variables in `tokens.css`.

**Why**:
- v4 has first-class CSS variable theming; tokens live in one place.
- No CSS-in-JS at runtime.
- Tree-shaken by default.
- Aligns with `skills/frontend` rules.

**Alternatives considered**:
- CSS Modules — works, but adds friction with utility-first development.
- vanilla-extract — good but more setup overhead.
- Styled-components / Emotion — runtime cost, not allowed.

**Consequence**:
- Theme changes happen by editing `tokens.css`.
- Tailwind config maps to CSS variables.

---

## D-004 — pnpm, not npm or yarn

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §64

**Decision**: Use `pnpm`. Configure `onlyBuiltDependencies: []` to block all postinstall scripts by default.

**Why**:
- pnpm is faster and stricter than npm.
- `onlyBuiltDependencies` is a supply-chain hardening tool: it makes pnpm refuse to run any package's build/install scripts without explicit opt-in. This directly mitigates the "compromised package runs code on your machine" class of attacks (see `skills/security` §5).
- Lockfile is committed and verified in CI.

**Alternatives considered**:
- npm — slower, more permissive on postinstall scripts.
- yarn — fine, but no clear advantage over pnpm for this project.

**Consequence**:
- Native deps that need build steps (e.g., `sharp`) must be added explicitly.
- CI fails if lockfile changes without an explicit `pnpm install` commit.

---

## D-005 — No analytics, no third-party scripts in v1

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §65, `skills/security` §2

**Decision**: v1 ships zero third-party scripts. No Google Analytics, no Plausible, no Sentry, no chat widgets, no font CDNs.

**Why**:
- Faster (no extra requests).
- More private (no cookies, no fingerprinting).
- More secure (smaller attack surface).
- Aligns with strict CSP.
- "Add later if needed" — analytics is a feature that can be added without rebuilding architecture.

**Alternatives considered**:
- Cloudflare Web Analytics — considered for v2 (no cookies, edge-native).
- Vercel Speed Insights — considered for v2 (1.5 KB, no cookies).

**Consequence**:
- We cannot A/B test copy.
- We cannot measure real-user Core Web Vitals until v2 (use Lighthouse for now).

---

## D-006 — Strict CSP + full security headers from day one

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §64

**Decision**: Configure a strict CSP (`default-src 'self'`, no `'unsafe-eval'`, no `'unsafe-inline'` for scripts), full security headers (HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP/CORP), and ship in **enforce** mode from day one. Target `A+` on `securityheaders.com` and `Mozilla Observatory`.

**Why**:
- A portfolio is a recruiter's first touchpoint. A phishing warning or "unsafe site" browser flag is unrecoverable reputation damage.
- Strict CSP blocks an entire class of XSS bugs.
- There's no user input in v1, so we have no reason to need `'unsafe-eval'` or relaxed script sources.

**Alternatives considered**:
- CSP report-only first — considered, but rejected for v1: there's no existing baseline of legitimate violations; we can ship strict from day one.
- No CSP — rejected; non-negotiable baseline.

**Consequence**:
- Any future feature that needs `'unsafe-eval'` or a third-party script must explicitly relax CSP (with rationale) and re-review.

---

## D-007 — White + Blue + Black; blue is an accent, not the dominant surface

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §3, §4, §5

**Decision**: Primary palette is white + blue + black. Proportions roughly: white 70–80%, black/typography 15–20%, blue 5–10%. Blue appears on at most one shape per section, and only on small surfaces.

**Why**:
- Blue is a recognizable identity color (used in academia + corporate contexts).
- Restraint makes the blue accents actually mean something.
- Avoids the "everything is blue / looks like a SaaS landing page" failure mode.
- Plays well with both Industry (more energetic) and Academic (more restrained) contexts.

**Alternatives considered**:
- Larger blue presence (e.g., teal as primary surface) — rejected: too loud, fights with the editorial typography.
- All-grayscale + one accent color — considered; blue wins because it signals "this person works in tech / science".

**Consequence**:
- "Make this section more blue" is rarely the right answer; usually the answer is "use white, add one blue shape, ship".
- Any new feature that wants a second accent color must override this decision explicitly.

---

## D-008 — 2D vector portrait is the signature visual

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §12, §13, §62

**Decision**: The site has one signature: the vector portrait + blue geometric shape system. Same visual language appears in hero, project headers, section separators, OG images, and the footer.

**Why**:
- A single signature is more memorable than a portfolio of effects.
- Vector allows for a tiny payload (≤ 8 KB) and crisp rendering.
- Same SVG can be re-skinned (blue tint on Academic, full color on Industry) without re-illustrating.

**Alternatives considered**:
- Photographic portrait — considered; rejected because (a) we don't have a great one, (b) photos age, (c) photos don't scale into OG images cleanly.
- Abstract logo (no portrait) — rejected because the personal site benefits from showing the person.

**Consequence**:
- The portrait must be drawn **once** and used everywhere; we don't make multiple variants.

---

## D-009 — Subtle motion only; reduced-motion is a hard requirement

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §60, §7, §44, `skills/2d-object-interactive`

**Decision**: Motion budget per element type (button 120–200ms, card 180–250ms, section reveal 350–500ms). Maximum animation duration 800ms. No bouncing, no spring UI, no looping decorative animations. Reduced-motion respected in both CSS and JS.

**Why**:
- The portfolio's purpose is to communicate, not to perform.
- Vestibular-disorder accessibility is non-negotiable.
- Subtle motion reads as "polished"; loud motion reads as "template".

**Alternatives considered**:
- Full Lottie / Rive animations — too much for a portfolio.
- GSAP timelines — heavy for what we need.

**Consequence**:
- "Add a cool animation" is rarely the right answer; the answer is usually "remove this motion entirely" or "make it 80ms shorter".

---

## D-010 — YAML content with Zod validation at build time

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §35, §69

**Decision**: All content lives in YAML files. Each YAML file is validated by a Zod schema during the Next.js build. Invalid YAML fails the build.

**Why**:
- One source of truth for content.
- Type-safe at the React boundary (Server Components consume typed data).
- Build-time validation catches mistakes before deploy.
- Editable in any text editor; diffable in git.

**Alternatives considered**:
- MDX everywhere — works, but less typed and harder to reuse.
- TS files as content — works but adds git conflicts and compilation overhead.

**Consequence**:
- Adding a new entity (e.g., a new project) means (a) adding it to YAML, (b) potentially extending the Zod schema.
- Schemas are the contract between content authors and the UI.

---

## D-011 — Performance is a hard product requirement, not a checklist

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §45, §72, `skills/super-fast-optimization`

**Decision**: Hard performance targets: LCP ≤ 1.5s, INP ≤ 100ms, CLS ≤ 0.05, JS ≤ 90 KB gz initial. Lighthouse mobile ≥ 95 across all four categories. Bundle-size check is in CI.

**Why**:
- A portfolio that loads slowly is worse than no portfolio.
- The site is static — it has no excuse to be slow.
- Perceived speed affects whether recruiters/professors engage at all.

**Alternatives considered**:
- "Best-effort performance" — rejected: there is no fallback. Either we hit the targets or we don't ship.
- "Add a service worker for caching" — rejected: the site is already edge-cached; SW adds complexity for no measurable win.

**Consequence**:
- Every PR that touches a page, image, font, or client JS runs Lighthouse mobile.
- Any regression blocks the PR.

---

## D-012 — Voice: specific, direct, calm. No "passionate AI engineer" voice.

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §13, §57, `skills/content-writing-no-ai-slop`

**Decision**: The portfolio's voice is specific (names, numbers, dates), direct (short sentences, active voice), and calm (no bravado, no marketing). Hard ban-list for AI tells ("passionate", "innovative", "leverage", "delve", etc.). Every paragraph must contain at least one specific fact.

**Why**:
- The site is read by professors and hiring managers — both are excellent at detecting template language.
- "Show, don't label" is enforced by example throughout the ban-list and per-section checklist in `skills/content-writing-no-ai-slop`.
- A portfolio that reads like an LLM wrote it gets dismissed.

**Alternatives considered**:
- "Friendly conversational" voice — considered; rejected because it leans toward the AI-template zone.
- "Strictly academic" voice — considered for Academic page only; rejected because it loses warmth for Industry readers.

**Consequence**:
- Every copy PR runs through the "would I quote this in a cover letter to a professor at MIT?" test.
- The ban-list is enforceable in review.

---

## D-013 — Using npm instead of pnpm (env workaround)

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §2, §46

**Decision**: Use npm 11.6.2 as the package manager for v1. Lockfile is `package-lock.json`.

**Why**:
- pnpm via corepack is broken in this environment (`MODULE_NOT_FOUND: C:\Users\user\AppData\Local\node\corepack\v1\pnpm\12.8.1\bin\pnpm.cjs`).
- npm is available, works, and ships today. Lockfile is portable across contributors.
- We can migrate to pnpm in v2 once corepack is repaired; the project's deps are all standard npm-compatible.

**Alternatives considered**:
- Reinstall pnpm globally — would require admin + network and doesn't fix corepack.
- Yarn — works but adds another tool to the team.
- Stay blocked — unacceptable, this is the foundation step.

**Consequence**:
- Build scripts (`next dev`, `next build`, `next start`) are npm commands.
- `package.json` `packageManager` field intentionally omitted; pnpm migration is a single later PR.
- CI workflow (when added) will use `npm ci`.

---

## D-014 — Using the existing `portfolio.svg` (recolored) as the hero portrait

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §3, §12

**Decision**: Use the vtracer-traced `public/portfolio.svg` on the hero. Recolor toward the blue/black/white palette via a CSS `saturate(0.15) contrast(1.05)` filter plus a blue linear-gradient overlay.

**Why**:
- vtracer output already has realistic face proportions and 56KB size is acceptable for v1.
- Building a hand-crafted geometric portrait is a v2 polish task.
- Recolor via filter keeps the asset untouched and reversible.

**Alternatives considered**:
- Hand-built geometric portrait (per `PLAN.md` §3) — deferred to v2.
- Plain photograph — not v1; would require image processing + optimization.
- No portrait at all — weakens the hero.

**Consequence**:
- `public/portfolio.svg` is committed; replacing it later is a one-line swap in `VectorPortrait.tsx`.
- The recolor CSS lives on the wrapper, not the asset, so a v2 portrait can drop in with zero filter overhead.

---

## D-015 — React 18.3.1 instead of React 19 (peer dep compatibility)

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §2

**Decision**: Pin React 18.3.1 + React DOM 18.3.1 in `package.json`. Do not use React 19 RC.

**Why**:
- `motion` (formerly framer-motion) 11.11.17 peer-deps `react@^18` and refuses to install against React 19 RC.
- Next.js 15 supports both React 18 and 19. Server Components, App Router, and all the features used here are identical on 18.3.1.
- Pinning exact minor versions avoids surprise breakage.

**Alternatives considered**:
- Force-install with `--legacy-peer-deps` — fragile, breaks on CI.
- Wait for `motion` to ship React 19 support — not in the user's interest for v1.
- Use `framer-motion` directly — `motion` is the same package, just the new name; same constraint.

**Consequence**:
- Server Actions are not available (React 19 feature). We don't need them — all data comes from YAML at build time.
- All other RSC + Server Component semantics are identical.

---

## D-016 — System font stack instead of Geist (next/font unavailability)

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §3, §10

**Decision**: Use a system font stack (`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...`) defined in `styles/tokens.css` as `--font-sans` and `--font-mono`. No `next/font` usage.

**Why**:
- `next/font/google` does not expose Geist (it's a Vercel/Geist registry font, not on Google Fonts).
- Bundling Geist from a local file requires shipping font binaries, which we don't have for v1.
- A system stack gives a clean, neutral look today and lets us drop in Geist later without API changes.

**Alternatives considered**:
- `next/font/local` with hand-downloaded Geist files — deferred until we have the binaries.
- `next/font/google` with Inter — works, but the plan specifies Geist.
- Web fonts from a CDN — violates security baseline (no third-party scripts/fonts).

**Consequence**:
- The `@theme` mapping in `globals.css` references `--font-sans` / `--font-mono`; switching to Geist later is a single `@font-face` + token swap.

---

## D-017 — Placeholder PDFs hand-built without external deps

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §10

**Decision**: The two CV placeholder PDFs in `public/media/cv/` are hand-built minimal PDFs (~720 bytes each) written directly in PDF syntax. No `pdfkit` or other PDF library added.

**Why**:
- Both `/cv/academic` and `/cv/professional` routes need a real, valid PDF response or the routes 404.
- Adding `pdfkit` (~2MB) for a placeholder is wasteful.
- A hand-written minimal PDF is the smallest possible solution and the user can replace these files with real CVs without any code change.

**Alternatives considered**:
- Use `pdfkit` — overkill for placeholders.
- Generate via a `scripts/gen-placeholder-pdf.mjs` — possible, but the script + the binary output is more code than the bytes themselves.
- Skip the redirect until real CVs exist — routes 404, breaks the nav links.

**Consequence**:
- The placeholder PDFs must be replaced with real CVs before going live.
- `public/media/cv/README.md` carries a `TODO` reminder.

---

## D-018 — Research projects live in a single array, not one file per project

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §35, §54

**Decision**: Research projects are stored as a single array in `content/academic/research-projects.yaml`, validated against `ResearchProjectSchema`. The file is read by `getResearchProjects()` and `getResearchProject(slug)` in `lib/content.ts`. This sits alongside `content/academic/research.yaml`, which holds the research *profile* (interests, methods) under a different schema (`ResearchSchema`).

**Why**:
- The existing `ResearchSchema` (profile) and `ResearchProjectSchema` (per-project) serve different roles and shouldn't be conflated.
- A single array mirrors `industry/projects.yaml` and gives one editing surface for case-study content.
- `generateStaticParams` on `app/academic/research/[slug]/page.tsx` reads one file and ships one route per entry — no filesystem walking, no slug discovery logic.

**Alternatives considered**:
- One file per project under `content/academic/research/<slug>.yaml` — more granular diffs but more files to maintain and a glob-walk loader we'd have to write.
- Co-locate inside `research.yaml` — would require a discriminated union schema mixing profile + per-project fields; gets messy as soon as we have more than one project.

**Consequence**:
- Adding a research project = one entry in `research-projects.yaml`. The detail route appears automatically on the next build.
- `research.yaml` stays lean (profile + interests + methods) — no risk of a project entry sneaking into the wrong file.

---

## D-019 — Landing page adopts a bento grid + blueprint overlay; contact form posts to /api/contact

**Date**: 2026-10-03
**Status**: Accepted
**Section in PLAN**: §13, §39, §56, §65

**Decision**:
- The landing page (`/`) is restructured into a **bento grid** — modular rectangular cards of varying sizes that fit together — with an optional grid-line blueprint background overlay, mono badge pills, and wireframe corner ticks. Industry and Academic pages stay linear.
- A real profile photo replaces the recolored `portfolio.svg` on the landing page About section. The SVG is retained at `public/portfolio.svg` for OG / future use.
- The landing page Contact section is a 3-field form (name, email, message) that **POSTs to `/api/contact`** — a Next.js route handler that validates and returns a `mailto:` URL. The client then sets `window.location.href` to that URL, opening the user's mail client with a pre-filled message. No third-party mail provider, no DB, no analytics.

**Why**:
- Bento + blueprint gives the landing page the "tech minimalist / digital cyber" identity the user asked for, while keeping `BentoCard` border / hover / radius rules consistent with the existing card language.
- A real photo is more honest than a recolored SVG traced from one. HEIC can't be served by Next/Image, so we commit converted JPG/WebP via `scripts/convert-heic.mjs` (ffmpeg → sharp).
- React 18.3.1 (D-015) means Server Actions aren't reliably available. A standard route handler stays inside the existing strict CSP (`form-action 'self' mailto:`) and ships zero new dependencies.

**Alternatives considered**:
- Form posts via Server Action (`"use server"`) — rejected: experimental on React 18.3.1.
- Form posts to a third-party mail service (Formspree, Resend) — rejected: violates D-005 (no third-party scripts/trackers in v1) and D-006 (strict CSP).
- mailto: form GET directly (no JS) — rejected: requires user mail client pre-configured; no validation feedback; harder to format multi-line messages with URL encoding.
- Photo used on Industry / Academic heroes too — rejected: per D-008, the signature visual element (portrait) is reserved for landing + OG; we keep it there.

**Consequence**:
- `BentoCard`, `BentoGrid`, `Badge`, `AboutPhoto`, `EducationTimeline`, `ContactForm` are landing-only — Industry / Academic pages still use `Container`, `Section`, `Grid`.
- `/api/contact` route handler must keep its server-side validation tight (name 1–80, email regex, message 1–2000) — never trust the client.
- The contact email comes from `content/shared/contact.yaml`. Until the user replaces the placeholder `hello@example.com`, the form will open a mail client addressed to that placeholder.
- HEIC conversion is a one-shot script, not part of the build. Re-running it overwrites the committed files.

---

## Template for new decisions

```markdown
## D-NNN — <short title>

**Date**: YYYY-MM-DD
**Status**: Proposed | Accepted | Superseded | Reversed
**Section in PLAN**: §X

**Decision**: <one-paragraph statement of the decision>

**Why**:
- <reason 1>
- <reason 2>

**Alternatives considered**:
- <option A> — <why rejected>
- <option B> — <why rejected>

**Consequence**:
- <what this means for future work>
```

---

## D-020 — `react-grab` is a dev-only CDN script (no npm dep, no prod bundle)

**Date**: 2026-10-05
**Status**: Accepted → Reversed (re-installed as dev-only CDN)
**Section in PLAN**: §6, §7

**Decision (initial)**: Removed `react-grab@0.2.0` and `components/dev/ReactGrab.tsx` from the build. Removed the `https://www.react-grab.com` allowance from `cspDev`.

**Decision (revised, 2026-10-05)**: Re-added `react-grab` as a `<Script>` tag in `app/layout.tsx`, gated by `process.env.NODE_ENV === "development"` and loading the official UMD bundle from `https://unpkg.com/react-grab@0.2.0/dist/index.global.js`. `cspDev` now allows `script-src` and `connect-src` from `https://unpkg.com`. No npm dep, no `package.json` entry, no `components/dev/` directory.

**Why**:
- The npm dep was the real cost: ~96 KB gz in every route's shared bundle, plus a 3rd-party CDN host in CSP. Loading the same UMD from unpkg as a script tag avoids both — Next.js's RSC build does not bundle `<Script src=...>` into JS chunks, so prod never ships it.
- The conditional `<Script>` is gated by `NODE_ENV` which is statically replaced at build time — even tree-shaking can't reach it because the literal is in JSX, not as a dynamic import.

**Alternatives considered**:
- Keep the npm install + dev-only conditional import — heavier (RSC still analyses it), more package.json churn.
- No inspector at all — debugging React tree state across nested clients gets harder as the site grows.

**Consequence**:
- Production build output is unchanged: no `react-grab` bytes, no `package.json` entry.
- Dev mode loads `react-grab` on every page (after first CDN cache hit). Useful for picking components in dev tools.
- The `cspDev` rule now allows `https://unpkg.com` for both `script-src` and `connect-src`; the prod CSP stays strict.

---

## D-021 — Bumped `next` 15.0.3 → 15.5.27 and `yaml` 2.6.0 → 2.9.1

**Date**: 2026-10-05
**Status**: Accepted
**Section in PLAN**: §6

**Decision**: Pinned `next@^15.5.27`, `eslint-config-next@^15.5.27`, and `yaml@^2.9.1` in `package.json` to address CVE advisories flagged by `npm audit`.

**Why**:
- `next@15.0.3` carried 30+ advisories including critical RCE on Windows hosts, cache poisoning, and SSRF in Server Actions.
- `yaml@2.6.0` had a moderate ReDoS / stack-overflow advisory.
- Both fixes are within the same major version (Next 15.x → 15.5.x), so no migration work is required.

**Alternatives considered**:
- `npm audit fix --force` (forces `next@16.3.8`) — Next 16 changes `fetch` caching defaults, deprecates Server Actions opt-in shape, and removes `dynamic = "force-dynamic"`-as-export. Not worth a multi-file migration for two transitive advisories left over (postcss, sharp).
- Stay on `15.0.3` — leaves 30 CVEs in production.

**Consequence**:
- Two remaining `npm audit` advisories (transitive `postcss`, `sharp`) are blocked behind a Next 16 upgrade. Recorded as an open question in the audit.
- `next lint` deprecation warning now appears; safe to ignore until the project migrates to the ESLint CLI.

---

## D-022 — CSP: `upgrade-insecure-requests` and `Cache-Control: no-store` on `/api/contact`

**Date**: 2026-10-05
**Status**: Accepted
**Section in PLAN**: §6

**Decision**: Added `upgrade-insecure-requests` to the production CSP. Added a per-route header block for `/api/contact` setting `Cache-Control: no-store` on every response.

**Why**:
- `upgrade-insecure-requests` is a defense-in-depth directive that upgrades any `http://` subresource to `https://`. Trivially safe given the repo uses no `http://` resources today.
- The contact-form API was missing `Cache-Control: no-store`, allowing intermediate caches (and reverse proxies in front of Vercel) to replay submissions or hold in-process rate-limit state in their cache.

**Alternatives considered**:
- Setting `no-store` globally on all responses — would defeat the `s-maxage=31536000, stale-while-revalidate=86400` cache hint that protects content routes.
- Adding `Vary` headers — overkill for a single-purpose endpoint.

**Consequence**:
- Browser will transparently upgrade any future `http://` link added by mistake.
- Contact form responses will never be cached.

---

## D-023 — `name` regex blocks SMTP header injection in contact form

**Date**: 2026-10-05
**Status**: Accepted
**Section in PLAN**: §12

**Decision**: Tightened the Zod schema for `name` in `lib/contact-schema.ts` to `^[\p{L}\p{N} .,'\-]{1,80}$u`. Header lines in `app/api/contact/route.ts` (`Subject`, `replyTo`) still interpolate `name` raw, so the regex is the defense.

**Why**:
- Nodemailer parses `replyTo: "${name} <${email}>"` and `subject: "Portfolio contact: ${name}"` with RFC 5322-style header parsing. A name like `"victim@x.com, real@kaif"` could inject header fields.
- Current Nodemailer (v10) is hardened against CRLF injection, but the risk against display headers (not routing) is real.
- Regex constrains to Unicode letters/numbers + a small punctuation set.

**Alternatives considered**:
- RFC 5322 quoted-string encoding of `name` — verbose, requires paired escaping in the HTML template.
- Stripping angle brackets only — too narrow; commas and colons are also dangerous.

**Consequence**:
- Display names with apostrophes, accents, and hyphens still pass.
- Names with `<`, `>`, `"`, `@`, `:`, `;`, `\n` will be rejected with a clear message.

---

## D-024 — Avatar.tsx and AvatarArt.tsx moved to `components/hero/`

**Date**: 2026-10-05
**Status**: Accepted
**Section in PLAN**: §0

**Decision**: Moved `Avatar.tsx` and `AvatarArt.tsx` from the repo root to `components/hero/`. Updated the import in `app/page.tsx:43` to `@/components/hero/Avatar`. Added `framer-motion@11.18.2` as an explicit dependency (previously pulled transitively via `motion`).

**Why**:
- skill_1 §0 limits new files to `app/ components/ content/ lib/ styles/ public/ scripts/ progress/`. The avatar lived at the repo root pre-dating the rule.
- `Avatar.tsx` imports from `framer-motion` directly; declaring it explicitly removes the fragility of relying on a transitive dep through `motion`.

**Alternatives considered**:
- Migrate `Avatar.tsx` to `motion/react` — touches bespoke animation logic (animation orchestration, intro choreography, breath loop). Out of scope for this audit.
- Leave at root and amend the SOP — root is a smell; one-time move is cleaner.

**Consequence**:
- Repo root no longer contains TSX.
- `framer-motion` is now a direct dep, so its future version changes are visible in `package.json` diffs instead of being absorbed by `motion`.

---

## D-025 — Upstash Redis rate limiter with in-process fallback

**Date**: 2026-10-05
**Status**: Accepted
**Section in PLAN**: §65

**Decision**: `app/api/contact/route.ts` now uses `@upstash/ratelimit` + `@upstash/redis` when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set, and falls back to a single-process sliding window otherwise. Limit: 5 submissions per hour.

**Why**:
- A pure in-memory limiter is unsafe in serverless: each cold start resets the window, and concurrent instances don't see each other's counters. An attacker could trigger 5×N submissions across N concurrent invocations.
- Upstash REST is HTTP, not TCP — works inside any serverless runtime, including Vercel functions, without connection-pool plumbing.
- The fallback keeps dev working without secrets and ensures prod never accidentally loses rate limiting if env vars are missing (fails open to the weaker bound, but never to "no limit at all").

**Alternatives considered**:
- Vercel KV (KV is the prior product; Upstash absorbed it) — same primitive; chose Upstash directly.
- Cloudflare Turnstile — better spam signal, but adds a JS widget and a 3rd-party domain to CSP. Out of scope for v1.
- Skip rate-limiting entirely — D-023 (header-injection) plus honeypot is not sufficient against an automated flooder.

**Consequence**:
- `.env.example` documents the two Upstash vars; without them, dev runs without network calls.
- `prefix: "kaif:contact"` namespaces the keys so future routes can share the Redis instance without colliding.
- Switching to a stricter limit (e.g., 10/min sliding) is one constructor argument away.

---

## D-026 — Static CV redirects via `next.config.ts`

**Date**: 2026-10-05
**Status**: Accepted
**Section in PLAN**: §54

**Decision**: The 4 CV routes (`/cv/academic`, `/cv/industry`, `/cv/professional`, `/cv/master`) are now declared as `redirects()` in `next.config.ts` (308 permanent) to `public/media/cv/*.pdf`. The previous `route.ts` handlers are deleted.

**Why**:
- A 308 is one static edge lookup — no JS bundle, no handler invocation, no cold start.
- The original `route.ts` files re-implemented `NextResponse.redirect` per route, all pointing to the same assets; the redirect list is the same thing in 4 lines.
- Static redirects can't accidentally leak secrets or run code on download — better security posture.

**Alternatives considered**:
- Keep `route.ts` handlers (e.g., to add `Cache-Control` or auth) — out of scope; the PDFs are public.
- Symlinks under `public/cv/` — works, but Next dev serves symlinks inconsistently on Windows; redirects are portable.

**Consequence**:
- `app/cv/{academic,industry,master}/route.ts` files deleted (were the previous dynamic handlers).
- Real CV PDFs must be placed at `public/media/cv/{academic,industry,master}-cv.pdf` (currently 1.3 KB placeholders generated by `scripts/build-placeholder-cvs.mjs` per D-017).

---

## D-027 — CV route rename to SOP-aligned paths

**Date**: 2026-10-05
**Status**: Accepted
**Section in PLAN**: §54

**Decision**: `/cv/master` → `/cv/academic`; `/cv/industry` keeps its name; a fourth route `/cv/professional` is added as a SOP-aligned synonym for `/cv/industry`. `app/cv/page.tsx` exposes 4 variants in a 4-column layout.

**Why**:
- `master` was the project term, but the SOP, recruiter email conventions, and ATS parsers all use `academic` for the research-track CV.
- `professional` covers general applications that don't fit either research or industry-specific framing; aliasing it to the industry CV keeps the route semantically distinct in links.
- 4 variants is the upper limit where the grid still reads as a menu (3 was too sparse, 5 forces a wrap).

**Alternatives considered**:
- Keep `master` and add a redirect — leaves the old name in commits and external links; renaming is cleaner.
- 3 variants only — drops the generalist case; many application forms explicitly ask for "CV, not resume".

**Consequence**:
- Anyone who had bookmarked `/cv/master` is auto-redirected to `/cv/academic` via D-026.
- The new `professional` variant reuses the same PDF; if the user wants a tailored general CV later, only the placeholder file changes.

---

## D-028 — Dev server uses webpack, not Turbopack

**Date**: 2026-10-05
**Status**: Accepted
**Section in PLAN**: §2

**Decision**: `package.json` `dev` script is now `next dev --webpack`. Production `build` still uses Turbopack (the Next 16 default).

**Why**:
- Turbopack's PostCSS worker subprocess crashes on this Windows host with `0xc0000142` (DLL init failure), preventing dev compilation of `globals.css`. The bug is environment-specific (Node 24 + Antimalware + UNC `\\?\` path prefix on `G:`).
- Production builds (which use a separate Rust binary for CSS transforms) succeed; the bug is dev-only.
- Webpack-based dev compiles CSS in-process — no worker fork, no crash. Build time is slightly slower, but dev compiles HMR CSS in <2 s.

**Alternatives considered**:
- Wait for Next 16.x Turbopack fix — Turbopack is the future; pinning webpack in dev is a known regression. Acceptable trade-off until the Windows worker fork is fixed upstream.
- Move `.next` cache to `C:` to avoid the UNC prefix — plausible, but moving build cache off the repo is invasive and doesn't help the `node` subprocess fork path.

**Consequence**:
- Dev startup takes ~650 ms (was ~2.4 s with Turbopack). Cold compiles are ~2× slower than Turbopack but well under 5 s for this app size.
- Revert to Turbopack when the Windows worker fork crash is resolved.

---

## D-029 — `--ease-out` token renamed to `--motion-ease` to escape Tailwind v4 utility collision

**Date**: 2026-10-05
**Status**: Accepted
**Section in PLAN**: §0

**Decision**: The CSS custom property `--ease-out: cubic-bezier(0.2, 0, 0, 1)` was renamed to `--motion-ease` in both `styles/tokens.css` and `app/globals.css`. The `@theme` block still exposes it under `--motion-ease: var(--motion-ease)`.

**Why**:
- Tailwind v4 ships a built-in `ease-out` utility that maps to `--ease-out: cubic-bezier(0, 0, 0.2, 1)`. When our `@theme { --ease-out: ... }` overrode that, Turbopack emitted a fallback arbitrary selector `.ease-\[var\(--ease-out\)\]` whose escaped form (`.ease-[var("])...</script>...`) collided with the streaming SSR HTML injection and caused a CSS parse error.
- Next 15.5 downgraded this to a warning; Next 16 + Turbopack promotes it to a hard 500.
- `--motion-ease` is unambiguous — the name carries "motion" so it can never collide with a built-in `ease-*` utility. The Tailwind `ease-out` class keeps its default curve (used for `transition-* ease-out`); the project just doesn't override it any more.

**Alternatives considered**:
- Keep `--ease-out` and add a PostCSS shim to suppress the arbitrary-class emission — fragile and upstream-dependent.
- Override `--ease-out` in a non-`@theme` block so Tailwind doesn't pick it up — works, but every consumer of the token has to know the override doesn't propagate through Tailwind utilities.

**Consequence**:
- No component-level changes — none of the components used `ease-[var(--motion-ease)]`; they all use the built-in `ease-out` class.
- The motion curve is now driven purely by `--motion-ease` in custom CSS (e.g., `@keyframes ... ease-in-out` uses the system default; keyframes that referenced the old token must be updated if they exist — verified none do).
```