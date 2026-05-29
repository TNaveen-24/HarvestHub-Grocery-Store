const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error("Error:", err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    let field = Object.keys(err.keyValue)[0];
    let value = err.keyValue[field];

    // Custom messages for specific fields
    let message;
    switch (field) {
      case "email":
        message = "An account with this email already exists";
        break;
      case "phone":
        message = "An account with this phone number already exists";
        break;
      case "sku":
        message = "A product with this SKU already exists";
        break;
      default:
        message = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`;
    }

    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = { message, statusCode: 401 };
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = { message, statusCode: 401 };
  }

  // Multer file upload errors
  if (err.code === "LIMIT_FILE_SIZE") {
    const message = "File size too large";
    error = { message, statusCode: 400 };
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    const message = "Too many files uploaded";
    error = { message, statusCode: 400 };
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    const message = "Unexpected file field";
    error = { message, statusCode: 400 };
  }

  // Payment errors (Stripe)
  if (err.type === "StripeCardError") {
    const message = err.message || "Payment failed";
    error = { message, statusCode: 400 };
  }

  if (err.type === "StripeInvalidRequestError") {
    const message = "Invalid payment request";
    error = { message, statusCode: 400 };
  }

  // Rate limiting errors
  if (err.status === 429) {
    const message = "Too many requests, please try again later";
    error = { message, statusCode: 429 };
  }

  // Database connection errors
  if (
    err.name === "MongoNetworkError" ||
    err.name === "MongooseServerSelectionError"
  ) {
    const message = "Database connection error, please try again";
    error = { message, statusCode: 503 };
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  // Don't leak error details in production
  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      error: err,
      stack: err.stack,
    }),
  };

  // Log specific errors for monitoring
  if (statusCode >= 500) {
    console.error("Server Error:", {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
