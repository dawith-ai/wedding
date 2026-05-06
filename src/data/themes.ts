import type { ThemeId } from '../types';

export type HeroLayout = 'overlay' | 'framed' | 'stacked';
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
      '--text': '#3a342c', '--text-muted': '#7d736a',
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
      '--text': '#2f261b', '--text-muted': '#7d6f59',
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
      '--text': '#1a1a1a', '--text-muted': '#7a7a7a',
      '--accent': '#111111', '--accent-soft': '#dcdcdc',
      '--divider': '#e8e8e8', '--shadow': '0 2px 12px rgba(0, 0, 0, 0.05)',
    },
  },
  {
    id: 'romantic-flower',
    name: '로맨틱 플라워',
    description: '핑크 + 로즈, 플로럴 프레임',
    preview: { bg: '#fdf0ec', accent: '#b76e79', text: '#4a3737' },
    fonts: {
      display: "'Cormorant Garamond', 'Noto Serif KR', serif",
      body: "'Noto Serif KR', serif",
      script: "'Pinyon Script', cursive",
      googleQuery:
        'family=Cormorant+Garamond:wght@400;500&family=Pinyon+Script&family=Noto+Serif+KR:wght@300;400;500&display=swap',
    },
    layout: 'framed',
    ornament: 'petals',
    divider: 'floral-branch',
    photoTreatment: 'soft',
    vars: {
      '--bg': '#fdf0ec', '--bg-alt': '#f7d9d2', '--card': '#ffffff',
      '--text': '#4a3737', '--text-muted': '#856b6b',
      '--accent': '#b76e79', '--accent-soft': '#e8b9c0',
      '--divider': '#f0d0cd', '--shadow': '0 4px 24px rgba(183, 110, 121, 0.12)',
    },
  },
  {
    id: 'nature-green',
    name: '내추럴 그린',
    description: '세이지그린, 떨어지는 잎사귀',
    preview: { bg: '#f6f3e8', accent: '#7e9472', text: '#2f3a28' },
    fonts: {
      display: "'Cormorant Garamond', 'Noto Serif KR', serif",
      body: "'Noto Serif KR', serif",
      googleQuery:
        'family=Cormorant+Garamond:wght@400;500&family=Noto+Serif+KR:wght@300;400;500&display=swap',
    },
    layout: 'overlay',
    ornament: 'leaves',
    divider: 'leaf-sprig',
    photoTreatment: 'soft',
    vars: {
      '--bg': '#f6f3e8', '--bg-alt': '#e9e3d0', '--card': '#ffffff',
      '--text': '#2f3a28', '--text-muted': '#6f7868',
      '--accent': '#7e9472', '--accent-soft': '#c6d3b9',
      '--divider': '#d6cfb8', '--shadow': '0 4px 24px rgba(80, 100, 70, 0.08)',
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
      '--text': '#222222', '--text-muted': '#888888',
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
        'family=Cormorant+Garamond:wght@400;500&family=Nanum+Myeongjo:wght@400;700&display=swap',
    },
    layout: 'overlay',
    ornament: 'film-grain',
    divider: 'tilde',
    photoTreatment: 'sepia',
    vars: {
      '--bg': '#f6ebd6', '--bg-alt': '#ecdfc4', '--card': '#fbf3e1',
      '--text': '#2c241c', '--text-muted': '#7a6a52',
      '--accent': '#9c7855', '--accent-soft': '#d4b88f',
      '--divider': '#d8c8a8', '--shadow': '0 6px 18px rgba(60, 40, 20, 0.18)',
    },
  },
  {
    id: 'watercolor-soft',
    name: '수채화 소프트',
    description: '파스텔 라벤더, 수채 워시 + 스파클',
    preview: { bg: '#fbf6fb', accent: '#a78bbf', text: '#4b4254' },
    fonts: {
      display: "'Gowun Batang', 'Noto Serif KR', serif",
      body: "'Gowun Batang', 'Noto Serif KR', serif",
      script: "'Pinyon Script', cursive",
      googleQuery:
        'family=Gowun+Batang:wght@400;700&family=Pinyon+Script&family=Noto+Serif+KR:wght@300;400&display=swap',
    },
    layout: 'overlay',
    ornament: 'watercolor-wash',
    divider: 'tilde',
    photoTreatment: 'soft',
    vars: {
      '--bg': '#fbf6fb', '--bg-alt': '#f1e7f2', '--card': '#ffffff',
      '--text': '#4b4254', '--text-muted': '#8a7d96',
      '--accent': '#a78bbf', '--accent-soft': '#d8c8e3',
      '--divider': '#e6dbed', '--shadow': '0 4px 24px rgba(140, 110, 170, 0.1)',
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
    name: '파스텔 드림',
    description: '캔디 파스텔, 떠다니는 하트',
    preview: { bg: '#fff6f9', accent: '#ff9fb1', text: '#5a4954' },
    fonts: {
      display: "'Gowun Batang', 'Noto Serif KR', serif",
      body: "'Gowun Batang', 'Noto Serif KR', serif",
      script: "'Pinyon Script', cursive",
      googleQuery:
        'family=Gowun+Batang:wght@400;700&family=Pinyon+Script&family=Noto+Serif+KR:wght@300;400&display=swap',
    },
    layout: 'framed',
    ornament: 'hearts',
    divider: 'floral-branch',
    photoTreatment: 'soft',
    vars: {
      '--bg': '#fff6f9', '--bg-alt': '#ffe4ec', '--card': '#ffffff',
      '--text': '#5a4954', '--text-muted': '#9b8893',
      '--accent': '#ff9fb1', '--accent-soft': '#ffd4dd',
      '--divider': '#f6dde4', '--shadow': '0 4px 22px rgba(255, 159, 177, 0.18)',
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
