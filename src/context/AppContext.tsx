import { createContext, useContext, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../hooks/useTheme';
import type { Task } from '../types/task';

interface AppContextValue {
  user: User | null;
  authLoading: boolean;
  tasks: Task[];
  tasksLoading: boolean;
  tasksError: string | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks(user?.uid ?? null);
  const [theme, toggleTheme] = useTheme();

  return (
    <AppContext.Provider value={{ user, authLoading, tasks, tasksLoading, tasksError, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
