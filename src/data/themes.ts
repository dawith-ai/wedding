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
export type ThemeGenre = 'picturebook' | 'cinema' | 'editorial' | 'romantic' | 'nature' | 'heritage' | 'minimal' | 'night';

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
  tags?: ThemeGenre[];
  vars: Record<string, string>;
}

export const THEME_FILTERS: Array<{ id: 'all' | ThemeGenre; label: string; detail: string }> = [
  { id: 'all', label: '전체 무드', detail: '21가지 시선' },
  { id: 'picturebook', label: '그림책', detail: '아이 그림 · 붓결' },
  { id: 'cinema', label: '영화', detail: '한 편의 오프닝' },
  { id: 'editorial', label: '에디토리얼', detail: '사진과 활자' },
  { id: 'romantic', label: '로맨틱', detail: '꽃과 온기' },
  { id: 'nature', label: '보타니컬', detail: '초록의 결' },
  { id: 'heritage', label: '헤리티지', detail: '한국적인 결' },
  { id: 'minimal', label: '미니멀', detail: '여백과 구조' },
  { id: 'night', label: '애프터 다크', detail: '밤의 초대' },
];

const DEFAULT_THEME_TAGS: Record<string, ThemeGenre[]> = {
  'original-warm': ['romantic', 'editorial'],
  'classic-elegant': ['editorial', 'minimal'],
  'modern-minimal': ['minimal', 'editorial'],
  'romantic-flower': ['romantic', 'picturebook'],
  'nature-green': ['nature', 'editorial'],
  'luxury-gold': ['cinema', 'night'],
  'simple-clean': ['minimal'],
  'vintage-film': ['cinema', 'editorial'],
  'watercolor-soft': ['picturebook', 'romantic'],
  'midnight-navy': ['night', 'cinema'],
  'pastel-dream': ['picturebook', 'romantic'],
  'korean-traditional': ['heritage'],
  'editorial-mono': ['cinema', 'editorial'],
};

export function getThemeGenres(theme: Theme): ThemeGenre[] {
  return theme.tags?.length ? theme.tags : DEFAULT_THEME_TAGS[String(theme.id)] ?? [];
}

export const THEMES: Theme[] = [
  {
    id: 'original-warm',
    name: '온화한 크림',
    description: '크림 캔버스 + 코랄 액센트, 사람 냄새 나는 에디토리얼',
    preview: { bg: '#faf9f5', accent: '#cc785c', text: '#141413' },
    fonts: {
      display: "'Cormorant Garamond', 'Noto Serif KR', serif",
      body: "'Inter', 'Noto Sans KR', sans-serif",
      googleQuery:
        'family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&family=Noto+Serif+KR:wght@300;400;500&family=Noto+Sans+KR:wght@300;400;500&display=swap',
    },
    layout: 'letter',
    ornament: 'petals',
    divider: 'floral-branch',
    photoTreatment: 'warm-tint',
    vars: {
      '--bg': '#faf9f5', '--bg-alt': '#f5f0e8', '--card': '#efe9de',
      '--text': '#141413', '--text-muted': '#6c6a64',
      '--accent': '#cc785c', '--accent-soft': '#e8a55a',
      '--divider': '#e6dfd8', '--shadow': '0 4px 24px rgba(120, 90, 60, 0.08)',
    },
  },
  {
    id: 'classic-elegant',
    name: '갤러리 화이트',
    description: '박물관 같은 화이트 캔버스, 단일 액션 블루',
    preview: { bg: '#ffffff', accent: '#0066cc', text: '#1d1d1f' },
    fonts: {
      display: "'Playfair Display', 'Noto Serif KR', serif",
      body: "'Inter', 'Noto Sans KR', sans-serif",
      script: "'Pinyon Script', cursive",
      googleQuery:
        'family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500&family=Pinyon+Script&family=Noto+Serif+KR:wght@300;400;500&display=swap',
    },
    layout: 'framed',
    ornament: 'none',
    divider: 'gold-line',
    photoTreatment: 'soft',
    vars: {
      '--bg': '#ffffff', '--bg-alt': '#f5f5f7', '--card': '#fafafc',
      '--text': '#1d1d1f', '--text-muted': '#7a7a7a',
      '--accent': '#0066cc', '--accent-soft': '#2997ff',
      '--divider': '#e0e0e0', '--shadow': '0 4px 28px rgba(0, 0, 0, 0.06)',
    },
  },
  {
    id: 'modern-minimal',
    name: '기하 미니멀',
    description: '컴파일러 같은 절제, 모든 픽셀이 구조',
    preview: { bg: '#ffffff', accent: '#171717', text: '#171717' },
    fonts: {
      display: "'Italiana', 'Noto Serif KR', serif",
      body: "'Inter', 'Pretendard', 'Noto Sans KR', sans-serif",
      googleQuery:
        'family=Italiana&family=Inter:wght@300;400;500;600&family=Noto+Sans+KR:wght@300;400;500&display=swap',
    },
    layout: 'stacked',
    ornament: 'none',
    divider: 'plain',
    photoTreatment: 'none',
    vars: {
      '--bg': '#ffffff', '--bg-alt': '#fafafa', '--card': '#ffffff',
      '--text': '#171717', '--text-muted': '#666666',
      '--accent': '#171717', '--accent-soft': '#0072f5',
      '--divider': '#ebebeb', '--shadow': '0 1px 3px rgba(0, 0, 0, 0.05)',
    },
  },
  {
    id: 'romantic-flower',
    name: '로맨틱 코랄',
    description: '따뜻한 산호빛, pill 둥근 모서리, 사진 중심',
    preview: { bg: '#ffffff', accent: '#ff385c', text: '#222222' },
    fonts: {
      display: "'Quicksand', 'Noto Sans KR', sans-serif",
      body: "'Inter', 'Noto Sans KR', sans-serif",
      script: "'Sacramento', cursive",
      googleQuery:
        'family=Quicksand:wght@400;500;600;700&family=Inter:wght@400;500&family=Sacramento&family=Noto+Sans+KR:wght@300;400;500&display=swap',
    },
    layout: 'overlay',
    ornament: 'petals',
    divider: 'floral-branch',
    photoTreatment: 'soft',
    vars: {
      '--bg': '#ffffff', '--bg-alt': '#fff5f7', '--card': '#fff8f9',
      '--text': '#222222', '--text-muted': '#6a6a6a',
      '--accent': '#ff385c', '--accent-soft': '#ffd1da',
      '--divider': '#ffd9e0', '--shadow': '0 6px 24px rgba(255, 56, 92, 0.1)',
    },
  },
  {
    id: 'nature-green',
    name: '가든 그린',
    description: '딥 틸 위에 라이브 그린, 식물원 웨딩의 자연 톤',
    preview: { bg: '#ffffff', accent: '#00684a', text: '#001e2b' },
    fonts: {
      display: "'DM Sans', 'Noto Sans KR', sans-serif",
      body: "'Inter', 'Noto Sans KR', sans-serif",
      script: "'Allura', cursive",
      googleQuery:
        'family=DM+Sans:wght@400;500;700&family=Inter:wght@400;500&family=Allura&family=Noto+Sans+KR:wght@300;400;500&display=swap',
    },
    layout: 'framed',
    ornament: 'leaves',
    divider: 'leaf-sprig',
    photoTreatment: 'none',
    vars: {
      '--bg': '#ffffff', '--bg-alt': '#f9fbfa', '--card': '#e3fcef',
      '--text': '#001e2b', '--text-muted': '#5c6c7a',
      '--accent': '#00684a', '--accent-soft': '#00ed64',
      '--divider': '#dde4e0', '--shadow': '0 4px 18px rgba(0, 30, 43, 0.08)',
    },
  },
  {
    id: 'luxury-gold',
    name: '대성당 골드',
    description: '진정한 블랙 캔버스 위 골드 헤드라이트',
    preview: { bg: '#000000', accent: '#FFC000', text: '#ffffff' },
    fonts: {
      display: "'Cinzel', 'Noto Serif KR', serif",
      body: "'Inter', 'Noto Sans KR', sans-serif",
      script: "'Tangerine', cursive",
      googleQuery:
        'family=Cinzel:wght@400;500;600;700&family=Inter:wght@400;500&family=Tangerine:wght@400;700&family=Noto+Serif+KR:wght@300;400;500&display=swap',
    },
    layout: 'framed',
    ornament: 'sparkles',
    divider: 'gold-line',
    photoTreatment: 'dim',
    vars: {
      '--bg': '#000000', '--bg-alt': '#181818', '--card': '#202020',
      '--text': '#ffffff', '--text-muted': '#969696',
      '--accent': '#FFC000', '--accent-soft': 'rgba(255, 192, 0, 0.25)',
      '--divider': '#313131', '--shadow': '0 6px 28px rgba(0, 0, 0, 0.6)',
    },
  },
  {
    id: 'simple-clean',
    name: '라벤더 미니멀',
    description: '정제된 무채색에 라벤더 한 점',
    preview: { bg: '#ffffff', accent: '#5e6ad2', text: '#000000' },
    fonts: {
      display: "'Inter', 'Pretendard', 'Noto Sans KR', sans-serif",
      body: "'Inter', 'Pretendard', 'Noto Sans KR', sans-serif",
      googleQuery:
        'family=Inter:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap',
    },
    layout: 'stacked',
    ornament: 'none',
    divider: 'plain',
    photoTreatment: 'none',
    vars: {
      '--bg': '#ffffff', '--bg-alt': '#f5f6f6', '--card': '#f6f7f7',
      '--text': '#000000', '--text-muted': '#62666d',
      '--accent': '#5e6ad2', '--accent-soft': '#828fff',
      '--divider': '#e6e7eb', '--shadow': '0 2px 12px rgba(94, 106, 210, 0.08)',
    },
  },
  {
    id: 'vintage-film',
    name: '브로드시트 필름',
    description: '신문지 페이퍼 화이트, 잉크 블루, 활자 무드',
    preview: { bg: '#ffffff', accent: '#057dbc', text: '#1a1a1a' },
    fonts: {
      display: "'Libre Caslon Text', 'Nanum Myeongjo', serif",
      body: "'Lora', 'Nanum Myeongjo', serif",
      googleQuery:
        'family=Libre+Caslon+Text:wght@400;700&family=Lora:wght@400;500;600&family=JetBrains+Mono:wght@400;700&family=Nanum+Myeongjo:wght@400;700&display=swap',
    },
    layout: 'scrapbook',
    ornament: 'film-grain',
    divider: 'double-dot',
    photoTreatment: 'sepia',
    vars: {
      '--bg': '#ffffff', '--bg-alt': '#fafaf7', '--card': '#ffffff',
      '--text': '#1a1a1a', '--text-muted': '#757575',
      '--accent': '#057dbc', '--accent-soft': '#000000',
      '--divider': '#e2e8f0', '--shadow': '0 2px 0 #1a1a1a',
    },
  },
  {
    id: 'watercolor-soft',
    name: '핸드크래프트 워시',
    description: '크림 틴티드 화이트 + 점토색 카드, 수채 부케 톤',
    preview: { bg: '#fffaf0', accent: '#ff4d8b', text: '#0a0a0a' },
    fonts: {
      display: "'Fraunces', 'Noto Serif KR', serif",
      body: "'Inter', 'Noto Sans KR', sans-serif",
      script: "'Caveat', 'Gowun Batang', cursive",
      googleQuery:
        'family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500&family=Caveat:wght@400;700&family=Noto+Serif+KR:wght@300;400;500&display=swap',
    },
    layout: 'scrapbook',
    ornament: 'watercolor-wash',
    divider: 'tilde',
    photoTreatment: 'soft',
    vars: {
      '--bg': '#fffaf0', '--bg-alt': '#faf5e8', '--card': '#f5f0e0',
      '--text': '#0a0a0a', '--text-muted': '#6a6a6a',
      '--accent': '#ff4d8b', '--accent-soft': '#ffb084',
      '--divider': '#e5e0d0', '--shadow': '0 6px 22px rgba(255, 77, 139, 0.12)',
    },
  },
  {
    id: 'midnight-navy',
    name: '미드나잇 일렉트릭',
    description: '딥 네이비 잉크 위 일렉트릭 인디고, 미드나잇 가든',
    preview: { bg: '#1c1e54', accent: '#665efd', text: '#f5e9d4' },
    fonts: {
      display: "'Manrope', 'Pretendard', 'Noto Sans KR', sans-serif",
      body: "'Inter', 'Noto Sans KR', sans-serif",
      script: "'Great Vibes', cursive",
      googleQuery:
        'family=Manrope:wght@300;400;500;600;700&family=Inter:wght@400;500&family=Great+Vibes&family=Noto+Sans+KR:wght@300;400;500&display=swap',
    },
    layout: 'overlay',
    ornament: 'stars',
    divider: 'gold-line',
    photoTreatment: 'dim',
    vars: {
      '--bg': '#1c1e54', '--bg-alt': '#0d253d', '--card': '#243069',
      '--text': '#f5e9d4', '--text-muted': '#a3a8c5',
      '--accent': '#665efd', '--accent-soft': 'rgba(102, 94, 253, 0.28)',
      '--divider': 'rgba(245, 233, 212, 0.18)',
      '--shadow': '0 8px 32px rgba(0, 0, 0, 0.55)',
    },
  },
  {
    id: 'pastel-dream',
    name: '파스텔 타일',
    description: '따뜻한 미니멀 + 로즈/민트/라벤더 파스텔 카드',
    preview: { bg: '#ffffff', accent: '#7b3ff2', text: '#37352f' },
    fonts: {
      display: "'Inter', 'Pretendard', 'Noto Sans KR', sans-serif",
      body: "'Inter', 'Noto Sans KR', sans-serif",
      script: "'Dancing Script', cursive",
      googleQuery:
        'family=Inter:wght@400;500;600;700&family=Dancing+Script:wght@500;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap',
    },
    layout: 'scrapbook',
    ornament: 'petals',
    divider: 'floral-branch',
    photoTreatment: 'soft',
    vars: {
      '--bg': '#ffffff', '--bg-alt': '#f6f5f4', '--card': '#fde0ec',
      '--text': '#37352f', '--text-muted': '#787671',
      '--accent': '#7b3ff2', '--accent-soft': '#d6b6f6',
      '--divider': '#e5e3df', '--shadow': '0 4px 18px rgba(123, 63, 242, 0.1)',
    },
  },
  {
    id: 'korean-traditional',
    name: '한지 단청',
    description: '한지 크림 캔버스 + 단청 단아, 전통 혼례와 모던의 하이브리드',
    preview: { bg: '#F3F0EE', accent: '#CF4500', text: '#141413' },
    fonts: {
      display: "'Noto Serif KR', serif",
      body: "'Noto Sans KR', sans-serif",
      script: "'Nanum Brush Script', 'Gowun Batang', cursive",
      googleQuery:
        'family=Noto+Serif+KR:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700&family=Nanum+Brush+Script&family=Gowun+Batang:wght@400;700&display=swap',
    },
    layout: 'framed',
    ornament: 'dancheong',
    divider: 'hanji-line',
    photoTreatment: 'warm-tint',
    vars: {
      '--bg': '#F3F0EE', '--bg-alt': '#FCFBFA', '--card': '#FFFFFF',
      '--text': '#141413', '--text-muted': '#696969',
      '--accent': '#CF4500', '--accent-soft': '#9A3A0A',
      '--divider': '#D1CDC7', '--shadow': '0 4px 18px rgba(80, 30, 30, 0.08)',
    },
  },
  {
    id: 'editorial-mono',
    name: '시네마 모노',
    description: '순흑 캔버스 + letterspaced 화이트, 시네마틱 럭셔리',
    preview: { bg: '#000000', accent: '#ffffff', text: '#ffffff' },
    fonts: {
      display: "'Italiana', 'Cormorant Garamond', serif",
      body: "'Cormorant Garamond', 'Noto Serif KR', serif",
      googleQuery:
        'family=Italiana&family=Cormorant+Garamond:wght@300;400;500&family=JetBrains+Mono:wght@400&family=Noto+Serif+KR:wght@300;400;500&display=swap',
    },
    layout: 'overlay',
    ornament: 'none',
    divider: 'plain',
    photoTreatment: 'vignette',
    vars: {
      '--bg': '#000000', '--bg-alt': '#0d0d0d', '--card': '#141414',
      '--text': '#ffffff', '--text-muted': '#999999',
      '--accent': '#ffffff', '--accent-soft': '#c3d9f3',
      '--divider': '#262626', '--shadow': '0 8px 32px rgba(0, 0, 0, 0.7)',
    },
  },
  {
    id: 'storybook-gouache',
    name: '그림책 수채화',
    description: '한 장면씩 넘겨보는 그림책, 부드러운 붓결과 작은 문장들',
    tags: ['picturebook', 'romantic'],
    preview: { bg: '#fff8ed', accent: '#d77b65', text: '#403126' },
    fonts: {
      display: "'Fraunces', 'Noto Serif KR', serif",
      body: "'Noto Sans KR', sans-serif",
      script: "'Caveat', cursive",
      googleQuery: 'family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Caveat:wght@400;500;600&family=Noto+Sans+KR:wght@300;400;500&display=swap',
    },
    layout: 'storybook',
    ornament: 'watercolor-wash',
    divider: 'floral-branch',
    photoTreatment: 'soft',
    vars: {
      '--bg': '#fff8ed', '--bg-alt': '#f8ecdf', '--card': '#fffdf8',
      '--text': '#403126', '--text-muted': '#8a7568', '--accent': '#d77b65',
      '--accent-soft': '#f0b49a', '--divider': '#ead8c8', '--shadow': '0 8px 28px rgba(147, 96, 69, 0.12)',
    },
  },
  {
    id: 'cinema-noir',
    name: '시네마 느와르',
    description: '어두운 스크린, 한 줄의 타이틀, 영화 같은 첫 장면',
    tags: ['cinema', 'night'],
    preview: { bg: '#171518', accent: '#d9a85d', text: '#f4ede1' },
    fonts: {
      display: "'Bodoni Moda', 'Noto Serif KR', serif",
      body: "'DM Sans', 'Noto Sans KR', sans-serif",
      script: "'Italianno', cursive",
      googleQuery: 'family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=DM+Sans:wght@400;500&family=Italianno&family=Noto+Serif+KR:wght@300;400;500&display=swap',
    },
    layout: 'overlay',
    ornament: 'film-grain',
    divider: 'gold-line',
    photoTreatment: 'vignette',
    vars: {
      '--bg': '#171518', '--bg-alt': '#252126', '--card': '#211e22',
      '--text': '#f4ede1', '--text-muted': '#afa39a', '--accent': '#d9a85d',
      '--accent-soft': 'rgba(217, 168, 93, 0.25)', '--divider': 'rgba(244, 237, 225, 0.2)',
      '--shadow': '0 10px 36px rgba(0, 0, 0, 0.65)',
    },
  },
  {
    id: 'travel-postcard',
    name: '오후의 엽서',
    description: '여행지에서 부친 엽서처럼, 가볍고 선명한 우리의 초대',
    tags: ['editorial', 'nature'],
    preview: { bg: '#edf4f5', accent: '#cf6d4e', text: '#173b4a' },
    fonts: {
      display: "'DM Serif Display', 'Noto Serif KR', serif",
      body: "'DM Sans', 'Noto Sans KR', sans-serif",
      script: "'Caveat', cursive",
      googleQuery: 'family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&family=Caveat:wght@400;500;600&family=Noto+Sans+KR:wght@300;400;500&display=swap',
    },
    layout: 'boardingpass',
    ornament: 'none',
    divider: 'double-dot',
    photoTreatment: 'warm-tint',
    vars: {
      '--bg': '#edf4f5', '--bg-alt': '#e0ecee', '--card': '#f9fcfa',
      '--text': '#173b4a', '--text-muted': '#60757a', '--accent': '#cf6d4e',
      '--accent-soft': '#eab39d', '--divider': '#c9d9da', '--shadow': '0 5px 22px rgba(38, 91, 100, 0.11)',
    },
  },
  {
    id: 'kids-doodle',
    name: '꼬마 화가의 그림책',
    description: '삐뚤빼뚤한 선과 크레용 색으로 그린, 둘만의 작은 동네',
    tags: ['picturebook', 'romantic'],
    preview: { bg: '#fff7d6', accent: '#e45f4b', text: '#2d463c' },
    fonts: {
      display: "'Gaegu', 'Noto Sans KR', sans-serif",
      body: "'Noto Sans KR', sans-serif",
      script: "'Gaegu', cursive",
      googleQuery: 'family=Gaegu:wght@400;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap',
    },
    layout: 'storybook',
    ornament: 'watercolor-wash',
    divider: 'tilde',
    photoTreatment: 'soft',
    vars: {
      '--bg': '#fff7d6', '--bg-alt': '#f6edc4', '--card': '#fffdf1',
      '--text': '#2d463c', '--text-muted': '#71806a', '--accent': '#e45f4b',
      '--accent-soft': '#f3a24f', '--divider': '#ded6ad', '--shadow': '0 8px 24px rgba(92, 87, 45, 0.12)',
    },
  },
  {
    id: 'paper-collage',
    name: '종이 오려 붙인 우리',
    description: '색종이 조각, 우표, 테이프로 이어 붙인 느슨하고 귀여운 초대',
    tags: ['picturebook', 'editorial'],
    preview: { bg: '#f4e7d6', accent: '#e78663', text: '#34332d' },
    fonts: {
      display: "'DM Serif Display', 'Noto Serif KR', serif",
      body: "'DM Sans', 'Noto Sans KR', sans-serif",
      script: "'Caveat', cursive",
      googleQuery: 'family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&family=Caveat:wght@400;500;600&family=Noto+Sans+KR:wght@300;400;500&display=swap',
    },
    layout: 'scrapbook',
    ornament: 'none',
    divider: 'double-dot',
    photoTreatment: 'warm-tint',
    vars: {
      '--bg': '#f4e7d6', '--bg-alt': '#ead6c2', '--card': '#fffaf2',
      '--text': '#34332d', '--text-muted': '#86786e', '--accent': '#e78663',
      '--accent-soft': '#8fb9ae', '--divider': '#d8c1ae', '--shadow': '0 8px 24px rgba(105, 75, 48, 0.12)',
    },
  },
  {
    id: 'record-shop',
    name: '우리의 레코드숍',
    description: '두 사람이 고른 트랙과 장면을 한 장의 앨범처럼 쌓는 초대',
    tags: ['cinema', 'editorial'],
    preview: { bg: '#172a3b', accent: '#f1b35b', text: '#f7f0df' },
    fonts: {
      display: "'Bebas Neue', 'Noto Sans KR', sans-serif",
      body: "'DM Mono', 'Noto Sans KR', monospace",
      script: "'Caveat', cursive",
      googleQuery: 'family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Caveat:wght@400;500&family=Noto+Sans+KR:wght@300;400;500;700&display=swap',
    },
    layout: 'scrapbook',
    ornament: 'film-grain',
    divider: 'double-dot',
    photoTreatment: 'vignette',
    vars: {
      '--bg': '#172a3b', '--bg-alt': '#203e50', '--card': '#f7f0df',
      '--text': '#f7f0df', '--text-muted': '#b9c3c5', '--accent': '#f1b35b',
      '--accent-soft': '#d96f55', '--divider': 'rgba(247, 240, 223, 0.2)', '--shadow': '0 10px 36px rgba(0, 0, 0, 0.38)',
    },
  },
  {
    id: 'modern-hanok',
    name: '마당의 초대',
    description: '한옥의 선과 낮은 채도, 가족에게 건네는 현대적인 전통 초대장',
    tags: ['heritage', 'minimal'],
    preview: { bg: '#eee8dd', accent: '#315b59', text: '#342e28' },
    fonts: {
      display: "'Noto Serif KR', serif",
      body: "'Noto Sans KR', sans-serif",
      script: "'Gowun Batang', serif",
      googleQuery: 'family=Noto+Serif+KR:wght@400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;700&family=Gowun+Batang:wght@400;700&display=swap',
    },
    layout: 'framed',
    ornament: 'dancheong',
    divider: 'hanji-line',
    photoTreatment: 'warm-tint',
    vars: {
      '--bg': '#eee8dd', '--bg-alt': '#e5ded1', '--card': '#f9f5ec',
      '--text': '#342e28', '--text-muted': '#7b7469', '--accent': '#315b59',
      '--accent-soft': '#b66a4e', '--divider': '#cfc4b2', '--shadow': '0 8px 25px rgba(70, 55, 40, 0.11)',
    },
  },
  {
    id: 'seasonal-garden',
    name: '계절의 정원',
    description: '봄의 꽃, 여름의 초록, 가을의 빛을 한 장면에 담는 보타니컬 초대',
    tags: ['nature', 'romantic', 'picturebook'],
    preview: { bg: '#f2f0e6', accent: '#8c9a60', text: '#334238' },
    fonts: {
      display: "'Cormorant Garamond', 'Noto Serif KR', serif",
      body: "'Noto Sans KR', sans-serif",
      script: "'Allura', cursive",
      googleQuery: 'family=Cormorant+Garamond:wght@400;500;600&family=Allura&family=Noto+Sans+KR:wght@300;400;500&family=Noto+Serif+KR:wght@300;400;500&display=swap',
    },
    layout: 'storybook',
    ornament: 'leaves',
    divider: 'leaf-sprig',
    photoTreatment: 'soft',
    vars: {
      '--bg': '#f2f0e6', '--bg-alt': '#e8e8d9', '--card': '#fcfbf4',
      '--text': '#334238', '--text-muted': '#748071', '--accent': '#8c9a60',
      '--accent-soft': '#c5c99a', '--divider': '#d4d8c0', '--shadow': '0 8px 28px rgba(79, 93, 60, 0.12)',
    },
  },
];

function buildThemeMap(themes: Theme[]): Record<ThemeId, Theme> {
  return themes.reduce(
    (m, t) => ({ ...m, [t.id]: t }),
    {} as Record<ThemeId, Theme>
  );
}

let customThemes: Theme[] = [];
let combinedThemes: Theme[] = [...THEMES];
export const THEME_MAP: Record<ThemeId, Theme> = buildThemeMap(THEMES);
export const ALL_THEMES = (): Theme[] => combinedThemes;

export function setCustomThemes(themes: Theme[]) {
  customThemes = themes;
  combinedThemes = [...THEMES, ...customThemes];
  for (const t of customThemes) (THEME_MAP as Record<string, Theme>)[t.id] = t;
}

export function getCustomThemes(): Theme[] {
  return customThemes;
}

export function loadThemeFonts(theme: Theme) {
  const id = `theme-font-${theme.id}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${theme.fonts.googleQuery}`;
  document.head.appendChild(link);
}
