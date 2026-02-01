import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import taskService from '../services/taskService';
import toast from 'react-hot-toast';

export const useTasks = (filters = {}) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.getTasks(filters)
  });
};

export const useTask = (id) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getTask(id),
    enabled: !!id
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['statistics']);
      toast.success('Task created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create task');
    }
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['task']);
      queryClient.invalidateQueries(['statistics']);
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update task');
    }
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => taskService.updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['statistics']);
      toast.success('Status updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update status');
    }
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['statistics']);
      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete task');
    }
  });
};

export const useStatistics = () => {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: taskService.getStatistics
  });
};

export const useUpcomingTasks = () => {
  return useQuery({
    queryKey: ['upcoming-tasks'],
    queryFn: taskService.getUpcomingTasks
  });
};
