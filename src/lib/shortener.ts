/* URL shortener helper.
 *
 * Wedding invitation URLs encode all data in the hash fragment, so they
 * can easily exceed 4–8 kB. External shorteners typically cap input at
 * 2–5 kB. We try a small chain of free, no-auth providers and surface a
 * clear error when every option rejects the URL. Servers may also be
 * down or block CORS, so each call is wrapped in try/catch with a
 * sensible timeout.
 */

const TIMEOUT_MS = 6000;

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      window.setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ]);
}

async function tryCleanUri(url: string): Promise<string | null> {
  try {
    const res = await withTimeout(
      fetch('https://cleanuri.com/api/v1/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'url=' + encodeURIComponent(url),
      }),
      TIMEOUT_MS
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { result_url?: string; error?: string };
    if (json.result_url && /^https?:\/\//.test(json.result_url)) {
      return json.result_url;
    }
    return null;
  } catch {
    return null;
  }
}

async function tryIsGd(url: string): Promise<string | null> {
  try {
    const target =
      'https://is.gd/create.php?format=simple&url=' + encodeURIComponent(url);
    // is.gd uses GET; very long URLs exceed server query limits.
    if (target.length > 8000) return null;
    const res = await withTimeout(fetch(target), TIMEOUT_MS);
    if (!res.ok) return null;
    const text = (await res.text()).trim();
    if (/^https?:\/\//.test(text)) return text;
    return null;
  } catch {
    return null;
  }
}

export async function shortenUrl(url: string): Promise<string> {
  // Try CleanURI (POST, accepts longer input) → is.gd (GET, smaller cap).
  const a = await tryCleanUri(url);
  if (a) return a;
  const b = await tryIsGd(url);
  if (b) return b;
  throw new Error(
    '주소가 너무 길어 단축 서비스가 거부했어요. 갤러리 사진을 줄여 다시 시도해주세요.'
  );
}

