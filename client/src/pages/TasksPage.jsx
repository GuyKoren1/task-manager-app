import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useTasks } from '../hooks/useTasks';
import Sidebar from '../components/layout/Sidebar';
import TaskList from '../components/tasks/TaskList';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import ErrorBoundary from '../components/common/ErrorBoundary';

const TasksPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    sortBy: 'createdAt',
    order: 'desc'
  });

  const queryParams = {
    ...filters,
    category: selectedCategory
  };

  const { data: tasksData, isLoading } = useTasks(queryParams);

  const tasks = tasksData?.data || [];
  const totalTasks = tasksData?.total || 0;

  return (
    <div className="flex">
      <Sidebar
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
              <p className="text-gray-600 mt-1">{totalTasks} total tasks</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <IoAdd className="inline mr-2" size={20} />
              Add Task
            </Button>
          </div>

          <TaskFilters filters={filters} onFilterChange={setFilters} />

          <ErrorBoundary>
            <TaskList tasks={tasks} isLoading={isLoading} />
          </ErrorBoundary>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
        size="md"
      >
        <TaskForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default TasksPage;
