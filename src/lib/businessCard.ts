/* Generates a small business-card-sized PNG (이름 + 날짜 + QR) that
 * users can save and add to a digital wallet or share separately. The
 * QR code itself is fetched from api.qrserver.com and composited into a
 * 600×360 canvas with theme-neutral typography. */

interface CardData {
  groomName: string;
  brideName: string;
  date: string;
  url: string;
  accent?: string;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('이미지 로드 실패'));
    img.src = url;
  });
}

export async function downloadBusinessCard(card: CardData): Promise<void> {
  const W = 1200;
  const H = 720;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 미지원');

  const accent = card.accent || '#cc785c';
  const bg = '#fdfaf3';
  const ink = '#1a1a1a';
  const muted = '#777';

  // Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Decorative left accent bar
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 16, H);

  // Eyebrow
  ctx.fillStyle = accent;
  ctx.font = '600 22px "Cormorant Garamond", "Noto Serif KR", serif';
  ctx.textBaseline = 'top';
  ctx.fillText('WEDDING INVITATION', 64, 80);

  // Names
  ctx.fillStyle = ink;
  ctx.font = '500 88px "Cormorant Garamond", "Noto Serif KR", serif';
  const namesY = 132;
  ctx.fillText(card.groomName, 64, namesY);

  ctx.font = 'italic 400 70px "Cormorant Garamond", serif';
  ctx.fillStyle = accent;
  const groomWidth = ctx.measureText(card.groomName).width;
  // Approximate font metrics — use a fallback width when canvas API isn't precise
  ctx.font = '500 88px "Cormorant Garamond", "Noto Serif KR", serif';
  const groomMeasured = ctx.measureText(card.groomName).width;
  ctx.font = 'italic 400 70px "Cormorant Garamond", serif';
  ctx.fillStyle = accent;
  ctx.fillText('&', 64 + Math.max(groomWidth, groomMeasured) + 24, namesY + 12);

  ctx.font = '500 88px "Cormorant Garamond", "Noto Serif KR", serif';
  ctx.fillStyle = ink;
  ctx.fillText(card.brideName, 64 + Math.max(groomWidth, groomMeasured) + 24 + 60, namesY);

  // Divider line
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(64, 268);
  ctx.lineTo(180, 268);
  ctx.stroke();

  // Date
  ctx.fillStyle = ink;
  ctx.font = '400 38px "Cormorant Garamond", "Noto Serif KR", serif';
  ctx.fillText(card.date.replace(/-/g, '.'), 64, 296);

  // URL hint
  ctx.fillStyle = muted;
  ctx.font = '300 22px "Inter", "Noto Sans KR", sans-serif';
  ctx.fillText('스캔해서 청첩장 열기', 64, 364);

  // QR — load via qrserver, fall back to plain text if it fails.
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=${encodeURIComponent(
    card.url
  )}&margin=8&qzone=2&ecc=M`;
  try {
    const qrImg = await loadImage(qrUrl);
    ctx.drawImage(qrImg, W - 420 - 64, (H - 420) / 2, 420, 420);
  } catch {
    ctx.fillStyle = muted;
    ctx.font = '300 18px monospace';
    ctx.fillText('(QR 생성 실패)', W - 240 - 64, H / 2);
  }

  // Footer
  ctx.fillStyle = muted;
  ctx.font = '300 18px "Inter", "Noto Sans KR", sans-serif';
  ctx.fillText('Made with Wedding · 모바일 청첩장', 64, H - 60);

  // Trigger download
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `wedding-card-${card.groomName}-${card.brideName}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
