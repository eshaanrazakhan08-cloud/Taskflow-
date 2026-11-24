import { Flag } from 'lucide-react';
import type { Priority } from '../types/task';
import { PRIORITY_META } from '../utils/taskTokens';

interface PriorityBadgeProps {
  priority: Priority;
  showLabel?: boolean;
}

export function PriorityBadge({ priority, showLabel = false }: PriorityBadgeProps) {
  const meta = PRIORITY_META[priority];

  if (showLabel) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-[0.02em] whitespace-nowrap shrink-0 ${meta.pillClass}`}
      >
        <Flag className="h-3 w-3" aria-hidden="true" />
        <span>{meta.shortLabel}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold whitespace-nowrap shrink-0 ${meta.colorClass}`}
      title={meta.label}
    >
      <Flag className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only">{meta.label}</span>
    </span>
  );
}
