const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Companion',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Booking date is required! 📅'],
        validate: {
            validator: function(v) {
                return v > new Date();
            },
            message: 'Booking date must be in the future! ⏰'
        }
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required! 🕐'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
    },
    endTime: {
        type: String,
        required: [true, 'End time is required! 🕐'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
    },
    duration: {
        type: Number,
        required: true,
        min: [1, 'Minimum booking duration is 1 hour'],
        max: [12, 'Maximum booking duration is 12 hours']
    },
    totalAmount: {
        type: Number,
        required: true,
        min: [100, 'Minimum booking amount is ₹100']
    },
    activity: {
        type: String,
        required: [true, 'Activity description is required! 🎯'],
        maxlength: [200, 'Activity description cannot be more than 200 characters']
    },
    location: {
        type: String,
        required: [true, 'Meeting location is required! 📍'],
        maxlength: [200, 'Location cannot be more than 200 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    specialRequests: {
        type: String,
        maxlength: [500, 'Special requests cannot be more than 500 characters']
    },
    companionNotes: {
        type: String,
        maxlength: [500, 'Notes cannot be more than 500 characters']
    },
    userRating: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: {
            type: String,
            maxlength: [300, 'Review cannot be more than 300 characters']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    companionRating: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: {
            type: String,
            maxlength: [300, 'Review cannot be more than 300 characters']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    cancellationReason: {
        type: String,
        maxlength: [200, 'Cancellation reason cannot be more than 200 characters']
    },
    cancelledBy: {
        type: String,
        enum: ['user', 'companion', 'admin']
    },
    cancellationTime: {
        type: Date
    },
    isPlatonic: {
        type: Boolean,
        default: true,
        required: true
    },
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String
    }
}, {
    timestamps: true
});

// Index for efficient queries
bookingSchema.index({ 
    user: 1, 
    date: 1, 
    status: 1 
});
bookingSchema.index({ 
    companion: 1, 
    date: 1, 
    status: 1 
});

// Virtual for formatted date
bookingSchema.virtual('formattedDate').get(function() {
    return this.date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Virtual for formatted time range
bookingSchema.virtual('timeRange').get(function() {
    return `${this.startTime} - ${this.endTime}`;
});

// Virtual for booking status with emoji
bookingSchema.virtual('statusWithEmoji').get(function() {
    const statusEmojis = {
        'pending': '⏳',
        'confirmed': '✅',
        'completed': '🎉',
        'cancelled': '❌',
        'rejected': '🚫'
    };
    return `${statusEmojis[this.status]} ${this.status.charAt(0).toUpperCase() + this.status.slice(1)}`;
});

// Ensure virtuals are serialized
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

// Pre-save middleware to calculate duration and total amount
bookingSchema.pre('save', async function(next) {
    if (this.isModified('startTime') || this.isModified('endTime') || this.isModified('duration')) {
        // Calculate duration if not provided
        if (!this.duration && this.startTime && this.endTime) {
            const start = new Date(`2000-01-01T${this.startTime}:00`);
            const end = new Date(`2000-01-01T${this.endTime}:00`);
            this.duration = Math.ceil((end - start) / (1000 * 60 * 60));
        }
        
        // Calculate total amount if companion is populated
        if (this.duration && this.companion && this.companion.hourlyRate) {
            this.totalAmount = this.duration * this.companion.hourlyRate;
        }
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema); 