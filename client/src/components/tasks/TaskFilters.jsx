import { IoSearch } from 'react-icons/io5';
import Select from '../common/Select';

const TaskFilters = ({ filters, onFilterChange }) => {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Select
          value={filters.status || ''}
          onChange={(e) => handleChange('status', e.target.value)}
          options={[
            { value: '', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' }
          ]}
        />

        <Select
          value={filters.priority || ''}
          onChange={(e) => handleChange('priority', e.target.value)}
          options={[
            { value: '', label: 'All Priorities' },
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' }
          ]}
        />

        <Select
          value={filters.sortBy || 'createdAt'}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          options={[
            { value: 'createdAt', label: 'Sort by: Created Date' },
            { value: 'dueDate', label: 'Sort by: Due Date' },
            { value: 'priority', label: 'Sort by: Priority' },
            { value: 'title', label: 'Sort by: Title' }
          ]}
        />
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Order:</label>
          <button
            onClick={() => handleChange('order', filters.order === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            {filters.order === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>

        <button
          onClick={() => onFilterChange({
            search: '',
            status: '',
            priority: '',
            sortBy: 'createdAt',
            order: 'desc'
          })}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default TaskFilters;
