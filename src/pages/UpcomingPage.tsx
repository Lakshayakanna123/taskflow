import { useAppContext } from '../context/AppContext';
import { TaskList } from '../components/tasks/TaskList';

export function UpcomingPage() {
  const { tasks, tasksLoading, tasksError } = useAppContext();
  return (
    <TaskList
      tasks={tasks}
      loading={tasksLoading}
      error={tasksError}
      filter="upcoming"
      title="Upcoming Tasks"
      emptyMessage="No upcoming tasks. Add tasks with future due dates to see them here."
    />
  );
}
