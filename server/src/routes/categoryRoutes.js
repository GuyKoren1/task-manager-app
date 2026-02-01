import express from 'express';
import { body } from 'express-validator';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { validate } from '../middleware/validator.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 50 })
    .withMessage('Category name cannot exceed 50 characters'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Please provide a valid hex color'),
  body('icon')
    .optional()
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters')
];

router.route('/')
  .get(protect, getCategories)
  .post(protect, categoryValidation, validate, createCategory);

router.route('/:id')
  .get(protect, getCategory)
  .put(protect, categoryValidation, validate, updateCategory)
  .delete(protect, deleteCategory);

export default router;
