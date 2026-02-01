import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import categoryService from '../services/categoryService';
import toast from 'react-hot-toast';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories
  });
};

export const useCategory = (id) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getCategory(id),
    enabled: !!id
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create category');
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update category');
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete category');
    }
  });
};
