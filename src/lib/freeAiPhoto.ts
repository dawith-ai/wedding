// Pollinations.ai — Free AI image generation, no API key required.
// Returns deterministic URLs (with fixed seed) so the same image is rendered
// every time the invitation link is opened.

const ENDPOINT = 'https://image.pollinations.ai/prompt';

export interface FreePhotoStyle {
  id: string;
  label: string;
  emoji: string;
  promptPrefix: string;
}

export const FREE_STYLES: FreePhotoStyle[] = [
  {
    id: 'hanbok-garden',
    label: '한복 야외',
    emoji: '🎎',
    promptPrefix:
      'Photorealistic Korean wedding portrait, young Korean couple in elegant traditional hanbok (groom navy with gold trim, bride pink with white wonsam), Korean palace courtyard at golden hour, autumn ginkgo leaves, magazine-quality wedding photography, cinematic shallow depth of field, soft natural light',
  },
  {
    id: 'tuxedo-classic',
    label: '턱시도 클래식',
    emoji: '🤵',
    promptPrefix:
      'Photorealistic studio wedding portrait, young Asian couple, groom black tuxedo bride ivory wedding dress with lace, plain warm cream backdrop, soft Rembrandt softbox lighting, magazine quality',
  },
  {
    id: 'beach-sunset',
    label: '비치 선셋',
    emoji: '🏖️',
    promptPrefix:
      'Photorealistic destination wedding photo, young Asian couple, groom white linen suit bride flowing chiffon dress with floral crown, white sand beach at golden hour sunset, ocean horizon, romantic warm light, cinematic',
  },
  {
    id: 'rooftop-night',
    label: '루프탑 야경',
    emoji: '🌃',
    promptPrefix:
      'Photorealistic urban wedding portrait, young Asian couple in modern formal wedding attire (black tux, white satin gown), city rooftop at night, bokeh city lights background, dreamy editorial cinematic lighting, romantic moody',
  },
  {
    id: 'forest-walk',
    label: '숲속 산책',
    emoji: '🌲',
    promptPrefix:
      'Photorealistic outdoor wedding portrait, young Asian couple holding hands, sunlit forest path with dappled green light, groom soft tan suit bride flowing simple white dress, candid documentary style',
  },
  {
    id: 'floral-arch',
    label: '꽃 아치 식장',
    emoji: '🌸',
    promptPrefix:
      'Photorealistic wedding ceremony, young Asian couple under elegant white floral arch with peonies and eucalyptus, exchanging vows, soft sunlight, garden venue, blurred guests in background, cinematic depth, romantic editorial',
  },
];

export interface FreeAiOptions {
  prompt: string;
  width?: number;
  height?: number;
  seed?: number;
  model?: 'flux' | 'flux-realism' | 'turbo';
}

/**
 * Build a deterministic Pollinations URL for a given prompt + seed.
 * Same inputs → same image. No API key required.
 */
export function buildFreeAiUrl(opts: FreeAiOptions): string {
  const seed = opts.seed ?? Math.floor(Math.random() * 1_000_000);
  const params = new URLSearchParams({
    width: String(opts.width ?? 1024),
    height: String(opts.height ?? 1280),
    seed: String(seed),
    model: opts.model || 'flux',
    nologo: 'true',
    enhance: 'true',
    safe: 'true',
  });
  const encoded = encodeURIComponent(opts.prompt);
  return `${ENDPOINT}/${encoded}?${params.toString()}`;
}

/**
 * Probe a generated URL to check it loads (basic sanity).
 * Pollinations is sometimes slow on cold start; this lets the UI show progress.
 */
export async function probeImage(url: string, timeoutMs = 60000): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => resolve(false), timeoutMs);
    img.onload = () => {
      clearTimeout(timer);
      resolve(true);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(false);
    };
    img.src = url;
  });
}
