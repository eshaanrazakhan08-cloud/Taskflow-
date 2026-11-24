import type { Category, Priority, TaskStatus, WorkspaceView } from '../types/task';

export const CATEGORY_STYLES: Record<
  Category,
  { bg: string; text: string; dot: string }
> = {
  Work: {
    bg: 'bg-[#6366F1]/10 dark:bg-[#6366F1]/20',
    text: 'text-[#4F46E5] dark:text-[#A5B4FC]',
    dot: 'bg-[#6366F1]',
  },
  Personal: {
    bg: 'bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20',
    text: 'text-[#7C3AED] dark:text-[#C4B5FD]',
    dot: 'bg-[#8B5CF6]',
  },
  College: {
    bg: 'bg-[#0EA5E9]/10 dark:bg-[#0EA5E9]/20',
    text: 'text-[#0284C7] dark:text-[#7DD3FC]',
    dot: 'bg-[#0EA5E9]',
  },
  Projects: {
    bg: 'bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20',
    text: 'text-[#B45309] dark:text-[#FCD34D]',
    dot: 'bg-[#F59E0B]',
  },
  Health: {
    bg: 'bg-[#14B8A6]/10 dark:bg-[#14B8A6]/20',
    text: 'text-[#0F766E] dark:text-[#5EEAD4]',
    dot: 'bg-[#14B8A6]',
  },
  Other: {
    bg: 'bg-[#64748B]/10 dark:bg-[#64748B]/20',
    text: 'text-[#475569] dark:text-[#CBD5E1]',
    dot: 'bg-[#64748B]',
  },
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; shortLabel: string; colorClass: string; pillClass: string }
> = {
  high: {
    label: 'High priority',
    shortLabel: 'High',
    colorClass: 'text-[#F43F5E]',
    pillClass: 'bg-[#F43F5E]/10 text-[#E11D48] dark:text-[#FDA4AF]',
  },
  medium: {
    label: 'Medium priority',
    shortLabel: 'Med',
    colorClass: 'text-[#F59E0B]',
    pillClass: 'bg-[#F59E0B]/10 text-[#B45309] dark:text-[#FCD34D]',
  },
  low: {
    label: 'Low priority',
    shortLabel: 'Low',
    colorClass: 'text-[#94A3B8]',
    pillClass: 'bg-[#94A3B8]/15 text-[#475569] dark:text-[#CBD5E1]',
  },
};

export const STATUS_META: Record<
  TaskStatus,
  { label: string; shortLabel: string }
> = {
  todo: { label: 'To Do', shortLabel: 'To Do' },
  in_progress: { label: 'In Progress', shortLabel: 'Active' },
  in_review: { label: 'In Review', shortLabel: 'Review' },
  done: { label: 'Done', shortLabel: 'Done' },
};

export const VIEW_META: Record<
  WorkspaceView,
  { title: string; subtitle: string }
> = {
  today: {
    title: 'Today',
    subtitle: 'Focused execution queue for overdue and today items',
  },
  inbox: {
    title: 'Inbox',
    subtitle: 'Unscheduled captures waiting to be triaged',
  },
  upcoming: {
    title: 'Upcoming',
    subtitle: 'Scheduled tasks organized across your week ahead',
  },
  board: {
    title: 'Board',
    subtitle: 'Workflow stages from backlog through verification',
  },
  completed: {
    title: 'Completed',
    subtitle: 'Resolved work log with one-click restore',
  },
};
