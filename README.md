# VibeTribe - Your Plus-One, Your Rules ✨

A full-stack Gen Z companion rental platform built with React, Node.js, and MongoDB. VibeTribe connects people looking for platonic companionship for events, hangouts, and adventures.

## 🚀 Features

### For Users
- **Browse Companions**: Discover verified companions with detailed profiles
- **Advanced Filtering**: Filter by location, vibe tags, price range, and ratings
- **Booking Management**: Easy booking system with real-time status updates
- **User Dashboard**: Manage bookings, view history, and track upcoming meetups
- **Secure Authentication**: JWT-based authentication with profile management

### For Companions
- **Profile Creation**: Rich profiles with photos, descriptions, and vibe tags
- **Booking Requests**: Receive and manage booking requests
- **Earnings Tracking**: Monitor bookings and earnings
- **Availability Management**: Set availability and pricing

### Platform Features
- **Real-time Updates**: Live booking status and notifications
- **Responsive Design**: Beautiful UI that works on all devices
- **Search & Discovery**: Advanced search with suggestions
- **Safety & Verification**: Background checks and user verification
- **Payment Integration**: Secure payment processing (ready for integration)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Context API** for state management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Joi** for validation
- **CORS** enabled

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Nodemon** for development

## 📁 Project Structure

```
vibetribe/
├── server/                 # Backend API
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Main server file
├── client/               # Frontend React app
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # React contexts
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   └── App.tsx       # Main app component
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vibetribe
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

The React app will start on `http://localhost:3000`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Companions
- `GET /api/companions` - Get all companions with filters
- `GET /api/companions/:id` - Get specific companion
- `POST /api/companions` - Create companion profile
- `PUT /api/companions/:id` - Update companion profile
- `DELETE /api/companions/:id` - Delete companion profile

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get specific booking
- `PUT /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Soft pastels with vibrant accents
- **Typography**: Modern, readable fonts (Inter/Poppins)
- **Components**: Reusable, accessible components
- **Animations**: Smooth transitions and micro-interactions

### Pages
1. **Home** - Landing page with hero section and features
2. **Explore** - Browse and filter companions
3. **Companion Profile** - Detailed companion information
4. **Login/Signup** - Authentication forms
5. **Dashboard** - User booking management
6. **Booking Flow** - Multi-step booking process

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** using bcrypt
- **Input Validation** with Joi schemas
- **CORS Protection** for cross-origin requests
- **Rate Limiting** (ready for implementation)
- **Data Sanitization** to prevent injection attacks

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to platforms like:
   - Heroku
   - Railway
   - DigitalOcean
   - AWS

### Frontend Deployment
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy to platforms like:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 📈 Future Enhancements

- **Real-time Chat** using Socket.io
- **Payment Integration** with Stripe/Razorpay
- **Push Notifications** for booking updates
- **Video Calls** for virtual meetups
- **Review System** with ratings and feedback
- **Advanced Analytics** for companions
- **Mobile App** using React Native
- **AI-powered Matching** algorithm

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: hello@vibetribe.in
- Phone: +91 98765 43210
- Location: Mumbai, India

## ⚖️ Legal Disclaimer

VibeTribe is a platform for platonic companionship services only. All interactions are strictly non-romantic and non-intimate. We comply with all applicable Indian laws and regulations. Users must be 18+ years old.

---

**Made with 💜 for Gen Z India** ✨ 