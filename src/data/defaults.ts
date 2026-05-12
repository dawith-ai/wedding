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
  meta: {
    title: '김민수 ♥ 박서연 결혼합니다',
    description: '2026년 10월 10일 토요일, 소중한 분들을 초대합니다.',
  },
};
