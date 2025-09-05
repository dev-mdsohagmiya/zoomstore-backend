import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentDetails,
  getPaymentHistory,
  processRefund,
  getPaymentStats,
  getAllPayments,
  handleWebhook,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const paymentRouter = express.Router();

// Webhook route (no authentication required)
paymentRouter.route("/webhook").post(handleWebhook);

// All other payment routes require authentication
paymentRouter.use(verifyJWT);

// User payment routes
paymentRouter.route("/create-intent").post(createPaymentIntent);
paymentRouter.route("/history").get(getPaymentHistory);
paymentRouter.route("/confirm/:paymentId").post(confirmPayment);
paymentRouter.route("/:paymentId").get(getPaymentDetails);

// Admin-only routes
paymentRouter.route("/admin/all").get(verifyAdmin, getAllPayments);
paymentRouter.route("/admin/stats").get(verifyAdmin, getPaymentStats);
paymentRouter
  .route("/admin/refund/:paymentId")
  .post(verifyAdmin, processRefund);

export { paymentRouter };
