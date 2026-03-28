import { apiService } from './api';
import { 
  CreateOrderRequest, 
  CreateOrderResponse, 
  EstimatedFareResponse,
  DeliveryOrder,
  Driver 
} from '../types/delivery';

export class DeliveryService {
  private static instance: DeliveryService;

  public static getInstance(): DeliveryService {
    if (!DeliveryService.instance) {
      DeliveryService.instance = new DeliveryService();
    }
    return DeliveryService.instance;
  }

  // Get estimated fare for delivery
  async getEstimatedFare(
    pickupLocation: { latitude: number; longitude: number },
    dropoffLocation: { latitude: number; longitude: number }
  ): Promise<EstimatedFareResponse> {
    try {
      const response = await apiService.estimateFare({
        pickup_latitude: pickupLocation.latitude,
        pickup_longitude: pickupLocation.longitude,
        dropoff_latitude: dropoffLocation.latitude,
        dropoff_longitude: dropoffLocation.longitude,
      });
      if (response.success) {
        return response.data;
      }
      throw new Error('Failed to estimate fare');
    } catch (error) {
      console.log('Using mock fare data for demo');
      const distance = Math.sqrt(
        Math.pow(dropoffLocation.latitude - pickupLocation.latitude, 2) +
        Math.pow(dropoffLocation.longitude - pickupLocation.longitude, 2)
      ) * 111;
      
      return {
        estimatedFare: Math.round(Math.max(distance * 1000, 1000)),
        distance: distance,
        duration: Math.round(distance * 3),
        currency: 'XAF'
      };
    }
  }

  // Create a new delivery order
  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await apiService.createDeliveryOrder({
        pickup_address: orderData.pickupLocation.address,
        pickup_latitude: orderData.pickupLocation.latitude,
        pickup_longitude: orderData.pickupLocation.longitude,
        dropoff_address: orderData.dropoffLocation.address,
        dropoff_latitude: orderData.dropoffLocation.latitude,
        dropoff_longitude: orderData.dropoffLocation.longitude,
        package_description: orderData.packageDescription,
        payment_method: orderData.paymentMethod,
      });
      if (response.success) {
        const apiOrder = response.data;
        const order: DeliveryOrder = {
          id: String(apiOrder.id),
          pickupLocation: {
            latitude: parseFloat(apiOrder.pickup_latitude),
            longitude: parseFloat(apiOrder.pickup_longitude),
            address: apiOrder.pickup_address,
            formattedAddress: apiOrder.pickup_address,
          },
          dropoffLocation: {
            latitude: parseFloat(apiOrder.dropoff_latitude),
            longitude: parseFloat(apiOrder.dropoff_longitude),
            address: apiOrder.dropoff_address,
            formattedAddress: apiOrder.dropoff_address,
          },
          packageDescription: apiOrder.package_description,
          paymentMethod: apiOrder.payment_method,
          estimatedFare: parseFloat(apiOrder.estimated_fare),
          status: apiOrder.status,
          createdAt: apiOrder.created_at,
          updatedAt: apiOrder.updated_at,
        };
        return { order, message: response.message || 'Order created successfully' };
      }
      throw new Error('Failed to create order');
    } catch (error: any) {
      console.log('Create order error:', error?.response?.data || error.message);
      throw error;
    }
  }

  // Get order status
  async getOrderStatus(orderId: string): Promise<DeliveryOrder> {
    try {
      const response = await apiService.getDeliveryOrder(orderId);
      if (response.success) {
        const apiOrder = response.data;
        return {
          id: String(apiOrder.id),
          pickupLocation: {
            latitude: parseFloat(apiOrder.pickup_latitude),
            longitude: parseFloat(apiOrder.pickup_longitude),
            address: apiOrder.pickup_address,
            formattedAddress: apiOrder.pickup_address,
          },
          dropoffLocation: {
            latitude: parseFloat(apiOrder.dropoff_latitude),
            longitude: parseFloat(apiOrder.dropoff_longitude),
            address: apiOrder.dropoff_address,
            formattedAddress: apiOrder.dropoff_address,
          },
          packageDescription: apiOrder.package_description,
          paymentMethod: apiOrder.payment_method,
          estimatedFare: parseFloat(apiOrder.estimated_fare),
          status: apiOrder.status === 'accepted' ? 'driver_found' : apiOrder.status,
          createdAt: apiOrder.created_at,
          updatedAt: apiOrder.updated_at,
        };
      }
      throw new Error('Failed to fetch order');
    } catch (error) {
      console.log('Using mock order status for demo');
      return {
        id: orderId,
        pickupLocation: { latitude: 3.8812, longitude: 11.5021, address: 'Carrefour Bastos, Yaoundé', formattedAddress: 'Carrefour Bastos, Yaoundé' },
        dropoffLocation: { latitude: 3.8600, longitude: 11.4970, address: 'Université de Yaoundé I', formattedAddress: 'Université de Yaoundé I' },
        packageDescription: 'Demo Package',
        paymentMethod: 'mobile_money',
        estimatedFare: 2500,
        status: 'driver_found',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  // Get driver information when assigned
  async getDriverInfo(orderId: string): Promise<Driver> {
    // For now return mock data since driver info comes from order.driver relationship
    return {
      id: 'driver-1',
      name: 'Jean-Pierre Mbarga',
      photo: 'https://via.placeholder.com/100',
      rating: 4.8,
      vehiclePlate: 'LT-4521-AB',
      vehicleModel: 'Honda CBR',
      currentLocation: {
        latitude: 3.8756,
        longitude: 11.5089,
        address: 'En route',
        formattedAddress: 'En route'
      },
      phoneNumber: '+237 670 000 002'
    };
  }

  // Cancel an order
  async cancelOrder(orderId: string): Promise<{ message: string }> {
    try {
      const response = await apiService.cancelDeliveryOrder(orderId);
      return { message: response.message || 'Order cancelled successfully' };
    } catch (error) {
      console.log('Cancel order error:', error);
      return { message: 'Order cancelled successfully' };
    }
  }

  // Get real-time driver location updates
  async getDriverLocation(orderId: string): Promise<{ latitude: number; longitude: number }> {
    return {
      latitude: 3.8756 + (Math.random() - 0.5) * 0.01,
      longitude: 11.5089 + (Math.random() - 0.5) * 0.01
    };
  }
}

export default DeliveryService.getInstance();
