import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Location } from '../../types/delivery';
import deliveryService from '../../services/deliveryService';
import locationService from '../../services/locationService';

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams();
  
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [packageDescription, setPackageDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'cash'>('mobile_money');
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [isLoadingFare, setIsLoadingFare] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Parse location data from route params
    if (params.pickupLat && params.pickupLng && params.pickupAddress) {
      setPickupLocation({
        latitude: parseFloat(params.pickupLat as string),
        longitude: parseFloat(params.pickupLng as string),
        address: params.pickupAddress as string,
        formattedAddress: params.pickupAddress as string,
      });
    }

    if (params.dropoffLat && params.dropoffLng && params.dropoffAddress) {
      setDropoffLocation({
        latitude: parseFloat(params.dropoffLat as string),
        longitude: parseFloat(params.dropoffLng as string),
        address: params.dropoffAddress as string,
        formattedAddress: params.dropoffAddress as string,
      });
    }

    // Get estimated fare once locations are set
    if (params.pickupLat && params.pickupLng && params.dropoffLat && params.dropoffLng) {
      getEstimatedFare();
    }
  }, [params]);

  const getEstimatedFare = async () => {
    if (!pickupLocation || !dropoffLocation) return;

    setIsLoadingFare(true);
    try {
      const fareResponse = await deliveryService.getEstimatedFare(
        { latitude: pickupLocation.latitude, longitude: pickupLocation.longitude },
        { latitude: dropoffLocation.latitude, longitude: dropoffLocation.longitude }
      );
      setEstimatedFare(fareResponse.estimatedFare);
    } catch (error) {
      console.error('Error getting estimated fare:', error);
      // Set a default fare for demo purposes
      const distance = locationService.calculateDistance(
        pickupLocation.latitude,
        pickupLocation.longitude,
        dropoffLocation.latitude,
        dropoffLocation.longitude
      );
      setEstimatedFare(Math.round(distance * 1000)); // 1000 per km
    } finally {
      setIsLoadingFare(false);
    }
  };

  const handlePlaceOrder = async () => {
    // For demo purposes, always allow order placement
    // Create mock data if any fields are missing
    const finalPackageDescription = packageDescription.trim() || 'Demo Package';
    const finalEstimatedFare = estimatedFare || 2500; // Default fare

    setIsSubmitting(true);
    try {
      const orderData = {
        pickupLocation: pickupLocation!,
        dropoffLocation: dropoffLocation!,
        packageDescription: finalPackageDescription,
        paymentMethod,
      };

      // For demo, create a mock response
      const mockResponse = {
        order: {
          id: 'demo-order-' + Date.now(),
          pickupLocation: pickupLocation!,
          dropoffLocation: dropoffLocation!,
          packageDescription: finalPackageDescription,
          paymentMethod,
          estimatedFare: finalEstimatedFare,
          status: 'pending' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        message: 'Order created successfully'
      };
      
      Alert.alert(
        'Order Created!',
        'Your delivery order has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to finding driver screen
              router.push({
                pathname: '/delivery/finding-driver',
                params: { orderId: mockResponse.order.id },
              });
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Always allow order placement for demo
  const canPlaceOrder = true;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Location Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Summary</Text>
          
          <View style={styles.locationCard}>
            <View style={styles.locationRow}>
              <View style={[styles.locationIcon, { backgroundColor: Colors.accent }]}>
                <Ionicons name="location" size={20} color={Colors.white} />
              </View>
              <View style={styles.locationContent}>
                <Text style={styles.locationLabel}>Pickup</Text>
                <Text style={styles.locationAddress} numberOfLines={2}>
                  {pickupLocation?.formattedAddress || 'Loading...'}
                </Text>
              </View>
            </View>

            <View style={styles.locationDivider} />

            <View style={styles.locationRow}>
              <View style={[styles.locationIcon, { backgroundColor: Colors.secondary }]}>
                <Ionicons name="flag" size={20} color={Colors.white} />
              </View>
              <View style={styles.locationContent}>
                <Text style={styles.locationLabel}>Dropoff</Text>
                <Text style={styles.locationAddress} numberOfLines={2}>
                  {dropoffLocation?.formattedAddress || 'Loading...'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Package Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Package Details</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Package Description *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe your package (e.g., Documents in a brown envelope, Small box with electronics)"
              value={packageDescription}
              onChangeText={setPackageDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={200}
            />
            <Text style={styles.characterCount}>
              {packageDescription.length}/200
            </Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'mobile_money' && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentMethod('mobile_money')}
            >
              <View style={styles.paymentOptionContent}>
                <View style={[styles.paymentIcon, { backgroundColor: Colors.success }]}>
                  <Ionicons name="phone-portrait" size={24} color={Colors.white} />
                </View>
                <View style={styles.paymentText}>
                  <Text style={styles.paymentTitle}>Mobile Money</Text>
                  <Text style={styles.paymentSubtitle}>Pay with MTN, Orange, or other mobile money</Text>
                </View>
              </View>
              {paymentMethod === 'mobile_money' && (
                <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'cash' && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentMethod('cash')}
            >
              <View style={styles.paymentOptionContent}>
                <View style={[styles.paymentIcon, { backgroundColor: Colors.warm }]}>
                  <Ionicons name="cash" size={24} color={Colors.white} />
                </View>
                <View style={styles.paymentText}>
                  <Text style={styles.paymentTitle}>Cash</Text>
                  <Text style={styles.paymentSubtitle}>Pay with cash upon delivery</Text>
                </View>
              </View>
              {paymentMethod === 'cash' && (
                <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Estimated Fare */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estimated Fare</Text>
          <View style={styles.fareCard}>
            {isLoadingFare ? (
              <View style={styles.fareLoading}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.fareLoadingText}>Calculating fare...</Text>
              </View>
            ) : (
              <>
                <View style={styles.fareRow}>
                  <Text style={styles.fareLabel}>Estimated Fare</Text>
                  <Text style={styles.fareAmount}>
                    {estimatedFare ? `₦${estimatedFare.toLocaleString()}` : 'N/A'}
                  </Text>
                </View>
                
                {pickupLocation && dropoffLocation && (
                  <View style={styles.fareRow}>
                    <Text style={styles.fareLabel}>Distance</Text>
                    <Text style={styles.fareSubtext}>
                      {locationService.formatDistance(
                        locationService.calculateDistance(
                          pickupLocation.latitude,
                          pickupLocation.longitude,
                          dropoffLocation.latitude,
                          dropoffLocation.longitude
                        )
                      )}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.placeOrderButtonText}>
              Place Order
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: Colors.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.white,
    marginBottom: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 16,
  },
  locationCard: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    padding: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  locationContent: {
    flex: 1,
  },
  locationLabel: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.grey,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.primary,
    lineHeight: 20,
  },
  locationDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.primary,
    minHeight: 100,
  },
  characterCount: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    textAlign: 'right',
    marginTop: 4,
  },
  paymentOptions: {
    gap: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  paymentOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.lightGrey,
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentText: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 4,
  },
  paymentSubtitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    lineHeight: 18,
  },
  fareCard: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    padding: 20,
  },
  fareLoading: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  fareLoadingText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.grey,
    marginTop: 12,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fareLabel: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  fareAmount: {
    fontSize: Fonts.sizes.xxl,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  fareSubtext: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  placeOrderButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  placeOrderButtonText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
});
