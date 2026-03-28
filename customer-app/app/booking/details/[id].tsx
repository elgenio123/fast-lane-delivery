import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { Fonts } from '../../../constants/Fonts';
import { usePropertyStore } from '../../../stores/propertyStore';
import { Booking } from '../../../types';

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookings } = usePropertyStore();
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Booking not found</Text>
        </View>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return Colors.primary;
      case 'completed': return Colors.success;
      case 'cancelled': return Colors.error;
      default: return Colors.warning;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.propertyName}>{booking.property.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dates</Text>
          <View style={styles.dateRow}>
            <View style={styles.dateItem}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Check-in</Text>
                <Text style={styles.dateValue}>{formatDate(booking.checkInDate)}</Text>
              </View>
            </View>
            <Ionicons name="arrow-forward" size={20} color={Colors.grey} />
            <View style={styles.dateItem}>
              <Ionicons name="calendar-outline" size={20} color={Colors.error} />
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Check-out</Text>
                <Text style={styles.dateValue}>{formatDate(booking.checkOutDate)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Total Price</Text>
            <Text style={styles.paymentValue}>{booking.totalPrice.toLocaleString()} XAF</Text>
          </View>
        </View>

        {booking.createdAt && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Booked On</Text>
            <Text style={styles.bookedDate}>{formatDate(booking.createdAt)}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: Colors.white,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.black },
  scrollView: { flex: 1, padding: 20 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  propertyName: { fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold, color: Colors.black, marginBottom: 12 },
  statusBadge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  statusText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold },
  sectionTitle: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.black, marginBottom: 12 },
  dateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateItem: { flexDirection: 'row', alignItems: 'center' },
  dateInfo: { marginLeft: 8 },
  dateLabel: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.grey },
  dateValue: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.black },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentLabel: { fontSize: Fonts.sizes.md, fontFamily: Fonts.regular, color: Colors.grey },
  paymentValue: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.primary },
  bookedDate: { fontSize: Fonts.sizes.md, fontFamily: Fonts.regular, color: Colors.darkGrey },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.medium, color: Colors.grey },
});
