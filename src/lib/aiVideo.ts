const KEY_STORAGE = 'wedding_fal_api_key_v1';
const QUEUE_ENDPOINT = 'https://queue.fal.run/fal-ai/stable-video';

export function getFalKey(): string {
  try {
    return localStorage.getItem(KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function setFalKey(key: string) {
  try {
    if (key.trim()) localStorage.setItem(KEY_STORAGE, key.trim());
    else localStorage.removeItem(KEY_STORAGE);
  } catch {
    /* ignore */
  }
}

export function hasFalKey(): boolean {
  return getFalKey().length > 0;
}

export interface VideoMotion {
  id: number;
  label: string;
  hint: string;
}

export const MOTION_PRESETS: VideoMotion[] = [
  { id: 80, label: '잔잔한 모션', hint: '거의 정지된 듯한 미세 모션' },
  { id: 127, label: '시네마 모션', hint: '시네마틱 부드러운 움직임 (추천)' },
  { id: 175, label: '강한 모션', hint: '확실한 카메라/인물 움직임' },
];

export interface GenerateVideoOptions {
  imageUrl: string;
  motionBucketId?: number;
  fps?: number;
  onProgress?: (status: string) => void;
}

interface FalQueueResponse {
  request_id: string;
  status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED';
  status_url?: string;
  response_url?: string;
}

interface FalResultResponse {
  video?: {
    url: string;
    content_type?: string;
  };
  detail?: string;
}

export async function generateVideo(opts: GenerateVideoOptions): Promise<string> {
  const key = getFalKey();
  if (!key) throw new Error('fal.ai API 키가 설정되어 있지 않아요');
  if (!opts.imageUrl) throw new Error('영상으로 만들 사진 URL이 비어 있어요');
  if (opts.imageUrl.startsWith('data:')) {
    throw new Error('fal.ai는 외부 URL이 필요해요. 사진을 먼저 Imgur에 업로드해주세요.');
  }

  const motion = opts.motionBucketId ?? 127;
  const fps = opts.fps ?? 8;
  opts.onProgress?.('대기열 등록 중…');

  const submitRes = await fetch(QUEUE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Key ${key}`,
    },
    body: JSON.stringify({
      image_url: opts.imageUrl,
      motion_bucket_id: motion,
      fps,
      seed: Math.floor(Math.random() * 1_000_000),
    }),
  });

  if (!submitRes.ok) {
    const text = await submitRes.text().catch(() => '');
    throw new Error(`fal.ai 등록 실패 (${submitRes.status}): ${text.slice(0, 240)}`);
  }
  const submit = (await submitRes.json()) as FalQueueResponse;
  const requestId = submit.request_id;
  if (!requestId) throw new Error('fal.ai에서 요청 ID를 반환하지 않았어요');

  const statusBase = `https://queue.fal.run/fal-ai/stable-video/requests/${requestId}`;
  const start = Date.now();
  const TIMEOUT_MS = 180_000; // 3 minutes max
  let lastStatus = '';

  while (Date.now() - start < TIMEOUT_MS) {
    await sleep(2500);
    const statusRes = await fetch(`${statusBase}/status`, {
      headers: { Authorization: `Key ${key}` },
    });
    if (!statusRes.ok) {
      const text = await statusRes.text().catch(() => '');
      throw new Error(`fal.ai 상태 조회 실패 (${statusRes.status}): ${text.slice(0, 200)}`);
    }
    const status = (await statusRes.json()) as FalQueueResponse;
    if (status.status !== lastStatus) {
      lastStatus = status.status;
      const label = status.status === 'IN_QUEUE' ? '대기 중…' : status.status === 'IN_PROGRESS' ? '생성 중…' : '완료';
      opts.onProgress?.(label);
    }
    if (status.status === 'COMPLETED') break;
  }

  const resultRes = await fetch(statusBase, {
    headers: { Authorization: `Key ${key}` },
  });
  if (!resultRes.ok) {
    const text = await resultRes.text().catch(() => '');
    throw new Error(`fal.ai 결과 조회 실패 (${resultRes.status}): ${text.slice(0, 200)}`);
  }
  const result = (await resultRes.json()) as FalResultResponse;
  if (!result.video?.url) {
    throw new Error(result.detail || '영상이 반환되지 않았어요 (시간 초과 또는 모델 오류)');
  }
  return result.video.url;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
