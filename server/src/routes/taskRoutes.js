import express from 'express';
import { body } from 'express-validator';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getStatistics,
  getUpcomingTasks
} from '../controllers/taskController.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Validation rules
const taskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date format'),
  body('reminderDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date format'),
  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

// Statistics routes
router.get('/stats/overview', getStatistics);
router.get('/stats/upcoming', getUpcomingTasks);

// Main task routes
router.route('/')
  .get(getTasks)
  .post(taskValidation, validate, createTask);

router.route('/:id')
  .get(getTask)
  .put(taskValidation, validate, updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);

export default router;
