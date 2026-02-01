import api from './api';

export const taskService = {
  getTasks: async (params = {}) => {
    const { data } = await api.get('/tasks', { params });
    return data;
  },

  getTask: async (id) => {
    const { data } = await api.get(`/tasks/${id}`);
    return data;
  },

  createTask: async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    return data;
  },

  updateTask: async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    return data;
  },

  updateTaskStatus: async (id, status) => {
    const { data } = await api.patch(`/tasks/${id}/status`, { status });
    return data;
  },

  deleteTask: async (id) => {
    const { data } = await api.delete(`/tasks/${id}`);
    return data;
  },

  getStatistics: async () => {
    const { data } = await api.get('/tasks/stats/overview');
    return data;
  },

  getUpcomingTasks: async () => {
    const { data } = await api.get('/tasks/stats/upcoming');
    return data;
  }
};

export default taskService;
