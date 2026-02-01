import { useState } from 'react';
import { IoAdd, IoMenu } from 'react-icons/io5';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="flex relative">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile, slide-in drawer */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header with hamburger menu on mobile */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                {/* Hamburger menu - only on mobile */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Toggle menu"
                >
                  <IoMenu size={24} />
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tasks</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">{totalTasks} total</p>
                </div>
              </div>
              <Button onClick={() => setIsModalOpen(true)} className="flex-shrink-0">
                <IoAdd className="inline sm:mr-2" size={20} />
                <span className="hidden sm:inline">Add Task</span>
              </Button>
            </div>

            <TaskFilters filters={filters} onFilterChange={setFilters} />

            <ErrorBoundary>
              <TaskList tasks={tasks} isLoading={isLoading} />
            </ErrorBoundary>
          </div>
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
