import type {
  Category,
  Priority,
  SortOption,
  Task,
  TaskFilterState,
  TaskStatus,
  WorkspaceView,
} from '../types/task';

export const CATEGORIES: Category[] = ['Work', 'Personal', 'College', 'Projects', 'Health', 'Other'];
export const PRIORITIES: Priority[] = ['high', 'medium', 'low'];
export const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'in_review', 'done'];

const PRIORITY_WEIGHT: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysToDateString(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  return toLocalDateString(d);
}

export function isOverdue(dueDate: string | null, todayStr: string): boolean {
  if (!dueDate) return false;
  return dueDate < todayStr;
}

export function isDueToday(dueDate: string | null, todayStr: string): boolean {
  if (!dueDate) return false;
  return dueDate === todayStr;
}

export function isDueTomorrow(dueDate: string | null, todayStr: string): boolean {
  if (!dueDate) return false;
  return dueDate === addDaysToDateString(todayStr, 1);
}

export function isDueWithinDays(dueDate: string | null, todayStr: string, maxDays: number): boolean {
  if (!dueDate) return false;
  const endStr = addDaysToDateString(todayStr, maxDays);
  return dueDate > addDaysToDateString(todayStr, 1) && dueDate <= endStr;
}

export function formatDueDateLabel(dueDate: string | null, todayStr: string): string {
  if (!dueDate) return 'No date';
  if (dueDate === todayStr) return 'Today';
  if (dueDate === addDaysToDateString(todayStr, 1)) return 'Tomorrow';
  if (dueDate === addDaysToDateString(todayStr, -1)) return 'Yesterday';

  const [year, month, day] = dueDate.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function validateTaskTitle(title: string): { valid: boolean; error: string | null } {
  const trimmed = title.trim();
  if (!trimmed) {
    return { valid: false, error: 'Task title cannot be empty.' };
  }
  if (trimmed.length > 160) {
    return { valid: false, error: 'Task title must be 160 characters or fewer.' };
  }
  return { valid: true, error: null };
}

export function createTask(params: {
  title: string;
  priority?: Priority;
  category?: Category;
  dueDate?: string | null;
  status?: TaskStatus;
  inInbox?: boolean;
  notes?: string;
  assigneeId?: string | null;
  existingTasks?: Task[];
  id?: string;
  nowIso?: string;
}): Task {
  const trimmed = params.title.trim();
  if (!trimmed) {
    throw new Error('Task title is required');
  }

  const maxOrder = (params.existingTasks ?? []).reduce((max, t) => Math.max(max, t.order), 0);
  const status = params.status ?? 'todo';
  const completed = status === 'done';
  const nowIso = params.nowIso ?? new Date().toISOString();

  return {
    id: params.id ?? `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: trimmed,
    notes: params.notes?.trim() ?? '',
    completed,
    status,
    priority: params.priority ?? 'medium',
    category: params.category ?? 'Work',
    dueDate: params.dueDate ?? null,
    assigneeId: params.assigneeId ?? 'member_1',
    subtasks: [],
    inInbox: params.inInbox ?? (!params.dueDate && status === 'todo'),
    createdAt: nowIso,
    completedAt: completed ? nowIso : null,
    order: maxOrder + 1,
  };
}

export function toggleTaskCompletion(task: Task, nowIso: string = new Date().toISOString()): Task {
  const nextCompleted = !task.completed;
  return {
    ...task,
    completed: nextCompleted,
    status: nextCompleted ? 'done' : task.status === 'done' ? 'todo' : task.status,
    completedAt: nextCompleted ? nowIso : null,
  };
}

export function moveTaskStatus(
  task: Task,
  nextStatus: TaskStatus,
  nowIso: string = new Date().toISOString()
): Task {
  const completed = nextStatus === 'done';
  return {
    ...task,
    status: nextStatus,
    completed,
    completedAt: completed ? task.completedAt ?? nowIso : null,
  };
}

export function addSubtaskToTask(task: Task, title: string, subtaskId?: string): Task {
  const trimmed = title.trim();
  if (!trimmed) return task;
  const id = subtaskId ?? `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  return {
    ...task,
    subtasks: [...task.subtasks, { id, title: trimmed, completed: false }],
  };
}

export function toggleSubtaskInTask(task: Task, subtaskId: string): Task {
  return {
    ...task,
    subtasks: task.subtasks.map((sub) =>
      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    ),
  };
}

export function deleteSubtaskFromTask(task: Task, subtaskId: string): Task {
  return {
    ...task,
    subtasks: task.subtasks.filter((sub) => sub.id !== subtaskId),
  };
}

export function getTasksForView(tasks: Task[], view: WorkspaceView, todayStr: string): Task[] {
  switch (view) {
    case 'today':
      return tasks.filter(
        (t) =>
          !t.completed &&
          t.dueDate !== null &&
          (isDueToday(t.dueDate, todayStr) || isOverdue(t.dueDate, todayStr))
      );
    case 'inbox':
      return tasks.filter((t) => !t.completed && (t.inInbox || t.dueDate === null));
    case 'upcoming':
      return tasks.filter((t) => !t.completed && t.dueDate !== null);
    case 'board':
      return tasks;
    case 'completed':
      return tasks.filter((t) => t.completed);
    default:
      return tasks;
  }
}

export function filterTasks(tasks: Task[], filters: TaskFilterState): Task[] {
  const query = filters.search.trim().toLowerCase();

  return tasks.filter((task) => {
    if (filters.category !== 'all' && task.category !== filters.category) {
      return false;
    }
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }
    if (query) {
      const inTitle = task.title.toLowerCase().includes(query);
      const inNotes = task.notes.toLowerCase().includes(query);
      const inCategory = task.category.toLowerCase().includes(query);
      const inPriority = task.priority.toLowerCase().includes(query);
      if (!inTitle && !inNotes && !inCategory && !inPriority) {
        return false;
      }
    }
    return true;
  });
}

export function sortTasks(tasks: Task[], sort: SortOption): Task[] {
  const copy = [...tasks];
  switch (sort) {
    case 'priority':
      return copy.sort((a, b) => {
        const diff = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
        return diff !== 0 ? diff : a.order - b.order;
      });
    case 'dueDate':
      return copy.sort((a, b) => {
        if (a.dueDate === b.dueDate) return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
        if (a.dueDate === null) return 1;
        if (b.dueDate === null) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    case 'title':
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case 'manual':
    default:
      return copy.sort((a, b) => a.order - b.order);
  }
}

export function getViewCounts(
  tasks: Task[],
  todayStr: string
): Record<WorkspaceView, number> {
  return {
    today: getTasksForView(tasks, 'today', todayStr).length,
    inbox: getTasksForView(tasks, 'inbox', todayStr).length,
    upcoming: getTasksForView(tasks, 'upcoming', todayStr).length,
    board: tasks.length,
    completed: getTasksForView(tasks, 'completed', todayStr).length,
  };
}

export function moveTaskOrder(tasks: Task[], taskId: string, direction: 'up' | 'down', visibleIds: string[]): Task[] {
  const idx = visibleIds.indexOf(taskId);
  if (idx === -1) return tasks;
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= visibleIds.length) return tasks;

  const targetId = visibleIds[swapIdx];
  const taskA = tasks.find((t) => t.id === taskId);
  const taskB = tasks.find((t) => t.id === targetId);
  if (!taskA || !taskB) return tasks;

  return tasks.map((t) => {
    if (t.id === taskA.id) return { ...t, order: taskB.order };
    if (t.id === taskB.id) return { ...t, order: taskA.order };
    return t;
  });
}
