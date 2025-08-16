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

export const useDeliveryStore = create<DeliveryState>((set, get) => ({
  orders: [],
  activeOrder: null,
  isLoading: false,

  createOrder: async (orderData) => {
    try {
      set({ isLoading: true });
      const response = await apiService.createDeliveryOrder(orderData);
      if (response.success) {
        const newOrder = response.data;
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
        set({
          orders: response.data,
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