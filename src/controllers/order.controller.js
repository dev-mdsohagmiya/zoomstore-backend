import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Payment } from "../models/payment.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_BQokikJOvBiI2HlWgH4olfQ2",
  { apiVersion: "2023-10-16" }
);

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  const userId = req.user._id;

  if (!items || items.length === 0) {
    throw new ApiError(400, "Order items are required");
  }

  if (!shippingAddress || !paymentMethod) {
    throw new ApiError(400, "Shipping address and payment method are required");
  }

  // Handle photo uploads
  let uploadedPhotos = [];
  if (req.files && req.files.length > 0) {
    try {
      for (const file of req.files) {
        const cloudinaryResponse = await uploadOnCloudinary(file.path);
        if (cloudinaryResponse) {
          uploadedPhotos.push({
            url: cloudinaryResponse.url,
            publicId: cloudinaryResponse.public_id,
          });
        }
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
      throw new ApiError(500, "Failed to upload photos");
    }
  }

  let itemsPrice = 0;
  const orderItems = [];

  // Validate and calculate prices for each item
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(404, `Product with ID ${item.product} not found`);
    }

    if (product.stock < item.qty) {
      throw new ApiError(400, `Insufficient stock for product ${product.name}`);
    }

    const itemPrice = product.price * item.qty;
    itemsPrice += itemPrice;

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      qty: item.qty,
    });

    // Update product stock
    product.stock -= item.qty;
    if (product.stock <= 0) {
      product.inStock = false;
    }
    await product.save();
  }

  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    photos: uploadedPhotos,
  });

  const createdOrder = await Order.findById(order._id).populate(
    "user",
    "name email"
  );

  return res
    .status(201)
    .json(new ApiResponse(200, createdOrder, "Order created successfully"));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: userId })
    .populate("items.product", "name photos")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalOrders = await Order.countDocuments({ user: userId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        pagination: {
          page,
          limit,
          total: totalOrders,
          pages: Math.ceil(totalOrders / limit),
        },
      },
      "Orders retrieved successfully"
    )
  );
});

const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { status, startDate, endDate } = req.query;

  let filter = {};

  if (status) {
    filter.status = status;
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const orders = await Order.find(filter)
    .populate("user", "name email")
    .populate("items.product", "name photos")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalOrders = await Order.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        pagination: {
          page,
          limit,
          total: totalOrders,
          pages: Math.ceil(totalOrders / limit),
        },
      },
      "Orders retrieved successfully"
    )
  );
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  const order = await Order.findById(id)
    .populate("user", "name email")
    .populate("items.product", "name photos");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Users can only view their own orders, admins can view any order
  if (userRole === "user" && order.user._id.toString() !== userId.toString()) {
    throw new ApiError(403, "Access denied");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order retrieved successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "out-for-delivery",
    "delivered",
    "cancelled",
  ];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid order status");
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.status = status;
  order.updatedAt = new Date();

  if (status === "delivered") {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  await order.save();

  const updatedOrder = await Order.findById(id)
    .populate("user", "name email")
    .populate("items.product", "name photos");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedOrder, "Order status updated successfully")
    );
});

const getOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const order = await Order.findById(id).select("status updatedAt createdAt");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Users can only view their own order status
  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Access denied");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        orderId: order._id,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      "Order status retrieved successfully"
    )
  );
});

const createOrderWithPayment = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod = "card" } = req.body;
  const userId = req.user._id;

  if (!items || items.length === 0) {
    throw new ApiError(400, "Order items are required");
  }

  if (!shippingAddress) {
    throw new ApiError(400, "Shipping address is required");
  }

  // Handle photo uploads
  let uploadedPhotos = [];
  if (req.files && req.files.length > 0) {
    try {
      for (const file of req.files) {
        const cloudinaryResponse = await uploadOnCloudinary(file.path);
        if (cloudinaryResponse) {
          uploadedPhotos.push({
            url: cloudinaryResponse.url,
            publicId: cloudinaryResponse.public_id,
          });
        }
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
      throw new ApiError(500, "Failed to upload photos");
    }
  }

  let itemsPrice = 0;
  const orderItems = [];

  // Validate and calculate prices for each item
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(404, `Product with ID ${item.product} not found`);
    }

    if (product.stock < item.qty) {
      throw new ApiError(400, `Insufficient stock for product ${product.name}`);
    }

    const itemTotal = product.price * item.qty;
    itemsPrice += itemTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      qty: item.qty,
      price: product.price,
      total: itemTotal,
    });
  }

  // Calculate shipping price (you can customize this logic)
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
  const taxPrice = itemsPrice * 0.1; // 10% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Create order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    photos: uploadedPhotos,
    status: "pending",
  });

  // Populate order with user details
  const populatedOrder = await Order.findById(order._id)
    .populate("user", "name email")
    .populate("items.product", "name photos");

  // Create payment intent
  try {
    const amountInCents = Math.round(totalPrice * 100);

    // Check minimum amount
    if (amountInCents < 50) {
      throw new ApiError(400, "Minimum payment amount is $0.50");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
        userEmail: populatedOrder.user.email,
      },
      description: `Payment for Order #${order.orderNumber || order._id}`,
      automatic_payment_methods: { enabled: true },
    });

    // Create payment record
    const payment = await Payment.create({
      user: userId,
      order: order._id,
      stripePaymentIntentId: paymentIntent.id,
      stripeClientSecret: paymentIntent.client_secret,
      amount: totalPrice,
      currency: "usd",
      status: "pending",
      paymentMethod: paymentMethod,
      description: `Payment for Order #${order.orderNumber || order._id}`,
      metadata: {
        orderNumber: order.orderNumber || order._id,
        userEmail: populatedOrder.user.email,
        userName: populatedOrder.user.name,
      },
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          order: populatedOrder,
          payment: {
            paymentId: payment._id,
            clientSecret: paymentIntent.client_secret,
            amount: totalPrice,
            currency: "usd",
            status: "pending",
            stripePaymentIntentId: paymentIntent.id,
          },
        },
        "Order created successfully with payment intent"
      )
    );
  } catch (error) {
    // If payment creation fails, delete the order
    await Order.findByIdAndDelete(order._id);
    throw new ApiError(500, `Payment creation failed: ${error.message}`);
  }
});

export {
  createOrder,
  createOrderWithPayment,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStatus,
};
