const mongoose = require('mongoose');

const companionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    displayName: {
        type: String,
        required: [true, 'Display name is required! ✨'],
        trim: true,
        maxlength: [30, 'Display name cannot be more than 30 characters']
    },
    tagline: {
        type: String,
        required: [true, 'Tagline is required! 💭'],
        maxlength: [100, 'Tagline cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required! 📝'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    vibeTags: [{
        type: String,
        enum: [
            'Gamer', 'Cafe Hopper', 'Bookworm', 'Music Lover', 'Fitness Freak', 
            'Tech Lover', 'Social Butterfly', 'Foodie', 'Travel Buddy', 
            'Art Lover', 'Movie Buff', 'Photography', 'Deep Talks', 
            'Party Starter', 'Chiller', 'Adventure Seeker', 'Intellectual'
        ],
        required: true
    }],
    hourlyRate: {
        type: Number,
        required: [true, 'Hourly rate is required! 💰'],
        min: [100, 'Minimum rate is ₹100 per hour'],
        max: [5000, 'Maximum rate is ₹5000 per hour']
    },
    images: [{
        type: String,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide valid image URLs! 📸'
        }
    }],
    availability: {
        monday: { start: String, end: String, available: { type: Boolean, default: true } },
        tuesday: { start: String, end: String, available: { type: Boolean, default: true } },
        wednesday: { start: String, end: String, available: { type: Boolean, default: true } },
        thursday: { start: String, end: String, available: { type: Boolean, default: true } },
        friday: { start: String, end: String, available: { type: Boolean, default: true } },
        saturday: { start: String, end: String, available: { type: Boolean, default: true } },
        sunday: { start: String, end: String, available: { type: Boolean, default: true } }
    },
    location: {
        city: {
            type: String,
            required: [true, 'City is required! 🏙️']
        },
        area: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    totalBookings: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    specializations: [{
        type: String,
        enum: [
            'Event Companion', 'Travel Buddy', 'Study Partner', 'Workout Buddy',
            'Concert Buddy', 'Museum Guide', 'Food Tour', 'Shopping Partner',
            'Photography Session', 'Language Exchange', 'Skill Sharing',
            'Gaming Sessions', 'Tech Events', 'Home Hangouts', 'Party Starter',
            'Social Gatherings', 'Cafe Hopping', 'Outdoor Adventures',
            'Fitness Training', 'Cultural Tours', 'Book Clubs'
        ]
    }],
    languages: [{
        type: String,
        enum: ['English', 'Hindi', 'Marathi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Punjabi']
    }],
    age: {
        type: Number,
        required: [true, 'Age is required! 🎂'],
        min: [18, 'Must be at least 18 years old'],
        max: [65, 'Age cannot exceed 65 years']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
        required: [true, 'Gender is required! 👤']
    }
}, {
    timestamps: true
});

// Index for search functionality
companionSchema.index({ 
    'location.city': 1, 
    'vibeTags': 1, 
    'isActive': 1, 
    'rating.average': -1 
});

// Virtual for formatted hourly rate
companionSchema.virtual('formattedRate').get(function() {
    return `₹${this.hourlyRate}/hour`;
});

// Ensure virtuals are serialized
companionSchema.set('toJSON', { virtuals: true });
companionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Companion', companionSchema); 