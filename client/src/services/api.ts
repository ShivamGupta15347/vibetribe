import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  Companion, 
  Booking, 
  AuthResponse, 
  LoginCredentials, 
  SignupCredentials,
  ApiResponse,
  PaginatedCompanionResponse,
  PaginatedBookingResponse,
  CompanionFilters,
  BookingFilters,
  BookingForm
} from '../types';

const API_BASE_URL = 'https://vibetribe-backend-9fcs.onrender.com/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('vibetribe_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('vibetribe_token');
          localStorage.removeItem('vibetribe_user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/signup', credentials);
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await this.api.get('/auth/me');
    return response.data;
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await this.api.put('/auth/profile', updates);
    return response.data;
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response: AxiosResponse<ApiResponse<{ message: string }>> = await this.api.post('/auth/logout');
    return response.data;
  }

  // Companion endpoints
  async getCompanions(filters?: CompanionFilters): Promise<ApiResponse<PaginatedCompanionResponse>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    const response: AxiosResponse<ApiResponse<PaginatedCompanionResponse>> = await this.api.get(`/companions?${params}`);
    return response.data;
  }

  async getCompanion(id: string): Promise<ApiResponse<{ companion: Companion }>> {
    const response: AxiosResponse<ApiResponse<{ companion: Companion }>> = await this.api.get(`/companions/${id}`);
    return response.data;
  }

  async createCompanion(companionData: any): Promise<ApiResponse<{ companion: Companion }>> {
    const response: AxiosResponse<ApiResponse<{ companion: Companion }>> = await this.api.post('/companions', companionData);
    return response.data;
  }

  async getSearchSuggestions(query: string): Promise<ApiResponse<{ cities: string[], vibeTags: string[] }>> {
    const response: AxiosResponse<ApiResponse<{ cities: string[], vibeTags: string[] }>> = await this.api.get(`/companions/search/suggestions?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  // Booking endpoints
  async createBooking(bookingData: BookingForm): Promise<ApiResponse<{ booking: Booking }>> {
    const response: AxiosResponse<ApiResponse<{ booking: Booking }>> = await this.api.post('/bookings', bookingData);
    return response.data;
  }

  async getMyBookings(filters?: BookingFilters): Promise<ApiResponse<PaginatedBookingResponse>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response: AxiosResponse<ApiResponse<PaginatedBookingResponse>> = await this.api.get(`/bookings/my-bookings?${params}`);
    return response.data;
  }

  async getBooking(id: string): Promise<ApiResponse<{ booking: Booking }>> {
    const response: AxiosResponse<ApiResponse<{ booking: Booking }>> = await this.api.get(`/bookings/${id}`);
    return response.data;
  }

  async updateBookingStatus(id: string, status: string, reason?: string): Promise<ApiResponse<{ booking: Partial<Booking> }>> {
    const response: AxiosResponse<ApiResponse<{ booking: Partial<Booking> }>> = await this.api.put(`/bookings/${id}/status`, { status, reason });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string, message: string, timestamp: string }>> {
    const response: AxiosResponse<ApiResponse<{ status: string, message: string, timestamp: string }>> = await this.api.get('/health');
    return response.data;
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 