import Task from '../models/Task.js';
import Category from '../models/Category.js';

// MongoDB storage implementation - matches file storage interface

export const tasksDB = {
  find: async (query = {}) => {
    return await Task.find(query);
  },

  findById: async (id) => {
    return await Task.findById(id);
  },

  create: async (data) => {
    const task = await Task.create(data);
    return task;
  },

  update: async (id, data) => {
    const task = await Task.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
    return task;
  },

  delete: async (id) => {
    const result = await Task.findByIdAndDelete(id);
    return result ? true : null;
  },

  count: async (query = {}) => {
    return await Task.countDocuments(query);
  }
};

export const categoriesDB = {
  find: async () => {
    return await Category.find();
  },

  findById: async (id) => {
    return await Category.findById(id);
  },

  create: async (data) => {
    const category = await Category.create(data);
    return category;
  },

  update: async (id, data) => {
    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
    return category;
  },

  delete: async (id) => {
    const result = await Category.findByIdAndDelete(id);
    return result ? true : null;
  }
};

export default { tasks: tasksDB, categories: categoriesDB };
