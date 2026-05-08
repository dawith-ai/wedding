import type { ThemeId } from '../types';

export type HeroLayout =
  | 'overlay'
  | 'framed'
  | 'stacked'
  | 'storybook'
  | 'boardingpass'
  | 'letter'
  | 'scrapbook';
export type OrnamentKind =
  | 'none'
  | 'petals'
  | 'leaves'
  | 'stars'
  | 'hearts'
  | 'sparkles'
  | 'film-grain'
  | 'watercolor-wash'
  | 'dancheong';
export type DividerKind =
  | 'plain'
  | 'gold-line'
  | 'double-dot'
  | 'floral-branch'
  | 'leaf-sprig'
  | 'hanji-line'
  | 'tilde'
  | 'none';
export type PhotoTreatment = 'none' | 'sepia' | 'vignette' | 'soft' | 'warm-tint' | 'dim';

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  preview: { bg: string; accent: string; text: string };
  fonts: { display: string; body: string; script?: string; googleQuery: string };
  layout: HeroLayout;
  ornament: OrnamentKind;
  divider: DividerKind;
  photoTreatment: PhotoTreatment;
  vars: Record<string, string>;
}

export const THEMES: Theme[] = [
  {
    id: 'original-warm',
    name: '오리지널 웜',
    description: '따뜻한 베이지, 클래식한 세리프',
    preview: { bg: '#f8f5f0', accent: '#a87f5b', text: '#3a342c' },
    fonts: {
      display: "'Noto Serif KR', serif",
      body: "'Noto Serif KR', serif",
      googleQuery: 'family=Noto+Serif+KR:wght@300;400;500;600&display=swap',
    },
    layout: 'stacked',
    ornament: 'none',
    divider: 'double-dot',
    photoTreatment: 'warm-tint',
    vars: {
      '--bg': '#f8f5f0', '--bg-alt': '#efe9e0', '--card': '#ffffff',
      '--text': '#3a342c', '--text-muted': '#5e554c',
      '--accent': '#a87f5b', '--accent-soft': '#d8c4ac',
      '--divider': '#e3d9cc', '--shadow': '0 4px 24px rgba(120, 90, 60, 0.08)',
    },
  },
  {
    id: 'classic-elegant',
    name: '클래식 엘레강트',
    description: '아이보리 + 골드, 떨어지는 꽃잎',
    preview: { bg: '#fbf7ee', accent: '#bb9560', text: '#2f261b' },
    fonts: {
      display: "'Cormorant Garamond', 'Noto Serif KR', serif",
      body: "'Noto Serif KR', serif",
      script: "'Great Vibes', cursive",
      googleQuery:
        'family=Cormorant+Garamond:wght@400;500;600&family=Great+Vibes&family=Noto+Serif+KR:wght@300;400;500&display=swap',
    },
    layout: 'overlay',
    ornament: 'petals',
    divider: 'double-dot',
    photoTreatment: 'soft',
    vars: {
      '--bg': '#fbf7ee', '--bg-alt': '#f3ecdb', '--card': '#ffffff',
      '--text': '#2f261b', '--text-muted': '#5d4f3c',
      '--accent': '#bb9560', '--accent-soft': '#dcbe8a',
      '--divider': '#e6d9bc', '--shadow': '0 4px 28px rgba(120, 90, 50, 0.08)',
    },
  },
  {
    id: 'modern-minimal',
    name: '모던 미니멀',
    description: '흑백 모노톤, 풀블리드 히어로',
    preview: { bg: '#ffffff', accent: '#111111', text: '#1a1a1a' },
    fonts: {
      display: "'Pretendard', 'Noto Sans KR', sans-serif",
      body: "'Pretendard', 'Noto Sans KR', sans-serif",
      googleQuery: 'family=Noto+Sans+KR:wght@200;300;400;500;700&display=swap',
    },
    layout: 'overlay',
    ornament: 'none',
    divider: 'plain',
    photoTreatment: 'dim',
    vars: {
      '--bg': '#ffffff', '--bg-alt': '#f5f5f5', '--card': '#ffffff',
      '--text': '#1a1a1a', '--text-muted': '#555049',
      '--accent': '#111111', '--accent-soft': '#dcdcdc',
      '--divider': '#e8e8e8', '--shadow': '0 2px 12px rgba(0, 0, 0, 0.05)',
    },
  },
  {
    id: 'romantic-flower',
    name: '동화책',
    description: '펼친 책 + 손그림 화관, 그림책 일러스트 무드',
    preview: { bg: '#fbf2e2', accent: '#c46f5b', text: '#3d2a1f' },
    fonts: {
      display: "'Cormorant Garamond', 'Noto Serif KR', serif",
      body: "'Noto Serif KR', serif",
      script: "'Caveat', 'Gowun Batang', cursive",
      googleQuery:
        'family=Cormorant+Garamond:wght@400;500;600&family=Caveat:wght@500;700&family=Noto+Serif+KR:wght@300;400;500&display=swap',
    },
    layout: 'storybook',
    ornament: 'petals',
    divider: 'floral-branch',
    photoTreatment: 'warm-tint',
    vars: {
      '--bg': '#fbf2e2', '--bg-alt': '#f4e4c8', '--card': '#fff9ee',
      '--text': '#3d2a1f', '--text-muted': '#685040',
      '--accent': '#c46f5b', '--accent-soft': '#ecc6a8',
      '--divider': '#e6d3aa', '--shadow': '0 4px 22px rgba(140, 80, 50, 0.12)',
    },
  },
  {
    id: 'nature-green',
    name: '여행 보딩패스',
    description: 'WEDDING AIRWAYS — 항공권 + 빈티지 스탬프',
    preview: { bg: '#f1ece0', accent: '#3d5a4a', text: '#1d2a25' },
    fonts: {
      display: "'IBM Plex Mono', 'Noto Sans KR', monospace",
      body: "'IBM Plex Mono', 'Noto Sans KR', monospace",
      googleQuery:
        'family=IBM+Plex+Mono:wght@400;500;700&family=Noto+Sans+KR:wght@300;400;500&display=swap',
    },
    layout: 'boardingpass',
    ornament: 'none',
    divider: 'plain',
    photoTreatment: 'warm-tint',
    vars: {
      '--bg': '#f1ece0', '--bg-alt': '#e3dcc7', '--card': '#fdfaf0',
      '--text': '#1d2a25', '--text-muted': '#4d564a',
      '--accent': '#3d5a4a', '--accent-soft': '#b9c5b1',
      '--divider': '#cdc7b3', '--shadow': '0 4px 18px rgba(40, 60, 50, 0.1)',
    },
  },
  {
    id: 'luxury-gold',
    name: '럭셔리 골드',
    description: '다크네이비 + 골드 그라디언트',
    preview: { bg: '#161830', accent: '#d4a86b', text: '#efe2c8' },
    fonts: {
      display: "'Cormorant Garamond', 'Noto Serif KR', serif",
      body: "'Noto Serif KR', serif",
      googleQuery:
        'family=Cormorant+Garamond:wght@400;500;600&family=Noto+Serif+KR:wght@300;400;500&display=swap',
    },
    layout: 'overlay',
    ornament: 'sparkles',
    divider: 'gold-line',
    photoTreatment: 'dim',
    vars: {
      '--bg': '#161830', '--bg-alt': '#1f2245', '--card': '#1c1f3a',
      '--text': '#efe2c8', '--text-muted': '#b8a989',
      '--accent': '#d4a86b', '--accent-soft': 'rgba(212, 168, 107, 0.25)',
      '--divider': 'rgba(212, 168, 107, 0.25)',
      '--shadow': '0 4px 24px rgba(0, 0, 0, 0.4)',
    },
  },
  {
    id: 'simple-clean',
    name: '심플 클린',
    description: '순백, 모든 장식 제거',
    preview: { bg: '#ffffff', accent: '#444444', text: '#222222' },
    fonts: {
      display: "'Noto Sans KR', sans-serif",
      body: "'Noto Sans KR', sans-serif",
      googleQuery: 'family=Noto+Sans+KR:wght@300;400;500&display=swap',
    },
    layout: 'stacked',
    ornament: 'none',
    divider: 'plain',
    photoTreatment: 'none',
    vars: {
      '--bg': '#ffffff', '--bg-alt': '#f7f7f7', '--card': '#ffffff',
      '--text': '#222222', '--text-muted': '#5e5e5e',
      '--accent': '#444444', '--accent-soft': '#dddddd',
      '--divider': '#eaeaea', '--shadow': 'none',
    },
  },
  {
    id: 'vintage-film',
    name: '빈티지 필름',
    description: '세피아 + 비네팅 + 필름 그레인',
    preview: { bg: '#f6ebd6', accent: '#9c7855', text: '#2c241c' },
    fonts: {
      display: "'Cormorant Garamond', 'Nanum Myeongjo', serif",
      body: "'Nanum Myeongjo', serif",
      googleQuery:
        'family=Caveat:wght@400;600&family=Cormorant+Garamond:wght@400;500&family=Nanum+Myeongjo:wght@400;700&display=swap',
    },
    layout: 'overlay',
    ornament: 'film-grain',
    divider: 'tilde',
    photoTreatment: 'sepia',
    vars: {
      '--bg': '#f6ebd6', '--bg-alt': '#ecdfc4', '--card': '#fbf3e1',
      '--text': '#2c241c', '--text-muted': '#5e4f3c',
      '--accent': '#9c7855', '--accent-soft': '#d4b88f',
      '--divider': '#d8c8a8', '--shadow': '0 6px 18px rgba(60, 40, 20, 0.18)',
    },
  },
  {
    id: 'watercolor-soft',
    name: '손편지',
    description: '밀납 인장 + 커시브 손글씨, 정성스레 접은 편지',
    preview: { bg: '#fbf3e2', accent: '#7a3f3f', text: '#3a2e26' },
    fonts: {
      display: "'Caveat', 'Gowun Batang', cursive",
      body: "'Noto Serif KR', serif",
      script: "'Caveat', 'Gowun Batang', cursive",
      googleQuery:
        'family=Caveat:wght@400;500;700&family=Cormorant+Garamond:wght@400;500&family=Noto+Serif+KR:wght@300;400;500&display=swap',
    },
    layout: 'letter',
    ornament: 'none',
    divider: 'tilde',
    photoTreatment: 'warm-tint',
    vars: {
      '--bg': '#fbf3e2', '--bg-alt': '#f0e3c4', '--card': '#fef7e6',
      '--text': '#3a2e26', '--text-muted': '#5d4d3e',
      '--accent': '#7a3f3f', '--accent-soft': '#c9aa8a',
      '--divider': '#d8c89e', '--shadow': '0 6px 22px rgba(80, 50, 30, 0.14)',
    },
  },
  {
    id: 'midnight-navy',
    name: '미드나잇 네이비',
    description: '딥네이비 + 별빛 반짝임',
    preview: { bg: '#0c1830', accent: '#d4c596', text: '#e8ecf2' },
    fonts: {
      display: "'Cormorant Garamond', 'Noto Serif KR', serif",
      body: "'Noto Serif KR', serif",
      googleQuery:
        'family=Cormorant+Garamond:wght@400;500&family=Noto+Serif+KR:wght@300;400;500&display=swap',
    },
    layout: 'overlay',
    ornament: 'stars',
    divider: 'gold-line',
    photoTreatment: 'dim',
    vars: {
      '--bg': '#0c1830', '--bg-alt': '#152244', '--card': '#15224b',
      '--text': '#e8ecf2', '--text-muted': '#9ba6bf',
      '--accent': '#d4c596', '--accent-soft': 'rgba(212, 197, 150, 0.22)',
      '--divider': 'rgba(212, 197, 150, 0.22)',
      '--shadow': '0 6px 28px rgba(0, 0, 0, 0.5)',
    },
  },
  {
    id: 'pastel-dream',
    name: '스크랩북 다이어리',
    description: '마스킹 테이프 + 폴라로이드 + 손글씨 메모',
    preview: { bg: '#fbf5e8', accent: '#d97a86', text: '#3a3030' },
    fonts: {
      display: "'Caveat', 'Gowun Batang', cursive",
      body: "'Gowun Batang', 'Noto Serif KR', serif",
      script: "'Caveat', cursive",
      googleQuery:
        'family=Caveat:wght@400;500;700&family=Gowun+Batang:wght@400;700&family=Noto+Serif+KR:wght@300;400&display=swap',
    },
    layout: 'scrapbook',
    ornament: 'hearts',
    divider: 'plain',
    photoTreatment: 'warm-tint',
    vars: {
      '--bg': '#fbf5e8', '--bg-alt': '#f3ebd6', '--card': '#fffaf1',
      '--text': '#3a3030', '--text-muted': '#6a5e54',
      '--accent': '#d97a86', '--accent-soft': '#f6c0c8',
      '--divider': '#e8dcc4', '--shadow': '0 4px 18px rgba(120, 80, 60, 0.12)',
    },
  },
  {
    id: 'korean-traditional',
    name: '한국 전통',
    description: '단청 모서리, 한지 질감',
    preview: { bg: '#faf3e2', accent: '#8b2434', text: '#2a1a16' },
    fonts: {
      display: "'Nanum Myeongjo', serif",
      body: "'Nanum Myeongjo', serif",
      googleQuery: 'family=Nanum+Myeongjo:wght@400;700;800&display=swap',
    },
    layout: 'framed',
    ornament: 'dancheong',
    divider: 'hanji-line',
    photoTreatment: 'warm-tint',
    vars: {
      '--bg': '#faf3e2', '--bg-alt': '#f0e5c8', '--card': '#fff9ea',
      '--text': '#2a1a16', '--text-muted': '#6a4f44',
      '--accent': '#8b2434', '--accent-soft': '#d8b27a',
      '--divider': '#d4c39a', '--shadow': '0 4px 18px rgba(80, 30, 30, 0.1)',
    },
  },
];

export const THEME_MAP: Record<ThemeId, Theme> = THEMES.reduce(
  (m, t) => ({ ...m, [t.id]: t }),
  {} as Record<ThemeId, Theme>
);

export function loadThemeFonts(theme: Theme) {
  const id = `theme-font-${theme.id}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${theme.fonts.googleQuery}`;
  document.head.appendChild(link);
}
