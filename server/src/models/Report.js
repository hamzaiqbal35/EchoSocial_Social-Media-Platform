const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reportedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    reason: {
        type: String,
        required: [true, 'Reason is required'],
        enum: ['spam', 'harassment', 'inappropriate', 'violence', 'hate_speech', 'misinformation', 'other']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'dismissed'],
        default: 'pending'
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolvedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Ensure either reportedUser or reportedPost is provided
reportSchema.pre('save', function (next) {
    if (!this.reportedUser && !this.reportedPost) {
        next(new Error('Either reportedUser or reportedPost must be provided'));
    }
    next();
});

module.exports = mongoose.model('Report', reportSchema);
