/* Visual debug: scan every theme's invite page for text overflow and
 * clipped elements, then dump full-page screenshots for human review.
 *
 * Reports any element where:
 *   - scrollWidth > clientWidth + 1 (horizontal text overflow)
 *   - overflow != visible AND scrollHeight > clientHeight + 1 (vertical clip)
 *
 * Run: BASE=http://127.0.0.1:4173 node scripts/debug-overflow.mjs
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const THEMES = [
  'original-warm', 'classic-elegant', 'modern-minimal', 'romantic-flower',
  'nature-green', 'luxury-gold', 'simple-clean', 'vintage-film',
  'watercolor-soft', 'midnight-navy', 'pastel-dream', 'korean-traditional',
  'editorial-mono',
];

const BASE = process.env.BASE || 'http://localhost:5173';
const OUT = path.resolve('scripts/.audit-out');

async function publishUrl(page, theme) {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { try { localStorage.clear(); } catch {} });
  await page.goto(`${BASE}/#/builder?theme=${theme}`, { waitUntil: 'networkidle' });
  const btn = await page.$('button:has-text("공유 링크 생성")');
  if (!btn) return null;
  await btn.click();
  await page.waitForSelector('.share-modal .url-display', { timeout: 4000 });
  const url = (await page.textContent('.share-modal .url-display')) || '';
  await page.keyboard.press('Escape').catch(() => {});
  return url;
}

const SCAN = `(() => {
  const issues = [];
  const all = document.querySelectorAll('section.hero, section.hero *, .invite-section *');
  const seen = new Set();
  for (const el of all) {
    if (seen.has(el)) continue;
    seen.add(el);
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const cw = el.clientWidth;
    const ch = el.clientHeight;
    if (cw === 0 || ch === 0) continue;

    // Horizontal overflow (text getting cut off)
    if (el.scrollWidth > cw + 1) {
      const txt = (el.innerText || '').trim().slice(0, 60);
      const tag = el.tagName.toLowerCase();
      const cls = (el.className && typeof el.className === 'string')
        ? '.' + el.className.split(/\\s+/).filter(Boolean).slice(0, 3).join('.')
        : '';
      issues.push({
        kind: 'h-overflow',
        sel: tag + cls,
        cw, sw: el.scrollWidth, dx: el.scrollWidth - cw,
        text: txt,
      });
    }

    // Vertical clipping where overflow is hidden
    const ov = cs.overflow + cs.overflowY;
    if ((ov.includes('hidden') || ov.includes('clip')) &&
        el.scrollHeight > ch + 4 &&
        (el.children?.length ?? 0) > 0) {
      const txt = (el.innerText || '').trim().slice(0, 60);
      const tag = el.tagName.toLowerCase();
      const cls = (el.className && typeof el.className === 'string')
        ? '.' + el.className.split(/\\s+/).filter(Boolean).slice(0, 3).join('.')
        : '';
      issues.push({
        kind: 'v-clip',
        sel: tag + cls,
        ch, sh: el.scrollHeight, dy: el.scrollHeight - ch,
        text: txt,
      });
    }
  }
  return issues;
})()`;

async function auditOne(browser, theme) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();

  let url;
  try {
    url = await publishUrl(page, theme);
  } catch (e) {
    await ctx.close();
    return { theme, error: 'publish failed: ' + e.message };
  }
  if (!url || !url.startsWith('http')) {
    await ctx.close();
    return { theme, error: 'no invite url' };
  }

  await page.goto(url, { waitUntil: 'networkidle' });
  // Open curtain immediately to skip the intro animation
  const curtainBtn = await page.$('.curtain-message button');
  if (curtainBtn) {
    await curtainBtn.click();
    await page.waitForTimeout(1500);
  }
  await page.waitForSelector('.invite-root', { timeout: 5000 });
  // Wait for fonts and images to settle
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(800);

  const issues = await page.evaluate(SCAN);

  await mkdir(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, `${theme}-full.png`), fullPage: true });
  // Also a hero-only crop for quick review
  const hero = await page.$('section.hero');
  if (hero) await hero.screenshot({ path: path.join(OUT, `${theme}-hero.png`) });

  await ctx.close();
  return { theme, issues };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const all = [];
  for (const t of THEMES) {
    process.stdout.write(`→ ${t} ... `);
    const r = await auditOne(browser, t);
    if (r.error) {
      console.log('ERROR ' + r.error);
      continue;
    }
    console.log(`${r.issues.length} issue${r.issues.length === 1 ? '' : 's'}`);
    all.push(r);
  }
  await browser.close();

  console.log('\n=== ISSUES BY THEME ===');
  let total = 0;
  for (const r of all) {
    if (!r.issues.length) continue;
    console.log(`\n[${r.theme}] ${r.issues.length}`);
    for (const i of r.issues) {
      total++;
      if (i.kind === 'h-overflow') {
        console.log(`  H ${i.sel}  sw=${i.sw} cw=${i.cw} (+${i.dx})  "${i.text}"`);
      } else {
        console.log(`  V ${i.sel}  sh=${i.sh} ch=${i.ch} (+${i.dy})  "${i.text}"`);
      }
    }
  }
  console.log(`\nTotal: ${total} issue(s) across ${all.length} themes`);
  console.log(`Screenshots: ${OUT}`);
  process.exit(total === 0 ? 0 : 1);
})();
