import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const categoryRouter = Router();

// Public routes
categoryRouter.route("/").get(getAllCategories);

// Admin routes
categoryRouter.route("/").post(verifyJWT, verifyAdmin, createCategory);
categoryRouter.route("/:id").put(verifyJWT, verifyAdmin, updateCategory);
categoryRouter.route("/:id").delete(verifyJWT, verifyAdmin, deleteCategory);

export default categoryRouter;
