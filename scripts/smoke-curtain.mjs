import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:4173';

const themes = [
  'original-warm', 'classic-elegant', 'luxury-gold',
  'midnight-navy', 'nature-green', 'romantic-flower',
  'korean-traditional', 'editorial-mono',
];

async function getInviteUrl(browser, theme) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { try { localStorage.clear(); } catch {} });
  await page.goto(`${BASE}/#/builder?theme=${theme}`, { waitUntil: 'networkidle' });
  const btn = await page.$('button:has-text("공유 링크 생성")');
  await btn.click();
  await page.waitForSelector('.share-modal .url-display', { timeout: 6000 });
  const url = (await page.textContent('.share-modal .url-display')) || '';
  await ctx.close();
  return url;
}

const browser = await chromium.launch({ headless: true });
let pass = 0, fail = 0;

for (const theme of themes) {
  let ctx, page;
  try {
    const inviteUrl = await getInviteUrl(browser, theme);
    if (!inviteUrl.startsWith('http')) throw new Error('no share URL');

    ctx = await browser.newContext({
      viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    });
    page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(inviteUrl, { waitUntil: 'networkidle' });

    const overlay = page.locator('.curtain-overlay');
    await overlay.waitFor({ state: 'visible', timeout: 4000 });

    await page.waitForFunction(() =>
      document.querySelector('.curtain-overlay')?.classList.contains('revealed'),
      { timeout: 2000 }
    );

    const checks = {
      label: await page.locator('.curtain-label').isVisible(),
      date: await page.locator('.curtain-date').isVisible(),
      names: await page.locator('.curtain-names').isVisible(),
      btn: await page.locator('.curtain-btn').isVisible(),
      hint: await page.locator('.curtain-hint').isVisible(),
    };
    if (!Object.values(checks).every(Boolean)) {
      throw new Error('elements missing: ' + JSON.stringify(checks));
    }

    await page.locator('.curtain-btn').click();
    await page.waitForFunction(() => !document.querySelector('.curtain-overlay'),
      { timeout: 4000 });
    // Hero should now be in view
    await page.waitForLoadState('domcontentloaded').catch(() => {});

    if (errors.length > 0) throw new Error('console errors: ' + errors.join('|'));

    console.log(`\x1b[32m✓\x1b[0m ${theme}: curtain renders & opens cleanly`);
    pass++;
  } catch (err) {
    console.log(`\x1b[31m✗\x1b[0m ${theme}: ${err.message}`);
    fail++;
  } finally {
    if (ctx) {
      try { await ctx.close(); } catch { /* already closed */ }
    }
  }
}

await browser.close();
console.log(`\n=== ${pass}/${pass + fail} curtain smoke pass ===`);
if (fail > 0) process.exit(1);
