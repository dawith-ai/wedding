import type { WeddingData } from '../../types';
import { THEME_MAP } from '../../data/themes';
import { Divider } from './Divider';

interface Props {
  data: WeddingData;
}

const STYLE_LABEL: Record<string, string> = {
  course: '코스 요리',
  buffet: '뷔페',
  hanjeongsik: '한정식',
  tea: '다과',
  custom: '식사',
};

const STYLE_ICON: Record<string, string> = {
  course: '🍽️',
  buffet: '🥗',
  hanjeongsik: '🍚',
  tea: '🍵',
  custom: '🥂',
};

export function MealInfo({ data }: Props) {
  const meal = data.meal;
  if (!meal?.enabled) return null;
  const t = THEME_MAP[data.theme];
  const items = (meal.menu || []).filter((m) => m.trim().length > 0);
  const note = (meal.note ?? '').trim();
  const style = meal.style || 'custom';
  if (items.length === 0 && !note) return null;

  return (
    <section className="invite-section invite-section--tight section-meal">
      <p className="section-label">
        {t.fonts.script ? <em className="script-label">Meal</em> : 'MEAL'}
      </p>
      <h2 className="section-heading">{meal.title || '식사 안내'}</h2>
      <Divider kind={t.divider} />

      <div className="meal-card">
        <div className="meal-head">
          <span className="meal-emoji" aria-hidden>{STYLE_ICON[style]}</span>
          <span className="meal-style">{STYLE_LABEL[style]}</span>
        </div>

        {items.length > 0 && (
          <ul className="meal-menu">
            {items.map((m, i) => (
              <li key={i} className="meal-menu-item">{m}</li>
            ))}
          </ul>
        )}

        {note && <p className="meal-note">{note}</p>}
      </div>
    </section>
  );
}
