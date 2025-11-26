const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Search users
router.get('/search', userController.searchUsers);

// Get suggested users (protected)
router.get('/suggested', auth, userController.getSuggestedUsers);

// Get user profile
router.get('/:id', userController.getUserProfile);

// Update profile (protected)
router.put('/profile', auth, userController.updateProfile);

// Follow/unfollow user (protected)
router.post('/:id/follow', auth, userController.followUser);
router.delete('/:id/follow', auth, userController.unfollowUser);

// Get followers/following
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);

// Block/unblock user (protected)
router.post('/:id/block', auth, userController.blockUser);
router.delete('/:id/block', auth, userController.unblockUser);

// Report user or post (protected)
router.post('/report', auth, userController.createReport);

module.exports = router;
