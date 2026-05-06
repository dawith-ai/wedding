import { useEffect, useState } from 'react';
import { isFirebaseEnabled, getFirebaseConfig } from '../../lib/firebase';

interface Props {
  inviteId: string;
}

const LS_COUNT = (id: string) => `wedding_likes_count_${id}`;
const LS_LIKED = (id: string) => `wedding_likes_liked_${id}`;

async function fbReadLikes(inviteId: string): Promise<number> {
  const c = getFirebaseConfig();
  if (!c) return 0;
  const url = `https://firestore.googleapis.com/v1/projects/${c.projectId}/databases/(default)/documents/likes_${inviteId}/counter?key=${c.apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return 0;
    const json = (await res.json()) as { fields?: { count?: { integerValue?: string } } };
    return Number(json.fields?.count?.integerValue || 0);
  } catch {
    return 0;
  }
}

async function fbWriteLikes(inviteId: string, n: number): Promise<void> {
  const c = getFirebaseConfig();
  if (!c) return;
  const url = `https://firestore.googleapis.com/v1/projects/${c.projectId}/databases/(default)/documents/likes_${inviteId}/counter?key=${c.apiKey}`;
  await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: { count: { integerValue: String(n) } } }),
  }).catch(() => {});
}

export function LikeButton({ inviteId }: Props) {
  const [count, setCount] = useState<number>(() => {
    const raw = localStorage.getItem(LS_COUNT(inviteId));
    return raw ? Number(raw) || 0 : 0;
  });
  const [liked, setLiked] = useState<boolean>(() => {
    return localStorage.getItem(LS_LIKED(inviteId)) === '1';
  });
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    if (isFirebaseEnabled()) {
      fbReadLikes(inviteId).then((n) => {
        if (n > 0) {
          setCount(n);
          localStorage.setItem(LS_COUNT(inviteId), String(n));
        }
      });
    }
  }, [inviteId]);

  function toggle() {
    setPopping(true);
    window.setTimeout(() => setPopping(false), 380);

    const next = liked ? Math.max(0, count - 1) : count + 1;
    setCount(next);
    setLiked(!liked);
    localStorage.setItem(LS_COUNT(inviteId), String(next));
    localStorage.setItem(LS_LIKED(inviteId), liked ? '0' : '1');
    if (isFirebaseEnabled()) {
      fbWriteLikes(inviteId, next);
    }
  }

  return (
    <div className="like-wrap">
      <button
        className={`like-btn${liked ? ' liked' : ''}${popping ? ' pop' : ''}`}
        onClick={toggle}
        aria-pressed={liked}
        aria-label="응원하기"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
          <path
            d="M12 21s-7.5-4.5-9.5-9.2C1 8.4 3 5 6.4 5c2 0 3.5 1.1 4.6 2.7C12.1 6.1 13.6 5 15.6 5 19 5 21 8.4 19.5 11.8 17.5 16.5 12 21 12 21z"
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        <span className="like-count">{count}</span>
        <span className="like-label">응원</span>
      </button>
    </div>
  );
}
