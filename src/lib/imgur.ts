const DEFAULT_CLIENT_ID = '';

export interface UploadResult {
  url: string;
  deleteHash?: string;
}

function getClientId(): string {
  return localStorage.getItem('imgur_client_id') || DEFAULT_CLIENT_ID;
}

export function hasImgurClientId(): boolean {
  return !!getClientId();
}

export function setImgurClientId(id: string) {
  if (id) localStorage.setItem('imgur_client_id', id);
  else localStorage.removeItem('imgur_client_id');
}

export async function uploadImage(file: File): Promise<UploadResult> {
  const clientId = getClientId();
  const form = new FormData();
  form.append('image', file);
  form.append('type', 'file');
  const res = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: { Authorization: `Client-ID ${clientId}` },
    body: form,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`업로드 실패 (${res.status}) ${text}`);
  }
  const json = (await res.json()) as { data: { link: string; deletehash?: string } };
  return { url: json.data.link, deleteHash: json.data.deletehash };
}

export async function uploadImages(files: File[]): Promise<UploadResult[]> {
  const out: UploadResult[] = [];
  for (const f of files) {
    out.push(await uploadImage(f));
  }
  return out;
}

export async function uploadBase64(base64NoPrefix: string): Promise<UploadResult> {
  const clientId = getClientId();
  if (!clientId) throw new Error('Imgur Client ID가 설정되어 있지 않아요');
  const form = new FormData();
  form.append('image', base64NoPrefix);
  form.append('type', 'base64');
  const res = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: { Authorization: `Client-ID ${clientId}` },
    body: form,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`업로드 실패 (${res.status}) ${text}`);
  }
  const json = (await res.json()) as { data: { link: string; deletehash?: string } };
  return { url: json.data.link, deleteHash: json.data.deletehash };
}

export async function uploadDataUrl(dataUrl: string): Promise<UploadResult> {
  const idx = dataUrl.indexOf(',');
  const base64 = idx >= 0 ? dataUrl.slice(idx + 1) : dataUrl;
  return uploadBase64(base64);
}
