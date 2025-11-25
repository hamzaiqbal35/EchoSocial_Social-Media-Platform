const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// Get user profile
exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        const users = await User.find({
            username: { $regex: query, $options: 'i' }
        })
            .select('username avatar bio')
            .limit(10);

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('followers', 'username avatar')
            .populate('following', 'username avatar');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user's posts count
        const postsCount = await Post.countDocuments({ author: user._id });

        res.json({
            ...user.toJSON(),
            postsCount,
            followersCount: user.followers.length,
            followingCount: user.following.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { bio, avatar } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (bio !== undefined) user.bio = bio;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Follow user
exports.followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userToFollow._id.toString() === currentUser._id.toString()) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        // Check if already following
        if (currentUser.following.includes(userToFollow._id)) {
            return res.status(400).json({ message: 'Already following this user' });
        }

        // Add to following/followers
        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);

        await currentUser.save();
        await userToFollow.save();

        // Create notification
        await Notification.create({
            user: userToFollow._id,
            type: 'follow',
            actor: currentUser._id
        });

        res.json({ message: 'User followed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Unfollow user
exports.unfollowUser = async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if following
        if (!currentUser.following.includes(userToUnfollow._id)) {
            return res.status(400).json({ message: 'You are not following this user' });
        }

        // Remove from following/followers
        currentUser.following = currentUser.following.filter(
            id => id.toString() !== userToUnfollow._id.toString()
        );
        userToUnfollow.followers = userToUnfollow.followers.filter(
            id => id.toString() !== currentUser._id.toString()
        );

        await currentUser.save();
        await userToUnfollow.save();

        res.json({ message: 'User unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's followers
exports.getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('followers', 'username avatar bio');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.followers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's following
exports.getFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('following', 'username avatar bio');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.following);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
