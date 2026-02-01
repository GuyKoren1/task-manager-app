import { categoriesDB } from '../config/storageFactory.js';

// Get all categories
export const getCategories = async (req, res, next) => {
  try {
    // Filter by user
    const categories = await categoriesDB.find({ user: req.user.id });
    categories.sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// Get single category
export const getCategory = async (req, res, next) => {
  try {
    const category = await categoriesDB.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Verify ownership
    if (category.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this category'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// Create category
export const createCategory = async (req, res, next) => {
  try {
    // Add user to category data
    const categoryData = {
      ...req.body,
      user: req.user.id
    };

    const category = await categoriesDB.create(categoryData);

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error.message === 'Category name already exists') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
};

// Update category
export const updateCategory = async (req, res, next) => {
  try {
    // Check ownership before updating
    const existingCategory = await categoriesDB.findById(req.params.id);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Verify ownership
    if (existingCategory.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this category'
      });
    }

    const category = await categoriesDB.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error.message === 'Category name already exists') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
};

// Delete category
export const deleteCategory = async (req, res, next) => {
  try {
    // Check ownership before deleting
    const existingCategory = await categoriesDB.findById(req.params.id);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Verify ownership
    if (existingCategory.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this category'
      });
    }

    const result = await categoriesDB.delete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
