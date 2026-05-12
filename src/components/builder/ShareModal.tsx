import { useEffect, useState } from 'react';
import { qrImageUrl } from '../../lib/qrcode';
import { lockBodyScroll, unlockBodyScroll } from '../../lib/scrollLock';
import { shortenUrl } from '../../lib/shortener';
import { showToast } from '../../lib/toast';
import { downloadBusinessCard } from '../../lib/businessCard';

interface Props {
  shareUrl: string;
  warning: string | null;
  /** Couple info — used to build the printable business card. */
  card?: {
    groomName: string;
    brideName: string;
    date: string;
    accent?: string;
  };
  onClose: () => void;
  onCopy: (url: string) => void;
  onShare: (url: string) => void;
  onDownloadQr: (url: string) => void;
}

export function ShareModal({
  shareUrl,
  warning,
  card,
  onClose,
  onCopy,
  onShare,
  onDownloadQr,
}: Props) {
  const [displayUrl, setDisplayUrl] = useState(shareUrl);
  const [shortening, setShortening] = useState(false);
  const [shortAttempted, setShortAttempted] = useState(false);

  useEffect(() => {
    lockBodyScroll();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => {
      unlockBodyScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  useEffect(() => {
    setDisplayUrl(shareUrl);
    setShortAttempted(false);
  }, [shareUrl]);

  const qr = qrImageUrl(displayUrl, 280);
  const canNativeShare =
    typeof navigator !== 'undefined' && !!navigator.share;
  const isShortened = displayUrl !== shareUrl;

  async function handleShorten() {
    if (shortening) return;
    setShortening(true);
    setShortAttempted(true);
    try {
      const short = await shortenUrl(shareUrl);
      setDisplayUrl(short);
      showToast('짧은 링크로 변환됐어요');
    } catch (e) {
      showToast((e as Error).message);
    } finally {
      setShortening(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="공유 링크"
    >
      <div className="modal-card share-modal" onClick={(e) => e.stopPropagation()}>
        <h3>공유 링크가 생성되었어요</h3>
        <p className="muted-text" style={{ marginBottom: 14 }}>
          링크 하나로 누구나 청첩장을 열 수 있습니다. 카카오톡·문자·SNS 어디든 공유하세요.
        </p>

        <div className="share-grid">
          {qr ? (
            <div className="share-qr">
              <img src={qr} alt="청첩장 QR 코드" loading="lazy" />
              <button
                type="button"
                className="share-qr-download"
                onClick={() => onDownloadQr(displayUrl)}
              >
                QR 크게 보기
              </button>
            </div>
          ) : (
            <div className="share-qr share-qr--unavailable" aria-hidden>
              <p>링크가 길어 QR로 만들 수 없어요</p>
            </div>
          )}

          <div className="share-info">
            <div className="url-display" data-full-url={displayUrl}>
              {displayUrl}
            </div>
            <div className="url-meta">
              <span className="url-len">{displayUrl.length}자</span>
              {isShortened && <span className="url-badge">짧은 링크</span>}
            </div>

            {!isShortened && (
              <button
                type="button"
                className="url-shorten"
                onClick={handleShorten}
                disabled={shortening}
              >
                {shortening
                  ? '단축 중…'
                  : shortAttempted
                  ? '다시 단축 시도'
                  : '짧은 링크로 변환'}
              </button>
            )}

            {warning && <p className="share-warning">⚠ {warning}</p>}
            <p className="muted-text" style={{ marginTop: 12 }}>
              {isShortened
                ? '단축 링크는 외부 서비스(cleanuri/is.gd)를 거치므로, 원본 영구 링크도 함께 보관해주세요.'
                : '모든 정보가 URL에 인코딩되므로 서버 비용이 들지 않으며, 링크는 영구적으로 작동합니다.'}
            </p>
          </div>
        </div>

        <div className="extra-tools">
          {card && (
            <button
              type="button"
              className="extra-btn"
              onClick={async () => {
                try {
                  await downloadBusinessCard({ ...card, url: displayUrl });
                  showToast('명함 QR을 저장했어요');
                } catch (e) {
                  showToast((e as Error).message);
                }
              }}
            >
              🪪 명함 QR 저장
            </button>
          )}
          <a
            href={displayUrl}
            target="_blank"
            rel="noopener"
            className="extra-btn"
            onClick={() => {
              // Auto-trigger print on the opened preview tab after a short
              // delay. Browsers vary on auto-print; we add a hint instead
              // of relying on it. The link itself opens the invite, where
              // users can use the browser's "Print → Save as PDF".
            }}
          >
            🖨️ 인쇄용 미리보기
          </a>
        </div>

        <div className="actions actions-share">
          <button onClick={onClose}>닫기</button>
          <a href={displayUrl} target="_blank" rel="noopener" className="btn-link">
            미리보기 열기
          </a>
          <button onClick={() => onCopy(displayUrl)}>링크 복사</button>
          {canNativeShare && (
            <button className="primary" onClick={() => onShare(displayUrl)}>
              공유하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
