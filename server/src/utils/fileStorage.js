import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(TASKS_FILE)) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(CATEGORIES_FILE)) {
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify([], null, 2));
}

// Helper function to generate ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Read data from file
const readData = (filename) => {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Write data to file
const writeData = (filename, data) => {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
};

// Tasks operations
export const tasksDB = {
  find: (query = {}) => {
    let tasks = readData(TASKS_FILE);

    // Filter by query
    if (Object.keys(query).length > 0) {
      tasks = tasks.filter(task => {
        return Object.keys(query).every(key => {
          if (key === 'categories' && Array.isArray(query[key])) {
            return task.categories && task.categories.includes(query[key]);
          }
          // Handle user field comparison (convert to string for comparison)
          if (key === 'user') {
            return task[key] && task[key].toString() === query[key].toString();
          }
          return task[key] === query[key];
        });
      });
    }

    return tasks;
  },

  findById: (id) => {
    const tasks = readData(TASKS_FILE);
    return tasks.find(task => task._id === id);
  },

  create: (data) => {
    const tasks = readData(TASKS_FILE);
    const newTask = {
      _id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reminderSent: false
    };

    if (newTask.status === 'completed' && !newTask.completedAt) {
      newTask.completedAt = new Date().toISOString();
    }

    tasks.push(newTask);
    writeData(TASKS_FILE, tasks);
    return newTask;
  },

  update: (id, data) => {
    const tasks = readData(TASKS_FILE);
    const index = tasks.findIndex(task => task._id === id);

    if (index === -1) return null;

    const updatedTask = {
      ...tasks[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    if (updatedTask.status === 'completed' && !updatedTask.completedAt) {
      updatedTask.completedAt = new Date().toISOString();
    } else if (updatedTask.status !== 'completed') {
      updatedTask.completedAt = null;
    }

    tasks[index] = updatedTask;
    writeData(TASKS_FILE, tasks);
    return updatedTask;
  },

  delete: (id) => {
    const tasks = readData(TASKS_FILE);
    const filtered = tasks.filter(task => task._id !== id);

    if (filtered.length === tasks.length) return null;

    writeData(TASKS_FILE, filtered);
    return true;
  },

  count: (query = {}) => {
    return tasksDB.find(query).length;
  }
};

// Categories operations
export const categoriesDB = {
  find: (query = {}) => {
    let categories = readData(CATEGORIES_FILE);

    // Filter by query (especially for user)
    if (Object.keys(query).length > 0) {
      categories = categories.filter(category => {
        return Object.keys(query).every(key => {
          // Handle user field comparison (convert to string for comparison)
          if (key === 'user') {
            return category[key] && category[key].toString() === query[key].toString();
          }
          return category[key] === query[key];
        });
      });
    }

    return categories;
  },

  findById: (id) => {
    const categories = readData(CATEGORIES_FILE);
    return categories.find(cat => cat._id === id);
  },

  create: (data) => {
    const categories = readData(CATEGORIES_FILE);

    // Check for duplicate name within same user
    if (data.user && categories.some(cat => cat.name === data.name && cat.user === data.user)) {
      throw new Error('Category name already exists');
    }

    const newCategory = {
      _id: generateId(),
      ...data,
      createdAt: new Date().toISOString()
    };

    categories.push(newCategory);
    writeData(CATEGORIES_FILE, categories);
    return newCategory;
  },

  update: (id, data) => {
    const categories = readData(CATEGORIES_FILE);
    const index = categories.findIndex(cat => cat._id === id);

    if (index === -1) return null;

    const currentCategory = categories[index];

    // Check for duplicate name within same user (excluding current category)
    if (data.name && categories.some(cat =>
      cat.name === data.name &&
      cat._id !== id &&
      cat.user === currentCategory.user
    )) {
      throw new Error('Category name already exists');
    }

    const updatedCategory = {
      ...currentCategory,
      ...data
    };

    categories[index] = updatedCategory;
    writeData(CATEGORIES_FILE, categories);
    return updatedCategory;
  },

  delete: (id) => {
    const categories = readData(CATEGORIES_FILE);
    const filtered = categories.filter(cat => cat._id !== id);

    if (filtered.length === categories.length) return null;

    writeData(CATEGORIES_FILE, filtered);
    return true;
  }
};

console.log('📁 File-based storage initialized');
console.log(`   Tasks file: ${TASKS_FILE}`);
console.log(`   Categories file: ${CATEGORIES_FILE}`);
