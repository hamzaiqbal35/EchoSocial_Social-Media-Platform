const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// Get post comments
exports.getPostComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .sort({ createdAt: -1 })
            .populate('author', 'username avatar');

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create comment
exports.createComment = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = await Comment.create({
            author: req.user._id,
            post: req.params.postId,
            content
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate('author', 'username avatar');

        // Create notification (don't notify if commenting on own post)
        if (post.author.toString() !== req.user._id.toString()) {
            await Notification.create({
                user: post.author,
                type: 'comment',
                actor: req.user._id,
                post: post._id
            });
        }

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete comment
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user is the author
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
