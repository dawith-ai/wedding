import { useEffect, useRef, useState } from 'react';

interface Props {
  photos: string[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}

export function PhotoViewer({ photos, index, onClose, onIndex }: Props) {
  const startX = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    function key(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onIndex(Math.max(0, index - 1));
      if (e.key === 'ArrowRight') onIndex(Math.min(photos.length - 1, index + 1));
    }
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('keydown', key);
      document.body.style.overflow = '';
    };
  }, [index, photos.length, onClose, onIndex]);

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 50) {
      if (dx > 0 && index > 0) onIndex(index - 1);
      else if (dx < 0 && index < photos.length - 1) onIndex(index + 1);
    }
    startX.current = null;
  }

  return (
    <div className="viewer" onClick={onClose} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <button className="viewer-btn viewer-close" onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="닫기">×</button>
      <button
        className="viewer-btn viewer-prev"
        onClick={(e) => { e.stopPropagation(); onIndex(Math.max(0, index - 1)); }}
        disabled={index === 0}
        aria-label="이전"
      >‹</button>
      <button
        className="viewer-btn viewer-next"
        onClick={(e) => { e.stopPropagation(); onIndex(Math.min(photos.length - 1, index + 1)); }}
        disabled={index === photos.length - 1}
        aria-label="다음"
      >›</button>
      <img
        key={index}
        src={photos[index]}
        alt={`확대 ${index + 1}`}
        onLoad={() => setLoaded(true)}
        onClick={(e) => e.stopPropagation()}
        style={{ opacity: loaded ? 1 : 0.3, transition: 'opacity 0.2s' }}
      />
      <div className="viewer-counter">{index + 1} / {photos.length}</div>
    </div>
  );
}
