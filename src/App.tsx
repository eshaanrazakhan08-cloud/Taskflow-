import { useCallback, useEffect, useMemo, useState } from 'react';
import { BoardView } from './components/BoardView';
import { CommandPalette } from './components/CommandPalette';
import { ListView } from './components/ListView';
import { QuickAddBar } from './components/QuickAddBar';
import { Sidebar } from './components/Sidebar';
import { TaskDetailPane } from './components/TaskDetailPane';
import { TopBar } from './components/TopBar';
import { createSeedTasks, TEAM_MEMBERS } from './data/seedTasks';
import type {
  Category,
  Priority,
  Task,
  TaskFilterState,
  TaskStatus,
  WorkspaceView,
} from './types/task';
import {
  addSubtaskToTask,
  CATEGORIES,
  createTask,
  deleteSubtaskFromTask,
  filterTasks,
  getTasksForView,
  getViewCounts,
  moveTaskOrder,
  moveTaskStatus,
  sortTasks,
  toggleSubtaskInTask,
  toggleTaskCompletion,
  toLocalDateString,
} from './utils/taskLogic';
import { VIEW_META } from './utils/taskTokens';

const STORAGE_TASKS_KEY = 'taskflow_precision_tasks_v1';
const STORAGE_THEME_KEY = 'taskflow_precision_theme_v1';

const DEFAULT_FILTERS: TaskFilterState = {
  search: '',
  category: 'all',
  priority: 'all',
  sort: 'manual',
};

function loadInitialTasks(): Task[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_TASKS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      if (Array.isArray(parsed) && parsed.length === 0) {
        return [];
      }
    }
  } catch {
    // Fall back to deterministic seed tasks
  }
  return createSeedTasks();
}

function loadInitialDarkMode(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_THEME_KEY) === 'dark';
  } catch {
    return false;
  }
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(loadInitialTasks);
  const [darkMode, setDarkMode] = useState<boolean>(loadInitialDarkMode);
  const [activeView, setActiveView] = useState<WorkspaceView>('today');
  const [filters, setFilters] = useState<TaskFilterState>(DEFAULT_FILTERS);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const todayStr = useMemo(() => toLocalDateString(new Date()), []);

  // Sync dark mode class on <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem(STORAGE_THEME_KEY, darkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  }, [darkMode]);

  // Persist tasks to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(tasks));
    } catch {
      // Ignore storage errors
    }
  }, [tasks]);

  // Global keyboard shortcuts (Cmd/Ctrl+K, N for quick add, Escape)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        return;
      }

      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable;

      if (e.key === 'Escape') {
        if (commandPaletteOpen) {
          setCommandPaletteOpen(false);
        } else if (selectedTaskId) {
          setSelectedTaskId(null);
        } else if (quickAddOpen) {
          setQuickAddOpen(false);
        }
        return;
      }

      if (!isTyping && !commandPaletteOpen && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setQuickAddOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [commandPaletteOpen, selectedTaskId, quickAddOpen]);

  const viewCounts = useMemo(() => getViewCounts(tasks, todayStr), [tasks, todayStr]);

  const categoryCounts = useMemo(() => {
    const active = tasks.filter((t) => !t.completed);
    const counts = {} as Record<Category, number>;
    for (const cat of CATEGORIES) {
      counts[cat] = active.filter((t) => t.category === cat).length;
    }
    return counts;
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const viewTasks = getTasksForView(tasks, activeView, todayStr);
    const filtered = filterTasks(viewTasks, filters);
    return sortTasks(filtered, filters.sort);
  }, [tasks, activeView, todayStr, filters]);

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  const handleCreateTask = useCallback(
    (input: {
      title: string;
      priority: Priority;
      category: Category;
      dueDate: string | null;
      status: TaskStatus;
      inInbox: boolean;
    }) => {
      setTasks((prev) => {
        const created = createTask({
          ...input,
          existingTasks: prev,
        });
        return [created, ...prev];
      });
    },
    []
  );

  const handleCreateColumnTask = useCallback(
    (input: {
      title: string;
      status: TaskStatus;
      category: Category;
      priority: Priority;
      dueDate: string | null;
    }) => {
      setTasks((prev) => {
        const created = createTask({
          title: input.title,
          status: input.status,
          category: input.category,
          priority: input.priority,
          dueDate: input.dueDate,
          inInbox: false,
          existingTasks: prev,
        });
        return [created, ...prev];
      });
    },
    []
  );

  const handleToggleComplete = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? toggleTaskCompletion(t) : t))
    );
  }, []);

  const handleUpdateTask = useCallback((taskId: string, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t)));
  }, []);

  const handleMoveStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? moveTaskStatus(t, status) : t))
    );
  }, []);

  const handleAddSubtask = useCallback((taskId: string, title: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? addSubtaskToTask(t, title) : t))
    );
  }, []);

  const handleToggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? toggleSubtaskInTask(t, subtaskId) : t))
    );
  }, []);

  const handleDeleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? deleteSubtaskFromTask(t, subtaskId) : t))
    );
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedTaskId((prev) => (prev === taskId ? null : prev));
  }, []);

  const handleMoveOrder = useCallback(
    (taskId: string, direction: 'up' | 'down', visibleIds: string[]) => {
      setTasks((prev) => moveTaskOrder(prev, taskId, direction, visibleIds));
    },
    []
  );

  const handleClearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
    setSelectedTaskId((prev) => {
      if (!prev) return null;
      const target = tasks.find((t) => t.id === prev);
      return target?.completed ? null : prev;
    });
  }, [tasks]);

  const handleCommandSelectTask = useCallback(
    (task: Task) => {
      if (task.completed) {
        setActiveView('completed');
      } else if (task.inInbox || !task.dueDate) {
        setActiveView('inbox');
      } else if (task.dueDate <= todayStr) {
        setActiveView('today');
      } else {
        setActiveView('upcoming');
      }
      setSelectedTaskId(task.id);
    },
    [todayStr]
  );

  const handleCommandQuickCreate = useCallback(
    (title: string) => {
      handleCreateTask({
        title,
        priority: 'medium',
        category: filters.category === 'all' ? 'Work' : filters.category,
        dueDate: activeView === 'inbox' ? null : todayStr,
        status: 'todo',
        inInbox: activeView === 'inbox',
      });
    },
    [activeView, filters.category, handleCreateTask, todayStr]
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8f9ff] text-[#0b1c30] dark:bg-[#090D16] dark:text-[#eaf1ff]">
      <Sidebar
        activeView={activeView}
        selectedCategory={filters.category}
        viewCounts={viewCounts}
        categoryCounts={categoryCounts}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        darkMode={darkMode}
        onSelectView={(view) => setActiveView(view)}
        onSelectCategory={(category) =>
          setFilters((prev) => ({ ...prev, category }))
        }
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          activeView={activeView}
          selectedCategory={filters.category}
          visibleCount={visibleTasks.length}
          darkMode={darkMode}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onClearCategory={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
          onOpenQuickAdd={() => setQuickAddOpen(true)}
        />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-6">
            <div className="mx-auto max-w-[1280px] space-y-5">
              {/* Contextual View Subtitle */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[13px] text-[#565e74] dark:text-slate-400">
                  {VIEW_META[activeView].subtitle}
                </p>
              </div>

              {/* Inline Quick Add Bar (available on all active views) */}
              {activeView !== 'completed' && (
                <QuickAddBar
                  activeView={activeView}
                  todayStr={todayStr}
                  defaultCategory={filters.category}
                  isOpen={quickAddOpen}
                  onOpen={() => setQuickAddOpen(true)}
                  onClose={() => setQuickAddOpen(false)}
                  onCreateTask={handleCreateTask}
                />
              )}

              {/* Primary Screen Content */}
              {activeView === 'board' ? (
                <BoardView
                  tasks={visibleTasks}
                  todayStr={todayStr}
                  selectedTaskId={selectedTaskId}
                  selectedCategory={filters.category}
                  members={TEAM_MEMBERS}
                  onToggleComplete={handleToggleComplete}
                  onSelectTask={(id) =>
                    setSelectedTaskId((prev) => (prev === id ? null : id))
                  }
                  onMoveStatus={handleMoveStatus}
                  onCreateColumnTask={handleCreateColumnTask}
                />
              ) : (
                <ListView
                  activeView={activeView}
                  tasks={visibleTasks}
                  todayStr={todayStr}
                  filters={filters}
                  selectedTaskId={selectedTaskId}
                  members={TEAM_MEMBERS}
                  onChangeFilters={(next) =>
                    setFilters((prev) => ({ ...prev, ...next }))
                  }
                  onResetFilters={() => setFilters(DEFAULT_FILTERS)}
                  onToggleComplete={handleToggleComplete}
                  onSelectTask={(id) =>
                    setSelectedTaskId((prev) => (prev === id ? null : id))
                  }
                  onMoveOrder={handleMoveOrder}
                  onClearCompleted={handleClearCompleted}
                  onOpenQuickAdd={() => setQuickAddOpen(true)}
                />
              )}
            </div>
          </main>

          {selectedTask && (
            <TaskDetailPane
              task={selectedTask}
              todayStr={todayStr}
              members={TEAM_MEMBERS}
              onClose={() => setSelectedTaskId(null)}
              onToggleComplete={handleToggleComplete}
              onUpdateTask={handleUpdateTask}
              onMoveStatus={handleMoveStatus}
              onAddSubtask={handleAddSubtask}
              onToggleSubtask={handleToggleSubtask}
              onDeleteSubtask={handleDeleteSubtask}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </div>
      </div>

      <CommandPalette
        isOpen={commandPaletteOpen}
        tasks={tasks}
        todayStr={todayStr}
        darkMode={darkMode}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectTask={handleCommandSelectTask}
        onNavigateView={(view) => setActiveView(view)}
        onCreateQuickTask={handleCommandQuickCreate}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      />
    </div>
  );
}
