import { useState, useEffect } from 'react';
import { useCreateTask, useUpdateTask } from '../../hooks/useTasks';
import { useCategories } from '../../hooks/useCategories';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Select from '../common/Select';
import Button from '../common/Button';
import DatePicker from '../common/DatePicker';

const TaskForm = ({ task, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: null,
    reminderDate: null,
    categories: [],
    tags: ''
  });

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const { data: categoriesData } = useCategories();

  const categories = categoriesData?.data || [];

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        reminderDate: task.reminderDate ? new Date(task.reminderDate) : null,
        categories: task.categories?.map(c => c._id) || [],
        tags: task.tags?.join(', ') || ''
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    };

    // Debug logging
    console.log('=== TASK FORM SUBMISSION ===');
    console.log('Form Data:', formData);
    console.log('Submit Data:', submitData);
    console.log('Title:', submitData.title);
    console.log('Title length:', submitData.title?.length);
    console.log('===========================');

    if (task) {
      updateTask.mutate(
        { id: task._id, data: submitData },
        { onSuccess }
      );
    } else {
      createTask.mutate(submitData, { onSuccess });
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Task Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Enter task title"
        required
        maxLength={200}
      />

      <TextArea
        label="Description (Optional)"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Add a description..."
        rows={4}
        maxLength={2000}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' }
          ]}
        />

        <Select
          label="Priority"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' }
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DatePicker
          label="Due Date (Optional)"
          selected={formData.dueDate}
          onChange={(date) => setFormData({ ...formData, dueDate: date })}
          showTimeSelect
          minDate={new Date()}
          placeholderText="No due date"
          isClearable
        />

        <DatePicker
          label="Reminder Date (Optional)"
          selected={formData.reminderDate}
          onChange={(date) => setFormData({ ...formData, reminderDate: date })}
          showTimeSelect
          minDate={new Date()}
          maxDate={formData.dueDate}
          placeholderText="No reminder"
          disabled={!formData.dueDate}
          isClearable
        />
      </div>

      {categories.length > 0 ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                onClick={() => handleCategoryToggle(category._id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  formData.categories.includes(category._id)
                    ? 'ring-2 ring-offset-1'
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: category.color,
                  color: 'white',
                  ringColor: category.color
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
          {formData.categories.length === 0 && (
            <p className="text-xs text-gray-500 mt-1">No categories selected</p>
          )}
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories
          </label>
          <p className="text-sm text-gray-500">
            No categories yet. Create one from the sidebar to organize your tasks.
          </p>
        </div>
      )}

      <Input
        label="Tags (comma separated)"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        placeholder="e.g., urgent, meeting, review"
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="submit"
          disabled={createTask.isPending || updateTask.isPending || !formData.title}
        >
          {createTask.isPending || updateTask.isPending
            ? 'Saving...'
            : task
            ? 'Update Task'
            : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
