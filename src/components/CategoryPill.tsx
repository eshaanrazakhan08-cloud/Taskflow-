import type { Category } from '../types/task';
import { CATEGORY_STYLES } from '../utils/taskTokens';

interface CategoryPillProps {
  category: Category;
}

export function CategoryPill({ category }: CategoryPillProps) {
  const style = CATEGORY_STYLES[category];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold leading-[14px] tracking-[0.03em] whitespace-nowrap shrink-0 ${style.bg} ${style.text}`}
    >
      {category}
    </span>
  );
}
