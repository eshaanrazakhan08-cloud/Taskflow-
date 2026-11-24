import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Check, CheckSquare, Plus } from 'lucide-react';
import type { Category, Priority, Task, TaskStatus, TeamMember } from '../types/task';
import { formatDueDateLabel, isOverdue, STATUSES, validateTaskTitle } from '../utils/taskLogic';
import { STATUS_META } from '../utils/taskTokens';
import { CategoryPill } from './CategoryPill';
import { PriorityBadge } from './PriorityBadge';

interface BoardViewProps {
  tasks: Task[];
  todayStr: string;
  selectedTaskId: string | null;
  selectedCategory: Category | 'all';
  members: TeamMember[];
  onToggleComplete: (taskId: string) => void;
  onSelectTask: (taskId: string) => void;
  onMoveStatus: (taskId: string, nextStatus: TaskStatus) => void;
  onCreateColumnTask: (input: {
    title: string;
    status: TaskStatus;
    category: Category;
    priority: Priority;
    dueDate: string | null;
  }) => void;
}

export function BoardView({
  tasks,
  todayStr,
  selectedTaskId,
  selectedCategory,
  members,
  onToggleComplete,
  onSelectTask,
  onMoveStatus,
  onCreateColumnTask,
}: BoardViewProps) {
  const [addingColumn, setAddingColumn] = useState<TaskStatus | null>(null);
  const [columnTitle, setColumnTitle] = useState('');
  const [columnError, setColumnError] = useState<string | null>(null);

  const memberById = new Map(members.map((m) => [m.id, m]));

  const handleColumnSubmit = (e: FormEvent, status: TaskStatus) => {
    e.preventDefault();
    const validation = validateTaskTitle(columnTitle);
    if (!validation.valid) {
      setColumnError(validation.error);
      return;
    }

    onCreateColumnTask({
      title: columnTitle.trim(),
      status,
      category: selectedCategory === 'all' ? 'Work' : selectedCategory,
      priority: 'medium',
      dueDate: todayStr,
    });
    setColumnTitle('');
    setColumnError(null);
    setAddingColumn(null);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {STATUSES.map((status, colIndex) => {
        const columnTasks = tasks.filter((t) => t.status === status);
        const meta = STATUS_META[status];
        const prevStatus = colIndex > 0 ? STATUSES[colIndex - 1] : null;
        const nextStatus = colIndex < STATUSES.length - 1 ? STATUSES[colIndex + 1] : null;

        return (
          <section
            key={status}
            aria-labelledby={`board-col-${status}`}
            className="flex min-h-[380px] flex-col rounded-[16px] border border-[#E5E7EB] bg-[#F3F4F6]/80 p-3 dark:border-[#1E293B] dark:bg-[#111827]"
          >
            {/* Column Header */}
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h2
                  id={`board-col-${status}`}
                  className="text-[13px] font-semibold tracking-[-0.01em] text-[#0F172A] dark:text-white"
                >
                  {meta.label}
                </h2>
                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-[#64748B] tabular-nums ring-1 ring-[#E5E7EB] dark:bg-[#1E293B] dark:text-slate-300 dark:ring-[#334155]">
                  {columnTasks.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddingColumn(addingColumn === status ? null : status);
                  setColumnTitle('');
                  setColumnError(null);
                }}
                aria-label={`Add task to ${meta.label}`}
                className="rounded-[6px] p-1 text-[#64748B] hover:bg-white hover:text-[#0F172A] dark:text-slate-400 dark:hover:bg-[#1E293B] dark:hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Inline Column Quick Add */}
            {addingColumn === status && (
              <form
                onSubmit={(e) => handleColumnSubmit(e, status)}
                className="mb-2.5 rounded-[10px] border border-[#E5E7EB] bg-white p-2.5 shadow-sm dark:border-[#334155] dark:bg-[#1E293B]"
              >
                <label htmlFor={`col-input-${status}`} className="sr-only">
                  New task in {meta.label}
                </label>
                <input
                  id={`col-input-${status}`}
                  type="text"
                  autoFocus
                  value={columnTitle}
                  onChange={(e) => {
                    setColumnTitle(e.target.value);
                    if (columnError) setColumnError(null);
                  }}
                  placeholder={`Add to ${meta.label}...`}
                  className="focus-emerald h-8 w-full rounded-[6px] border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 text-[13px] text-[#0b1c30] placeholder:text-[#94A3B8] dark:border-[#334155] dark:bg-[#090D16] dark:text-white"
                />
                {columnError && (
                  <p className="mt-1 text-[11px] font-medium text-[#ba1a1a] dark:text-[#FDA4AF]">
                    {columnError}
                  </p>
                )}
                <div className="mt-2 flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAddingColumn(null);
                      setColumnError(null);
                    }}
                    className="rounded-[6px] px-2.5 py-1 text-[12px] font-medium text-[#64748B] hover:bg-[#F3F4F6] dark:text-slate-400 dark:hover:bg-[#090D16]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-[6px] bg-[#10B981] px-2.5 py-1 text-[12px] font-semibold text-white hover:bg-[#059669]"
                  >
                    Add
                  </button>
                </div>
              </form>
            )}

            {/* Cards Stack */}
            <div className="flex flex-1 flex-col gap-2">
              {columnTasks.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-[10px] border border-dashed border-[#D1D5DB]/80 p-4 text-center text-[12px] text-[#64748B] dark:border-[#334155] dark:text-slate-500">
                  No tasks in {meta.label}
                </div>
              ) : (
                columnTasks.map((task) => {
                  const isSelected = selectedTaskId === task.id;
                  const assignee = task.assigneeId ? memberById.get(task.assigneeId) : undefined;
                  const overdue = !task.completed && isOverdue(task.dueDate, todayStr);
                  const completedSubs = task.subtasks.filter((s) => s.completed).length;

                  return (
                    <article
                      key={task.id}
                      data-testid={`board-card-${task.id}`}
                      className={`group rounded-[10px] border p-3 transition-colors duration-150 ${
                        isSelected
                          ? 'border-[#10B981] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] dark:border-[#10B981] dark:bg-[#1E293B]'
                          : 'border-[#E5E7EB] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] hover:border-[#D1D5DB] dark:border-[#334155]/80 dark:bg-[#1E293B]/80 dark:hover:border-[#475569]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => onToggleComplete(task.id)}
                          aria-label={
                            task.completed
                              ? `Mark '${task.title}' incomplete`
                              : `Complete '${task.title}'`
                          }
                          className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${
                            task.completed
                              ? 'border-[#10B981] bg-[#10B981] text-white'
                              : 'border-[#D1D5DB] hover:border-[#10B981] hover:bg-[#10B981]/10 dark:border-slate-500'
                          }`}
                        >
                          {task.completed && (
                            <Check className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => onSelectTask(task.id)}
                          aria-label={`Inspect '${task.title}'`}
                          className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:underline"
                        >
                          <p
                            className={`text-[13px] leading-[18px] font-medium ${
                              task.completed
                                ? 'text-[#94A3B8] line-through dark:text-slate-500'
                                : 'text-[#0b1c30] dark:text-[#eaf1ff]'
                            }`}
                          >
                            {task.title}
                          </p>
                        </button>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <PriorityBadge priority={task.priority} />
                          <CategoryPill category={task.category} />
                          {task.dueDate && (
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-medium tabular-nums ${
                                overdue
                                  ? 'text-[#F43F5E]'
                                  : 'text-[#64748B] dark:text-slate-400'
                              }`}
                            >
                              <Calendar className="h-3 w-3" aria-hidden="true" />
                              <span>{formatDueDateLabel(task.dueDate, todayStr)}</span>
                            </span>
                          )}
                          {task.subtasks.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B] tabular-nums dark:text-slate-400">
                              <CheckSquare className="h-3 w-3" aria-hidden="true" />
                              <span>
                                {completedSubs}/{task.subtasks.length}
                              </span>
                            </span>
                          )}
                        </div>

                        {assignee && (
                          <span
                            title={assignee.name}
                            className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${assignee.colorClass}`}
                          >
                            {assignee.initials}
                          </span>
                        )}
                      </div>

                      {/* Stage Move Controls */}
                      <div className="mt-2.5 flex items-center justify-between border-t border-[#F3F4F6] pt-2 dark:border-[#334155]/70">
                        <button
                          type="button"
                          disabled={!prevStatus}
                          onClick={() => prevStatus && onMoveStatus(task.id, prevStatus)}
                          aria-label={
                            prevStatus
                              ? `Move '${task.title}' to ${STATUS_META[prevStatus].label}`
                              : `No previous stage for '${task.title}'`
                          }
                          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium text-[#64748B] hover:bg-[#F3F4F6] hover:text-[#0F172A] disabled:pointer-events-none disabled:opacity-25 dark:text-slate-400 dark:hover:bg-[#090D16] dark:hover:text-white"
                        >
                          <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                          <span>{prevStatus ? STATUS_META[prevStatus].shortLabel : 'Start'}</span>
                        </button>

                        <button
                          type="button"
                          disabled={!nextStatus}
                          onClick={() => nextStatus && onMoveStatus(task.id, nextStatus)}
                          aria-label={
                            nextStatus
                              ? `Move '${task.title}' to ${STATUS_META[nextStatus].label}`
                              : `'${task.title}' is in final stage`
                          }
                          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium text-[#64748B] hover:bg-[#F3F4F6] hover:text-[#0F172A] disabled:pointer-events-none disabled:opacity-25 dark:text-slate-400 dark:hover:bg-[#090D16] dark:hover:text-white"
                        >
                          <span>{nextStatus ? STATUS_META[nextStatus].shortLabel : 'Final'}</span>
                          <ArrowRight className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
