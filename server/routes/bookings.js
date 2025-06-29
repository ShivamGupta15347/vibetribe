const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const Companion = require('../models/Companion');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', auth, [
    body('companionId')
        .isMongoId()
        .withMessage('Valid companion ID is required! 👤'),
    body('date')
        .isISO8601()
        .withMessage('Valid date is required! 📅'),
    body('startTime')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in HH:MM format! 🕐'),
    body('endTime')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('End time must be in HH:MM format! 🕐'),
    body('activity')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Activity description must be between 5 and 200 characters! 🎯'),
    body('location')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Location must be between 5 and 200 characters! 📍'),
    body('specialRequests')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Special requests cannot exceed 500 characters! 📝')
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

        const {
            companionId,
            date,
            startTime,
            endTime,
            activity,
            location,
            specialRequests,
            emergencyContact
        } = req.body;

        // Check if companion exists and is active
        const companion = await Companion.findById(companionId);
        if (!companion) {
            return res.status(404).json({
                error: 'Companion not found! 👤',
                message: 'The companion you\'re trying to book doesn\'t exist.'
            });
        }

        if (!companion.isActive) {
            return res.status(400).json({
                error: 'Companion unavailable! ⏸️',
                message: 'This companion is currently not available for bookings.'
            });
        }

        // Check if user is trying to book themselves
        if (companion.user.toString() === req.user._id.toString()) {
            return res.status(400).json({
                error: 'Cannot book yourself! 🤔',
                message: 'You cannot book yourself as a companion.'
            });
        }

        // Validate booking date (must be in future)
        const bookingDate = new Date(date);
        const now = new Date();
        if (bookingDate <= now) {
            return res.status(400).json({
                error: 'Invalid booking date! ⏰',
                message: 'Booking date must be in the future.'
            });
        }

        // Calculate duration
        const start = new Date(`2000-01-01T${startTime}:00`);
        const end = new Date(`2000-01-01T${endTime}:00`);
        const duration = Math.ceil((end - start) / (1000 * 60 * 60));

        if (duration < 1 || duration > 12) {
            return res.status(400).json({
                error: 'Invalid duration! ⏱️',
                message: 'Booking duration must be between 1 and 12 hours.'
            });
        }

        // Check for conflicting bookings
        const conflictingBooking = await Booking.findOne({
            companion: companionId,
            date: bookingDate,
            status: { $in: ['pending', 'confirmed'] },
            $or: [
                {
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime }
                }
            ]
        });

        if (conflictingBooking) {
            return res.status(400).json({
                error: 'Time slot unavailable! ⏰',
                message: 'This time slot is already booked. Please choose a different time.'
            });
        }

        // Calculate total amount
        const totalAmount = duration * companion.hourlyRate;

        // Create booking
        const booking = new Booking({
            user: req.user._id,
            companion: companionId,
            date: bookingDate,
            startTime,
            endTime,
            duration,
            totalAmount,
            activity,
            location,
            specialRequests,
            emergencyContact,
            isPlatonic: true // Always true for VibeTribe
        });

        await booking.save();

        // Populate companion details for response
        await booking.populate('companion', 'displayName tagline hourlyRate location');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully! 🎉',
            data: {
                booking: {
                    id: booking._id,
                    date: booking.formattedDate,
                    timeRange: booking.timeRange,
                    duration: booking.duration,
                    totalAmount: booking.totalAmount,
                    activity: booking.activity,
                    location: booking.location,
                    status: booking.statusWithEmoji,
                    companion: {
                        id: booking.companion._id,
                        displayName: booking.companion.displayName,
                        tagline: booking.companion.tagline,
                        hourlyRate: booking.companion.hourlyRate,
                        location: booking.companion.location
                    }
                }
            }
        });

    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            error: 'Booking creation failed! 😅',
            message: 'Something went wrong while creating your booking.'
        });
    }
});

// @route   GET /api/bookings/my-bookings
// @desc    Get user's bookings
// @access  Private
router.get('/my-bookings', auth, [
    query('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled', 'rejected']),
    query('page').optional().isNumeric(),
    query('limit').optional().isNumeric()
], async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        // Build filter
        const filter = { user: req.user._id };
        if (status) {
            filter.status = status;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get bookings with companion details
        const bookings = await Booking.find(filter)
            .populate('companion', 'displayName tagline hourlyRate location images')
            .sort({ date: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const total = await Booking.countDocuments(filter);

        // Format response
        const formattedBookings = bookings.map(booking => ({
            id: booking._id,
            date: booking.formattedDate,
            timeRange: booking.timeRange,
            duration: booking.duration,
            totalAmount: booking.totalAmount,
            activity: booking.activity,
            location: booking.location,
            status: booking.status,
            statusWithEmoji: booking.statusWithEmoji,
            paymentStatus: booking.paymentStatus,
            specialRequests: booking.specialRequests,
            companion: {
                id: booking.companion._id,
                displayName: booking.companion.displayName,
                tagline: booking.companion.tagline,
                hourlyRate: booking.companion.hourlyRate,
                location: booking.companion.location,
                images: booking.companion.images
            },
            createdAt: booking.createdAt
        }));

        res.json({
            success: true,
            data: {
                bookings: formattedBookings,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalBookings: total,
                    hasNextPage: skip + bookings.length < total,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            error: 'Failed to fetch bookings! 😅',
            message: 'Something went wrong while fetching your bookings.'
        });
    }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('companion', 'displayName tagline hourlyRate location images user')
            .populate('user', 'name email phone');

        if (!booking) {
            return res.status(404).json({
                error: 'Booking not found! 📋',
                message: 'The booking you\'re looking for doesn\'t exist.'
            });
        }

        // Check if user owns this booking or is the companion
        const isOwner = booking.user._id.toString() === req.user._id.toString();
        const isCompanion = booking.companion.user.toString() === req.user._id.toString();

        if (!isOwner && !isCompanion) {
            return res.status(403).json({
                error: 'Access denied! 🔐',
                message: 'You don\'t have permission to view this booking.'
            });
        }

        res.json({
            success: true,
            data: {
                booking: {
                    id: booking._id,
                    date: booking.formattedDate,
                    timeRange: booking.timeRange,
                    duration: booking.duration,
                    totalAmount: booking.totalAmount,
                    activity: booking.activity,
                    location: booking.location,
                    status: booking.status,
                    statusWithEmoji: booking.statusWithEmoji,
                    paymentStatus: booking.paymentStatus,
                    specialRequests: booking.specialRequests,
                    companionNotes: booking.companionNotes,
                    emergencyContact: booking.emergencyContact,
                    companion: {
                        id: booking.companion._id,
                        displayName: booking.companion.displayName,
                        tagline: booking.companion.tagline,
                        hourlyRate: booking.companion.hourlyRate,
                        location: booking.companion.location,
                        images: booking.companion.images
                    },
                    user: {
                        id: booking.user._id,
                        name: booking.user.name,
                        email: booking.user.email,
                        phone: booking.user.phone
                    },
                    createdAt: booking.createdAt
                }
            }
        });

    } catch (error) {
        console.error('Get booking error:', error);
        
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                error: 'Invalid booking ID! 🔍',
                message: 'The booking ID you provided is not valid.'
            });
        }

        res.status(500).json({
            error: 'Failed to fetch booking! 😅',
            message: 'Something went wrong while fetching booking details.'
        });
    }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put('/:id/status', auth, [
    body('status')
        .isIn(['confirmed', 'cancelled', 'completed', 'rejected'])
        .withMessage('Invalid status! 📊'),
    body('reason')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Reason cannot exceed 200 characters! 📝')
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

        const { status, reason } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                error: 'Booking not found! 📋',
                message: 'The booking you\'re trying to update doesn\'t exist.'
            });
        }

        // Check permissions
        const isOwner = booking.user.toString() === req.user._id.toString();
        const isCompanion = booking.companion.toString() === req.user._id.toString();

        if (!isOwner && !isCompanion) {
            return res.status(403).json({
                error: 'Access denied! 🔐',
                message: 'You don\'t have permission to update this booking.'
            });
        }

        // Update booking
        booking.status = status;
        if (reason) {
            booking.cancellationReason = reason;
        }
        if (status === 'cancelled') {
            booking.cancelledBy = isOwner ? 'user' : 'companion';
            booking.cancellationTime = new Date();
        }

        await booking.save();

        res.json({
            success: true,
            message: `Booking ${status} successfully! ✨`,
            data: {
                booking: {
                    id: booking._id,
                    status: booking.status,
                    statusWithEmoji: booking.statusWithEmoji,
                    cancellationReason: booking.cancellationReason
                }
            }
        });

    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            error: 'Status update failed! 😅',
            message: 'Something went wrong while updating the booking status.'
        });
    }
});

module.exports = router; 