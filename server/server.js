const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: './config.env' });

// Import routes
const authRoutes = require('./routes/auth');
const companionRoutes = require('./routes/companions');
const bookingRoutes = require('./routes/bookings');

const app = express();

// Middleware
app.use(cors({
    origin: [
        "https://vibetribe-frontend.onrender.com",
        
        'http://localhost:3001',
        'http://127.0.0.1:3001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibetribe', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✨ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companions', companionRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'VibeTribe API is running! 🚀',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong! 😅',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found! 🤷‍♂️',
        message: 'The endpoint you\'re looking for doesn\'t exist'
    });
});

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`🚀 VibeTribe server running on port ${PORT}`);
    console.log(`📱 API available at http://localhost:${PORT}/api`);
    console.log(`💚 Environment: ${process.env.NODE_ENV}`);
}); 