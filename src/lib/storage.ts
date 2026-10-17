import type { GuestbookEntry, PublishedInvitation, RsvpEntry, WeddingData } from '../types';

const DRAFT_KEY = 'wedding_draft';
const PUBLISHED_KEY = 'wedding_published_invitations';

function safeSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    // QuotaExceededError, SecurityError (private mode), etc.
    return false;
  }
}

export function saveDraft(d: WeddingData): boolean {
  return safeSet(DRAFT_KEY, JSON.stringify(d));
}

export function loadDraft(): WeddingData | null {
  let raw: string | null;
  try {
    raw = localStorage.getItem(DRAFT_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WeddingData;
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* noop */
  }
}

export function createCoupleId(): string {
  const random = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replaceAll('-', '').slice(0, 12)
    : Math.random().toString(36).slice(2, 14);
  return `c_${random}`;
}

function readPublished(): PublishedInvitation[] {
  const raw = safeGet(PUBLISHED_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as PublishedInvitation[]) : [];
  } catch {
    return [];
  }
}

export function listPublishedInvitations(): PublishedInvitation[] {
  return readPublished().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getPublishedInvitation(coupleId: string): PublishedInvitation | null {
  return readPublished().find((item) => item.coupleId === coupleId) ?? null;
}

export function savePublishedInvitation(invitation: PublishedInvitation): boolean {
  const list = readPublished().filter((item) => item.coupleId !== invitation.coupleId);
  list.unshift(invitation);
  return safeSet(PUBLISHED_KEY, JSON.stringify(list));
}

export function removePublishedInvitation(coupleId: string): boolean {
  const list = readPublished().filter((item) => item.coupleId !== coupleId);
  return safeSet(PUBLISHED_KEY, JSON.stringify(list));
}

function inviteKey(inviteId: string): string {
  return `wedding_book_${inviteId}`;
}

function rsvpKey(inviteId: string): string {
  return `wedding_rsvp_${inviteId}`;
}

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function listGuestbook(inviteId: string): GuestbookEntry[] {
  const raw = safeGet(inviteKey(inviteId));
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
  safeSet(inviteKey(inviteId), JSON.stringify(list));
}

export function removeGuestbook(inviteId: string, id: string, password: string): boolean {
  const list = listGuestbook(inviteId);
  const idx = list.findIndex((e) => e.id === id);
  if (idx < 0) return false;
  if (list[idx].password !== password) return false;
  list.splice(idx, 1);
  safeSet(inviteKey(inviteId), JSON.stringify(list));
  return true;
}

export function listRsvp(inviteId: string): RsvpEntry[] {
  const raw = safeGet(rsvpKey(inviteId));
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
  safeSet(rsvpKey(inviteId), JSON.stringify(list));
}

export function inviteIdFromEncoded(encoded: string): string {
  let h = 0;
  for (let i = 0; i < encoded.length; i++) {
    h = (h * 31 + encoded.charCodeAt(i)) | 0;
  }
  return `i${(h >>> 0).toString(36)}`;
}
