import { categoriesDB } from '../config/storageFactory.js';

// Get all categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoriesDB.find();
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
    const category = await categoriesDB.create(req.body);

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
    const category = await categoriesDB.update(req.params.id, req.body);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

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
    const result = await categoriesDB.delete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
