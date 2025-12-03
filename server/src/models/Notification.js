const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['follow', 'like', 'comment', 'post', 'share', 'report_status'],
        required: true
    },
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        // required removed to allow system notifications
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report'
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
notificationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
