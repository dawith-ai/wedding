import type { Account } from '../../types';

interface Props {
  list: Account[];
  onChange: (next: Account[]) => void;
}

export function AccountEditor({ list, onChange }: Props) {
  function update(i: number, patch: Partial<Account>) {
    const next = list.map((a, idx) => (idx === i ? { ...a, ...patch } : a));
    onChange(next);
  }
  function remove(i: number) {
    onChange(list.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...list, { role: '', bank: '', number: '' }]);
  }

  return (
    <div className="account-list-edit">
      {list.map((a, i) => (
        <div className="account-row-edit" key={i}>
          <span style={{ fontSize: 11, color: '#888', width: 16 }}>{i + 1}</span>
          <input
            placeholder="역할 (예: 신랑)"
            value={a.role}
            onChange={(e) => update(i, { role: e.target.value })}
          />
          <input
            placeholder="은행"
            value={a.bank}
            onChange={(e) => update(i, { bank: e.target.value })}
          />
          <input
            placeholder="계좌번호"
            value={a.number}
            onChange={(e) => update(i, { number: e.target.value })}
          />
          <button type="button" onClick={() => remove(i)} aria-label="삭제">×</button>
        </div>
      ))}
      <button type="button" className="add-row" onClick={add}>
        + 계좌 추가
      </button>
    </div>
  );
}
