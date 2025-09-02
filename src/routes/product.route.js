import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  deleteProductReview,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const productRouter = Router();

// Public routes
productRouter.route("/").get(getAllProducts);
productRouter.route("/:id").get(getProductById);
productRouter.route("/:id/review").post(verifyJWT, addProductReview);

// Admin routes
productRouter
  .route("/")
  .post(verifyJWT, verifyAdmin, upload.array("photos", 5), createProduct);
productRouter
  .route("/:id")
  .put(verifyJWT, verifyAdmin, upload.array("photos", 5), updateProduct);
productRouter.route("/:id").delete(verifyJWT, verifyAdmin, deleteProduct);
productRouter
  .route("/:id/review/:reviewId")
  .delete(verifyJWT, verifyAdmin, deleteProductReview);

export default productRouter;
