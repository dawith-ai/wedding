import { useEffect, useRef, useState } from 'react';
import { lockBodyScroll, unlockBodyScroll } from '../../lib/scrollLock';

interface Props {
  code: string;
  hint?: string;
  storageKey: string;
  onUnlock: () => void;
}

/* PIN gate overlay. The PIN itself is embedded in the URL fragment and
 * not a real auth mechanism — it only stops link-leakage to casual
 * passers-by. Once entered, the unlock is remembered in localStorage
 * keyed by invite id, so guests don't have to re-enter on each visit. */
export function PinGate({ code, hint, storageKey, onUnlock }: Props) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pin.trim() === code.trim()) {
      try {
        localStorage.setItem(storageKey, '1');
      } catch {
        /* private mode — ignore */
      }
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
    }
  }

  return (
    <div className="pin-overlay" role="dialog" aria-modal="true" aria-label="비공개 청첩장">
      <div className={`pin-card${shake ? ' shake' : ''}`}>
        <div className="pin-icon" aria-hidden>
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
            <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="12" cy="15.5" r="1.6" fill="currentColor" />
          </svg>
        </div>
        <h2 className="pin-title">비공개 청첩장</h2>
        <p className="pin-sub">신랑·신부에게 전달받은 4자리 PIN을 입력해주세요</p>

        <form onSubmit={submit} className="pin-form">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={6}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/[^0-9]/g, ''));
              setError(false);
            }}
            className={`pin-input${error ? ' invalid' : ''}`}
            placeholder="• • • •"
            aria-label="PIN 입력"
          />
          {hint && <p className="pin-hint">힌트 · {hint}</p>}
          {error && <p className="pin-error">PIN이 일치하지 않아요</p>}
          <button type="submit" className="pin-submit" disabled={pin.length < 4}>
            열기
          </button>
        </form>
      </div>
    </div>
  );
}
