# OG / social-share images

These static 1200×630 PNGs are used as the Open Graph / Twitter card images for the site.

## Files

| File | Used by | Eyebrow | Headline |
| --- | --- | --- | --- |
| `home.png` | `/`, all routes that don't override | `01 / PORTFOLIO` | Md Kaif Afran Khan |
| `industry.png` | `/industry` | `01 / INDUSTRY` | INDUSTRY |
| `academic.png` | `/academic` | `02 / ACADEMIC` | ACADEMIA |
| `contact.png` | `/contact` | `03 / CONTACT` | CONTACT |

The default is `home.png`. Routes that want a different image pass `images: ['/og/<route>.png']` in `buildPageMetadata` (see `lib/seo/page-metadata.ts`).

## Spec

- Format: PNG
- Dimensions: 1200 × 630
- Max size: 200 KB (per skills/portfolio-sop §4)
- Background: white (`#FFFFFF`)
- Accent: blue (`#1769FF`)
- Text: fg `#111111`, muted `#667085`
- Subtle 24px blueprint grid overlay

## Regenerating

The script `progress/.gen-og.js` (in the repo, not committed at runtime) renders these via SVG → sharp. To regenerate after content changes:

```bash
node progress/.gen-og.js
```

The script reads `content/shared/person.yaml` (indirectly, via the design tokens used in `styles/tokens.css`) — if you change brand colors, edit the hex literals in the SVG and rerun.

## Why static, not dynamic

The earlier `opengraph-image.tsx` route used `next/og` (`@vercel/og`) to render these at request time. That library has a known Windows bug: `fileURLToPath` produces an invalid path like `.\file:\G:\...` when loading its bundled font, crashing the route with `ERR_INVALID_URL`. Static PNGs avoid the runtime entirely.

If you ever want dynamic OG images again, options are:
- Use Next.js 15.1+ (the bundled `@vercel/og` was patched in 15.1)
- Or use `@vercel/og` directly with an explicit font loaded from a path you control (e.g., `public/fonts/*.ttf`)
- Or use a different library (e.g., `og-img`)

For now, the static files are leaner, faster, cacheable, and never break.