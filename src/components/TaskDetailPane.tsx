import { useState, type FormEvent } from 'react';
import { Calendar, Check, Plus, Trash2, X } from 'lucide-react';
import type { Category, Priority, Task, TaskStatus, TeamMember } from '../types/task';
import { addDaysToDateString, CATEGORIES, PRIORITIES, STATUSES } from '../utils/taskLogic';
import { STATUS_META } from '../utils/taskTokens';

interface TaskDetailPaneProps {
  task: Task;
  todayStr: string;
  members: TeamMember[];
  onClose: () => void;
  onToggleComplete: (taskId: string) => void;
  onUpdateTask: (taskId: string, patch: Partial<Task>) => void;
  onMoveStatus: (taskId: string, status: TaskStatus) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskDetailPane({
  task,
  todayStr,
  members,
  onClose,
  onToggleComplete,
  onUpdateTask,
  onMoveStatus,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onDeleteTask,
}: TaskDetailPaneProps) {
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [subtaskError, setSubtaskError] = useState<string | null>(null);

  const completedCount = task.subtasks.filter((s) => s.completed).length;

  const handleSubtaskSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = subtaskTitle.trim();
    if (!trimmed) {
      setSubtaskError('Subtask title cannot be empty.');
      return;
    }
    onAddSubtask(task.id, trimmed);
    setSubtaskTitle('');
    setSubtaskError(null);
  };

  return (
    <aside
      aria-label="Task inspector"
      data-testid="task-detail-pane"
      className="fixed inset-y-0 right-0 z-40 flex w-full max-w-[400px] flex-col border-l border-[#E5E7EB] bg-white shadow-xl lg:static lg:z-auto lg:w-[380px] lg:shrink-0 lg:shadow-none dark:border-[#1E293B] dark:bg-[#111827]"
    >
      {/* Inspector Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#E5E7EB] px-4 dark:border-[#1E293B]">
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          className={`inline-flex h-8 items-center gap-2 rounded-[8px] border px-3 text-[12px] font-semibold transition-colors ${
            task.completed
              ? 'border-[#10B981] bg-[#10B981]/10 text-[#006c49] dark:text-[#4edea3]'
              : 'border-[#E5E7EB] bg-white text-[#0F172A] hover:border-[#10B981] hover:text-[#006c49] dark:border-[#334155] dark:bg-[#1E293B] dark:text-white'
          }`}
        >
          <span
            className={`flex h-4 w-4 items-center justify-center rounded-full border ${
              task.completed
                ? 'border-[#10B981] bg-[#10B981] text-white'
                : 'border-[#D1D5DB] dark:border-slate-500'
            }`}
          >
            {task.completed && <Check className="h-2.5 w-2.5 stroke-[3]" aria-hidden="true" />}
          </span>
          <span>{task.completed ? 'Completed' : 'Mark Complete'}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onDeleteTask(task.id)}
            aria-label={`Delete task '${task.title}'`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[#64748B] hover:bg-[#ffdad6]/60 hover:text-[#ba1a1a] dark:text-slate-400 dark:hover:bg-[#F43F5E]/15 dark:hover:text-[#FDA4AF]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close task inspector"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[#64748B] hover:bg-[#F3F4F6] hover:text-[#0F172A] dark:text-slate-400 dark:hover:bg-[#1E293B] dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Inspector Body */}
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {/* Title */}
        <div>
          <label htmlFor="detail-task-title" className="sr-only">
            Task title
          </label>
          <textarea
            id="detail-task-title"
            rows={2}
            value={task.title}
            onChange={(e) => {
              const next = e.target.value.replace(/\n/g, ' ');
              onUpdateTask(task.id, { title: next });
            }}
            onBlur={(e) => {
              if (!e.target.value.trim()) {
                onUpdateTask(task.id, { title: 'Untitled task' });
              }
            }}
            className="focus-emerald w-full resize-none rounded-[8px] border border-transparent bg-transparent px-2 py-1.5 text-[16px] leading-snug font-semibold tracking-[-0.015em] text-[#0F172A] hover:border-[#E5E7EB] dark:text-white dark:hover:border-[#334155]"
          />
        </div>

        {/* Structured Properties Grid */}
        <div className="grid grid-cols-2 gap-3 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] p-3 dark:border-[#1E293B] dark:bg-[#090D16]">
          <div>
            <label
              htmlFor="detail-status"
              className="mb-1 block text-[11px] font-semibold tracking-[0.03em] text-[#64748B] uppercase dark:text-slate-400"
            >
              Stage
            </label>
            <select
              id="detail-status"
              value={task.status}
              onChange={(e) => onMoveStatus(task.id, e.target.value as TaskStatus)}
              className="focus-emerald h-8 w-full rounded-[6px] border border-[#E5E7EB] bg-white px-2 text-[12px] font-medium text-[#0F172A] dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-100"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="detail-priority"
              className="mb-1 block text-[11px] font-semibold tracking-[0.03em] text-[#64748B] uppercase dark:text-slate-400"
            >
              Priority
            </label>
            <select
              id="detail-priority"
              value={task.priority}
              onChange={(e) => onUpdateTask(task.id, { priority: e.target.value as Priority })}
              className="focus-emerald h-8 w-full rounded-[6px] border border-[#E5E7EB] bg-white px-2 text-[12px] font-medium text-[#0F172A] dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-100"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p === 'high' ? 'High' : p === 'medium' ? 'Medium' : 'Low'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="detail-category"
              className="mb-1 block text-[11px] font-semibold tracking-[0.03em] text-[#64748B] uppercase dark:text-slate-400"
            >
              Category
            </label>
            <select
              id="detail-category"
              value={task.category}
              onChange={(e) => onUpdateTask(task.id, { category: e.target.value as Category })}
              className="focus-emerald h-8 w-full rounded-[6px] border border-[#E5E7EB] bg-white px-2 text-[12px] font-medium text-[#0F172A] dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-100"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="detail-assignee"
              className="mb-1 block text-[11px] font-semibold tracking-[0.03em] text-[#64748B] uppercase dark:text-slate-400"
            >
              Assignee
            </label>
            <select
              id="detail-assignee"
              value={task.assigneeId ?? ''}
              onChange={(e) =>
                onUpdateTask(task.id, { assigneeId: e.target.value || null })
              }
              className="focus-emerald h-8 w-full rounded-[6px] border border-[#E5E7EB] bg-white px-2 text-[12px] font-medium text-[#0F172A] dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-100"
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date Row */}
          <div className="col-span-2 space-y-2">
            <label
              htmlFor="detail-due-date"
              className="block text-[11px] font-semibold tracking-[0.03em] text-[#64748B] uppercase dark:text-slate-400"
            >
              Due Date
            </label>
            <div className="relative">
              <Calendar
                className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[#64748B]"
                aria-hidden="true"
              />
              <input
                id="detail-due-date"
                type="date"
                value={task.dueDate ?? ''}
                onChange={(e) =>
                  onUpdateTask(task.id, {
                    dueDate: e.target.value || null,
                    inInbox: !e.target.value,
                  })
                }
                className="focus-emerald h-8 w-full rounded-[6px] border border-[#E5E7EB] bg-white pr-2 pl-8 text-[12px] font-medium text-[#0F172A] tabular-nums dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-100"
              />
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onUpdateTask(task.id, { dueDate: todayStr, inInbox: false })
                }
                className="h-7 rounded-[6px] border border-[#E5E7EB] bg-white px-2 text-[11px] font-semibold text-[#006c49] hover:bg-[#10B981]/10 dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#4edea3]"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateTask(task.id, {
                    dueDate: addDaysToDateString(todayStr, 1),
                    inInbox: false,
                  })
                }
                className="h-7 rounded-[6px] border border-[#E5E7EB] bg-white px-2 text-[11px] font-medium text-[#565e74] hover:bg-[#F3F4F6] dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-300"
              >
                Tomorrow
              </button>
              <button
                type="button"
                disabled={!task.dueDate}
                onClick={() => onUpdateTask(task.id, { dueDate: null, inInbox: true })}
                className="h-7 rounded-[6px] border border-[#E5E7EB] bg-white px-2 text-[11px] font-medium text-[#64748B] hover:bg-[#F3F4F6] disabled:opacity-40 dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-400"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="detail-task-notes"
            className="mb-1.5 block text-[11px] font-semibold tracking-[0.03em] text-[#64748B] uppercase dark:text-slate-400"
          >
            Notes
          </label>
          <textarea
            id="detail-task-notes"
            rows={4}
            value={task.notes}
            onChange={(e) => onUpdateTask(task.id, { notes: e.target.value })}
            placeholder="Add execution context, links, or verification criteria..."
            className="focus-emerald w-full resize-none rounded-[8px] border border-[#E5E7EB] bg-white p-2.5 text-[13px] leading-5 text-[#0b1c30] placeholder:text-[#94A3B8] dark:border-[#334155] dark:bg-[#090D16] dark:text-[#eaf1ff] dark:placeholder:text-slate-500"
          />
        </div>

        {/* Subtasks */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-[0.03em] text-[#64748B] uppercase dark:text-slate-400">
              Subtasks
            </span>
            {task.subtasks.length > 0 && (
              <span className="text-[12px] font-medium text-[#64748B] tabular-nums dark:text-slate-400">
                {completedCount}/{task.subtasks.length}
              </span>
            )}
          </div>

          {task.subtasks.length > 0 && (
            <div className="mb-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F4F6] dark:bg-[#1E293B]">
              <div
                className="h-full rounded-full bg-[#10B981] transition-all duration-200"
                style={{
                  width: `${Math.round((completedCount / task.subtasks.length) * 100)}%`,
                }}
              />
            </div>
          )}

          <div className="space-y-1">
            {task.subtasks.map((sub) => (
              <div
                key={sub.id}
                className="group flex items-center justify-between gap-2 rounded-[8px] px-2 py-1.5 hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/60"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleSubtask(task.id, sub.id)}
                    aria-label={
                      sub.completed
                        ? `Mark subtask '${sub.title}' incomplete`
                        : `Complete subtask '${sub.title}'`
                    }
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      sub.completed
                        ? 'border-[#10B981] bg-[#10B981] text-white'
                        : 'border-[#D1D5DB] hover:border-[#10B981] dark:border-slate-500'
                    }`}
                  >
                    {sub.completed && (
                      <Check className="h-2.5 w-2.5 stroke-[2.5]" aria-hidden="true" />
                    )}
                  </button>
                  <span
                    className={`truncate text-[13px] ${
                      sub.completed
                        ? 'text-[#94A3B8] line-through dark:text-slate-500'
                        : 'text-[#0b1c30] dark:text-[#eaf1ff]'
                    }`}
                  >
                    {sub.title}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteSubtask(task.id, sub.id)}
                  aria-label={`Remove subtask '${sub.title}'`}
                  className="rounded p-1 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-[#ba1a1a] focus:opacity-100 dark:hover:text-[#FDA4AF]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubtaskSubmit} className="mt-2">
            <div className="flex items-center gap-1.5">
              <label htmlFor="detail-new-subtask" className="sr-only">
                Add subtask
              </label>
              <input
                id="detail-new-subtask"
                type="text"
                value={subtaskTitle}
                onChange={(e) => {
                  setSubtaskTitle(e.target.value);
                  if (subtaskError) setSubtaskError(null);
                }}
                placeholder="Add a subtask..."
                className="focus-emerald h-8 flex-1 rounded-[8px] border border-[#E5E7EB] bg-white px-2.5 text-[13px] text-[#0b1c30] placeholder:text-[#94A3B8] dark:border-[#334155] dark:bg-[#090D16] dark:text-[#eaf1ff] dark:placeholder:text-slate-500"
              />
              <button
                type="submit"
                aria-label="Add subtask"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#0F172A] hover:border-[#10B981] hover:text-[#006c49] dark:border-[#334155] dark:bg-[#1E293B] dark:text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {subtaskError && (
              <p className="mt-1 text-[11px] font-medium text-[#ba1a1a] dark:text-[#FDA4AF]">
                {subtaskError}
              </p>
            )}
          </form>
        </div>
      </div>
    </aside>
  );
}
