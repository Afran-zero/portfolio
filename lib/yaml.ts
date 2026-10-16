/**
 * Read a YAML file from disk, parse it, and return typed data.
 * Validation happens at the content layer (lib/content.ts).
 */

// Fails the build if any client component imports this — `node:fs` would
// otherwise leak toward the browser bundle.
import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import yaml from "yaml";

export async function readYAML<T>(relativePath: string): Promise<T> {
  const fullPath = path.join(
    process.cwd(),
    /*turbopackIgnore: true*/ relativePath,
  );
  const file = await fs.readFile(fullPath, "utf8");
  return yaml.parse(file) as T;
}