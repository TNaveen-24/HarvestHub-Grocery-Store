import { Router } from "express";
import { validationResult } from "express-validator";
import { authorize, protect } from "../middleware/auth.js";
import Category from "../models/Category.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateCategory } from "../utils/validation.js";

const router = Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // Get categories with their subcategories and product counts
    const categories = await Category.aggregate([
      {
        $match: { isActive: true },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "parent",
          as: "subcategories",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $addFields: {
          productCount: { $size: "$products" },
          subcategoryCount: { $size: "$subcategories" },
        },
      },
      {
        $project: {
          products: 0,
        },
      },
      {
        $sort: { displayOrder: 1, name: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  })
);

// @desc    Get main categories (no parent)
// @route   GET /api/categories/main
// @access  Public
router.get(
  "/main",
  asyncHandler(async (req, res) => {
    const categories = await Category.find({
      parent: { $exists: false },
      isActive: true,
    })
      .populate("subcategories")
      .sort({ displayOrder: 1, name: 1 });

    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  })
);

// @desc    Get subcategories by parent category
// @route   GET /api/categories/:id/subcategories
// @access  Public
router.get(
  "/:id/subcategories",
  asyncHandler(async (req, res) => {
    const subcategories = await Category.find({
      parent: req.params.id,
      isActive: true,
    }).sort({ displayOrder: 1, name: 1 });

    res.status(200).json({
      success: true,
      data: {
        subcategories,
      },
    });
  })
);

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id)
      .populate("parent", "name")
      .populate("subcategories");

    if (!category || !category.isActive) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Get product count
    const productCount = await Category.aggregate([
      { $match: { _id: category._id } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $addFields: {
          productCount: { $size: "$products" },
        },
      },
      {
        $project: {
          productCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        category: {
          ...category.toObject(),
          productCount: productCount[0]?.productCount || 0,
        },
      },
    });
  })
);

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  validateCategory,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    // Check if category name already exists at the same level
    const existingCategory = await Category.findOne({
      name: req.body.name,
      parent: req.body.parent || { $exists: false },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists at this level",
      });
    }

    // If parent is specified, check if it exists
    if (req.body.parent) {
      const parentCategory = await Category.findById(req.body.parent);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: "Parent category not found",
        });
      }
    }

    const category = await Category.create(req.body);

    const populatedCategory = await Category.findById(category._id).populate(
      "parent",
      "name"
    );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        category: populatedCategory,
      },
    });
  })
);

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorize("admin"),
  validateCategory,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if new name conflicts with existing categories (if name is being changed)
    if (req.body.name && req.body.name !== category.name) {
      const existingCategory = await Category.findOne({
        name: req.body.name,
        parent: req.body.parent || category.parent || { $exists: false },
        _id: { $ne: req.params.id },
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists at this level",
        });
      }
    }

    // If parent is being changed, validate it
    if (req.body.parent && req.body.parent !== category.parent?.toString()) {
      // Prevent setting self as parent
      if (req.body.parent === req.params.id) {
        return res.status(400).json({
          success: false,
          message: "Category cannot be its own parent",
        });
      }

      // Check if new parent exists
      const parentCategory = await Category.findById(req.body.parent);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: "Parent category not found",
        });
      }

      // Prevent circular reference (new parent cannot be a subcategory of current category)
      const subcategories = await Category.find({ parent: req.params.id });
      const isCircular = subcategories.some(
        (sub) => sub._id.toString() === req.body.parent
      );

      if (isCircular) {
        return res.status(400).json({
          success: false,
          message: "Cannot set subcategory as parent (circular reference)",
        });
      }
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("parent", "name");

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: {
        category,
      },
    });
  })
);

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category has subcategories
    const subcategories = await Category.find({ parent: req.params.id });
    if (subcategories.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete category that has subcategories. Delete subcategories first.",
      });
    }

    // Check if category has products
    // This would require importing Product model
    // const Product = await import('../models/Product.js');
    // const products = await Product.find({ category: req.params.id });
    // if (products.length > 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Cannot delete category that has products. Move or delete products first.'
    //   });
    // }

    // Soft delete - just mark as inactive
    category.isActive = false;
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  })
);

// @desc    Reorder categories
// @route   PUT /api/categories/reorder
// @access  Private/Admin
router.put(
  "/reorder",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { categoryOrder } = req.body;

    if (!Array.isArray(categoryOrder)) {
      return res.status(400).json({
        success: false,
        message: "Category order must be an array",
      });
    }

    // Update display order for each category
    const updatePromises = categoryOrder.map((item, index) =>
      Category.findByIdAndUpdate(item.id, { displayOrder: index + 1 })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Categories reordered successfully",
    });
  })
);

// @desc    Get category tree (hierarchical structure)
// @route   GET /api/categories/tree
// @access  Public
router.get(
  "/admin/tree",
  asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true })
      .populate("parent", "name")
      .sort({ displayOrder: 1, name: 1 });

    // Build hierarchical tree structure
    const categoryMap = {};
    const rootCategories = [];

    // First pass: create map of all categories
    categories.forEach((category) => {
      categoryMap[category._id] = {
        ...category.toObject(),
        children: [],
      };
    });

    // Second pass: build tree structure
    categories.forEach((category) => {
      if (category.parent) {
        if (categoryMap[category.parent._id]) {
          categoryMap[category.parent._id].children.push(
            categoryMap[category._id]
          );
        }
      } else {
        rootCategories.push(categoryMap[category._id]);
      }
    });

    res.status(200).json({
      success: true,
      data: {
        categories: rootCategories,
      },
    });
  })
);

// @desc    Get category statistics
// @route   GET /api/categories/admin/stats
// @access  Private/Admin
router.get(
  "/admin/stats",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const totalCategories = await Category.countDocuments({ isActive: true });
    const mainCategories = await Category.countDocuments({
      parent: { $exists: false },
      isActive: true,
    });
    const subcategories = await Category.countDocuments({
      parent: { $exists: true },
      isActive: true,
    });

    // Categories with most products
    const categoryProductCounts = await Category.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $addFields: {
          productCount: { $size: "$products" },
        },
      },
      {
        $project: {
          name: 1,
          productCount: 1,
        },
      },
      { $sort: { productCount: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCategories,
        mainCategories,
        subcategories,
        categoryProductCounts,
      },
    });
  })
);

export default router;
