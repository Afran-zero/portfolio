#!/usr/bin/env node
/**
 * scripts/convert-heic.mjs
 *
 * One-shot HEIC → JPG/WebP converter for the profile picture.
 * Run with: `node scripts/convert-heic.mjs`
 *
 * Source:    profile_pic.HEIC (project root)
 * Outputs:   public/images/profile/profile.jpg       (1200x1500 max, q=82)
 *            public/images/profile/profile.webp      (1200x1500 max, q=80)
 *            public/images/profile/profile-square.webp (480x480, q=82, centered crop)
 *
 * Requires ffmpeg (HEIF decode) and sharp (WebP/JPG encode).
 */

import { execFileSync } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(ROOT, "profile_pic.HEIC");
const OUT_DIR = path.join(ROOT, "public", "images", "profile");

const TMP_DECODED = path.join(ROOT, ".next", "profile-decoded.jpg");

async function main() {
  // Source must exist
  await stat(SOURCE);

  // Decode HEIC → JPG with ffmpeg (sharp can struggle with some HEVC variants on Windows).
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(TMP_DECODED), { recursive: true });

  console.log(`[convert-heic] decoding ${SOURCE} → ${TMP_DECODED}`);
  execFileSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      SOURCE,
      "-vf",
      "scale='min(3200,iw)':-2", // upper-bound large inputs; preserve aspect
      "-q:v",
      "2",
      TMP_DECODED,
    ],
    { stdio: ["ignore", "inherit", "inherit"] }
  );

  // Load the decoded image once and produce all variants.
  const base = sharp(TMP_DECODED).rotate(); // honor EXIF orientation

  const meta = await base.metadata();
  console.log(`[convert-heic] source ${meta.width}x${meta.height}`);

  // Tall portrait — keep aspect, cap at 1200 wide.
  const portrait = base.clone().resize({
    width: 1200,
    height: 1500,
    fit: "inside",
    withoutEnlargement: true,
  });

  const jpgOut = path.join(OUT_DIR, "profile.jpg");
  const webpOut = path.join(OUT_DIR, "profile.webp");
  const squareOut = path.join(OUT_DIR, "profile-square.webp");

  console.log(`[convert-heic] writing ${jpgOut}`);
  await portrait.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(jpgOut);

  console.log(`[convert-heic] writing ${webpOut}`);
  await portrait.clone().webp({ quality: 80, effort: 4 }).toFile(webpOut);

  console.log(`[convert-heic] writing ${squareOut}`);
  await base
    .clone()
    .resize({
      width: 480,
      height: 480,
      fit: "cover",
      position: "attention", // smart crop
    })
    .webp({ quality: 82, effort: 4 })
    .toFile(squareOut);

  console.log("[convert-heic] done.");
}

main().catch((err) => {
  console.error("[convert-heic] failed:", err);
  process.exit(1);
});