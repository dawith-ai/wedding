export type BuiltInThemeId =
  | 'original-warm'
  | 'classic-elegant'
  | 'modern-minimal'
  | 'romantic-flower'
  | 'nature-green'
  | 'luxury-gold'
  | 'simple-clean'
  | 'vintage-film'
  | 'watercolor-soft'
  | 'midnight-navy'
  | 'pastel-dream'
  | 'korean-traditional'
  | 'editorial-mono';

export type ThemeId = BuiltInThemeId | (string & {});

export type EventType =
  | 'wedding'
  | 'dol'
  | 'hwangap'
  | 'birthday'
  | 'corporate'
  | 'general';

export interface Person {
  name: string;
  father: string;
  mother: string;
  fatherDeceased?: boolean;
  motherDeceased?: boolean;
}

export interface Account {
  role: string;
  bank: string;
  number: string;
}

export interface LifeEvent {
  id: string;
  date: string;
  title: string;
  note?: string;
  photo?: string;
}

export interface WeddingData {
  theme: ThemeId;
  eventType?: EventType;
  useCurtain: boolean;
  bgm?: string;

  groom: Person;
  bride: Person;

  wedding: {
    date: string;
    time: string;
    venue: string;
    venueDetail?: string;
    address: string;
    phone?: string;
    mapKakao?: string;
    mapNaver?: string;
    mapTmap?: string;
  };

  greeting: {
    title: string;
    body: string;
  };

  story: {
    enabled: boolean;
    title: string;
    body: string;
    photos: string[];
  };

  hero: string;
  videoHero?: string;
  gallery: string[];
  mapImage?: string;
  ogImage?: string;

  accounts: {
    groom: Account[];
    bride: Account[];
  };

  guestbook: {
    enabled: boolean;
  };

  rsvp: {
    enabled: boolean;
    deadline?: string;
  };

  likes: {
    enabled: boolean;
  };

  timeline: {
    enabled: boolean;
    title: string;
    items: Array<{ time: string; label: string; note?: string }>;
  };

  shuttle: {
    enabled: boolean;
    info: string;
  };

  lifeEvents?: {
    enabled: boolean;
    title?: string;
    intro?: string;
    items: LifeEvent[];
  };

  meta: {
    title: string;
    description: string;
  };
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  password: string;
  createdAt: number;
}

export interface RsvpEntry {
  id: string;
  side: 'groom' | 'bride';
  name: string;
  attending: 'yes' | 'no';
  count: number;
  meal: 'yes' | 'no' | 'undecided';
  phone?: string;
  message?: string;
  createdAt: number;
}
