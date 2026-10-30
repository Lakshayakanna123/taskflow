import { useState, useEffect, useRef } from 'react';
import type { Task } from '../types/task';
import { subscribeToTasks } from '../services/tasks.service';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export function useTasks(uid: string | null): TasksState {
  const [state, setState] = useState<TasksState>({
    tasks: [],
    loading: true,
    error: null,
  });

  // Track current uid to avoid stale closures when uid changes
  const uidRef = useRef(uid);
  uidRef.current = uid;

  useEffect(() => {
    if (!uid) {
      setState({ tasks: [], loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    const unsubscribe = subscribeToTasks(
      uid,
      (tasks) => {
        // Only update if uid hasn't changed (prevents state updates after logout)
        if (uidRef.current === uid) {
          setState({ tasks, loading: false, error: null });
        }
      },
      (error) => {
        if (uidRef.current === uid) {
          console.error('Firestore error:', error);
          setState((prev) => ({
            ...prev,
            loading: false,
            error:
              error.message.includes('permission')
                ? 'Access denied. Please try logging in again.'
                : 'Failed to load tasks. Please check your connection.',
          }));
        }
      }
    );

    // Cleanup: unsubscribe the Firestore listener when uid changes or component unmounts
    return () => {
      unsubscribe();
    };
  }, [uid]);

  return state;
}
