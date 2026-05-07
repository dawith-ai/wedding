import { useEffect, useRef, useState } from 'react';
import { lockBodyScroll, unlockBodyScroll } from '../../lib/scrollLock';

interface Props {
  photos: string[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}

interface TouchState {
  type: 'pan' | 'pinch' | null;
  startX: number;
  startY: number;
  startDist: number;
  startScale: number;
}

const MAX_SCALE = 4;
const MIN_SCALE = 1;

export function PhotoViewer({ photos, index, onClose, onIndex }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const touch = useRef<TouchState>({
    type: null,
    startX: 0,
    startY: 0,
    startDist: 0,
    startScale: 1,
  });

  useEffect(() => {
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, []);

  useEffect(() => {
    setLoaded(false);
    setScale(1);
    setTx(0);
    setTy(0);
    function key(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onIndex(Math.max(0, index - 1));
      if (e.key === 'ArrowRight') onIndex(Math.min(photos.length - 1, index + 1));
    }
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [index, photos.length, onClose, onIndex]);

  function distance(touches: React.TouchList): number {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  }

  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      touch.current = {
        type: 'pinch',
        startX: 0,
        startY: 0,
        startDist: distance(e.touches),
        startScale: scale,
      };
      setInteracting(true);
    } else if (e.touches.length === 1) {
      touch.current = {
        type: 'pan',
        startX: e.touches[0].clientX - tx,
        startY: e.touches[0].clientY - ty,
        startDist: 0,
        startScale: scale,
      };
      setInteracting(true);
    }
  }

  function onTouchMove(e: React.TouchEvent) {
    const t = touch.current;
    if (t.type === 'pinch' && e.touches.length === 2) {
      const d = distance(e.touches);
      const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, (d / t.startDist) * t.startScale));
      setScale(next);
    } else if (t.type === 'pan' && e.touches.length === 1 && scale > 1) {
      setTx(e.touches[0].clientX - t.startX);
      setTy(e.touches[0].clientY - t.startY);
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    const t = touch.current;
    if (t.type === 'pan' && scale === 1) {
      // Treat as swipe to navigate when not zoomed.
      const dx = (e.changedTouches[0].clientX) - (t.startX + tx);
      if (Math.abs(dx) > 50) {
        if (dx > 0 && index > 0) onIndex(index - 1);
        else if (dx < 0 && index < photos.length - 1) onIndex(index + 1);
      }
    }
    if (scale <= 1.05) {
      setScale(1);
      setTx(0);
      setTy(0);
    }
    touch.current = { type: null, startX: 0, startY: 0, startDist: 0, startScale: 1 };
    setInteracting(false);
  }

  function onDoubleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (scale === 1) {
      setScale(2);
    } else {
      setScale(1);
      setTx(0);
      setTy(0);
    }
  }

  return (
    <div
      className="viewer"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
    >
      <button
        className="viewer-btn viewer-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="닫기"
      >
        ×
      </button>
      <button
        className="viewer-btn viewer-prev"
        onClick={(e) => {
          e.stopPropagation();
          onIndex(Math.max(0, index - 1));
        }}
        disabled={index === 0}
        aria-label="이전"
      >
        ‹
      </button>
      <button
        className="viewer-btn viewer-next"
        onClick={(e) => {
          e.stopPropagation();
          onIndex(Math.min(photos.length - 1, index + 1));
        }}
        disabled={index === photos.length - 1}
        aria-label="다음"
      >
        ›
      </button>
      <img
        key={index}
        src={photos[index]}
        alt={`확대 ${index + 1}`}
        onLoad={() => setLoaded(true)}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={onDoubleClick}
        style={{
          opacity: loaded ? 1 : 0.3,
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transition: interacting ? 'none' : 'opacity 0.2s, transform 0.2s',
          touchAction: 'none',
        }}
      />
      <div className="viewer-counter">
        {index + 1} / {photos.length}
        {scale > 1 && <span style={{ marginLeft: 8, opacity: 0.7 }}>×{scale.toFixed(1)}</span>}
      </div>
    </div>
  );
}
