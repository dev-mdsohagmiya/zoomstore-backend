import mongoose from "mongoose";
import connectDB from "../db/index.js";

/**
 * Ensures database connection is established before performing operations
 * @param {Function} operation - The database operation to perform
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} retryDelay - Delay between retries in milliseconds
 * @returns {Promise} - Result of the operation
 */
export const withDatabaseConnection = async (
  operation,
  maxRetries = 3,
  retryDelay = 1000
) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Ensure database connection
      await connectDB();

      // Check if mongoose is connected
      if (mongoose.connection.readyState !== 1) {
        throw new Error(
          `Database not connected. State: ${mongoose.connection.readyState}`
        );
      }

      // Perform the operation
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(
        `Database operation attempt ${attempt} failed:`,
        error.message
      );

      // If it's the last attempt, throw the error
      if (attempt === maxRetries) {
        throw new Error(
          `Database operation failed after ${maxRetries} attempts: ${error.message}`
        );
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
    }
  }

  throw lastError;
};

/**
 * Wrapper for Mongoose operations with automatic connection handling
 * @param {Function} operation - The Mongoose operation to perform
 * @returns {Promise} - Result of the operation
 */
export const safeDbOperation = async (operation) => {
  return withDatabaseConnection(operation, 2, 500);
};
