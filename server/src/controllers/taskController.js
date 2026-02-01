import { tasksDB, categoriesDB } from '../config/storageFactory.js';

// Helper to populate categories
const populateCategories = async (task, userId) => {
  // Convert Mongoose document to plain object
  const plainTask = task.toObject ? task.toObject() : task;

  if (!plainTask.categories || plainTask.categories.length === 0) return plainTask;

  // Only get categories belonging to the user
  const allCategories = await categoriesDB.find({ user: userId });
  const populated = {
    ...plainTask,
    categories: plainTask.categories
      .map(catId => {
        const cat = allCategories.find(c => c._id.toString() === catId.toString());
        return cat;
      })
      .filter(Boolean)
      .map(c => {
        const plainCat = c.toObject ? c.toObject() : c;
        return { _id: plainCat._id, name: plainCat.name, color: plainCat.color, icon: plainCat.icon };
      })
  };
  return populated;
};

// Get all tasks with filtering, sorting, and pagination
export const getTasks = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      category,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20,
      dueDateFrom,
      dueDateTo
    } = req.query;

    // Filter by user
    let tasks = await tasksDB.find({ user: req.user.id });

    // Apply filters
    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }

    if (priority) {
      tasks = tasks.filter(t => t.priority === priority);
    }

    if (category) {
      tasks = tasks.filter(t => t.categories && t.categories.some(c => c.toString() === category));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      tasks = tasks.filter(t =>
        (t.title && t.title.toLowerCase().includes(searchLower)) ||
        (t.description && t.description.toLowerCase().includes(searchLower)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    if (dueDateFrom || dueDateTo) {
      tasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        const taskDate = new Date(t.dueDate);
        if (dueDateFrom && taskDate < new Date(dueDateFrom)) return false;
        if (dueDateTo && taskDate > new Date(dueDateTo)) return false;
        return true;
      });
    }

    // Sort
    tasks.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aVal = priorityOrder[a.priority] || 0;
        bVal = priorityOrder[b.priority] || 0;
      }

      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const total = tasks.length;
    const start = (pageNum - 1) * limitNum;
    const paginatedTasks = tasks.slice(start, start + limitNum);

    // Populate categories
    const populatedTasks = await Promise.all(paginatedTasks.map(t => populateCategories(t, req.user.id)));

    res.status(200).json({
      success: true,
      count: populatedTasks.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: populatedTasks
    });
  } catch (error) {
    next(error);
  }
};

// Get single task
export const getTask = async (req, res, next) => {
  try {
    const task = await tasksDB.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Verify ownership
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this task'
      });
    }

    const populated = await populateCategories(task, req.user.id);

    res.status(200).json({
      success: true,
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// Create task
export const createTask = async (req, res, next) => {
  try {
    // Add user to task data
    const taskData = {
      ...req.body,
      user: req.user.id
    };

    const task = await tasksDB.create(taskData);
    const populated = await populateCategories(task, req.user.id);

    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// Update task
export const updateTask = async (req, res, next) => {
  try {
    // First check if task exists and belongs to user
    const existingTask = await tasksDB.findById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Verify ownership
    if (existingTask.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this task'
      });
    }

    const task = await tasksDB.update(req.params.id, req.body);
    const populated = await populateCategories(task, req.user.id);

    res.status(200).json({
      success: true,
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// Update task status
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Valid status is required'
      });
    }

    // Check ownership before updating
    const existingTask = await tasksDB.findById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Verify ownership
    if (existingTask.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this task'
      });
    }

    const task = await tasksDB.update(req.params.id, { status });
    const populated = await populateCategories(task, req.user.id);

    res.status(200).json({
      success: true,
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// Delete task
export const deleteTask = async (req, res, next) => {
  try {
    // Check ownership before deleting
    const existingTask = await tasksDB.findById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Verify ownership
    if (existingTask.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this task'
      });
    }

    const result = await tasksDB.delete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Get statistics
export const getStatistics = async (req, res, next) => {
  try {
    // Filter by user
    const tasks = await tasksDB.find({ user: req.user.id });

    const byStatus = {
      pending: 0,
      in_progress: 0,
      completed: 0
    };

    const byPriority = {
      low: 0,
      medium: 0,
      high: 0
    };

    tasks.forEach(task => {
      if (task.status) byStatus[task.status]++;
      if (task.priority) byPriority[task.priority]++;
    });

    const overview = {
      total: tasks.length,
      byStatus,
      byPriority
    };

    res.status(200).json({
      success: true,
      data: overview
    });
  } catch (error) {
    next(error);
  }
};

// Get upcoming tasks (due in next 7 days)
export const getUpcomingTasks = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Filter by user
    let tasks = await tasksDB.find({ user: req.user.id });

    tasks = tasks.filter(task =>
      task.dueDate &&
      task.status !== 'completed' &&
      new Date(task.dueDate) >= today &&
      new Date(task.dueDate) <= nextWeek
    );

    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    tasks = tasks.slice(0, 10);

    const populatedTasks = await Promise.all(tasks.map(t => populateCategories(t, req.user.id)));

    res.status(200).json({
      success: true,
      count: populatedTasks.length,
      data: populatedTasks
    });
  } catch (error) {
    next(error);
  }
};
