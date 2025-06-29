const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Companion = require('./models/Companion');
require('dotenv').config({ path: './config.env' });

// Sample users data
const sampleUsers = [
    {
        name: 'Alex Kumar',
        email: 'alex@vibetribe.in',
        password: 'password123',
        phone: '9876543210',
        bio: 'Gaming enthusiast and tech lover! Always up for a good gaming session or tech discussion.',
        interests: ['Gamer', 'Tech Lover', 'Movie Buff'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
        name: 'Priya Sharma',
        email: 'priya@vibetribe.in',
        password: 'password123',
        phone: '9876543211',
        bio: 'Social butterfly who loves making new friends! Perfect companion for any social event.',
        interests: ['Music Lover', 'Social Butterfly', 'Party Starter'],
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
        name: 'Rohit Patel',
        email: 'rohit@vibetribe.in',
        password: 'password123',
        phone: '9876543212',
        bio: 'Cafe hopper and foodie! Love exploring new places and having deep conversations over coffee.',
        interests: ['Cafe Hopper', 'Foodie', 'Deep Talks'],
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
        name: 'Maya Singh',
        email: 'maya@vibetribe.in',
        password: 'password123',
        phone: '9876543213',
        bio: 'Music lover and creative soul! Perfect for concerts, jam sessions, or just vibing to good music.',
        interests: ['Music Lover', 'Art Lover', 'Creative'],
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
        name: 'Karan Verma',
        email: 'karan@vibetribe.in',
        password: 'password123',
        phone: '9876543214',
        bio: 'Fitness freak and adventure seeker! Always ready for a workout or outdoor adventure.',
        interests: ['Fitness Freak', 'Adventure Seeker', 'Energetic'],
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    {
        name: 'Ananya Reddy',
        email: 'ananya@vibetribe.in',
        password: 'password123',
        phone: '9876543215',
        bio: 'Bookworm and intellectual! Love discussing books, visiting museums, and deep conversations.',
        interests: ['Bookworm', 'Intellectual', 'Museum Buddy'],
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    }
];

// Sample companions data
const sampleCompanions = [
    {
        displayName: 'Alex - The Gamer',
        tagline: 'Perfect companion for gaming sessions, tech events, or chilling at home with some good vibes! 🎮',
        description: 'Hey there! I\'m Alex, a passionate gamer and tech enthusiast. Whether you want to dominate in multiplayer games, discuss the latest tech trends, or just chill with some good vibes, I\'m your person! I love all genres of games and can adapt to any gaming setup. Let\'s create some epic gaming memories together!',
        vibeTags: ['Gamer', 'Tech Lover', 'Chiller'],
        hourlyRate: 800,
        images: [
            'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop'
        ],
        location: {
            city: 'Mumbai',
            area: 'Bandra West',
            coordinates: { lat: 19.0596, lng: 72.8295 }
        },
        specializations: ['Gaming Sessions', 'Tech Events', 'Home Hangouts'],
        languages: ['English', 'Hindi', 'Marathi'],
        age: 24,
        gender: 'Male'
    },
    {
        displayName: 'Priya - The Social Butterfly',
        tagline: 'Your go-to companion for parties, social gatherings, and making any event more fun! 🎉',
        description: 'Hi! I\'m Priya, and I love making connections! Whether it\'s a party, wedding, corporate event, or just a casual hangout, I\'ll make sure everyone has a great time. I\'m great at breaking the ice, keeping conversations flowing, and making sure the vibe is always positive. Let\'s make your event unforgettable!',
        vibeTags: ['Event Buddy', 'Social', 'Party Starter'],
        hourlyRate: 1200,
        images: [
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop'
        ],
        location: {
            city: 'Mumbai',
            area: 'Andheri West',
            coordinates: { lat: 19.1197, lng: 72.8464 }
        },
        specializations: ['Event Companion', 'Party Starter', 'Social Gatherings'],
        languages: ['English', 'Hindi', 'Gujarati'],
        age: 26,
        gender: 'Female'
    },
    {
        displayName: 'Rohit - The Cafe Hopper',
        tagline: 'Love exploring new cafes and having deep conversations? Rohit\'s your perfect companion! ☕',
        description: 'Hey! I\'m Rohit, a cafe enthusiast and food lover. I know all the best cafes in the city and love discovering new ones. Whether you want to discuss life, share stories, or just enjoy good coffee and food, I\'m here for it! I\'m also great at photography, so we can capture some amazing moments together.',
        vibeTags: ['Cafe Hopper', 'Foodie', 'Deep Talks'],
        hourlyRate: 600,
        images: [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop'
        ],
        location: {
            city: 'Mumbai',
            area: 'Colaba',
            coordinates: { lat: 18.9217, lng: 72.8347 }
        },
        specializations: ['Cafe Hopping', 'Food Tours', 'Photography Session'],
        languages: ['English', 'Hindi', 'Marathi'],
        age: 25,
        gender: 'Male'
    },
    {
        displayName: 'Maya - The Music Lover',
        tagline: 'Concert buddy or just someone to jam with? Maya knows all the best beats and venues! 🎵',
        description: 'Hello! I\'m Maya, a music enthusiast and creative soul. From classical to contemporary, I love all genres of music. Whether you want to attend a concert, have a jam session, or just vibe to some good music, I\'m your perfect companion! I also love art and can help you discover the creative side of the city.',
        vibeTags: ['Music Lover', 'Concert Buddy', 'Creative'],
        hourlyRate: 1000,
        images: [
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop'
        ],
        location: {
            city: 'Mumbai',
            area: 'Juhu',
            coordinates: { lat: 19.0994, lng: 72.8295 }
        },
        specializations: ['Concert Buddy', 'Music Sessions', 'Art Tours'],
        languages: ['English', 'Hindi', 'Bengali'],
        age: 23,
        gender: 'Female'
    },
    {
        displayName: 'Karan - The Fitness Freak',
        tagline: 'Need a workout buddy or someone for outdoor adventures? Karan\'s got the energy! 💪',
        description: 'Hi! I\'m Karan, a fitness enthusiast and adventure seeker. Whether you want to hit the gym, go for a run, try rock climbing, or explore outdoor trails, I\'m here to motivate and support you! I believe in making fitness fun and can adapt to any fitness level. Let\'s get active together!',
        vibeTags: ['Fitness', 'Outdoor', 'Energetic'],
        hourlyRate: 900,
        images: [
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
        ],
        location: {
            city: 'Mumbai',
            area: 'Powai',
            coordinates: { lat: 19.1197, lng: 72.9064 }
        },
        specializations: ['Workout Buddy', 'Outdoor Adventures', 'Fitness Training'],
        languages: ['English', 'Hindi', 'Punjabi'],
        age: 27,
        gender: 'Male'
    },
    {
        displayName: 'Ananya - The Intellectual',
        tagline: 'Love book clubs, museums, or intellectual discussions? Ananya\'s your perfect match! 📚',
        description: 'Hello! I\'m Ananya, a bookworm and intellectual at heart. I love discussing books, visiting museums, attending cultural events, and having deep, meaningful conversations. Whether you want to explore the city\'s cultural side, join a book club, or just have an intellectual discussion, I\'m your perfect companion!',
        vibeTags: ['Bookworm', 'Intellectual', 'Museum Buddy'],
        hourlyRate: 700,
        images: [
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop'
        ],
        location: {
            city: 'Mumbai',
            area: 'Fort',
            coordinates: { lat: 18.9296, lng: 72.8347 }
        },
        specializations: ['Museum Guide', 'Book Clubs', 'Cultural Tours'],
        languages: ['English', 'Hindi', 'Tamil'],
        age: 28,
        gender: 'Female'
    }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibetribe', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✨ Connected to MongoDB for seeding'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Seed function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Companion.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create users
        const createdUsers = [];
        for (const userData of sampleUsers) {
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
            console.log(`👤 Created user: ${user.name}`);
        }

        // Create companions
        for (let i = 0; i < sampleCompanions.length; i++) {
            const companionData = sampleCompanions[i];
            const user = createdUsers[i];

            const companion = new Companion({
                ...companionData,
                user: user._id,
                isVerified: true,
                rating: {
                    average: Math.floor(Math.random() * 2) + 4, // 4-5 stars
                    count: Math.floor(Math.random() * 50) + 10 // 10-60 reviews
                },
                totalBookings: Math.floor(Math.random() * 100) + 20 // 20-120 bookings
            });

            await companion.save();
            console.log(`🌟 Created companion: ${companion.displayName}`);

            // Update user to mark as companion
            await User.findByIdAndUpdate(user._id, { isCompanion: true });
        }

        console.log('✅ Database seeding completed successfully!');
        console.log(`📊 Created ${createdUsers.length} users and ${sampleCompanions.length} companions`);
        console.log('🎉 VibeTribe is ready to rock!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

// Run seeding
seedDatabase(); 