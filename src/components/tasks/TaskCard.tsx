import { useState } from 'react';
import { Pencil, Trash2, Calendar, Tag } from 'lucide-react';
import type { Task } from '../../types/task';
import { toggleTaskComplete, deleteTask } from '../../services/tasks.service';
import { useAppContext } from '../../context/AppContext';
import { formatDueDate, isOverdue } from '../../utils/date';
import { ConfirmDialog } from '../ui/Modal';
import { TaskFormModal } from './TaskFormModal';

interface TaskCardProps {
  task: Task;
}

const priorityConfig = {
  high: { label: 'High', classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' },
  medium: { label: 'Medium', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' },
  low: { label: 'Low', classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', dot: 'bg-green-500' },
};

const categoryConfig: Record<string, string> = {
  personal: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  work: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  study: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  health: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  other: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
};

export function TaskCard({ task }: TaskCardProps) {
  const { user } = useAppContext();
  const [toggling, setToggling] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const priority = priorityConfig[task.priority] ?? priorityConfig.medium;
  const dueDateFormatted = formatDueDate(task.dueDate);
  const overdue = !task.completed && isOverdue(task.dueDate);

  async function handleToggle() {
    if (!user || toggling) return;
    setToggling(true);
    try {
      await toggleTaskComplete(user.uid, task.id, !task.completed);
    } catch (err) {
      console.error('Failed to toggle task:', err);
    } finally {
      setToggling(false);
    }
  }

  async function handleDelete() {
    if (!user) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteTask(user.uid, task.id);
      setShowDelete(false);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete task.');
      setDeleting(false);
    }
  }

  return (
    <>
      <div
        className={`task-card group bg-white dark:bg-slate-900 rounded-2xl border p-4 shadow-sm ${
          task.completed
            ? 'border-slate-200 dark:border-slate-700 opacity-75'
            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md'
        } animate-fade-in`}
        aria-label={`Task: ${task.title}${task.completed ? ' (completed)' : ''}`}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              task.completed
                ? 'bg-indigo-600 border-indigo-600'
                : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400'
            } disabled:cursor-wait`}
            aria-label={task.completed ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as complete`}
            aria-pressed={task.completed}
          >
            {task.completed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium leading-snug ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
              {task.title}
            </p>
            {task.description && (
              <p className={`mt-1 text-xs leading-relaxed ${task.completed ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>
                {task.description.length > 120 ? task.description.slice(0, 120) + '…' : task.description}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {/* Priority badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${priority.classes}`}
                aria-label={`Priority: ${priority.label}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} aria-hidden="true" />
                {priority.label}
              </span>

              {/* Category badge */}
              {task.category && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${categoryConfig[task.category] ?? categoryConfig.other}`}>
                  <Tag className="w-3 h-3" aria-hidden="true" />
                  {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                </span>
              )}

              {/* Due date */}
              {dueDateFormatted && (
                <span className={`inline-flex items-center gap-1 text-xs ${overdue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                  <Calendar className="w-3 h-3" aria-hidden="true" />
                  {overdue && <span aria-label="Overdue">⚠ </span>}
                  {dueDateFormatted}
                </span>
              )}
            </div>

            {/* Delete error */}
            {deleteError && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{deleteError}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              onClick={() => setShowEdit(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              aria-label={`Edit task: ${task.title}`}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label={`Delete task: ${task.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <TaskFormModal open={showEdit} onClose={() => setShowEdit(false)} editTask={task} />
      <ConfirmDialog
        open={showDelete}
        onConfirm={handleDelete}
        onCancel={() => { setShowDelete(false); setDeleteError(null); }}
        title="Delete Task"
        message={`Are you sure you want to permanently delete "${task.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </>
  );
}
