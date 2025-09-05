import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { category, search, minPrice, maxPrice, sort } = req.query;

  let filter = { status: "active" };

  // Category filter
  if (category) {
    const categoryDoc = await Category.findOne({ slug: category });
    if (categoryDoc) {
      filter.categories = categoryDoc._id;
    }
  }

  // Search filter
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Price filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  let sortOption = { createdAt: -1 };
  if (sort) {
    switch (sort) {
      case "price-low":
        sortOption = { price: 1 };
        break;
      case "price-high":
        sortOption = { price: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
    }
  }

  const products = await Product.find(filter)
    .populate("categories", "name slug")
    .skip(skip)
    .limit(limit)
    .sort(sortOption);

  const totalProducts = await Product.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          page,
          limit,
          total: totalProducts,
          pages: Math.ceil(totalProducts / limit),
        },
      },
      "Products retrieved successfully"
    )
  );
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate(
    "categories",
    "name slug"
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product retrieved successfully"));
});

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discount,
    stock,
    categories,
    sizes,
    colors,
  } = req.body;

  if (!name || !description || !price) {
    throw new ApiError(400, "Name, description and price are required");
  }

  const slug = name
    ?.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");

  // Handle photo uploads
  const photos = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadedPhoto = await uploadOnCloudinary(file.path);
      if (uploadedPhoto) {
        photos.push(uploadedPhoto.url);
      }
    }
  }

  // Validate categories
  let categoryIds = [];
  if (categories && categories.length > 0) {
    categoryIds = await Category.find({ _id: { $in: categories } }).select(
      "_id"
    );
    categoryIds = categoryIds.map((cat) => cat._id);
  }

  // Parse sizes and colors from string arrays
  let parsedSizes = [];
  let parsedColors = [];

  if (sizes) {
    try {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    } catch (error) {
      // If JSON parsing fails, treat as comma-separated string
      parsedSizes = sizes
        .split(",")
        .map((size) => size.trim())
        .filter((size) => size);
    }
  }

  if (colors) {
    try {
      parsedColors = typeof colors === "string" ? JSON.parse(colors) : colors;
    } catch (error) {
      // If JSON parsing fails, treat as comma-separated string
      parsedColors = colors
        .split(",")
        .map((color) => color.trim())
        .filter((color) => color);
    }
  }

  const product = await Product.create({
    name,
    slug,
    description,
    price: parseFloat(price),
    discount: discount ? parseFloat(discount) : 0,
    stock: stock ? parseInt(stock) : 0,
    categories: categoryIds,
    photos,
    sizes: parsedSizes,
    colors: parsedColors,
  });

  // Update categories to include this product
  if (categoryIds.length > 0) {
    await Category.updateMany(
      { _id: { $in: categoryIds } },
      { $addToSet: { products: product._id } }
    );
  }

  const createdProduct = await Product.findById(product._id).populate(
    "categories",
    "name slug"
  );

  return res
    .status(201)
    .json(new ApiResponse(200, createdProduct, "Product created successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    discount,
    stock,
    categories,
    status,
    sizes,
    colors,
  } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let updateData = {};

  if (name) {
    updateData.name = name;
    updateData.slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
  }
  if (description) updateData.description = description;
  if (price) updateData.price = parseFloat(price);
  if (discount !== undefined) updateData.discount = parseFloat(discount);
  if (stock !== undefined) updateData.stock = parseInt(stock);
  if (status) updateData.status = status;

  // Handle sizes and colors
  if (sizes !== undefined) {
    let parsedSizes = [];
    try {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    } catch (error) {
      // If JSON parsing fails, treat as comma-separated string
      parsedSizes = sizes
        .split(",")
        .map((size) => size.trim())
        .filter((size) => size);
    }
    updateData.sizes = parsedSizes;
  }

  if (colors !== undefined) {
    let parsedColors = [];
    try {
      parsedColors = typeof colors === "string" ? JSON.parse(colors) : colors;
    } catch (error) {
      // If JSON parsing fails, treat as comma-separated string
      parsedColors = colors
        .split(",")
        .map((color) => color.trim())
        .filter((color) => color);
    }
    updateData.colors = parsedColors;
  }

  // Handle photo uploads
  if (req.files && req.files.length > 0) {
    const photos = [...product.photos];
    for (const file of req.files) {
      const uploadedPhoto = await uploadOnCloudinary(file.path);
      if (uploadedPhoto) {
        photos.push(uploadedPhoto.url);
      }
    }
    updateData.photos = photos;
  }

  // Handle category updates
  if (categories && categories.length > 0) {
    const categoryIds = await Category.find({
      _id: { $in: categories },
    }).select("_id");
    const newCategoryIds = categoryIds.map((cat) => cat._id);

    // Remove product from old categories
    if (product.categories.length > 0) {
      await Category.updateMany(
        { _id: { $in: product.categories } },
        { $pull: { products: product._id } }
      );
    }

    // Add product to new categories
    if (newCategoryIds.length > 0) {
      await Category.updateMany(
        { _id: { $in: newCategoryIds } },
        { $addToSet: { products: product._id } }
      );
    }

    updateData.categories = newCategoryIds;
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate("categories", "name slug");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Remove product from all categories
  if (product.categories.length > 0) {
    await Category.updateMany(
      { _id: { $in: product.categories } },
      { $pull: { products: product._id } }
    );
  }

  // Delete the product
  await Product.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});

const addProductReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  if (!rating || !comment) {
    throw new ApiError(400, "Rating and comment are required");
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check if user has purchased this product
  const { Order } = await import("../models/order.model.js");
  const hasPurchased = await Order.findOne({
    user: userId,
    "items.product": id,
    status: { $in: ["delivered", "shipped", "out-for-delivery"] },
  });

  if (!hasPurchased) {
    throw new ApiError(403, "You can only review products you have purchased");
  }

  // Check if user already reviewed this product
  const existingReview = product.reviews.find(
    (review) => review.user.toString() === userId.toString()
  );
  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this product");
  }

  const review = {
    user: userId,
    name: req.user.name,
    rating: parseInt(rating),
    comment,
  };

  product.reviews.push(review);
  product.calculateRating();
  await product.save();

  return res
    .status(201)
    .json(new ApiResponse(200, product, "Review added successfully"));
});

const deleteProductReview = asyncHandler(async (req, res) => {
  const { id, reviewId } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const reviewIndex = product.reviews.findIndex(
    (review) => review._id.toString() === reviewId
  );
  if (reviewIndex === -1) {
    throw new ApiError(404, "Review not found");
  }

  product.reviews.splice(reviewIndex, 1);
  product.calculateRating();
  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Review deleted successfully"));
});

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  deleteProductReview,
};
