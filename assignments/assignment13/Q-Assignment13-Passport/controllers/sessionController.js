// Import User model and validation error parser
const User = require("../models/User");
const parseVErr = require("../utils/parseValidationErr");

/**
 * Display registration form
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description Renders the registration page for new users
 */
const registerShow = (req, res) => {
  res.render("register");
};

/**
 * Process user registration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @description Validates passwords match, creates new user, handles validation errors
 */
const registerDo = async (req, res, next) => {
  // Check if passwords match
  if (req.body.password != req.body.password1) {
    req.flash("error", "The passwords entered do not match.");
    return res.render("register");
  }
  try {
    // Create new user in database
    await User.create(req.body);
  } catch (e) {
    // Handle different types of errors
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      return next(e);
    }
    return res.render("register");
  }
  // Redirect to home page on successful registration
  res.redirect("/");
};

/**
 * Log out user by destroying session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description Destroys user session and redirects to home page
 */
const logoff = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

/**
 * Display login form
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description Shows login page or redirects if user already authenticated
 */
const logonShow = (req, res) => {
  // Redirect authenticated users away from login page
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon");
};

// Export all session controller functions
module.exports = {
  registerShow,
  registerDo,
  logoff,
  logonShow,
};