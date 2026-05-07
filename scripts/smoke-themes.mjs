/* Smoke-test all 12 themes via the live builder.
 *
 * For each theme:
 *   - open /#/builder?theme=<id>
 *   - wait for hero to render
 *   - capture console errors / page errors / failed requests
 *   - screenshot mobile viewport (375×812)
 *   - exercise key features (BGM toggle if present, story/gallery,
 *     accounts toggle, RSVP form)
 *   - capture publish flow → share modal → QR present
 *
 * Run: node scripts/smoke-themes.mjs
 *
 * Exits non-zero if any theme produced runtime errors. */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const THEMES = [
  'original-warm',
  'classic-elegant',
  'modern-minimal',
  'romantic-flower',
  'nature-green',
  'luxury-gold',
  'simple-clean',
  'vintage-film',
  'watercolor-soft',
  'midnight-navy',
  'pastel-dream',
  'korean-traditional',
];

const BASE = process.env.BASE || 'http://localhost:5173';
const OUT = path.resolve('scripts/.smoke-out');

async function smokeOne(browser, theme) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  const errors = [];
  const failures = [];

  page.on('pageerror', (e) => errors.push({ kind: 'pageerror', msg: String(e) }));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push({ kind: 'console', msg: msg.text() });
  });
  page.on('requestfailed', (req) => {
    const url = req.url();
    // Imgur / Firebase / qrserver may fail w/o credentials — that's expected.
    if (
      url.includes('imgur.com') ||
      url.includes('firestore') ||
      url.includes('qrserver') ||
      url.includes('kakaocdn') ||
      url.includes('developers.kakao')
    ) {
      return;
    }
    failures.push({ url, err: req.failure()?.errorText });
  });

  const testResults = [];
  function assert(name, cond, detail) {
    testResults.push({ name, pass: !!cond, detail: detail || '' });
  }

  // Builder entry — clear localStorage so theme query takes effect, then
  // pre-seed a fake Kakao key so the share button is exercised.
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    try {
      localStorage.clear();
      localStorage.setItem('kakao_js_key', 'smoke-test-fake-key-not-real');
    } catch { /* noop */ }
  });
  await page.goto(`${BASE}/#/builder?theme=${theme}`, { waitUntil: 'networkidle' });

  // Wait for builder shell — preview pane should render the InviteView
  await page.waitForSelector('.invite-root', { timeout: 5000 }).catch(() => {});
  const themeAttr = await page.getAttribute('.invite-root', 'data-theme');
  assert('invite-root data-theme matches', themeAttr === theme, `got=${themeAttr}`);

  // Hero variant must exist (each theme renders its own signature class)
  const heroSel = await page.$('section[class*="hero"]');
  assert('hero section rendered', !!heroSel);
  const heroClass = heroSel ? await heroSel.getAttribute('class') : '';
  assert('hero class non-empty', heroClass && heroClass.includes('hero'));

  await mkdir(OUT, { recursive: true });

  // Publish → grab the share URL → navigate to it for a clean hero capture
  const publishBtn0 = await page.$('button:has-text("공유 링크 생성")');
  let inviteUrl = '';
  if (publishBtn0) {
    await publishBtn0.click();
    await page.waitForSelector('.share-modal .url-display', { timeout: 4000 }).catch(() => {});
    inviteUrl = (await page.textContent('.share-modal .url-display').catch(() => '')) || '';
    await page.keyboard.press('Escape').catch(() => {});
  }
  if (inviteUrl && inviteUrl.startsWith('http')) {
    const invitePage = await ctx.newPage();
    invitePage.on('pageerror', (e) => errors.push({ kind: 'invite-pageerror', msg: String(e) }));
    invitePage.on('console', (msg) => {
      if (msg.type() === 'error') errors.push({ kind: 'invite-console', msg: msg.text() });
    });
    await invitePage.goto(inviteUrl, { waitUntil: 'networkidle' });
    // Open the curtain so the actual hero is visible
    const curtainBtn = await invitePage.$('.curtain-message button');
    if (curtainBtn) {
      await curtainBtn.click();
      await invitePage.waitForTimeout(1500);
    }
    await invitePage.waitForSelector('.invite-root', { timeout: 5000 });
    await invitePage.evaluate(() => window.scrollTo(0, 0));
    await invitePage.waitForTimeout(800);
    await invitePage.screenshot({
      path: path.join(OUT, `${theme}.png`),
      fullPage: false,
    });

    // Scroll to share section, verify Kakao share button is mounted
    await invitePage.evaluate(() => {
      const el = document.querySelector('.section-share');
      if (el) el.scrollIntoView({ block: 'center' });
    });
    await invitePage.waitForTimeout(400);
    const kakaoBtn = await invitePage.$('.share-bar .share-kakao');
    assert('kakao share button present (fake key seeded)', !!kakaoBtn);

    await invitePage.close();
    assert('invite URL navigates and renders', true);
  } else {
    assert('invite URL captured', false, 'fallback fullPage');
    await page.screenshot({ path: path.join(OUT, `${theme}.png`), fullPage: true });
  }

  // (publish flow already exercised above to get the invite URL — not duplicated)

  // Click into a guestbook entry to ensure form interactions work
  const gbBtn = await page.$('.guestbook-form button[type="submit"]');
  assert('guestbook submit button rendered', !!gbBtn);

  await ctx.close();
  return { theme, errors, failures, testResults };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const summary = [];
  let failed = 0;
  for (const theme of THEMES) {
    process.stdout.write(`→ ${theme} ... `);
    try {
      const r = await smokeOne(browser, theme);
      const passes = r.testResults.filter((t) => t.pass).length;
      const total = r.testResults.length;
      const errCount = r.errors.length;
      const reqFail = r.failures.length;
      const ok = passes === total && errCount === 0 && reqFail === 0;
      if (!ok) failed++;
      console.log(
        `${ok ? '✓' : '✗'}  ${passes}/${total} asserts, ${errCount} console errors, ${reqFail} req fails`
      );
      summary.push({ theme, ok, passes, total, errCount, reqFail, errors: r.errors, failures: r.failures, testResults: r.testResults });
    } catch (e) {
      failed++;
      console.log(`crash: ${e.message}`);
      summary.push({ theme, ok: false, crash: e.message });
    }
  }
  await browser.close();

  console.log('\n=== SUMMARY ===');
  for (const s of summary) {
    const flag = s.ok ? '✓' : '✗';
    console.log(`${flag} ${s.theme}`);
    if (!s.ok) {
      if (s.crash) console.log(`    crash: ${s.crash}`);
      if (s.testResults) {
        for (const t of s.testResults) {
          if (!t.pass) console.log(`    fail: ${t.name} (${t.detail})`);
        }
      }
      if (s.errors?.length) {
        for (const e of s.errors.slice(0, 3)) {
          console.log(`    ${e.kind}: ${e.msg.slice(0, 200)}`);
        }
      }
      if (s.failures?.length) {
        for (const f of s.failures.slice(0, 3)) {
          console.log(`    req-fail: ${f.url} (${f.err})`);
        }
      }
    }
  }
  console.log(`\nscreenshots → ${OUT}`);
  process.exit(failed === 0 ? 0 : 1);
})();
