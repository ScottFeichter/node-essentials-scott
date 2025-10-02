const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  if (!req.session.userId) {
    req.flash('error', 'Please log in to access this page');
    return res.redirect('/login');
  }
  
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy();
      req.flash('error', 'User not found');
      return res.redirect('/login');
    }
    req.user = user;
    next();
  } catch (error) {
    req.flash('error', 'Authentication failed');
    res.redirect('/login');
  }
};

const redirectIfAuth = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/jobs');
  }
  next();
};

module.exports = { requireAuth, redirectIfAuth };