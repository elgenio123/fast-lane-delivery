import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse } from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL = 'https://api.fastlanedelivery.cm/api'; // Replace with your actual API URL

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('auth_token');
          // Navigate to login screen
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse> {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
  }): Promise<ApiResponse> {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await this.api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.api.post('/auth/logout');
    return response.data;
  }

  // Profile endpoints
  async getProfile(): Promise<ApiResponse> {
    const response = await this.api.get('/profile');
    return response.data;
  }

  async updateProfile(userData: Partial<{
    name: string;
    email: string;
    phone: string;
  }>): Promise<ApiResponse> {
    const response = await this.api.put('/profile', userData);
    return response.data;
  }

  // Delivery endpoints
  async createDeliveryOrder(orderData: {
    description: string;
    pickupLocation: any;
    dropoffLocation: any;
    paymentMethod: string;
  }): Promise<ApiResponse> {
    const response = await this.api.post('/delivery-orders', orderData);
    return response.data;
  }

  async getDeliveryOrders(): Promise<ApiResponse> {
    const response = await this.api.get('/delivery-orders');
    return response.data;
  }

  async getDeliveryOrder(id: string): Promise<ApiResponse> {
    const response = await this.api.get(`/delivery-orders/${id}`);
    return response.data;
  }

  async cancelDeliveryOrder(id: string): Promise<ApiResponse> {
    const response = await this.api.put(`/delivery-orders/${id}/cancel`);
    return response.data;
  }

  // Property endpoints
  async getProperties(filters?: {
    quarter?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
  }): Promise<ApiResponse> {
    const response = await this.api.get('/properties', { params: filters });
    return response.data;
  }

  async getProperty(id: string): Promise<ApiResponse> {
    const response = await this.api.get(`/properties/${id}`);
    return response.data;
  }

  // Booking endpoints
  async createBooking(bookingData: {
    propertyId: string;
    checkInDate: string;
    checkOutDate: string;
    guestCount: number;
  }): Promise<ApiResponse> {
    const response = await this.api.post('/bookings', bookingData);
    return response.data;
  }

  async getBookings(): Promise<ApiResponse> {
    const response = await this.api.get('/bookings');
    return response.data;
  }

  async cancelBooking(id: string): Promise<ApiResponse> {
    const response = await this.api.put(`/bookings/${id}/cancel`);
    return response.data;
  }

  // Review endpoints
  async createReview(reviewData: {
    propertyId: string;
    rating: number;
    comment: string;
  }): Promise<ApiResponse> {
    const response = await this.api.post('/reviews', reviewData);
    return response.data;
  }

  async getPropertyReviews(propertyId: string): Promise<ApiResponse> {
    const response = await this.api.get(`/properties/${propertyId}/reviews`);
    return response.data;
  }
}

export const apiService = new ApiService();