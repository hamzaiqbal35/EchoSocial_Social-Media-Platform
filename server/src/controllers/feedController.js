const Post = require('../models/Post');
const User = require('../models/User');

// Get personalized feed
exports.getFeed = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const currentUser = await User.findById(req.user._id);

        // Get users who have blocked the current user
        const usersWhoBlockedMe = await User.find({
            blockedUsers: currentUser._id
        }).select('_id');

        const blockedByIds = usersWhoBlockedMe.map(u => u._id);

        // Combine blocked users: users I blocked + users who blocked me
        const allBlockedUserIds = [
            ...currentUser.blockedUsers,
            ...blockedByIds
        ];

        // Get posts excluding blocked users
        const posts = await Post.find({
            author: { $nin: allBlockedUserIds }
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'username avatar')
            .populate('likes', 'username');

        const total = await Post.countDocuments({
            author: { $nin: allBlockedUserIds }
        });

        res.json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
