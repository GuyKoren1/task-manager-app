import dotenv from 'dotenv';
dotenv.config();

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'file';

let User, matchPassword;

if (STORAGE_TYPE === 'mongodb') {
  // Use Mongoose User model
  const UserModel = await import('../models/User.js');
  User = UserModel.default;

  // For Mongoose, matchPassword is a method on the user instance
  matchPassword = async (user, password) => {
    return await user.matchPassword(password);
  };

  console.log('✅ Using MongoDB storage for users');
} else {
  // Use file-based User storage
  const FileUserStorage = await import('../utils/fileUserStorage.js');
  User = FileUserStorage.FileUser;
  matchPassword = FileUserStorage.matchPassword;

  console.log('✅ Using file-based storage for users');
}

export { User, matchPassword };
