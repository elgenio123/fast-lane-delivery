import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { ApiResponse } from '../types';

// LAN IP for physical devices. 10.0.2.2 is the Android emulator alias for host localhost.
const LAN_IP = '172.20.10.2';

function getBaseURL(): string {
  // Physical device (Expo Go) → use LAN IP
  if (Constants.executionEnvironment === 'storeClient') {
    return `http://${LAN_IP}:8000/api`;
  }
  // Android emulator → 10.0.2.2 maps to host machine's localhost
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api';
  }
  // iOS simulator → localhost works directly
  return 'http://localhost:8000/api';
}

class ApiService {
  private api: AxiosInstance;
  private baseURL = getBaseURL();

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // Allow changing base URL at runtime (for dev/prod switching)
  setBaseURL(url: string) {
    this.baseURL = url;
    this.api.defaults.baseURL = url;
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
          await AsyncStorage.removeItem('user_data');
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
    const response = await this.api.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      phone_number: userData.phone,
      password: userData.password,
      password_confirmation: userData.password_confirmation,
    });
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
    const response = await this.api.put('/profile', {
      name: userData.name,
      email: userData.email,
      phone_number: userData.phone,
    });
    return response.data;
  }

  // Delivery endpoints
  async createDeliveryOrder(orderData: {
    pickup_address: string;
    pickup_latitude: number;
    pickup_longitude: number;
    dropoff_address: string;
    dropoff_latitude: number;
    dropoff_longitude: number;
    package_description: string;
    payment_method: string;
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

  async estimateFare(data: {
    pickup_latitude: number;
    pickup_longitude: number;
    dropoff_latitude: number;
    dropoff_longitude: number;
  }): Promise<ApiResponse> {
    const response = await this.api.post('/delivery-orders/estimate-fare', data);
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
    property_id: string;
    check_in_date: string;
    check_out_date: string;
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
    reviewable_id: string;
    reviewable_type: string;
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