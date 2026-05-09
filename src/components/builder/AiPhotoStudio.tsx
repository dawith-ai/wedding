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
import { showToast } from '../../lib/toast';

interface Props {
  onPhotoReady: (dataUrl: string, action: 'gallery' | 'hero') => void;
}

export function AiPhotoStudio({ onPhotoReady }: Props) {
  const [open, setOpen] = useState(false);
  const [keyInput, setKeyInput] = useState(getGeminiKey());
  const [showKey, setShowKey] = useState(!hasGeminiKey());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [styleId, setStyleId] = useState(PHOTO_STYLES[0].id);
  const [customPrompt, setCustomPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const [resultUrl, setResultUrl] = useState<string>('');
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

  async function attach(action: 'gallery' | 'hero') {
    if (!resultUrl) return;
    let finalUrl = resultUrl;
    if (resultUrl.startsWith('data:') && hasImgurClientId()) {
      try {
        showToast('Imgur 업로드 중…');
        const up = await uploadDataUrl(resultUrl);
        finalUrl = up.url;
      } catch (e) {
        showToast(`Imgur 업로드 실패, base64로 저장합니다: ${(e as Error).message}`);
      }
    } else if (resultUrl.startsWith('data:')) {
      showToast('⚠️ Imgur 키가 없어 base64로 저장됩니다 — 공유 URL이 길어질 수 있어요. 설정에서 Imgur Client ID 추가 권장.');
    }
    onPhotoReady(finalUrl, action);
    showToast(action === 'hero' ? 'Hero 사진으로 설정됐어요' : '갤러리에 추가됐어요');
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

        <button type="button" onClick={generate} disabled={busy} style={primaryBtn(busy)}>
          {busy ? '생성 중… (10~20초)' : '🎨 사진 생성'}
        </button>

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
              ※ 결과 이미지는 base64로 저장됩니다. 파일 크기가 클 경우 공유 링크가 길어질 수 있어요. 다운로드 후 외부 URL로 호스팅하면 더 안정적.
            </p>
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
