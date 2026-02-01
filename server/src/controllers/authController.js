import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { User, matchPassword } from '../config/userStorageFactory.js';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password // Will be hashed by pre-save hook
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email (include password for verification)
  // Check storage type to determine if we need to explicitly select password
  const isMongoStorage = process.env.STORAGE_TYPE === 'mongodb';

  let user;
  if (isMongoStorage) {
    // For MongoDB/Mongoose, explicitly select password field (it's excluded by default)
    user = await User.findOne({ email }).select('+password');
  } else {
    // For file storage, password is already included
    user = await User.findOne({ email });
  }

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check if password matches
  const isPasswordMatch = await matchPassword(user, password);

  if (!isPasswordMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    data: {
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    }
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  // User is already available from protect middleware
  res.json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt
    }
  });
});
