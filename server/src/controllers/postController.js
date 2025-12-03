const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

// Get all posts (paginated)
exports.getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'username avatar')
            .populate('likes', 'username');

        const total = await Post.countDocuments();

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

// Get single post
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username avatar bio')
            .populate('likes', 'username avatar');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create post
exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        let media = [];
        let mediaUrl = '';
        let mediaType = '';

        // Handle multiple files
        if (req.files && req.files.length > 0) {
            media = req.files.map(file => ({
                url: `/uploads/${file.filename}`,
                type: file.mimetype.startsWith('video/') ? 'video' : 'image'
            }));

            // Set legacy fields based on the first file
            mediaUrl = media[0].url;
            mediaType = media[0].type;
        } else if (req.body.image) {
            // Handle legacy/base64 image (single only)
            mediaUrl = req.body.image;
            mediaType = 'image';
            media = [{ url: mediaUrl, type: 'image' }];
        }

        if (!content && media.length === 0) {
            return res.status(400).json({ message: 'Post content or media is required' });
        }

        const post = await Post.create({
            author: req.user._id,
            content: content || '',
            image: mediaType === 'image' ? mediaUrl : '', // Backward compatibility
            mediaUrl,
            mediaType,
            media
        });

        // Notify followers
        const user = await User.findById(req.user._id).select('followers');
        if (user.followers && user.followers.length > 0) {
            const notifications = user.followers.map(followerId => ({
                user: followerId,
                type: 'post',
                actor: req.user._id,
                post: post._id
            }));
            await Notification.insertMany(notifications);
        }

        const populatedPost = await Post.findById(post._id)
            .populate('author', 'username avatar');

        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update post
exports.updatePost = async (req, res) => {
    try {
        const { content, image } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        if (content !== undefined) post.content = content;

        if (req.files && req.files.length > 0) {
            // If new files are uploaded, replace existing media
            const media = req.files.map(file => ({
                url: `/uploads/${file.filename}`,
                type: file.mimetype.startsWith('video/') ? 'video' : 'image'
            }));

            post.media = media;

            // Update legacy fields with first item
            post.mediaUrl = media[0].url;
            post.mediaType = media[0].type;
            post.image = media[0].type === 'image' ? media[0].url : '';

        } else if (image !== undefined) {
            // If image is explicitly sent (e.g. clearing it or base64)
            // Note: This logic might need refinement if we want to support clearing specific media items
            // For now, assuming this is mostly for clearing or single image updates from legacy clients
            post.image = image;
            post.mediaUrl = image;
            post.mediaType = image ? 'image' : '';
            post.media = image ? [{ url: image, type: 'image' }] : [];
        }

        await post.save();

        const updatedPost = await Post.findById(post._id)
            .populate('author', 'username avatar');

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        // Delete associated comments
        await Comment.deleteMany({ post: post._id });

        // Delete associated notifications
        await Notification.deleteMany({ post: post._id });

        await post.deleteOne();

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Like post
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if already liked
        if (post.likes.includes(req.user._id)) {
            return res.status(400).json({ message: 'Post already liked' });
        }

        post.likes.push(req.user._id);
        await post.save();

        // Create notification (don't notify if liking own post)
        if (post.author.toString() !== req.user._id.toString()) {
            await Notification.create({
                user: post.author,
                type: 'like',
                actor: req.user._id,
                post: post._id
            });
        }

        const updatedPost = await Post.findById(post._id)
            .populate('author', 'username avatar')
            .populate('likes', 'username');

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Unlike post
exports.unlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if liked
        if (!post.likes.includes(req.user._id)) {
            return res.status(400).json({ message: 'Post not liked yet' });
        }

        post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
        await post.save();

        const updatedPost = await Post.findById(post._id)
            .populate('author', 'username avatar')
            .populate('likes', 'username');

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's posts
exports.getUserPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ author: req.params.userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'username avatar')
            .populate('likes', 'username');

        const total = await Post.countDocuments({ author: req.params.userId });

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

// Search posts
exports.searchPosts = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        const posts = await Post.find({
            content: { $regex: query, $options: 'i' }
        })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('author', 'username avatar');

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Share post with other users
exports.sharePost = async (req, res) => {
    try {
        const { userIds } = req.body;
        const postId = req.params.id;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: 'Please select at least one user to share with' });
        }

        // Verify post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create notifications for all selected users
        const notifications = userIds.map(userId => ({
            user: userId,
            type: 'share',
            actor: req.user._id,
            post: postId
        }));

        await Notification.insertMany(notifications);

        res.json({ message: 'Post shared successfully', sharedWith: userIds.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
