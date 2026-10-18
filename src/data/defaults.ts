import type { WeddingData } from '../types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringList(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : fallback;
}

function accountList(value: unknown, fallback: WeddingData['accounts']['groom']): WeddingData['accounts']['groom'] {
  if (!Array.isArray(value)) return fallback;
  return value.filter(isRecord).map((account) => ({
    role: typeof account.role === 'string' ? account.role : '',
    bank: typeof account.bank === 'string' ? account.bank : '',
    number: typeof account.number === 'string' ? account.number : '',
  }));
}

export const DEFAULT_DATA: WeddingData = {
  coupleId: '',
  theme: 'original-warm',
  eventType: 'wedding',
  useCurtain: true,
  bgm: '',

  groom: {
    name: '김민수',
    father: '김아빠',
    mother: '이엄마',
    fatherDeceased: false,
    motherDeceased: false,
  },
  bride: {
    name: '박서연',
    father: '박아빠',
    mother: '최엄마',
    fatherDeceased: false,
    motherDeceased: false,
  },
  wedding: {
    date: '2026-10-10',
    time: '13:00',
    venue: '아펠가모 광화문',
    venueDetail: '5층 메인홀',
    address: '서울 종로구 종로 33 그랑서울',
    phone: '02-2076-7000',
    mapKakao: '',
    mapNaver: '',
    mapTmap: '',
  },
  greeting: {
    title: '소중한 분들을 초대합니다',
    body:
      '서로 마주보며 다져온 사랑을\n이제 함께 한 곳을 바라보며\n걸어갈 수 있는 큰 사랑으로 키우고자 합니다.\n\n저희 두 사람이 사랑의 이름으로 지켜나갈 수 있게\n앞날을 따뜻한 격려로 지켜봐 주십시오.',
  },
  story: {
    enabled: false,
    title: '우리의 이야기',
    body:
      '서로 다른 길을 걷던 두 사람이\n하나의 길을 함께 걷게 되었습니다.\n\n여러분을 소중한 자리에 초대합니다.',
    photos: [],
  },
  hero:
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&h=2000&fit=crop&crop=faces,center&q=90&auto=format',
  videoHero: 'videos/hero-couple.mp4',
  gallery: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=1500&fit=crop&crop=faces,center&q=88&auto=format',
    'https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=1200&h=1500&fit=crop&crop=faces,center&q=88&auto=format',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=1500&fit=crop&crop=faces,center&q=88&auto=format',
    'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=1200&h=1500&fit=crop&crop=faces,center&q=88&auto=format',
    'https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&h=1500&fit=crop&crop=faces,center&q=88&auto=format',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=1500&fit=crop&crop=faces,center&q=88&auto=format',
  ],
  mapImage: '',
  ogImage: '',
  accounts: {
    groom: [
      { role: '신랑', bank: '국민은행', number: '123-456-789012' },
      { role: '아버지', bank: '국민은행', number: '123-456-789012' },
      { role: '어머니', bank: '국민은행', number: '123-456-789012' },
    ],
    bride: [
      { role: '신부', bank: '신한은행', number: '110-123-456789' },
      { role: '아버지', bank: '신한은행', number: '110-123-456789' },
      { role: '어머니', bank: '신한은행', number: '110-123-456789' },
    ],
  },
  guestbook: { enabled: true, hostPassword: '', blockedWords: [] },
  rsvp: { enabled: true, deadline: '2026-10-01' },
  likes: { enabled: true },
  timeline: {
    enabled: false,
    title: '예식 순서',
    items: [
      { time: '12:30', label: '하객 입장' },
      { time: '13:00', label: '신랑 신부 입장' },
      { time: '13:10', label: '성혼 선언문' },
      { time: '13:15', label: '주례사' },
      { time: '13:25', label: '신랑 신부 인사' },
      { time: '13:30', label: '축가', note: '친구 박OO' },
      { time: '13:40', label: '신랑 신부 행진' },
      { time: '13:50', label: '폐백 / 식사' },
    ],
  },
  shuttle: {
    enabled: false,
    info: '',
  },
  lifeEvents: {
    enabled: false,
    title: '결혼 그 후',
    intro: '청첩장은 이 결혼식 이후로도 평생 살아있는 페이지입니다. 1주년, 첫 아이, 가족 여행 — 시간이 쌓일 때마다 여기에 추가해주세요.',
    items: [],
  },
  interview: {
    enabled: false,
    title: '우리 둘의 이야기',
    items: [
      {
        id: 'q1',
        question: '서로의 첫인상은 어땠나요?',
        answerGroom: '눈빛이 맑고 따뜻해서, 처음 보는데도 오래 알던 사람 같았어요.',
        answerBride: '말이 많지 않은데 챙겨주는 게 자연스러워서 신기했어요.',
      },
      {
        id: 'q2',
        question: '서로의 가장 좋아하는 점은?',
        answerGroom: '사소한 일도 끝까지 들어주고, 같이 웃어주는 마음이요.',
        answerBride: '약속을 가볍게 하지 않는 점. 한 번 말한 건 꼭 지키는 사람이에요.',
      },
      {
        id: 'q3',
        question: '결혼 후 가장 기대하는 일은?',
        answerGroom: '평일에도 같이 저녁 먹고, 같이 잠드는 일상이요.',
        answerBride: '아무 일정 없는 주말에 같이 빈둥거리는 거요.',
      },
    ],
  },
  dressCode: {
    enabled: false,
    title: '드레스 코드',
    note: '봄빛 파스텔 톤이면 더 좋아요. (의무 사항은 아니에요)',
    colors: ['#F4DCD6', '#D9CDB9', '#A3B5A2', '#CFC8B9', '#F2EFE7'],
  },
  notes: {
    enabled: false,
    groom: '결혼식까지 매일이 설레요. 그날 와주실 모든 분들께 미리 감사드려요.',
    bride: '오시는 길이 멀고 번거로우실 텐데, 그래도 함께해 주셔서 정말 감사해요.',
  },
  pin: {
    enabled: false,
    code: '',
    hint: '',
  },
  meal: {
    enabled: false,
    title: '식사 안내',
    style: 'course',
    note: '예식 후 같은 층 연회홀에서 식사가 준비되어 있습니다. 부담 없이 식사하고 가세요.',
    menu: [
      '전채 — 계절 샐러드 / 카프레제',
      '메인 — 한우 안심 스테이크 / 광어 스테이크 (택일)',
      '디저트 — 시즌 케이크 / 커피·홍차',
    ],
  },
  gallery_opts: {
    slideshow: false,
    intervalSec: 4,
    layout: 'grid',
  },
  guestPhotoWall: {
    enabled: false,
    title: '오늘의 포토제닉',
    intro: '결혼식에서 찍은 사진을 올려주세요. 두 사람이 가장 좋아하는 장면을 골라볼게요.',
    requireApproval: true,
    allowVoting: true,
  },
  meta: {
    title: '김민수 ♥ 박서연 결혼합니다',
    description: '2026년 10월 10일 토요일, 소중한 분들을 초대합니다.',
  },
};

/**
 * Merge drafts created by older app versions with the current schema.
 * A malformed or empty draft is rejected so the builder can start cleanly.
 */
export function normalizeWeddingData(input: unknown): WeddingData | null {
  if (!isRecord(input)) return null;

  const source = input as Record<string, unknown>;
  const groom = isRecord(source.groom) ? source.groom : {};
  const bride = isRecord(source.bride) ? source.bride : {};
  const wedding = isRecord(source.wedding) ? source.wedding : {};
  const greeting = isRecord(source.greeting) ? source.greeting : {};
  const story = isRecord(source.story) ? source.story : {};
  const accounts = isRecord(source.accounts) ? source.accounts : {};
  const guestbook = isRecord(source.guestbook) ? source.guestbook : {};
  const rsvp = isRecord(source.rsvp) ? source.rsvp : {};
  const likes = isRecord(source.likes) ? source.likes : {};
  const timeline = isRecord(source.timeline) ? source.timeline : {};
  const shuttle = isRecord(source.shuttle) ? source.shuttle : {};
  const meta = isRecord(source.meta) ? source.meta : {};

  return {
    ...DEFAULT_DATA,
    ...source,
    coupleId: typeof source.coupleId === 'string' ? source.coupleId : DEFAULT_DATA.coupleId,
    theme: typeof source.theme === 'string' && source.theme ? source.theme : DEFAULT_DATA.theme,
    eventType: typeof source.eventType === 'string' ? source.eventType as WeddingData['eventType'] : DEFAULT_DATA.eventType,
    useCurtain: typeof source.useCurtain === 'boolean' ? source.useCurtain : DEFAULT_DATA.useCurtain,
    bgm: typeof source.bgm === 'string' ? source.bgm : DEFAULT_DATA.bgm,
    groom: {
      ...DEFAULT_DATA.groom,
      ...groom,
      name: typeof groom.name === 'string' ? groom.name : DEFAULT_DATA.groom.name,
      father: typeof groom.father === 'string' ? groom.father : DEFAULT_DATA.groom.father,
      mother: typeof groom.mother === 'string' ? groom.mother : DEFAULT_DATA.groom.mother,
    },
    bride: {
      ...DEFAULT_DATA.bride,
      ...bride,
      name: typeof bride.name === 'string' ? bride.name : DEFAULT_DATA.bride.name,
      father: typeof bride.father === 'string' ? bride.father : DEFAULT_DATA.bride.father,
      mother: typeof bride.mother === 'string' ? bride.mother : DEFAULT_DATA.bride.mother,
    },
    wedding: {
      ...DEFAULT_DATA.wedding,
      ...wedding,
      date: typeof wedding.date === 'string' ? wedding.date : DEFAULT_DATA.wedding.date,
      time: typeof wedding.time === 'string' ? wedding.time : DEFAULT_DATA.wedding.time,
      venue: typeof wedding.venue === 'string' ? wedding.venue : DEFAULT_DATA.wedding.venue,
      venueDetail: typeof wedding.venueDetail === 'string' ? wedding.venueDetail : DEFAULT_DATA.wedding.venueDetail,
      address: typeof wedding.address === 'string' ? wedding.address : DEFAULT_DATA.wedding.address,
    },
    greeting: {
      ...DEFAULT_DATA.greeting,
      ...greeting,
      title: typeof greeting.title === 'string' ? greeting.title : DEFAULT_DATA.greeting.title,
      body: typeof greeting.body === 'string' ? greeting.body : DEFAULT_DATA.greeting.body,
    },
    story: {
      ...DEFAULT_DATA.story,
      ...story,
      enabled: typeof story.enabled === 'boolean' ? story.enabled : DEFAULT_DATA.story.enabled,
      title: typeof story.title === 'string' ? story.title : DEFAULT_DATA.story.title,
      body: typeof story.body === 'string' ? story.body : DEFAULT_DATA.story.body,
      photos: stringList(story.photos, DEFAULT_DATA.story.photos),
    },
    hero: typeof source.hero === 'string' ? source.hero : DEFAULT_DATA.hero,
    videoHero: typeof source.videoHero === 'string' ? source.videoHero : DEFAULT_DATA.videoHero,
    gallery: stringList(source.gallery, DEFAULT_DATA.gallery),
    accounts: {
      groom: accountList(accounts.groom, DEFAULT_DATA.accounts.groom),
      bride: accountList(accounts.bride, DEFAULT_DATA.accounts.bride),
    },
    guestbook: {
      ...DEFAULT_DATA.guestbook,
      ...guestbook,
      enabled: typeof guestbook.enabled === 'boolean' ? guestbook.enabled : DEFAULT_DATA.guestbook.enabled,
      hostPassword: typeof guestbook.hostPassword === 'string' ? guestbook.hostPassword : DEFAULT_DATA.guestbook.hostPassword,
      blockedWords: stringList(guestbook.blockedWords, DEFAULT_DATA.guestbook.blockedWords ?? []),
    },
    rsvp: {
      ...DEFAULT_DATA.rsvp,
      ...rsvp,
      enabled: typeof rsvp.enabled === 'boolean' ? rsvp.enabled : DEFAULT_DATA.rsvp.enabled,
      deadline: typeof rsvp.deadline === 'string' ? rsvp.deadline : DEFAULT_DATA.rsvp.deadline,
      prompt: typeof rsvp.prompt === 'string' ? rsvp.prompt : DEFAULT_DATA.rsvp.prompt,
    },
    likes: {
      ...DEFAULT_DATA.likes,
      ...likes,
      enabled: typeof likes.enabled === 'boolean' ? likes.enabled : DEFAULT_DATA.likes.enabled,
    },
    timeline: {
      ...DEFAULT_DATA.timeline,
      ...timeline,
      enabled: typeof timeline.enabled === 'boolean' ? timeline.enabled : DEFAULT_DATA.timeline.enabled,
      title: typeof timeline.title === 'string' ? timeline.title : DEFAULT_DATA.timeline.title,
      items: Array.isArray(timeline.items) ? timeline.items.filter(isRecord).map((item) => ({
        time: typeof item.time === 'string' ? item.time : '',
        label: typeof item.label === 'string' ? item.label : '',
        ...(typeof item.note === 'string' ? { note: item.note } : {}),
      })) : DEFAULT_DATA.timeline.items,
    },
    shuttle: {
      ...DEFAULT_DATA.shuttle,
      ...shuttle,
      enabled: typeof shuttle.enabled === 'boolean' ? shuttle.enabled : DEFAULT_DATA.shuttle.enabled,
      info: typeof shuttle.info === 'string' ? shuttle.info : DEFAULT_DATA.shuttle.info,
    },
    lifeEvents: isRecord(source.lifeEvents) ? {
      ...DEFAULT_DATA.lifeEvents,
      ...source.lifeEvents,
      enabled: typeof source.lifeEvents.enabled === 'boolean' ? source.lifeEvents.enabled : DEFAULT_DATA.lifeEvents!.enabled,
      title: typeof source.lifeEvents.title === 'string' ? source.lifeEvents.title : DEFAULT_DATA.lifeEvents!.title,
      intro: typeof source.lifeEvents.intro === 'string' ? source.lifeEvents.intro : DEFAULT_DATA.lifeEvents!.intro,
      items: Array.isArray(source.lifeEvents.items) ? source.lifeEvents.items : DEFAULT_DATA.lifeEvents!.items,
    } : DEFAULT_DATA.lifeEvents,
    interview: isRecord(source.interview) ? {
      ...DEFAULT_DATA.interview,
      ...source.interview,
      enabled: typeof source.interview.enabled === 'boolean' ? source.interview.enabled : DEFAULT_DATA.interview!.enabled,
      title: typeof source.interview.title === 'string' ? source.interview.title : DEFAULT_DATA.interview!.title,
      items: Array.isArray(source.interview.items) ? source.interview.items : DEFAULT_DATA.interview!.items,
    } : DEFAULT_DATA.interview,
    dressCode: isRecord(source.dressCode) ? {
      ...DEFAULT_DATA.dressCode,
      ...source.dressCode,
      enabled: typeof source.dressCode.enabled === 'boolean' ? source.dressCode.enabled : DEFAULT_DATA.dressCode!.enabled,
      title: typeof source.dressCode.title === 'string' ? source.dressCode.title : DEFAULT_DATA.dressCode!.title,
      note: typeof source.dressCode.note === 'string' ? source.dressCode.note : DEFAULT_DATA.dressCode!.note,
      colors: stringList(source.dressCode.colors, DEFAULT_DATA.dressCode!.colors),
    } : DEFAULT_DATA.dressCode,
    notes: isRecord(source.notes) ? {
      ...DEFAULT_DATA.notes,
      ...source.notes,
      enabled: typeof source.notes.enabled === 'boolean' ? source.notes.enabled : DEFAULT_DATA.notes!.enabled,
      groom: typeof source.notes.groom === 'string' ? source.notes.groom : DEFAULT_DATA.notes!.groom,
      bride: typeof source.notes.bride === 'string' ? source.notes.bride : DEFAULT_DATA.notes!.bride,
    } : DEFAULT_DATA.notes,
    pin: isRecord(source.pin) ? {
      ...DEFAULT_DATA.pin,
      ...source.pin,
      enabled: typeof source.pin.enabled === 'boolean' ? source.pin.enabled : DEFAULT_DATA.pin!.enabled,
      code: typeof source.pin.code === 'string' ? source.pin.code : DEFAULT_DATA.pin!.code,
      hint: typeof source.pin.hint === 'string' ? source.pin.hint : DEFAULT_DATA.pin!.hint,
    } : DEFAULT_DATA.pin,
    meal: isRecord(source.meal) ? {
      ...DEFAULT_DATA.meal,
      ...source.meal,
      enabled: typeof source.meal.enabled === 'boolean' ? source.meal.enabled : DEFAULT_DATA.meal!.enabled,
      title: typeof source.meal.title === 'string' ? source.meal.title : DEFAULT_DATA.meal!.title,
      note: typeof source.meal.note === 'string' ? source.meal.note : DEFAULT_DATA.meal!.note,
      menu: stringList(source.meal.menu, DEFAULT_DATA.meal!.menu),
    } : DEFAULT_DATA.meal,
    gallery_opts: isRecord(source.gallery_opts) ? {
      ...DEFAULT_DATA.gallery_opts,
      ...source.gallery_opts,
      slideshow: typeof source.gallery_opts.slideshow === 'boolean' ? source.gallery_opts.slideshow : DEFAULT_DATA.gallery_opts!.slideshow,
      intervalSec: typeof source.gallery_opts.intervalSec === 'number' ? source.gallery_opts.intervalSec : DEFAULT_DATA.gallery_opts!.intervalSec,
      layout: typeof source.gallery_opts.layout === 'string' ? source.gallery_opts.layout as NonNullable<WeddingData['gallery_opts']>['layout'] : DEFAULT_DATA.gallery_opts!.layout,
    } : DEFAULT_DATA.gallery_opts,
    guestPhotoWall: isRecord(source.guestPhotoWall) ? {
      ...DEFAULT_DATA.guestPhotoWall,
      ...source.guestPhotoWall,
      enabled: typeof source.guestPhotoWall.enabled === 'boolean' ? source.guestPhotoWall.enabled : DEFAULT_DATA.guestPhotoWall!.enabled,
      title: typeof source.guestPhotoWall.title === 'string' ? source.guestPhotoWall.title : DEFAULT_DATA.guestPhotoWall!.title,
      intro: typeof source.guestPhotoWall.intro === 'string' ? source.guestPhotoWall.intro : DEFAULT_DATA.guestPhotoWall!.intro,
      requireApproval: typeof source.guestPhotoWall.requireApproval === 'boolean' ? source.guestPhotoWall.requireApproval : DEFAULT_DATA.guestPhotoWall!.requireApproval,
      allowVoting: typeof source.guestPhotoWall.allowVoting === 'boolean' ? source.guestPhotoWall.allowVoting : DEFAULT_DATA.guestPhotoWall!.allowVoting,
    } : DEFAULT_DATA.guestPhotoWall,
    meta: {
      ...DEFAULT_DATA.meta,
      ...meta,
      title: typeof meta.title === 'string' ? meta.title : DEFAULT_DATA.meta.title,
      description: typeof meta.description === 'string' ? meta.description : DEFAULT_DATA.meta.description,
    },
  };
}
