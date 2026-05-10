const KEY_STORAGE = 'wedding_elevenlabs_api_key_v1';
const VOICE_ID_STORAGE = 'wedding_elevenlabs_voice_id_v1';
const ADD_VOICE_ENDPOINT = 'https://api.elevenlabs.io/v1/voices/add';
const TTS_ENDPOINT = (voiceId: string) =>
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;

export function getElevenKey(): string {
  try {
    return localStorage.getItem(KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function setElevenKey(key: string) {
  try {
    if (key.trim()) localStorage.setItem(KEY_STORAGE, key.trim());
    else localStorage.removeItem(KEY_STORAGE);
  } catch {
    /* ignore */
  }
}

export function hasElevenKey(): boolean {
  return getElevenKey().length > 0;
}

export function getClonedVoiceId(): string {
  try {
    return localStorage.getItem(VOICE_ID_STORAGE) || '';
  } catch {
    return '';
  }
}

export function setClonedVoiceId(id: string) {
  try {
    if (id.trim()) localStorage.setItem(VOICE_ID_STORAGE, id.trim());
    else localStorage.removeItem(VOICE_ID_STORAGE);
  } catch {
    /* ignore */
  }
}

export interface CloneOptions {
  name: string;
  description?: string;
  files: File[];
}

interface AddVoiceResponse {
  voice_id?: string;
  detail?: { message?: string } | string;
}

export async function cloneVoice(opts: CloneOptions): Promise<string> {
  const key = getElevenKey();
  if (!key) throw new Error('ElevenLabs API 키가 설정되어 있지 않아요');
  if (opts.files.length === 0) throw new Error('샘플 음성 파일을 1개 이상 선택해주세요');

  const form = new FormData();
  form.append('name', opts.name || '내 청첩장 목소리');
  if (opts.description) form.append('description', opts.description);
  for (const f of opts.files) form.append('files', f);
  form.append('remove_background_noise', 'true');

  const res = await fetch(ADD_VOICE_ENDPOINT, {
    method: 'POST',
    headers: { 'xi-api-key': key },
    body: form,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`ElevenLabs 클로닝 실패 (${res.status}): ${text.slice(0, 240)}`);
  }
  const json = (await res.json()) as AddVoiceResponse;
  if (!json.voice_id) {
    const detail = typeof json.detail === 'string' ? json.detail : json.detail?.message || '응답에 voice_id 없음';
    throw new Error(detail);
  }
  setClonedVoiceId(json.voice_id);
  return json.voice_id;
}

export interface SpeakOptions {
  voiceId: string;
  text: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
}

export async function speakWithClone(opts: SpeakOptions): Promise<Blob> {
  const key = getElevenKey();
  if (!key) throw new Error('ElevenLabs API 키가 설정되어 있지 않아요');
  if (!opts.voiceId) throw new Error('Voice ID가 없어요. 먼저 클로닝하세요.');
  if (!opts.text.trim()) throw new Error('변환할 텍스트가 비어 있어요');

  const body = {
    text: opts.text,
    model_id: opts.modelId || 'eleven_multilingual_v2',
    voice_settings: {
      stability: opts.stability ?? 0.5,
      similarity_boost: opts.similarityBoost ?? 0.85,
    },
  };

  const res = await fetch(TTS_ENDPOINT(opts.voiceId), {
    method: 'POST',
    headers: {
      'xi-api-key': key,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`ElevenLabs TTS 실패 (${res.status}): ${text.slice(0, 240)}`);
  }
  return await res.blob();
}
