import { Router } from "express";
import { validationResult } from "express-validator";
import { authorize, protect } from "../middleware/auth.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateProduct, validateReview } from "../utils/validation.js";

const router = Router();

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = Product.find({ isActive: true });

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query = query.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { tags: { $in: [searchRegex] } },
        ],
      });
    }

    // Filter by category
    if (req.query.category) {
      query = query.find({ category: req.query.category });
    }

    // Filter by subcategory
    if (req.query.subCategory) {
      query = query.find({ subCategory: req.query.subCategory });
    }

    // Filter by brand
    if (req.query.brand) {
      const brandRegex = new RegExp(req.query.brand, "i");
      query = query.find({ brand: brandRegex });
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};
      if (req.query.minPrice) priceFilter.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.$lte = parseFloat(req.query.maxPrice);
      query = query.find({ price: priceFilter });
    }

    // Filter by availability
    if (req.query.inStock === "true") {
      query = query.find({ quantity: { $gt: 0 } });
    }

    // Filter by rating
    if (req.query.minRating) {
      query = query.find({
        averageRating: { $gte: parseFloat(req.query.minRating) },
      });
    }

    // Filter by discount
    if (req.query.onSale === "true") {
      query = query.find({ originalPrice: { $exists: true } });
    }

    // Sort options
    let sortOption = {};
    switch (req.query.sortBy) {
      case "name":
        sortOption = { name: req.query.sortOrder === "desc" ? -1 : 1 };
        break;
      case "price":
        sortOption = { price: req.query.sortOrder === "desc" ? -1 : 1 };
        break;
      case "rating":
        sortOption = { averageRating: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "popularity":
        sortOption = { totalSales: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    query = query.sort(sortOption);

    // Execute query with population
    const products = await query
      .skip(skip)
      .limit(limit)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("reviews", "rating comment user", null, {
        sort: { createdAt: -1 },
        limit: 3,
      });

    // Get total count for pagination
    const total = await Product.countDocuments(query.getQuery());

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  })
);

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get(
  "/featured",
  asyncHandler(async (req, res) => {
    const products = await Product.find({
      isActive: true,
      isFeatured: true,
    })
      .limit(8)
      .populate("category", "name")
      .sort({ totalSales: -1 });

    res.status(200).json({
      success: true,
      data: {
        products,
      },
    });
  })
);

// @desc    Get trending products
// @route   GET /api/products/trending
// @access  Public
router.get(
  "/trending",
  asyncHandler(async (req, res) => {
    const products = await Product.find({
      isActive: true,
      totalSales: { $gte: 10 },
    })
      .limit(8)
      .populate("category", "name")
      .sort({ totalSales: -1, averageRating: -1 });

    res.status(200).json({
      success: true,
      data: {
        products,
      },
    });
  })
);

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
      .populate("category", "name description")
      .populate("subCategory", "name description")
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "name",
        },
        options: { sort: { createdAt: -1 } },
      });

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment view count
    product.views = (product.views || 0) + 1;
    await product.save();

    // Get related products
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .populate("category", "name");

    res.status(200).json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });
  })
);

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  validateProduct,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const product = await Product.create(req.body);

    const populatedProduct = await Product.findById(product._id)
      .populate("category", "name")
      .populate("subCategory", "name");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        product: populatedProduct,
      },
    });
  })
);

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorize("admin"),
  validateProduct,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("category", "name")
      .populate("subCategory", "name");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: {
        product,
      },
    });
  })
);

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Soft delete - just mark as inactive
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  })
);

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post(
  "/:id/reviews",
  protect,
  validateReview,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      (review) => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = {
      user: req.user.id,
      rating: req.body.rating,
      title: req.body.title,
      comment: req.body.comment,
    };

    product.reviews.push(review);

    // Recalculate average rating
    product.averageRating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    product.numReviews = product.reviews.length;

    await product.save();

    const updatedProduct = await Product.findById(req.params.id).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name",
      },
      options: { sort: { createdAt: -1 } },
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: {
        product: updatedProduct,
      },
    });
  })
);

// @desc    Update product review
// @route   PUT /api/products/:id/reviews/:reviewId
// @access  Private
router.put(
  "/:id/reviews/:reviewId",
  protect,
  validateReview,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review",
      });
    }

    // Update review
    review.rating = req.body.rating;
    review.title = req.body.title;
    review.comment = req.body.comment;
    review.updatedAt = Date.now();

    // Recalculate average rating
    product.averageRating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    const updatedProduct = await Product.findById(req.params.id).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name",
      },
      options: { sort: { createdAt: -1 } },
    });

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: {
        product: updatedProduct,
      },
    });
  })
);

// @desc    Delete product review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
router.delete(
  "/:id/reviews/:reviewId",
  protect,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    review.deleteOne();

    // Recalculate average rating
    if (product.reviews.length > 0) {
      product.averageRating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.averageRating = 0;
    }
    product.numReviews = product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  })
);

// @desc    Get product statistics
// @route   GET /api/products/admin/stats
// @access  Private/Admin
router.get(
  "/admin/stats",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const outOfStock = await Product.countDocuments({
      quantity: 0,
      isActive: true,
    });
    const lowStock = await Product.countDocuments({
      quantity: { $gt: 0, $lte: 10 },
      isActive: true,
    });

    // Most popular products
    const popularProducts = await Product.find({ isActive: true })
      .sort({ totalSales: -1 })
      .limit(5)
      .select("name totalSales averageRating");

    // Category distribution
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      { $project: { _id: 0, name: "$category.name", count: 1 } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        outOfStock,
        lowStock,
        popularProducts,
        categoryStats,
      },
    });
  })
);

export default router;
