export interface Property {
  id: string;
  name: string;
  type: 'guesthouse' | 'hotel' | 'apartment' | 'villa';
  quarter: string;
  city: string;
  description: string;
  pricePerNight: number;
  currency: string;
  images: string[];
  amenities: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  rating: number;
  reviewCount: number;
  host: {
    id: string;
    name: string;
    photo: string;
    rating: number;
    responseTime: string;
  };
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
  availability: {
    availableDates: string[];
    blockedDates: string[];
  };
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface Booking {
  id: string;
  propertyId: string;
  property: Property;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  serviceFee: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface CreateBookingResponse {
  booking: Booking;
  message: string;
}

export interface PropertyDetailsResponse {
  property: Property;
  reviews: Review[];
  similarProperties: Property[];
}
