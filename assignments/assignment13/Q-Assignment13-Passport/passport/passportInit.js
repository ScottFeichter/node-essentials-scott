// Import Passport modules and User model
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

/**
 * Initialize Passport authentication strategies and session handling
 * @description Configures local strategy for email/password authentication and session serialization
 */
const passportInit = () => {
  // Configure local authentication strategy
  passport.use(
    "local",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          // Find user by email
          const user = await User.findOne({ email: email });
          if (!user) {
            return done(null, false, { message: "Incorrect credentials." });
          }

          // Verify password
          const result = await user.comparePassword(password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect credentials." });
          }
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  /**
   * Serialize user for session storage
   * @param {Object} user - User object from database
   * @param {Function} done - Callback function
   * @description Stores only user ID in session to minimize session data
   */
  passport.serializeUser(async function (user, done) {
    done(null, user.id);
  });

  /**
   * Deserialize user from session
   * @param {string} id - User ID from session
   * @param {Function} done - Callback function
   * @description Retrieves full user object from database using stored ID
   */
  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(new Error("user not found"));
      }
      return done(null, user);
    } catch (e) {
      done(e);
    }
  });
};

// Export Passport initialization function
module.exports = passportInit;