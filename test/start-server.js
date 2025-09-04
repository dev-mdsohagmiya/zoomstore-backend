import { app } from "../src/app.js";
import connectDB from "../src/db/index.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Start server
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api/v1`);
      console.log("🔧 Ready for testing!");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
