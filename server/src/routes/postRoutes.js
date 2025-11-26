const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Search posts (public)
router.get('/search', postController.searchPosts);

// Get all posts (public)
router.get('/', postController.getAllPosts);

// Get single post (public)
router.get('/:id', postController.getPost);

// Create post (protected)
router.post('/', auth, upload.single('image'), postController.createPost);

// Update post (protected)
router.put('/:id', auth, upload.single('image'), postController.updatePost);

// Delete post (protected)
router.delete('/:id', auth, postController.deletePost);

// Like/unlike post (protected)
router.post('/:id/like', auth, postController.likePost);
router.delete('/:id/like', auth, postController.unlikePost);

// Get user's posts
router.get('/user/:userId', postController.getUserPosts);

module.exports = router;
