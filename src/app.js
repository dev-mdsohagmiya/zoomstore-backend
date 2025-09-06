import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import error handling middleware
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.route.js";
import categoryRouter from "./routes/category.route.js";
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/order.route.js";
import { cartRouter } from "./routes/cart.route.js";
import { paymentRouter } from "./routes/payment.route.js";
import connectDB from "./db/index.js";

//routes declaration

app.get("/", async (req, res) => {
  await connectDB();
  res.send("db connected");
});

app.use("/api/v1/", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/payments", paymentRouter);

// Error handling middleware (must be after routes)
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
