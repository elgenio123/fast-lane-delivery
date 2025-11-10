import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Driver, DeliveryOrder, OrderStatus } from '../../types/delivery';
import deliveryService from '../../services/deliveryService';

const { width, height } = Dimensions.get('window');

export default function LiveTrackingScreen() {
  const params = useLocalSearchParams();
  const orderId = params.orderId as string || 'demo-order-123'; // Provide default order ID for demo
  
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus[]>([]);
  const [currentStatus, setCurrentStatus] = useState<DeliveryOrder['status']>('accepted');
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 6.5244,
    longitude: 3.3792,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const mapRef = useRef<MapView>(null);
  const locationInterval = useRef<number | null>(null);
  const statusInterval = useRef<number | null>(null);

  useEffect(() => {
    // Remove order ID check - always proceed for demo
    loadOrderData();
    startLocationUpdates();
    startStatusUpdates();

    return () => {
      if (locationInterval.current) clearInterval(locationInterval.current);
      if (statusInterval.current) clearInterval(statusInterval.current);
    };
  }, []);

  const loadOrderData = async () => {
    try {
      // Load order details
      const orderData = await deliveryService.getOrderStatus(orderId);
      setOrder(orderData);

      // Load driver information
      const driverData = await deliveryService.getDriverInfo(orderId);
      setDriver(driverData);
      setDriverLocation(driverData.currentLocation);

      // Set initial map region to pickup location
      if (orderData.pickupLocation) {
        setRegion({
          latitude: orderData.pickupLocation.latitude,
          longitude: orderData.pickupLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }

      // Initialize order status
      initializeOrderStatus(orderData.status);
    } catch (error) {
      console.error('Error loading order data:', error);
      // For demo purposes, create mock data
      createMockData();
    }
  };

  const createMockData = () => {
    const mockOrder: DeliveryOrder = {
      id: orderId,
      pickupLocation: {
        latitude: 6.5244,
        longitude: 3.3792,
        address: '123 Main Street, Douala',
        formattedAddress: '123 Main Street, Douala',
      },
      dropoffLocation: {
        latitude: 6.5344,
        longitude: 3.3892,
        address: '456 Business Avenue, Douala',
        formattedAddress: '456 Business Avenue, Douala',
      },
      packageDescription: 'Documents in brown envelope',
      paymentMethod: 'mobile_money',
      estimatedFare: 2500,
      status: 'accepted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockDriver: Driver = {
      id: 'driver-1',
      name: 'John Doe',
      photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.8,
      vehiclePlate: 'ABC-123',
      vehicleModel: 'Toyota Camry 2020',
      currentLocation: {
        latitude: 6.5244,
        longitude: 3.3792,
        address: 'Current driver location',
      },
      phoneNumber: '+237 123 456 789',
    };

    setOrder(mockOrder);
    setDriver(mockDriver);
    setDriverLocation(mockDriver.currentLocation);
  };

  const initializeOrderStatus = (currentStatus: DeliveryOrder['status']) => {
    const statuses: OrderStatus[] = [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        description: 'Order created and waiting for driver',
      },
      {
        status: 'driver_found',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        description: 'Driver assigned to your order',
      },
      {
        status: 'accepted',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        description: 'Driver accepted your order',
      },
    ];

    if (currentStatus === 'pickup') {
      statuses.push({
        status: 'pickup',
        timestamp: new Date().toISOString(),
        description: 'Driver is on the way to pickup location',
      });
    } else if (currentStatus === 'in_transit') {
      statuses.push(
        {
          status: 'pickup',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          description: 'Driver picked up your package',
        },
        {
          status: 'in_transit',
          timestamp: new Date().toISOString(),
          description: 'Package is on the way to destination',
        }
      );
    }

    setOrderStatus(statuses);
    setCurrentStatus(currentStatus);
  };

  const startLocationUpdates = () => {
    locationInterval.current = setInterval(async () => {
      try {
        if (orderId) {
          const location = await deliveryService.getDriverLocation(orderId);
          setDriverLocation(location);
          
          // Update map region to follow driver
          if (mapRef.current && location) {
            mapRef.current.animateToRegion({
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }
      } catch (error) {
        console.error('Error updating driver location:', error);
      }
    }, 5000); // Update every 5 seconds
  };

  const startStatusUpdates = () => {
    statusInterval.current = setInterval(async () => {
      try {
        if (orderId) {
          const orderData = await deliveryService.getOrderStatus(orderId);
          if (orderData.status !== currentStatus) {
            setCurrentStatus(orderData.status);
            initializeOrderStatus(orderData.status);
          }
        }
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }, 10000); // Update every 10 seconds
  };

  const handleCallDriver = () => {
    if (driver?.phoneNumber) {
      Alert.alert(
        'Call Driver',
        `Call ${driver.name}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Call',
            onPress: () => {
              // In a real app, this would use Linking to make a phone call
              Alert.alert('Call', `Calling ${driver.phoneNumber}`);
            },
          },
        ]
      );
    }
  };

  const handleChatDriver = () => {
    // Navigate to chat screen
    Alert.alert('Chat', 'Opening chat with driver...');
  };

  const getStatusIcon = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'driver_found':
        return 'search-outline';
      case 'accepted':
        return 'checkmark-circle-outline';
      case 'pickup':
        return 'cube-outline';
      case 'in_transit':
        return 'car-outline';
      case 'delivered':
        return 'flag-outline';
      default:
        return 'help-outline';
    }
  };

  const getStatusColor = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'pending':
        return Colors.warm;
      case 'driver_found':
        return Colors.secondary;
      case 'accepted':
        return Colors.primary;
      case 'pickup':
        return Colors.accent;
      case 'in_transit':
        return Colors.success;
      case 'delivered':
        return Colors.success;
      default:
        return Colors.grey;
    }
  };

  if (!order || !driver) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading delivery information...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
      >
        {/* Pickup Marker */}
        <Marker
          coordinate={{
            latitude: order.pickupLocation.latitude,
            longitude: order.pickupLocation.longitude,
          }}
          title="Pickup Location"
          description={order.pickupLocation.address}
          pinColor={Colors.accent}
        />

        {/* Dropoff Marker */}
        <Marker
          coordinate={{
            latitude: order.dropoffLocation.latitude,
            longitude: order.dropoffLocation.longitude,
          }}
          title="Dropoff Location"
          description={order.dropoffLocation.address}
          pinColor={Colors.secondary}
        />

        {/* Driver Marker */}
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title={driver.name}
            description={`${driver.vehicleModel} - ${driver.vehiclePlate}`}
            pinColor={Colors.primary}
          />
        )}

        {/* Route Line */}
        {driverLocation && (
          <Polyline
            coordinates={[
              driverLocation,
              { latitude: order.pickupLocation.latitude, longitude: order.pickupLocation.longitude },
              { latitude: order.dropoffLocation.latitude, longitude: order.dropoffLocation.longitude },
            ]}
            strokeColor={Colors.primary}
            strokeWidth={3}
            lineDashPattern={[10, 5]}
          />
        )}
      </MapView>

      {/* Driver Info Card */}
      <View style={styles.driverCard}>
        <View style={styles.driverHeader}>
          <View style={styles.driverInfo}>
            <View style={styles.driverPhotoContainer}>
              <Text style={styles.driverInitials}>
                {driver.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <View style={styles.driverRating}>
                <Ionicons name="star" size={16} color={Colors.warm} />
                <Text style={styles.ratingText}>{driver.rating}</Text>
              </View>
              <Text style={styles.vehicleInfo}>
                {driver.vehicleModel} • {driver.vehiclePlate}
              </Text>
            </View>
          </View>
          
          <View style={styles.driverActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.callButton]}
              onPress={handleCallDriver}
            >
              <Ionicons name="call" size={20} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.chatButton]}
              onPress={handleChatDriver}
            >
              <Ionicons name="chatbubble" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Status */}
        <View style={styles.statusSection}>
          <Text style={styles.statusTitle}>Order Status</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {orderStatus.map((status, index) => (
              <View key={index} style={styles.statusItem}>
                <View style={[
                  styles.statusIcon,
                  { backgroundColor: getStatusColor(status.status) }
                ]}>
                  <Ionicons 
                    name={getStatusIcon(status.status) as any} 
                    size={16} 
                    color={Colors.white} 
                  />
                </View>
                <Text style={styles.statusDescription} numberOfLines={2}>
                  {status.description}
                </Text>
                <Text style={styles.statusTime}>
                  {new Date(status.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
  map: {
    flex: 1,
  },
  driverCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverPhotoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  driverInitials: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 4,
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.grey,
    marginLeft: 4,
  },
  vehicleInfo: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: Colors.success,
  },
  chatButton: {
    backgroundColor: Colors.primary,
  },
  statusSection: {
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 16,
  },
  statusItem: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 80,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.regular,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 14,
  },
  statusTime: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.medium,
    color: Colors.grey,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
