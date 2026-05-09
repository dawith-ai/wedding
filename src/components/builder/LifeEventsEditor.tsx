import { useState } from 'react';
import type { LifeEvent } from '../../types';
import { ImageUpload } from './ImageUpload';

interface Props {
  enabled: boolean;
  title: string;
  intro: string;
  items: LifeEvent[];
  onChange: (next: { enabled: boolean; title: string; intro: string; items: LifeEvent[] }) => void;
}

function genId(): string {
  return `le-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

const SUGGESTIONS: Array<{ label: string; title: string; offsetMonths?: number }> = [
  { label: '결혼 1주년', title: '결혼 1주년 — 첫 해 함께', offsetMonths: 12 },
  { label: '신혼여행', title: '신혼여행', offsetMonths: 1 },
  { label: '집들이', title: '집들이', offsetMonths: 2 },
  { label: '첫 아이 출산', title: '첫 아이가 태어났어요' },
  { label: '돌잔치', title: '아이의 돌잔치' },
  { label: '결혼 5주년', title: '결혼 5주년', offsetMonths: 60 },
  { label: '결혼 10주년', title: '결혼 10주년', offsetMonths: 120 },
];

export function LifeEventsEditor({ enabled, title, intro, items, onChange }: Props) {
  const [draft, setDraft] = useState<LifeEvent>({ id: genId(), date: '', title: '', note: '', photo: '' });

  function update(next: Partial<{ enabled: boolean; title: string; intro: string; items: LifeEvent[] }>) {
    onChange({ enabled, title, intro, items, ...next });
  }

  function addItem(item: LifeEvent) {
    if (!item.title.trim() && !item.date.trim()) return;
    update({ items: [...items, { ...item, id: item.id || genId() }] });
    setDraft({ id: genId(), date: '', title: '', note: '', photo: '' });
  }

  function removeItem(id: string) {
    update({ items: items.filter((i) => i.id !== id) });
  }

  function applySuggestion(s: (typeof SUGGESTIONS)[number]) {
    const baseDate = items[0]?.date || new Date().toISOString().slice(0, 10);
    const d = new Date(baseDate);
    if (s.offsetMonths) d.setMonth(d.getMonth() + s.offsetMonths);
    const dateStr = d.toISOString().slice(0, 10);
    setDraft((prev) => ({ ...prev, date: dateStr, title: s.title }));
  }

  return (
    <div style={{ marginTop: 8 }}>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => update({ enabled: e.target.checked })}
        />
        평생 가족 페이지 사용 — 결혼 후에도 여기에 사진·기록을 누적할 수 있어요
      </label>
      {enabled && (
        <>
          <div className="field">
            <label>섹션 제목</label>
            <input value={title} onChange={(e) => update({ title: e.target.value })} placeholder="결혼 그 후" />
          </div>
          <div className="field">
            <label>섹션 안내문 (선택)</label>
            <textarea value={intro} onChange={(e) => update({ intro: e.target.value })} placeholder="청첩장은 이 결혼식 이후로도 평생 살아있는 페이지입니다." />
          </div>

          {items.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>등록된 이벤트 ({items.length})</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
                {[...items].sort((a, b) => a.date.localeCompare(b.date)).map((item) => (
                  <li key={item.id} style={{ display: 'flex', gap: 10, padding: 10, background: '#fafafa', border: '1px solid #eee', borderRadius: 6, alignItems: 'center' }}>
                    {item.photo && <img src={item.photo} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: '#888' }}>{item.date}</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{item.title}</div>
                      {item.note && <div style={{ fontSize: 11, color: '#666' }}>{item.note}</div>}
                    </div>
                    <button type="button" onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#a00', cursor: 'pointer', fontSize: 12 }}>삭제</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ padding: 12, background: '#fafafa', border: '1px dashed #ddd', borderRadius: 8, marginBottom: 8 }}>
            <p style={{ fontSize: 12, color: '#666', margin: '0 0 8px', fontWeight: 600 }}>새 이벤트 추가</p>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => applySuggestion(s)}
                  style={{ background: '#fff', border: '1px solid #ddd', padding: '4px 8px', fontSize: 11, borderRadius: 4, cursor: 'pointer', color: '#444' }}
                >
                  + {s.label}
                </button>
              ))}
            </div>
            <div className="row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
              <div className="field" style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 11 }}>날짜</label>
                <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
              </div>
              <div className="field" style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 11 }}>제목</label>
                <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="예) 결혼 1주년" />
              </div>
            </div>
            <div className="field" style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 11 }}>설명 (선택)</label>
              <textarea value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} placeholder="짧은 메모" />
            </div>
            <div className="field" style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 11 }}>사진 (선택)</label>
              <ImageUpload value={draft.photo || ''} onChange={(url) => setDraft({ ...draft, photo: url })} />
            </div>
            <button type="button" onClick={() => addItem(draft)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 14px', fontSize: 12, borderRadius: 4, cursor: 'pointer' }}>
              이벤트 추가
            </button>
          </div>

          <p style={{ fontSize: 11, color: '#888', marginTop: 8 }}>
            ※ 추가한 이벤트는 청첩장 마지막에 타임라인으로 표시됩니다. 결혼 후 시간이 지나며 추가하면 페이지가 살아있는 가족 앨범이 돼요.
          </p>
        </>
      )}
    </div>
  );
}
