import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 10, // Maximum 10 items per product in cart
    },
    price: {
      type: Number,
      required: true,
    },
    selectedSize: {
      type: String,
      trim: true,
      default: null,
    },
    selectedColor: {
      type: String,
      trim: true,
      default: null,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: function () {
        // Cart items expire after 1 day
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
      },
    },
  },
  { timestamps: true }
);

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Calculate totals before saving
cartSchema.pre("save", function (next) {
  this.totalItems = this.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  this.totalPrice = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  this.lastUpdated = new Date();
  next();
});

// Index for efficient queries
cartSchema.index({ user: 1 });
cartSchema.index({ "items.expiresAt": 1 });

// Static method to clean expired items
cartSchema.statics.cleanExpiredItems = async function () {
  const now = new Date();
  const result = await this.updateMany(
    { "items.expiresAt": { $lt: now } },
    { $pull: { items: { expiresAt: { $lt: now } } } }
  );
  return result;
};

// Method to add item to cart
cartSchema.methods.addItem = async function (
  productId,
  quantity,
  price,
  selectedSize = null,
  selectedColor = null
) {
  const Product = mongoose.model("Product");

  // Check if product exists and is in stock
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  // Validate selected size if provided
  if (selectedSize && product.sizes && product.sizes.length > 0) {
    if (!product.sizes.includes(selectedSize)) {
      throw new Error(
        `Invalid size. Available sizes: ${product.sizes.join(", ")}`
      );
    }
  }

  // Validate selected color if provided
  if (selectedColor && product.colors && product.colors.length > 0) {
    if (!product.colors.includes(selectedColor)) {
      throw new Error(
        `Invalid color. Available colors: ${product.colors.join(", ")}`
      );
    }
  }

  // Check if item already exists in cart with same size and color
  const existingItem = this.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
  );

  if (existingItem) {
    // Update quantity if item exists with same size and color
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > 10) {
      throw new Error("Maximum 10 items per product allowed in cart");
    }
    if (product.stock < newQuantity) {
      throw new Error("Insufficient stock for requested quantity");
    }
    existingItem.quantity = newQuantity;
    existingItem.price = price; // Update price in case it changed
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity,
      price,
      selectedSize,
      selectedColor,
    });
  }

  // Update product stock
  await Product.findByIdAndUpdate(productId, {
    $inc: { stock: -quantity },
  });

  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = async function (productId, quantity = null) {
  const Product = mongoose.model("Product");

  const itemIndex = this.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new Error("Item not found in cart");
  }

  const item = this.items[itemIndex];
  const removeQuantity = quantity || item.quantity;

  if (removeQuantity >= item.quantity) {
    // Remove entire item
    this.items.splice(itemIndex, 1);
  } else {
    // Update quantity
    item.quantity -= removeQuantity;
  }

  // Restore stock
  await Product.findByIdAndUpdate(productId, {
    $inc: { stock: removeQuantity },
  });

  return this.save();
};

// Method to clear entire cart
cartSchema.methods.clearCart = async function () {
  const Product = mongoose.model("Product");

  // Restore stock for all items
  for (const item of this.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  this.items = [];
  return this.save();
};

// Method to get cart with populated products
cartSchema.methods.getCartWithProducts = async function () {
  return await this.populate({
    path: "items.product",
    select: "name photos price discount stock status",
  });
};

export const Cart = mongoose.model("Cart", cartSchema);
