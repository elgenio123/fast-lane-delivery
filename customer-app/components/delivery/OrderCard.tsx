import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DeliveryOrder } from '../../types';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';

interface OrderCardProps {
  order: DeliveryOrder;
  onPress: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.warning;
      case 'confirmed':
      case 'picked_up':
      case 'in_transit':
        return Colors.primary;
      case 'delivered':
        return Colors.success;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.grey;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'picked_up':
        return 'Picked Up';
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(order.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusText(order.status)}
          </Text>
        </View>
        <Text style={styles.price}>${order.price.toFixed(2)}</Text>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {order.description}
      </Text>

      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={Colors.success} />
          <Text style={styles.locationText} numberOfLines={1}>
            {order.pickupLocation.address}
          </Text>
        </View>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={Colors.error} />
          <Text style={styles.locationText} numberOfLines={1}>
            {order.dropoffLocation.address}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.dateText}>
          {new Date(order.createdAt).toLocaleDateString()}
        </Text>
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <Ionicons name="chevron-forward-outline" size={20} color={Colors.grey} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
  },
  price: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  description: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.darkGrey,
    marginBottom: 12,
  },
  locationContainer: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
});