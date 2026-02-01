import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure users file exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

// Helper function to generate ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Read users from file
const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Write users to file
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// File-based User storage (mimics Mongoose API)
export const FileUser = {
  // Find one user
  findOne: async (query) => {
    const users = readUsers();
    const user = users.find(u => {
      if (query.email) return u.email === query.email;
      if (query._id) return u._id === query._id;
      return false;
    });
    return user || null;
  },

  // Find by ID
  findById: async (id) => {
    const users = readUsers();
    return users.find(u => u._id === id) || null;
  },

  // Create user
  create: async (userData) => {
    const users = readUsers();

    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = {
      _id: generateId(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    // Return user without password (unless specifically selected)
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Count documents
  countDocuments: async () => {
    const users = readUsers();
    return users.length;
  },

  // Update many (for migration)
  updateMany: async (filter, update) => {
    const users = readUsers();
    let updated = 0;

    users.forEach((user, index) => {
      let matches = true;

      // Check filter conditions
      if (filter.user && filter.user.$exists === false) {
        matches = !user.user;
      }

      if (matches && update.$set) {
        users[index] = { ...user, ...update.$set };
        updated++;
      }
    });

    if (updated > 0) {
      writeUsers(users);
    }

    return { modifiedCount: updated };
  },

  // Find (for migration)
  find: async (query = {}) => {
    const users = readUsers();

    if (Object.keys(query).length === 0) {
      return users;
    }

    return users.filter(user => {
      // Handle $exists queries
      if (query.user && query.user.$exists !== undefined) {
        const hasUser = user.user !== undefined;
        return query.user.$exists ? hasUser : !hasUser;
      }

      return Object.keys(query).every(key => user[key] === query[key]);
    });
  }
};

// Add method to user object for password comparison
export const matchPassword = async (user, enteredPassword) => {
  return await bcrypt.compare(enteredPassword, user.password);
};

console.log('📁 File-based user storage initialized');
console.log(`   Users file: ${USERS_FILE}`);
