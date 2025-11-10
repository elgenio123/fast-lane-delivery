import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Header } from '../../components/common/Header';

const { width } = Dimensions.get('window');

interface OrderHistoryItem {
  id: string;
  type: 'delivery' | 'guesthouse';
  status: 'completed' | 'cancelled' | 'refunded';
  title: string;
  subtitle: string;
  date: string;
  amount: number;
  currency: string;
  image?: string;
  details: {
    pickup?: string;
    dropoff?: string;
    packageDescription?: string;
    guesthouseName?: string;
    checkIn?: string;
    checkOut?: string;
    nights?: number;
  };
  rating?: number;
  review?: string;
}

export default function OrderHistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'delivery' | 'guesthouse'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for order history
  const orderHistory: OrderHistoryItem[] = [
    {
      id: '1',
      type: 'delivery',
      status: 'completed',
      title: 'Package Delivery',
      subtitle: 'From Akwa to Bonanjo',
      date: '2024-12-15',
      amount: 2500,
      currency: 'XAF',
      details: {
        pickup: 'Akwa, Douala',
        dropoff: 'Bonanjo, Douala',
        packageDescription: 'Documents and small package',
      },
      rating: 5,
      review: 'Excellent service! Driver was very professional and delivered on time.',
    },
    {
      id: '2',
      type: 'guesthouse',
      status: 'completed',
      title: 'Guesthouse Booking',
      subtitle: 'Comfort Inn Douala',
      date: '2024-12-10',
      amount: 45000,
      currency: 'XAF',
      details: {
        guesthouseName: 'Comfort Inn Douala',
        checkIn: '2024-12-10',
        checkOut: '2024-12-12',
        nights: 2,
      },
      rating: 4,
      review: 'Great accommodation, clean rooms and friendly staff.',
    },
    {
      id: '3',
      type: 'delivery',
      status: 'completed',
      title: 'Food Delivery',
      subtitle: 'From Restaurant to Home',
      date: '2024-12-08',
      amount: 1800,
      currency: 'XAF',
      details: {
        pickup: 'Restaurant Central, Douala',
        dropoff: 'Home Address, Douala',
        packageDescription: 'Food order - 2 meals',
      },
      rating: 5,
      review: 'Food arrived hot and fresh. Very satisfied with the service!',
    },
    {
      id: '4',
      type: 'guesthouse',
      status: 'cancelled',
      title: 'Guesthouse Booking',
      subtitle: 'Hotel Plaza',
      date: '2024-12-05',
      amount: 35000,
      currency: 'XAF',
      details: {
        guesthouseName: 'Hotel Plaza',
        checkIn: '2024-12-05',
        checkOut: '2024-12-07',
        nights: 2,
      },
    },
    {
      id: '5',
      type: 'delivery',
      status: 'completed',
      title: 'Electronics Delivery',
      subtitle: 'From Store to Office',
      date: '2024-12-03',
      amount: 3200,
      currency: 'XAF',
      details: {
        pickup: 'Electronics Store, Douala',
        dropoff: 'Office Building, Douala',
        packageDescription: 'Laptop and accessories',
      },
      rating: 4,
      review: 'Safe delivery of expensive items. Driver was careful.',
    },
    {
      id: '6',
      type: 'guesthouse',
      status: 'refunded',
      title: 'Guesthouse Booking',
      subtitle: 'City Lodge',
      date: '2024-11-28',
      amount: 28000,
      currency: 'XAF',
      details: {
        guesthouseName: 'City Lodge',
        checkIn: '2024-11-28',
        checkOut: '2024-11-30',
        nights: 2,
      },
    },
  ];

  const filteredOrders = useMemo(() => {
    if (selectedFilter === 'all') return orderHistory;
    return orderHistory.filter(order => order.type === selectedFilter);
  }, [selectedFilter, orderHistory]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'cancelled':
        return Colors.error;
      case 'refunded':
        return Colors.warning;
      default:
        return Colors.grey;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'cancelled':
        return 'close-circle';
      case 'refunded':
        return 'refresh-circle';
      default:
        return 'help-circle';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delivery':
        return 'car-outline';
      case 'guesthouse':
        return 'bed-outline';
      default:
        return 'cube-outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'delivery':
        return Colors.primary;
      case 'guesthouse':
        return Colors.secondary;
      default:
        return Colors.accent;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  const renderOrderItem = ({ item }: { item: OrderHistoryItem }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => {
        // Navigate to order details
        Alert.alert('Order Details', `Viewing details for ${item.title}`);
      }}
      activeOpacity={0.8}
    >
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderTypeContainer}>
          <View style={[styles.orderTypeIcon, { backgroundColor: getTypeColor(item.type) }]}>
            <Ionicons name={getTypeIcon(item.type) as any} size={20} color={Colors.white} />
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>{item.title}</Text>
            <Text style={styles.orderSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
        
        <View style={styles.orderStatusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Ionicons name={getStatusIcon(item.status) as any} size={16} color={Colors.white} />
            <Text style={styles.statusText}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
          </View>
        </View>
      </View>

      {/* Order Details */}
      <View style={styles.orderDetails}>
        {item.type === 'delivery' && (
          <>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color={Colors.grey} />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>From: </Text>
                {item.details.pickup}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={16} color={Colors.primary} />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>To: </Text>
                {item.details.dropoff}
              </Text>
            </View>
            {item.details.packageDescription && (
              <View style={styles.detailRow}>
                <Ionicons name="cube-outline" size={16} color={Colors.grey} />
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Package: </Text>
                  {item.details.packageDescription}
                </Text>
              </View>
            )}
          </>
        )}

        {item.type === 'guesthouse' && (
          <>
            <View style={styles.detailRow}>
              <Ionicons name="bed-outline" size={16} color={Colors.secondary} />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Property: </Text>
                {item.details.guesthouseName}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color={Colors.grey} />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Check-in: </Text>
                {formatDate(item.details.checkIn || '')}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} color={Colors.primary} />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Check-out: </Text>
                {formatDate(item.details.checkOut || '')}
                {item.details.nights && ` (${item.details.nights} nights)`}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Order Footer */}
      <View style={styles.orderFooter}>
        <View style={styles.orderMeta}>
          <Text style={styles.orderDate}>{formatDate(item.date)}</Text>
          <Text style={styles.orderAmount}>{formatAmount(item.amount, item.currency)}</Text>
        </View>

        {/* Rating and Review */}
        {item.rating && (
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= item.rating! ? 'star' : 'star-outline'}
                  size={16}
                  color={star <= item.rating! ? Colors.warning : Colors.grey}
                />
              ))}
            </View>
            {item.review && (
              <Text style={styles.reviewText} numberOfLines={2}>
                "{item.review}"
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="receipt-outline" size={64} color={Colors.grey} />
      </View>
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptySubtitle}>
        {selectedFilter === 'all'
          ? "You haven't placed any orders yet. Start by ordering a delivery or booking a guesthouse!"
          : `You haven't placed any ${selectedFilter} orders yet.`}
      </Text>
      <TouchableOpacity
        style={styles.emptyActionButton}
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={styles.emptyActionButtonText}>Start Ordering</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Order History" showBack={true} />

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'all' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterTabText, selectedFilter === 'all' && styles.filterTabTextActive]}>
              All Orders
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'delivery' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('delivery')}
          >
            <Ionicons 
              name="car-outline" 
              size={16} 
              color={selectedFilter === 'delivery' ? Colors.white : Colors.primary} 
            />
            <Text style={[styles.filterTabText, selectedFilter === 'delivery' && styles.filterTabTextActive]}>
              Deliveries
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'guesthouse' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('guesthouse')}
          >
            <Ionicons 
              name="bed-outline" 
              size={16} 
              color={selectedFilter === 'guesthouse' ? Colors.white : Colors.secondary} 
            />
            <Text style={[styles.filterTabText, selectedFilter === 'guesthouse' && styles.filterTabTextActive]}>
              Guesthouses
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Order Count */}
      <View style={styles.orderCountContainer}>
        <Text style={styles.orderCountText}>
          {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'} Found
        </Text>
      </View>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <ScrollView 
          contentContainerStyle={styles.emptyStateContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {renderEmptyState()}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 25,
    backgroundColor: Colors.lightGrey,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTabText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.grey,
    marginLeft: 6,
  },
  filterTabTextActive: {
    color: Colors.white,
  },
  orderCountContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  orderCountText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
  ordersList: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.black,
    marginBottom: 4,
  },
  orderSubtitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
  orderStatusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.medium,
    color: Colors.white,
    marginLeft: 4,
  },
  orderDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.black,
    marginLeft: 8,
    flex: 1,
  },
  detailLabel: {
    fontFamily: Fonts.medium,
    color: Colors.grey,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderDate: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
  orderAmount: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  ratingContainer: {
    backgroundColor: Colors.lightPrimary,
    padding: 12,
    borderRadius: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  reviewText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.black,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyActionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  emptyActionButtonText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.white,
  },
});
