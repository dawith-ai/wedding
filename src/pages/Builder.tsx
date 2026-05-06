import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import type { ThemeId, WeddingData } from '../types';
import { DEFAULT_DATA } from '../data/defaults';
import { THEMES, loadThemeFonts } from '../data/themes';
import { loadDraft, saveDraft, clearDraft } from '../lib/storage';
import { buildShareUrl, encodeData } from '../lib/encode';
import { BuilderForm } from '../components/builder/BuilderForm';
import { InviteView } from '../components/invite/InviteView';
import { showToast, Toast } from '../components/invite/Toast';
import { inviteIdFromEncoded } from '../lib/storage';

export function Builder() {
  const [params] = useSearchParams();
  const [data, setData] = useState<WeddingData>(() => {
    const draft = loadDraft();
    if (draft) return draft;
    const themeParam = params.get('theme') as ThemeId | null;
    if (themeParam && THEMES.some((t) => t.id === themeParam)) {
      return { ...DEFAULT_DATA, theme: themeParam };
    }
    return DEFAULT_DATA;
  });

  const [shareUrl, setShareUrl] = useState<string>('');
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    THEMES.forEach(loadThemeFonts);
  }, []);

  useEffect(() => {
    saveDraft(data);
  }, [data]);

  async function publish() {
    try {
      const encoded = await encodeData(data);
      const url = buildShareUrl(encoded);
      setShareUrl(url);
      setShowShare(true);
    } catch (e) {
      showToast((e as Error).message);
    }
  }

  function copyUrl() {
    navigator.clipboard?.writeText(shareUrl).then(
      () => showToast('링크가 복사되었습니다'),
      () => showToast('복사에 실패했어요')
    );
  }

  function reset() {
    if (!confirm('모든 입력을 초기화할까요?')) return;
    clearDraft();
    setData(DEFAULT_DATA);
    showToast('초기화되었습니다');
  }

  // For preview: stable inviteId from data so guestbook works in preview
  const previewId = useMemo(() => {
    return inviteIdFromEncoded(`${data.groom.name}-${data.bride.name}-${data.wedding.date}`);
  }, [data.groom.name, data.bride.name, data.wedding.date]);

  return (
    <div className="builder-shell">
      <div>
        <BuilderForm data={data} onChange={setData} onPublish={publish} />
        <div style={{ padding: '0 28px 60px', background: '#fff' }}>
          <button
            type="button"
            onClick={reset}
            style={{
              background: 'transparent',
              border: '1px solid #eee',
              color: '#a00',
              padding: '8px 16px',
              borderRadius: 6,
              fontSize: 12,
            }}
          >
            모두 초기화
          </button>
          <Link to="/" style={{ marginLeft: 12, fontSize: 12, color: '#666' }}>
            ← 홈으로
          </Link>
        </div>
      </div>

      <div className="preview-pane">
        <div style={{ position: 'sticky', top: 0, marginBottom: 12, fontSize: 12, color: '#666', textAlign: 'center' }}>
          실시간 미리보기
        </div>
        <InviteView data={data} inviteId={previewId} shareUrl="" isPreview />
      </div>

      {showShare && (
        <div className="modal-overlay" onClick={() => setShowShare(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>공유 링크가 생성되었어요</h3>
            <p className="muted-text" style={{ marginBottom: 14 }}>
              아래 링크 하나만 있으면 누구나 청첩장을 볼 수 있습니다. 카카오톡, 문자 등으로 공유해주세요.
            </p>
            <div className="url-display">{shareUrl}</div>
            <p className="muted-text">
              ※ 모든 정보가 URL에 인코딩됩니다. 매우 긴 사진을 잔뜩 추가하면 일부 메신저에서 링크가 잘릴 수 있습니다.
            </p>
            <div className="actions">
              <button onClick={() => setShowShare(false)}>닫기</button>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener"
                style={{
                  display: 'inline-block',
                  padding: '9px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 999,
                  fontSize: 13,
                  textDecoration: 'none',
                  color: '#222',
                }}
              >
                새 탭에서 열기
              </a>
              <button className="primary" onClick={copyUrl}>링크 복사</button>
            </div>
          </div>
        </div>
      )}

      <Toast />
    </div>
  );
}
