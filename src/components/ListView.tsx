import { CheckCircle2, Filter, Inbox, Plus, Search, Trash2 } from 'lucide-react';
import type {
  Category,
  Priority,
  SortOption,
  Task,
  TaskFilterState,
  TeamMember,
  WorkspaceView,
} from '../types/task';
import {
  CATEGORIES,
  isDueToday,
  isDueTomorrow,
  isOverdue,
  PRIORITIES,
} from '../utils/taskLogic';
import { TaskRow } from './TaskRow';

interface ListViewProps {
  activeView: Exclude<WorkspaceView, 'board'>;
  tasks: Task[];
  todayStr: string;
  filters: TaskFilterState;
  selectedTaskId: string | null;
  members: TeamMember[];
  onChangeFilters: (next: Partial<TaskFilterState>) => void;
  onResetFilters: () => void;
  onToggleComplete: (taskId: string) => void;
  onSelectTask: (taskId: string) => void;
  onMoveOrder: (taskId: string, direction: 'up' | 'down', visibleIds: string[]) => void;
  onClearCompleted: () => void;
  onOpenQuickAdd: () => void;
}

interface TaskGroup {
  id: string;
  label: string;
  accent?: 'danger' | 'emerald' | 'indigo' | 'neutral';
  items: Task[];
}

export function ListView({
  activeView,
  tasks,
  todayStr,
  filters,
  selectedTaskId,
  members,
  onChangeFilters,
  onResetFilters,
  onToggleComplete,
  onSelectTask,
  onMoveOrder,
  onClearCompleted,
  onOpenQuickAdd,
}: ListViewProps) {
  const memberById = new Map(members.map((m) => [m.id, m]));
  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.category !== 'all' ||
    filters.priority !== 'all';

  const groups: TaskGroup[] = (() => {
    if (activeView === 'today') {
      const overdueItems = tasks.filter((t) => isOverdue(t.dueDate, todayStr));
      const todayItems = tasks.filter((t) => isDueToday(t.dueDate, todayStr));
      const result: TaskGroup[] = [];
      if (overdueItems.length > 0) {
        result.push({
          id: 'overdue',
          label: 'Overdue',
          accent: 'danger',
          items: overdueItems,
        });
      }
      if (todayItems.length > 0) {
        result.push({
          id: 'due-today',
          label: 'Due Today',
          accent: 'emerald',
          items: todayItems,
        });
      }
      return result;
    }

    if (activeView === 'upcoming') {
      const overdueItems = tasks.filter((t) => isOverdue(t.dueDate, todayStr));
      const todayItems = tasks.filter((t) => isDueToday(t.dueDate, todayStr));
      const tomorrowItems = tasks.filter((t) => isDueTomorrow(t.dueDate, todayStr));
      const laterItems = tasks.filter(
        (t) =>
          !isOverdue(t.dueDate, todayStr) &&
          !isDueToday(t.dueDate, todayStr) &&
          !isDueTomorrow(t.dueDate, todayStr)
      );
      const result: TaskGroup[] = [];
      if (overdueItems.length > 0) {
        result.push({ id: 'up-overdue', label: 'Overdue', accent: 'danger', items: overdueItems });
      }
      if (todayItems.length > 0) {
        result.push({ id: 'up-today', label: 'Today', accent: 'emerald', items: todayItems });
      }
      if (tomorrowItems.length > 0) {
        result.push({ id: 'up-tomorrow', label: 'Tomorrow', accent: 'indigo', items: tomorrowItems });
      }
      if (laterItems.length > 0) {
        result.push({ id: 'up-later', label: 'Later This Week & Beyond', accent: 'neutral', items: laterItems });
      }
      return result;
    }

    if (activeView === 'inbox') {
      return tasks.length > 0
        ? [{ id: 'inbox-list', label: 'Triage Queue', accent: 'neutral', items: tasks }]
        : [];
    }

    return tasks.length > 0
      ? [{ id: 'completed-list', label: 'Completed Log', accent: 'emerald', items: tasks }]
      : [];
  })();

  const canReorder = filters.sort === 'manual' && !hasActiveFilters && activeView !== 'completed';

  return (
    <div className="space-y-4">
      {/* Triage Filter & Sort Toolbar */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs sm:flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#64748B]"
            aria-hidden="true"
          />
          <label htmlFor="list-search-input" className="sr-only">
            Filter tasks by keyword
          </label>
          <input
            id="list-search-input"
            type="search"
            value={filters.search}
            onChange={(e) => onChangeFilters({ search: e.target.value })}
            placeholder="Filter tasks..."
            className="focus-emerald h-9 w-full rounded-[8px] border border-[#E5E7EB] bg-white pr-3 pl-8 text-[13px] text-[#0b1c30] placeholder:text-[#94A3B8] dark:border-[#334155] dark:bg-[#111827] dark:text-[#eaf1ff] dark:placeholder:text-slate-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
          <div className="hidden items-center gap-1.5 text-[12px] text-[#64748B] sm:flex dark:text-slate-400">
            <Filter className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Filter:</span>
          </div>

          <label htmlFor="filter-priority-select" className="sr-only">
            Filter by priority
          </label>
          <select
            id="filter-priority-select"
            value={filters.priority}
            onChange={(e) => onChangeFilters({ priority: e.target.value as Priority | 'all' })}
            className="focus-emerald h-9 min-w-0 rounded-[8px] border border-[#E5E7EB] bg-white px-2 text-[12px] font-medium text-[#0F172A] sm:px-2.5 sm:text-[13px] dark:border-[#334155] dark:bg-[#111827] dark:text-slate-200"
          >
            <option value="all">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p === 'high' ? 'High' : p === 'medium' ? 'Medium' : 'Low'}
              </option>
            ))}
          </select>

          <label htmlFor="filter-category-select" className="sr-only">
            Filter by category
          </label>
          <select
            id="filter-category-select"
            value={filters.category}
            onChange={(e) => onChangeFilters({ category: e.target.value as Category | 'all' })}
            className="focus-emerald h-9 min-w-0 rounded-[8px] border border-[#E5E7EB] bg-white px-2 text-[12px] font-medium text-[#0F172A] sm:px-2.5 sm:text-[13px] dark:border-[#334155] dark:bg-[#111827] dark:text-slate-200"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label htmlFor="sort-tasks-select" className="sr-only">
            Sort tasks
          </label>
          <select
            id="sort-tasks-select"
            value={filters.sort}
            onChange={(e) => onChangeFilters({ sort: e.target.value as SortOption })}
            className="focus-emerald h-9 min-w-0 rounded-[8px] border border-[#E5E7EB] bg-white px-2 text-[12px] font-medium text-[#0F172A] sm:px-2.5 sm:text-[13px] dark:border-[#334155] dark:bg-[#111827] dark:text-slate-200"
          >
            <option value="manual">Manual Order</option>
            <option value="priority">Sort: Priority</option>
            <option value="dueDate">Sort: Due Date</option>
            <option value="title">Sort: Title</option>
          </select>

          {activeView === 'completed' && tasks.length > 0 && (
            <button
              type="button"
              onClick={onClearCompleted}
              className="col-span-3 inline-flex h-9 items-center justify-center gap-1.5 rounded-[8px] border border-[#E5E7EB] bg-white px-3 text-[13px] font-medium text-[#ba1a1a] transition-colors hover:bg-[#ffdad6]/50 sm:col-span-1 dark:border-[#334155] dark:bg-[#111827] dark:text-[#FDA4AF] dark:hover:bg-[#F43F5E]/15"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Clear Completed</span>
            </button>
          )}
        </div>
      </div>

      {/* Grouped Task Panels or Empty State */}
      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[16px] border border-[#E5E7EB] bg-white px-6 py-14 text-center shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] dark:border-[#1E293B] dark:bg-[#111827]">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#10B981]/10 text-[#10B981]">
            {activeView === 'inbox' ? (
              <Inbox className="h-5 w-5" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            )}
          </div>
          <h2 className="text-[16px] font-semibold tracking-[-0.015em] text-[#0F172A] dark:text-white">
            {hasActiveFilters
              ? 'No matching tasks'
              : activeView === 'inbox'
              ? 'Inbox Zero'
              : activeView === 'completed'
              ? 'No completed tasks yet'
              : 'All caught up'}
          </h2>
          <p className="mt-1 max-w-sm text-[13px] text-[#64748B] dark:text-slate-400">
            {hasActiveFilters
              ? 'Adjust your search query or clear active priority and category filters.'
              : activeView === 'inbox'
              ? 'Incoming unscheduled tasks will appear here ready for triage.'
              : activeView === 'completed'
              ? 'Tasks you check off across Today, Inbox, or Board are archived here.'
              : 'Nothing pending in this schedule window. Capture a new task to stay ahead.'}
          </p>
          <div className="mt-4">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex h-9 items-center rounded-[8px] border border-[#E5E7EB] bg-white px-4 text-[13px] font-medium text-[#0F172A] hover:bg-[#F3F4F6] dark:border-[#334155] dark:bg-[#1E293B] dark:text-white dark:hover:bg-[#334155]"
              >
                Reset Filters
              </button>
            ) : (
              activeView !== 'completed' && (
                <button
                  type="button"
                  onClick={onOpenQuickAdd}
                  className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-[#10B981] px-4 text-[13px] font-semibold text-white hover:bg-[#059669]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>Add Task</span>
                </button>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map((group) => {
            const visibleIds = group.items.map((item) => item.id);
            const headingAccent =
              group.accent === 'danger'
                ? 'text-[#E11D48] dark:text-[#FDA4AF]'
                : group.accent === 'emerald'
                ? 'text-[#006c49] dark:text-[#4edea3]'
                : group.accent === 'indigo'
                ? 'text-[#494bd6] dark:text-[#9699ff]'
                : 'text-[#565e74] dark:text-slate-300';

            return (
              <section key={group.id} aria-labelledby={`section-${group.id}`}>
                <div className="mb-2 flex items-center justify-between px-1">
                  <h2
                    id={`section-${group.id}`}
                    className={`text-[12px] font-semibold tracking-[0.02em] uppercase ${headingAccent}`}
                  >
                    {group.label}
                  </h2>
                  <span className="text-[12px] font-medium text-[#64748B] tabular-nums dark:text-slate-400">
                    {group.items.length}
                  </span>
                </div>

                <div className="overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] dark:border-[#1E293B] dark:bg-[#111827]">
                  {group.items.map((task, idx) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      todayStr={todayStr}
                      isSelected={selectedTaskId === task.id}
                      assignee={task.assigneeId ? memberById.get(task.assigneeId) : undefined}
                      canReorder={canReorder && group.items.length > 1}
                      isFirst={idx === 0}
                      isLast={idx === group.items.length - 1}
                      onToggleComplete={onToggleComplete}
                      onSelect={onSelectTask}
                      onMoveOrder={(id, dir) => onMoveOrder(id, dir, visibleIds)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
