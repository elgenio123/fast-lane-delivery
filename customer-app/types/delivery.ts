export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  formattedAddress?: string;
}

export interface DeliveryOrder {
  id: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  packageDescription: string;
  paymentMethod: 'mobile_money' | 'cash';
  estimatedFare: number;
  status: 'pending' | 'driver_found' | 'accepted' | 'pickup' | 'in_transit' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  name: string;
  photo: string;
  rating: number;
  vehiclePlate: string;
  vehicleModel: string;
  currentLocation: Location;
  phoneNumber: string;
}

export interface OrderStatus {
  status: DeliveryOrder['status'];
  timestamp: string;
  description: string;
}

export interface EstimatedFareResponse {
  estimatedFare: number;
  distance: number;
  duration: number;
  currency: string;
}

export interface CreateOrderRequest {
  pickupLocation: Location;
  dropoffLocation: Location;
  packageDescription: string;
  paymentMethod: 'mobile_money' | 'cash';
}

export interface CreateOrderResponse {
  order: DeliveryOrder;
  message: string;
}
