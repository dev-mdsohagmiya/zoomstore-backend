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
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    stripeClientSecret: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "usd",
      uppercase: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "processing",
        "succeeded",
        "failed",
        "canceled",
        "refunded",
      ],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["card", "bank_transfer", "wallet", "other"],
      default: "card",
    },
    paymentMethodDetails: {
      type: {
        brand: String,
        last4: String,
        exp_month: Number,
        exp_year: Number,
        funding: String,
      },
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: Map,
      of: String,
      default: new Map(),
    },
    refundedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    refundReason: {
      type: String,
      enum: ["duplicate", "fraudulent", "requested_by_customer", "other"],
      default: null,
    },
    failureCode: {
      type: String,
      default: null,
    },
    failureMessage: {
      type: String,
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
paymentSchema.index({ user: 1 });
paymentSchema.index({ order: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Virtual for refund status
paymentSchema.virtual("isRefunded").get(function () {
  return this.refundedAmount > 0;
});

// Virtual for refund percentage
paymentSchema.virtual("refundPercentage").get(function () {
  if (this.amount === 0) return 0;
  return Math.round((this.refundedAmount / this.amount) * 100);
});

// Virtual for remaining amount
paymentSchema.virtual("remainingAmount").get(function () {
  return this.amount - this.refundedAmount;
});

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = async function (userId = null) {
  const matchStage = userId
    ? { user: new mongoose.Types.ObjectId(userId) }
    : {};

  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        avgAmount: { $avg: "$amount" },
      },
    },
  ]);

  const totalStats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalPayments: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        totalRefunded: { $sum: "$refundedAmount" },
        avgAmount: { $avg: "$amount" },
      },
    },
  ]);

  return {
    byStatus: stats,
    totals: totalStats[0] || {
      totalPayments: 0,
      totalAmount: 0,
      totalRefunded: 0,
      avgAmount: 0,
    },
  };
};

// Instance method to process refund
paymentSchema.methods.processRefund = async function (
  amount = null,
  reason = "requested_by_customer"
) {
  if (this.status !== "succeeded") {
    throw new Error("Only succeeded payments can be refunded");
  }

  const refundAmount = amount || this.remainingAmount;

  if (refundAmount <= 0) {
    throw new Error("No amount available for refund");
  }

  if (refundAmount > this.remainingAmount) {
    throw new Error("Refund amount exceeds remaining amount");
  }

  this.refundedAmount += refundAmount;
  this.refundReason = reason;

  if (this.refundedAmount >= this.amount) {
    this.status = "refunded";
    this.refundedAt = new Date();
  }

  return this.save();
};

// Instance method to update payment status
paymentSchema.methods.updateStatus = async function (
  status,
  additionalData = {}
) {
  const allowedTransitions = {
    pending: ["processing", "succeeded", "failed", "canceled"],
    processing: ["succeeded", "failed", "canceled"],
    succeeded: ["refunded"],
    failed: ["pending"],
    canceled: ["pending"],
    refunded: [],
  };

  if (!allowedTransitions[this.status]?.includes(status)) {
    throw new Error(
      `Invalid status transition from ${this.status} to ${status}`
    );
  }

  this.status = status;

  if (status === "succeeded") {
    this.processedAt = new Date();
  }

  // Update additional data if provided
  Object.keys(additionalData).forEach((key) => {
    if (this.schema.paths[key]) {
      this[key] = additionalData[key];
    }
  });

  return this.save();
};

// Pre-save middleware to validate data
paymentSchema.pre("save", function (next) {
  // Validate refunded amount doesn't exceed payment amount
  if (this.refundedAmount > this.amount) {
    return next(new Error("Refunded amount cannot exceed payment amount"));
  }

  // Set processedAt if status is succeeded and not already set
  if (this.status === "succeeded" && !this.processedAt) {
    this.processedAt = new Date();
  }

  next();
});

// Ensure virtual fields are serialized
paymentSchema.set("toJSON", { virtuals: true });
paymentSchema.set("toObject", { virtuals: true });

export const Payment = mongoose.model("Payment", paymentSchema);
