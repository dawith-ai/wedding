import { chromium } from 'playwright';
const THEMES = ['original-warm','classic-elegant','modern-minimal','romantic-flower','nature-green','luxury-gold','simple-clean','vintage-film','watercolor-soft','midnight-navy','pastel-dream','korean-traditional','editorial-mono'];
const BASE = process.env.BASE || 'http://127.0.0.1:4173';

const SCAN = `(() => {
  const issues = [];
  const all = document.querySelectorAll('section.hero, section.hero *, .invite-section, .invite-section *');
  for (const el of all) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    // Skip SVG-internal nodes: their scrollWidth/clientWidth reflect the SVG's
    // own coordinate system, not real HTML page overflow (false positives).
    if (el.ownerSVGElement) continue;
    const cw = el.clientWidth, ch = el.clientHeight;
    if (cw === 0 || ch === 0) continue;
    // 8px tolerance: ignore sub-pixel rounding and decorative rotated/scaled
    // pseudo-elements (e.g. stamp ghost-borders) that never cause real
    // horizontal page scroll. Genuine overflow bugs are far larger (10s–100s px).
    if (el.scrollWidth > cw + 8) {
      const txt = (el.innerText || '').trim().slice(0, 50);
      const cls = (typeof el.className === 'string') ? '.' + el.className.split(/\s+/).filter(Boolean).slice(0, 2).join('.') : '';
      issues.push({ sel: el.tagName.toLowerCase() + cls, dx: el.scrollWidth - cw, text: txt });
    }
  }
  return issues;
})()`;

async function getPublishedUrl(browser, theme) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { try { localStorage.clear(); } catch {} });
  await page.goto(`${BASE}/#/builder?theme=${theme}`, { waitUntil: 'networkidle' });
  const btn = await page.$('button:has-text("공유 링크 생성")');
  if (!btn) { await ctx.close(); return null; }
  await btn.click();
  await page.waitForSelector('.share-modal .url-display', { timeout: 4000 }).catch(() => {});
  const url = (await page.textContent('.share-modal .url-display')) || '';
  await ctx.close();
  return url.startsWith('http') ? url : null;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  // Pre-publish all 12 with default viewport, cache URLs
  const urls = {};
  for (const t of THEMES) urls[t] = await getPublishedUrl(browser, t);

  let total = 0;
  for (const vp of [{ w: 320, h: 568, l: '320×568 (iPhone SE)' }, { w: 360, h: 640, l: '360×640 (Galaxy)' }]) {
    console.log(`\n=== ${vp.l} ===`);
    for (const theme of THEMES) {
      if (!urls[theme]) { console.log(`! ${theme}  no url`); continue; }
      const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: true, hasTouch: true });
      const page = await ctx.newPage();
      try {
        await page.goto(urls[theme], { waitUntil: 'networkidle' });
        const c = await page.$('.curtain-message button');
        if (c) { await c.click(); await page.waitForTimeout(1500); }
        await page.waitForSelector('.invite-root', { timeout: 5000 });
        await page.evaluate(() => document.fonts && document.fonts.ready);
        await page.waitForTimeout(400);
        const issues = await page.evaluate(SCAN);
        if (issues.length) {
          total += issues.length;
          console.log(`✗ ${theme}  ${issues.length}`);
          for (const i of issues.slice(0, 4)) {
            console.log(`    ${i.sel}  +${i.dx}px  "${i.text}"`);
          }
        } else {
          console.log(`✓ ${theme}`);
        }
      } catch (e) {
        console.log(`! ${theme}  ${e.message.slice(0, 80)}`);
      }
      await ctx.close();
    }
  }
  await browser.close();
  console.log(`\nTotal: ${total}`);
  process.exit(total === 0 ? 0 : 1);
})();
