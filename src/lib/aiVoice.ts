const KEY_STORAGE = 'wedding_openai_api_key_v1';
const ENDPOINT = 'https://api.openai.com/v1/audio/speech';

export type TtsVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export interface VoiceOption {
  id: TtsVoice;
  label: string;
  hint: string;
}

export const VOICES: VoiceOption[] = [
  { id: 'nova', label: '노바', hint: '따뜻한 여성 톤 (한국어 추천)' },
  { id: 'shimmer', label: '시머', hint: '부드러운 여성 톤' },
  { id: 'alloy', label: '앨로이', hint: '중립 톤' },
  { id: 'echo', label: '에코', hint: '담담한 남성 톤' },
  { id: 'onyx', label: '오닉스', hint: '깊은 남성 톤' },
  { id: 'fable', label: '페이블', hint: '낭독 무드' },
];

export function getOpenAiKey(): string {
  try {
    return localStorage.getItem(KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function setOpenAiKey(key: string) {
  try {
    if (key.trim()) localStorage.setItem(KEY_STORAGE, key.trim());
    else localStorage.removeItem(KEY_STORAGE);
  } catch {
    /* ignore */
  }
}

export function hasOpenAiKey(): boolean {
  return getOpenAiKey().length > 0;
}

export interface SynthesizeOptions {
  text: string;
  voice: TtsVoice;
  model?: 'tts-1' | 'tts-1-hd' | 'gpt-4o-mini-tts';
  speed?: number;
}

export async function synthesizeSpeech(opts: SynthesizeOptions): Promise<Blob> {
  const key = getOpenAiKey();
  if (!key) throw new Error('OpenAI API 키가 설정되어 있지 않아요. 설정에서 키를 입력해주세요.');
  const text = opts.text.trim();
  if (!text) throw new Error('변환할 인사말 텍스트가 비어 있어요');

  const body = {
    model: opts.model || 'tts-1-hd',
    voice: opts.voice,
    input: text,
    speed: opts.speed ?? 1.0,
    response_format: 'mp3',
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OpenAI TTS 오류 (${res.status}): ${text.slice(0, 240)}`);
  }
  return await res.blob();
}

export function blobToObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
