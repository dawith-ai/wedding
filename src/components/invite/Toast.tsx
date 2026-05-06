import { useEffect, useState } from 'react';

let externalShow: ((m: string) => void) | null = null;

export function showToast(msg: string) {
  if (externalShow) externalShow(msg);
}

export function Toast() {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    externalShow = (m: string) => {
      setMsg(m);
      setVisible(true);
      window.clearTimeout((externalShow as unknown as { _t?: number })._t);
      (externalShow as unknown as { _t?: number })._t = window.setTimeout(() => setVisible(false), 2000);
    };
    return () => {
      externalShow = null;
    };
  }, []);

  return (
    <div className={`toast${visible ? ' visible' : ''}`} role="status">
      {msg}
    </div>
  );
}
