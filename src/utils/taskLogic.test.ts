import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addDaysToDateString,
  addSubtaskToTask,
  createTask,
  filterTasks,
  formatDueDateLabel,
  getTasksForView,
  getViewCounts,
  isDueToday,
  isOverdue,
  moveTaskOrder,
  moveTaskStatus,
  sortTasks,
  toggleSubtaskInTask,
  toggleTaskCompletion,
  validateTaskTitle,
} from './taskLogic';

const TODAY = '2026-11-24';

test('validateTaskTitle rejects empty and over-long titles', () => {
  assert.equal(validateTaskTitle('').valid, false);
  assert.equal(validateTaskTitle('   ').valid, false);
  assert.equal(validateTaskTitle('a'.repeat(161)).valid, false);
  assert.equal(validateTaskTitle('Ship release checklist').valid, true);
});

test('createTask creates deterministic task and increments order', () => {
  const first = createTask({
    id: 't1',
    title: '  Audit API rate limits  ',
    priority: 'high',
    category: 'Work',
    dueDate: TODAY,
    nowIso: '2026-11-24T09:00:00.000Z',
  });
  assert.equal(first.title, 'Audit API rate limits');
  assert.equal(first.priority, 'high');
  assert.equal(first.inInbox, false);
  assert.equal(first.order, 1);

  const second = createTask({
    id: 't2',
    title: 'Inbox note',
    existingTasks: [first],
    nowIso: '2026-11-24T09:05:00.000Z',
  });
  assert.equal(second.inInbox, true);
  assert.equal(second.order, 2);
});

test('toggleTaskCompletion flips completed, status, and completedAt', () => {
  const task = createTask({ id: 't1', title: 'Write tests', dueDate: TODAY });
  const done = toggleTaskCompletion(task, '2026-11-24T10:00:00.000Z');
  assert.equal(done.completed, true);
  assert.equal(done.status, 'done');
  assert.equal(done.completedAt, '2026-11-24T10:00:00.000Z');

  const reopened = toggleTaskCompletion(done);
  assert.equal(reopened.completed, false);
  assert.equal(reopened.status, 'todo');
  assert.equal(reopened.completedAt, null);
});

test('moveTaskStatus syncs completed flag with done column', () => {
  const task = createTask({ id: 't1', title: 'Design board', dueDate: TODAY });
  const inReview = moveTaskStatus(task, 'in_review');
  assert.equal(inReview.status, 'in_review');
  assert.equal(inReview.completed, false);

  const done = moveTaskStatus(inReview, 'done', '2026-11-24T11:00:00.000Z');
  assert.equal(done.completed, true);
  assert.equal(done.completedAt, '2026-11-24T11:00:00.000Z');
});

test('date helpers and view bucketing categorize overdue, today, inbox, and completed', () => {
  const yesterday = addDaysToDateString(TODAY, -1);
  const tomorrow = addDaysToDateString(TODAY, 1);

  assert.equal(isOverdue(yesterday, TODAY), true);
  assert.equal(isDueToday(TODAY, TODAY), true);
  assert.equal(formatDueDateLabel(tomorrow, TODAY), 'Tomorrow');

  const tasks = [
    createTask({ id: '1', title: 'Overdue fix', dueDate: yesterday }),
    createTask({ id: '2', title: 'Today spec', dueDate: TODAY }),
    createTask({ id: '3', title: 'Inbox item', dueDate: null }),
    createTask({ id: '4', title: 'Tomorrow review', dueDate: tomorrow }),
    createTask({ id: '5', title: 'Finished item', dueDate: TODAY, status: 'done' }),
  ];

  const counts = getViewCounts(tasks, TODAY);
  assert.equal(counts.today, 2); // overdue + today
  assert.equal(counts.inbox, 1);
  assert.equal(counts.upcoming, 3); // overdue + today + tomorrow (active)
  assert.equal(counts.board, 5); // all tasks across board columns
  assert.equal(counts.completed, 1);
  assert.equal(getTasksForView(tasks, 'completed', TODAY)[0].id, '5');
});

test('filterTasks and sortTasks handle search, category, priority, and sorting', () => {
  const t1 = createTask({ id: '1', title: 'Zebra migration', priority: 'low', category: 'Work', dueDate: TODAY });
  const t2 = createTask({ id: '2', title: 'Alpha release', priority: 'high', category: 'Projects', dueDate: TODAY, existingTasks: [t1] });
  const t3 = createTask({ id: '3', title: 'Beta workout', priority: 'medium', category: 'Health', dueDate: null, existingTasks: [t1, t2] });

  const filtered = filterTasks([t1, t2, t3], {
    search: 'alpha',
    category: 'all',
    priority: 'all',
    sort: 'manual',
  });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, '2');

  const sortedByPriority = sortTasks([t1, t2, t3], 'priority');
  assert.deepEqual(
    sortedByPriority.map((t) => t.priority),
    ['high', 'medium', 'low']
  );

  const sortedByTitle = sortTasks([t1, t2, t3], 'title');
  assert.deepEqual(
    sortedByTitle.map((t) => t.id),
    ['2', '3', '1']
  );
});

test('subtask mutations and manual reorder work cleanly', () => {
  let task = createTask({ id: 't1', title: 'Parent task', dueDate: TODAY });
  task = addSubtaskToTask(task, 'Verify cache TTL', 's1');
  assert.equal(task.subtasks.length, 1);
  assert.equal(task.subtasks[0].completed, false);

  task = toggleSubtaskInTask(task, 's1');
  assert.equal(task.subtasks[0].completed, true);

  const t1 = createTask({ id: '1', title: 'First', dueDate: TODAY });
  const t2 = createTask({ id: '2', title: 'Second', dueDate: TODAY, existingTasks: [t1] });
  const reordered = moveTaskOrder([t1, t2], '2', 'up', ['1', '2']);
  const sorted = sortTasks(reordered, 'manual');
  assert.deepEqual(
    sorted.map((t) => t.id),
    ['2', '1']
  );
});
