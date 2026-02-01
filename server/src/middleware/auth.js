import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { User } from '../config/userStorageFactory.js';

// Protect routes - verify JWT token
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      let user = await User.findById(decoded.id);

      // For Mongoose models, select(-password) is used, for file storage, manually exclude
      if (user && user.select) {
        user = await User.findById(decoded.id).select('-password');
      } else if (user && user.password) {
        // Remove password from plain object
        const { password, ...userWithoutPassword } = user;
        user = userWithoutPassword;
      }

      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }

      // Ensure user has both id and _id for compatibility
      if (user._id && !user.id) {
        user.id = user._id;
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});
