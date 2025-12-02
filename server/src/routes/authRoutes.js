const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.put('/resetpassword/:resetToken', authController.resetPassword);

// Protected routes
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;
