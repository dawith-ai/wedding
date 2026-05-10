#!/usr/bin/env node
// Generate high-quality wedding sample photos via Gemini 2.5 Flash Image.
// Reads Google API key from ~/.openclaw/openclaw.json.
//
// Usage:  node scripts/generate-samples.mjs [--style=<id>]
// Output: public/samples/<id>.png

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'public/samples');

function readKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  if (process.env.GOOGLE_API_KEY) return process.env.GOOGLE_API_KEY;
  const path = resolve(homedir(), '.openclaw/openclaw.json');
  if (!existsSync(path)) throw new Error('No Gemini key (set GEMINI_API_KEY or place in ~/.openclaw/openclaw.json)');
  const j = JSON.parse(readFileSync(path, 'utf8'));
  const key = j?.models?.providers?.google?.apiKey;
  if (!key) throw new Error('Google apiKey not found in ~/.openclaw/openclaw.json');
  return key;
}

const STYLES = [
  {
    id: 'hero-hanbok-garden',
    prompt: `Photorealistic Korean wedding portrait. A young couple in elegant traditional hanbok—the groom in deep navy blue with subtle gold trim, the bride in soft pink and white with a delicate floral hairpiece—standing close together in a sunlit Korean palace courtyard during golden hour. Autumn ginkgo leaves in the air. Cinematic shallow depth of field, magazine-quality wedding photography, 50mm lens, natural soft light, expressions of quiet joy. Vertical composition, 3:4 aspect ratio. Editorial style.`,
  },
  {
    id: 'gallery-tuxedo-studio',
    prompt: `Photorealistic studio wedding portrait. A young Asian couple — groom in classic black tuxedo, bride in elegant ivory A-line wedding dress with delicate lace details. Plain warm cream backdrop, soft Rembrandt softbox lighting, shallow depth of field with bokeh, gentle smiling expressions. Tasteful, magazine-quality. 4:5 portrait aspect ratio.`,
  },
  {
    id: 'gallery-beach-sunset',
    prompt: `Photorealistic destination wedding photo. A young Asian couple in flowing beach wedding attire — groom in white linen suit, bride in light chiffon dress with a floral crown — walking barefoot on white sand at golden-hour sunset, ocean horizon behind them, gentle wind in hair. Romantic, soft warm light, cinematic, magazine-quality. 4:5 aspect ratio.`,
  },
  {
    id: 'gallery-rooftop-night',
    prompt: `Photorealistic urban wedding portrait. A young Asian couple on a city rooftop at night, dressed in modern formal wedding attire (black tux, sleek white satin gown). Bokeh of city lights behind them, dreamy editorial cinematic lighting, soft warm rim light. Magazine-quality, romantic, slightly moody. 4:5 aspect ratio.`,
  },
  {
    id: 'gallery-forest-walk',
    prompt: `Photorealistic outdoor wedding portrait. A young Asian couple holding hands while walking through a sunlit forest path with dappled green light filtering through trees. Groom in soft tan suit, bride in flowing simple white dress. Natural, candid, soft documentary style, warm summer afternoon light. Magazine quality. 4:5 aspect ratio.`,
  },
  {
    id: 'gallery-floral-arch',
    prompt: `Photorealistic wedding ceremony scene. A young Asian couple standing under an elegant white floral arch decorated with peonies and eucalyptus, exchanging vows. Soft sunlight, garden venue, blurred guests in the background. Cinematic depth, magazine-quality wedding photography, romantic editorial style. 4:5 aspect ratio.`,
  },
];

const MODELS = [
  'gemini-3.1-flash-image-preview',
  'gemini-3-pro-image-preview',
  'gemini-2.5-flash-image',
];

async function tryModel(key, model, style) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
  const body = {
    contents: [{ parts: [{ text: style.prompt }] }],
    generationConfig: { responseModalities: ['IMAGE'] },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const e = new Error(`${model} ${res.status}: ${text.slice(0, 200)}`);
    e.status = res.status;
    throw e;
  }
  const j = await res.json();
  const parts = j?.candidates?.[0]?.content?.parts || [];
  for (const p of parts) {
    const inline = p.inline_data || p.inlineData;
    if (inline?.data) return inline.data;
  }
  const txt = parts.map((p) => p.text).filter(Boolean).join('\n');
  throw new Error(txt ? `${model}: No image; got text: ${txt.slice(0, 120)}` : `${model}: No image returned`);
}

async function generate(key, style) {
  const start = Date.now();
  let lastError;
  for (const model of MODELS) {
    try {
      const data = await tryModel(key, model, style);
      const buf = Buffer.from(data, 'base64');
      const out = resolve(OUT_DIR, `${style.id}.png`);
      writeFileSync(out, buf);
      const ms = Date.now() - start;
      console.log(`✓ ${style.id} → ${out} (${(buf.length / 1024).toFixed(1)}KB, ${ms}ms, model=${model})`);
      return out;
    } catch (e) {
      lastError = e;
      if (e.status === 429 || e.status === 403) {
        // Try next model
        continue;
      }
      throw e;
    }
  }
  throw lastError || new Error('All models failed');
}

async function main() {
  const key = readKey();
  const onlyStyle = process.argv.find((a) => a.startsWith('--style='))?.slice(8);
  const todo = onlyStyle ? STYLES.filter((s) => s.id === onlyStyle) : STYLES;
  if (todo.length === 0) {
    console.error('No matching style');
    process.exit(1);
  }
  console.log(`Generating ${todo.length} sample(s) using Gemini image models (sequential to respect quota)…`);
  const results = [];
  for (const s of todo) {
    try {
      const r = await generate(key, s);
      results.push({ status: 'fulfilled', value: r });
    } catch (e) {
      results.push({ status: 'rejected', reason: e });
    }
  }
  const ok = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.map((r, i) => r.status === 'rejected' ? `${todo[i].id}: ${r.reason.message}` : null).filter(Boolean);
  console.log(`\nDone: ${ok}/${todo.length} succeeded`);
  if (failed.length) {
    console.log('Failures:');
    failed.forEach((f) => console.log(`  - ${f}`));
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
