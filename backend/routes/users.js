import { Router } from "express";
import { validationResult } from "express-validator";
import { authorize, protect } from "../middleware/auth.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateAddress, validateUpdateProfile } from "../utils/validation.js";

const router = Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get(
  "/",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = User.find();

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query = query.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
        ],
      });
    }

    // Filter by role
    if (req.query.role) {
      query = query.find({ role: req.query.role });
    }

    // Filter by verification status
    if (req.query.verified !== undefined) {
      query = query.find({ emailVerified: req.query.verified === "true" });
    }

    // Filter by active status
    if (req.query.active !== undefined) {
      query = query.find({ isActive: req.query.active === "true" });
    }

    // Sort
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    query = query.sort({ [sortBy]: sortOrder });

    // Execute query with pagination
    const users = await query.skip(skip).limit(limit).populate("addresses");

    // Get total count for pagination
    const total = await User.countDocuments(query.getQuery());

    res.status(200).json({
      success: true,
      data: {
        users,
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

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin or Own Profile
router.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    // Check if user is admin or viewing own profile
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this profile",
      });
    }

    const user = await User.findById(req.params.id)
      .populate("addresses")
      .populate("cart.product", "name price images");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  })
);

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private/Admin or Own Profile
router.put(
  "/:id",
  protect,
  validateUpdateProfile,
  asyncHandler(async (req, res) => {
    // Check if user is admin or updating own profile
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this profile",
      });
    }

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fields that can be updated
    const allowedFields = ["name", "phone", "dateOfBirth", "gender"];
    const updates = {};

    // Only include allowed fields that were provided
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Admin can update additional fields
    if (req.user.role === "admin") {
      const adminFields = ["role", "isActive", "emailVerified"];
      adminFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("addresses");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: updatedUser,
      },
    });
  })
);

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  })
);

// @desc    Add user address
// @route   POST /api/users/:id/addresses
// @access  Private/Own Profile Only
router.post(
  "/:id/addresses",
  protect,
  validateAddress,
  asyncHandler(async (req, res) => {
    // Users can only add addresses to their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add addresses to this profile",
      });
    }

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If this is the first address or isDefault is true, make it default
    if (user.addresses.length === 0 || req.body.isDefault) {
      // Remove default from other addresses
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
      req.body.isDefault = true;
    }

    user.addresses.push(req.body);
    await user.save();

    const updatedUser = await User.findById(req.params.id).populate(
      "addresses"
    );

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: {
        user: updatedUser,
      },
    });
  })
);

// @desc    Update user address
// @route   PUT /api/users/:id/addresses/:addressId
// @access  Private/Own Profile Only
router.put(
  "/:id/addresses/:addressId",
  protect,
  validateAddress,
  asyncHandler(async (req, res) => {
    // Users can only update addresses on their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update addresses on this profile",
      });
    }

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // If making this address default, remove default from others
    if (req.body.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Update address fields
    Object.keys(req.body).forEach((key) => {
      address[key] = req.body[key];
    });

    await user.save();

    const updatedUser = await User.findById(req.params.id).populate(
      "addresses"
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: {
        user: updatedUser,
      },
    });
  })
);

// @desc    Delete user address
// @route   DELETE /api/users/:id/addresses/:addressId
// @access  Private/Own Profile Only
router.delete(
  "/:id/addresses/:addressId",
  protect,
  asyncHandler(async (req, res) => {
    // Users can only delete addresses from their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete addresses from this profile",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Check if this is the only address
    if (user.addresses.length === 1) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the only address. Add another address first.",
      });
    }

    const wasDefault = address.isDefault;
    address.deleteOne();

    // If deleted address was default, make the first remaining address default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    const updatedUser = await User.findById(req.params.id).populate(
      "addresses"
    );

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: {
        user: updatedUser,
      },
    });
  })
);

// @desc    Get user orders
// @route   GET /api/users/:id/orders
// @access  Private/Own Profile or Admin
router.get(
  "/:id/orders",
  protect,
  asyncHandler(async (req, res) => {
    // Check if user is admin or viewing own orders
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view these orders",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Import Order model (assuming it exists)
    let orders = [];
    let total = 0;

    // This would be implemented when Order model is created
    // const Order = await import('../models/Order.js');
    // const query = { user: req.params.id };

    // if (req.query.status) {
    //   query.status = req.query.status;
    // }

    // orders = await Order.find(query)
    //   .populate('items.product', 'name price images')
    //   .sort({ createdAt: -1 })
    //   .skip(skip)
    //   .limit(limit);

    // total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
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

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private/Admin
router.get(
  "/admin/stats",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ emailVerified: true });
    const adminUsers = await User.countDocuments({ role: "admin" });

    // Users registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // User registration trend (last 7 days)
    const registrationTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const count = await User.countDocuments({
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

      registrationTrend.push({
        date: startOfDay.toISOString().split("T")[0],
        registrations: count,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        verifiedUsers,
        adminUsers,
        newUsers,
        registrationTrend,
      },
    });
  })
);

export default router;
