import api from './api';

export const categoryService = {
  getCategories: async () => {
    const { data } = await api.get('/categories');
    return data;
  },

  getCategory: async (id) => {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  },

  createCategory: async (categoryData) => {
    const { data } = await api.post('/categories', categoryData);
    return data;
  },

  updateCategory: async (id, categoryData) => {
    const { data } = await api.put(`/categories/${id}`, categoryData);
    return data;
  },

  deleteCategory: async (id) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  }
};

export default categoryService;
