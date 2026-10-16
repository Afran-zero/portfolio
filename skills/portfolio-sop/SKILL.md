---
name: portfolio-sop
description: Master Standard Operating Procedure (SOP) for the Kaif portfolio site (kaif.dev). Covers AI-readable content design, Google SEO surface, robots.txt and XML sitemap strategy, structured data (JSON-LD), metadata, content workflow, performance budgets, accessibility, security, analytics, and the release checklist. Load this skill BEFORE any content, SEO, schema, sitemap, robots, or routing change, and before a production deploy.
---

# Portfolio SOP — Master Standard Operating Procedure

This is the **master SOP** for the Kaif portfolio at `https://kaif.dev`. Every other skill (`super-fast-optimization`, `frontend`, `content-writing-no-ai-slop`, `security`, `2d-object-interactive`) inherits constraints from this file. If a rule here conflicts with a rule elsewhere, **this file wins**.

The goal is simple:

> Make `kaif.dev` the most legible, fastest, and most indexable personal portfolio on the internet — to **humans via Google**, to **LLMs via crawlers**, and to **assistive tech via semantics**.

Load this skill when:

- Creating, renaming, or removing a page/route.
- Editing `app/robots.ts`, `app/sitemap.ts`, or `public/robots.txt`.
- Adding or changing metadata (`generateMetadata`, `Metadata` objects).
- Adding or changing JSON-LD / structured data.
- Updating `person.yaml` (the canonical identity of the site).
- Running a production deploy.
- Doing a quarterly SEO or AI-discoverability audit.
- Anyone asks "how do I get this site found by Google / ChatGPT / Claude / Perplexity?".

---

## 0. The 30-second mental model

The portfolio has **one job**: convert a visitor (human or AI) into a clear understanding of *who Kaif is, what he has built, and how to reach him*. Everything in this SOP serves that job.

The site is **content-first, JS-light, server-rendered**. The next 12 sections are the operating manual.

| §  | Topic                          | Output that lives in the repo                       |
| -- | ------------------------------ | -------------------------------------------------- |
| 1  | Canonical identity             | `content/shared/person.yaml`                       |
| 2  | Routing & URL contract         | `app/**/page.tsx`                                  |
| 3  | Metadata (titles, descriptions) | `app/**/layout.tsx`, `app/**/page.tsx`            |
| 4  | Open Graph & Twitter cards     | `app/**/page.tsx`, `app/layout.tsx`                |
| 5  | JSON-LD / structured data      | `app/**/page.tsx` (or `<StructuredData />` comp)   |
| 6  | robots.txt                     | `app/robots.ts` → `/robots.txt`                    |
| 7  | XML sitemap                    | `app/sitemap.ts` → `/sitemap.xml`                  |
| 8  | Crawler-specific directives    | `app/robots.ts` (AI bots)                          |
| 9  | RSS / Atom feed                | `app/feed.xml/route.ts` (optional)                 |
| 10 | Performance budget             | `super-fast-optimization` skill                    |
| 11 | Accessibility & semantics       | `frontend` skill                                   |
| 12 | Security headers               | `next.config.ts`                                   |
| 13 | Content voice                  | `content-writing-no-ai-slop` skill                 |
| 14 | Release / deploy checklist     | This file, §15                                    |
| 15 | Quarterly audit                | This file, §16                                    |
| 16 | AI-search optimization (GEO)   | This file, §17                                    |

---

## 1. Canonical identity (single source of truth)

**Rule:** `content/shared/person.yaml` is the **only** file that defines Kaif's name, role, bio, and contact handles. Every other surface (metadata, JSON-LD, OG, sitemap, footer) **reads from this file at build time**. Never hard-code identity in a component, page, or schema.

Required fields (validated by `PersonSchema` in `lib/schemas.ts`):

- `name` — full legal/display name
- `short_name` — used in titles where length matters
- `role` — primary professional label (e.g. "AI Engineer & Researcher")
- `tagline` — ≤ 80 chars, no emoji, no fluff
- `bio` — 1–3 sentences, **voice rules in §13**
- `location` — city, country
- `pronouns` — optional
- `portrait_path` — absolute path under `/public`

**When you change identity:** run `npm run typecheck` (Zod will catch it) and re-run the release checklist in §15.

---

## 2. Routing & URL contract

The portfolio is intentionally flat. Do not nest routes deeper than 2 levels.

```
/                  → home (hero + at-a-glance)
/industry          → industry experience
/academic          → academic experience
/contact           → contact info + form
/cv/academic       → downloadable academic CV
/cv/professional   → downloadable professional CV
```

**Rules:**

- `trailingSlash: false` (already set in `next.config.ts`).
- Lowercase, hyphenated, semantic. No IDs in URLs.
- A route that does not exist must 404 with the custom `app/not-found.tsx` (already present).
- Every public route **must** appear in `app/sitemap.ts`.

---

## 3. Metadata — titles & descriptions

Each page exports `generateMetadata()` (or a static `metadata` object). The root layout in `app/layout.tsx` already provides a `title.template` of `"%s — Md Kaif Afran Khan"`, so **child pages only set the prefix**.

**Title rules:**

- Length: **50–60 chars** total after the template is applied.
- Front-load the entity. The first word of every title should be the page's primary noun ("Projects", "Industry", "Academic", "Contact").
- One title per page. Never two `|`s, never `—` in the prefix.

**Description rules:**

- Length: **140–160 chars**.
- Must contain the primary entity (name) and the page's primary intent.
- Must be **unique per route** — do not duplicate the home description.

**Canonical URL:** every page sets `alternates.canonical` to its absolute URL. Next.js does not do this automatically.

```ts
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Industry",
    description:
      "Industry experience of Md Kaif Afran Khan — AI engineering, full-stack, and data work shipped in production.",
    alternates: { canonical: "https://kaif.dev/industry" },
    openGraph: { /* §4 */ },
  };
}
```

---

## 4. Open Graph & Twitter cards

Set OG and Twitter on **every** page. Use Next's `Metadata` API.

**Required fields per page:**

- `openGraph.title` — ≤ 60 chars
- `openGraph.description` — ≤ 160 chars
- `openGraph.url` — absolute canonical
- `openGraph.siteName` — `"Kaif — AI Engineer & Researcher"`
- `openGraph.locale` — `"en_US"`
- `openGraph.type` — `"website"` for most pages, `"profile"` on `/contact`
- `openGraph.images` — array, **1200×630 PNG or WebP**, ≤ 200 KB
- `twitter.card` — `"summary_large_image"`
- `twitter.title`, `twitter.description`, `twitter.images` — mirror OG

The home `og:image` lives at `/og/home.png`. Each route can override with `/og/<route>.png`. If a route has no custom image, fall back to home OG. Never serve a missing image — return 404 instead, so social previews look right.

---

## 5. Structured data (JSON-LD)

JSON-LD is what makes the site **legible to AI**. Every public page emits a `<script type="application/ld+json">` block with at least one schema.

| Route              | Schema.org type(s)                              |
| ------------------ | ----------------------------------------------- |
| `/`                | `Person` + `WebSite`                            |
| `/industry`        | `Person` + `ItemList` of `Role`                 |
| `/academic`        | `Person` + `ItemList` of `EducationalOccupationalProgram` |
| `/contact`         | `Person` (with `contactPoint`)                  |
| `/cv/academic`     | `Person` + `EducationalOccupationalCredential`  |
| `/cv/professional` | `Person` + `Resume` (custom-ish via `Person`)   |

**Implementation pattern** — a single component, server-rendered, no client JS:

```tsx
// components/seo/StructuredData.tsx
export function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

**Rules:**

- All `url` values in JSON-LD must be **absolute** (start with `https://kaif.dev/...`).
- All `@id` values are absolute.
- `dateModified` on the home `WebSite` must equal today's `sitemap` `lastModified`.
- Never include PII beyond what's already in `person.yaml`.
- **Validate** every schema with https://validator.schema.org before deploy.

---

## 6. robots.txt

Implemented via `app/robots.ts` (Next.js Metadata Route). The current file is the **minimum viable** version; the **advanced** template lives in `skills/portfolio-sop/templates/robots.ts` and adds explicit AI-bot directives (see §8).

**Hard rules:**

1. `Sitemap:` line must point to `https://kaif.dev/sitemap.xml` (absolute, https).
2. The default rule allows `/`. There is **no** blanket `Disallow:`.
3. Block only paths that should never be indexed:
   - `/api/*` (private endpoints)
   - `/_next/*` (build artifacts)
4. Do **not** block `/og/` or `/media/` — those are the OG images.

---

## 7. XML sitemap

Implemented via `app/sitemap.ts`. Advanced version lives in `skills/portfolio-sop/templates/sitemap.ts`.

**Per-entry rules:**

| Field            | Rule                                                    |
| ---------------- | ------------------------------------------------------- |
| `url`            | Absolute, https, no trailing slash                      |
| `lastModified`   | ISO 8601 in UTC, equals the page's content `updated`    |
| `changeFrequency` | `daily` (none), `weekly` (none), `monthly` (most), `yearly` (`/contact`) |
| `priority`       | `1.0` for `/`, `0.8` for content pages, `0.5` for utility |

- Never include 404, redirect, or noindex pages.
- If you add a route, you **must** add a sitemap entry in the same PR.
- If a route is removed, remove its entry in the same PR.

---

## 8. Crawler-specific directives (the AI layer)

This is the **non-obvious** part: in 2026, a meaningful share of "traffic" comes from LLM crawlers indexing the site so ChatGPT, Claude, Perplexity, Gemini, and Copilot can cite it. We **want** these crawlers. We also want to keep server load sane.

Update `app/robots.ts` so it explicitly allows (or rate-limits) the following user-agents. Template in `templates/robots.ts`.

**Allow fully (no throttling needed; site is small):**

- `Googlebot` — Google search
- `Google-Extended` — Gemini / Vertex AI training & grounding
- `Bingbot` — Bing + Copilot
- `DuckDuckBot` — DDG + AI snippets
- `Slurp` — Yahoo
- `Baiduspider`, `YandexBot` — international discovery
- `GPTBot` — OpenAI training crawl
- `OAI-SearchBot` — OpenAI Search / ChatGPT browse
- `ChatGPT-User` — on-demand ChatGPT fetch
- `ClaudeBot` — Anthropic training crawl
- `Claude-SearchBot` — Anthropic on-demand fetch
- `Claude-User` — Claude.ai browse
- `PerplexityBot` — Perplexity index
- `Perplexity-User` — Perplexity on-demand fetch
- `Applebot-Extended` — Apple Intelligence grounding
- `Amazonbot` — Alexa / Rufus
- `cohere-ai` — Cohere training
- `cohere-training-data-crawler` — Cohere training (alt UA)
- `YouBot` — You.com
- `Diffbot` — entity graph
- `FacebookBot`, `Twitterbot`, `LinkedInBot` — social previews
- `CCBot` — Common Crawl (used by many LLM datasets)

**Disallow (no reason for these on a personal site):**

- `AhrefsBot`, `SemrushBot`, `MJ12bot`, `DotBot` — SEO scrapers
- `BLEXBot`, `DataForSeoBot` — SEO scrapers
- `GPTBot` *training opt-out* is intentionally **not** set — we want inclusion.

**Verifying inclusion:** after each release, submit the home URL to:
- Google Search Console → URL Inspection → Request Indexing
- Bing Webmaster Tools → Submit URLs
- (Optionally) `https://oai-sitemap.xml` for OpenAI Sitemap submission

---

## 9. RSS / Atom feed (optional but recommended)

A feed at `/feed.xml` helps LLM crawlers that prefer feed-shaped data. Template in `templates/feed.xml.ts` (a Next.js route handler that returns an Atom 1.0 XML document with the last 20 content items).

If the site is too static to justify a feed, **skip this**. But if you do, declare it in the HTML `<head>`:

```html
<link rel="alternate" type="application/atom+xml" title="Kaif" href="/feed.xml" />
```

---

## 10. Performance budget

Defer to `super-fast-optimization`. The relevant targets from a discoverability standpoint:

- **LCP ≤ 1.5s** mobile — Google ranking factor.
- **TTFB ≤ 200ms** — Vercel edge. Bing and Google both use TTFB as a quality signal.
- **CLS ≤ 0.05** — Core Web Vitals.
- **Total page weight ≤ 1.5 MB** — keeps crawl budget healthy.
- **Zero third-party requests** on first paint.

> A fast site gets crawled more deeply. Crawl budget is real.

---

## 11. Accessibility & semantics

Defer to `frontend`. Discoverability rules that overlap with a11y:

- Every page has exactly one `<h1>`. Headings are sequential.
- Every interactive element is a real `<button>` or `<a>`, not a `<div>`.
- Every image has `alt`. Decorative images use `alt=""`.
- `<html lang="en">` is set in the root layout.
- Color contrast ≥ 4.5:1 for body text.
- Skip-to-content link is present (already wired via `SkipToContent`).

These are not "nice to have" — they are **how Googlebot understands page structure** and **how screen-reader-using humans reach you**.

---

## 12. Security headers

`next.config.ts` already sets:

- `Content-Security-Policy` (no inline scripts, no foreign origins)
- `Strict-Transport-Security` with `preload`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` denying camera/mic/geo/payment/usb

**Rules:**

- Never add a third-party script. If you must, update CSP and document why in the PR.
- HSTS is preloaded — do not relax it.
- A `Content-Security-Policy-Report-Only` header can be added in staging, never in prod.

---

## 13. Content voice

Defer to `content-writing-no-ai-slop`. The portfolio's content voice in one line:

> **Specific, direct, calm.** Show the artifact, the metric, the result. No hype, no "passionate", no "leveraging synergies", no emoji, no exclamation marks.

Every paragraph must answer *"what did you actually do, with what, and what changed?"* before it answers anything else.

---

## 14. Discoverability checklist (per-page)

Run this **before opening a PR** for any new or edited page:

- [ ] `generateMetadata` (or static `metadata`) exports a unique `title` and `description`.
- [ ] `alternates.canonical` is set to the absolute URL.
- [ ] `openGraph` and `twitter` blocks are filled in (title, description, url, images, type).
- [ ] At least one JSON-LD schema is emitted via `<StructuredData />`.
- [ ] The route is listed in `app/sitemap.ts` with correct `lastModified`, `changeFrequency`, `priority`.
- [ ] Exactly one `<h1>` exists in the rendered HTML.
- [ ] All images have `alt` (or empty `alt=""` if decorative).
- [ ] No external script tags, no `dangerouslySetInnerHTML` outside the JSON-LD block.
- [ ] Lighthouse mobile: Performance ≥ 95, SEO ≥ 95, A11y ≥ 95.
- [ ] `npx next build` succeeds; sitemap.xml and robots.txt are reachable at the expected URLs.

---

## 15. Release / deploy checklist

Before `git push` to `main`:

1. [ ] `npm run typecheck` — Zod must pass for every YAML.
2. [ ] `npm run lint` — no errors.
3. [ ] `npm run build` — no warnings about metadata, image sizes, or missing alt.
4. [ ] `curl https://kaif.dev/robots.txt` — sitemap line present.
5. [ ] `curl https://kaif.dev/sitemap.xml` — every route present, valid XML.
6. [ ] `curl https://kaif.dev/` — JSON-LD present in `<head>` or top of `<body>`, validated at validator.schema.org.
7. [ ] Lighthouse mobile run on `/`, `/industry`, `/academic`, `/contact` — all targets met.
8. [ ] Open Graph debugger: https://www.opengraph.xyz/ → preview the home card.
9. [ ] Twitter card validator: https://cards-dev.twitter.com/validator.
10. [ ] Google Search Console → URL Inspection → Request Indexing for the home page.
11. [ ] (Optional) Submit the sitemap in Bing Webmaster Tools.

After deploy:

- [ ] Watch Vercel logs for 5 minutes for 4xx/5xx.
- [ ] Confirm `/_next/static/*` returns 200 (immutable cache).
- [ ] Confirm HSTS header is present.

---

## 16. Quarterly audit

Once per quarter, run:

1. **Google Search Console → Performance** — review queries, CTR, average position. Note any page with impressions but no clicks → fix title/description.
2. **Coverage → Excluded** — find any accidentally noindexed URLs. Fix.
3. **Bing Webmaster Tools** — same as above.
4. **Schema validator** — re-validate every JSON-LD block. Schema.org is versioned and breaks.
5. **LLM citation check** — search in ChatGPT, Claude, Perplexity, Gemini for: "Md Kaif Afran Khan", "kaif.dev", "Kaif AI engineer". Record what is cited and what is not. Adjust content to fill gaps.
6. **Lighthouse CI** — re-run, fail the audit if any target drops.
7. **Sitemap hygiene** — every URL still 200s. Remove any 301/404.
8. **robots.txt** — re-validate the AI-bot list against https://darkvisitors.com/agents. New agents appear regularly.
9. **Dependency audit** — `npm audit --omit=dev`. Patch high/critical.

Record the result in `progress/seo-quarterly.md`.

---

## 17. AI-search optimization (GEO — Generative Engine Optimization)

GEO is to 2026 what SEO was to 2010. The rules below are derived from published research and observed behavior of major answer engines.

### 17.1 What answer engines want

Answer engines rank sources by:

1. **Entity clarity** — can the model answer "who is this person, what do they do, where are they, how to reach them" from the page alone? → Use `Person` JSON-LD, fill every field, link to sameAs profiles (GitHub, LinkedIn, ORCID, Google Scholar).
2. **Citable claims** — each paragraph should be a discrete, self-contained, factual sentence that can be lifted without context.
3. **Structured facts** — dates, numbers, names, and links should be in lists or tables, not buried in prose.
4. **Recency** — `lastModified` and `datePublished` must be honest. Fresh content is preferred for non-evergreen queries.
5. **Authority** — links from reputable sources (arXiv, GitHub, ORCID, university pages) amplify trust.

### 17.2 sameAs — the entity graph

In the home `Person` JSON-LD, add a `sameAs` array of absolute URLs to authoritative profiles:

```json
{
  "@type": "Person",
  "name": "Md Kaif Afran Khan",
  "url": "https://kaif.dev/",
  "sameAs": [
    "https://github.com/kaif",
    "https://www.linkedin.com/in/kaif",
    "https://orcid.org/0000-0000-0000-0000",
    "https://scholar.google.com/citations?user=XXXX",
    "https://arxiv.org/a/khan_m_1"
  ]
}
```

These are the strongest trust signals. **Fill them out as fully as you can.**

### 17.3 Page-level GEO rules

- **Each page answers one question.** The page's `<h1>` should be a question or a noun phrase, not a marketing line.
- **First 100 words** contain the entity name, the page intent, and one concrete fact.
- **Tables for facts.** A row in a table is citable; a sentence in a paragraph often is not.
- **No jargon without a gloss.** Define acronyms on first use. Models and humans both do better.
- **Cite primary sources.** If you claim an arXiv paper, link the abs URL. If you claim a benchmark, link the leaderboard.
- **No AI slop.** Models are *trained* to downweight text that looks like it was generated by other models. The `content-writing-no-ai-slop` skill is the operating manual here.

### 17.4 What to avoid

- Walls of text without structure (no headings, no lists).
- "About me" paragraphs with no concrete artifacts.
- A "Skills" section that is just a tag cloud.
- Hidden content (CSS-hidden, `display:none`, `tabindex=-1` used to game ranking).
- `noarchive` on pages you actually want cited.
- PDFs that aren't also served as HTML.

### 17.5 Files and routes that GEO will not see

A crawler that respects `robots.txt` will not see:

- Anything blocked by `robots.txt` (see §6, §8).
- Anything behind auth.
- Anything that requires JS to render (this site is server-rendered, so this is fine — but never introduce a client-only route).
- Anything reachable only via internal `<a>` that isn't in the sitemap (the sitemap is your *promise* to crawlers; if it's not there, treat it as low priority).

---

## 18. Templates

The following ready-to-use files live in `skills/portfolio-sop/templates/`:

- `templates/robots.ts` — advanced robots.ts with full AI-bot directives.
- `templates/sitemap.ts` — advanced sitemap.ts with proper priorities and lastModified.
- `templates/StructuredData.tsx` — server component for JSON-LD.
- `templates/person-jsonld.ts` — typed factory for the `Person` schema.
- `templates/feed.xml.ts` — Atom 1.0 feed route handler.
- `templates/audit-checklist.md` — the §15 checklist as a standalone file.

Copy a template, edit it, drop it into the repo at the path indicated in the template's header comment.

---

## 19. When something goes wrong

| Symptom                                              | First thing to check                                  |
| ---------------------------------------------------- | ----------------------------------------------------- |
| Google Search Console shows 0 impressions            | `robots.txt` is blocking Googlebot. Check `/robots.txt`. |
| `sitemap.xml` is missing routes                      | `app/sitemap.ts` doesn't list them. Add an entry.    |
| OG image is wrong on Twitter                         | `og:image` is absolute https and the image is ≥ 1200×630. |
| LinkedIn preview shows the wrong title               | LinkedIn caches aggressively — use the Post Inspector to flush. |
| ChatGPT says "I don't have info on this person"      | JSON-LD `Person` is missing or `sameAs` is empty.    |
| Lighthouse SEO score dropped                         | Missing `alt`, missing `<title>`, missing meta description, or blocking `/_next/` from indexing. |
| 404 in Vercel logs for `/sitemap.xml`                | Next.js didn't pick up the Metadata Route. Confirm the file is `app/sitemap.ts`. |

---

## 20. Definitions

- **SEO** — Search Engine Optimization. Optimizing for Google/Bing/DDG.
- **GEO** — Generative Engine Optimization. Optimizing for ChatGPT, Claude, Perplexity, Gemini, Copilot.
- **Crawler** — any user-agent listed in `robots.txt`. Includes search bots and AI training bots.
- **Crawl budget** — the number of pages a search engine will fetch from your site in a given window. Fast, small sites get crawled more deeply.
- **JSON-LD** — JavaScript Object Notation for Linked Data. The format Google recommends for structured data.
- **OG** — Open Graph. The metadata protocol Facebook invented; now used by every social platform.
- **Sitemap** — an XML file listing every public URL on a site, with metadata.
- **robots.txt** — a text file at the site root that tells crawlers what they may and may not fetch.

---

*This file is the SOP. When in doubt, follow this file. When this file is wrong, fix this file in the same PR that fixes the bug.*
