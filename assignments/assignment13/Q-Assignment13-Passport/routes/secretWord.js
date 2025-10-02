// Import Express router for secret word functionality
const express = require("express");
const router = express.Router();

/**
 * Display secret word page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description Shows current secret word and form to change it
 */
router.get("/", (req, res) => {
  // Initialize secret word if not set
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }

  res.render("secretWord", { secretWord: req.session.secretWord });
});

/**
 * Process secret word update
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description Validates and updates secret word, provides user feedback
 */
router.post("/", (req, res) => {
  // Validate secret word (no words starting with 'P')
  if (req.body.secretWord.toUpperCase()[0] == "P") {
    req.flash("error", "That word won't work!");
    req.flash("error", "You can't use words that start with p.");
  } else {
    // Update secret word in session
    req.session.secretWord = req.body.secretWord;
    req.flash("info", "The secret word was changed.");
  }

  // Redirect to show updated page
  res.redirect("/secretWord");
});

// Export secret word routes
module.exports = router;