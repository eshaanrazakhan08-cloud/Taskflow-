import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  Inbox,
  Kanban,
  Moon,
  Plus,
  Search,
  Sun,
  SunMedium,
} from 'lucide-react';
import type { Task, WorkspaceView } from '../types/task';
import { formatDueDateLabel } from '../utils/taskLogic';
import { CategoryPill } from './CategoryPill';
import { PriorityBadge } from './PriorityBadge';

interface CommandPaletteProps {
  isOpen: boolean;
  tasks: Task[];
  todayStr: string;
  darkMode: boolean;
  onClose: () => void;
  onSelectTask: (task: Task) => void;
  onNavigateView: (view: WorkspaceView) => void;
  onCreateQuickTask: (title: string) => void;
  onToggleDarkMode: () => void;
}

type CommandEntry =
  | { kind: 'create'; id: string; title: string }
  | { kind: 'task'; id: string; task: Task }
  | {
      kind: 'action';
      id: string;
      label: string;
      shortcut?: string;
      icon: 'today' | 'inbox' | 'upcoming' | 'board' | 'completed' | 'theme';
      run: () => void;
    };

export function CommandPalette({
  isOpen,
  tasks,
  todayStr,
  darkMode,
  onClose,
  onSelectTask,
  onNavigateView,
  onCreateQuickTask,
  onToggleDarkMode,
}: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  const entries: CommandEntry[] = useMemo(() => {
    const trimmed = query.trim();
    const q = trimmed.toLowerCase();

    const viewActions: CommandEntry[] = [
      {
        kind: 'action',
        id: 'nav-today',
        label: 'Go to Today',
        shortcut: '1',
        icon: 'today',
        run: () => onNavigateView('today'),
      },
      {
        kind: 'action',
        id: 'nav-inbox',
        label: 'Go to Inbox',
        shortcut: '2',
        icon: 'inbox',
        run: () => onNavigateView('inbox'),
      },
      {
        kind: 'action',
        id: 'nav-upcoming',
        label: 'Go to Upcoming',
        shortcut: '3',
        icon: 'upcoming',
        run: () => onNavigateView('upcoming'),
      },
      {
        kind: 'action',
        id: 'nav-board',
        label: 'Go to Board',
        shortcut: '4',
        icon: 'board',
        run: () => onNavigateView('board'),
      },
      {
        kind: 'action',
        id: 'nav-completed',
        label: 'Go to Completed',
        shortcut: '5',
        icon: 'completed',
        run: () => onNavigateView('completed'),
      },
      {
        kind: 'action',
        id: 'toggle-theme',
        label: darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        icon: 'theme',
        run: onToggleDarkMode,
      },
    ];

    const matchingTasks = tasks
      .filter((t) => {
        if (!q) return !t.completed;
        return (
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.priority.toLowerCase().includes(q) ||
          t.notes.toLowerCase().includes(q)
        );
      })
      .slice(0, 6)
      .map((task): CommandEntry => ({ kind: 'task', id: `task-${task.id}`, task }));

    const matchingActions = q
      ? viewActions.filter((a) => a.kind === 'action' && a.label.toLowerCase().includes(q))
      : viewActions;

    const list: CommandEntry[] = [];
    if (trimmed.length > 0) {
      list.push({ kind: 'create', id: 'create-inline', title: trimmed });
    }
    list.push(...matchingTasks, ...matchingActions);
    return list;
  }, [query, tasks, darkMode, onNavigateView, onToggleDarkMode]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const executeEntry = (entry: CommandEntry) => {
    if (entry.kind === 'create') {
      onCreateQuickTask(entry.title);
      onClose();
      return;
    }
    if (entry.kind === 'task') {
      onSelectTask(entry.task);
      onClose();
      return;
    }
    entry.run();
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (entries.length ? (prev + 1) % entries.length : 0));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        entries.length ? (prev - 1 + entries.length) % entries.length : 0
      );
      return;
    }
    if (e.key === 'Enter' && entries[activeIndex]) {
      e.preventDefault();
      executeEntry(entries[activeIndex]);
    }
  };

  const renderActionIcon = (icon: Extract<CommandEntry, { kind: 'action' }>['icon']) => {
    switch (icon) {
      case 'today':
        return <SunMedium className="h-4 w-4 text-[#10B981]" aria-hidden="true" />;
      case 'inbox':
        return <Inbox className="h-4 w-4 text-[#6366F1]" aria-hidden="true" />;
      case 'upcoming':
        return <CalendarClock className="h-4 w-4 text-[#0EA5E9]" aria-hidden="true" />;
      case 'board':
        return <Kanban className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-[#10B981]" aria-hidden="true" />;
      case 'theme':
        return darkMode ? (
          <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
        ) : (
          <Moon className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
        );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[15vh]"
    >
      <button
        type="button"
        aria-label="Close command palette"
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-[580px] overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.08)] dark:border-[#334155] dark:bg-[#1E293B]">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 border-b border-[#E5E7EB] px-4 py-3 dark:border-[#334155]">
          <Search className="h-4 w-4 shrink-0 text-[#10B981]" aria-hidden="true" />
          <label htmlFor="command-palette-input" className="sr-only">
            Search tasks, categories, priorities, or commands
          </label>
          <input
            id="command-palette-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tasks, tags, priorities, or type a new task..."
            className="w-full bg-transparent text-[14px] text-[#0b1c30] caret-[#10B981] placeholder:text-[#94A3B8] focus:outline-none dark:text-white dark:placeholder:text-slate-400"
          />
          <kbd className="rounded border border-[#E5E7EB] bg-[#F9FAFB] px-1.5 py-0.5 font-mono text-[11px] font-medium text-[#64748B] dark:border-[#475569] dark:bg-[#090D16] dark:text-slate-300">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[340px] overflow-y-auto p-2">
          {entries.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-[#64748B] dark:text-slate-400">
              No matching tasks or commands
            </div>
          ) : (
            <div role="listbox" aria-label="Command palette results" className="space-y-0.5">
              {entries.map((entry, idx) => {
                const isActive = idx === activeIndex;

                return (
                  <button
                    key={entry.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => executeEntry(entry)}
                    className={`flex w-full items-center justify-between gap-3 rounded-[8px] px-3 py-2 text-left text-[13px] transition-colors ${
                      isActive
                        ? 'bg-[#eff4ff] text-[#0F172A] dark:bg-[#090D16]/70 dark:text-white'
                        : 'text-[#3c4a42] hover:bg-[#F8FAFC] dark:text-slate-200 dark:hover:bg-[#090D16]/40'
                    }`}
                  >
                    {entry.kind === 'create' ? (
                      <span className="flex items-center gap-2.5 font-medium text-[#006c49] dark:text-[#4edea3]">
                        <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>Create task &ldquo;{entry.title}&rdquo; for Today</span>
                      </span>
                    ) : entry.kind === 'task' ? (
                      <>
                        <span className="flex min-w-0 flex-1 items-center gap-2.5">
                          <PriorityBadge priority={entry.task.priority} />
                          <span className="truncate font-medium">{entry.task.title}</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2">
                          <span className="text-[11px] text-[#64748B] tabular-nums dark:text-slate-400">
                            {formatDueDateLabel(entry.task.dueDate, todayStr)}
                          </span>
                          <CategoryPill category={entry.task.category} />
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-2.5 font-medium">
                          {renderActionIcon(entry.icon)}
                          <span>{entry.label}</span>
                        </span>
                        {entry.shortcut && (
                          <kbd className="rounded border border-[#E5E7EB] bg-[#F9FAFB] px-1.5 py-0.5 font-mono text-[11px] text-[#64748B] dark:border-[#475569] dark:bg-[#090D16] dark:text-slate-400">
                            {entry.shortcut}
                          </kbd>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Keyboard Guide Footer */}
        <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2 text-[11px] text-[#64748B] dark:border-[#334155] dark:bg-[#111827] dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="font-mono">⌘K</span>
        </div>
      </div>
    </div>
  );
}
