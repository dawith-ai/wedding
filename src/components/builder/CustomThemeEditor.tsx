import { useState } from 'react';
import type { Theme } from '../../data/themes';
import {
  setCustomThemes,
  getCustomThemes,
  loadThemeFonts,
} from '../../data/themes';
import {
  buildAiPrompt,
  generateCustomThemeId,
  isValidTheme,
  loadCustomThemes,
  removeCustomTheme,
  upsertCustomTheme,
} from '../../lib/customThemes';
import { showToast } from '../../lib/toast';
import type { ThemeId } from '../../types';

interface Props {
  onSelect: (id: ThemeId) => void;
}

const ORNAMENTS = [
  'none', 'petals', 'leaves', 'stars', 'hearts', 'sparkles', 'film-grain', 'watercolor-wash', 'dancheong',
] as const;
const DIVIDERS = [
  'plain', 'gold-line', 'double-dot', 'floral-branch', 'leaf-sprig', 'hanji-line', 'tilde', 'none',
] as const;
const PHOTO_TREATMENTS = [
  'none', 'sepia', 'vignette', 'soft', 'warm-tint', 'dim',
] as const;
const LAYOUTS = [
  'overlay', 'framed', 'stacked', 'storybook', 'boardingpass', 'letter', 'scrapbook',
] as const;

const SAMPLE_THEME: Omit<Theme, 'id'> = {
  name: '나만의 테마',
  description: '직접 만든 무드',
  preview: { bg: '#fdf6ec', accent: '#a86b3c', text: '#2d2418' },
  fonts: {
    display: "'Cormorant Garamond', 'Noto Serif KR', serif",
    body: "'Inter', 'Noto Sans KR', sans-serif",
    googleQuery:
      'family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500&family=Noto+Serif+KR:wght@300;400;500&family=Noto+Sans+KR:wght@300;400;500&display=swap',
  },
  layout: 'stacked',
  ornament: 'none',
  divider: 'plain',
  photoTreatment: 'soft',
  vars: {
    '--bg': '#fdf6ec', '--bg-alt': '#f5e8d0', '--card': '#fffdf6',
    '--text': '#2d2418', '--text-muted': '#695845',
    '--accent': '#a86b3c', '--accent-soft': '#d6a878',
    '--divider': '#e3d4b6', '--shadow': '0 4px 20px rgba(120, 80, 40, 0.1)',
  },
};

export function CustomThemeEditor({ onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'form' | 'ai' | 'json'>('form');
  const [draft, setDraft] = useState<Theme>(() => ({
    id: generateCustomThemeId(),
    ...SAMPLE_THEME,
  }));
  const [mood, setMood] = useState('');
  const [pasted, setPasted] = useState('');
  const [version, setVersion] = useState(0);

  const myThemes = getCustomThemes();

  function setVar(key: string, value: string) {
    setDraft((d) => ({ ...d, vars: { ...d.vars, [key]: value } }));
    if (key === '--bg' || key === '--accent' || key === '--text') {
      setDraft((d) => ({
        ...d,
        preview: {
          bg: key === '--bg' ? value : d.preview.bg,
          accent: key === '--accent' ? value : d.preview.accent,
          text: key === '--text' ? value : d.preview.text,
        },
      }));
    }
  }

  function save(theme: Theme) {
    const all = upsertCustomTheme(theme);
    setCustomThemes(all);
    loadThemeFonts(theme);
    setVersion((v) => v + 1);
    showToast(`'${theme.name}' 저장됨`);
    onSelect(theme.id);
    setOpen(false);
    setDraft({ id: generateCustomThemeId(), ...SAMPLE_THEME });
  }

  function copyPrompt() {
    const prompt = buildAiPrompt(mood);
    navigator.clipboard.writeText(prompt).then(
      () => showToast('AI 프롬프트가 복사되었어요. ChatGPT/Claude에 붙여넣고 결과 JSON을 받아오세요.'),
      () => showToast('복사 실패')
    );
  }

  function importPasted() {
    try {
      const cleaned = pasted.trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
      const parsed: unknown = JSON.parse(cleaned);
      if (!isValidTheme(parsed)) throw new Error('스키마 누락 (id/name/preview/fonts/vars 필수)');
      const theme = parsed as Theme;
      const finalTheme: Theme = {
        ...theme,
        id: theme.id.startsWith('custom-') ? theme.id : `custom-${theme.id}`,
      };
      save(finalTheme);
      setPasted('');
    } catch (e) {
      showToast('JSON 파싱 실패: ' + (e as Error).message);
    }
  }

  function deleteTheme(id: string) {
    if (!confirm('이 테마를 삭제할까요?')) return;
    const all = removeCustomTheme(id);
    setCustomThemes(all);
    setVersion((v) => v + 1);
    showToast('삭제됨');
  }

  function reloadFromStorage() {
    setCustomThemes(loadCustomThemes());
    setVersion((v) => v + 1);
  }

  if (!open) {
    return (
      <div className="custom-theme-bar" style={{ marginTop: 12, padding: 12, background: '#faf8f3', border: '1px dashed #d8cfb8', borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 13, color: '#5a4a32' }}>
            ✨ <b>13개 테마로 부족하다면</b> — AI에게 "시카고 60년대 빈티지로" 같이 묘사하면 무한 테마 생성
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={() => { reloadFromStorage(); setOpen(true); }} style={btnStyle()}>
              내 테마 만들기
            </button>
          </div>
        </div>
        {myThemes.length > 0 && (
          <div key={version} style={{ marginTop: 10, fontSize: 12, color: '#777' }}>
            저장된 내 테마: {myThemes.map((t) => (
              <span key={t.id} style={{ marginRight: 8 }}>
                <button type="button" onClick={() => onSelect(t.id)} style={{ background: 'none', border: 'none', color: '#a17', cursor: 'pointer', textDecoration: 'underline', fontSize: 12 }}>{t.name}</button>
                <button type="button" onClick={() => deleteTheme(t.id)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: 11, marginLeft: 4 }}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="custom-theme-editor" style={{ marginTop: 12, padding: 16, background: '#fff', border: '1px solid #ddd', borderRadius: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 15 }}>내 테마 만들기</h3>
        <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>×</button>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12, borderBottom: '1px solid #eee' }}>
        {(['form', 'ai', 'json'] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} style={{
            background: mode === m ? '#222' : 'transparent',
            color: mode === m ? '#fff' : '#666',
            border: 'none', padding: '6px 12px', fontSize: 12, cursor: 'pointer',
            borderRadius: '6px 6px 0 0',
          }}>
            {m === 'form' ? '폼으로 만들기' : m === 'ai' ? 'AI 프롬프트' : 'JSON 붙여넣기'}
          </button>
        ))}
      </div>

      {mode === 'form' && (
        <div style={{ display: 'grid', gap: 10 }}>
          <Field label="이름" value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} />
          <Field label="설명" value={draft.description} onChange={(v) => setDraft((d) => ({ ...d, description: v }))} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <ColorField label="배경 (--bg)" value={draft.vars['--bg'] || ''} onChange={(v) => setVar('--bg', v)} />
            <ColorField label="보조 배경 (--bg-alt)" value={draft.vars['--bg-alt'] || ''} onChange={(v) => setVar('--bg-alt', v)} />
            <ColorField label="카드 (--card)" value={draft.vars['--card'] || ''} onChange={(v) => setVar('--card', v)} />
            <ColorField label="텍스트 (--text)" value={draft.vars['--text'] || ''} onChange={(v) => setVar('--text', v)} />
            <ColorField label="흐린 텍스트 (--text-muted)" value={draft.vars['--text-muted'] || ''} onChange={(v) => setVar('--text-muted', v)} />
            <ColorField label="액센트 (--accent)" value={draft.vars['--accent'] || ''} onChange={(v) => setVar('--accent', v)} />
            <ColorField label="액센트 흐림 (--accent-soft)" value={draft.vars['--accent-soft'] || ''} onChange={(v) => setVar('--accent-soft', v)} />
            <ColorField label="구분선 (--divider)" value={draft.vars['--divider'] || ''} onChange={(v) => setVar('--divider', v)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <SelectField label="레이아웃" value={draft.layout} options={LAYOUTS as readonly string[]} onChange={(v) => setDraft((d) => ({ ...d, layout: v as Theme['layout'] }))} />
            <SelectField label="장식" value={draft.ornament} options={ORNAMENTS as readonly string[]} onChange={(v) => setDraft((d) => ({ ...d, ornament: v as Theme['ornament'] }))} />
            <SelectField label="구분선" value={draft.divider} options={DIVIDERS as readonly string[]} onChange={(v) => setDraft((d) => ({ ...d, divider: v as Theme['divider'] }))} />
            <SelectField label="사진 보정" value={draft.photoTreatment} options={PHOTO_TREATMENTS as readonly string[]} onChange={(v) => setDraft((d) => ({ ...d, photoTreatment: v as Theme['photoTreatment'] }))} />
          </div>

          <div style={{ background: draft.vars['--bg'], color: draft.vars['--text'], padding: 14, borderRadius: 8, border: `1px solid ${draft.vars['--divider']}` }}>
            <div style={{ fontFamily: draft.fonts.display, fontSize: 22 }}>{draft.name} preview</div>
            <div style={{ fontSize: 13, color: draft.vars['--text-muted'] }}>{draft.description}</div>
            <div style={{ marginTop: 10, height: 6, background: draft.vars['--accent'], borderRadius: 3 }} />
          </div>

          <button type="button" onClick={() => save(draft)} style={primaryBtn()}>이 테마 저장하고 적용</button>
        </div>
      )}

      {mode === 'ai' && (
        <div style={{ display: 'grid', gap: 10 }}>
          <p style={{ fontSize: 13, color: '#555', margin: 0 }}>
            원하는 분위기를 한 줄로 적고 <b>프롬프트 복사</b> → ChatGPT나 Claude에 붙여넣어 받은 JSON을 그대로 가져와서 'JSON 붙여넣기' 탭에 입력하세요.
          </p>
          <textarea
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="예) 시카고 1960년대 빈티지 재즈 클럽 무드, 골드와 진한 보르도 와인색"
            style={{ width: '100%', minHeight: 80, padding: 10, border: '1px solid #ddd', borderRadius: 6, fontSize: 13 }}
          />
          <button type="button" onClick={copyPrompt} style={primaryBtn()}>AI 프롬프트 복사</button>
          <details>
            <summary style={{ cursor: 'pointer', fontSize: 12, color: '#888' }}>프롬프트 미리보기</summary>
            <pre style={{ fontSize: 11, color: '#666', background: '#f7f7f7', padding: 10, borderRadius: 6, overflow: 'auto', maxHeight: 220 }}>
              {buildAiPrompt(mood)}
            </pre>
          </details>
        </div>
      )}

      {mode === 'json' && (
        <div style={{ display: 'grid', gap: 10 }}>
          <p style={{ fontSize: 13, color: '#555', margin: 0 }}>
            AI가 만들어준 테마 JSON을 그대로 붙여넣으세요. 코드펜스(```) 포함되어 있어도 자동으로 제거됩니다.
          </p>
          <textarea
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            placeholder='{ "id": "custom-...", "name": "...", "preview": {...}, "fonts": {...}, "vars": {...}, "layout": "...", "ornament": "...", "divider": "...", "photoTreatment": "..." }'
            style={{ width: '100%', minHeight: 240, padding: 10, border: '1px solid #ddd', borderRadius: 6, fontSize: 12, fontFamily: 'monospace' }}
          />
          <button type="button" onClick={importPasted} style={primaryBtn()}>JSON 가져와서 저장</button>
        </div>
      )}
    </div>
  );
}

function btnStyle(): React.CSSProperties {
  return {
    background: '#fff',
    border: '1px solid #d8cfb8',
    color: '#5a4a32',
    padding: '6px 12px',
    fontSize: 12,
    borderRadius: 6,
    cursor: 'pointer',
  };
}

function primaryBtn(): React.CSSProperties {
  return {
    background: '#222',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    fontSize: 13,
    borderRadius: 6,
    cursor: 'pointer',
  };
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 13 }} />
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, color: '#777', marginBottom: 4 }}>{label}</label>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input
          type="color"
          value={value.startsWith('#') ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 36, height: 30, padding: 0, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }}
        />
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, color: '#777', marginBottom: 4 }}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: '100%', padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
