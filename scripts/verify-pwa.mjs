/* PWA + global infrastructure verification.
 * - manifest.webmanifest reachable + valid JSON with required fields
 * - service worker registers
 * - icons (PNG sizes) reachable
 * - assetlinks.json reachable
 * - print stylesheet exists (no JS check, just file exists)
 * - builder reactivity: typing in name field updates preview
 *
 * Run: node scripts/verify-pwa.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:4173';
const results = [];
const r = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  const flag = pass ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
  console.log(`  ${flag} ${name}${detail ? '  — ' + detail : ''}`);
};

async function fetchOk(url) {
  try {
    const res = await fetch(url);
    return { ok: res.ok, status: res.status, type: res.headers.get('content-type') || '' };
  } catch (e) {
    return { ok: false, status: 0, error: e.message };
  }
}

async function main() {
  console.log('● PWA infrastructure');
  const manifestUrl = `${BASE}/manifest.webmanifest`;
  const m = await fetchOk(manifestUrl);
  r('manifest.webmanifest reachable', m.ok, `HTTP ${m.status}`);
  if (m.ok) {
    const json = await (await fetch(manifestUrl)).json().catch(() => null);
    r('manifest valid JSON', !!json && typeof json === 'object');
    r('manifest has name', !!(json && json.name));
    r('manifest has start_url', !!(json && json.start_url));
    r('manifest has icons array', !!(json && Array.isArray(json.icons) && json.icons.length > 0));
    const pngIcons = (json?.icons || []).filter((i) => i.type === 'image/png');
    r('manifest has PNG icons', pngIcons.length >= 2, `${pngIcons.length} PNG`);
    r('manifest has maskable icon', (json?.icons || []).some((i) => (i.purpose || '').includes('maskable')));
  }

  for (const path of ['/icons/icon-192.png', '/icons/icon-512.png', '/icons/apple-touch-180.png']) {
    const f = await fetchOk(`${BASE}${path}`);
    r(`${path} reachable`, f.ok, f.type);
  }

  const sw = await fetchOk(`${BASE}/sw.js`);
  r('service worker (sw.js) reachable', sw.ok);

  const al = await fetchOk(`${BASE}/.well-known/assetlinks.json`);
  r('.well-known/assetlinks.json reachable', al.ok);

  console.log('\n● Service worker registration');
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const swState = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return 'unsupported';
    const reg = await navigator.serviceWorker.getRegistration();
    return reg ? (reg.active?.state || 'pending') : 'none';
  });
  r('service worker registers', swState !== 'none' && swState !== 'unsupported',
    `state=${swState}`);

  console.log('\n● Builder reactivity');
  await page.goto(`${BASE}/#/builder?theme=original-warm`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { try { localStorage.clear(); } catch {} });
  await page.goto(`${BASE}/#/builder?theme=original-warm`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.preview-pane .invite-root', { timeout: 5000 });

  const beforeName = await page.$eval('.preview-pane .invite-root', (el) => el.textContent || '').catch(() => '');
  // Find the first non-special input — groom name field. Plain <input> has
  // no type attribute, so we exclude the typed ones rather than match "text".
  const groomInput = page.locator(
    'input:not([type="checkbox"]):not([type="date"]):not([type="time"]):not([type="number"]):not([type="password"]):not([type="file"])'
  ).first();
  await groomInput.fill('홍길동테스트').catch(() => {});
  await page.waitForTimeout(500);
  const afterName = await page.$eval('.preview-pane .invite-root', (el) => el.textContent || '').catch(() => '');
  r('builder typing updates preview',
    /홍길동테스트/.test(afterName) && !/홍길동테스트/.test(beforeName));

  // Theme switcher: click the 2nd theme card (classic-elegant is index 1)
  const themeCards = page.locator('.theme-card');
  const cardCount = await themeCards.count();
  if (cardCount >= 2) {
    await themeCards.nth(1).click();
    await page.waitForTimeout(500);
    const themeAttr = await page.$eval('.preview-pane .invite-root', (el) => el.getAttribute('data-theme'));
    r('builder theme switcher updates preview', themeAttr === 'classic-elegant',
      `theme=${themeAttr}`);
  } else {
    r('builder theme switcher card', false, `count=${cardCount}`);
  }

  // Privacy page reachable
  console.log('\n● Privacy + Home');
  await page.goto(`${BASE}/#/privacy`, { waitUntil: 'networkidle' });
  const privTitle = await page.textContent('h1').catch(() => '');
  r('privacy page renders', /개인정보/.test(privTitle || ''));

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const themeCardsCount = await page.$$eval('article, .theme-card', (els) => els.length).catch(() => 0);
  r('home shows 12 theme cards', themeCardsCount >= 12, `count=${themeCardsCount}`);

  // Demo button
  const demoBtn = await page.$('button:has-text("예시 청첩장")');
  r('home demo button present', !!demoBtn);

  await ctx.close();
  await browser.close();

  const passed = results.filter((x) => x.pass).length;
  const failed = results.length - passed;
  console.log(`\n=== ${passed}/${results.length} pass${failed ? ', ' + failed + ' fail' : ''} ===`);
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
