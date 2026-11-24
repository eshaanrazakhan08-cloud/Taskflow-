export type Priority = 'high' | 'medium' | 'low';

export type Category = 'Work' | 'Personal' | 'College' | 'Projects' | 'Health' | 'Other';

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';

export type WorkspaceView = 'today' | 'inbox' | 'upcoming' | 'board' | 'completed';

export type SortOption = 'manual' | 'priority' | 'dueDate' | 'title';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  colorClass: string;
}

export interface Task {
  id: string;
  title: string;
  notes: string;
  completed: boolean;
  status: TaskStatus;
  priority: Priority;
  category: Category;
  dueDate: string | null; // YYYY-MM-DD local ISO date or null for Inbox/unscheduled
  assigneeId: string | null;
  subtasks: Subtask[];
  inInbox: boolean;
  createdAt: string;
  completedAt: string | null;
  order: number;
}

export interface TaskFilterState {
  search: string;
  category: Category | 'all';
  priority: Priority | 'all';
  sort: SortOption;
}
