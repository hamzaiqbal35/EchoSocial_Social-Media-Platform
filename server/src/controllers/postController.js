const Post = require('../models/Post');
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
        let image = '';

        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            // Handle case where image might still be sent as base64 or url (optional fallback)
            image = req.body.image;
        }

        if (!content && !image) {
            return res.status(400).json({ message: 'Post content or image is required' });
        }

        const post = await Post.create({
            author: req.user._id,
            content: content || '',
            image: image
        });

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
        if (req.file) {
            post.image = `/uploads/${req.file.filename}`;
        } else if (image !== undefined) {
            post.image = image;
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
