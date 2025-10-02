const express = require('express');
const router = express.Router();
const { showLogin, showRegister, register, login, logout } = require('../controllers/authController');
const { redirectIfAuth } = require('../middleware/auth');

router.get('/login', redirectIfAuth, showLogin);
router.post('/login', redirectIfAuth, login);
router.get('/register', redirectIfAuth, showRegister);
router.post('/register', redirectIfAuth, register);
router.get('/logout', logout);

module.exports = router;