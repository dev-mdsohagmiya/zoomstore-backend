import mongoose from "mongoose";
import { DB_NAME } from "../constents.js";

const connectDB = async () => {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI environment variable is not set");
      process.exit(1);
    }

    // MongoDB connection options for better performance
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    };

    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      options
    );

    console.log(
      `\n MongoDB connected | DB HOST: ${connectionInstance.connection.host}`
    );
    console.log(`Database: ${DB_NAME}`);
  } catch (error) {
    console.error("MONGODB CONNECTION ERROR:", error);
    process.exit(1);
  }
};

export default connectDB;
