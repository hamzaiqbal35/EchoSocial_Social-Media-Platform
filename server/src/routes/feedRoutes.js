const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const auth = require('../middleware/auth');

// Get personalized feed (protected)
router.get('/', auth, feedController.getFeed);

module.exports = router;
