import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
        image: String,
      },
    ],
    shippingAddress: {
      type: {
        type: String,
        enum: ["home", "work", "other"],
        default: "home",
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      phone: String,
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },

    // Pricing breakdown
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },

    // Coupon
    couponCode: {
      type: String,
      default: null,
    },

    // Order status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },

    // Status history for tracking
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        notes: {
          type: String,
          default: "",
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Payment info
    paymentMethod: {
      type: String,
      enum: ["razorpay", "stripe", "cod"],
      required: [true, "Payment method is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentDetails: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      stripePaymentIntentId: String,
      stripePaymentMethodId: String,
    },

    // Delivery
    estimatedDelivery: Date,
    deliveredAt: Date,
    trackingNumber: String,

    // Notes
    customerNotes: {
      type: String,
      maxLength: [500, "Notes cannot exceed 500 characters"],
    },
    adminNotes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ "paymentDetails.razorpayOrderId": 1 });
orderSchema.index({ "paymentDetails.stripePaymentIntentId": 1 });

// Auto-generate order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const prefix = `HH${date.getFullYear()}${String(
      date.getMonth() + 1
    ).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
    const random = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `${prefix}-${random}`;
  }

  // Push initial status to history on creation
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status,
      notes: "Order placed",
      updatedAt: new Date(),
    });
  }

  next();
});

// Method to update status with history tracking
orderSchema.methods.updateStatus = function (status, notes, updatedBy) {
  this.status = status;
  this.statusHistory.push({
    status,
    notes: notes || "",
    updatedBy,
    updatedAt: new Date(),
  });

  if (status === "delivered") {
    this.deliveredAt = new Date();
  }

  return this.save();
};

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function () {
  return !["delivered", "cancelled", "refunded"].includes(this.status);
};

// Static method to get order statistics
orderSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalRevenue: { $sum: "$total" },
      },
    },
  ]);

  const totalOrders = await this.countDocuments();
  const totalRevenue = await this.aggregate([
    { $match: { status: { $nin: ["cancelled", "refunded"] } } },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);

  return {
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    ordersByStatus: stats,
    averageOrderValue:
      totalOrders > 0 ? (totalRevenue[0]?.total || 0) / totalOrders : 0,
  };
};

export default mongoose.model("Order", orderSchema);
