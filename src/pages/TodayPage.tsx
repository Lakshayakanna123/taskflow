import { useAppContext } from '../context/AppContext';
import { TaskList } from '../components/tasks/TaskList';

export function TodayPage() {
  const { tasks, tasksLoading, tasksError } = useAppContext();
  return (
    <TaskList
      tasks={tasks}
      loading={tasksLoading}
      error={tasksError}
      filter="today"
      title="Today's Tasks"
      emptyMessage="No tasks due today. Enjoy your day or add something new!"
    />
  );
}
