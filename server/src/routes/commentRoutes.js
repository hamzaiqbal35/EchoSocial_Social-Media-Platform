const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// Get post comments
router.get('/post/:postId', commentController.getPostComments);

// Create comment (protected)
router.post('/post/:postId', auth, commentController.createComment);

// Delete comment (protected)
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router;
