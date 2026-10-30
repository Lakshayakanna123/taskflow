import { useAppContext } from '../context/AppContext';
import { TaskList } from '../components/tasks/TaskList';

export function CompletedPage() {
  const { tasks, tasksLoading, tasksError } = useAppContext();
  return (
    <TaskList
      tasks={tasks}
      loading={tasksLoading}
      error={tasksError}
      filter="completed"
      title="Completed Tasks"
      emptyMessage="No completed tasks yet. Check off some tasks to see them here."
    />
  );
}
