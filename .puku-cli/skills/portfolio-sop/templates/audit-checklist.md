# Portfolio SEO / GEO / Performance Audit Checklist

> Companion to `skills/portfolio-sop/SKILL.md` §15–§16. Print this and tick boxes.

## Per-page checklist (run on every page that ships)

### Metadata

- [ ] `title` is 50–60 chars total after template applied
- [ ] `description` is 140–160 chars
- [ ] `description` is unique vs. every other route
- [ ] `alternates.canonical` is set to absolute URL
- [ ] `openGraph.title`, `description`, `url`, `siteName`, `locale`, `type`, `images` all set
- [ ] `twitter.card: "summary_large_image"` set
- [ ] `twitter.title`, `description`, `images` mirror OG
- [ ] `og:image` exists at the path declared, is 1200×630, ≤ 200 KB

### Structured data (JSON-LD)

- [ ] At least one schema.org type emitted via `<StructuredData />`
- [ ] All `url` and `@id` values are absolute (https://kaif.dev/…)
- [ ] `Person` schema has `name`, `jobTitle`, `url`, `image`, `sameAs` (filled in)
- [ ] `WebSite` schema on home has `inLanguage`, `author`, `url`
- [ ] Validated at https://validator.schema.org with zero errors

### Semantics / A11y

- [ ] Exactly one `<h1>` in the rendered HTML
- [ ] Heading order is sequential (h1 → h2 → h3 …)
- [ ] Every interactive element is a `<button>` or `<a>`
- [ ] Every `<img>` has `alt` (or empty `alt=""` if decorative)
- [ ] Color contrast ≥ 4.5:1 for body text
- [ ] Skip-to-content link works
- [ ] `<html lang="en">` present

### Performance

- [ ] Lighthouse mobile Performance ≥ 95
- [ ] Lighthouse mobile SEO ≥ 95
- [ ] Lighthouse mobile A11y ≥ 95
- [ ] Lighthouse mobile Best Practices ≥ 95
- [ ] LCP ≤ 1.5s on Slow 4G throttling
- [ ] CLS ≤ 0.05
- [ ] INP ≤ 100ms
- [ ] Initial JS payload ≤ 90 KB gzipped
- [ ] No third-party requests on first paint

### Security

- [ ] CSP header present (no `unsafe-eval`, no foreign script origins)
- [ ] HSTS header with `max-age=63072000; includeSubDomains; preload`
- [ ] `X-Frame-Options: DENY` present
- [ ] No external scripts
- [ ] No `dangerouslySetInnerHTML` outside JSON-LD

### Crawler surface

- [ ] Route listed in `app/sitemap.ts` with correct `lastModified`, `changeFrequency`, `priority`
- [ ] `/robots.txt` declares this route as `Allow: /`
- [ ] If a route is removed, its sitemap entry is also removed
- [ ] No 404 or redirect URLs in the sitemap

## Pre-deploy checklist

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds with zero metadata/image warnings
- [ ] `curl https://kaif.dev/robots.txt` — sitemap line present, AI bots allowed
- [ ] `curl https://kaif.dev/sitemap.xml` — every route present, valid XML
- [ ] `curl -I https://kaif.dev/` — security headers present
- [ ] OG debugger (opengraph.xyz) preview OK for `/`, `/industry`, `/academic`, `/contact`
- [ ] Twitter card validator OK
- [ ] Schema validator OK on every JSON-LD block

## Post-deploy checklist

- [ ] Vercel logs clean for 5 minutes
- [ ] `/_next/static/*` returns 200 with immutable cache
- [ ] HSTS header visible
- [ ] Google Search Console → Request Indexing for `/`
- [ ] (Optional) Bing Webmaster Tools → Submit sitemap

## Quarterly audit checklist

- [ ] Google Search Console Performance reviewed (queries, CTR, position)
- [ ] Coverage → Excluded reviewed (no accidental noindex)
- [ ] Bing Webmaster Tools reviewed
- [ ] Schema validator re-run on every JSON-LD block
- [ ] LLM citation check: ChatGPT, Claude, Perplexity, Gemini for "Md Kaif Afran Khan"
- [ ] Lighthouse CI on every route
- [ ] Sitemap hygiene — every URL still 200
- [ ] robots.txt AI-bot list vs. https://darkvisitors.com/agents
- [ ] `npm audit --omit=dev` — patch high/critical
- [ ] Record results in `progress/seo-quarterly.md`