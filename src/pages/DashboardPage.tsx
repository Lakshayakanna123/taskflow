import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { DashboardStats, CompletionProgress } from '../components/dashboard/DashboardStats';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { Button } from '../components/ui/Button';

export function DashboardPage() {
  const { user, tasks, tasksLoading, tasksError } = useAppContext();
  const [showModal, setShowModal] = useState(false);

  const recentTasks = tasks.slice(0, 5);
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Greeting */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Good {getGreeting()}, {user?.displayName?.split(' ')[0] ?? 'there'} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{today}</p>
          </div>
          <Button onClick={() => setShowModal(true)} id="dashboard-add-task-btn">
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">New Task</span>
          </Button>
        </div>

        {/* Stats */}
        <DashboardStats tasks={tasks} loading={tasksLoading} />

        {/* Progress */}
        {!tasksLoading && tasks.length > 0 && (
          <CompletionProgress tasks={tasks} />
        )}

        {/* Error state */}
        {tasksError && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" role="alert">
            <p className="text-sm text-red-700 dark:text-red-400">{tasksError}</p>
          </div>
        )}

        {/* Recent tasks */}
        {!tasksLoading && !tasksError && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Tasks</h2>
            </div>
            {recentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-indigo-400" aria-hidden="true" />
                </div>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">You have no tasks yet</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Create your first task to get started.
                </p>
                <Button onClick={() => setShowModal(true)} size="sm">
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  Add your first task
                </Button>
              </div>
            ) : (
              <div className="space-y-3" role="list" aria-label="Recent tasks">
                {recentTasks.map((task) => (
                  <div key={task.id} role="listitem">
                    <TaskCard task={task} />
                  </div>
                ))}
                {tasks.length > 5 && (
                  <p className="text-xs text-slate-400 dark:text-slate-600 text-center pt-2">
                    Showing 5 of {tasks.length} tasks —{' '}
                    <a href="/tasks" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                      View all
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {tasksLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse" />
            ))}
          </div>
        )}
      </div>

      <TaskFormModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}
