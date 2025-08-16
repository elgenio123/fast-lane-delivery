import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Header } from '../../components/common/Header';
import { OrderCard } from '../../components/delivery/OrderCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useDeliveryStore } from '../../stores/deliveryStore';
import { usePropertyStore } from '../../stores/propertyStore';

export default function ActivityScreen() {
  const [activeTab, setActiveTab] = useState<'deliveries' | 'bookings'>('deliveries');
  const [refreshing, setRefreshing] = useState(false);
  
  const { orders, isLoading: deliveryLoading, fetchOrders } = useDeliveryStore();
  const { bookings, fetchBookings } = usePropertyStore();

  useEffect(() => {
    fetchOrders();
    fetchBookings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchOrders(), fetchBookings()]);
    setRefreshing(false);
  };

  const handleOrderPress = (orderId: string) => {
    router.push(`/delivery/tracking/${orderId}`);
  };

  const handleBookingPress = (bookingId: string) => {
    router.push(`/booking/details/${bookingId}`);
  };

  const renderDeliveries = () => {
    if (deliveryLoading) {
      return <LoadingSpinner />;
    }

    if (orders.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No deliveries yet</Text>
          <Text style={styles.emptyText}>
            Your delivery orders will appear here once you place them.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/delivery/set-locations')}
          >
            <Text style={styles.emptyButtonText}>Order a Delivery</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onPress={() => handleOrderPress(order.id)}
          />
        ))}
      </ScrollView>
    );
  };

  const renderBookings = () => {
    if (bookings.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyText}>
            Your guesthouse bookings will appear here once you make them.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/(tabs)/browse')}
          >
            <Text style={styles.emptyButtonText}>Browse Guesthouses</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {bookings.map((booking) => (
          <TouchableOpacity
            key={booking.id}
            style={styles.bookingCard}
            onPress={() => handleBookingPress(booking.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.bookingPropertyName}>{booking.property.name}</Text>
            <Text style={styles.bookingDates}>
              {new Date(booking.checkInDate).toLocaleDateString()} - {' '}
              {new Date(booking.checkOutDate).toLocaleDateString()}
            </Text>
            <View style={styles.bookingFooter}>
              <Text style={styles.bookingPrice}>${booking.totalPrice}</Text>
              <Text style={[styles.bookingStatus, { color: getBookingStatusColor(booking.status) }]}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.warning;
      case 'confirmed':
        return Colors.primary;
      case 'completed':
        return Colors.success;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.grey;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="My Activity" showBack={true} />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'deliveries' && styles.activeTab]}
          onPress={() => setActiveTab('deliveries')}
        >
          <Text style={[styles.tabText, activeTab === 'deliveries' && styles.activeTabText]}>
            Deliveries
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'bookings' && styles.activeTab]}
          onPress={() => setActiveTab('bookings')}
        >
          <Text style={[styles.tabText, activeTab === 'bookings' && styles.activeTabText]}>
            Bookings
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === 'deliveries' ? renderDeliveries() : renderBookings()}
        </ScrollView>
      </View>
    </View>
  );
}

const getBookingStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return Colors.warning;
    case 'confirmed':
      return Colors.primary;
    case 'completed':
      return Colors.success;
    case 'cancelled':
      return Colors.error;
    default:
      return Colors.grey;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Fonts.sizes.xxxl,
    fontFamily: Fonts.bold,
    color: Colors.black,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.grey,
  },
  activeTabText: {
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  listContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.white,
  },
  bookingCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bookingPropertyName: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.black,
    marginBottom: 4,
  },
  bookingDates: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    marginBottom: 12,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingPrice: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  bookingStatus: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
  },
});