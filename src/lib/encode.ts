import type { WeddingData } from '../types';

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const b64 = (s + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function encodeData(data: WeddingData): Promise<string> {
  const json = JSON.stringify(data);
  const enc = new TextEncoder().encode(json);
  if (typeof CompressionStream !== 'undefined') {
    const cs = new CompressionStream('deflate-raw');
    const stream = new Blob([new Uint8Array(enc)]).stream().pipeThrough(cs);
    const buf = await new Response(stream).arrayBuffer();
    return 'z' + bytesToBase64Url(new Uint8Array(buf));
  }
  return 'p' + bytesToBase64Url(enc);
}

export async function decodeData(s: string): Promise<WeddingData> {
  const tag = s[0];
  const body = s.slice(1);
  const bytes = base64UrlToBytes(body);
  let json: string;
  if (tag === 'z' && typeof DecompressionStream !== 'undefined') {
    const ds = new DecompressionStream('deflate-raw');
    const stream = new Blob([new Uint8Array(bytes)]).stream().pipeThrough(ds);
    const buf = await new Response(stream).arrayBuffer();
    json = new TextDecoder().decode(buf);
  } else {
    json = new TextDecoder().decode(bytes);
  }
  return JSON.parse(json) as WeddingData;
}

export function buildShareUrl(encoded: string): string {
  const base = window.location.origin + window.location.pathname.replace(/\/$/, '');
  return `${base}/#/v/${encoded}`;
}
