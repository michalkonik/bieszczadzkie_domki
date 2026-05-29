/* ============================================================
   build-photo-manifest.mjs
   Scans the /photos directory and writes photos/manifest.json,
   a map of   folderName -> [ ordered list of media filenames ].

   The website reads this manifest at runtime and builds every
   slideshow dynamically, so the number of slides always matches
   the number of files actually present in each sub-folder.

   Run it again whenever you add or remove photos/videos:
       node build-photo-manifest.mjs
   ============================================================ */
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const PHOTOS_DIR = join(ROOT, "photos");

const MEDIA_RE = /\.(jpe?g|png|gif|webp|avif|mp4|mov|webm|ogg|m4v)$/i;

const manifest = {};

for (const entry of readdirSync(PHOTOS_DIR)) {
  const abs = join(PHOTOS_DIR, entry);
  if (!statSync(abs).isDirectory()) continue; // skip .DS_Store etc.

  const files = readdirSync(abs)
    .filter((f) => !f.startsWith(".") && MEDIA_RE.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

  if (files.length) manifest[entry] = files;
}

const out = join(PHOTOS_DIR, "manifest.json");
writeFileSync(out, JSON.stringify(manifest, null, 2) + "\n");

const total = Object.values(manifest).reduce((n, a) => n + a.length, 0);
console.log(`Wrote ${out}`);
for (const [k, v] of Object.entries(manifest)) console.log(`  ${k}: ${v.length}`);
console.log(`Total media files: ${total}`);
