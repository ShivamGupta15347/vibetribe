// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  interests?: string[];
  isCompanion: boolean;
  rating?: number;
  totalBookings?: number;
  createdAt?: string;
}

// Companion types
export interface Companion {
  id: string;
  displayName: string;
  tagline: string;
  description: string;
  vibeTags: string[];
  hourlyRate: number;
  formattedRate: string;
  images: string[];
  location: {
    city: string;
    area?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  rating: {
    average: number;
    count: number;
  };
  totalBookings: number;
  specializations?: string[];
  languages?: string[];
  age: number;
  gender: string;
  isVerified: boolean;
  availability?: any;
  user: {
    id: string;
    name: string;
    avatar: string;
    bio?: string;
    interests?: string[];
  };
}

// Booking types
export interface Booking {
  id: string;
  date: string;
  timeRange: string;
  duration: number;
  totalAmount: number;
  activity: string;
  location: string;
  status: string;
  statusWithEmoji: string;
  paymentStatus: string;
  specialRequests?: string;
  companionNotes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  companion: {
    id: string;
    displayName: string;
    tagline: string;
    hourlyRate: number;
    location: {
      city: string;
      area?: string;
    };
    images: string[];
  };
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
}

// Auth types
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
  bio?: string;
  interests?: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  details?: any[];
}

export interface PaginatedCompanionResponse {
  companions: Companion[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCompanions: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface PaginatedBookingResponse {
  bookings: Booking[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBookings: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Filter types
export interface CompanionFilters {
  city?: string;
  vibeTags?: string[];
  minRate?: number;
  maxRate?: number;
  rating?: number;
  page?: number;
  limit?: number;
}

export interface BookingFilters {
  status?: string;
  page?: number;
  limit?: number;
}

// Form types
export interface BookingForm {
  companionId: string;
  date: string;
  startTime: string;
  endTime: string;
  activity: string;
  location: string;
  specialRequests?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Vibe tags
export const VIBE_TAGS = [
  'Gamer', 'Cafe Hopper', 'Bookworm', 'Music Lover', 'Fitness Freak',
  'Tech Lover', 'Social Butterfly', 'Foodie', 'Travel Buddy',
  'Art Lover', 'Movie Buff', 'Photography', 'Deep Talks',
  'Party Starter', 'Chiller', 'Adventure Seeker', 'Intellectual'
] as const;

export type VibeTag = typeof VIBE_TAGS[number]; 