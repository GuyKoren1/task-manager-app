import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'file';

// Import User from storage factory
import { User } from '../src/config/userStorageFactory.js';

// Only import Mongoose models if using MongoDB
let Task, Category;
if (STORAGE_TYPE === 'mongodb') {
  const TaskModel = await import('../src/models/Task.js');
  const CategoryModel = await import('../src/models/Category.js');
  Task = TaskModel.default;
  Category = CategoryModel.default;
}

async function migrateMongoDBData() {
  console.log('\n🔄 Starting MongoDB data migration...\n');

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if any users exist
    const userCount = await User.countDocuments();

    if (userCount > 0) {
      console.log(`ℹ️  Found ${userCount} existing user(s). Migration not needed.`);
      console.log('   Existing data is already assigned to users.\n');
      await mongoose.connection.close();
      return;
    }

    // Create default admin user
    console.log('👤 Creating default admin user...');
    const defaultUser = await User.create({
      name: 'Admin',
      email: 'admin@taskmanager.com',
      password: 'admin123'
    });
    console.log(`✅ Default user created with email: ${defaultUser.email}\n`);

    // Update all tasks to assign to default user
    const tasksWithoutUser = await Task.find({ user: { $exists: false } });
    console.log(`📋 Found ${tasksWithoutUser.length} tasks without user assignment`);

    if (tasksWithoutUser.length > 0) {
      await Task.updateMany(
        { user: { $exists: false } },
        { $set: { user: defaultUser._id } }
      );
      console.log(`✅ Assigned ${tasksWithoutUser.length} tasks to default user\n`);
    }

    // Update all categories to assign to default user
    const categoriesWithoutUser = await Category.find({ user: { $exists: false } });
    console.log(`📁 Found ${categoriesWithoutUser.length} categories without user assignment`);

    if (categoriesWithoutUser.length > 0) {
      await Category.updateMany(
        { user: { $exists: false } },
        { $set: { user: defaultUser._id } }
      );
      console.log(`✅ Assigned ${categoriesWithoutUser.length} categories to default user\n`);
    }

    // Log default credentials
    console.log('🔐 Default Login Credentials:');
    console.log('   Email: admin@taskmanager.com');
    console.log('   Password: admin123');
    console.log('   ⚠️  IMPORTANT: Change this password after first login!\n');

    console.log('✅ MongoDB migration completed successfully!\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

async function migrateFileData() {
  console.log('\n🔄 Starting File-based data migration...\n');

  try {
    const DATA_DIR = path.join(__dirname, '../data');
    const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
    const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

    // Read existing data
    let tasks = [];
    let categories = [];

    if (fs.existsSync(TASKS_FILE)) {
      tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
    }

    if (fs.existsSync(CATEGORIES_FILE)) {
      categories = JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf8'));
    }

    console.log(`📋 Found ${tasks.length} tasks`);
    console.log(`📁 Found ${categories.length} categories\n`);

    // Check if any items already have user assignment
    const tasksWithUser = tasks.filter(t => t.user);
    const categoriesWithUser = categories.filter(c => c.user);

    if (tasksWithUser.length > 0 || categoriesWithUser.length > 0) {
      console.log('ℹ️  Data already has user assignments. Migration not needed.\n');
      return;
    }

    // For file storage, we'll use a dummy user ID
    // In production, users should register through the UI
    const dummyUserId = 'default-user-' + Date.now().toString(36);

    console.log(`👤 Using default user ID: ${dummyUserId}\n`);

    // Update tasks
    let updatedTasks = 0;
    tasks = tasks.map(task => {
      if (!task.user) {
        updatedTasks++;
        return { ...task, user: dummyUserId };
      }
      return task;
    });

    // Update categories
    let updatedCategories = 0;
    categories = categories.map(category => {
      if (!category.user) {
        updatedCategories++;
        return { ...category, user: dummyUserId };
      }
      return category;
    });

    // Write back to files
    if (updatedTasks > 0) {
      fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
      console.log(`✅ Updated ${updatedTasks} tasks with user assignment`);
    }

    if (updatedCategories > 0) {
      fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2));
      console.log(`✅ Updated ${updatedCategories} categories with user assignment`);
    }

    console.log('\n📝 Note for file-based storage:');
    console.log('   Users need to register through the application UI.');
    console.log('   Existing data has been assigned to a default user ID.');
    console.log('   To access this data, you\'ll need to manually update the user ID');
    console.log('   in the JSON files after registering your first user.\n');

    console.log('✅ File-based migration completed successfully!\n');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
}

async function migrate() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║   Task Manager - Multi-User Migration Script      ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log(`\n📦 Storage Type: ${STORAGE_TYPE.toUpperCase()}\n`);

  if (STORAGE_TYPE === 'mongodb') {
    await migrateMongoDBData();
  } else {
    await migrateFileData();
  }

  console.log('🎉 Migration process completed!');
  console.log('   You can now start the server and use the authentication system.\n');
  process.exit(0);
}

// Run migration
migrate();
