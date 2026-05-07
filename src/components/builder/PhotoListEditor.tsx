import { useRef, useState } from 'react';
import { hasImgurClientId, uploadImage } from '../../lib/imgur';
import { showToast } from '../../lib/toast';

interface Props {
  photos: string[];
  onChange: (next: string[]) => void;
  max?: number;
}

export function PhotoListEditor({ photos, onChange, max = 12 }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  async function handleFiles(files: FileList | File[]) {
    if (!hasImgurClientId()) {
      showToast('환경설정에서 Imgur Client ID를 입력해주세요');
      return;
    }
    setBusy(true);
    const out = [...photos];
    try {
      for (const f of Array.from(files)) {
        if (out.length >= max) break;
        const r = await uploadImage(f);
        out.push(r.url);
      }
      onChange(out);
      showToast('업로드 완료');
    } catch (e) {
      showToast((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= photos.length) return;
    const next = [...photos];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  function remove(i: number) {
    onChange(photos.filter((_, idx) => idx !== i));
  }

  function addUrl() {
    const u = urlInput.trim();
    if (!u) return;
    onChange([...photos, u]);
    setUrlInput('');
  }

  return (
    <div>
      <div
        className="image-uploader"
        onClick={() => input.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          ref={input}
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.currentTarget.value = '';
          }}
        />
        <div style={{ fontSize: 13 }}>
          {busy ? '업로드 중…' : `사진 추가 (${photos.length}/${max})`}
        </div>
        <div className="hint">여러 장 한 번에 선택할 수 있어요</div>
      </div>

      <div className="row-2" style={{ marginTop: 8 }}>
        <input
          placeholder="이미지 URL 직접 입력"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          style={{
            background: '#fafafa',
            border: '1px solid #e2e2e2',
            borderRadius: 6,
            padding: '8px 10px',
            fontSize: 13,
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={addUrl}
          style={{ background: '#222', color: '#fff', border: 0, borderRadius: 6, fontSize: 13 }}
        >
          URL 추가
        </button>
      </div>

      <div className="photo-list">
        {photos.map((src, i) => (
          <div className="photo-item" key={i}>
            <img src={src} alt={`p-${i}`} />
            <button type="button" onClick={() => remove(i)} aria-label="삭제">×</button>
            <div style={{ position: 'absolute', bottom: 4, left: 4, display: 'flex', gap: 2 }}>
              <button
                type="button"
                onClick={() => move(i, i - 1)}
                disabled={i === 0}
                style={{
                  width: 22, height: 22, borderRadius: 4,
                  background: 'rgba(0,0,0,0.6)', color: '#fff',
                  border: 0, fontSize: 11, padding: 0,
                  opacity: i === 0 ? 0.4 : 1,
                }}
              >‹</button>
              <button
                type="button"
                onClick={() => move(i, i + 1)}
                disabled={i === photos.length - 1}
                style={{
                  width: 22, height: 22, borderRadius: 4,
                  background: 'rgba(0,0,0,0.6)', color: '#fff',
                  border: 0, fontSize: 11, padding: 0,
                  opacity: i === photos.length - 1 ? 0.4 : 1,
                }}
              >›</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
