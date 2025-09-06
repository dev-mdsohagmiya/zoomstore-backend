import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

// Initialize database connection for Vercel
let isConnected = false;

const ensureDatabaseConnection = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("Database connection established for Vercel function");
    } catch (error) {
      console.error("Failed to connect to database:", error);
      throw error;
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
      error: "Database connection failed",
      message: "Unable to connect to the database",
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
