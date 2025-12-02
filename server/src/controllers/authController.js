const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

// Register new user
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
                followers: user.followers,
                following: user.following
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user is banned
        if (user.bannedUntil && new Date(user.bannedUntil) > new Date()) {
            return res.status(403).json({
                message: `Your account has been banned until ${new Date(user.bannedUntil).toLocaleDateString()}. Reason: ${user.bannedReason || 'Violation of terms'}`
            });
        }

        // Check if user is active
        if (user.isActive === false) {
            return res.status(403).json({ message: 'Your account has been deactivated. Please contact support.' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
                followers: user.followers,
                following: user.following
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('followers', 'username avatar')
            .populate('following', 'username avatar');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'There is no user with that email' });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset url
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        // Note: In production, this should point to the frontend URL, e.g.:
        // const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        // For now, assuming frontend handles the route or we just send the token.
        // Actually, let's send the frontend URL.
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const message = `You are receiving this email because you has requested the reset of a password. Please click on the link below to reset your password. This link is valid for 10 minutes only: \n\n ${frontendUrl}/reset-password/${resetToken}`;

        try {
            const sendEmail = require('../utils/sendEmail');
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                message
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.log(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const crypto = require('crypto');
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        // Generate new token
        const { generateToken } = require('../utils/jwt');
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
                followers: user.followers,
                following: user.following
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
