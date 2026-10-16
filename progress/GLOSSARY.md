# Glossary

> **Purpose**: Define every domain term used in the repo, so a skill or a future agent doesn't have to re-derive them.
> **Last updated**: 2026-10-03
>
> Organize by domain. If a term is ambiguous, list the project's intended meaning.

---

## 1. Web / Frontend

### RSC — React Server Component
A React component that runs on the server only and ships zero JS to the browser. Default in this project (see `PLAN.md` §46).

### `"use client"`
A directive at the top of a file marking it as a Client Component (ships JS, can use `useState` / `useEffect` / browser APIs). Reserved for true interactivity (mobile menu, shape fields, contact form).

### SSG — Static Site Generation
HTML generated at build time and served from cache. The default rendering strategy for this site.

### ISR — Incremental Static Regeneration
HTML generated on-demand with a revalidation window. **Not used** in v1.

### SSR — Server-Side Rendering
HTML generated per request. **Not used** in v1.

### TTFB — Time to First Byte
Time from request start to first byte received. Target ≤ 200ms.

### LCP — Largest Contentful Paint
The render time of the largest visible content element. Target ≤ 1.5s.

### INP — Interaction to Next Paint
The time from user interaction to the next visual update. Target ≤ 100ms.

### CLS — Cumulative Layout Shift
How much visible content shifts during page load. Target ≤ 0.05.

### TBT — Total Blocking Time
Time the main thread is blocked during load. Target ≤ 100ms.

### CDN — Content Delivery Network
Edge servers that serve the site. Vercel provides this by default.

### WebP / AVIF
Modern image formats. WebP is the default here.

### `next/font`
Next.js's font loader that self-hosts fonts with no external request. Used for Geist + Geist Mono.

### `next/image`
Next.js's image component that handles WebP conversion, responsive `srcset`, lazy loading, and CLS-safe dimensions.

### Tailwind v4
The current major version of Tailwind CSS. CSS-variable theming is first-class.

### `cn()`
A helper combining `clsx` and `tailwind-merge`. Lives in `lib/utils.ts`. Used everywhere classes are composed.

### `motion`
The new name (2024+) for what was `framer-motion`. Used for ≤ 5 specific interactions only.

### `lucide-react`
Icon library. The only icon source.

### `zod`
TypeScript-first schema validator. Used to validate YAML at build time.

---

## 2. Accessibility (a11y)

### WCAG 2.2 AA
The accessibility standard we target. Required for body text contrast (≥ 4.5:1) and large text (≥ 3:1), keyboard navigation, focus indicators, etc.

### `prefers-reduced-motion`
A user OS preference that asks for minimal motion. We honor it in both CSS (`@media`) and JS (`useReducedMotion()`).

### Focus ring
The visible outline around the focused element. We use `focus-visible:ring-2 ring-blue ring-offset-2`.

### `aria-hidden="true"`
Marks an element as decorative so screen readers ignore it. All decorative SVGs must have this.

### Skip link
A link at the top of the page that lets keyboard users jump past navigation directly to `<main>`. Required.

---

## 3. Performance

### Bundle budget
The maximum JS size allowed for initial route. **≤ 90 KB gz**.

### rAF — `requestAnimationFrame`
The browser API for smooth 60fps updates. Used for mouse + scroll reactivity. One loop per page, never per element.

### Passive event listener
`addEventListener(..., { passive: true })`. Tells the listener we won't call `preventDefault`, allowing the browser to optimize scrolling.

### `will-change`
A CSS hint that an element will animate. Used sparingly, removed after the animation ends.

---

## 4. Security

### CSP — Content Security Policy
An HTTP header restricting what the browser is allowed to execute. Strict by default in this project.

### `'self'`
CSP keyword for "same origin". The default for `default-src`, `script-src`, `style-src`, etc.

### `'unsafe-inline'` / `'unsafe-eval'`
CSP relaxations we **do not use** for scripts. Tailwind injects style tags, so `'unsafe-inline'` is allowed only for `style-src`.

### HSTS — HTTP Strict Transport Security
Forces HTTPS. Sent with `max-age=63072000; includeSubDomains; preload`.

### X-Frame-Options
Clickjacking protection. We send `DENY`.

### COOP / CORP
Cross-Origin-Opener-Policy / Cross-Origin-Resource-Policy. Defense in depth.

### `onlyBuiltDependencies`
pnpm setting that blocks all package postinstall scripts unless explicitly opted in. We use it as a supply-chain hardening tool.

### SRI — Subresource Integrity
A hash-based check that a fetched script/CSS matches expected content. Not needed here (no third-party scripts).

### OWASP Top 10
The standard list of web app security risks. Our threat-model section maps each one to a mitigation in this repo (`skills/security` §14).

---

## 5. Stack / tooling

### pnpm
The package manager. Stricter and faster than npm.

### Vercel
Hosting + CDN + edge functions. Where the site is deployed.

### Geist / Geist Mono
The sans + mono font families. Self-hosted via `next/font`.

### TypeScript strict mode
`tsconfig.json` with `"strict": true`. All code uses strict TS.

---

## 6. Academic / domain (CMS, QML)

### CMS — Compact Muon Solenoid
A general-purpose particle detector at CERN's Large Hadron Collider. One of the two large experiments at the LHC.

### LHC — Large Hadron Collider
The 27 km particle accelerator at CERN.

### L1 — Level-1 trigger
The first, hardware-based filter of collision events in real time. Operates on a microsecond budget. Project relevance: QML trigger research.

### pT — Transverse momentum
The component of a particle's momentum perpendicular to the beam. `pT regression` means predicting this value.

### QML — Quantum Machine Learning
Machine learning models that use quantum circuits as part of their computation. Built on frameworks like PennyLane, Qiskit, Cirq.

### PennyLane
A Python library for QML by Xanadu. Supports PyTorch, TensorFlow, JAX backends.

### GNN — Graph Neural Network
A neural network architecture that operates on graph-structured data. Used in detector reconstruction.

### CMS Week
A periodic collaboration-wide meeting for the CMS experiment.

### arXiv
Open-access preprint archive. The destination for "Preprint" status papers.

### DOI — Digital Object Identifier
A persistent identifier for a published paper.

### Status vocabulary (locked)
- `Published` — formally accepted and appears in a journal/proceedings.
- `Accepted` — accepted but not yet published.
- `Under Review` — submitted, awaiting decision. **Not** "Published".
- `Preprint` — on arXiv or similar, not yet submitted or under review.

---

## 7. Design

### Editorial typography
Hides where typography drives layout (large display type, tight tracking, generous whitespace) rather than grids of cards. The vibe is *The New York Times Magazine* or *Linear's changelog*, not *a SaaS landing page*.

### Swiss design
A typographic / grid-first design tradition. Lots of whitespace, strong grid, restrained type, primary sans-serif. Inspirational reference for this site.

### Generous whitespace
Negative space is a feature, not waste. This site uses ~50% of any given layout as whitespace.

### Eyebrow
A small mono uppercase label above a section heading (e.g., `01 / RESEARCH`). Defines the section at a glance.

### Mono / sans pairing
Sans for UI and long-form text; mono for metadata, dates, technical IDs, and section labels. Always Geist + Geist Mono here.

### Signature
The single visual identifier that appears across the site. Here: **blue geometric shape system + vector portrait**. (See `PLAN.md` §62.)

### "AI slop"
A pejorative for design or copy that has the obvious fingerprints of an LLM having generated it (purple gradients, glassmorphism, "passionate", "leverage", etc.). Avoided per `skills/content-writing-no-ai-slop`.

---

## 8. Portfolio-specific terms

### Industry page
`/industry` — presents Kaif as a working professional (software + AI + data + client work). More energetic, more visual.

### Academic page
`/academic` — presents Kaif as a researcher (publications, thesis, conferences). More whitespace, calmer motion.

### Shared core
The set of facts (education, skills, certifications, languages, contact) that appears on both pages. Stored once in `content/shared/`, presented differently per context.

### Selected work
The 5–8 strongest projects. **Not** a complete GitHub dump. Quality over quantity.

### Case study
A long-form project page (`/industry/projects/[slug]`). Reserved for projects with a real story. Not every repo gets one.

### Confidential client
A client engagement we can describe by domain but not by name. Rendered with neutral copy (`Confidential Client / AI Engineering / 2026`).

---

## 9. Process

### Skill
A self-contained bundle of rules + patterns for a specific area of work. Loaded into a session when working on that area. See `skills/`.

### Second brain
This `progress/` folder. The persistent knowledge layer for the repo.

### Decision
A non-trivial call documented in `progress/DECISIONS.md` with rationale. Re-opening one should require a new decision entry that supersedes the old.

### Status
A point-in-time snapshot in `progress/STATUS.md` of done / next / blocked. Refreshed each session.

---

## 10. Acronym cheatsheet

| Acronym | Meaning                                            |
| ------- | -------------------------------------------------- |
| RSC     | React Server Component                             |
| SSG     | Static Site Generation                             |
| ISR     | Incremental Static Regeneration                    |
| LCP     | Largest Contentful Paint                           |
| INP     | Interaction to Next Paint                          |
| CLS     | Cumulative Layout Shift                            |
| TBT     | Total Blocking Time                                |
| CDN     | Content Delivery Network                           |
| CSP     | Content Security Policy                            |
| HSTS    | HTTP Strict Transport Security                     |
| COOP    | Cross-Origin-Opener-Policy                         |
| CORP    | Cross-Origin-Resource-Policy                       |
| SRI     | Subresource Integrity                              |
| CMS     | Compact Muon Solenoid                              |
| LHC     | Large Hadron Collider                              |
| L1      | Level-1 trigger                                    |
| pT      | Transverse momentum                                |
| QML     | Quantum Machine Learning                           |
| GNN     | Graph Neural Network                               |
| arXiv   | Open-access preprint archive                       |
| DOI     | Digital Object Identifier                          |
| WCAG    | Web Content Accessibility Guidelines               |
| a11y    | Accessibility                                      |
| rAF     | requestAnimationFrame                              |