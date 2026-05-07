#!/usr/bin/env node
/**
 * Run Lighthouse against the local preview to verify PWA / performance /
 * accessibility / best-practices / SEO scores against thresholds.
 *
 * Boots `npm run preview` in-process if BASE is not provided.
 * Uses Lighthouse's programmatic Node API + headless Chromium via Playwright
 * (avoids needing a separate `chrome-launcher` binary on CI).
 *
 * Run: npm run audit:pwa
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';

const URL = process.env.BASE || 'http://127.0.0.1:4173/';
const THRESHOLDS = {
  performance: 80,
  accessibility: 90,
  'best-practices': 85,
  seo: 85,
  pwa: 70,
};

async function bootPreview() {
  if (process.env.BASE) return null; // user provides their own server
  const child = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173'], {
    stdio: 'ignore',
    detached: true,
  });
  for (let i = 0; i < 30; i++) {
    try {
      const r = await fetch(URL);
      if (r.ok) return child;
    } catch { /* not ready */ }
    await wait(500);
  }
  child.kill();
  throw new Error('preview server failed to boot');
}

async function main() {
  const lighthouse = (await import('lighthouse')).default;
  const previewProc = await bootPreview();

  const browser = await chromium.launch({ headless: true, args: ['--remote-debugging-port=9222'] });
  try {
    const result = await lighthouse(URL, {
      port: 9222,
      output: 'json',
      logLevel: 'error',
      onlyCategories: Object.keys(THRESHOLDS),
    });
    const scores = {};
    for (const k of Object.keys(THRESHOLDS)) {
      const v = result?.lhr?.categories?.[k]?.score;
      scores[k] = v == null ? null : Math.round(v * 100);
    }

    let failed = 0;
    console.log('\n=== Lighthouse Scores ===');
    for (const k of Object.keys(THRESHOLDS)) {
      const got = scores[k];
      const need = THRESHOLDS[k];
      const ok = got != null && got >= need;
      if (!ok) failed++;
      console.log(`${ok ? '✓' : '✗'} ${k.padEnd(14)} ${String(got).padStart(3)} (need ≥${need})`);
    }

    if (failed > 0) {
      console.log(`\n${failed} threshold(s) below target.`);
      process.exitCode = 1;
    } else {
      console.log('\nAll thresholds met.');
    }
  } finally {
    await browser.close();
    if (previewProc) {
      try {
        process.kill(-previewProc.pid);
      } catch { /* already exited */ }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
