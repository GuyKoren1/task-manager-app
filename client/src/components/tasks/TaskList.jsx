import TaskItem from './TaskItem';
import Loading from '../common/Loading';

const TaskList = ({ tasks, isLoading }) => {
  if (isLoading) {
    return <Loading />;
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tasks found</p>
        <p className="text-gray-400 text-sm mt-2">Create your first task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
