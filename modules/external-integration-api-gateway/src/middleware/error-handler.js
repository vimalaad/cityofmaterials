/**
 * Global Error Handler Middleware
 * 
 * Standardizes error responses for the API gateway.
 * All errors are returned as JSON with:
 * - error: human-readable message
 * - (optional) retryAfter: seconds to wait for rate-limit errors
 * - (optional) details: additional context in development
 * 
 * Usage:
 *   app.use(errorHandler);
 */

// TODO: Implement error handler middleware

module.exports = function errorHandler(err, req, res, next) {
  // Default to 500 Internal Server Error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    error: message,
    ...(err.retryAfter && { retryAfter: err.retryAfter })
  });
};
