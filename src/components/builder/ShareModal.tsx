import { useEffect } from 'react';
import { qrImageUrl } from '../../lib/qrcode';
import { lockBodyScroll, unlockBodyScroll } from '../../lib/scrollLock';

interface Props {
  shareUrl: string;
  warning: string | null;
  onClose: () => void;
  onCopy: () => void;
  onShare: () => void;
  onDownloadQr: () => void;
}

export function ShareModal({
  shareUrl,
  warning,
  onClose,
  onCopy,
  onShare,
  onDownloadQr,
}: Props) {
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

  const qr = qrImageUrl(shareUrl, 280);
  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="공유 링크">
      <div className="modal-card share-modal" onClick={(e) => e.stopPropagation()}>
        <h3>공유 링크가 생성되었어요</h3>
        <p className="muted-text" style={{ marginBottom: 14 }}>
          링크 하나로 누구나 청첩장을 열 수 있습니다. 카카오톡·문자·SNS 어디든 공유하세요.
        </p>

        <div className="share-grid">
          {qr ? (
            <div className="share-qr">
              <img src={qr} alt="청첩장 QR 코드" loading="lazy" />
              <button type="button" className="share-qr-download" onClick={onDownloadQr}>
                QR 크게 보기
              </button>
            </div>
          ) : (
            <div className="share-qr share-qr--unavailable" aria-hidden>
              <p>링크가 길어 QR로 만들 수 없어요</p>
            </div>
          )}

          <div className="share-info">
            <div className="url-display">{shareUrl}</div>
            {warning && <p className="share-warning">⚠ {warning}</p>}
            <p className="muted-text" style={{ marginTop: 12 }}>
              모든 정보가 URL에 인코딩되므로 서버 비용이 들지 않으며, 링크는 영구적으로 작동합니다.
            </p>
          </div>
        </div>

        <div className="actions actions-share">
          <button onClick={onClose}>닫기</button>
          <a href={shareUrl} target="_blank" rel="noopener" className="btn-link">
            미리보기 열기
          </a>
          <button onClick={onCopy}>링크 복사</button>
          {canNativeShare && (
            <button className="primary" onClick={onShare}>공유하기</button>
          )}
        </div>
      </div>
    </div>
  );
}
