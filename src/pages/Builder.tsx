import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import type { ThemeId, WeddingData } from '../types';
import { DEFAULT_DATA, normalizeWeddingData } from '../data/defaults';
import { THEMES, loadThemeFonts } from '../data/themes';
import {
  clearDraft,
  createCoupleId,
  getPublishedInvitation,
  inviteIdFromEncoded,
  loadDraft,
  saveDraft,
  savePublishedInvitation,
} from '../lib/storage';
import { buildShareUrl, encodeData, urlLengthWarning } from '../lib/encode';
import { getFirebaseConfig } from '../lib/firebase';
import { BuilderForm } from '../components/builder/BuilderForm';
import { InviteView } from '../components/invite/InviteView';
import { Toast } from '../components/invite/Toast';
import { showToast } from '../lib/toast';
import { qrImageUrl } from '../lib/qrcode';
import { ShareModal } from '../components/builder/ShareModal';
import { THEME_MAP } from '../data/themes';
import { copyText } from '../lib/clipboard';

export function Builder() {
  const [params] = useSearchParams();
  const [data, setData] = useState<WeddingData>(() => {
    const published = params.get('invite');
    const publishedData = published ? getPublishedInvitation(published)?.data : null;
    const draft = loadDraft();
    const seed = normalizeWeddingData(publishedData ?? draft);
    if (seed) return { ...seed, coupleId: seed.coupleId || createCoupleId() };
    const themeParam = params.get('theme') as ThemeId | null;
    if (themeParam && THEMES.some((t) => t.id === themeParam)) {
      return { ...DEFAULT_DATA, theme: themeParam, coupleId: createCoupleId() };
    }
    return { ...DEFAULT_DATA, coupleId: createCoupleId() };
  });

  const [shareUrl, setShareUrl] = useState<string>('');
  const [showShare, setShowShare] = useState(false);
  const [shareWarning, setShareWarning] = useState<string | null>(null);
  const [storageWarned, setStorageWarned] = useState(false);

  useEffect(() => {
    THEMES.forEach(loadThemeFonts);
  }, []);

  useEffect(() => {
    const ok = saveDraft(data);
    if (!ok && !storageWarned) {
      setStorageWarned(true);
      showToast('브라우저 저장공간이 가득 찼어요. 사진을 줄이거나 이미지 URL로 교체해주세요.');
    }
  }, [data, storageWarned]);

  async function publish() {
    try {
      const coupleId = data.coupleId || createCoupleId();
      const publishData: WeddingData = {
        ...data,
        coupleId,
        firebase: getFirebaseConfig() || data.firebase || undefined,
      };
      const encoded = await encodeData(publishData);
      if (!data.coupleId || data.firebase !== publishData.firebase) setData(publishData);
      const url = buildShareUrl(encoded, coupleId);
      const now = Date.now();
      const previous = getPublishedInvitation(coupleId);
      const saved = savePublishedInvitation({
        coupleId,
        encoded,
        title: data.meta.title,
        groomName: data.groom.name,
        brideName: data.bride.name,
        date: data.wedding.date,
        createdAt: previous?.createdAt ?? now,
        updatedAt: now,
        data: publishData,
      });
      if (!saved) showToast('배포 기록을 브라우저에 저장하지 못했어요. 링크는 계속 사용할 수 있습니다.');
      setShareUrl(url);
      setShareWarning(urlLengthWarning(url));
      setShowShare(true);
    } catch (e) {
      showToast((e as Error).message);
    }
  }

  async function copyUrl(url: string) {
    if (await copyText(url)) {
      showToast('링크가 복사되었습니다');
    } else {
      showToast('복사에 실패했어요. 주소를 길게 눌러 복사해주세요');
    }
  }

  function nativeShare(url: string) {
    if (navigator.share) {
      navigator
        .share({ title: data.meta.title, text: data.meta.description, url })
        .catch(() => {});
    } else {
      copyUrl(url);
    }
  }

  function downloadQr(url: string) {
    const qrUrl = qrImageUrl(url, 600);
    if (!qrUrl) {
      showToast('QR을 만들 수 없는 길이입니다. 갤러리 사진을 줄여보세요.');
      return;
    }
    window.open(qrUrl, '_blank', 'noopener');
  }

  function reset() {
    if (!confirm('모든 입력을 초기화할까요?')) return;
    clearDraft();
    setData({ ...DEFAULT_DATA, coupleId: createCoupleId() });
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
        <ShareModal
          shareUrl={shareUrl}
          warning={shareWarning}
          card={{
            groomName: data.groom.name,
            brideName: data.bride.name,
            date: data.wedding.date,
            accent: THEME_MAP[data.theme]?.vars['--accent'] ?? '#cc785c',
          }}
          onClose={() => setShowShare(false)}
          onCopy={copyUrl}
          onShare={nativeShare}
          onDownloadQr={downloadQr}
        />
      )}

      <Toast />
    </div>
  );
}
