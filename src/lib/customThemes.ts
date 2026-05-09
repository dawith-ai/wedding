import type { Theme } from '../data/themes';

const STORAGE_KEY = 'wedding_custom_themes_v1';

export function loadCustomThemes(): Theme[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidTheme);
  } catch {
    return [];
  }
}

export function saveCustomThemes(themes: Theme[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
    return true;
  } catch {
    return false;
  }
}

export function upsertCustomTheme(theme: Theme): Theme[] {
  const all = loadCustomThemes();
  const idx = all.findIndex((t) => t.id === theme.id);
  if (idx >= 0) all[idx] = theme;
  else all.push(theme);
  saveCustomThemes(all);
  return all;
}

export function removeCustomTheme(id: string): Theme[] {
  const all = loadCustomThemes().filter((t) => t.id !== id);
  saveCustomThemes(all);
  return all;
}

export function isValidTheme(value: unknown): value is Theme {
  if (!value || typeof value !== 'object') return false;
  const t = value as Record<string, unknown>;
  if (typeof t.id !== 'string' || !t.id) return false;
  if (typeof t.name !== 'string') return false;
  const preview = t.preview as Record<string, unknown> | undefined;
  if (!preview || typeof preview.bg !== 'string' || typeof preview.accent !== 'string') return false;
  if (!t.fonts || !t.vars) return false;
  return true;
}

export function generateCustomThemeId(): string {
  return `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export const AI_PROMPT_TEMPLATE = `당신은 모바일 청첩장 테마 디자이너입니다.
아래 한 줄 무드 묘사를 받아서, 다음 JSON 스키마에 맞는 테마 한 개를 만들어 주세요.
- 컬러는 모두 #RRGGBB hex 형식
- 폰트는 Google Fonts에서 받을 수 있는 것만 사용
- 한국어 사용자 대상 (Noto Serif KR / Noto Sans KR / Pretendard 등 한글 폰트 포함 권장)

# 스키마
{
  "id": "custom-<영문 슬러그>",
  "name": "<한국어 이름>",
  "description": "<한 줄 한국어 설명>",
  "preview": { "bg": "#...", "accent": "#...", "text": "#..." },
  "fonts": {
    "display": "'<Display Font>', 'Noto Serif KR', serif",
    "body": "'<Body Font>', 'Noto Sans KR', sans-serif",
    "script": "'<Script Font>', cursive",
    "googleQuery": "family=<URL+Encoded+Query>&display=swap"
  },
  "layout": "overlay" | "framed" | "stacked" | "storybook" | "boardingpass" | "letter" | "scrapbook",
  "ornament": "none" | "petals" | "leaves" | "stars" | "hearts" | "sparkles" | "film-grain" | "watercolor-wash" | "dancheong",
  "divider": "plain" | "gold-line" | "double-dot" | "floral-branch" | "leaf-sprig" | "hanji-line" | "tilde" | "none",
  "photoTreatment": "none" | "sepia" | "vignette" | "soft" | "warm-tint" | "dim",
  "vars": {
    "--bg": "#...",
    "--bg-alt": "#...",
    "--card": "#...",
    "--text": "#...",
    "--text-muted": "#...",
    "--accent": "#...",
    "--accent-soft": "#...",
    "--divider": "#...",
    "--shadow": "0 4px 24px rgba(0,0,0,0.08)"
  }
}

# 무드 묘사
__MOOD__

# 응답 형식
JSON 한 개만 반환. 마크다운 코드펜스나 설명 없이 순수 JSON만.`;

export function buildAiPrompt(mood: string): string {
  return AI_PROMPT_TEMPLATE.replace('__MOOD__', mood.trim() || '나만의 분위기');
}
