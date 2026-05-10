import { useRef, useState } from 'react';
import type { WeddingData } from '../../types';
import { THEME_MAP } from '../../data/themes';
import { hasImgurClientId, uploadDataUrl } from '../../lib/imgur';
import { showToast } from '../../lib/toast';
import { getEventLabels } from '../../data/events';

interface Props {
  data: WeddingData;
  onChange: (ogImage: string) => void;
}

const W = 1200;
const H = 630;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('이미지를 불러올 수 없어요'));
    img.src = src;
  });
}

export function OgCardGenerator({ data, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function generate() {
    setBusy(true);
    try {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas 컨텍스트 생성 실패');

      const theme = THEME_MAP[data.theme] || THEME_MAP['original-warm'];
      const labels = getEventLabels(data.eventType);
      const bg = theme.vars['--bg'] || '#faf9f5';
      const fg = theme.vars['--text'] || '#141413';
      const accent = theme.vars['--accent'] || '#cc785c';
      const muted = theme.vars['--text-muted'] || '#6c6a64';
      const isDark = isDarkColor(bg);

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Left half: hero image (cover)
      let heroDrawn = false;
      if (data.hero) {
        try {
          const img = await loadImage(data.hero);
          const targetW = W / 2;
          const targetH = H;
          const ratio = img.width / img.height;
          let drawW = targetW;
          let drawH = drawW / ratio;
          if (drawH < targetH) {
            drawH = targetH;
            drawW = drawH * ratio;
          }
          const dx = (targetW - drawW) / 2;
          const dy = (targetH - drawH) / 2;
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, targetW, targetH);
          ctx.clip();
          ctx.drawImage(img, dx, dy, drawW, drawH);
          ctx.restore();
          heroDrawn = true;
        } catch {
          // continue without hero image
        }
      }
      if (!heroDrawn) {
        ctx.fillStyle = isDark ? '#222' : '#eee';
        ctx.fillRect(0, 0, W / 2, H);
        ctx.fillStyle = muted;
        ctx.font = '20px "Noto Sans KR", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('사진을 추가해주세요', W / 4, H / 2);
      }

      // Right half: text
      const padX = W / 2 + 56;
      let y = 130;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      ctx.fillStyle = accent;
      ctx.font = '20px "Noto Sans KR", sans-serif';
      ctx.fillText(labels.heroEyebrow, padX, y);
      y += 60;

      ctx.fillStyle = fg;
      ctx.font = '600 76px "Cormorant Garamond", "Noto Serif KR", serif';
      ctx.fillText(data.groom.name, padX, y);
      y += 86;

      ctx.fillStyle = accent;
      ctx.font = 'italic 36px "Cormorant Garamond", serif';
      ctx.fillText('&', padX, y);
      y += 50;

      ctx.fillStyle = fg;
      ctx.font = '600 76px "Cormorant Garamond", "Noto Serif KR", serif';
      ctx.fillText(data.bride.name, padX, y);
      y += 110;

      // Accent rule
      ctx.fillStyle = accent;
      ctx.fillRect(padX, y, 80, 3);
      y += 28;

      ctx.fillStyle = fg;
      ctx.font = '32px "Noto Serif KR", serif';
      const dateStr = data.wedding.date.replace(/-/g, '.');
      ctx.fillText(`${dateStr}${data.wedding.time ? ' · ' + data.wedding.time : ''}`, padX, y);
      y += 44;

      if (data.wedding.venue) {
        ctx.fillStyle = muted;
        ctx.font = '24px "Noto Sans KR", sans-serif';
        const venue = clipText(ctx, data.wedding.venue, W - padX - 40);
        ctx.fillText(venue, padX, y);
      }

      const dataUrl = canvas.toDataURL('image/png', 0.92);
      setPreviewUrl(dataUrl);
      showToast('OG 카드 생성됨. Imgur 업로드 또는 다운로드 후 호스팅하세요.');
    } catch (e) {
      showToast((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function uploadToImgur() {
    if (!previewUrl) return;
    if (!hasImgurClientId()) {
      showToast('Imgur Client ID가 필요해요. 설정에서 등록해주세요.');
      return;
    }
    setBusy(true);
    try {
      const up = await uploadDataUrl(previewUrl);
      onChange(up.url);
      showToast('OG 이미지 자동 적용됨. 카톡 공유 시 이 카드가 표시됩니다.');
    } catch (e) {
      showToast(`Imgur 업로드 실패: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `og-card-${data.wedding.date}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div style={{ marginTop: 12, padding: 12, background: '#f3f0ff', border: '1px dashed #c4b5fd', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 13, color: '#4c1d95' }}>
          📨 <b>카톡 공유 미리보기 카드 생성</b> — 신랑·신부 이름 + 사진이 들어간 1200×630 OG 이미지
        </div>
        <button type="button" onClick={generate} disabled={busy} style={{ background: busy ? '#a78bfa' : '#7c3aed', color: '#fff', border: 'none', padding: '6px 14px', fontSize: 12, borderRadius: 6, cursor: busy ? 'not-allowed' : 'pointer' }}>
          {busy ? '생성 중…' : 'OG 카드 만들기'}
        </button>
      </div>

      {previewUrl && (
        <div style={{ marginTop: 10 }}>
          <img src={previewUrl} alt="OG 카드 미리보기" style={{ width: '100%', maxWidth: 480, borderRadius: 6, border: '1px solid #ddd' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            <button type="button" onClick={uploadToImgur} disabled={busy} style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '8px 14px', fontSize: 12, borderRadius: 6, cursor: busy ? 'not-allowed' : 'pointer' }}>
              Imgur에 자동 업로드 + 적용
            </button>
            <button type="button" onClick={download} style={{ background: '#fff', color: '#7c3aed', border: '1px solid #7c3aed', padding: '8px 14px', fontSize: 12, borderRadius: 6, cursor: 'pointer' }}>
              PNG 다운로드
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

function isDarkColor(hex: string): boolean {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return false;
  const r = parseInt(m[1].slice(0, 2), 16);
  const g = parseInt(m[1].slice(2, 4), 16);
  const b = parseInt(m[1].slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function clipText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let s = text;
  while (s.length > 1 && ctx.measureText(s + '…').width > maxWidth) {
    s = s.slice(0, -1);
  }
  return s + '…';
}
