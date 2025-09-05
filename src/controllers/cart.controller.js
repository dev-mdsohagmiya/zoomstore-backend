import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

// Get user's cart
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // Create empty cart if it doesn't exist
    cart = await Cart.create({ user: userId, items: [] });
  }

  // Clean expired items before returning
  await Cart.cleanExpiredItems();

  // Get fresh cart data
  cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "name photos price discount stock status slug",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart retrieved successfully"));
});

// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    productId,
    quantity = 1,
    selectedSize = null,
    selectedColor = null,
  } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  if (quantity < 1 || quantity > 10) {
    throw new ApiError(400, "Quantity must be between 1 and 10");
  }

  // Check if product exists and is active
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.status !== "active") {
    throw new ApiError(400, "Product is not available");
  }

  if (product.stock < quantity) {
    throw new ApiError(400, "Insufficient stock available");
  }

  // Get or create cart
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // Calculate price (considering discount)
  const price =
    product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;

  try {
    // Add item to cart (this will also update stock)
    await cart.addItem(productId, quantity, price, selectedSize, selectedColor);

    // Get updated cart with populated products
    const updatedCart = await cart.getCartWithProducts();

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedCart, "Item added to cart successfully")
      );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// Update cart item quantity
const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    productId,
    quantity,
    selectedSize = null,
    selectedColor = null,
  } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  if (quantity < 0 || quantity > 10) {
    throw new ApiError(400, "Quantity must be between 0 and 10");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!existingItem) {
    throw new ApiError(404, "Item not found in cart");
  }

  // Validate size and color if provided
  if (selectedSize !== null || selectedColor !== null) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (selectedSize && product.sizes && product.sizes.length > 0) {
      if (!product.sizes.includes(selectedSize)) {
        throw new ApiError(
          400,
          `Invalid size. Available sizes: ${product.sizes.join(", ")}`
        );
      }
    }

    if (selectedColor && product.colors && product.colors.length > 0) {
      if (!product.colors.includes(selectedColor)) {
        throw new ApiError(
          400,
          `Invalid color. Available colors: ${product.colors.join(", ")}`
        );
      }
    }
  }

  if (quantity === 0) {
    // Remove item completely
    await cart.removeItem(productId);
  } else {
    // Update quantity
    const quantityDifference = quantity - existingItem.quantity;

    if (quantityDifference > 0) {
      // Adding more items
      const product = await Product.findById(productId);
      if (product.stock < quantityDifference) {
        throw new ApiError(400, "Insufficient stock available");
      }

      // Update stock
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: -quantityDifference },
      });
    } else if (quantityDifference < 0) {
      // Removing items
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: Math.abs(quantityDifference) },
      });
    }

    existingItem.quantity = quantity;

    // Update size and color if provided
    if (selectedSize !== null) {
      existingItem.selectedSize = selectedSize;
    }
    if (selectedColor !== null) {
      existingItem.selectedColor = selectedColor;
    }

    await cart.save();
  }

  // Get updated cart with populated products
  const updatedCart = await cart.getCartWithProducts();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCart, "Cart updated successfully"));
});

// Remove item from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  try {
    await cart.removeItem(productId);

    // Get updated cart with populated products
    const updatedCart = await cart.getCartWithProducts();

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedCart, "Item removed from cart successfully")
      );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// Clear entire cart
const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  try {
    await cart.clearCart();

    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart cleared successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// Get cart summary (count and total)
const getCartSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalItems: 0,
          totalPrice: 0,
          itemCount: 0,
        },
        "Cart summary retrieved successfully"
      )
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
        itemCount: cart.items.length,
      },
      "Cart summary retrieved successfully"
    )
  );
});

// Clean expired cart items (admin only)
const cleanExpiredItems = asyncHandler(async (req, res) => {
  const result = await Cart.cleanExpiredItems();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
      "Expired cart items cleaned successfully"
    )
  );
});

// Admin: Get all user carts
const getAllUserCarts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const skip = (page - 1) * limit;

  // Build search query
  let searchQuery = {};
  if (search) {
    searchQuery = {
      $or: [
        { "user.name": { $regex: search, $options: "i" } },
        { "user.email": { $regex: search, $options: "i" } },
      ],
    };
  }

  // Get carts with user details and pagination
  const carts = await Cart.find(searchQuery)
    .populate({
      path: "user",
      select: "name email role",
    })
    .populate({
      path: "items.product",
      select: "name price photos sizes colors",
    })
    .sort({ lastUpdated: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const totalCarts = await Cart.countDocuments(searchQuery);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        carts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCarts / limit),
          totalCarts,
          hasNext: page < Math.ceil(totalCarts / limit),
          hasPrev: page > 1,
        },
      },
      "All user carts retrieved successfully"
    )
  );
});

// Admin: Get specific user's cart
const getUserCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const cart = await Cart.findOne({ user: userId })
    .populate({
      path: "user",
      select: "name email role",
    })
    .populate({
      path: "items.product",
      select: "name price photos sizes colors stock",
    });

  if (!cart) {
    throw new ApiError(404, "User cart not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, cart, "User cart retrieved successfully"));
});

// Admin: Remove item from specific user's cart
const adminRemoveFromUserCart = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "User cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new ApiError(404, "Item not found in user's cart");
  }

  const item = cart.items[itemIndex];
  const quantity = item.quantity;

  // Restore stock
  await Product.findByIdAndUpdate(productId, {
    $inc: { stock: quantity },
  });

  // Remove item from cart
  cart.items.splice(itemIndex, 1);
  await cart.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, cart, "Item removed from user's cart successfully")
    );
});

// Admin: Clear specific user's cart
const adminClearUserCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "User cart not found");
  }

  // Restore all stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  // Clear cart
  cart.items = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;
  await cart.save();

  res
    .status(200)
    .json(new ApiResponse(200, cart, "User cart cleared successfully"));
});

// Admin: Update item quantity in specific user's cart
const adminUpdateUserCartItem = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  if (!quantity || quantity < 0 || quantity > 10) {
    throw new ApiError(400, "Quantity must be between 0 and 10");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "User cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new ApiError(404, "Item not found in user's cart");
  }

  const item = cart.items[itemIndex];
  const oldQuantity = item.quantity;
  const quantityDifference = quantity - oldQuantity;

  if (quantity === 0) {
    // Remove item completely
    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: oldQuantity },
    });
    cart.items.splice(itemIndex, 1);
  } else {
    // Update quantity
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (quantityDifference > 0) {
      // Adding more items - check stock
      if (product.stock < quantityDifference) {
        throw new ApiError(400, "Insufficient stock available");
      }
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: -quantityDifference },
      });
    } else if (quantityDifference < 0) {
      // Removing items - restore stock
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: Math.abs(quantityDifference) },
      });
    }

    item.quantity = quantity;
  }

  await cart.save();

  res
    .status(200)
    .json(new ApiResponse(200, cart, "User cart item updated successfully"));
});

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary,
  cleanExpiredItems,
  getAllUserCarts,
  getUserCart,
  adminRemoveFromUserCart,
  adminClearUserCart,
  adminUpdateUserCartItem,
};
