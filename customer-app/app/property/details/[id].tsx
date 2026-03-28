import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { Fonts } from '../../../constants/Fonts';
import { usePropertyStore } from '../../../stores/propertyStore';

const { width } = Dimensions.get('window');

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedProperty: property, createBooking } = usePropertyStore();
  const [isBooking, setIsBooking] = useState(false);

  if (!property) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Property Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Property not found</Text>
        </View>
      </View>
    );
  }

  const handleBookNow = async () => {
    setIsBooking(true);
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 7);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 2);

    const success = await createBooking({
      propertyId: property.id,
      checkInDate: checkIn.toISOString().split('T')[0],
      checkOutDate: checkOut.toISOString().split('T')[0],
    });

    setIsBooking(false);
    if (success) {
      Alert.alert('Booking Created', 'Your booking has been submitted successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{property.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Image
          source={{
            uri:
              property.images[0] ||
              'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=800',
          }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.name}>{property.name}</Text>

          <View style={styles.row}>
            <Ionicons name="location-outline" size={18} color={Colors.grey} />
            <Text style={styles.quarter}>{property.quarter}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="star" size={18} color={Colors.warning} />
            <Text style={styles.rating}>
              {property.rating.toFixed(1)} ({property.reviewCount} reviews)
            </Text>
          </View>

          <Text style={styles.price}>
            {property.pricePerNight.toLocaleString()} XAF
            <Text style={styles.priceUnit}> / night</Text>
          </Text>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{property.description}</Text>

          {property.amenities.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {property.amenities.map((amenity) => (
                  <View key={amenity.id} style={styles.amenityChip}>
                    <Ionicons name={amenity.icon as any} size={16} color={Colors.primary} />
                    <Text style={styles.amenityText}>{amenity.name}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerPrice}>
            {property.pricePerNight.toLocaleString()} XAF
          </Text>
          <Text style={styles.footerPriceUnit}>per night</Text>
        </View>
        <TouchableOpacity
          style={[styles.bookButton, isBooking && styles.bookButtonDisabled]}
          onPress={handleBookNow}
          disabled={isBooking}
        >
          <Text style={styles.bookButtonText}>
            {isBooking ? 'Booking...' : 'Book Now'}
          </Text>
        </TouchableOpacity>
      </View>
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
  headerTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.black, flex: 1, textAlign: 'center' },
  scrollView: { flex: 1 },
  image: { width, height: 250 },
  content: { padding: 20 },
  name: { fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold, color: Colors.black, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  quarter: { fontSize: Fonts.sizes.md, fontFamily: Fonts.regular, color: Colors.grey, marginLeft: 6 },
  rating: { fontSize: Fonts.sizes.md, fontFamily: Fonts.medium, color: Colors.darkGrey, marginLeft: 6 },
  price: { fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold, color: Colors.primary, marginTop: 12, marginBottom: 20 },
  priceUnit: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.grey },
  sectionTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.black, marginBottom: 8, marginTop: 16 },
  description: { fontSize: Fonts.sizes.md, fontFamily: Fonts.regular, color: Colors.darkGrey, lineHeight: 24 },
  amenitiesContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.darkGrey, marginLeft: 6 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerPrice: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.black },
  footerPriceUnit: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.grey },
  bookButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  bookButtonDisabled: { opacity: 0.6 },
  bookButtonText: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.white },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.medium, color: Colors.grey },
});
