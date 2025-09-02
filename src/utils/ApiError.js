class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
    this.path = null; // Will be set by error handler
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Method to convert error to JSON format
  toJSON() {
    return {
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
      data: this.data,
      errors: this.errors,
      timestamp: this.timestamp,
      path: this.path,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
    };
  }

  // Static method to create common error types
  static badRequest(message = "Bad Request", errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized", errors = []) {
    return new ApiError(401, message, errors);
  }

  static forbidden(message = "Forbidden", errors = []) {
    return new ApiError(403, message, errors);
  }

  static notFound(message = "Not Found", errors = []) {
    return new ApiError(404, message, errors);
  }

  static conflict(message = "Conflict", errors = []) {
    return new ApiError(409, message, errors);
  }

  static unprocessableEntity(message = "Unprocessable Entity", errors = []) {
    return new ApiError(422, message, errors);
  }

  static tooManyRequests(message = "Too Many Requests", errors = []) {
    return new ApiError(429, message, errors);
  }

  static internalServerError(message = "Internal Server Error", errors = []) {
    return new ApiError(500, message, errors);
  }

  static serviceUnavailable(message = "Service Unavailable", errors = []) {
    return new ApiError(503, message, errors);
  }
}

export { ApiError };
