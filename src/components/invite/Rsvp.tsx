import { useState } from 'react';
import type { RsvpEntry } from '../../types';
import { addRsvp as lsAdd } from '../../lib/storage';
import { fbAddRsvp, isFirebaseEnabled } from '../../lib/firebase';
import { showToast } from '../../lib/toast';
import { celebrateRsvp } from '../../lib/celebrate';

interface Props {
  inviteId: string;
  deadline?: string;
}

function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

type Choice<T> = { label: string; value: T };
const ATTENDING: Choice<'yes' | 'no'>[] = [
  { label: '참석합니다', value: 'yes' },
  { label: '참석 못해요', value: 'no' },
];
const SIDE: Choice<'groom' | 'bride'>[] = [
  { label: '신랑측', value: 'groom' },
  { label: '신부측', value: 'bride' },
];
const MEAL: Choice<'yes' | 'no' | 'undecided'>[] = [
  { label: '식사함', value: 'yes' },
  { label: '식사 안함', value: 'no' },
  { label: '미정', value: 'undecided' },
];

export function Rsvp({ inviteId, deadline }: Props) {
  const [side, setSide] = useState<'groom' | 'bride'>('groom');
  const [name, setName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [count, setCount] = useState(1);
  const [meal, setMeal] = useState<'yes' | 'no' | 'undecided'>('undecided');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      showToast('성함을 입력해주세요');
      return;
    }
    setBusy(true);
    const entry: RsvpEntry = {
      id: newId(),
      side,
      name: name.trim(),
      attending,
      count,
      meal,
      phone: phone.trim(),
      message: message.trim(),
      createdAt: Date.now(),
    };
    try {
      if (isFirebaseEnabled()) {
        await fbAddRsvp(inviteId, entry);
      } else {
        lsAdd(inviteId, entry);
      }
      setDone(true);
      if (attending === 'yes') celebrateRsvp();
      showToast('참석 의사 전달이 완료되었어요');
    } catch (err) {
      showToast((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <section className="invite-section" style={{ background: 'var(--bg-alt)' }}>
        <p className="section-title">RSVP</p>
        <h2 className="section-heading">감사합니다</h2>
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
          소중한 응답 감사드립니다.
        </p>
        <button
          onClick={() => {
            setDone(false);
            setName('');
            setPhone('');
            setMessage('');
            setCount(1);
          }}
          style={{
            display: 'block',
            margin: '16px auto 0',
            background: 'transparent',
            border: '1px solid var(--accent)',
            color: 'var(--accent)',
            padding: '8px 18px',
            borderRadius: 999,
            fontSize: 12,
          }}
        >
          새 응답 작성
        </button>
      </section>
    );
  }

  return (
    <section className="invite-section" style={{ background: 'var(--bg-alt)' }}>
      <p className="section-title">RSVP</p>
      <h2 className="section-heading">참석 의사 전달</h2>
      {deadline && (
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: -16, marginBottom: 18 }}>
          {deadline.replace(/-/g, '.')}까지 응답 부탁드립니다
        </p>
      )}

      <form className="rsvp-form" onSubmit={submit}>
        <div>
          <label id="rsvp-side-label">구분</label>
          <div className="rsvp-radios" role="group" aria-labelledby="rsvp-side-label">
            {SIDE.map((c) => (
              <button
                type="button"
                key={c.value}
                className={side === c.value ? 'active' : ''}
                aria-pressed={side === c.value}
                onClick={() => setSide(c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label id="rsvp-attending-label">참석 여부</label>
          <div className="rsvp-radios" role="group" aria-labelledby="rsvp-attending-label">
            {ATTENDING.map((c) => (
              <button
                type="button"
                key={c.value}
                className={attending === c.value ? 'active' : ''}
                aria-pressed={attending === c.value}
                onClick={() => setAttending(c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rsvp-row">
          <div>
            <label htmlFor="rsvp-name">성함</label>
            <input id="rsvp-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={20} placeholder="홍길동" />
          </div>
          <div>
            <label htmlFor="rsvp-count">인원수</label>
            <input
              id="rsvp-count"
              type="number"
              min={1}
              max={10}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
            />
          </div>
        </div>

        <div>
          <label id="rsvp-meal-label">식사 여부</label>
          <div className="rsvp-radios" role="group" aria-labelledby="rsvp-meal-label">
            {MEAL.map((c) => (
              <button
                type="button"
                key={c.value}
                className={meal === c.value ? 'active' : ''}
                aria-pressed={meal === c.value}
                onClick={() => setMeal(c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="rsvp-phone">연락처 (선택)</label>
          <input
            id="rsvp-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            inputMode="tel"
          />
        </div>
        <div>
          <label htmlFor="rsvp-message">전하실 말씀 (선택)</label>
          <textarea id="rsvp-message" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={300} />
        </div>

        <button className="guestbook-submit" type="submit" disabled={busy}>
          {busy ? '전송 중…' : '응답 전달하기'}
        </button>
      </form>
    </section>
  );
}
