import { useState } from 'react';
import { format } from 'date-fns';
import { IoTrash, IoCreate, IoCalendar, IoAlarm } from 'react-icons/io5';
import { useDeleteTask, useUpdateTaskStatus } from '../../hooks/useTasks';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Modal from '../common/Modal';
import TaskForm from './TaskForm';

const TaskItem = ({ task }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteTask = useDeleteTask();
  const updateStatus = useUpdateTaskStatus();

  // Safety check
  if (!task) {
    return null;
  }

  const handleStatusChange = (newStatus) => {
    updateStatus.mutate({ id: task._id, status: newStatus });
  };

  const handleDelete = () => {
    deleteTask.mutate(task._id, {
      onSuccess: () => setIsDeleteModalOpen(false)
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'border-l-blue-500',
      medium: 'border-l-yellow-500',
      high: 'border-l-red-500'
    };
    return colors[priority] || colors.medium;
  };

  // Safe date formatting
  const formatDate = (date) => {
    try {
      return format(new Date(date), 'MMM dd');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const formatTime = (date) => {
    try {
      return format(new Date(date), 'h:mm a');
    } catch (e) {
      return 'Invalid time';
    }
  };

  return (
    <>
      <div className={`bg-white border-l-4 ${getPriorityColor(task.priority)} rounded shadow-sm p-2 hover:shadow transition-shadow`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Main row with title, badges, and metadata */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {task.title ? task.title : <span className="text-red-500 italic">No title - Error</span>}
              </h3>
              <Badge variant={task.priority || 'medium'}>{task.priority || 'medium'}</Badge>
              <Badge variant={task.status || 'pending'}>
                {(task.status || 'pending').replace('_', ' ')}
              </Badge>

              {/* Inline metadata */}
              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <IoCalendar size={12} />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}

              {task.reminderDate && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <IoAlarm size={12} />
                  <span>{formatTime(task.reminderDate)}</span>
                </div>
              )}

              {/* Categories inline */}
              {task.categories && task.categories.length > 0 && (
                <>
                  {task.categories.filter(cat => cat && cat._id).map((category) => (
                    <span
                      key={category._id}
                      className="px-1.5 py-0.5 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: category.color || '#6B7280' }}
                    >
                      {category.name || 'Unknown'}
                    </span>
                  ))}
                </>
              )}

              {/* Tags inline */}
              {task.tags && task.tags.length > 0 && (
                <>
                  {task.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="text-xs text-gray-400">
                      #{tag}
                    </span>
                  ))}
                  {task.tags.length > 2 && (
                    <span className="text-xs text-gray-400">+{task.tags.length - 2}</span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {task.status !== 'completed' && (
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-1.5 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            )}

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Edit"
            >
              <IoCreate size={16} />
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              <IoTrash size={16} />
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Task"
        size="md"
      >
        <TaskForm
          task={task}
          onSuccess={() => setIsEditModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleteTask.isPending}
            >
              {deleteTask.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TaskItem;
