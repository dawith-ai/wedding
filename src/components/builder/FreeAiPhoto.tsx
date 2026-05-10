import { useState } from 'react';
import { FREE_STYLES, buildFreeAiUrl, probeImage } from '../../lib/freeAiPhoto';
import { showToast } from '../../lib/toast';

interface Props {
  groomName: string;
  brideName: string;
  onPhotoReady: (url: string, action: 'gallery' | 'hero') => void;
}

export function FreeAiPhoto({ groomName, brideName, onPhotoReady }: Props) {
  const [open, setOpen] = useState(false);
  const [styleId, setStyleId] = useState(FREE_STYLES[0].id);
  const [extra, setExtra] = useState('');
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  async function generate() {
    const style = FREE_STYLES.find((s) => s.id === styleId) || FREE_STYLES[0];
    const personHint = groomName && brideName ? ` Couple names ${groomName} and ${brideName}.` : '';
    const fullPrompt = `${style.promptPrefix}.${personHint}${extra ? ' ' + extra.trim() : ''}`;
    const seed = Math.floor(Math.random() * 1_000_000);
    const url = buildFreeAiUrl({ prompt: fullPrompt, seed, width: 1024, height: 1280 });
    setBusy(true);
    setPreviewUrl('');
    showToast('AI 사진 생성 중… (10~25초)');
    const ok = await probeImage(url, 60000);
    setBusy(false);
    if (!ok) {
      showToast('생성 실패. 잠시 후 다시 시도하거나 Gemini 모드를 사용해주세요');
      return;
    }
    setPreviewUrl(url);
    showToast('생성 완료');
  }

  function attach(action: 'gallery' | 'hero') {
    if (!previewUrl) return;
    onPhotoReady(previewUrl, action);
    showToast(action === 'hero' ? 'Hero 사진으로 설정됐어요' : '갤러리에 추가됐어요');
  }

  if (!open) {
    return (
      <div style={{ marginTop: 12, padding: 12, background: '#ecfdf5', border: '1px dashed #6ee7b7', borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 13, color: '#065f46' }}>
            ⚡ <b>무료 AI 사진 생성 (키 필요 없음)</b> — Pollinations.ai 기반 FLUX 모델, 0원
          </div>
          <button type="button" onClick={() => setOpen(true)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 14px', fontSize: 12, borderRadius: 6, cursor: 'pointer' }}>
            무료 AI로 만들기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 12, padding: 16, background: '#fff', border: '1px solid #6ee7b7', borderRadius: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 15 }}>⚡ 무료 AI 사진 (Pollinations.ai)</h3>
        <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>×</button>
      </div>

      <p style={{ fontSize: 12, color: '#065f46', margin: '0 0 12px', lineHeight: 1.5 }}>
        API 키 없음 · 가입 없음 · 비용 0원. FLUX 오픈소스 모델로 사진 생성. 결과 URL이 청첩장 데이터에 저장되어 카톡 공유 시에도 그대로 표시됨.
      </p>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 6 }}>스타일</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 6 }}>
          {FREE_STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStyleId(s.id)}
              style={{
                background: styleId === s.id ? '#10b981' : '#fff',
                color: styleId === s.id ? '#fff' : '#333',
                border: `1px solid ${styleId === s.id ? '#10b981' : '#ddd'}`,
                padding: '8px 6px',
                fontSize: 11,
                borderRadius: 6,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 18 }}>{s.emoji}</div>
              <div style={{ marginTop: 2 }}>{s.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 6 }}>추가 묘사 (선택)</label>
        <textarea
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder="예) cinematic 1960s vintage mood, soft pastel palette"
          style={{ width: '100%', minHeight: 50, padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 12 }}
        />
      </div>

      <button type="button" onClick={generate} disabled={busy} style={{ background: busy ? '#86efac' : '#10b981', color: '#fff', border: 'none', padding: '10px 16px', fontSize: 13, borderRadius: 6, cursor: busy ? 'not-allowed' : 'pointer', width: '100%' }}>
        {busy ? '생성 중… (10~25초)' : '🎨 무료로 사진 생성'}
      </button>

      {previewUrl && (
        <div style={{ marginTop: 12 }}>
          <img src={previewUrl} alt="AI 생성 사진" style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid #eee' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            <button type="button" onClick={() => attach('hero')} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 14px', fontSize: 12, borderRadius: 6, cursor: 'pointer' }}>Hero로 설정</button>
            <button type="button" onClick={() => attach('gallery')} style={{ background: '#fff', color: '#10b981', border: '1px solid #10b981', padding: '8px 14px', fontSize: 12, borderRadius: 6, cursor: 'pointer' }}>갤러리에 추가</button>
            <button type="button" onClick={generate} style={{ background: '#fff', color: '#10b981', border: '1px solid #10b981', padding: '8px 14px', fontSize: 12, borderRadius: 6, cursor: 'pointer' }}>다시 생성</button>
          </div>
          <p style={{ fontSize: 10, color: '#888', marginTop: 6 }}>
            ※ Pollinations URL이 그대로 저장됩니다. 결과는 seed 고정이라 다음에 청첩장 열어도 같은 사진. 더 높은 품질·얼굴 보존 원하시면 Gemini 모드로 전환.
          </p>
        </div>
      )}
    </div>
  );
}
