import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const categoryRouter = Router();

// Public routes
categoryRouter.route("/").get(getAllCategories);

// Admin routes
categoryRouter.route("/").post(
  verifyJWT,
  verifyAdmin,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  createCategory
);
categoryRouter.route("/:id").put(
  verifyJWT,
  verifyAdmin,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  updateCategory
);
categoryRouter.route("/:id").delete(verifyJWT, verifyAdmin, deleteCategory);

export default categoryRouter;
