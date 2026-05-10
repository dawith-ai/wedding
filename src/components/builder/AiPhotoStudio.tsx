import { useEffect, useRef, useState } from 'react';
import {
  PHOTO_STYLES,
  fileToBase64,
  generateWeddingPhoto,
  getGeminiKey,
  hasGeminiKey,
  setGeminiKey,
} from '../../lib/aiPhoto';
import { hasImgurClientId, uploadDataUrl } from '../../lib/imgur';
import {
  MOTION_PRESETS,
  generateVideo,
  getFalKey,
  hasFalKey,
  setFalKey,
} from '../../lib/aiVideo';
import { showToast } from '../../lib/toast';

interface Props {
  onPhotoReady: (dataUrl: string, action: 'gallery' | 'hero') => void;
  onVideoReady?: (videoUrl: string) => void;
}

interface BulkResult {
  styleId: string;
  styleLabel: string;
  dataUrl?: string;
  error?: string;
}

export function AiPhotoStudio({ onPhotoReady, onVideoReady }: Props) {
  const [open, setOpen] = useState(false);
  const [keyInput, setKeyInput] = useState(getGeminiKey());
  const [showKey, setShowKey] = useState(!hasGeminiKey());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [styleId, setStyleId] = useState(PHOTO_STYLES[0].id);
  const [customPrompt, setCustomPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkResults, setBulkResults] = useState<BulkResult[]>([]);
  const [resultUrl, setResultUrl] = useState<string>('');
  const [videoBusy, setVideoBusy] = useState(false);
  const [videoStatus, setVideoStatus] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [showFalKey, setShowFalKey] = useState(false);
  const [falKeyInput, setFalKeyInput] = useState(getFalKey());
  const [motion, setMotion] = useState(127);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  function saveKey() {
    setGeminiKey(keyInput);
    showToast(keyInput.trim() ? 'API 키 저장됨' : 'API 키 삭제됨');
    if (keyInput.trim()) setShowKey(false);
  }

  async function generate() {
    if (!selectedFile) {
      showToast('먼저 셀카(또는 사진) 한 장을 선택해주세요');
      return;
    }
    if (!hasGeminiKey()) {
      setShowKey(true);
      showToast('Gemini API 키부터 입력해주세요');
      return;
    }
    setBusy(true);
    setResultUrl('');
    try {
      const { data, mimeType } = await fileToBase64(selectedFile);
      const style = PHOTO_STYLES.find((s) => s.id === styleId);
      const prompt = customPrompt.trim() || (style ? style.prompt : PHOTO_STYLES[0].prompt);
      const out = await generateWeddingPhoto(data, mimeType, prompt);
      setResultUrl(out.dataUrl);
      showToast('생성 완료. 갤러리/Hero에 추가할 수 있어요');
    } catch (e) {
      showToast((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function ensureExternalUrl(dataUrl: string): Promise<string> {
    if (!dataUrl.startsWith('data:')) return dataUrl;
    if (hasImgurClientId()) {
      try {
        const up = await uploadDataUrl(dataUrl);
        return up.url;
      } catch (e) {
        showToast(`Imgur 업로드 실패: ${(e as Error).message}`);
      }
    }
    return dataUrl;
  }

  async function attach(action: 'gallery' | 'hero', source?: string) {
    const target = source || resultUrl;
    if (!target) return;
    if (target.startsWith('data:') && !hasImgurClientId()) {
      showToast('⚠️ Imgur 키가 없어 base64로 저장됩니다 — 공유 URL이 길어질 수 있어요.');
    } else if (target.startsWith('data:')) {
      showToast('Imgur 업로드 중…');
    }
    const finalUrl = await ensureExternalUrl(target);
    onPhotoReady(finalUrl, action);
    showToast(action === 'hero' ? 'Hero 사진으로 설정됐어요' : '갤러리에 추가됐어요');
  }

  async function generateBulk() {
    if (!selectedFile) {
      showToast('먼저 셀카 한 장을 선택해주세요');
      return;
    }
    if (!hasGeminiKey()) {
      setShowKey(true);
      showToast('Gemini API 키부터 입력해주세요');
      return;
    }
    setBulkBusy(true);
    setBulkResults(PHOTO_STYLES.slice(0, 4).map((s) => ({ styleId: s.id, styleLabel: s.label })));
    try {
      const { data, mimeType } = await fileToBase64(selectedFile);
      const top4 = PHOTO_STYLES.slice(0, 4);
      const settled = await Promise.allSettled(
        top4.map((s) => generateWeddingPhoto(data, mimeType, s.prompt))
      );
      const next: BulkResult[] = top4.map((s, i) => {
        const r = settled[i];
        if (r.status === 'fulfilled') {
          return { styleId: s.id, styleLabel: s.label, dataUrl: r.value.dataUrl };
        }
        return { styleId: s.id, styleLabel: s.label, error: (r.reason as Error)?.message || 'unknown' };
      });
      setBulkResults(next);
      const ok = next.filter((r) => r.dataUrl).length;
      showToast(`4장 중 ${ok}장 생성 완료`);
    } catch (e) {
      showToast((e as Error).message);
    } finally {
      setBulkBusy(false);
    }
  }

  function saveFalKey() {
    setFalKey(falKeyInput);
    showToast(falKeyInput.trim() ? 'fal.ai 키 저장됨' : 'fal.ai 키 삭제됨');
    if (falKeyInput.trim()) setShowFalKey(false);
  }

  async function makeVideo() {
    if (!resultUrl) {
      showToast('먼저 사진을 생성하세요');
      return;
    }
    if (!hasFalKey()) {
      setShowFalKey(true);
      showToast('fal.ai API 키부터 입력해주세요');
      return;
    }
    setVideoBusy(true);
    setVideoStatus('이미지 호스팅 준비 중…');
    setVideoUrl('');
    try {
      let imageUrl = resultUrl;
      if (imageUrl.startsWith('data:')) {
        if (!hasImgurClientId()) {
          throw new Error('영상 생성에는 외부 URL이 필요해요. 설정에서 Imgur Client ID를 입력하거나 사진을 외부 URL로 교체해주세요.');
        }
        const up = await uploadDataUrl(imageUrl);
        imageUrl = up.url;
      }
      const url = await generateVideo({
        imageUrl,
        motionBucketId: motion,
        onProgress: setVideoStatus,
      });
      setVideoUrl(url);
      setVideoStatus('완료');
      showToast('영상 생성 완료');
    } catch (e) {
      setVideoStatus('');
      showToast((e as Error).message);
    } finally {
      setVideoBusy(false);
    }
  }

  function attachVideo() {
    if (!videoUrl || !onVideoReady) return;
    onVideoReady(videoUrl);
    showToast('Hero 영상으로 설정됐어요');
  }

  if (!open) {
    return (
      <div style={{ marginTop: 12, padding: 12, background: '#fef3f7', border: '1px dashed #f0a4bd', borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 13, color: '#7a2c44' }}>
            🎀 <b>스튜디오 촬영 200~400만원 절약</b> — 셀카 1장으로 한복·드레스·야외 합성
          </div>
          <button type="button" onClick={() => setOpen(true)} style={{ background: '#a83960', color: '#fff', border: 'none', padding: '6px 14px', fontSize: 12, borderRadius: 6, cursor: 'pointer' }}>
            AI 사진 스튜디오 열기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 12, padding: 16, background: '#fff', border: '1px solid #f0a4bd', borderRadius: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 15 }}>🎀 AI 사진 스튜디오</h3>
        <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>×</button>
      </div>

      {(showKey || !hasGeminiKey()) && (
        <div style={{ marginBottom: 14, padding: 10, background: '#fffbe9', border: '1px solid #f0d97a', borderRadius: 6 }}>
          <p style={{ fontSize: 12, color: '#7a5a14', margin: '0 0 6px' }}>
            Google AI Studio에서 무료 API 키 발급:{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style={{ color: '#a83960' }}>
              aistudio.google.com/app/apikey
            </a>
            {' '}— 하루 무료 할당량 충분
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIza...로 시작하는 키"
              style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }}
            />
            <button type="button" onClick={saveKey} style={primaryBtn()}>저장</button>
          </div>
          <p style={{ fontSize: 11, color: '#999', margin: '6px 0 0' }}>
            ※ 키는 이 브라우저에만 저장됩니다 (서버 전송 없음)
          </p>
        </div>
      )}

      {hasGeminiKey() && !showKey && (
        <p style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>
          ✓ API 키 저장됨 · <button type="button" onClick={() => setShowKey(true)} style={linkBtn()}>키 변경</button>
        </p>
      )}

      <div style={{ display: 'grid', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 6 }}>1. 셀카·인물 사진 업로드</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            style={{ fontSize: 12 }}
          />
          {previewUrl && (
            <div style={{ marginTop: 8 }}>
              <img src={previewUrl} alt="원본" style={{ maxWidth: 200, maxHeight: 200, borderRadius: 6, border: '1px solid #eee' }} />
            </div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 6 }}>2. 스타일 선택</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 6 }}>
            {PHOTO_STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => { setStyleId(s.id); setCustomPrompt(''); }}
                style={{
                  background: styleId === s.id && !customPrompt ? '#a83960' : '#fff',
                  color: styleId === s.id && !customPrompt ? '#fff' : '#333',
                  border: `1px solid ${styleId === s.id && !customPrompt ? '#a83960' : '#ddd'}`,
                  padding: '8px 6px',
                  fontSize: 11,
                  borderRadius: 6,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 18 }}>{s.emoji}</div>
                <div>{s.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 6 }}>또는 직접 묘사 (선택)</label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="예) 1960년대 파리 빈티지 무드, 바이오레이트 정원 결혼식, 흐릿한 보케 빛"
            style={{ width: '100%', minHeight: 50, padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 12 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" onClick={generate} disabled={busy || bulkBusy} style={{ ...primaryBtn(busy || bulkBusy), flex: '1 1 200px' }}>
            {busy ? '생성 중… (10~20초)' : '🎨 1장 생성'}
          </button>
          <button type="button" onClick={generateBulk} disabled={busy || bulkBusy} style={{ ...secondaryBtn(), flex: '1 1 200px', opacity: busy || bulkBusy ? 0.6 : 1 }}>
            {bulkBusy ? '4장 생성 중…' : '🎨 4스타일 한번에'}
          </button>
        </div>

        {bulkResults.length > 0 && (
          <div>
            <p style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>4스타일 결과:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {bulkResults.map((r) => (
                <div key={r.styleId} style={{ border: '1px solid #eee', borderRadius: 6, padding: 6 }}>
                  <p style={{ fontSize: 11, color: '#666', margin: '0 0 4px' }}>{r.styleLabel}</p>
                  {r.dataUrl ? (
                    <>
                      <img src={r.dataUrl} alt={r.styleLabel} style={{ width: '100%', borderRadius: 4 }} />
                      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                        <button type="button" onClick={() => attach('hero', r.dataUrl)} style={{ ...primaryBtn(), padding: '4px 8px', fontSize: 10, flex: 1 }}>Hero</button>
                        <button type="button" onClick={() => attach('gallery', r.dataUrl)} style={{ ...secondaryBtn(), padding: '4px 8px', fontSize: 10, flex: 1 }}>갤러리</button>
                      </div>
                    </>
                  ) : r.error ? (
                    <div style={{ fontSize: 10, color: '#c33', padding: 8 }}>{r.error.slice(0, 80)}</div>
                  ) : (
                    <div style={{ fontSize: 10, color: '#999', padding: 8, textAlign: 'center' }}>생성 중…</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {resultUrl && (
          <div>
            <p style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>생성된 사진:</p>
            <img src={resultUrl} alt="생성됨" style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid #eee' }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => attach('hero')} style={primaryBtn()}>Hero 사진으로</button>
              <button type="button" onClick={() => attach('gallery')} style={secondaryBtn()}>갤러리에 추가</button>
              <a href={resultUrl} download={`ai-wedding-${Date.now()}.png`} style={{ ...secondaryBtn(), textDecoration: 'none', display: 'inline-block' }}>
                다운로드
              </a>
              <button type="button" onClick={generate} style={secondaryBtn()}>다시 생성</button>
            </div>
            <p style={{ fontSize: 10, color: '#aaa', marginTop: 6 }}>
              ※ Imgur 키가 있으면 공유 시 자동 외부 URL 변환. 없으면 base64로 저장 (URL 길어짐).
            </p>

            <div style={{ marginTop: 14, padding: 12, background: '#fafafa', border: '1px solid #eee', borderRadius: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 8px' }}>🎬 이 사진으로 영상 만들기 (fal.ai)</p>
              {(showFalKey || !hasFalKey()) && (
                <div style={{ marginBottom: 10, padding: 8, background: '#fffbe9', border: '1px solid #f0d97a', borderRadius: 6 }}>
                  <p style={{ fontSize: 11, color: '#7a5a14', margin: '0 0 6px' }}>
                    fal.ai에서 키 발급:{' '}
                    <a href="https://fal.ai/dashboard/keys" target="_blank" rel="noopener" style={{ color: '#a83960' }}>
                      fal.ai/dashboard/keys
                    </a>
                    {' '}— 4초 영상 약 $0.10
                  </p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="password"
                      value={falKeyInput}
                      onChange={(e) => setFalKeyInput(e.target.value)}
                      placeholder="fal-...로 시작하는 키"
                      style={{ flex: 1, padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: 11, fontFamily: 'monospace' }}
                    />
                    <button type="button" onClick={saveFalKey} style={{ ...primaryBtn(), padding: '6px 10px', fontSize: 11 }}>저장</button>
                  </div>
                </div>
              )}
              {hasFalKey() && !showFalKey && (
                <p style={{ fontSize: 10, color: '#888', marginBottom: 8 }}>
                  ✓ fal.ai 키 저장됨 · <button type="button" onClick={() => setShowFalKey(true)} style={linkBtn()}>키 변경</button>
                </p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 8 }}>
                {MOTION_PRESETS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMotion(m.id)}
                    style={{
                      background: motion === m.id ? '#a83960' : '#fff',
                      color: motion === m.id ? '#fff' : '#333',
                      border: `1px solid ${motion === m.id ? '#a83960' : '#ddd'}`,
                      padding: 6,
                      fontSize: 11,
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{m.label}</div>
                    <div style={{ fontSize: 9, opacity: 0.8 }}>{m.hint}</div>
                  </button>
                ))}
              </div>

              <button type="button" onClick={makeVideo} disabled={videoBusy} style={{ ...primaryBtn(videoBusy), width: '100%' }}>
                {videoBusy ? `생성 중… ${videoStatus}` : '🎬 4초 영상 생성 (60~90초 소요)'}
              </button>

              {videoUrl && (
                <div style={{ marginTop: 10 }}>
                  <video src={videoUrl} controls loop muted style={{ width: '100%', borderRadius: 6 }} />
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    {onVideoReady && (
                      <button type="button" onClick={attachVideo} style={primaryBtn()}>Hero 영상으로</button>
                    )}
                    <a href={videoUrl} target="_blank" rel="noopener" style={{ ...secondaryBtn(), textDecoration: 'none' }}>
                      새 탭에서 열기
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function primaryBtn(disabled?: boolean): React.CSSProperties {
  return {
    background: disabled ? '#c89eb0' : '#a83960',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    fontSize: 13,
    borderRadius: 6,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}

function secondaryBtn(): React.CSSProperties {
  return {
    background: '#fff',
    color: '#a83960',
    border: '1px solid #a83960',
    padding: '8px 14px',
    fontSize: 12,
    borderRadius: 6,
    cursor: 'pointer',
  };
}

function linkBtn(): React.CSSProperties {
  return {
    background: 'none',
    border: 'none',
    color: '#a83960',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: 11,
    padding: 0,
  };
}
