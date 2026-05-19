const express = require('express');
const { registerUser, loginUser, forgotPassword } = require('../controllers/authController');
const router = express.Router();

// Make sure all functions are properly imported
console.log('Auth Controller Functions:', { registerUser, loginUser, forgotPassword });

// Define routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

module.exports = router;