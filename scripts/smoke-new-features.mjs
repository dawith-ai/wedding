import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:4173';

async function getInviteUrl(browser, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { try { localStorage.clear(); } catch {} });
  await page.goto(`${BASE}/#/builder?theme=${opts.theme || 'original-warm'}`, {
    waitUntil: 'networkidle',
  });

  // If opts.configure is given, run it to toggle features in the builder
  if (opts.configure) {
    await opts.configure(page);
  }

  const btn = await page.$('button:has-text("공유 링크 생성")');
  await btn.click();
  await page.waitForSelector('.share-modal .url-display', { timeout: 8000 });
  // Read full URL from data-full-url, fallback to textContent
  const url =
    (await page
      .locator('.share-modal .url-display')
      .first()
      .getAttribute('data-full-url')) ||
    (await page.textContent('.share-modal .url-display')) ||
    '';
  await ctx.close();
  return url;
}

const browser = await chromium.launch({ headless: true });
let pass = 0;
let fail = 0;
const failures = [];

function check(label, cond, detail = '') {
  if (cond) {
    pass++;
    console.log(`\x1b[32m✓\x1b[0m ${label}${detail ? ' — ' + detail : ''}`);
  } else {
    fail++;
    failures.push(label + (detail ? ' — ' + detail : ''));
    console.log(`\x1b[31m✗\x1b[0m ${label}${detail ? ' — ' + detail : ''}`);
  }
}

// ────────────────────────────────────────────────
// Test 1: Greeting emphasis (**text**)
// ────────────────────────────────────────────────
{
  console.log('● Greeting emphasis');
  try {
    const inviteUrl = await getInviteUrl(browser, {
      async configure(page) {
        // Edit the greeting body to include **emphasis**
        const ta = page.locator('.emphasis-textarea textarea');
        await ta.fill('오늘 **소중한** 분들을 모시고자 합니다.');
      },
    });
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    });
    const page = await ctx.newPage();
    await page.goto(inviteUrl, { waitUntil: 'networkidle' });
    // Skip curtain
    const curtainBtn = page.locator('.curtain-btn');
    if (await curtainBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await curtainBtn.click();
      await page.waitForFunction(() => !document.querySelector('.curtain-overlay'), { timeout: 4000 });
    }
    const accentEl = page.locator('.greeting-accent').first();
    const visible = await accentEl.isVisible({ timeout: 3000 }).catch(() => false);
    const text = visible ? await accentEl.textContent() : '';
    check('greeting-accent renders', visible, `text="${text}"`);
    await ctx.close();
  } catch (e) {
    check('greeting-accent renders', false, e.message);
  }
}

// ────────────────────────────────────────────────
// Test 2: Interview / DressCode / Notes appear when toggled
// ────────────────────────────────────────────────
{
  console.log('● Interview / DressCode / Notes');
  try {
    const inviteUrl = await getInviteUrl(browser, {
      async configure(page) {
        // Open the corresponding checkbox rows
        const checkboxes = [
          'Q&A 인터뷰 섹션 표시',
          '드레스 코드 안내 표시',
          '하객분들께 드리는 한마디 표시',
        ];
        for (const label of checkboxes) {
          const cb = page.locator(`label.checkbox-row:has-text("${label}") input[type="checkbox"]`);
          if (await cb.isVisible({ timeout: 2000 }).catch(() => false)) {
            const checked = await cb.isChecked();
            if (!checked) await cb.check();
          }
        }
      },
    });
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    });
    const page = await ctx.newPage();
    await page.goto(inviteUrl, { waitUntil: 'networkidle' });
    const curtainBtn = page.locator('.curtain-btn');
    if (await curtainBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await curtainBtn.click();
      await page.waitForFunction(() => !document.querySelector('.curtain-overlay'), { timeout: 4000 });
    }
    // Scroll the page to bottom to lazy-mount sections
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    const interview = await page.locator('.section-interview').isVisible().catch(() => false);
    const dresscode = await page.locator('.section-dresscode').isVisible().catch(() => false);
    const notes = await page.locator('.section-notes').isVisible().catch(() => false);
    check('Interview Q&A section visible', interview);
    check('DressCode section visible', dresscode);
    check('Notes section visible', notes);
    await ctx.close();
  } catch (e) {
    check('Interview/DressCode/Notes', false, e.message);
  }
}

// ────────────────────────────────────────────────
// Test 3: PIN gate
// ────────────────────────────────────────────────
{
  console.log('● PIN gate');
  try {
    const inviteUrl = await getInviteUrl(browser, {
      async configure(page) {
        const cb = page.locator('label.checkbox-row:has-text("4자리 PIN으로 청첩장 진입 잠금") input[type="checkbox"]');
        await cb.check();
        const pinInput = page.locator('label:has-text("PIN (숫자 4자리)") + input');
        await pinInput.fill('1010');
      },
    });
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    });
    const page = await ctx.newPage();
    await page.goto(inviteUrl, { waitUntil: 'networkidle' });
    const gate = await page.locator('.pin-overlay').isVisible().catch(() => false);
    check('PIN gate visible on load', gate);
    if (gate) {
      // Try wrong PIN first
      await page.locator('.pin-input').fill('9999');
      await page.locator('.pin-submit').click();
      const err = await page.locator('.pin-error').isVisible({ timeout: 1000 }).catch(() => false);
      check('Wrong PIN shows error', err);
      // Then correct PIN
      await page.locator('.pin-input').fill('1010');
      await page.locator('.pin-submit').click();
      await page.waitForFunction(() => !document.querySelector('.pin-overlay'), { timeout: 3000 }).catch(() => {});
      const stillGated = await page.locator('.pin-overlay').isVisible().catch(() => false);
      check('Correct PIN unlocks', !stillGated);
    }
    await ctx.close();
  } catch (e) {
    check('PIN gate', false, e.message);
  }
}

// ────────────────────────────────────────────────
// Test 4: Meal section
// ────────────────────────────────────────────────
{
  console.log('● Meal info');
  try {
    const inviteUrl = await getInviteUrl(browser, {
      async configure(page) {
        const cb = page.locator('label.checkbox-row:has-text("식사 안내 섹션 표시") input[type="checkbox"]');
        await cb.check();
      },
    });
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    });
    const page = await ctx.newPage();
    await page.goto(inviteUrl, { waitUntil: 'networkidle' });
    const curtainBtn = page.locator('.curtain-btn');
    if (await curtainBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await curtainBtn.click();
      await page.waitForFunction(() => !document.querySelector('.curtain-overlay'), { timeout: 4000 });
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const meal = await page.locator('.section-meal').isVisible().catch(() => false);
    const menuItems = await page.locator('.meal-menu-item').count();
    check('Meal section visible', meal);
    check('Meal menu items rendered', menuItems > 0, `${menuItems} items`);
    await ctx.close();
  } catch (e) {
    check('Meal info', false, e.message);
  }
}

// ────────────────────────────────────────────────
// Test 5: Gallery layout variants + slideshow button
// ────────────────────────────────────────────────
{
  console.log('● Gallery layout + slideshow');
  for (const layout of ['grid', 'masonry', 'mosaic']) {
    try {
      const inviteUrl = await getInviteUrl(browser, {
        async configure(page) {
          // Click the visible label that wraps the radio.
          const label = page.locator(`.layout-radio-item:has(input[value="${layout}"])`);
          await label.scrollIntoViewIfNeeded();
          await label.click();
          await page.waitForTimeout(100);
        },
      });
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
      });
      const page = await ctx.newPage();
      await page.goto(inviteUrl, { waitUntil: 'networkidle' });
      const curtainBtn = page.locator('.curtain-btn');
      if (await curtainBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await curtainBtn.click();
        await page.waitForFunction(() => !document.querySelector('.curtain-overlay'), { timeout: 4000 });
      }
      await page.locator('.gallery-grid').first().scrollIntoViewIfNeeded();
      const dataLayout = await page.locator('.gallery-grid').first().getAttribute('data-layout');
      check(`gallery data-layout=${layout}`, dataLayout === layout, `got "${dataLayout}"`);
      // Click first photo to open viewer + check play button
      await page.locator('.gallery-grid button').first().click();
      const playBtn = await page.locator('.viewer-play').isVisible({ timeout: 3000 }).catch(() => false);
      check(`viewer play button (${layout})`, playBtn);
      await ctx.close();
    } catch (e) {
      check(`gallery layout ${layout}`, false, e.message);
    }
  }
}

// ────────────────────────────────────────────────
// Test 6: Guestbook moderation (host PW + blocked words)
// ────────────────────────────────────────────────
{
  console.log('● Guestbook moderation');
  try {
    const inviteUrl = await getInviteUrl(browser, {
      async configure(page) {
        // Type a blocked word
        const inp = page.locator('label:has-text("금지어") + input').first();
        if (await inp.isVisible({ timeout: 2000 }).catch(() => false)) {
          await inp.fill('스팸');
        }
      },
    });
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    });
    const page = await ctx.newPage();
    let toastCaught = '';
    page.on('console', (msg) => { /* swallow */ });
    await page.goto(inviteUrl, { waitUntil: 'networkidle' });
    const curtainBtn = page.locator('.curtain-btn');
    if (await curtainBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await curtainBtn.click();
      await page.waitForFunction(() => !document.querySelector('.curtain-overlay'), { timeout: 4000 });
    }
    await page.locator('.guestbook-form').scrollIntoViewIfNeeded();
    await page.locator('.guestbook-form input[placeholder*="성함"]').fill('테스트');
    await page.locator('.guestbook-form input[type="password"]').fill('1234');
    await page.locator('.guestbook-form textarea').fill('이건 스팸 메시지입니다');
    await page.locator('.guestbook-form .guestbook-submit').click();
    // Toast should appear with the block message
    const toast = page.locator('.toast.visible');
    const toastText = await toast.textContent({ timeout: 2000 }).catch(() => '');
    toastCaught = toastText || '';
    check('Blocked word triggers toast', toastCaught.includes('사용할 수 없는'), `toast="${toastCaught.slice(0, 60)}"`);
    // Now submit a clean message
    await page.locator('.guestbook-form textarea').fill('축하해요');
    await page.locator('.guestbook-form .guestbook-submit').click();
    await page.waitForTimeout(600);
    const entries = await page.locator('.guestbook-entry').count();
    check('Clean message saved', entries >= 1, `entries=${entries}`);
    await ctx.close();
  } catch (e) {
    check('Guestbook moderation', false, e.message);
  }
}

await browser.close();

console.log(`\n=== ${pass} pass · ${fail} fail ===`);
if (failures.length > 0) {
  console.log('\nFAILED:');
  failures.forEach((f) => console.log('  - ' + f));
  process.exit(1);
}
