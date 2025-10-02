// Import required modules for user model
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define User schema with validation rules
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6
  }
});

/**
 * Pre-save middleware to hash password before saving to database
 * @description Automatically hashes password using bcrypt when user is created or password is modified
 */
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compare provided password with stored hashed password
 * @param {string} candidatePassword - Plain text password to verify
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 * @description Uses bcrypt to safely compare passwords without exposing stored hash
 */
UserSchema.methods.comparePassword = async function(candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

// Export User model for use in other modules
module.exports = mongoose.model('User', UserSchema);