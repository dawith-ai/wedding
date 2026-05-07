#!/usr/bin/env node
/**
 * Rasterize SVG sources to the PNG sizes required by Play Store / App Store
 * and the PWA manifest. Runs as `npm run prebuild` so committed PNGs do not
 * drift from the SVG sources.
 *
 * Outputs (under public/icons/):
 *   icon-192.png         — manifest "any"
 *   icon-512.png         — manifest "any" + Play Store
 *   icon-maskable-192.png
 *   icon-maskable-512.png
 *   apple-touch-180.png  — iOS home-screen
 *   icon-1024.png        — App Store listing
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const ICONS_DIR = path.join(root, 'public', 'icons');

const TARGETS = [
  { src: 'icon.svg', size: 192, out: 'icon-192.png' },
  { src: 'icon.svg', size: 512, out: 'icon-512.png' },
  { src: 'icon.svg', size: 1024, out: 'icon-1024.png' },
  { src: 'icon-maskable.svg', size: 192, out: 'icon-maskable-192.png' },
  { src: 'icon-maskable.svg', size: 512, out: 'icon-maskable-512.png' },
  { src: 'apple-touch-icon.svg', size: 180, out: 'apple-touch-180.png' },
];

async function rasterize({ src, size, out }) {
  const inputPath = path.join(ICONS_DIR, src);
  const outputPath = path.join(ICONS_DIR, out);
  const buf = await fs.readFile(inputPath);
  // density tuned so SVG renders crisply at the target px size
  const density = Math.min(2400, Math.max(72, size * 2));
  await sharp(buf, { density })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
  const { size: bytes } = await fs.stat(outputPath);
  return { out, bytes };
}

async function main() {
  await fs.mkdir(ICONS_DIR, { recursive: true });
  const results = [];
  for (const t of TARGETS) {
    try {
      results.push(await rasterize(t));
    } catch (e) {
      console.error(`✗ ${t.out}:`, e.message);
      process.exitCode = 1;
    }
  }
  for (const r of results) {
    const kb = (r.bytes / 1024).toFixed(1);
    console.log(`✓ ${r.out.padEnd(28)} ${kb.padStart(6)} KB`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
