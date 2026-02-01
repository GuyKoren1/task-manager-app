import { useState } from 'react';
import { IoAdd, IoFolder, IoTrash } from 'react-icons/io5';
import { useCategories, useDeleteCategory } from '../../hooks/useCategories';
import CategoryForm from '../categories/CategoryForm';
import Modal from '../common/Modal';
import Loading from '../common/Loading';
import Button from '../common/Button';

const Sidebar = ({ onCategorySelect, selectedCategory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const { data: categoriesData, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  const categories = categoriesData?.data || [];

  const handleDeleteClick = (e, category) => {
    e.stopPropagation();
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteCategory.mutate(categoryToDelete._id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setCategoryToDelete(null);
          if (selectedCategory === categoryToDelete._id) {
            onCategorySelect(null);
          }
        }
      });
    }
  };

  return (
    <>
      <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] overflow-y-auto shadow-lg lg:shadow-none">
        <div className="p-4 sm:p-6 lg:p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Add Category"
            >
              <IoAdd size={24} />
            </button>
          </div>

          {isLoading ? (
            <Loading size="sm" />
          ) : (
            <div className="space-y-1">
              <button
                onClick={() => onCategorySelect(null)}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                  !selectedCategory
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IoFolder size={20} />
                <span className="font-medium">All Tasks</span>
              </button>

              {categories.map((category) => (
                <div
                  key={category._id}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${
                    selectedCategory === category._id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <button
                    onClick={() => onCategorySelect(category._id)}
                    className="flex items-center space-x-2 flex-1 text-left"
                  >
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, category)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:bg-red-50 rounded transition-all"
                    title="Delete Category"
                  >
                    <IoTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Category"
        size="sm"
      >
        <CategoryForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        title="Delete Category"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the category <strong>"{categoryToDelete?.name}"</strong>?
          </p>
          <p className="text-sm text-gray-600">
            This will not delete tasks in this category, but they will no longer be associated with it.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteModalOpen(false);
                setCategoryToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={deleteCategory.isPending}
            >
              {deleteCategory.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
