export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface DeliveryOrder {
  id: string;
  description: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  status: 'pending' | 'confirmed' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  price: number;
  paymentMethod: 'mobile_money' | 'cash';
  driverId?: string;
  driver?: Driver;
  createdAt: string;
  estimatedDeliveryTime?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  quarter?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  rating: number;
  vehicleType: string;
  vehicleNumber: string;
}

export interface Property {
  id: string;
  name: string;
  description: string;
  quarter: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: Amenity[];
  ownerId: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  property: Property;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guestCount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  user: User;
  propertyId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}