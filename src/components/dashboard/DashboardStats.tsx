import { useMemo } from 'react';
import { CheckCircle2, Clock, AlertTriangle, Calendar, ListTodo } from 'lucide-react';
import type { Task } from '../../types/task';
import { isOverdue, isDueToday } from '../../utils/date';

interface DashboardStatsProps {
  tasks: Task[];
  loading: boolean;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

function StatCard({ label, value, icon, color, bg }: StatCardProps) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
          <span className={color}>{icon}</span>
        </div>
        <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
    </div>
  );
}

export function DashboardStats({ tasks, loading }: DashboardStatsProps) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = tasks.filter((t) => !t.completed).length;
    const overdue = tasks.filter((t) => !t.completed && isOverdue(t.dueDate)).length;
    const dueToday = tasks.filter((t) => !t.completed && isDueToday(t.dueDate)).length;
    return { total, completed, pending, overdue, dueToday };
  }, [tasks]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl mb-3" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-12 mb-2" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  const cards: StatCardProps[] = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: <ListTodo className="w-5 h-5" aria-hidden="true" />,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: <CheckCircle2 className="w-5 h-5" aria-hidden="true" />,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: <Clock className="w-5 h-5" aria-hidden="true" />,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: <AlertTriangle className="w-5 h-5" aria-hidden="true" />,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/30',
    },
    {
      label: 'Due Today',
      value: stats.dueToday,
      icon: <Calendar className="w-5 h-5" aria-hidden="true" />,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      role="region"
      aria-label="Task statistics"
    >
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}

export function CompletionProgress({ tasks }: { tasks: Task[] }) {
  const { total, completed } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    return { total, completed };
  }, [tasks]);

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Overall Progress</h3>
        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{percent}%</span>
      </div>
      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${percent}% of tasks completed`}
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        {completed} of {total} tasks completed
      </p>
    </div>
  );
}
