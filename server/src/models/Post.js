const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Post content is required'],
        maxlength: [500, 'Post cannot exceed 500 characters']
    },
    image: {
        type: String,
        default: ''
    },
    mediaUrl: {
        type: String,
        default: ''
    },
    mediaType: {
        type: String,
        enum: ['image', 'video', ''],
        default: ''
    },
    media: [{
        url: String,
        type: {
            type: String,
            enum: ['image', 'video']
        }
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
postSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Post', postSchema);
