const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validation/userValidation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', authenticateToken, logout);

module.exports = router;