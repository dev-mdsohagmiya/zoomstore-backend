import Stripe from "stripe";
import { Payment } from "../models/payment.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// Initialize Stripe with demo/test credentials
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_BQokikJOvBiI2HlWgH4olfQ2",
  {
    apiVersion: "2023-10-16",
  }
);

// Create payment intent
const createPaymentIntent = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId, paymentMethod = "card" } = req.body;

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  // Validate order exists and belongs to user
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  }).populate("user", "name email");

  if (!order) {
    throw new ApiError(404, "Order not found or doesn't belong to you");
  }

  // Check if order is already paid
  if (order.paymentStatus === "paid") {
    throw new ApiError(400, "Order is already paid");
  }

  // Check if payment already exists for this order
  const existingPayment = await Payment.findOne({ order: orderId });
  if (existingPayment && existingPayment.status === "succeeded") {
    throw new ApiError(400, "Payment already exists for this order");
  }

  // Calculate total amount (convert to cents for Stripe)
  const amountInCents = Math.round(order.totalPrice * 100);

  if (amountInCents < 50) {
    throw new ApiError(400, "Minimum payment amount is $0.50");
  }

  try {
    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: {
        orderId: orderId.toString(),
        userId: userId.toString(),
        userEmail: order.user.email,
      },
      description: `Payment for Order #${order.orderNumber || order._id}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create payment record in database
    const payment = await Payment.create({
      user: userId,
      order: orderId,
      stripePaymentIntentId: paymentIntent.id,
      stripeClientSecret: paymentIntent.client_secret,
      amount: order.totalPrice,
      currency: "usd",
      status: "pending",
      paymentMethod: paymentMethod,
      description: `Payment for Order #${order.orderNumber || order._id}`,
      metadata: {
        orderNumber: order.orderNumber || order._id.toString(),
        userEmail: order.user.email,
        userName: order.user.name,
      },
    });

    res.status(201).json(
      new ApiResponse(
        201,
        {
          paymentId: payment._id,
          clientSecret: paymentIntent.client_secret,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          orderId: orderId,
        },
        "Payment intent created successfully"
      )
    );
  } catch (error) {
    console.error("Stripe error:", error);
    throw new ApiError(500, `Payment creation failed: ${error.message}`);
  }
});

// Confirm payment
const confirmPayment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { paymentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(paymentId)) {
    throw new ApiError(400, "Invalid payment ID");
  }

  const payment = await Payment.findOne({
    _id: paymentId,
    user: userId,
  }).populate("order");

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  try {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(
      payment.stripePaymentIntentId
    );

    // Update payment status based on Stripe status
    let newStatus = payment.status;
    let additionalData = {};

    switch (paymentIntent.status) {
      case "succeeded":
        newStatus = "succeeded";
        additionalData = {
          processedAt: new Date(),
          paymentMethodDetails: paymentIntent.payment_method
            ? {
                brand: paymentIntent.payment_method.card?.brand,
                last4: paymentIntent.payment_method.card?.last4,
                exp_month: paymentIntent.payment_method.card?.exp_month,
                exp_year: paymentIntent.payment_method.card?.exp_year,
                funding: paymentIntent.payment_method.card?.funding,
              }
            : null,
        };
        break;
      case "requires_payment_method":
      case "requires_confirmation":
      case "requires_action":
        newStatus = "pending";
        break;
      case "processing":
        newStatus = "processing";
        break;
      case "canceled":
        newStatus = "canceled";
        break;
      case "payment_failed":
        newStatus = "failed";
        additionalData = {
          failureCode: paymentIntent.last_payment_error?.code,
          failureMessage: paymentIntent.last_payment_error?.message,
        };
        break;
    }

    // Update payment status
    await payment.updateStatus(newStatus, additionalData);

    // If payment succeeded, update order status
    if (newStatus === "succeeded") {
      await Order.findByIdAndUpdate(payment.order._id, {
        paymentStatus: "paid",
        status: "confirmed",
      });
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          paymentId: payment._id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          orderId: payment.order._id,
          orderStatus: payment.order.status,
        },
        "Payment status updated successfully"
      )
    );
  } catch (error) {
    console.error("Stripe error:", error);
    throw new ApiError(500, `Payment confirmation failed: ${error.message}`);
  }
});

// Get payment details
const getPaymentDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { paymentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(paymentId)) {
    throw new ApiError(400, "Invalid payment ID");
  }

  const payment = await Payment.findOne({
    _id: paymentId,
    user: userId,
  })
    .populate("order", "orderNumber totalAmount status")
    .populate("user", "name email");

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, payment, "Payment details retrieved successfully")
    );
});

// Get user's payment history
const getPaymentHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, status, paymentMethod } = req.query;
  const skip = (page - 1) * limit;

  // Build filter query
  const filter = { user: userId };
  if (status) filter.status = status;
  if (paymentMethod) filter.paymentMethod = paymentMethod;

  const payments = await Payment.find(filter)
    .populate("order", "orderNumber totalAmount status")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalPayments = await Payment.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        payments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPayments / limit),
          totalPayments,
          hasNext: page < Math.ceil(totalPayments / limit),
          hasPrev: page > 1,
        },
      },
      "Payment history retrieved successfully"
    )
  );
});

// Process refund (Admin only)
const processRefund = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { amount, reason = "requested_by_customer" } = req.body;

  if (!mongoose.Types.ObjectId.isValid(paymentId)) {
    throw new ApiError(400, "Invalid payment ID");
  }

  const payment = await Payment.findById(paymentId).populate("order");

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (payment.status !== "succeeded") {
    throw new ApiError(400, "Only succeeded payments can be refunded");
  }

  const refundAmount = amount || payment.remainingAmount;

  if (refundAmount <= 0) {
    throw new ApiError(400, "No amount available for refund");
  }

  if (refundAmount > payment.remainingAmount) {
    throw new ApiError(400, "Refund amount exceeds remaining amount");
  }

  try {
    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: Math.round(refundAmount * 100), // Convert to cents
      reason: reason,
      metadata: {
        paymentId: paymentId,
        orderId: payment.order._id.toString(),
      },
    });

    // Update payment record
    await payment.processRefund(refundAmount, reason);

    // Update order status if fully refunded
    if (payment.status === "refunded") {
      await Order.findByIdAndUpdate(payment.order._id, {
        paymentStatus: "refunded",
        status: "cancelled",
      });
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          refundId: refund.id,
          paymentId: payment._id,
          refundedAmount: refundAmount,
          remainingAmount: payment.remainingAmount,
          status: payment.status,
        },
        "Refund processed successfully"
      )
    );
  } catch (error) {
    console.error("Stripe refund error:", error);
    throw new ApiError(500, `Refund processing failed: ${error.message}`);
  }
});

// Get payment statistics (Admin only)
const getPaymentStats = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  const stats = await Payment.getPaymentStats(userId);

  res
    .status(200)
    .json(
      new ApiResponse(200, stats, "Payment statistics retrieved successfully")
    );
});

// Get all payments (Admin only)
const getAllPayments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, paymentMethod, search } = req.query;
  const skip = (page - 1) * limit;

  // Build filter query
  const filter = {};
  if (status) filter.status = status;
  if (paymentMethod) filter.paymentMethod = paymentMethod;

  // Add search functionality
  if (search) {
    filter.$or = [
      { "metadata.userEmail": { $regex: search, $options: "i" } },
      { "metadata.userName": { $regex: search, $options: "i" } },
      { "metadata.orderNumber": { $regex: search, $options: "i" } },
    ];
  }

  const payments = await Payment.find(filter)
    .populate("user", "name email")
    .populate("order", "orderNumber totalAmount status")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalPayments = await Payment.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        payments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPayments / limit),
          totalPayments,
          hasNext: page < Math.ceil(totalPayments / limit),
          hasPrev: page > 1,
        },
      },
      "All payments retrieved successfully"
    )
  );
});

// Webhook handler for Stripe events
const handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret =
    process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_1234567890abcdef";

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
      await handlePaymentSucceeded(paymentIntent);
      break;
    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      await handlePaymentFailed(failedPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
});

// Helper function to handle successful payment
const handlePaymentSucceeded = async (paymentIntent) => {
  try {
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (payment) {
      await payment.updateStatus("succeeded", {
        processedAt: new Date(),
        paymentMethodDetails: paymentIntent.payment_method
          ? {
              brand: paymentIntent.payment_method.card?.brand,
              last4: paymentIntent.payment_method.card?.last4,
              exp_month: paymentIntent.payment_method.card?.exp_month,
              exp_year: paymentIntent.payment_method.card?.exp_year,
              funding: paymentIntent.payment_method.card?.funding,
            }
          : null,
      });

      // Update order status
      await Order.findByIdAndUpdate(payment.order, {
        paymentStatus: "paid",
        status: "confirmed",
      });
    }
  } catch (error) {
    console.error("Error handling payment succeeded:", error);
  }
};

// Helper function to handle failed payment
const handlePaymentFailed = async (paymentIntent) => {
  try {
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (payment) {
      await payment.updateStatus("failed", {
        failureCode: paymentIntent.last_payment_error?.code,
        failureMessage: paymentIntent.last_payment_error?.message,
      });
    }
  } catch (error) {
    console.error("Error handling payment failed:", error);
  }
};

export {
  createPaymentIntent,
  confirmPayment,
  getPaymentDetails,
  getPaymentHistory,
  processRefund,
  getPaymentStats,
  getAllPayments,
  handleWebhook,
};
