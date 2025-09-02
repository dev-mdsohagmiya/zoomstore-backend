import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, categories, "Categories retrieved successfully")
    );
});

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");

  const category = await Category.create({
    name,
    slug,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, category, "Category created successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");

  const category = await Category.findByIdAndUpdate(
    id,
    { name, slug },
    { new: true }
  );

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Category deleted successfully"));
});

export { getAllCategories, createCategory, updateCategory, deleteCategory };
