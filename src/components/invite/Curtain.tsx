import { useEffect, useMemo, useRef, useState } from 'react';
import { lockBodyScroll, unlockBodyScroll } from '../../lib/scrollLock';
import { OrnamentCanvas } from './Ornaments';
import type { OrnamentKind } from '../../data/themes';

interface Props {
  groomName: string;
  brideName: string;
  date: string;
  heroImage?: string;
  ornament?: OrnamentKind;
  layout?: string;
  onOpened?: () => void;
}

function formatDate(date: string): string {
  if (!date) return '';
  const parts = date.split('-');
  if (parts.length !== 3) return date;
  return `${parts[0]}.${parts[1]}.${parts[2]}`;
}

function getWeekday(date: string): string {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()];
}

export function Curtain({
  groomName,
  brideName,
  date,
  heroImage,
  ornament = 'none',
  layout = 'overlay',
  onOpened,
}: Props) {
  const [opening, setOpening] = useState(false);
  const [done, setDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }, []);

  useEffect(() => {
    if (done) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [done]);

  // Stagger reveal: appear shortly after mount so content fades in cleanly
  useEffect(() => {
    if (prefersReducedMotion) {
      setRevealed(true);
      return;
    }
    const t = window.setTimeout(() => setRevealed(true), 60);
    return () => window.clearTimeout(t);
  }, [prefersReducedMotion]);

  // Focus the open button so keyboard users can press Enter / Space immediately
  useEffect(() => {
    if (!revealed) return;
    btnRef.current?.focus({ preventScroll: true });
  }, [revealed]);

  function open() {
    if (opening) return;
    setOpening(true);
    const delay = prefersReducedMotion ? 200 : 1400;
    window.setTimeout(() => {
      setDone(true);
      onOpened?.();
    }, delay);
  }

  // Press ESC or Enter to skip / open
  useEffect(() => {
    if (done) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        if (opening) return;
        e.preventDefault();
        open();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, opening]);

  if (done) return null;

  const weekday = getWeekday(date);
  const formatted = formatDate(date);

  return (
    <div
      className={[
        'curtain-overlay',
        revealed ? 'revealed' : '',
        opening ? 'opening' : '',
        prefersReducedMotion ? 'reduce-motion' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="dialog"
      aria-modal="true"
      aria-label="청첩장 입장"
      data-layout={layout}
    >
      {heroImage && (
        <div
          className="curtain-hero-bg"
          aria-hidden
          style={{ backgroundImage: `url(${heroImage})` }}
        />
      )}
      <div className="curtain-tint" aria-hidden />

      {ornament !== 'none' && (
        <div className="curtain-ornament" aria-hidden>
          <OrnamentCanvas kind={ornament} />
        </div>
      )}

      <div className="curtain-panel left" aria-hidden />
      <div className="curtain-panel right" aria-hidden />

      <div className="curtain-message">
        <p className="curtain-label">Wedding Invitation</p>
        {formatted && (
          <p className="curtain-date">
            <span>{formatted}</span>
            {weekday && <em className="curtain-weekday">{weekday}</em>}
          </p>
        )}
        <h2 className="curtain-names">
          <span>{groomName}</span>
          <em className="curtain-amp" aria-hidden>
            &amp;
          </em>
          <span>{brideName}</span>
        </h2>
        <div className="curtain-divider" aria-hidden />
        <button
          ref={btnRef}
          type="button"
          onClick={open}
          className="curtain-btn"
          aria-label="초대장 열기"
        >
          <span>초대장 열기</span>
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
            <path
              d="M5 12h14M13 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="curtain-hint" aria-hidden>
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path
              d="M7 10l5 5 5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
