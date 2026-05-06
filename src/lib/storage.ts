import type { GuestbookEntry, RsvpEntry, WeddingData } from '../types';

const DRAFT_KEY = 'wedding_draft';

export function saveDraft(d: WeddingData) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
}

export function loadDraft(): WeddingData | null {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WeddingData;
  } catch {
    return null;
  }
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

function inviteKey(inviteId: string): string {
  return `wedding_book_${inviteId}`;
}

function rsvpKey(inviteId: string): string {
  return `wedding_rsvp_${inviteId}`;
}

export function listGuestbook(inviteId: string): GuestbookEntry[] {
  const raw = localStorage.getItem(inviteKey(inviteId));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as GuestbookEntry[];
  } catch {
    return [];
  }
}

export function addGuestbook(inviteId: string, entry: GuestbookEntry) {
  const list = listGuestbook(inviteId);
  list.unshift(entry);
  localStorage.setItem(inviteKey(inviteId), JSON.stringify(list));
}

export function removeGuestbook(inviteId: string, id: string, password: string): boolean {
  const list = listGuestbook(inviteId);
  const idx = list.findIndex((e) => e.id === id);
  if (idx < 0) return false;
  if (list[idx].password !== password) return false;
  list.splice(idx, 1);
  localStorage.setItem(inviteKey(inviteId), JSON.stringify(list));
  return true;
}

export function listRsvp(inviteId: string): RsvpEntry[] {
  const raw = localStorage.getItem(rsvpKey(inviteId));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as RsvpEntry[];
  } catch {
    return [];
  }
}

export function addRsvp(inviteId: string, entry: RsvpEntry) {
  const list = listRsvp(inviteId);
  list.unshift(entry);
  localStorage.setItem(rsvpKey(inviteId), JSON.stringify(list));
}

export function inviteIdFromEncoded(encoded: string): string {
  let h = 0;
  for (let i = 0; i < encoded.length; i++) {
    h = (h * 31 + encoded.charCodeAt(i)) | 0;
  }
  return `i${(h >>> 0).toString(36)}`;
}
