/**
 * Middleware to store user context and flash messages in res.locals
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @description Makes user object and flash messages available to all EJS templates
 */
const storeLocals = (req, res, next) => {
  // Store user object for template access
  if (req.user) {
    res.locals.user = req.user;
  } else {
    res.locals.user = null;
  }
  // Store flash messages for template display
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");
  next();
};

// Export store locals middleware
module.exports = storeLocals;