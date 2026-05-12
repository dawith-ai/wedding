import { useRef } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

/* Textarea with a "포인트" button that wraps the currently selected
 * text with `**…**` so the invitation renderer can apply the theme
 * accent color. Falls back to wrapping the caret position in markers
 * when nothing is selected, so users can type the emphasis inline. */
export function EmphasisTextarea({ value, onChange, placeholder, rows = 6 }: Props) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  function applyEmphasis() {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? start;
    const before = value.slice(0, start);
    const selected = value.slice(start, end);
    const after = value.slice(end);

    // Toggle: if the selection is already wrapped with `**…**`, unwrap.
    const wrapped = selected.startsWith('**') && selected.endsWith('**') && selected.length >= 4;
    let nextValue: string;
    let cursorStart: number;
    let cursorEnd: number;

    if (wrapped) {
      const inner = selected.slice(2, -2);
      nextValue = before + inner + after;
      cursorStart = start;
      cursorEnd = start + inner.length;
    } else if (selected.length === 0) {
      const placeholderText = '강조할 문구';
      nextValue = before + '**' + placeholderText + '**' + after;
      cursorStart = start + 2;
      cursorEnd = cursorStart + placeholderText.length;
    } else {
      nextValue = before + '**' + selected + '**' + after;
      cursorStart = start + 2;
      cursorEnd = cursorStart + selected.length;
    }

    onChange(nextValue);
    // Restore caret position after React state flush.
    window.requestAnimationFrame(() => {
      const target = ref.current;
      if (!target) return;
      target.focus();
      target.setSelectionRange(cursorStart, cursorEnd);
    });
  }

  return (
    <div className="emphasis-textarea">
      <textarea
        ref={ref}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <div className="emphasis-toolbar">
        <button
          type="button"
          className="emphasis-btn"
          onClick={applyEmphasis}
          title="선택 문구를 테마 색으로 강조"
        >
          ✦ 포인트
        </button>
        <span className="emphasis-hint">
          드래그해서 선택한 뒤 누르면 **이렇게** 표시되고, 테마 색으로 강조됩니다.
        </span>
      </div>
    </div>
  );
}
