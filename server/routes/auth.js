const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters! ✨'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email address! 📧'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long! 🔐'),
    body('phone')
        .optional()
        .matches(/^[0-9]{10}$/)
        .withMessage('Please enter a valid 10-digit phone number! 📱')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed! ❌',
                message: 'Please check your input and try again.',
                details: errors.array()
            });
        }

        const { name, email, password, phone, bio, interests } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists! 👤',
                message: 'An account with this email already exists. Please log in instead.'
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            phone,
            bio,
            interests: interests || []
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Account created successfully! 🎉',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    isCompanion: user.isCompanion
                },
                token
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                error: 'Duplicate field! 🔄',
                message: 'An account with this email already exists.'
            });
        }

        res.status(500).json({
            error: 'Registration failed! 😅',
            message: 'Something went wrong while creating your account. Please try again.'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email address! 📧'),
    body('password')
        .notEmpty()
        .withMessage('Password is required! 🔐')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed! ❌',
                message: 'Please check your input and try again.',
                details: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials! ❌',
                message: 'Email or password is incorrect. Please try again.'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid credentials! ❌',
                message: 'Email or password is incorrect. Please try again.'
            });
        }

        // Update last active
        user.lastActive = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful! 🎉',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    isCompanion: user.isCompanion,
                    bio: user.bio,
                    interests: user.interests
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Login failed! 😅',
            message: 'Something went wrong while logging in. Please try again.'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    bio: user.bio,
                    interests: user.interests,
                    isCompanion: user.isCompanion,
                    rating: user.rating,
                    totalBookings: user.totalBookings,
                    createdAt: user.createdAt
                }
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            error: 'Failed to get profile! 😅',
            message: 'Something went wrong while fetching your profile.'
        });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters! ✨'),
    body('bio')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Bio cannot be more than 200 characters! 📝'),
    body('phone')
        .optional()
        .matches(/^[0-9]{10}$/)
        .withMessage('Please enter a valid 10-digit phone number! 📱')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed! ❌',
                message: 'Please check your input and try again.',
                details: errors.array()
            });
        }

        const { name, bio, phone, interests, avatar } = req.body;
        const updateFields = {};

        if (name) updateFields.name = name;
        if (bio !== undefined) updateFields.bio = bio;
        if (phone) updateFields.phone = phone;
        if (interests) updateFields.interests = interests;
        if (avatar) updateFields.avatar = avatar;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateFields,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Profile updated successfully! ✨',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    bio: user.bio,
                    interests: user.interests,
                    isCompanion: user.isCompanion
                }
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            error: 'Profile update failed! 😅',
            message: 'Something went wrong while updating your profile.'
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, async (req, res) => {
    try {
        // Update last active time
        await User.findByIdAndUpdate(req.user._id, {
            lastActive: new Date()
        });

        res.json({
            success: true,
            message: 'Logged out successfully! 👋'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            error: 'Logout failed! 😅',
            message: 'Something went wrong while logging out.'
        });
    }
});

module.exports = router; 