import axios from 'axios';
import { 
  Property, 
  PropertyDetailsResponse, 
  CreateBookingRequest, 
  CreateBookingResponse,
  Review 
} from '../types/guesthouse';

const API_BASE_URL = 'https://your-api-domain.com/api';

export class GuesthouseService {
  private static instance: GuesthouseService;
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  public static getInstance(): GuesthouseService {
    if (!GuesthouseService.instance) {
      GuesthouseService.instance = new GuesthouseService();
    }
    return GuesthouseService.instance;
  }

  // Get property details by ID
  async getPropertyDetails(propertyId: string): Promise<PropertyDetailsResponse> {
    try {
      const response = await this.api.get(`/properties/${propertyId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting property details:', error);
      throw new Error('Failed to get property details. Please try again.');
    }
  }

  // Get all properties with filters
  async getProperties(filters?: {
    city?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  }): Promise<{ properties: Property[]; total: number }> {
    try {
      const response = await this.api.get('/properties', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error getting properties:', error);
      throw new Error('Failed to get properties. Please try again.');
    }
  }

  // Create a new booking
  async createBooking(bookingData: CreateBookingRequest): Promise<CreateBookingResponse> {
    try {
      const response = await this.api.post('/bookings', bookingData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating booking:', error);
      if (error.response?.status === 400) {
        throw new Error('Invalid booking data. Please check your information.');
      } else if (error.response?.status === 409) {
        throw new Error('Property is not available for selected dates. Please choose different dates.');
      } else {
        throw new Error('Failed to create booking. Please try again.');
      }
    }
  }

  // Get property availability for specific dates
  async getPropertyAvailability(
    propertyId: string, 
    checkIn: string, 
    checkOut: string
  ): Promise<{ available: boolean; blockedDates: string[] }> {
    try {
      const response = await this.api.get(`/properties/${propertyId}/availability`, {
        params: { checkIn, checkOut }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting property availability:', error);
      throw new Error('Failed to check availability. Please try again.');
    }
  }

  // Get property reviews
  async getPropertyReviews(
    propertyId: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{ reviews: Review[]; total: number; hasMore: boolean }> {
    try {
      const response = await this.api.get(`/properties/${propertyId}/reviews`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting property reviews:', error);
      throw new Error('Failed to get reviews. Please try again.');
    }
  }

  // Search properties by location
  async searchPropertiesByLocation(
    query: string, 
    latitude?: number, 
    longitude?: number
  ): Promise<Property[]> {
    try {
      const response = await this.api.get('/properties/search', {
        params: { q: query, lat: latitude, lng: longitude }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching properties:', error);
      throw new Error('Failed to search properties. Please try again.');
    }
  }

  // Get user's bookings
  async getUserBookings(): Promise<{ bookings: any[]; total: number }> {
    try {
      const response = await this.api.get('/user/bookings');
      return response.data;
    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw new Error('Failed to get your bookings. Please try again.');
    }
  }

  // Cancel a booking
  async cancelBooking(bookingId: string): Promise<{ message: string }> {
    try {
      const response = await this.api.post(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw new Error('Failed to cancel booking. Please try again.');
    }
  }

  // Get similar properties
  async getSimilarProperties(propertyId: string): Promise<Property[]> {
    try {
      const response = await this.api.get(`/properties/${propertyId}/similar`);
      return response.data;
    } catch (error) {
      console.error('Error getting similar properties:', error);
      return [];
    }
  }
}

export default GuesthouseService.getInstance();
