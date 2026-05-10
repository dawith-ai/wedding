import type { WeddingData } from '../types';

export const DEFAULT_DATA: WeddingData = {
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
  guestbook: { enabled: true },
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
  meta: {
    title: '김민수 ♥ 박서연 결혼합니다',
    description: '2026년 10월 10일 토요일, 소중한 분들을 초대합니다.',
  },
};
