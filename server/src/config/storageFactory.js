import { tasksDB as fileTasksDB, categoriesDB as fileCategoriesDB } from '../utils/fileStorage.js';

// Storage factory - chooses between file storage and MongoDB based on config
let tasksDB;
let categoriesDB;

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'file'; // 'file' or 'mongodb'

if (STORAGE_TYPE === 'file') {
  console.log('📁 Using FILE-BASED storage (local JSON files)');
  tasksDB = fileTasksDB;
  categoriesDB = fileCategoriesDB;
} else if (STORAGE_TYPE === 'mongodb') {
  console.log('☁️  Using MONGODB storage (cloud database)');
  // Import MongoDB storage only when needed
  const { default: mongoTasksDB } = await import('../utils/mongoStorage.js');
  const { default: mongoCategoriesDB } = await import('../utils/mongoStorage.js');
  tasksDB = mongoTasksDB.tasks;
  categoriesDB = mongoCategoriesDB.categories;
}

export { tasksDB, categoriesDB, STORAGE_TYPE };
