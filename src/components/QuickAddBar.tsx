import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Plus, X } from 'lucide-react';
import type { Category, Priority, TaskStatus, WorkspaceView } from '../types/task';
import { addDaysToDateString, CATEGORIES, PRIORITIES, validateTaskTitle } from '../utils/taskLogic';

interface QuickAddBarProps {
  activeView: WorkspaceView;
  todayStr: string;
  defaultCategory: Category | 'all';
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onCreateTask: (input: {
    title: string;
    priority: Priority;
    category: Category;
    dueDate: string | null;
    status: TaskStatus;
    inInbox: boolean;
  }) => void;
}

export function QuickAddBar({
  activeView,
  todayStr,
  defaultCategory,
  isOpen,
  onOpen,
  onClose,
  onCreateTask,
}: QuickAddBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>(
    defaultCategory === 'all' ? 'Work' : defaultCategory
  );
  const [duePreset, setDuePreset] = useState<'today' | 'tomorrow' | 'next_week' | 'inbox'>(
    activeView === 'inbox' ? 'inbox' : 'today'
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultCategory !== 'all') {
      setCategory(defaultCategory);
    }
  }, [defaultCategory]);

  useEffect(() => {
    setDuePreset(activeView === 'inbox' ? 'inbox' : 'today');
  }, [activeView]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const resolveDueDate = (): { dueDate: string | null; inInbox: boolean } => {
    switch (duePreset) {
      case 'today':
        return { dueDate: todayStr, inInbox: false };
      case 'tomorrow':
        return { dueDate: addDaysToDateString(todayStr, 1), inInbox: false };
      case 'next_week':
        return { dueDate: addDaysToDateString(todayStr, 7), inInbox: false };
      case 'inbox':
      default:
        return { dueDate: null, inInbox: true };
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateTaskTitle(title);
    if (!validation.valid) {
      setError(validation.error);
      inputRef.current?.focus();
      return;
    }

    const { dueDate, inInbox } = resolveDueDate();
    onCreateTask({
      title: title.trim(),
      priority,
      category,
      dueDate,
      status: 'todo',
      inInbox,
    });
    setTitle('');
    setError(null);
    inputRef.current?.focus();
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="flex h-10 w-full items-center justify-between rounded-[8px] border border-dashed border-[#D1D5DB] bg-white/70 px-3.5 text-[13px] font-medium text-[#64748B] transition-colors hover:border-[#10B981] hover:bg-white hover:text-[#0F172A] dark:border-[#334155] dark:bg-[#111827]/70 dark:text-slate-400 dark:hover:border-[#10B981] dark:hover:bg-[#111827] dark:hover:text-white"
      >
        <span className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-[#10B981]" aria-hidden="true" />
          <span>
            Add task to{' '}
            {activeView === 'inbox'
              ? 'Inbox'
              : activeView === 'upcoming'
              ? 'Upcoming'
              : activeView === 'board'
              ? 'Board'
              : 'Today'}
            ...
          </span>
        </span>
        <kbd className="hidden rounded border border-[#E5E7EB] bg-[#F9FAFB] px-1.5 py-0.5 font-mono text-[11px] text-[#64748B] sm:inline dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-400">
          N
        </kbd>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[12px] border border-[#E5E7EB] bg-white p-3.5 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] dark:border-[#334155] dark:bg-[#111827]"
    >
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <label htmlFor="quick-add-title" className="sr-only">
          Task title
        </label>
        <input
          id="quick-add-title"
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(null);
          }}
          placeholder="What needs to be executed?"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'quick-add-error' : undefined}
          className="focus-emerald h-[38px] flex-1 rounded-[8px] border border-[#E5E7EB] bg-white px-3 text-[14px] text-[#0b1c30] placeholder:text-[#94A3B8] dark:border-[#334155] dark:bg-[#090D16] dark:text-[#eaf1ff] dark:placeholder:text-slate-500"
        />

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="quick-add-priority" className="sr-only">
            Priority
          </label>
          <select
            id="quick-add-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="focus-emerald h-[38px] rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 text-[13px] font-medium text-[#0F172A] dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-100"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p === 'high' ? 'High Priority' : p === 'medium' ? 'Medium' : 'Low'}
              </option>
            ))}
          </select>

          <label htmlFor="quick-add-category" className="sr-only">
            Category
          </label>
          <select
            id="quick-add-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="focus-emerald h-[38px] rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 text-[13px] font-medium text-[#0F172A] dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-100"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label htmlFor="quick-add-due" className="sr-only">
            Due schedule
          </label>
          <select
            id="quick-add-due"
            value={duePreset}
            onChange={(e) =>
              setDuePreset(e.target.value as 'today' | 'tomorrow' | 'next_week' | 'inbox')
            }
            className="focus-emerald h-[38px] rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 text-[13px] font-medium text-[#0F172A] dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-100"
          >
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="next_week">Next Week</option>
            <option value="inbox">Inbox (Unscheduled)</option>
          </select>

          <button
            type="submit"
            className="inline-flex h-[38px] items-center rounded-[8px] bg-[#10B981] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#059669] whitespace-nowrap shrink-0"
          >
            Add Task
          </button>

          <button
            type="button"
            onClick={() => {
              setError(null);
              onClose();
            }}
            aria-label="Close quick add"
            className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[8px] border border-[#E5E7EB] text-slate-500 hover:bg-[#F3F4F6] hover:text-slate-800 dark:border-[#334155] dark:text-slate-400 dark:hover:bg-[#1E293B] dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && (
        <p
          id="quick-add-error"
          role="alert"
          className="mt-2 text-[12px] font-medium text-[#ba1a1a] dark:text-[#FDA4AF]"
        >
          {error}
        </p>
      )}
    </form>
  );
}
