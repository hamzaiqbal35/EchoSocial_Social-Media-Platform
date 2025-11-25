const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        // Verify token
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Token verification failed, authorization denied' });
        }

        // Find user
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error in authentication' });
    }
};

module.exports = auth;
