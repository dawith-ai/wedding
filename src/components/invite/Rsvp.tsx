import { useState } from 'react';
import type { RsvpEntry } from '../../types';
import { addRsvp as lsAdd } from '../../lib/storage';
import { fbAddRsvp, isFirebaseEnabled } from '../../lib/firebase';
import { showToast } from '../../lib/toast';
import { celebrateRsvp } from '../../lib/celebrate';

interface Props {
  inviteId: string;
  deadline?: string;
  groomName: string;
  brideName: string;
  prompt?: string;
}

function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

type Choice<T> = { label: string; value: T };
const ATTENDING: Choice<'yes' | 'no'>[] = [
  { label: '기쁜 마음으로 갈게요', value: 'yes' },
  { label: '마음으로 축하할게요', value: 'no' },
];
const MEAL: Choice<'yes' | 'no' | 'undecided'>[] = [
  { label: '같이 식사할게요', value: 'yes' },
  { label: '괜찮아요', value: 'no' },
  { label: '아직 몰라요', value: 'undecided' },
];

export function Rsvp({ inviteId, deadline, groomName, brideName, prompt }: Props) {
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
      <section className="invite-section rsvp-section" style={{ background: 'var(--bg-alt)' }}>
        <p className="section-label rsvp-kicker">A NOTE FOR US</p>
        <h2 className="section-heading">마음 남겨주셔서 고마워요</h2>
        <p className="rsvp-thanks">
          {groomName} · {brideName}에게 소중한 응답이 잘 도착했어요.
        </p>
        <button
          className="rsvp-secondary-action"
          onClick={() => {
            setDone(false);
            setName('');
            setPhone('');
            setMessage('');
            setCount(1);
          }}
        >
          새 응답 작성
        </button>
      </section>
    );
  }

  return (
    <section className="invite-section rsvp-section" style={{ background: 'var(--bg-alt)' }}>
      <p className="section-label rsvp-kicker">A NOTE FOR US</p>
      <h2 className="section-heading">우리의 오늘, 함께해 주실래요?</h2>
      <div className="rsvp-signature" aria-label={`${groomName} 그리고 ${brideName}`}>
        <span>{groomName}</span>
        <i aria-hidden="true">&amp;</i>
        <span>{brideName}</span>
      </div>
      <p className="rsvp-intro">
        {prompt?.trim() || `${groomName}와 ${brideName}의 새로운 장면에 함께하는 마음을 알려주세요.`}
      </p>
      {deadline && (
        <p className="rsvp-deadline">
          {deadline.replace(/-/g, '.')}까지 응답 부탁드립니다
        </p>
      )}

      <form className="rsvp-form" onSubmit={submit}>
        <div className="rsvp-block">
          <div className="rsvp-field-head">
            <label id="rsvp-side-label">어느 쪽에서 오시나요?</label>
            <span>01</span>
          </div>
          <div className="rsvp-radios" role="group" aria-labelledby="rsvp-side-label">
            {[
              { label: `${groomName} 쪽`, value: 'groom' as const },
              { label: `${brideName} 쪽`, value: 'bride' as const },
            ].map((c) => (
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
        <div className="rsvp-block">
          <div className="rsvp-field-head">
            <label id="rsvp-attending-label">그날의 마음</label>
            <span>02</span>
          </div>
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

        <div className="rsvp-row rsvp-block">
          <div>
            <div className="rsvp-field-head"><label htmlFor="rsvp-name">성함</label><span>03</span></div>
            <input id="rsvp-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={20} placeholder="홍길동" />
          </div>
          <div>
            <label htmlFor="rsvp-count">함께 오는 사람</label>
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

        <div className="rsvp-block">
          <div className="rsvp-field-head">
            <label id="rsvp-meal-label">식사도 함께할까요?</label>
            <span>04</span>
          </div>
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

        <div className="rsvp-block">
          <label htmlFor="rsvp-phone">연락처 (선택)</label>
          <input
            id="rsvp-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            inputMode="tel"
          />
        </div>
        <div className="rsvp-block">
          <label htmlFor="rsvp-message">전하실 말씀 (선택)</label>
          <textarea id="rsvp-message" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={300} />
        </div>

        <button className="rsvp-submit" type="submit" disabled={busy}>
          {busy ? '마음 보내는 중…' : '두 사람에게 마음 보내기'}
        </button>
      </form>
    </section>
  );
}
