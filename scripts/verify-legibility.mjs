/* Legibility audit — catches what the human eye complains about but
 * smoke/feature tests miss.
 *
 *   1. Vertical clipping  — element with overflow:hidden|clip whose
 *      scrollHeight exceeds clientHeight (text getting cut off the bottom)
 *   2. Orphan / widow     — last visual line of a paragraph is far shorter
 *      than the widest line (looks awkward / "단락 애매하게 나뉘어")
 *   3. Excessive wrap     — short metadata strings (date, venue, footer)
 *      breaking to 3+ lines
 *   4. Tiny touch target  — interactive elements smaller than 32×32px
 *   5. Low contrast       — text vs. background below WCAG AA
 *      (skipped for hero-overlay text where photo backdrop + shadow is
 *      a deliberate stylistic choice)
 *
 * Loops over all 12 themes at 360×800 (the most common Korean phone size).
 *
 * Run: node scripts/verify-legibility.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:4173';
const THEMES = [
  'original-warm', 'classic-elegant', 'modern-minimal', 'romantic-flower',
  'nature-green', 'luxury-gold', 'simple-clean', 'vintage-film',
  'watercolor-soft', 'midnight-navy', 'pastel-dream', 'korean-traditional',
];

const SCAN = `(() => {
  const issues = [];
  const range = document.createRange();

  function cssPath(el) {
    const cls = (el.className && typeof el.className === 'string')
      ? '.' + el.className.split(/\\s+/).filter(Boolean).slice(0, 2).join('.')
      : '';
    return el.tagName.toLowerCase() + cls;
  }

  function getLineRects(el) {
    range.selectNodeContents(el);
    return Array.from(range.getClientRects()).filter(r => r.width > 1 && r.height > 1);
  }

  function parseColor(c) {
    const m = c && c.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4] ? +m[4] : 1 };
  }

  function rgbLum(c) {
    const [R, G, B] = [c.r, c.g, c.b].map(v => {
      v /= 255;
      return v < 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }

  function effectiveBg(el) {
    let cur = el.parentElement;
    while (cur && cur !== document.body) {
      const cs = getComputedStyle(cur);
      const bg = parseColor(cs.backgroundColor);
      if (bg && bg.a > 0.5) return bg;
      cur = cur.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  }

  function contrast(fg, bg) {
    const l1 = rgbLum(fg) + 0.05;
    const l2 = rgbLum(bg) + 0.05;
    return (Math.max(l1, l2) / Math.min(l1, l2));
  }

  function isHidden(el) {
    const cs = getComputedStyle(el);
    return cs.display === 'none' || cs.visibility === 'hidden' || el.clientHeight === 0;
  }

  // ── 1. Vertical clipping
  for (const el of document.querySelectorAll('section.hero, section.hero *, .invite-section, .invite-section *')) {
    if (isHidden(el)) continue;
    const cs = getComputedStyle(el);
    const ov = (cs.overflow + cs.overflowY + cs.overflowX).toLowerCase();
    if (!(ov.includes('hidden') || ov.includes('clip'))) continue;
    const ch = el.clientHeight;
    if (ch < 30) continue;
    if (el.scrollHeight > ch + 6) {
      issues.push({
        kind: 'v-clip',
        sel: cssPath(el),
        clipped: el.scrollHeight - ch,
        text: (el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 50),
      });
    }
  }

  // ── 2. Orphan / widow detection on paragraph-ish elements
  const paraSel = '.greeting-body, .story-text, .account-intro, .shuttle-info, .letter-body, .countdown-message, .hero-venue, p.hero-date, .footer-text, .hero-overlay-content .hero-venue';
  for (const el of document.querySelectorAll(paraSel)) {
    if (isHidden(el)) continue;
    const text = (el.innerText || '').replace(/\\s+/g, ' ').trim();
    if (text.length < 12) continue;
    const rects = getLineRects(el);
    if (rects.length < 2) continue;
    const widths = rects.map(r => r.width);
    const maxW = Math.max(...widths);
    const lastW = widths[widths.length - 1];
    if (maxW > 0 && lastW < maxW * 0.22 && lastW < 60) {
      issues.push({
        kind: 'orphan',
        sel: cssPath(el),
        ratio: (lastW / maxW).toFixed(2),
        lines: rects.length,
        lastW: Math.round(lastW),
        text: text.slice(0, 70),
      });
    }
  }

  // ── 3. Excessive wrap on short metadata strings
  // Skip flex/grid containers — their .getClientRects() counts each child
  // rect, not actual wrapped lines.
  const shortSel = '.hero-date, .hero-venue, .countdown-message, .location-name, .location-detail, .location-address, .timeline-time, .hanji-han, .hanji-title, .cinema-presents, .cinema-tag, .const-eyebrow, .arch-script, .storybook-once, .storybook-chapter, .polaroid-eyebrow';
  for (const el of document.querySelectorAll(shortSel)) {
    if (isHidden(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'flex' || cs.display === 'inline-flex' || cs.display === 'grid') continue;
    const rects = getLineRects(el);
    const text = (el.innerText || '').trim();
    if (rects.length >= 3) {
      issues.push({
        kind: 'too-many-lines',
        sel: cssPath(el),
        lines: rects.length,
        text: text.slice(0, 70),
      });
    }
  }

  // ── 4. Tiny touch targets
  const tap = document.querySelectorAll('button, a[href], input:not([type="hidden"]), [role="button"]');
  for (const el of tap) {
    if (isHidden(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    // Skip purely decorative/nested handles (e.g. <span> inside button)
    if (el.parentElement && el.parentElement.matches('button, a[href]')) continue;
    if (r.width < 32 || r.height < 32) {
      const text = (el.innerText || el.value || el.getAttribute('aria-label') || '').trim();
      issues.push({
        kind: 'small-target',
        sel: cssPath(el),
        size: Math.round(r.width) + '×' + Math.round(r.height),
        text: text.slice(0, 40),
      });
    }
  }

  // ── 5. Contrast (skip hero overlay where photo backdrop + text-shadow
  // are intentional; they need a separate visual review).
  const textSel = '.greeting-body, .story-text, .account-intro, .shuttle-info, .timeline-label, .timeline-note, .letter-body, .hanji-parents-row, .countdown-message, .hero-venue:not(.hero-overlay-content .hero-venue), .invite-footer, .footer-text, .section-heading, .section-label, .gallery-subtitle, .like-caption, .share-intro, .save-date-btn, .cal-btn';
  for (const el of document.querySelectorAll(textSel)) {
    if (isHidden(el)) continue;
    const text = (el.innerText || '').trim();
    if (text.length < 4) continue;
    const cs = getComputedStyle(el);
    if (cs.textShadow && cs.textShadow !== 'none') continue;
    const fg = parseColor(cs.color);
    if (!fg) continue;
    const bg = effectiveBg(el);
    const ratio = contrast(fg, bg);
    const fs = parseFloat(cs.fontSize);
    const fw = parseFloat(cs.fontWeight) || 400;
    const isLarge = fs >= 24 || (fs >= 18.66 && fw >= 700);
    const threshold = isLarge ? 3.0 : 4.5;
    if (ratio < threshold) {
      issues.push({
        kind: 'low-contrast',
        sel: cssPath(el),
        ratio: ratio.toFixed(2),
        threshold,
        size: fs + 'px/' + fw,
        text: text.slice(0, 50),
      });
    }
  }

  return issues;
})()`;

async function getInviteUrl(browser, theme) {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { try { localStorage.clear(); } catch {} });
  await page.goto(`${BASE}/#/builder?theme=${theme}`, { waitUntil: 'networkidle' });
  const btn = await page.$('button:has-text("공유 링크 생성")');
  if (!btn) { await ctx.close(); return null; }
  await btn.click();
  await page.waitForSelector('.share-modal .url-display', { timeout: 4000 });
  const url = (await page.textContent('.share-modal .url-display')) || '';
  await ctx.close();
  return url.startsWith('http') ? url : null;
}

async function auditTheme(browser, theme) {
  const url = await getInviteUrl(browser, theme);
  if (!url) return { theme, error: 'no url' };
  const ctx = await browser.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    const c = await page.$('.curtain-message button');
    if (c) { await c.click(); await page.waitForTimeout(1500); }
    await page.waitForSelector('.invite-root', { timeout: 5000 });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(800);
    const issues = await page.evaluate(SCAN);
    await ctx.close();
    return { theme, issues };
  } catch (e) {
    await ctx.close();
    return { theme, error: e.message };
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const all = [];
  for (const theme of THEMES) {
    process.stdout.write(`→ ${theme.padEnd(20)} `);
    const r = await auditTheme(browser, theme);
    if (r.error) { console.log('ERROR ' + r.error); continue; }
    const counts = { 'v-clip': 0, orphan: 0, 'too-many-lines': 0, 'small-target': 0, 'low-contrast': 0 };
    for (const i of r.issues) counts[i.kind] = (counts[i.kind] || 0) + 1;
    const total = r.issues.length;
    console.log(
      total === 0
        ? '✓ clean'
        : `${total} issue(s) — ` +
          Object.entries(counts).filter(([, n]) => n > 0).map(([k, n]) => `${k}=${n}`).join(', ')
    );
    all.push(r);
  }
  await browser.close();

  console.log('\n=== DETAILS ===');
  let total = 0;
  for (const r of all) {
    if (!r.issues?.length) continue;
    console.log(`\n[${r.theme}]`);
    for (const i of r.issues) {
      total++;
      const detail =
        i.kind === 'v-clip' ? `clipped=${i.clipped}px` :
        i.kind === 'orphan' ? `last=${i.lastW}px ratio=${i.ratio} (${i.lines}L)` :
        i.kind === 'too-many-lines' ? `lines=${i.lines}` :
        i.kind === 'small-target' ? `size=${i.size}` :
        i.kind === 'low-contrast' ? `${i.ratio}:1 < ${i.threshold} (${i.size})` : '';
      console.log(`  ${i.kind.padEnd(15)} ${i.sel.padEnd(30)} ${detail}  "${i.text}"`);
    }
  }
  console.log(`\nTotal: ${total} issue(s)`);
  process.exit(total === 0 ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
