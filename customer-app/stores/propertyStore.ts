import { create } from 'zustand';
import { Property, Booking } from '../types';
import { apiService } from '../services/api';

interface PropertyState {
  properties: Property[];
  bookings: Booking[];
  selectedProperty: Property | null;
  isLoading: boolean;
  filters: {
    quarter?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
  };
  fetchProperties: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  setSelectedProperty: (property: Property | null) => void;
  setFilters: (filters: any) => void;
  createBooking: (bookingData: any) => Promise<boolean>;
}

// Map backend property data to frontend Property type
function mapApiProperty(p: any): Property {
  return {
    id: String(p.id),
    name: p.name,
    description: p.description,
    quarter: p.quarter,
    pricePerNight: p.price_per_night || 0,
    rating: parseFloat(p.rating) || 0,
    reviewCount: p.review_count || 0,
    images: p.photos ? (typeof p.photos === 'string' ? JSON.parse(p.photos) : p.photos) : [],
    amenities: p.amenities
      ? (typeof p.amenities === 'string' ? JSON.parse(p.amenities) : p.amenities).map((a: string, i: number) => ({
          id: String(i),
          name: a,
          icon: 'checkmark-circle',
        }))
      : [],
    ownerId: p.host_id ? String(p.host_id) : '',
  };
}

// Map backend booking data to frontend Booking type
function mapApiBooking(b: any): Booking {
  return {
    id: String(b.id),
    propertyId: String(b.property_id),
    property: b.property ? mapApiProperty(b.property) : {
      id: String(b.property_id),
      name: 'Unknown Property',
      description: '',
      quarter: '',
      pricePerNight: 0,
      rating: 0,
      reviewCount: 0,
      images: [],
      amenities: [],
      ownerId: '',
    },
    checkInDate: b.check_in_date,
    checkOutDate: b.check_out_date,
    totalPrice: parseFloat(b.total_price),
    status: b.status,
    guestCount: 1,
    createdAt: b.created_at,
  };
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  bookings: [],
  selectedProperty: null,
  isLoading: false,
  filters: {},

  fetchProperties: async () => {
    try {
      set({ isLoading: true });
      const response = await apiService.getProperties(get().filters);
      if (response.success) {
        const properties = (response.data || []).map(mapApiProperty);
        set({
          properties,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Fetch properties error:', error);
      set({ isLoading: false });
    }
  },

  fetchBookings: async () => {
    try {
      const response = await apiService.getBookings();
      if (response.success) {
        const bookings = (response.data || []).map(mapApiBooking);
        set({ bookings });
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
    }
  },

  setSelectedProperty: (property) => {
    set({ selectedProperty: property });
  },

  setFilters: (filters) => {
    set({ filters });
    get().fetchProperties();
  },

  createBooking: async (bookingData) => {
    try {
      const response = await apiService.createBooking({
        property_id: bookingData.propertyId || bookingData.property_id,
        check_in_date: bookingData.checkInDate || bookingData.check_in_date,
        check_out_date: bookingData.checkOutDate || bookingData.check_out_date,
      });
      if (response.success) {
        const newBooking = mapApiBooking(response.data);
        set((state) => ({
          bookings: [newBooking, ...state.bookings],
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Create booking error:', error);
      return false;
    }
  },
}));