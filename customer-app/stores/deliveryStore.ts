import { create } from 'zustand';
import { DeliveryOrder } from '../types';
import { apiService } from '../services/api';

interface DeliveryState {
  orders: DeliveryOrder[];
  activeOrder: DeliveryOrder | null;
  isLoading: boolean;
  createOrder: (orderData: any) => Promise<boolean>;
  fetchOrders: () => Promise<void>;
  setActiveOrder: (order: DeliveryOrder | null) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
}

// Map backend order data to frontend DeliveryOrder type
function mapApiOrder(apiOrder: any): DeliveryOrder {
  return {
    id: String(apiOrder.id),
    description: apiOrder.package_description,
    pickupLocation: {
      latitude: parseFloat(apiOrder.pickup_latitude),
      longitude: parseFloat(apiOrder.pickup_longitude),
      address: apiOrder.pickup_address,
    },
    dropoffLocation: {
      latitude: parseFloat(apiOrder.dropoff_latitude),
      longitude: parseFloat(apiOrder.dropoff_longitude),
      address: apiOrder.dropoff_address,
    },
    status: apiOrder.status === 'accepted' ? 'confirmed' : apiOrder.status,
    price: parseFloat(apiOrder.estimated_fare),
    paymentMethod: apiOrder.payment_method,
    driverId: apiOrder.driver_id ? String(apiOrder.driver_id) : undefined,
    driver: apiOrder.driver ? {
      id: String(apiOrder.driver.id),
      name: apiOrder.driver.name,
      phone: apiOrder.driver.phone_number,
      rating: 4.8,
      vehicleType: 'motorcycle',
      vehicleNumber: 'LT-4521-AB',
    } : undefined,
    createdAt: apiOrder.created_at,
  };
}

export const useDeliveryStore = create<DeliveryState>((set, get) => ({
  orders: [],
  activeOrder: null,
  isLoading: false,

  createOrder: async (orderData) => {
    try {
      set({ isLoading: true });
      const response = await apiService.createDeliveryOrder(orderData);
      if (response.success) {
        const newOrder = mapApiOrder(response.data);
        set((state) => ({
          orders: [newOrder, ...state.orders],
          activeOrder: newOrder,
          isLoading: false,
        }));
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error('Create order error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  fetchOrders: async () => {
    try {
      set({ isLoading: true });
      const response = await apiService.getDeliveryOrders();
      if (response.success) {
        const orders = (response.data || []).map(mapApiOrder);
        set({
          orders,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      set({ isLoading: false });
    }
  },

  setActiveOrder: (order) => {
    set({ activeOrder: order });
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
      activeOrder: state.activeOrder?.id === orderId
        ? { ...state.activeOrder, status }
        : state.activeOrder,
    }));
  },
}));