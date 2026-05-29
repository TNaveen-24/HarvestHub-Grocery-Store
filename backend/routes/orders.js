import { Router } from "express";
import { validationResult } from "express-validator";
import { authorize, protect } from "../middleware/auth.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateOrder } from "../utils/validation.js";

const router = Router();

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get(
  "/",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    // Search by order number or customer
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.$or = [{ orderNumber: searchRegex }];
    }

    const orders = await Order.find(query)
      .populate("user", "name email phone")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

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

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
router.get(
  "/my-orders",
  protect,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { user: req.user.id };

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    const orders = await Order.find(query)
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

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

// @desc    Get order statistics
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
router.get(
  "/admin/stats",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const stats = await Order.getStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  })
);

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.product", "name price images description");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns the order or is admin
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this order",
      });
    }

    res.status(200).json({
      success: true,
      data: { order },
    });
  })
);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post(
  "/",
  protect,
  validateOrder,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      couponCode,
      customerNotes,
    } = req.body;

    // Validate products and calculate total
    let orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: item.product,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
        image:
          product.images && product.images.length > 0
            ? product.images[0].url
            : undefined,
      });
    }

    // Calculate totals
    const deliveryFee =
      subtotal >= (Number(process.env.FREE_DELIVERY_THRESHOLD) || 500)
        ? 0
        : Number(process.env.DEFAULT_DELIVERY_FEE) || 40;
    const taxRate = Number(process.env.TAX_RATE) || 0.05;
    const discount = 0; // Coupon logic can be added later
    const tax = (subtotal - discount) * taxRate;
    const total = subtotal - discount + deliveryFee + tax;

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod: paymentMethod || "cod",
      subtotal,
      discount,
      deliveryFee,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      couponCode: couponCode || null,
      customerNotes: customerNotes || "",
    });

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
          purchaseCount: item.quantity,
        },
      });
    }

    // Populate the order before returning
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("items.product", "name price images");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: { order: populatedOrder },
    });
  })
);

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { status, notes } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Use the model's updateStatus method (tracks history)
    await order.updateStatus(status, notes || "", req.user.id);

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("items.product", "name price images");

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: { order: updatedOrder },
    });
  })
);

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put(
  "/:id/cancel",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns the order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    // Check if order can be cancelled
    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled in current status",
      });
    }

    // Update order status
    await order.updateStatus(
      "cancelled",
      req.body.reason || "Cancelled by customer",
      req.user.id
    );

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.quantity,
          purchaseCount: -item.quantity,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: { order },
    });
  })
);

export default router;
