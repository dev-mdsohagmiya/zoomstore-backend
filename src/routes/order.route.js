import { Router } from "express";
import {
  createOrder,
  createOrderWithPayment,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStatus,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const orderRouter = Router();

// User routes
orderRouter.route("/").post(verifyJWT, upload.array("photos", 5), createOrder);
orderRouter
  .route("/with-payment")
  .post(verifyJWT, upload.array("photos", 5), createOrderWithPayment);
orderRouter.route("/myorders").get(verifyJWT, getMyOrders);
orderRouter.route("/:id").get(verifyJWT, getOrderById);
orderRouter.route("/status/:id").get(verifyJWT, getOrderStatus);

// Admin routes
orderRouter.route("/").get(verifyJWT, verifyAdmin, getAllOrders);
orderRouter.route("/status/:id").put(verifyJWT, verifyAdmin, updateOrderStatus);

export default orderRouter;
