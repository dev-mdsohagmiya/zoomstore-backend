import express from "express";
import {
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
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const cartRouter = express.Router();

// All cart routes require authentication
cartRouter.use(verifyJWT);

// Get user's cart
cartRouter.route("/").get(getCart);

// Add item to cart
cartRouter.route("/add").post(addToCart);

// Update cart item quantity
cartRouter.route("/update").put(updateCartItem);

// Remove item from cart
cartRouter.route("/remove/:productId").delete(removeFromCart);

// Clear entire cart
cartRouter.route("/clear").delete(clearCart);

// Get cart summary
cartRouter.route("/summary").get(getCartSummary);

// Clean expired items (admin only)
cartRouter.route("/clean-expired").post(verifyAdmin, cleanExpiredItems);

// Admin cart management routes
cartRouter.route("/admin/all").get(verifyAdmin, getAllUserCarts);
cartRouter.route("/admin/user/:userId").get(verifyAdmin, getUserCart);
cartRouter
  .route("/admin/user/:userId/clear")
  .delete(verifyAdmin, adminClearUserCart);
cartRouter
  .route("/admin/user/:userId/item/:productId")
  .delete(verifyAdmin, adminRemoveFromUserCart);
cartRouter
  .route("/admin/user/:userId/item/:productId")
  .put(verifyAdmin, adminUpdateUserCartItem);

export { cartRouter };
