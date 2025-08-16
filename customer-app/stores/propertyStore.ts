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
        set({
          properties: response.data,
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
        set({ bookings: response.data });
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
      const response = await apiService.createBooking(bookingData);
      if (response.success) {
        const newBooking = response.data;
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