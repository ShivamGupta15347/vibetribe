const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                error: 'Access denied! 🔐',
                message: 'No token provided. Please log in to continue.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                error: 'Invalid token! 🚫',
                message: 'User not found. Please log in again.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Invalid token! 🚫',
                message: 'Token is invalid. Please log in again.'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired! ⏰',
                message: 'Your session has expired. Please log in again.'
            });
        }

        console.error('Auth middleware error:', error);
        res.status(500).json({
            error: 'Authentication error! 😅',
            message: 'Something went wrong with authentication.'
        });
    }
};

// Optional auth middleware for routes that can work with or without auth
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            if (user) {
                req.user = user;
            }
        }
        
        next();
    } catch (error) {
        // Continue without authentication if token is invalid
        next();
    }
};

// Middleware to check if user is a companion
const isCompanion = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required! 🔐',
                message: 'Please log in to access this feature.'
            });
        }

        // Check if user has a companion profile
        const Companion = require('../models/Companion');
        const companion = await Companion.findOne({ user: req.user._id });
        
        if (!companion) {
            return res.status(403).json({
                error: 'Companion access required! 👤',
                message: 'This feature is only available for verified companions.'
            });
        }

        req.companion = companion;
        next();
    } catch (error) {
        console.error('Companion check error:', error);
        res.status(500).json({
            error: 'Authorization error! 😅',
            message: 'Something went wrong with authorization.'
        });
    }
};

// Middleware to check if user is admin (for future admin features)
const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required! 🔐',
                message: 'Please log in to access this feature.'
            });
        }

        // For now, we'll use a simple email check for admin
        // In production, you'd want a proper admin field in the user model
        if (req.user.email !== 'admin@vibetribe.in') {
            return res.status(403).json({
                error: 'Admin access required! 👑',
                message: 'This feature is only available for administrators.'
            });
        }

        next();
    } catch (error) {
        console.error('Admin check error:', error);
        res.status(500).json({
            error: 'Authorization error! 😅',
            message: 'Something went wrong with authorization.'
        });
    }
};

module.exports = { auth, optionalAuth, isCompanion, isAdmin }; 