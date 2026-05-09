import type { EventType, WeddingData } from '../types';

export interface EventLabels {
  name: string;
  emoji: string;
  description: string;
  heroEyebrow: string;
  heroSubtitle: string;
  hostsSectionLabel: string;
  greetingDefaultTitle: string;
  greetingPlaceholder: string;
  partyALabel: string;
  partyBLabel: string;
  partyAChild: string;
  partyBChild: string;
  partyAParents: string;
  partyBParents: string;
  accountsTitle: string;
  accountsIntro: string;
  shareCta: string;
  rsvpHeading: string;
  guestbookHeading: string;
  ceremonyTitle: string;
  shuttleTitle: string;
  defaultGreetingBody: string;
  defaultMetaTitleTemplate: (a: string, b: string) => string;
}

export const EVENT_LABELS: Record<EventType, EventLabels> = {
  wedding: {
    name: '결혼식',
    emoji: '💍',
    description: '신랑과 신부의 결혼을 알리는 청첩장',
    heroEyebrow: 'WE ARE GETTING MARRIED',
    heroSubtitle: '소중한 분들을 초대합니다',
    hostsSectionLabel: '신랑 신부',
    greetingDefaultTitle: '소중한 분들을 초대합니다',
    greetingPlaceholder: '두 사람이 사랑으로 만나 한 가정을 이룹니다.',
    partyALabel: '신랑',
    partyBLabel: '신부',
    partyAChild: '아들',
    partyBChild: '딸',
    partyAParents: '신랑측 혼주',
    partyBParents: '신부측 혼주',
    accountsTitle: '마음 전하실 곳',
    accountsIntro: '축하의 마음을 전해주세요',
    shareCta: '청첩장 공유하기',
    rsvpHeading: '참석 의사 전달',
    guestbookHeading: '축하 메시지',
    ceremonyTitle: '예식 순서',
    shuttleTitle: '셔틀버스 안내',
    defaultGreetingBody:
      '서로 마주보며 다져온 사랑을\n이제 함께 한 곳을 바라보며\n걸어갈 수 있는 큰 사랑으로 키우고자 합니다.\n\n저희 두 사람이 사랑의 이름으로 지켜나갈 수 있게\n앞날을 따뜻한 격려로 지켜봐 주십시오.',
    defaultMetaTitleTemplate: (a, b) => `${a} ♥ ${b} 결혼합니다`,
  },
  dol: {
    name: '돌잔치',
    emoji: '🎀',
    description: '아기의 첫 생일을 가족·친지와 함께 축하하는 초대장',
    heroEyebrow: 'OUR FIRST BIRTHDAY',
    heroSubtitle: '저희 아이의 첫 생일에 초대합니다',
    hostsSectionLabel: '주인공 가족',
    greetingDefaultTitle: '첫 생일에 초대합니다',
    greetingPlaceholder: '저희 아이의 첫 번째 생일을 함께 축하해주세요.',
    partyALabel: '아기',
    partyBLabel: '부모',
    partyAChild: '주인공',
    partyBChild: '부모',
    partyAParents: '아빠·엄마',
    partyBParents: '조부모',
    accountsTitle: '돌 축의금 전하실 곳',
    accountsIntro: '아이의 첫 생일을 축하해 주세요',
    shareCta: '초대장 공유하기',
    rsvpHeading: '참석 여부 알려주기',
    guestbookHeading: '축하 메시지',
    ceremonyTitle: '돌잔치 순서',
    shuttleTitle: '셔틀버스·주차 안내',
    defaultGreetingBody:
      '하루하루가 새로움이었던\n저희 아이의 첫 번째 생일입니다.\n\n바쁘시더라도 함께 자리하시어\n축복해 주시면 감사하겠습니다.',
    defaultMetaTitleTemplate: (a) => `${a}의 첫 생일에 초대합니다`,
  },
  hwangap: {
    name: '환갑·칠순',
    emoji: '🎊',
    description: '부모님의 환갑·칠순·팔순 잔치 초대장',
    heroEyebrow: 'CELEBRATION',
    heroSubtitle: '부모님의 뜻깊은 잔치에 모십니다',
    hostsSectionLabel: '주인공',
    greetingDefaultTitle: '뜻깊은 잔치에 모십니다',
    greetingPlaceholder: '부모님께서 살아오신 시간을 함께 축하해주세요.',
    partyALabel: '아버지',
    partyBLabel: '어머니',
    partyAChild: '아버지',
    partyBChild: '어머니',
    partyAParents: '아버지측 가족',
    partyBParents: '어머니측 가족',
    accountsTitle: '축하금 전하실 곳',
    accountsIntro: '귀한 자리에 마음을 더해주세요',
    shareCta: '초대장 공유하기',
    rsvpHeading: '참석 여부 알려주기',
    guestbookHeading: '축하 메시지',
    ceremonyTitle: '잔치 순서',
    shuttleTitle: '오시는 길·주차 안내',
    defaultGreetingBody:
      '오랜 세월을 살아오시며\n저희에게 큰 사랑을 베풀어 주신\n아버지·어머니의 뜻깊은 잔치입니다.\n\n귀한 자리에 모시오니\n부디 함께 자리해 주십시오.',
    defaultMetaTitleTemplate: (a, b) => `${a}·${b} 환갑잔치에 모십니다`,
  },
  birthday: {
    name: '생일파티',
    emoji: '🎂',
    description: '특별한 생일 파티 초대장',
    heroEyebrow: 'BIRTHDAY PARTY',
    heroSubtitle: '특별한 생일에 초대합니다',
    hostsSectionLabel: '주인공',
    greetingDefaultTitle: '생일 파티에 초대합니다',
    greetingPlaceholder: '소중한 분들과 함께하고 싶은 생일이에요.',
    partyALabel: '주인공',
    partyBLabel: '공동 주인공',
    partyAChild: '주인공',
    partyBChild: '공동 주인공',
    partyAParents: '주인공측',
    partyBParents: '공동 주인공측',
    accountsTitle: '선물·송금 안내',
    accountsIntro: '마음을 더해주세요',
    shareCta: '초대장 공유하기',
    rsvpHeading: '참석 여부 알려주기',
    guestbookHeading: '축하 메시지',
    ceremonyTitle: '파티 순서',
    shuttleTitle: '오시는 길 안내',
    defaultGreetingBody:
      '평범한 하루를 특별하게 만들고 싶어요.\n\n바쁘시더라도 잠시 와주셔서\n함께 웃고, 먹고, 이야기해주세요.',
    defaultMetaTitleTemplate: (a) => `${a}의 생일파티에 초대합니다`,
  },
  corporate: {
    name: '회사 행사',
    emoji: '🏢',
    description: '회사 송년회·창립기념·론칭 행사 초대장',
    heroEyebrow: 'OFFICIAL INVITATION',
    heroSubtitle: '귀한 분들을 모십니다',
    hostsSectionLabel: '주최',
    greetingDefaultTitle: '귀한 분들을 모십니다',
    greetingPlaceholder: '함께해주신 한 해를 마무리하는 자리입니다.',
    partyALabel: '주최',
    partyBLabel: '공동 주최',
    partyAChild: '대표',
    partyBChild: '대표',
    partyAParents: '주최사',
    partyBParents: '공동 주최사',
    accountsTitle: '문의·연락처',
    accountsIntro: '행사 관련 문의를 받습니다',
    shareCta: '초대장 공유하기',
    rsvpHeading: '참석 회신 (RSVP)',
    guestbookHeading: '인사말',
    ceremonyTitle: '행사 순서',
    shuttleTitle: '오시는 길·주차 안내',
    defaultGreetingBody:
      '한 해 동안 함께해 주신 분들께\n진심으로 감사드립니다.\n\n뜻깊은 자리에 모시오니\n부디 함께해 주십시오.',
    defaultMetaTitleTemplate: (a) => `${a} 초대장`,
  },
  general: {
    name: '일반 초대',
    emoji: '✉️',
    description: '모임·행사·기타 초대 카드',
    heroEyebrow: 'INVITATION',
    heroSubtitle: '소중한 분들을 초대합니다',
    hostsSectionLabel: '주최',
    greetingDefaultTitle: '소중한 분들을 초대합니다',
    greetingPlaceholder: '함께하고 싶은 자리를 마련했어요.',
    partyALabel: '주최 1',
    partyBLabel: '주최 2',
    partyAChild: '호스트',
    partyBChild: '호스트',
    partyAParents: '주최측',
    partyBParents: '공동 주최',
    accountsTitle: '회비·후원 안내',
    accountsIntro: '필요한 분만 참고해 주세요',
    shareCta: '초대장 공유하기',
    rsvpHeading: '참석 여부 알려주기',
    guestbookHeading: '메시지 남기기',
    ceremonyTitle: '진행 순서',
    shuttleTitle: '오시는 길 안내',
    defaultGreetingBody:
      '소중한 분들과 함께하고 싶어\n자리를 마련했습니다.\n\n부담 없이 와주셔서\n좋은 시간 함께해주세요.',
    defaultMetaTitleTemplate: (a, b) => (b ? `${a} & ${b} 초대장` : `${a} 초대장`),
  },
};

export function getEventLabels(eventType: EventType | undefined): EventLabels {
  return EVENT_LABELS[eventType ?? 'wedding'];
}

export const EVENT_LIST: EventType[] = ['wedding', 'dol', 'hwangap', 'birthday', 'corporate', 'general'];

export function applyEventTemplate(data: WeddingData, eventType: EventType): WeddingData {
  const labels = EVENT_LABELS[eventType];
  const isDifferentEvent = data.eventType !== eventType;
  return {
    ...data,
    eventType,
    greeting: {
      ...data.greeting,
      title: isDifferentEvent ? labels.greetingDefaultTitle : data.greeting.title,
      body:
        isDifferentEvent && !data.greeting.body.trim()
          ? labels.defaultGreetingBody
          : data.greeting.body,
    },
    timeline: {
      ...data.timeline,
      title: isDifferentEvent ? labels.ceremonyTitle : data.timeline.title,
    },
    meta: {
      ...data.meta,
      title:
        isDifferentEvent && data.meta.title === ''
          ? labels.defaultMetaTitleTemplate(data.groom.name, data.bride.name)
          : data.meta.title,
    },
  };
}
