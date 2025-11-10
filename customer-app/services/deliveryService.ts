import axios from 'axios';
import { 
  CreateOrderRequest, 
  CreateOrderResponse, 
  EstimatedFareResponse,
  DeliveryOrder,
  Driver 
} from '../types/delivery';

const API_BASE_URL = 'https://your-api-domain.com/api';

export class DeliveryService {
  private static instance: DeliveryService;
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  public static getInstance(): DeliveryService {
    if (!DeliveryService.instance) {
      DeliveryService.instance = new DeliveryService();
    }
    return DeliveryService.instance;
  }

  // Get estimated fare for delivery - returns mock data for demo
  async getEstimatedFare(
    pickupLocation: { latitude: number; longitude: number },
    dropoffLocation: { latitude: number; longitude: number }
  ): Promise<EstimatedFareResponse> {
    try {
      const response = await this.api.post('/delivery/estimate-fare', {
        pickupLocation,
        dropoffLocation,
      });
      return response.data;
    } catch (error) {
      console.log('Using mock fare data for demo');
      // Return mock data for demo purposes
      const distance = Math.sqrt(
        Math.pow(dropoffLocation.latitude - pickupLocation.latitude, 2) +
        Math.pow(dropoffLocation.longitude - pickupLocation.longitude, 2)
      ) * 111; // Rough conversion to km
      
      return {
        estimatedFare: Math.round(distance * 1000), // 1000 per km
        distance: distance,
        duration: Math.round(distance * 3), // 3 minutes per km
        currency: 'XAF'
      };
    }
  }

  // Create a new delivery order - returns mock data for demo
  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await this.api.post('/delivery-orders', orderData);
      return response.data;
    } catch (error: any) {
      console.log('Using mock order data for demo');
      // Return mock data for demo purposes
      const mockOrder: DeliveryOrder = {
        id: 'demo-order-' + Date.now(),
        pickupLocation: orderData.pickupLocation,
        dropoffLocation: orderData.dropoffLocation,
        packageDescription: orderData.packageDescription,
        paymentMethod: orderData.paymentMethod,
        estimatedFare: 2500, // Default fare
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return {
        order: mockOrder,
        message: 'Order created successfully (demo)'
      };
    }
  }

  // Get order status - returns mock data for demo
  async getOrderStatus(orderId: string): Promise<DeliveryOrder> {
    try {
      const response = await this.api.get(`/delivery-orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.log('Using mock order status for demo');
      // Return mock data for demo purposes
      const mockOrder: DeliveryOrder = {
        id: orderId,
        pickupLocation: {
          latitude: 6.5244,
          longitude: 3.3792,
          address: 'Demo Pickup Location',
          formattedAddress: 'Demo Pickup Location'
        },
        dropoffLocation: {
          latitude: 6.5344,
          longitude: 3.3892,
          address: 'Demo Dropoff Location',
          formattedAddress: 'Demo Dropoff Location'
        },
        packageDescription: 'Demo Package',
        paymentMethod: 'mobile_money',
        estimatedFare: 2500,
        status: 'driver_found',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return mockOrder;
    }
  }

  // Get driver information when assigned - returns mock data for demo
  async getDriverInfo(orderId: string): Promise<Driver> {
    try {
      const response = await this.api.get(`/delivery-orders/${orderId}/driver`);
      return response.data;
    } catch (error) {
      console.log('Using mock driver data for demo');
      // Return mock data for demo purposes
      const mockDriver: Driver = {
        id: 'demo-driver-123',
        name: 'John Doe',
        photo: 'https://via.placeholder.com/100',
        rating: 4.8,
        vehiclePlate: 'ABC-123',
        vehicleModel: 'Toyota Corolla',
        currentLocation: {
          latitude: 6.5244,
          longitude: 3.3792,
          address: 'Driver Location',
          formattedAddress: 'Driver Location'
        },
        phoneNumber: '+237 123 456 789'
      };
      return mockDriver;
    }
  }

  // Cancel an order - returns mock success for demo
  async cancelOrder(orderId: string): Promise<{ message: string }> {
    try {
      const response = await this.api.post(`/delivery-orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.log('Using mock cancel response for demo');
      // Return mock success for demo purposes
      return { message: 'Order cancelled successfully (demo)' };
    }
  }

  // Get real-time driver location updates - returns mock data for demo
  async getDriverLocation(orderId: string): Promise<{ latitude: number; longitude: number }> {
    try {
      const response = await this.api.get(`/delivery-orders/${orderId}/driver-location`);
      return response.data;
    } catch (error) {
      console.log('Using mock driver location for demo');
      // Return mock location for demo purposes
      return {
        latitude: 6.5244 + (Math.random() - 0.5) * 0.01,
        longitude: 3.3792 + (Math.random() - 0.5) * 0.01
      };
    }
  }
}

export default DeliveryService.getInstance();
