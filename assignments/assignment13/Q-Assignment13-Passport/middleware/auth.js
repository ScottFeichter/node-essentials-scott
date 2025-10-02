/**
 * Authentication middleware to protect routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @description Checks if user is authenticated, redirects to home if not, allows access if authenticated
 */
const authMiddleware = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) {
    req.flash("error", "You can't access that page before logon.");
    res.redirect("/");
  } else {
    // User is authenticated, proceed to next middleware
    next();
  }
};

// Export authentication middleware
module.exports = authMiddleware;