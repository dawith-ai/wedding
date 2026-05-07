/* Kakao JavaScript SDK wrapper.
 * Loads SDK on demand, persists JS Key in localStorage, exposes a single
 * shareWedding() entry point. The Kakao Sharing API is publicly documented
 * at developers.kakao.com — this is an original wrapper around it. */

const SDK_SRC = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';
const SDK_INTEGRITY = 'sha384-DKYWFzcHikRMC2bw6jLBGGsyLwiy4EMyCNvm8Qf9N5MIA7sM2VmtMhDxwnGeYbVc';

interface KakaoShareSDK {
  init(key: string): void;
  isInitialized(): boolean;
  cleanup?: () => void;
  Share: {
    sendDefault(opts: unknown): void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoShareSDK;
  }
}

const KEY_STORE = 'kakao_js_key';

export function getKakaoKey(): string {
  try {
    return localStorage.getItem(KEY_STORE) || '';
  } catch {
    return '';
  }
}

export function setKakaoKey(k: string): void {
  try {
    if (k) localStorage.setItem(KEY_STORE, k);
    else localStorage.removeItem(KEY_STORE);
  } catch {
    /* localStorage unavailable */
  }
}

export function hasKakaoKey(): boolean {
  return !!getKakaoKey();
}

let loadingPromise: Promise<KakaoShareSDK> | null = null;

function loadSdk(): Promise<KakaoShareSDK> {
  if (typeof window === 'undefined') return Promise.reject(new Error('SSR'));
  if (window.Kakao) return Promise.resolve(window.Kakao);
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise<KakaoShareSDK>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-kakao-sdk]');
    if (existing) {
      existing.addEventListener('load', () => {
        if (window.Kakao) resolve(window.Kakao);
        else reject(new Error('Kakao SDK 로드 실패'));
      });
      existing.addEventListener('error', () => reject(new Error('Kakao SDK 로드 실패')));
      return;
    }
    const tag = document.createElement('script');
    tag.src = SDK_SRC;
    tag.integrity = SDK_INTEGRITY;
    tag.crossOrigin = 'anonymous';
    tag.async = true;
    tag.dataset.kakaoSdk = '1';
    tag.onload = () => {
      if (window.Kakao) resolve(window.Kakao);
      else reject(new Error('Kakao SDK 로드 실패'));
    };
    tag.onerror = () => reject(new Error('Kakao SDK 로드 실패'));
    document.head.appendChild(tag);
  });

  return loadingPromise;
}

async function ensureReady(): Promise<KakaoShareSDK | null> {
  const key = getKakaoKey();
  if (!key) return null;
  try {
    const sdk = await loadSdk();
    if (!sdk.isInitialized()) sdk.init(key);
    return sdk;
  } catch {
    return null;
  }
}

interface ShareInput {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  buttonTitle?: string;
}

export async function shareToKakao(input: ShareInput): Promise<boolean> {
  const sdk = await ensureReady();
  if (!sdk) return false;

  // Kakao requires absolute URL; pad imageUrl when missing
  const link = { mobileWebUrl: input.url, webUrl: input.url };
  try {
    sdk.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: input.title.slice(0, 200),
        description: input.description.slice(0, 200),
        imageUrl: input.imageUrl || '',
        link,
      },
      buttons: [
        {
          title: input.buttonTitle || '청첩장 보기',
          link,
        },
      ],
    });
    return true;
  } catch {
    return false;
  }
}
