import { useRef, useState } from 'react';
import { hasImgurClientId, uploadImage } from '../../lib/imgur';
import { showToast } from '../invite/Toast';

interface Props {
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  aspectHint?: string;
}

export function ImageUpload({ value, onChange, hint, aspectHint }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  async function handle(file: File) {
    if (!hasImgurClientId()) {
      showToast('환경설정에서 Imgur Client ID를 입력해주세요');
      return;
    }
    setBusy(true);
    try {
      const r = await uploadImage(file);
      onChange(r.url);
      showToast('이미지가 업로드되었어요');
    } catch (e) {
      showToast((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div
        className={`image-uploader${drag ? ' dragover' : ''}`}
        onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handle(f);
        }}
      >
        <input
          type="file"
          accept="image/*"
          ref={input}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handle(f);
            e.currentTarget.value = '';
          }}
        />
        {value ? (
          <img src={value} alt="preview" style={{ maxHeight: 140, margin: '0 auto', borderRadius: 6 }} />
        ) : (
          <div>
            <div style={{ fontSize: 13, color: '#444' }}>
              {busy ? '업로드 중…' : '클릭 또는 드래그해서 이미지 업로드'}
            </div>
            {hint && <div className="hint">{hint}</div>}
            {aspectHint && <div className="hint">{aspectHint}</div>}
          </div>
        )}
      </div>
      <div className="row-2" style={{ marginTop: 6 }}>
        <input
          placeholder="또는 이미지 URL 직접 입력"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            background: '#fafafa',
            border: '1px solid #e2e2e2',
            borderRadius: 6,
            padding: '8px 10px',
            fontSize: 13,
            outline: 'none',
          }}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 6, fontSize: 12, color: '#666' }}
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}
