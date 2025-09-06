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

    // MongoDB connection options optimized for Vercel/serverless
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      heartbeatFrequencyMS: 10000, // Send a ping every 10 seconds
      retryWrites: true, // Retry write operations
      retryReads: true, // Retry read operations
    };

    console.log("Attempting to connect to MongoDB...");

    cached.promise = mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      options
    );

    const connectionInstance = await cached.promise;

    cached.conn = connectionInstance;

    console.log(
      `\n MongoDB connected | DB HOST: ${connectionInstance.connection.host}`
    );
    console.log(`Database: ${DB_NAME}`);

    return connectionInstance;
  } catch (error) {
    console.error("MONGODB CONNECTION ERROR:", error);
    cached.promise = null; // Reset promise on error
    throw error;
  }
};

export default connectDB;
