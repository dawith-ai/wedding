import { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import type { WeddingData } from '../types';
import { decodeData } from '../lib/encode';
import { inviteIdFromEncoded } from '../lib/storage';
import { InviteView } from '../components/invite/InviteView';
import { setFirebaseConfig } from '../lib/firebase';

export function Invite() {
  const { encoded = '', coupleId } = useParams<{ encoded: string; coupleId?: string }>();
  const location = useLocation();
  const [data, setData] = useState<WeddingData | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    decodeData(encoded)
      .then((d) => {
        if (!cancelled) {
          if (d.firebase?.apiKey && d.firebase.projectId) setFirebaseConfig(d.firebase);
          setData(d);
          setReady(true);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : '청첩장을 불러올 수 없습니다');
          setReady(true);
        }
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

  if (!data || !ready) {
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

  const inviteId = coupleId || data.coupleId || inviteIdFromEncoded(encoded);
  const shareUrl = window.location.href;
  const guestName = new URLSearchParams(location.search).get('to')?.trim() || undefined;

  return <InviteView data={data} inviteId={inviteId} shareUrl={shareUrl} guestName={guestName} />;
}
