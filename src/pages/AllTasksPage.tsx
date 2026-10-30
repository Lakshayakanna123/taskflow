import { useAppContext } from '../context/AppContext';
import { TaskList } from '../components/tasks/TaskList';

export function AllTasksPage() {
  const { tasks, tasksLoading, tasksError } = useAppContext();
  return (
    <TaskList
      tasks={tasks}
      loading={tasksLoading}
      error={tasksError}
      filter="all"
      title="All Tasks"
      emptyMessage="You have no tasks yet. Create your first task to get started."
    />
  );
}
