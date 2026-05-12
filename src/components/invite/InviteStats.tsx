import { useEffect, useState } from 'react';
import {
  isFirebaseEnabled,
  fbListGuestbook,
  fbListRsvp,
  getFirebaseConfig,
} from '../../lib/firebase';

interface Props {
  inviteId: string;
}

const LS_LIKE_COUNT = (id: string) => `wedding_likes_count_${id}`;

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

/* Compact "X분이 응원해주셨어요" widget that pulls counts from Firebase
 * if configured, falling back to the local-storage like counter. */
export function InviteStats({ inviteId }: Props) {
  const [likes, setLikes] = useState<number>(0);
  const [guests, setGuests] = useState<number>(0);
  const [rsvps, setRsvps] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const raw = localStorage.getItem(LS_LIKE_COUNT(inviteId));
        if (raw && !cancelled) setLikes(Number(raw) || 0);
      } catch {
        /* ignore */
      }
      if (isFirebaseEnabled()) {
        const [fbLikes, fbGuests, fbRsvps] = await Promise.allSettled([
          fbReadLikes(inviteId),
          fbListGuestbook(inviteId),
          fbListRsvp(inviteId),
        ]);
        if (cancelled) return;
        if (fbLikes.status === 'fulfilled' && fbLikes.value > 0) setLikes(fbLikes.value);
        if (fbGuests.status === 'fulfilled') setGuests(fbGuests.value.length);
        if (fbRsvps.status === 'fulfilled') {
          const attending = fbRsvps.value.filter((r) => r.attending === 'yes');
          setRsvps(attending.length);
        }
      }
      if (!cancelled) setLoaded(true);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [inviteId]);

  const total = likes + guests + rsvps;
  if (!loaded || total === 0) return null;

  return (
    <aside className="invite-stats" aria-label="청첩장 응원 통계">
      <div className="invite-stats-inner">
        {likes > 0 && (
          <div className="invite-stat">
            <span className="invite-stat-num">{likes.toLocaleString()}</span>
            <span className="invite-stat-label">♥ 응원</span>
          </div>
        )}
        {guests > 0 && (
          <div className="invite-stat">
            <span className="invite-stat-num">{guests.toLocaleString()}</span>
            <span className="invite-stat-label">방명록</span>
          </div>
        )}
        {rsvps > 0 && (
          <div className="invite-stat">
            <span className="invite-stat-num">{rsvps.toLocaleString()}</span>
            <span className="invite-stat-label">참석 회신</span>
          </div>
        )}
      </div>
    </aside>
  );
}
