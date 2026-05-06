import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { WeddingData } from '../types';
import { decodeData } from '../lib/encode';
import { inviteIdFromEncoded } from '../lib/storage';
import { InviteView } from '../components/invite/InviteView';

export function Invite() {
  const { encoded = '' } = useParams<{ encoded: string }>();
  const [data, setData] = useState<WeddingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    decodeData(encoded)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : '청첩장을 불러올 수 없습니다');
      });
    return () => {
      cancelled = true;
    };
  }, [encoded]);

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 32,
        color: '#444',
      }}>
        <h2 style={{ fontWeight: 500, marginBottom: 12 }}>청첩장을 불러올 수 없습니다</h2>
        <p style={{ fontSize: 14, color: '#777', maxWidth: 360, lineHeight: 1.7 }}>
          링크가 손상되었거나 잘못 전달되었을 수 있어요.<br />
          신랑·신부에게 다시 받아주세요.
        </p>
        <Link
          to="/"
          style={{
            marginTop: 24, padding: '10px 24px',
            background: '#222', color: '#fff', borderRadius: 999, fontSize: 13,
          }}
        >
          홈으로
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: '#888', fontSize: 14,
      }}>
        청첩장을 여는 중…
      </div>
    );
  }

  const inviteId = inviteIdFromEncoded(encoded);
  const shareUrl = window.location.href;

  return <InviteView data={data} inviteId={inviteId} shareUrl={shareUrl} />;
}
