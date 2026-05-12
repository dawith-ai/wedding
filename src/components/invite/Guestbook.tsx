import { useEffect, useState } from 'react';
import type { GuestbookEntry } from '../../types';
import {
  addGuestbook as lsAdd,
  listGuestbook as lsList,
  removeGuestbook as lsRemove,
} from '../../lib/storage';
import {
  fbAddGuestbook,
  fbDeleteGuestbook,
  fbListGuestbook,
  isFirebaseEnabled,
} from '../../lib/firebase';
import { showToast } from '../../lib/toast';

interface Props {
  inviteId: string;
  hostPassword?: string;
  blockedWords?: string[];
}

function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function containsBlocked(text: string, words?: string[]): string | null {
  if (!words || words.length === 0) return null;
  const lower = text.toLowerCase();
  for (const w of words) {
    const term = w.trim().toLowerCase();
    if (!term) continue;
    if (lower.includes(term)) return w;
  }
  return null;
}

export function Guestbook({ inviteId, hostPassword, blockedWords }: Props) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function refresh() {
    if (isFirebaseEnabled()) {
      try {
        setEntries(await fbListGuestbook(inviteId));
        return;
      } catch {
        showToast('서버 조회 실패, 로컬 사용');
      }
    }
    setEntries(lsList(inviteId));
  }

  useEffect(() => {
    refresh();
  }, [inviteId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !password.trim()) {
      showToast('이름, 비밀번호, 메시지를 입력해주세요');
      return;
    }
    const blocked =
      containsBlocked(message, blockedWords) || containsBlocked(name, blockedWords);
    if (blocked) {
      showToast(`사용할 수 없는 단어가 포함되어 있습니다: "${blocked}"`);
      return;
    }
    setBusy(true);
    const entry: GuestbookEntry = {
      id: newId(),
      name: name.trim(),
      message: message.trim(),
      password: password.trim(),
      createdAt: Date.now(),
    };
    try {
      if (isFirebaseEnabled()) {
        await fbAddGuestbook(inviteId, entry);
      } else {
        lsAdd(inviteId, entry);
      }
      setName('');
      setPassword('');
      setMessage('');
      showToast('등록되었습니다');
      refresh();
    } catch (err) {
      showToast((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function del(entry: GuestbookEntry) {
    const hasHost = !!hostPassword && hostPassword.trim().length > 0;
    const promptLabel = hasHost
      ? '본인 비밀번호 또는 호스트 비밀번호'
      : '비밀번호를 입력하세요';
    const pw = prompt(promptLabel);
    if (!pw) return;
    const isHost = hasHost && pw === hostPassword;
    if (!isHost && pw !== entry.password) {
      showToast('비밀번호가 일치하지 않습니다');
      return;
    }
    try {
      if (isFirebaseEnabled()) {
        await fbDeleteGuestbook(inviteId, entry.id);
      } else {
        // For local storage, removeGuestbook validates against entry pw;
        // pass entry.password when the host is overriding so the call
        // succeeds.
        lsRemove(inviteId, entry.id, isHost ? entry.password : pw);
      }
      showToast(isHost ? '호스트 권한으로 삭제했습니다' : '삭제되었습니다');
      refresh();
    } catch {
      showToast('삭제에 실패했어요');
    }
  }

  return (
    <section className="invite-section">
      <p className="section-title">GUESTBOOK</p>
      <h2 className="section-heading">방명록</h2>

      <form className="guestbook-form" onSubmit={submit}>
        <div className="row">
          <input
            placeholder="성함"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
          />
          <input
            type="password"
            placeholder="비밀번호 (삭제용)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={20}
          />
        </div>
        <textarea
          placeholder="축하 메시지를 남겨주세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
        />
        <button className="guestbook-submit" type="submit" disabled={busy}>
          {busy ? '저장 중…' : '메시지 남기기'}
        </button>
      </form>

      <div className="guestbook-list">
        {entries.length === 0 && (
          <p className="guestbook-empty">첫 번째 메시지의 주인공이 되어주세요</p>
        )}
        {entries.map((e) => (
          <div className="guestbook-entry" key={e.id}>
            <button className="delete" onClick={() => del(e)} aria-label="삭제">×</button>
            <div className="name">{e.name}</div>
            <div className="msg">{e.message}</div>
            <div className="meta">{new Date(e.createdAt).toLocaleString('ko-KR')}</div>
          </div>
        ))}
      </div>

      {!isFirebaseEnabled() && (
        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 14 }}>
          ※ 현재는 이 기기에만 저장됩니다. 모든 기기 공유는 Firebase 설정 후 사용 가능
        </p>
      )}
    </section>
  );
}
