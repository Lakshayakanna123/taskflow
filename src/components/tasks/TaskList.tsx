import { useState, useMemo } from 'react';
import { Search, Plus, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { TaskFormModal } from './TaskFormModal';
import { Button } from '../ui/Button';
import type { Task, TaskFilter, TaskSort } from '../../types/task';
import { isOverdue, isDueToday, isUpcoming } from '../../utils/date';
import { PRIORITY_ORDER } from '../../types/task';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter?: TaskFilter;
  title?: string;
  emptyMessage?: string;
}

function applyFilter(tasks: Task[], filter: TaskFilter): Task[] {
  switch (filter) {
    case 'pending':
      return tasks.filter((t) => !t.completed);
    case 'completed':
      return tasks.filter((t) => t.completed);
    case 'today':
      return tasks.filter((t) => !t.completed && isDueToday(t.dueDate));
    case 'upcoming':
      return tasks.filter((t) => !t.completed && isUpcoming(t.dueDate));
    case 'overdue':
      return tasks.filter((t) => !t.completed && isOverdue(t.dueDate));
    default:
      return tasks;
  }
}

function applySort(tasks: Task[], sort: TaskSort): Task[] {
  const sorted = [...tasks];
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    case 'oldest':
      return sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    case 'dueDate':
      return sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      });
    case 'priority':
      return sorted.sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
    case 'alphabetical':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
}

export function TaskList({
  tasks,
  loading,
  error,
  filter = 'all',
  title,
  emptyMessage,
}: TaskListProps) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<TaskSort>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<TaskFilter>(filter);

  const filtered = useMemo(() => {
    let result = applyFilter(tasks, activeFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    return applySort(result, sort);
  }, [tasks, activeFilter, search, sort]);

  const filterOptions: { value: TaskFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'today', label: 'Today' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'completed', label: 'Completed' },
  ];

  const sortOptions: { value: TaskSort; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'alphabetical', label: 'Alphabetical' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        {title && (
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        )}
        <Button
          onClick={() => setShowModal(true)}
          size="md"
          className="ml-auto"
          id="add-task-btn"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Task
        </Button>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            aria-label="Search tasks"
          />
        </div>
        <button
          onClick={() => setShowFilters((f) => !f)}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          aria-expanded={showFilters}
          aria-label="Toggle filter and sort options"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filter & Sort</span>
        </button>
      </div>

      {/* Filter/sort drawer */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-4 animate-fade-in">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Filter</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter tasks">
              {filterOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setActiveFilter(value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeFilter === value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  aria-pressed={activeFilter === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" aria-hidden="true" /> Sort
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Sort tasks">
              {sortOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSort(value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    sort === value
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  aria-pressed={sort === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" aria-label="Loading tasks" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading tasks…</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" role="alert">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-900 dark:text-white font-semibold mb-1">
                {search ? 'No matching tasks' : 'No tasks yet'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {emptyMessage ?? (search
                  ? 'Try a different search term.'
                  : 'Create your first task to get started.')}
              </p>
              {!search && (
                <Button onClick={() => setShowModal(true)} className="mt-4" size="sm">
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  Add Task
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3" role="list" aria-label="Task list">
              {filtered.map((task) => (
                <div key={task.id} role="listitem">
                  <TaskCard task={task} />
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-400 dark:text-slate-600 text-right">
            {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
          </p>
        </>
      )}

      <TaskFormModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
