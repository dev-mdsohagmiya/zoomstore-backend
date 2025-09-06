import mongoose from "mongoose";
import { DB_NAME } from "../constents.js";

// Cache the connection to prevent multiple connections
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI environment variable is not set");
      throw new Error("MONGODB_URI environment variable is not set");
    }

    // If already connected, return the existing connection
    if (cached.conn) {
      console.log("Using existing MongoDB connection");
      return cached.conn;
    }

    // If connection is in progress, wait for it
    if (cached.promise) {
      console.log("Waiting for existing MongoDB connection promise");
      return await cached.promise;
    }

    // MongoDB connection options optimized for Vercel Pro/serverless
    const options = {
      maxPoolSize: 1, // Reduced for serverless - only 1 connection per function
      minPoolSize: 0, // No minimum connections for serverless
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      serverSelectionTimeoutMS: 5000, // Reduced timeout for faster failure detection
      socketTimeoutMS: 30000, // Reduced socket timeout
      connectTimeoutMS: 5000, // Reduced connection timeout
      heartbeatFrequencyMS: 10000, // Send a ping every 10 seconds
      retryWrites: true, // Retry write operations
      retryReads: true, // Retry read operations
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
      // Vercel Pro specific optimizations
      compressors: ["zlib"], // Enable compression
      zlibCompressionLevel: 6, // Compression level
    };

    console.log("Attempting to connect to MongoDB...");

    cached.promise = mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      options
    );

    const connectionInstance = await cached.promise;

    cached.conn = connectionInstance;

    // Set up connection event handlers
    connectionInstance.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    connectionInstance.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      cached.conn = null;
      cached.promise = null;
    });

    connectionInstance.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      cached.conn = null;
      cached.promise = null;
    });

    console.log(
      `\n MongoDB connected | DB HOST: ${connectionInstance.connection.host}`
    );
    console.log(`Database: ${DB_NAME}`);

    return connectionInstance;
  } catch (error) {
    console.error("MONGODB CONNECTION ERROR:", error);
    cached.promise = null; // Reset promise on error
    cached.conn = null; // Reset connection on error
    throw error;
  }
};

// Graceful shutdown handler for Vercel
const gracefulShutdown = async () => {
  if (cached.conn) {
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed gracefully");
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
    }
  }
};

// Handle Vercel function termination
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

export default connectDB;
