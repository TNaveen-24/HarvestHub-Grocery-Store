import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    // Payment method
    method: {
      type: String,
      enum: ["razorpay", "stripe", "cod"],
      required: [true, "Payment method is required"],
    },

    // Amount
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },

    // Status
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
    },

    // Gateway-specific details
    razorpay: {
      orderId: String,
      paymentId: String,
      signature: String,
    },
    stripe: {
      paymentIntentId: String,
      paymentMethodId: String,
      clientSecret: String,
    },

    // Refund details
    refund: {
      refundId: String,
      amount: Number,
      reason: String,
      status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
      },
      refundedAt: Date,
    },

    // Transaction metadata
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Error tracking
    errorMessage: String,
    errorCode: String,

    // Timestamps for tracking
    paidAt: Date,
    failedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ order: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ "razorpay.paymentId": 1 });
paymentSchema.index({ "stripe.paymentIntentId": 1 });

// Auto-generate transaction ID
paymentSchema.pre("save", function (next) {
  if (!this.transactionId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.transactionId = `TXN-${timestamp}-${random}`;
  }
  next();
});

// Method to mark payment as completed
paymentSchema.methods.markCompleted = function () {
  this.status = "completed";
  this.paidAt = new Date();
  return this.save();
};

// Method to mark payment as failed
paymentSchema.methods.markFailed = function (errorMessage, errorCode) {
  this.status = "failed";
  this.failedAt = new Date();
  this.errorMessage = errorMessage;
  this.errorCode = errorCode;
  return this.save();
};

// Method to process refund
paymentSchema.methods.processRefund = function (refundId, amount, reason) {
  this.status = "refunded";
  this.refund = {
    refundId,
    amount: amount || this.amount,
    reason: reason || "Customer request",
    status: "completed",
    refundedAt: new Date(),
  };
  return this.save();
};

// Static to get revenue stats
paymentSchema.statics.getRevenueStats = async function (startDate, endDate) {
  const match = { status: "completed" };
  if (startDate && endDate) {
    match.paidAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          year: { $year: "$paidAt" },
          month: { $month: "$paidAt" },
        },
        totalRevenue: { $sum: "$amount" },
        count: { $sum: 1 },
        avgPayment: { $avg: "$amount" },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
  ]);
};

export default mongoose.model("Payment", paymentSchema);
