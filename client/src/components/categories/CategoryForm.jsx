import { useState } from 'react';
import { useCreateCategory } from '../../hooks/useCategories';
import Input from '../common/Input';
import Button from '../common/Button';
import TextArea from '../common/TextArea';

const PRESET_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#6366F1', // indigo
  '#14B8A6', // teal
];

const CategoryForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    description: ''
  });

  const createCategory = useCreateCategory();

  const handleSubmit = (e) => {
    e.preventDefault();
    createCategory.mutate(formData, {
      onSuccess: () => {
        setFormData({ name: '', color: '#3B82F6', description: '' });
        onSuccess?.();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Category Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="e.g., Work, Personal, Shopping"
        required
        maxLength={50}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData({ ...formData, color })}
              className={`w-10 h-10 rounded-full transition-transform ${
                formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <TextArea
        label="Description (Optional)"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Brief description of this category"
        rows={3}
        maxLength={200}
      />

      <div className="flex justify-end space-x-3">
        <Button
          type="submit"
          disabled={createCategory.isPending || !formData.name}
        >
          {createCategory.isPending ? 'Creating...' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
