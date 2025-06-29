const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Companion = require('../models/Companion');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/companions
// @desc    Get all companions with filters
// @access  Public
router.get('/', optionalAuth, [
    query('city').optional().trim(),
    query('vibeTags').optional().isArray(),
    query('minRate').optional().isNumeric(),
    query('maxRate').optional().isNumeric(),
    query('rating').optional().isNumeric(),
    query('page').optional().isNumeric(),
    query('limit').optional().isNumeric()
], async (req, res) => {
    try {
        const {
            city,
            vibeTags,
            minRate,
            maxRate,
            rating,
            page = 1,
            limit = 12
        } = req.query;

        // Build filter object
        const filter = { isActive: true, isVerified: true };
        
        if (city) {
            filter['location.city'] = { $regex: city, $options: 'i' };
        }
        
        if (vibeTags && vibeTags.length > 0) {
            filter.vibeTags = { $in: vibeTags };
        }
        
        if (minRate || maxRate) {
            filter.hourlyRate = {};
            if (minRate) filter.hourlyRate.$gte = parseInt(minRate);
            if (maxRate) filter.hourlyRate.$lte = parseInt(maxRate);
        }
        
        if (rating) {
            filter['rating.average'] = { $gte: parseFloat(rating) };
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Get companions with user details
        const companions = await Companion.find(filter)
            .populate('user', 'name avatar bio interests')
            .sort({ 'rating.average': -1, totalBookings: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Companion.countDocuments(filter);

        // Format response
        const formattedCompanions = companions.map(companion => ({
            id: companion._id,
            displayName: companion.displayName,
            tagline: companion.tagline,
            description: companion.description,
            vibeTags: companion.vibeTags,
            hourlyRate: companion.hourlyRate,
            formattedRate: companion.formattedRate,
            images: companion.images,
            location: companion.location,
            rating: companion.rating,
            totalBookings: companion.totalBookings,
            specializations: companion.specializations,
            languages: companion.languages,
            age: companion.age,
            gender: companion.gender,
            user: {
                id: companion.user._id,
                name: companion.user.name,
                avatar: companion.user.avatar,
                bio: companion.user.bio,
                interests: companion.user.interests
            }
        }));

        res.json({
            success: true,
            data: {
                companions: formattedCompanions,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalCompanions: total,
                    hasNextPage: skip + companions.length < total,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Get companions error:', error);
        res.status(500).json({
            error: 'Failed to fetch companions! 😅',
            message: 'Something went wrong while fetching companions.'
        });
    }
});

// @route   GET /api/companions/:id
// @desc    Get companion by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const companion = await Companion.findById(req.params.id)
            .populate('user', 'name avatar bio interests')
            .populate({
                path: 'user',
                select: 'name avatar bio interests'
            });

        if (!companion) {
            return res.status(404).json({
                error: 'Companion not found! 👤',
                message: 'The companion you\'re looking for doesn\'t exist.'
            });
        }

        if (!companion.isActive) {
            return res.status(404).json({
                error: 'Companion unavailable! ⏸️',
                message: 'This companion is currently not available.'
            });
        }

        // Format response
        const formattedCompanion = {
            id: companion._id,
            displayName: companion.displayName,
            tagline: companion.tagline,
            description: companion.description,
            vibeTags: companion.vibeTags,
            hourlyRate: companion.hourlyRate,
            formattedRate: companion.formattedRate,
            images: companion.images,
            availability: companion.availability,
            location: companion.location,
            rating: companion.rating,
            totalBookings: companion.totalBookings,
            specializations: companion.specializations,
            languages: companion.languages,
            age: companion.age,
            gender: companion.gender,
            isVerified: companion.isVerified,
            user: {
                id: companion.user._id,
                name: companion.user.name,
                avatar: companion.user.avatar,
                bio: companion.user.bio,
                interests: companion.user.interests
            }
        };

        res.json({
            success: true,
            data: {
                companion: formattedCompanion
            }
        });

    } catch (error) {
        console.error('Get companion error:', error);
        
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                error: 'Invalid companion ID! 🔍',
                message: 'The companion ID you provided is not valid.'
            });
        }

        res.status(500).json({
            error: 'Failed to fetch companion! 😅',
            message: 'Something went wrong while fetching companion details.'
        });
    }
});

// @route   POST /api/companions
// @desc    Create companion profile
// @access  Private
router.post('/', auth, [
    body('displayName')
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('Display name must be between 2 and 30 characters! ✨'),
    body('tagline')
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Tagline must be between 5 and 100 characters! 💭'),
    body('description')
        .trim()
        .isLength({ min: 20, max: 500 })
        .withMessage('Description must be between 20 and 500 characters! 📝'),
    body('vibeTags')
        .isArray({ min: 1, max: 5 })
        .withMessage('Please select 1-5 vibe tags! 🏷️'),
    body('hourlyRate')
        .isNumeric()
        .isInt({ min: 100, max: 5000 })
        .withMessage('Hourly rate must be between ₹100 and ₹5000! 💰'),
    body('city')
        .trim()
        .notEmpty()
        .withMessage('City is required! 🏙️'),
    body('age')
        .isInt({ min: 18, max: 65 })
        .withMessage('Age must be between 18 and 65! 🎂'),
    body('gender')
        .isIn(['Male', 'Female', 'Non-binary', 'Prefer not to say'])
        .withMessage('Please select a valid gender! 👤')
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

        // Check if user already has a companion profile
        const existingCompanion = await Companion.findOne({ user: req.user._id });
        if (existingCompanion) {
            return res.status(400).json({
                error: 'Profile already exists! 👤',
                message: 'You already have a companion profile. You can update it instead.'
            });
        }

        const {
            displayName,
            tagline,
            description,
            vibeTags,
            hourlyRate,
            images,
            availability,
            city,
            area,
            specializations,
            languages,
            age,
            gender
        } = req.body;

        // Create companion profile
        const companion = new Companion({
            user: req.user._id,
            displayName,
            tagline,
            description,
            vibeTags,
            hourlyRate,
            images: images || [],
            availability: availability || {},
            location: {
                city,
                area,
                coordinates: req.body.coordinates
            },
            specializations: specializations || [],
            languages: languages || ['English'],
            age,
            gender
        });

        await companion.save();

        // Update user to mark as companion
        await User.findByIdAndUpdate(req.user._id, {
            isCompanion: true
        });

        res.status(201).json({
            success: true,
            message: 'Companion profile created successfully! 🎉',
            data: {
                companion: {
                    id: companion._id,
                    displayName: companion.displayName,
                    tagline: companion.tagline,
                    vibeTags: companion.vibeTags,
                    hourlyRate: companion.hourlyRate,
                    formattedRate: companion.formattedRate,
                    location: companion.location,
                    isVerified: companion.isVerified
                }
            }
        });

    } catch (error) {
        console.error('Create companion error:', error);
        res.status(500).json({
            error: 'Profile creation failed! 😅',
            message: 'Something went wrong while creating your companion profile.'
        });
    }
});

// @route   GET /api/companions/search/suggestions
// @desc    Get search suggestions
// @access  Public
router.get('/search/suggestions', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.length < 2) {
            return res.json({
                success: true,
                data: {
                    cities: [],
                    vibeTags: []
                }
            });
        }

        // Get city suggestions
        const cities = await Companion.distinct('location.city', {
            'location.city': { $regex: q, $options: 'i' },
            isActive: true
        });

        // Get vibe tag suggestions
        const vibeTags = await Companion.distinct('vibeTags', {
            vibeTags: { $regex: q, $options: 'i' },
            isActive: true
        });

        res.json({
            success: true,
            data: {
                cities: cities.slice(0, 5),
                vibeTags: vibeTags.slice(0, 5)
            }
        });

    } catch (error) {
        console.error('Search suggestions error:', error);
        res.status(500).json({
            error: 'Search failed! 😅',
            message: 'Something went wrong while searching.'
        });
    }
});

module.exports = router; 