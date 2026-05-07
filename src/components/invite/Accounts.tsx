import { useState } from 'react';
import type { Account } from '../../types';
import { showToast } from '../../lib/toast';

interface Props {
  groom: Account[];
  bride: Account[];
}

function copy(text: string) {
  navigator.clipboard?.writeText(text).then(
    () => showToast('계좌번호가 복사되었습니다'),
    () => showToast('복사에 실패했어요')
  );
}

function Group({ title, list }: { title: string; list: Account[] }) {
  const [open, setOpen] = useState(false);
  if (list.length === 0) return null;
  return (
    <div className={`account-group${open ? ' open' : ''}`}>
      <button className="account-toggle" onClick={() => setOpen((o) => !o)}>
        <span>{title}</span>
        <span className="icon">+</span>
      </button>
      <div className="account-list">
        {list.map((a, i) => (
          <div key={i} className="account-row">
            <div className="info">
              <span className="role">{a.role}</span>
              <span className="num">{a.bank} {a.number}</span>
            </div>
            <button onClick={() => copy(`${a.bank} ${a.number}`)}>복사</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Accounts({ groom, bride }: Props) {
  if (groom.length === 0 && bride.length === 0) return null;
  return (
    <section className="invite-section" style={{ background: 'var(--bg-alt)' }}>
      <p className="section-title">ACCOUNT</p>
      <h2 className="section-heading">마음 전하실 곳</h2>
      <p className="account-intro">
        {`참석이 어려우신 분들을 위해\n비대면으로나마 마음을 전하실 수 있도록 안내드립니다.\n보내주신 정성 소중히 간직하겠습니다.`}
      </p>
      <Group title="신랑측 계좌번호" list={groom} />
      <Group title="신부측 계좌번호" list={bride} />
    </section>
  );
}
