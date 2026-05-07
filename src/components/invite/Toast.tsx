import { useEffect, useRef, useState } from 'react';
import { _registerToast } from '../../lib/toast';

export function Toast() {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return _registerToast((m) => {
      setMsg(m);
      setVisible(true);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setVisible(false), 2000);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className={`toast${visible ? ' visible' : ''}`} role="status" aria-live="polite">
      {msg}
    </div>
  );
}
