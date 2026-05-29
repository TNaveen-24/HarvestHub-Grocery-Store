import crypto from "crypto";
import express, { Router } from "express";
import Razorpay from "razorpay";
import Stripe from "stripe";
import { protect } from "../middleware/auth.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// Initialize payment gateways only if keys are provided
let stripe, razorpay;

try {
  if (
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_SECRET_KEY !== "test_stripe_secret_key"
  ) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log("✅ Stripe initialized successfully");
  } else {
    console.log(
      "⚠️ Stripe not initialized - using test key or no key provided"
    );
  }
} catch (error) {
  console.log("❌ Stripe initialization failed:", error.message);
}

try {
  if (
    process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_SECRET &&
    process.env.RAZORPAY_KEY_ID !== "test_key_id" &&
    process.env.RAZORPAY_KEY_SECRET !== "test_key_secret"
  ) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("✅ Razorpay initialized successfully");
  } else {
    console.log(
      "⚠️ Razorpay not initialized - using test keys or no keys provided"
    );
  }
} catch (error) {
  console.log("❌ Razorpay initialization failed:", error.message);
}

// Middleware to check if payment gateway is available
const checkRazorpay = (req, res, next) => {
  if (!razorpay) {
    return res.status(503).json({
      success: false,
      message:
        "Razorpay payment gateway not configured. Please contact support.",
    });
  }
  next();
};

const checkStripe = (req, res, next) => {
  if (!stripe) {
    return res.status(503).json({
      success: false,
      message: "Stripe payment gateway not configured. Please contact support.",
    });
  }
  next();
};

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay/create-order
// @access  Private
router.post(
  "/razorpay/create-order",
  protect,
  checkRazorpay,
  asyncHandler(async (req, res) => {
    const { amount, currency = "INR" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    try {
      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency: currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          userId: req.user.id,
          userEmail: req.user.email,
        },
      };

      const razorpayOrder = await razorpay.orders.create(options);

      res.status(200).json({
        success: true,
        data: {
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
        },
      });
    } catch (error) {
      console.error("Razorpay order creation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create Razorpay order",
      });
    }
  })
);

// @desc    Verify Razorpay payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
router.post(
  "/razorpay/verify",
  protect,
  asyncHandler(async (req, res) => {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId, // Our internal order ID
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment verification data",
      });
    }

    try {
      // Verify signature
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment signature",
        });
      }

      // Fetch payment details from Razorpay
      const payment = await razorpay.payments.fetch(razorpay_payment_id);

      if (payment.status !== "captured") {
        return res.status(400).json({
          success: false,
          message: "Payment not successful",
        });
      }

      // Update order status in database
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = "completed";
          order.paymentMethod = "razorpay";
          order.paymentDetails = {
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
          };
          await order.save();
        }
      }

      // Create payment record
      await Payment.create({
        user: req.user.id,
        order: orderId,
        method: "razorpay",
        amount: payment.amount / 100,
        currency: payment.currency,
        status: "completed",
        razorpay: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
        },
        paidAt: new Date(),
      });

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: {
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          amount: payment.amount / 100,
          status: payment.status,
        },
      });
    } catch (error) {
      console.error("Razorpay verification error:", error);
      res.status(500).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  })
);

// @desc    Create Stripe payment intent
// @route   POST /api/payments/stripe/create-intent
// @access  Private
router.post(
  "/stripe/create-intent",
  protect,
  checkStripe,
  asyncHandler(async (req, res) => {
    const { amount, currency = "inr" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe expects amount in smallest currency unit (paise for INR)
        currency: currency,
        metadata: {
          userId: req.user.id,
          userEmail: req.user.email,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(200).json({
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        },
      });
    } catch (error) {
      console.error("Stripe payment intent creation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create payment intent",
      });
    }
  })
);

// @desc    Confirm Stripe payment
// @route   POST /api/payments/stripe/confirm
// @access  Private
router.post(
  "/stripe/confirm",
  protect,
  asyncHandler(async (req, res) => {
    const { paymentIntentId, orderId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: "Payment intent ID is required",
      });
    }

    try {
      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          success: false,
          message: "Payment not successful",
          status: paymentIntent.status,
        });
      }

      // Update order status in database
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = "completed";
          order.paymentMethod = "stripe";
          order.paymentDetails = {
            stripePaymentIntentId: paymentIntentId,
            stripePaymentMethodId: paymentIntent.payment_method,
          };
          await order.save();
        }
      }

      // Create payment record
      await Payment.create({
        user: req.user.id,
        order: orderId,
        method: "stripe",
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: "completed",
        stripe: {
          paymentIntentId: paymentIntentId,
          paymentMethodId: paymentIntent.payment_method,
        },
        paidAt: new Date(),
      });

      res.status(200).json({
        success: true,
        message: "Payment confirmed successfully",
        data: {
          paymentIntentId: paymentIntentId,
          amount: paymentIntent.amount / 100,
          status: paymentIntent.status,
        },
      });
    } catch (error) {
      console.error("Stripe payment confirmation error:", error);
      res.status(500).json({
        success: false,
        message: "Payment confirmation failed",
      });
    }
  })
);

// @desc    Handle Stripe webhook
// @route   POST /api/payments/stripe/webhook
// @access  Public (but verified by Stripe signature)
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(async (req, res) => {
    // Check if Stripe is configured
    if (!stripe) {
      console.error("Stripe webhook called but Stripe not configured");
      return res.status(503).json({
        success: false,
        message: "Stripe payment gateway not configured",
      });
    }

    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("Payment succeeded:", paymentIntent.id);
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        console.log("Payment failed:", failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  })
);

// @desc    Handle Razorpay webhook
// @route   POST /api/payments/razorpay/webhook
// @access  Public (but verified by Razorpay signature)
router.post(
  "/razorpay/webhook",
  asyncHandler(async (req, res) => {
    // Check if Razorpay is configured
    if (!razorpay) {
      console.error("Razorpay webhook called but Razorpay not configured");
      return res.status(503).json({
        success: false,
        message: "Razorpay payment gateway not configured",
      });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const { event, payload } = req.body;

    switch (event) {
      case "payment.captured":
        console.log("Payment captured:", payload.payment.entity.id);
        break;

      case "payment.failed":
        console.log("Payment failed:", payload.payment.entity.id);
        break;

      default:
        console.log(`Unhandled event type ${event}`);
    }

    res.json({ status: "ok" });
  })
);

// @desc    Process COD order
// @route   POST /api/payments/cod/confirm
// @access  Private
router.post(
  "/cod/confirm",
  protect,
  asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      order.paymentMethod = "cod";
      order.paymentStatus = "pending";
      await order.save();

      // Create payment record for COD
      await Payment.create({
        user: req.user.id,
        order: orderId,
        method: "cod",
        amount: order.total,
        currency: process.env.CURRENCY || "INR",
        status: "pending",
      });

      res.status(200).json({
        success: true,
        message: "COD order confirmed successfully",
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          paymentMethod: "cod",
          paymentStatus: "pending",
        },
      });
    } catch (error) {
      console.error("COD confirmation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to confirm COD order",
      });
    }
  })
);

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
router.get(
  "/history",
  protect,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const payments = await Payment.find({ user: req.user.id })
      .populate("order")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Payment.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        payments,
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

// @desc    Initiate refund
// @route   POST /api/payments/refund
// @access  Private/Admin
router.post(
  "/refund",
  protect,
  asyncHandler(async (req, res) => {
    const { paymentId, amount, reason } = req.body;

    if (!paymentId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Payment ID and amount are required",
      });
    }

    try {
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      await payment.processRefund(`refund_${Date.now()}`, amount, reason);

      // Update associated order
      const order = await Order.findById(payment.order);
      if (order) {
        await order.updateStatus("refunded", reason || "Refund processed", req.user.id);
        order.paymentStatus = "refunded";
        await order.save();
      }

      res.status(200).json({
        success: true,
        message: "Refund processed successfully",
        data: {
          refundId: payment.refund.refundId,
          amount: payment.refund.amount,
          status: payment.refund.status,
        },
      });
    } catch (error) {
      console.error("Refund error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process refund",
      });
    }
  })
);

export default router;
