/* QR code helper.
 *
 * For URL share previews we delegate to api.qrserver.com (free, no auth,
 * stable since 2014). Their data param accepts up to ~2k characters, which
 * comfortably covers the typical compressed invitation payload. Longer
 * payloads return null so callers can hide the QR gracefully. */

const QR_MAX_LEN = 1900;

export function qrImageUrl(data: string, size = 280): string | null {
  if (!data) return null;
  if (data.length > QR_MAX_LEN) return null;
  const params = new URLSearchParams({
    size: `${size}x${size}`,
    data,
    margin: '8',
    qzone: '2',
    ecc: 'M',
  });
  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
}

export function isQrCapable(data: string): boolean {
  return data.length <= QR_MAX_LEN;
}
