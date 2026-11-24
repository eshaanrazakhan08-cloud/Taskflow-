import { ArrowDown, ArrowUp, Calendar, Check, CheckSquare, GripVertical } from 'lucide-react';
import type { Task, TeamMember } from '../types/task';
import { formatDueDateLabel, isDueToday, isOverdue } from '../utils/taskLogic';
import { CategoryPill } from './CategoryPill';
import { PriorityBadge } from './PriorityBadge';

interface TaskRowProps {
  task: Task;
  todayStr: string;
  isSelected: boolean;
  assignee: TeamMember | undefined;
  canReorder?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onToggleComplete: (taskId: string) => void;
  onSelect: (taskId: string) => void;
  onMoveOrder?: (taskId: string, direction: 'up' | 'down') => void;
}

export function TaskRow({
  task,
  todayStr,
  isSelected,
  assignee,
  canReorder = false,
  isFirst = false,
  isLast = false,
  onToggleComplete,
  onSelect,
  onMoveOrder,
}: TaskRowProps) {
  const overdue = !task.completed && isOverdue(task.dueDate, todayStr);
  const dueToday = !task.completed && isDueToday(task.dueDate, todayStr);
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <div
      data-testid={`task-row-${task.id}`}
      className={`group flex items-center gap-2 border-b border-[#F3F4F6] px-3 py-2.5 transition-colors duration-150 last:border-b-0 dark:border-[#1E293B] ${
        isSelected
          ? 'bg-[#eff4ff] dark:bg-[#1E293B]/90'
          : 'bg-white hover:bg-[#F8FAFC] dark:bg-[#111827] dark:hover:bg-[#1E293B]/60'
      }`}
    >
      {/* Left-aligned reorder / grip controls revealed on hover (desktop/tablet) */}
      <div className="hidden w-5 shrink-0 items-center justify-center sm:flex">
        {canReorder && onMoveOrder ? (
          <div className="flex flex-col opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              disabled={isFirst}
              onClick={() => onMoveOrder(task.id, 'up')}
              aria-label={`Move '${task.title}' up`}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 disabled:opacity-25 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            >
              <ArrowUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={() => onMoveOrder(task.id, 'down')}
              aria-label={`Move '${task.title}' down`}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 disabled:opacity-25 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            >
              <ArrowDown className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <GripVertical
            className="h-3.5 w-3.5 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-600"
            aria-hidden="true"
          />
        )}
      </div>

      {/* 18px geometric completion circle */}
      <button
        type="button"
        onClick={() => onToggleComplete(task.id)}
        aria-label={
          task.completed
            ? `Mark '${task.title}' incomplete`
            : `Complete '${task.title}'`
        }
        aria-pressed={task.completed}
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/40 ${
          task.completed
            ? 'animate-check-pop border-[#10B981] bg-[#10B981] text-white'
            : 'border-[#D1D5DB] bg-transparent hover:border-[#10B981] hover:bg-[#10B981]/10 dark:border-slate-600 dark:hover:border-[#10B981]'
        }`}
      >
        {task.completed && <Check className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />}
      </button>

      {/* Primary task title trigger */}
      <button
        type="button"
        onClick={() => onSelect(task.id)}
        aria-label={`Inspect '${task.title}'`}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left focus-visible:outline-none focus-visible:underline"
      >
        <span
          className={`truncate text-[14px] leading-5 tracking-[-0.005em] ${
            task.completed
              ? 'text-[#94A3B8] line-through dark:text-slate-500'
              : 'font-normal text-[#0b1c30] dark:text-[#eaf1ff]'
          }`}
        >
          {task.title}
        </span>

        {totalSubtasks > 0 && (
          <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-medium text-slate-500 tabular-nums dark:text-slate-400">
            <CheckSquare className="h-3 w-3 text-slate-400" aria-hidden="true" />
            <span>
              {completedSubtasks}/{totalSubtasks}
            </span>
          </span>
        )}
      </button>

      {/* Right-aligned metadata cluster */}
      <div className="flex shrink-0 items-center gap-2.5">
        <PriorityBadge priority={task.priority} />

        {task.dueDate && (
          <span
            className={`hidden items-center gap-1 text-[12px] font-medium tabular-nums sm:inline-flex ${
              overdue
                ? 'text-[#F43F5E]'
                : dueToday
                ? 'text-[#006c49] dark:text-[#4edea3]'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Calendar className="h-3 w-3" aria-hidden="true" />
            <span>{formatDueDateLabel(task.dueDate, todayStr)}</span>
          </span>
        )}

        <CategoryPill category={task.category} />

        {assignee && (
          <span
            title={`${assignee.name} (${assignee.role})`}
            className={`hidden h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold sm:inline-flex ${assignee.colorClass}`}
          >
            {assignee.initials}
          </span>
        )}
      </div>
    </div>
  );
}
