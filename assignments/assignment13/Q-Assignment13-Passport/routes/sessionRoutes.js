// Import Express router, Passport, and session controllers
const express = require("express");
const passport = require("passport");
const router = express.Router();

// Import session controller functions
const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} = require("../controllers/sessionController");

// Registration routes - GET shows form, POST processes registration
router.route("/register").get(registerShow).post(registerDo);
// Login routes - GET shows form, POST authenticates with Passport
router
  .route("/logon")
  .get(logonShow)
  .post(
    // Use Passport local strategy for authentication
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    })
  );
// Logout route - POST destroys session
router.route("/logoff").post(logoff);

// Export session routes
module.exports = router;