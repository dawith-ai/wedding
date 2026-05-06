import type { GuestbookEntry, RsvpEntry } from '../types';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
}

let cachedConfig: FirebaseConfig | null = null;

export function setFirebaseConfig(cfg: FirebaseConfig | null) {
  if (!cfg) {
    localStorage.removeItem('firebase_config');
    cachedConfig = null;
    return;
  }
  localStorage.setItem('firebase_config', JSON.stringify(cfg));
  cachedConfig = cfg;
}

export function getFirebaseConfig(): FirebaseConfig | null {
  if (cachedConfig) return cachedConfig;
  const raw = localStorage.getItem('firebase_config');
  if (!raw) return null;
  try {
    cachedConfig = JSON.parse(raw) as FirebaseConfig;
    return cachedConfig;
  } catch {
    return null;
  }
}

export function isFirebaseEnabled(): boolean {
  const c = getFirebaseConfig();
  return !!(c && c.apiKey && c.projectId);
}

function endpoint(path: string): string {
  const c = getFirebaseConfig();
  if (!c) throw new Error('Firebase 미설정');
  return `https://firestore.googleapis.com/v1/projects/${c.projectId}/databases/(default)/documents/${path}?key=${c.apiKey}`;
}

function valToFs(v: unknown): unknown {
  if (typeof v === 'string') return { stringValue: v };
  if (typeof v === 'number') return { integerValue: String(v) };
  if (typeof v === 'boolean') return { booleanValue: v };
  return { stringValue: String(v) };
}

function fsToVal(field: Record<string, unknown>): unknown {
  if ('stringValue' in field) return field.stringValue;
  if ('integerValue' in field) return Number(field.integerValue);
  if ('doubleValue' in field) return Number(field.doubleValue);
  if ('booleanValue' in field) return field.booleanValue;
  return null;
}

function objToFields(obj: Record<string, unknown>): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  for (const k of Object.keys(obj)) fields[k] = valToFs(obj[k]);
  return fields;
}

function docToObj(doc: { fields?: Record<string, Record<string, unknown>> }): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (!doc.fields) return out;
  for (const k of Object.keys(doc.fields)) out[k] = fsToVal(doc.fields[k]);
  return out;
}

export async function fbAddGuestbook(inviteId: string, entry: GuestbookEntry): Promise<void> {
  const url = endpoint(`guestbook_${inviteId}/${entry.id}`);
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: objToFields(entry as unknown as Record<string, unknown>) }),
  });
  if (!res.ok) throw new Error(`방명록 저장 실패 (${res.status})`);
}

export async function fbListGuestbook(inviteId: string): Promise<GuestbookEntry[]> {
  const url = endpoint(`guestbook_${inviteId}`);
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(`방명록 조회 실패 (${res.status})`);
  }
  const json = (await res.json()) as { documents?: Array<{ fields?: Record<string, Record<string, unknown>> }> };
  const docs = json.documents || [];
  return docs
    .map((d) => docToObj(d) as unknown as GuestbookEntry)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function fbDeleteGuestbook(inviteId: string, id: string): Promise<void> {
  const url = endpoint(`guestbook_${inviteId}/${id}`);
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok && res.status !== 404) throw new Error(`삭제 실패 (${res.status})`);
}

export async function fbAddRsvp(inviteId: string, entry: RsvpEntry): Promise<void> {
  const url = endpoint(`rsvp_${inviteId}/${entry.id}`);
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: objToFields(entry as unknown as Record<string, unknown>) }),
  });
  if (!res.ok) throw new Error(`RSVP 저장 실패 (${res.status})`);
}

export async function fbListRsvp(inviteId: string): Promise<RsvpEntry[]> {
  const url = endpoint(`rsvp_${inviteId}`);
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(`RSVP 조회 실패 (${res.status})`);
  }
  const json = (await res.json()) as { documents?: Array<{ fields?: Record<string, Record<string, unknown>> }> };
  const docs = json.documents || [];
  return docs
    .map((d) => docToObj(d) as unknown as RsvpEntry)
    .sort((a, b) => b.createdAt - a.createdAt);
}
