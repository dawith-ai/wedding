/* Run a critical-subset verification across ALL 12 themes.
 *
 * Per theme: hero renders, names visible, countdown ticks, calendar Google
 * URL valid, gallery viewer opens + ESC closes, account accordion opens +
 * copies number, guestbook submit, like increment, footer, OG meta, no
 * console errors.
 *
 * Run: node scripts/verify-themes.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:4173';
const THEMES = [
  'original-warm', 'classic-elegant', 'modern-minimal', 'romantic-flower',
  'nature-green', 'luxury-gold', 'simple-clean', 'vintage-film',
  'watercolor-soft', 'midnight-navy', 'pastel-dream', 'korean-traditional',
];

async function getInviteUrl(browser, theme) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    try { localStorage.clear(); localStorage.setItem('kakao_js_key', 'verify-fake'); } catch {}
  });
  await page.goto(`${BASE}/#/builder?theme=${theme}`, { waitUntil: 'networkidle' });
  const btn = await page.$('button:has-text("공유 링크 생성")');
  if (!btn) { await ctx.close(); return null; }
  await btn.click();
  await page.waitForSelector('.share-modal .url-display', { timeout: 4000 });
  const url = (await page.textContent('.share-modal .url-display')) || '';
  await ctx.close();
  return url.startsWith('http') ? url : null;
}

async function verifyTheme(browser, theme) {
  const url = await getInviteUrl(browser, theme);
  if (!url) return { theme, results: [{ name: 'publish', pass: false, detail: 'no invite url' }] };

  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  await ctx.addInitScript(() => {
    try { localStorage.setItem('kakao_js_key', 'verify-fake'); } catch {}
  });

  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

  const results = [];
  const r = (name, pass, detail = '') => results.push({ name, pass: !!pass, detail });

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    const c = await page.$('.curtain-message button');
    if (c) { await c.click(); await page.waitForTimeout(1500); }
    await page.waitForSelector('.invite-root', { timeout: 5000 });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(400);

    const themeAttr = await page.getAttribute('.invite-root', 'data-theme');
    r('data-theme matches', themeAttr === theme, `got=${themeAttr}`);

    const heroMedia = await page.$('section.hero img, section.hero video, section.hero iframe');
    r('hero media renders', !!heroMedia);

    const heroText = (await page.$eval('section.hero', (s) => (s.innerText || '').trim()).catch(() => '')) || '';
    // Korean-traditional spaces names (김 민 수). Allow whitespace between syllables.
    r('hero shows couple names',
      /김\s*민\s*수/.test(heroText) && /박\s*서\s*연/.test(heroText));

    const cdAll = await page.$$eval('.countdown-num', (els) => els.map((e) => e.textContent || '')).catch(() => []);
    r('countdown 4 cells with digits', cdAll.length === 4 && cdAll.every((s) => /\d/.test(s)));

    const cdSec1 = cdAll[3] || '';
    await page.waitForTimeout(1100);
    const cdAll2 = await page.$$eval('.countdown-num', (els) => els.map((e) => e.textContent || '')).catch(() => []);
    r('countdown seconds tick', (cdAll2[3] || '') !== cdSec1, `${cdSec1} → ${cdAll2[3] || ''}`);

    const googleHref = await page.$eval('.cal-btn[href]', (a) => a.getAttribute('href')).catch(() => '');
    r('Google Calendar link', /calendar\.google\.com/.test(googleHref || ''));

    // Gallery viewer
    let viewerOk = false;
    let escOk = false;
    try {
      await page.evaluate(() => document.querySelector('.gallery-grid')?.scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(400);
      const gb = await page.$('.gallery-grid button');
      if (gb) {
        await gb.click();
        await page.waitForSelector('.viewer', { timeout: 3000 }).catch(() => {});
        viewerOk = !!(await page.$('.viewer'));
        if (viewerOk) {
          await page.keyboard.press('Escape');
          await page.waitForTimeout(400);
          escOk = !(await page.$('.viewer'));
        }
      }
    } catch { /* swallow */ }
    r('gallery viewer opens', viewerOk);
    r('viewer ESC closes', escOk);

    // Address copy
    let addrCopyOk = false;
    try {
      await page.evaluate(() => document.querySelector('.location-card')?.scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(300);
      const addr = (await page.textContent('.location-address') || '').trim();
      const cb = await page.$('.location-buttons button');
      if (cb) {
        await cb.click();
        await page.waitForTimeout(300);
        const clip = await page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
        addrCopyOk = clip.includes(addr.slice(0, 6));
      }
    } catch { /* swallow */ }
    r('address copy → clipboard', addrCopyOk);

    // Accordion + account copy
    let acctOk = false;
    try {
      await page.evaluate(() => document.querySelector('.account-toggle')?.scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(300);
      const tog = await page.$('.account-toggle');
      if (tog) {
        await tog.click();
        await page.waitForTimeout(300);
        const rowBtn = await page.$('.account-group.open .account-row button');
        if (rowBtn) {
          await rowBtn.click();
          await page.waitForTimeout(200);
          const clip = await page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
          acctOk = /은행/.test(clip) || /\d{3}/.test(clip);
        }
      }
    } catch { /* swallow */ }
    r('account number copy', acctOk);

    // Guestbook submit
    let gbOk = false;
    try {
      await page.evaluate(() => document.querySelector('.guestbook-form')?.scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(300);
      const n = await page.$('.guestbook-form input[placeholder*="성함"]');
      const p = await page.$('.guestbook-form input[type="password"]');
      const m = await page.$('.guestbook-form textarea');
      const s = await page.$('.guestbook-form .guestbook-submit, .guestbook-form button[type="submit"]');
      if (n && p && m && s) {
        await n.fill('테스터');
        await p.fill('pw1234');
        await m.fill('verify');
        await s.click();
        await page.waitForTimeout(500);
        const entries = await page.$$('.guestbook-entry');
        gbOk = entries.length > 0;
      }
    } catch { /* swallow */ }
    r('guestbook submit creates entry', gbOk);

    // Like
    let likeOk = false;
    try {
      const lb = await page.$('.like-btn');
      if (lb) {
        const before = await page.textContent('.like-count').catch(() => '0');
        await lb.click();
        await page.waitForTimeout(300);
        const after = await page.textContent('.like-count').catch(() => '0');
        likeOk = Number(after) === Number(before) + 1;
      }
    } catch { /* swallow */ }
    r('like button increments', likeOk);

    // Footer
    const footer = (await page.textContent('.invite-footer').catch(() => '')) || '';
    r('footer names + date', /김민수/.test(footer) && /박서연/.test(footer) && /2026/.test(footer));

    // OG meta
    const ogTitle = await page.$eval('meta[property="og:title"]', (m) => m.getAttribute('content')).catch(() => '');
    r('OG title dynamic', /김민수|박서연|결혼/.test(ogTitle || ''));

    r('no console / page errors', errors.length === 0, errors.slice(0, 2).join(' | '));
  } catch (e) {
    r('navigation', false, e.message.slice(0, 80));
  }

  await ctx.close();
  return { theme, results };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  let total = 0, passed = 0;
  const failed = [];
  for (const theme of THEMES) {
    process.stdout.write(`→ ${theme.padEnd(20)} `);
    const r = await verifyTheme(browser, theme);
    const tp = r.results.filter((x) => x.pass).length;
    const tt = r.results.length;
    total += tt; passed += tp;
    const ok = tp === tt;
    console.log(`${ok ? '✓' : '✗'}  ${tp}/${tt}`);
    if (!ok) {
      for (const x of r.results) if (!x.pass) failed.push(`  ${theme} → ${x.name}  ${x.detail}`);
    }
  }
  await browser.close();

  console.log(`\n=== ${passed}/${total} pass ===`);
  if (failed.length) {
    console.log('Failures:');
    for (const f of failed) console.log(f);
    process.exit(1);
  }
})().catch((e) => { console.error(e); process.exit(1); });
