/**
 * Parse Mongoose validation errors into flash messages
 * @param {Object} e - Mongoose validation error object
 * @param {Object} req - Express request object
 * @description Converts Mongoose validation errors into user-friendly flash messages
 */
const parseValidationErrors = (e, req) => {
  // Get all error field names
  const keys = Object.keys(e.errors);
  // Create flash message for each validation error
  keys.forEach((key) => {
    req.flash("error", key + ": " + e.errors[key].properties.message);
  });
};

// Export validation error parser
module.exports = parseValidationErrors;