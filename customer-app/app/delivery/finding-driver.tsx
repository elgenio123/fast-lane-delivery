import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import deliveryService from '../../services/deliveryService';

const { width, height } = Dimensions.get('window');

export default function FindingDriverScreen() {
  const params = useLocalSearchParams();
  const orderId = params.orderId as string || 'demo-order-123'; // Provide default order ID for demo
  
  const [searchTime, setSearchTime] = useState(0);
  const [isSearching, setIsSearching] = useState(true);
  const [searchStatus, setSearchStatus] = useState('Connecting to nearby drivers...');
  
  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const radarAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const searchInterval = useRef<number | null>(null);
  const statusInterval = useRef<number | null>(null);

  useEffect(() => {
    // Remove order ID check - always proceed for demo
    startSearchAnimation();
    startDriverSearch();
    startStatusUpdates();

    return () => {
      if (searchInterval.current) clearInterval(searchInterval.current);
      if (statusInterval.current) clearInterval(statusInterval.current);
    };
  }, []);

  const startSearchAnimation = () => {
    // Pulsing animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Radar animation
    const radarAnimation = Animated.loop(
      Animated.timing(radarAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    radarAnimation.start();

    // Rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();
  };

  const startDriverSearch = () => {
    // Simulate driver search process
    searchInterval.current = setInterval(() => {
      setSearchTime(prev => prev + 1);
      
      // Simulate finding a driver after 10-15 seconds
      if (searchTime >= 10 && Math.random() > 0.7) {
        simulateDriverFound();
      }
    }, 1000);
  };

  const startStatusUpdates = () => {
    const statuses = [
      'Connecting to nearby drivers...',
      'Searching for available drivers...',
      'Checking driver availability...',
      'Locating drivers in your area...',
      'Almost there...',
    ];

    let statusIndex = 0;
    statusInterval.current = setInterval(() => {
      setSearchStatus(statuses[statusIndex % statuses.length]);
      statusIndex++;
    }, 3000);
  };

  const simulateDriverFound = () => {
    setIsSearching(false);
    setSearchStatus('Driver found! Redirecting...');
    
    // Navigate to live tracking after a short delay
    setTimeout(() => {
      router.push({
        pathname: '/delivery/live-tracking',
        params: { orderId: orderId }
      });
    }, 2000);
  };

  const handleCancelOrder = async () => {
    try {
      // Simulate order cancellation
      await deliveryService.cancelOrder(orderId);
      Alert.alert('Order Cancelled', 'Your order has been cancelled successfully.');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to cancel order.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
        <Text style={styles.headerTitle}>Finding Driver</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Search Animation */}
        <View style={styles.animationContainer}>
          <Animated.View
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={styles.centerIcon}>
              <Ionicons name="car" size={40} color={Colors.white} />
            </View>
          </Animated.View>

          {/* Radar Effect */}
          <Animated.View
            style={[
              styles.radarCircle,
              {
                opacity: radarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 0],
                }),
                transform: [
                  {
                    scale: radarAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 2.5],
                    }),
                  },
                ],
              },
            ]}
          />

          {/* Rotating Dots */}
          <View style={styles.rotatingDots}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    transform: [
                      {
                        rotate: rotateAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [`${index * 60}deg`, `${(index * 60) + 360}deg`],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Status Information */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{searchStatus}</Text>
          <Text style={styles.timeText}>Search time: {formatTime(searchTime)}</Text>
        </View>

        {/* Progress Indicators */}
        <View style={styles.progressContainer}>
          <View style={styles.progressStep}>
            <View style={styles.progressIcon}>
              <Ionicons name="checkmark" size={16} color={Colors.white} />
            </View>
            <Text style={styles.progressText}>Order Placed</Text>
          </View>

          <View style={styles.progressLine} />

          <View style={styles.progressStep}>
            <View style={[styles.progressIcon, styles.progressIconActive]}>
              <Ionicons name="car" size={16} color={Colors.white} />
            </View>
            <Text style={[styles.progressText, styles.progressTextActive]}>Finding Driver</Text>
          </View>

          <View style={styles.progressLine} />

          <View style={styles.progressStep}>
            <View style={styles.progressIcon}>
              <Ionicons name="location" size={16} color={Colors.white} />
            </View>
            <Text style={styles.progressText}>Driver En Route</Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Tips for faster service:</Text>
          <Text style={styles.tipText}>• Make sure you're at the pickup location</Text>
          <Text style={styles.tipText}>• Have your package ready</Text>
          <Text style={styles.tipText}>• Keep your phone nearby</Text>
        </View>
      </View>

      {/* Cancel Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelOrder}
        >
          <Ionicons name="close-circle" size={20} color={Colors.error} />
          <Text style={styles.cancelButtonText}>Cancel Order</Text>
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
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: Fonts.sizes.xxl,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 8,
  },
  placeholder: {
    width: 50, // Placeholder for back button
  },
  content: {
    flex: 1,
    padding: 20,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    position: 'relative',
  },
  pulseCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  centerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarCircle: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  rotatingDots: {
    position: 'absolute',
    width: 300,
    height: 300,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    top: 0,
    left: '50%',
    marginLeft: -4,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  statusText: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressIconActive: {
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  progressTextActive: {
    color: Colors.white,
  },
  progressLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.border,
    marginLeft: 15,
    marginBottom: 20,
  },
  tipsContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipsTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 12,
  },
  tipText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    lineHeight: 20,
    marginBottom: 8,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: Colors.error,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  cancelButtonText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.bold,
    color: Colors.error,
    marginLeft: 8,
  },
});
