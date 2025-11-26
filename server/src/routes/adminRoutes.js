const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// All routes require both authentication and admin role
router.use(auth);
router.use(adminAuth);

// Statistics
router.get('/stats', adminController.getStats);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/ban', adminController.banUser);
router.put('/users/:id/unban', adminController.unbanUser);

// Post management
router.get('/posts', adminController.getAllPosts);
router.delete('/posts/:id', adminController.deletePost);

// Reports management
router.get('/reports', adminController.getReports);
router.put('/reports/:id/resolve', adminController.resolveReport);

module.exports = router;
