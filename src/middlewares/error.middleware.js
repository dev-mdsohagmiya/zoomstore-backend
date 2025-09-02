import { ApiError } from "../utils/ApiError.js";

// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If it's not an ApiError, convert it to one
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error.errors || []);
  }

  // Set the path for the error
  error.path = req.originalUrl;

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
  }

  // Send error response
  res.status(error.statusCode).json(error.toJSON());
};

// Handle 404 errors
export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
};

// Handle async errors
export const asyncErrorHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
