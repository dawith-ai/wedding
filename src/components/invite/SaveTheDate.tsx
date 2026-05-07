import { useRef } from 'react';
import { THEME_MAP } from '../../data/themes';
import type { WeddingData } from '../../types';
import { showToast } from '../../lib/toast';

interface Props {
  data: WeddingData;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function SaveTheDate({ data }: Props) {
  const busy = useRef(false);

  async function download() {
    if (busy.current) return;
    busy.current = true;
    showToast('이미지 생성 중…');

    const W = 1080;
    const H = 1920;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      busy.current = false;
      return;
    }

    const t = THEME_MAP[data.theme];
    const bg = t.vars['--bg'] || '#fff';
    const fg = t.vars['--text'] || '#222';
    const accent = t.vars['--accent'] || '#a87f5b';
    const muted = t.vars['--text-muted'] || '#888';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    if (data.hero) {
      try {
        const img = await loadImage(data.hero);
        const targetH = 1100;
        const targetW = W - 200;
        const ratio = img.height / img.width;
        let drawW = targetW;
        let drawH = drawW * ratio;
        if (drawH > targetH) {
          drawH = targetH;
          drawW = drawH / ratio;
        }
        const x = (W - drawW) / 2;
        const y = 220;
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 12;
        ctx.drawImage(img, x, y, drawW, drawH);
        ctx.restore();
      } catch {
        // ignore image load failure
      }
    }

    ctx.fillStyle = muted;
    ctx.font = '28px "Noto Serif KR", serif';
    ctx.textAlign = 'center';
    ctx.fillText('SAVE THE DATE', W / 2, 140);

    ctx.fillStyle = accent;
    ctx.font = '40px "Cormorant Garamond", "Noto Serif KR", serif';
    ctx.fillText('—  ◆  —', W / 2, 1430);

    ctx.fillStyle = fg;
    ctx.font = '600 96px "Cormorant Garamond", "Noto Serif KR", serif';
    ctx.fillText(`${data.groom.name}  &  ${data.bride.name}`, W / 2, 1560);

    ctx.fillStyle = muted;
    ctx.font = '36px "Noto Serif KR", serif';
    const [y, m, d] = data.wedding.date.split('-');
    const niceDate = `${y}.${m}.${d}  ·  ${data.wedding.time}`;
    ctx.fillText(niceDate, W / 2, 1640);

    if (data.wedding.venue) {
      ctx.font = '32px "Noto Serif KR", serif';
      ctx.fillText(data.wedding.venue, W / 2, 1700);
    }

    ctx.fillStyle = muted;
    ctx.font = '24px "Noto Serif KR", serif';
    ctx.fillText(`Wedding · ${t.name}`, W / 2, 1840);

    canvas.toBlob((blob) => {
      if (!blob) {
        busy.current = false;
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `save-the-date-${data.wedding.date}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      busy.current = false;
      showToast('다운로드 완료');
    }, 'image/png');
  }

  return (
    <button className="save-date-btn" onClick={download} type="button">
      Save the Date 이미지 저장
    </button>
  );
}
