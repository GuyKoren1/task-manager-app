import Task from '../models/Task.js';
import Category from '../models/Category.js';

// MongoDB storage implementation - matches file storage interface

export const tasksDB = {
  find: async (query = {}) => {
    const tasks = await Task.find(query).lean();
    return tasks;
  },

  findById: async (id) => {
    const task = await Task.findById(id).lean();
    return task;
  },

  create: async (data) => {
    const task = await Task.create(data);
    return task.toObject();
  },

  update: async (id, data) => {
    const task = await Task.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).lean();
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
    const categories = await Category.find().lean();
    return categories;
  },

  findById: async (id) => {
    const category = await Category.findById(id).lean();
    return category;
  },

  create: async (data) => {
    const category = await Category.create(data);
    return category.toObject();
  },

  update: async (id, data) => {
    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).lean();
    return category;
  },

  delete: async (id) => {
    const result = await Category.findByIdAndDelete(id);
    return result ? true : null;
  }
};

export default { tasks: tasksDB, categories: categoriesDB };
