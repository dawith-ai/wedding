const KEY_STORAGE = 'wedding_gemini_api_key_v1';
const MODEL = 'gemini-2.5-flash-image';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export interface AiPhotoStyle {
  id: string;
  label: string;
  emoji: string;
  prompt: string;
}

export const PHOTO_STYLES: AiPhotoStyle[] = [
  {
    id: 'hanbok-outdoor',
    label: '한복 야외 결혼식',
    emoji: '🎎',
    prompt:
      'Transform this person into a Korean traditional hanbok wedding photo. Outdoor garden setting, natural soft sunlight, autumn leaves. Preserve the same face and identity exactly. Photorealistic, high resolution, magazine quality wedding photography.',
  },
  {
    id: 'tuxedo-classic',
    label: '턱시도 클래식 스튜디오',
    emoji: '🤵',
    prompt:
      'Place this person in a classic black tuxedo or elegant white wedding dress. Professional studio backdrop, soft cinematic lighting. Preserve the same face and identity exactly. Photorealistic wedding portrait, magazine quality.',
  },
  {
    id: 'beach-wedding',
    label: '비치 웨딩',
    emoji: '🏖️',
    prompt:
      'Place this person in beach wedding attire. White sand beach, ocean horizon, golden hour sunset light. Wind in hair. Preserve the same face and identity exactly. Photorealistic, romantic wedding photography style.',
  },
  {
    id: 'studio-classic',
    label: '클래식 스튜디오',
    emoji: '📸',
    prompt:
      'Studio wedding portrait of this person in formal wedding attire (white dress / dark suit). Plain elegant backdrop, professional softbox lighting, shallow depth of field. Preserve face and identity exactly. Photorealistic.',
  },
  {
    id: 'korean-traditional-ceremony',
    label: '한국 전통 혼례',
    emoji: '🏯',
    prompt:
      'Place this person in traditional Korean wedding ceremony attire (groom: samogwandae jokduri, bride: hwarot wonsam with jokduri). Traditional Korean palace courtyard backdrop, vivid dancheong colors. Preserve face exactly. Photorealistic.',
  },
  {
    id: 'rooftop-night',
    label: '시티 루프탑 야경',
    emoji: '🌃',
    prompt:
      'Place this person on a city rooftop at night with bokeh city lights, wearing modern formal wedding attire. Cinematic lighting, dreamy editorial style. Preserve face exactly. Photorealistic.',
  },
];

export function getGeminiKey(): string {
  try {
    return localStorage.getItem(KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function setGeminiKey(key: string) {
  try {
    if (key.trim()) localStorage.setItem(KEY_STORAGE, key.trim());
    else localStorage.removeItem(KEY_STORAGE);
  } catch {
    /* ignore */
  }
}

export function hasGeminiKey(): boolean {
  return getGeminiKey().length > 0;
}

export function fileToBase64(file: File): Promise<{ data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('파일을 읽을 수 없어요'));
        return;
      }
      const idx = result.indexOf(',');
      const mimeMatch = /data:([^;]+);base64,/.exec(result);
      resolve({
        data: idx >= 0 ? result.slice(idx + 1) : result,
        mimeType: mimeMatch ? mimeMatch[1] : file.type || 'image/jpeg',
      });
    };
    reader.onerror = () => reject(new Error('파일을 읽을 수 없어요'));
    reader.readAsDataURL(file);
  });
}

export interface GenerateResult {
  dataUrl: string;
  mimeType: string;
}

export async function generateWeddingPhoto(
  inputBase64: string,
  inputMime: string,
  prompt: string
): Promise<GenerateResult> {
  const key = getGeminiKey();
  if (!key) throw new Error('Gemini API 키가 설정되어 있지 않아요. 설정에서 키를 입력해주세요.');

  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          { inline_data: { mime_type: inputMime, data: inputBase64 } },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['IMAGE'],
    },
  };

  const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Gemini API 오류 (${res.status}): ${text.slice(0, 240)}`);
  }

  const json = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ inline_data?: { data?: string; mime_type?: string }; inlineData?: { data?: string; mimeType?: string }; text?: string }> };
    }>;
    error?: { message?: string };
  };
  if (json.error) throw new Error(`Gemini: ${json.error.message || 'unknown error'}`);

  const parts = json.candidates?.[0]?.content?.parts || [];
  for (const p of parts) {
    const inline = p.inline_data || p.inlineData;
    if (inline && inline.data) {
      const mime = (inline as { mime_type?: string; mimeType?: string }).mime_type || (inline as { mimeType?: string }).mimeType || 'image/png';
      return { dataUrl: `data:${mime};base64,${inline.data}`, mimeType: mime };
    }
  }
  const textParts = parts.map((p) => p.text).filter(Boolean).join('\n');
  throw new Error(textParts ? `이미지가 반환되지 않았어요: ${textParts.slice(0, 160)}` : '이미지가 반환되지 않았어요.');
}
