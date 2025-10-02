const User = require('../models/User');

const showLogin = (req, res) => {
  res.render('login');
};

const showRegister = (req, res) => {
  res.render('register');
};

const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    req.session.userId = user._id;
    req.flash('info', 'Registration successful! Welcome!');
    res.redirect('/jobs');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/register');
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/login');
    }
    
    req.session.userId = user._id;
    req.flash('info', 'Login successful!');
    res.redirect('/jobs');
  } catch (error) {
    req.flash('error', 'Login failed');
    res.redirect('/login');
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      req.flash('error', 'Logout failed');
      return res.redirect('/jobs');
    }
    res.redirect('/login');
  });
};

module.exports = { showLogin, showRegister, register, login, logout };