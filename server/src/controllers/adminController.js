const User = require('../models/User');
const Post = require('../models/Post');
const Report = require('../models/Report');

// Get platform statistics
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        const pendingReports = await Report.countDocuments({ status: 'pending' });
        const bannedUsers = await User.countDocuments({ isActive: false });

        // Get date range from query
        const { range, startDate, endDate } = req.query;
        let start = new Date();
        let end = new Date();

        if (range === 'custom' && startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);
            // Set end date to end of day
            end.setHours(23, 59, 59, 999);
        } else {
            // Default to 7d if invalid range
            let days = 7;
            switch (range) {
                case '30d': days = 30; break;
                case '90d': days = 90; break;
                case '6m': days = 180; break;
                case '1y': days = 365; break;
                default: days = 7;
            }
            start.setDate(start.getDate() - days);
        }

        const userGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const postActivity = await Post.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Fill in missing days with 0
        const fillMissingDays = (data, start, end) => {
            const result = [];
            const current = new Date(start);
            const last = new Date(end);

            while (current <= last) {
                const dateString = current.toISOString().split('T')[0];
                const found = data.find(item => item._id === dateString);
                result.push({
                    date: dateString,
                    count: found ? found.count : 0
                });
                current.setDate(current.getDate() + 1);
            }
            return result;
        };

        res.json({
            totalUsers,
            totalPosts,
            pendingReports,
            bannedUsers,
            userGrowth: fillMissingDays(userGrowth, start, end),
            postActivity: fillMissingDays(postActivity, start, end)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users with pagination and filters
exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';
        const filter = req.query.filter || 'all'; // all, active, banned

        let query = {};

        if (search) {
            query.username = { $regex: search, $options: 'i' };
        }

        if (filter === 'active') {
            query.isActive = true;
        } else if (filter === 'banned') {
            query.isActive = false;
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);

        res.json({
            users,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalUsers: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ban user
exports.banUser = async (req, res) => {
    try {
        const { reason, duration } = req.body; // duration in days, null for permanent
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot ban admin users' });
        }

        user.isActive = false;
        user.bannedReason = reason || 'Violated community guidelines';

        if (duration) {
            user.bannedUntil = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
        }

        await user.save();

        res.json({ message: 'User banned successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Unban user
exports.unbanUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = true;
        user.bannedUntil = null;
        user.bannedReason = '';

        await user.save();

        res.json({ message: 'User unbanned successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all posts with pagination
exports.getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'username avatar');

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

// Admin delete post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await post.deleteOne();

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all reports
exports.getReports = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status || 'all'; // all, pending, resolved, dismissed

        let query = {};
        if (status !== 'all') {
            query.status = status;
        }

        const reports = await Report.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('reporter', 'username avatar')
            .populate('reportedUser', 'username avatar')
            .populate('reportedPost', 'content')
            .populate('resolvedBy', 'username');

        const total = await Report.countDocuments(query);

        res.json({
            reports,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalReports: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Resolve report
exports.resolveReport = async (req, res) => {
    try {
        const { status } = req.body; // 'resolved' or 'dismissed'
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        report.status = status;
        report.resolvedBy = req.user._id;
        report.resolvedAt = new Date();

        await report.save();

        // Create notification for the reporter
        const Notification = require('../models/Notification');
        await Notification.create({
            user: report.reporter,
            type: 'report_status',
            actor: req.user._id, // Admin who resolved it
            report: report._id
        });

        res.json({ message: 'Report updated successfully', report });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
