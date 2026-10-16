/**
 * scripts/generate-og-images.mjs
 *
 * Generates the OG images used by /opengraph-image, /industry/opengraph-image,
 * /academic/opengraph-image, /contact/opengraph-image as static PNGs.
 *
 * Why this exists: `next/og` (ImageResponse) ships with a pre-bundled font
 * that fails to load via fileURLToPath on Windows when next@15.0.3 prerenders
 * the opengraph-image routes, producing "TypeError: Invalid URL". Static PNGs
 * sidestep the issue entirely — they ship at the edge and render identically.
 *
 * Re-run any time the copy or layout changes:
 *   node scripts/generate-og-images.mjs
 *
 * Output:
 *   public/og/home.png
 *   public/og/industry.png
 *   public/og/academic.png
 *   public/og/contact.png
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

import sharp from "sharp";
import { parse as parseYaml } from "yaml";

const ROOT = path.resolve(process.cwd());
const OUT = path.join(ROOT, "public", "og");
const PERSON_YAML = path.join(ROOT, "content", "shared", "person.yaml");

// Use a system font that is reliably present on the build environment.
// Windows contributors: Arial. Linux/macOS contributors: install Inter or
// substitute your own — the layout/colors stay the same.
const FONT_CANDIDATES = [
  "C:/Windows/Fonts/arial.ttf",
  "C:/Windows/Fonts/arialbd.ttf",
  "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
  "/System/Library/Fonts/Helvetica.ttc",
];

async function findFont() {
  for (const p of FONT_CANDIDATES) {
    if (existsSync(p)) return p;
  }
  throw new Error(
    `No font found. Tried: ${FONT_CANDIDATES.join(", ")}. Add your own.`,
  );
}

async function loadPerson() {
  const raw = await readFile(PERSON_YAML, "utf8");
  return parseYaml(raw);
}

/**
 * Build the SVG for an OG card, then rasterize to a 1200x630 PNG with sharp.
 *
 * @param {object} opts
 * @param {string} opts.eyebrow   "01 / PORTFOLIO"
 * @param {string} opts.title     "Md Kaif Afran Khan" or "INDUSTRY"
 * @param {string} opts.subtitle  Role / tagline
 * @param {string} opts.url       "kaif.dev/industry"
 * @param {string} opts.fontPath  absolute path to a TTF
 */
async function renderOg({ eyebrow, title, subtitle, url, fontPath }) {
  const fontData = await readFile(fontPath);
  const fontB64 = fontData.toString("base64");
  const fontFamily = "OGFont";

  // All sizes/positions tuned to look balanced at 1200x630. Colors come from
  // styles/tokens.css: --blue #1769FF, --fg #111111, --fg-muted #667085.
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      @font-face {
        font-family: "${fontFamily}";
        src: url("data:font/ttf;base64,${fontB64}") format("truetype");
        font-weight: 700;
      }
      .root { font-family: "${fontFamily}", Arial, sans-serif; fill: #111111; }
    </style>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(23,105,255,0.10)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- White background -->
  <rect width="1200" height="630" fill="#FFFFFF"/>

  <!-- Blueprint grid overlay -->
  <rect width="1200" height="630" fill="url(#grid)"/>

  <!-- Blue accent rectangle, top-right (cropped by the edge) -->
  <rect x="960" y="-120" width="360" height="360" fill="#1769FF"/>

  <!-- Eyebrow + thin divider -->
  <g class="root">
    <text x="64" y="96" font-size="16" letter-spacing="3" fill="#1769FF">${escapeXml(eyebrow.toUpperCase())}</text>
    <line x1="280" y1="89" x2="1200" y2="89" stroke="rgba(23,105,255,0.25)" stroke-width="1"/>
  </g>

  <!-- Title (display) -->
  <g class="root">
    <text x="64" y="240" font-size="96" font-weight="700" letter-spacing="-3" fill="#111111">${escapeXml(title)}</text>
    <text x="64" y="320" font-size="32" fill="#667085" letter-spacing="-1">${escapeXml(subtitle)}</text>
  </g>

  <!-- Bottom strip -->
  <g class="root">
    <text x="64" y="570" font-size="20" fill="#111111">Md Kaif Afran Khan</text>
    <text x="1136" y="570" font-size="18" letter-spacing="2" text-anchor="end" fill="#1769FF">${escapeXml(url.toUpperCase())}</text>
  </g>

  <!-- Wireframe corner ticks for the blueprint cue -->
  <g stroke="#1769FF" stroke-width="1" fill="none" opacity="0.5">
    <path d="M 32 32 L 32 56 M 32 32 L 56 32"/>
    <path d="M 1168 32 L 1168 56 M 1168 32 L 1144 32"/>
    <path d="M 32 598 L 32 574 M 32 598 L 56 598"/>
    <path d="M 1168 598 L 1168 574 M 1168 598 L 1144 598"/>
  </g>
</svg>`;

  return sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toBuffer();
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const person = await loadPerson();
  const fontPath = await findFont();

  const cards = [
    {
      file: "home.png",
      eyebrow: "01 / Portfolio",
      title: person.name,
      subtitle: person.role,
      url: "kaif.dev",
    },
    {
      file: "industry.png",
      eyebrow: "01 / Industry",
      title: "INDUSTRY",
      subtitle: "Software, AI, data, and client work.",
      url: "kaif.dev/industry",
    },
    {
      file: "academic.png",
      eyebrow: "02 / Academic",
      title: "ACADEMIA",
      subtitle: "Research, publications, and thesis.",
      url: "kaif.dev/academic",
    },
    {
      file: "contact.png",
      eyebrow: "03 / Contact",
      title: "CONTACT",
      subtitle: "For research, engineering, or any other reason.",
      url: "kaif.dev/contact",
    },
  ];

  for (const card of cards) {
    const png = await renderOg({ ...card, fontPath });
    const dest = path.join(OUT, card.file);
    await writeFile(dest, png);
    console.log(`✓ ${path.relative(ROOT, dest)} (${png.length.toLocaleString()} bytes)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});