import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

// Initialize database connection for Vercel with retry logic
let isConnected = false;
let connectionRetries = 0;
const maxRetries = 3;

const ensureDatabaseConnection = async () => {
  if (!isConnected) {
    try {
      console.log(
        `Attempting database connection (attempt ${connectionRetries + 1}/${maxRetries + 1})`
      );
      await connectDB();
      isConnected = true;
      connectionRetries = 0; // Reset retry counter on successful connection
      console.log("Database connection established for Vercel function");
    } catch (error) {
      console.error(
        `Failed to connect to database (attempt ${connectionRetries + 1}):`,
        error
      );
      connectionRetries++;

      if (connectionRetries <= maxRetries) {
        // Wait before retrying with exponential backoff
        const delay = Math.pow(2, connectionRetries) * 1000;
        console.log(`Retrying connection in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return ensureDatabaseConnection();
      } else {
        throw new Error(
          `Database connection failed after ${maxRetries + 1} attempts: ${error.message}`
        );
      }
    }
  }
};

// Middleware to ensure database connection on each request
app.use(async (req, res, next) => {
  try {
    await ensureDatabaseConnection();
    next();
  } catch (error) {
    console.error("Database connection error in middleware:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }
});

// Health check endpoint for monitoring
app.get("/health", async (req, res) => {
  try {
    if (isConnected) {
      res.status(200).json({
        success: true,
        message: "Database connection is healthy",
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        success: false,
        message: "Database connection is not established",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Health check failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Export the app for Vercel
export default app;

// Start server only if not in Vercel environment
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  connectDB()
    .then(() => {
      app.listen(process.env.PORT || 8000, () => {
        console.log("Server is running at PORT:", process.env.PORT || 8000);
      });
    })
    .catch((error) => {
      console.log("MONGODB connection failed  | ", error);
    });
}

// const app = express()(async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (err) => {
//       console.log("ERR", err);
//       throw err;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log("App is listening on port ", process.env.PORT);
//     });
//   } catch (err) {
//     console.log("Error", err);
//     throw err;
//   }
// })();
