import { useEffect, useState } from 'react';
import { lockBodyScroll, unlockBodyScroll } from '../../lib/scrollLock';

interface Props {
  groomName: string;
  brideName: string;
  date: string;
  onOpened?: () => void;
}

export function Curtain({ groomName, brideName, date, onOpened }: Props) {
  const [opening, setOpening] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [done]);

  function open() {
    setOpening(true);
    window.setTimeout(() => {
      setDone(true);
      onOpened?.();
    }, 1300);
  }

  if (done) return null;
  return (
    <div className={`curtain-overlay${opening ? ' opening' : ''}`}>
      <div className="curtain-panel left" />
      <div className="curtain-panel right" />
      <div className="curtain-message">
        <p style={{ letterSpacing: '0.4em', fontSize: 13, opacity: 0.8 }}>
          {date.replace(/-/g, '.')}
        </p>
        <h2 style={{ fontSize: 28, margin: 0 }}>
          {groomName} <span style={{ opacity: 0.7 }}>♥</span> {brideName}
        </h2>
        <button onClick={open}>초대장 열기</button>
      </div>
    </div>
  );
}
