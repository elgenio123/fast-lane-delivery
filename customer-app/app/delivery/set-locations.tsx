import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import MapView, { Region, Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Location } from '../../types/delivery';

const { width, height } = Dimensions.get('window');

export default function SetLocationsScreen() {
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [activeInput, setActiveInput] = useState<'pickup' | 'dropoff'>('pickup');
  const [region, setRegion] = useState<Region>({
    latitude: 6.5244, // Default to Douala, Cameroon
    longitude: 3.3792,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    // Set default pickup location for demo
    const defaultLocation: Location = {
      latitude: 6.5244,
      longitude: 3.3792,
      address: 'Douala, Cameroon',
      formattedAddress: 'Douala, Cameroon'
    };
    setPickupLocation(defaultLocation);
    setPickupAddress('Douala, Cameroon');
  }, []);

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
    if (activeInput === 'pickup') {
      const newLocation: Location = {
        latitude,
        longitude,
        address: `Pickup at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        formattedAddress: `Pickup at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
      };
      setPickupLocation(newLocation);
      setPickupAddress(newLocation.address);
    } else {
      const newLocation: Location = {
        latitude,
        longitude,
        address: `Dropoff at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        formattedAddress: `Dropoff at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
      };
      setDropoffLocation(newLocation);
      setDropoffAddress(newLocation.address);
    }
  };

  const handleAddressInput = (text: string, type: 'pickup' | 'dropoff') => {
    if (type === 'pickup') {
      setPickupAddress(text);
      // Generate mock coordinates for demo
      const mockLocation: Location = {
        latitude: 6.5244 + (Math.random() - 0.5) * 0.01,
        longitude: 3.3792 + (Math.random() - 0.5) * 0.01,
        address: text,
        formattedAddress: text
      };
      setPickupLocation(mockLocation);
    } else {
      setDropoffAddress(text);
      // Generate mock coordinates for demo
      const mockLocation: Location = {
        latitude: 6.5344 + (Math.random() - 0.5) * 0.01,
        longitude: 3.3892 + (Math.random() - 0.5) * 0.01,
        address: text,
        formattedAddress: text
      };
      setDropoffLocation(mockLocation);
    }
  };

  const handleContinue = () => {
    // For demo purposes, always allow continuation
    // Create mock locations if none exist
    let finalPickup = pickupLocation;
    let finalDropoff = dropoffLocation;

    if (!finalPickup) {
      finalPickup = {
        latitude: 6.5244,
        longitude: 3.3792,
        address: 'Demo Pickup Location',
        formattedAddress: 'Demo Pickup Location'
      };
    }

    if (!finalDropoff) {
      finalDropoff = {
        latitude: 6.5344,
        longitude: 3.3892,
        address: 'Demo Dropoff Location',
        formattedAddress: 'Demo Dropoff Location'
      };
    }

    // Navigate to order details with locations
    router.push({
      pathname: '/delivery/order-details',
      params: {
        pickupLat: finalPickup.latitude.toString(),
        pickupLng: finalPickup.longitude.toString(),
        pickupAddress: finalPickup.address,
        dropoffLat: finalDropoff.latitude.toString(),
        dropoffLng: finalDropoff.longitude.toString(),
        dropoffAddress: finalDropoff.address,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set Locations</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Location Inputs */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity
            style={[
              styles.inputButton,
              activeInput === 'pickup' && styles.activeInputButton
            ]}
            onPress={() => setActiveInput('pickup')}
          >
            <Ionicons 
              name="location" 
              size={20} 
              color={activeInput === 'pickup' ? Colors.primary : Colors.grey} 
            />
            <Text style={[
              styles.inputButtonText,
              activeInput === 'pickup' && styles.activeInputButtonText
            ]}>
              Pickup Location
            </Text>
          </TouchableOpacity>
          
          <TextInput
            style={styles.addressInput}
            placeholder="Enter pickup address or tap on map"
            value={pickupAddress}
            onChangeText={(text) => handleAddressInput(text, 'pickup')}
          />
        </View>

        <View style={styles.inputWrapper}>
          <TouchableOpacity
            style={[
              styles.inputButton,
              activeInput === 'dropoff' && styles.activeInputButton
            ]}
            onPress={() => setActiveInput('dropoff')}
          >
            <Ionicons 
              name="location-outline" 
              size={20} 
              color={activeInput === 'dropoff' ? Colors.primary : Colors.grey} 
            />
            <Text style={[
              styles.inputButtonText,
              activeInput === 'dropoff' && styles.activeInputButtonText
            ]}>
              Dropoff Location
            </Text>
          </TouchableOpacity>
          
          <TextInput
            style={styles.addressInput}
            placeholder="Enter dropoff address or tap on map"
            value={dropoffAddress}
            onChangeText={(text) => handleAddressInput(text, 'dropoff')}
          />
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onPress={handleMapPress}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
        >
          {pickupLocation && (
            <Marker
              coordinate={{
                latitude: pickupLocation.latitude,
                longitude: pickupLocation.longitude,
              }}
              title="Pickup Location"
              description={pickupLocation.address}
              pinColor={Colors.primary}
            />
          )}
          
          {dropoffLocation && (
            <Marker
              coordinate={{
                latitude: dropoffLocation.latitude,
                longitude: dropoffLocation.longitude,
              }}
              title="Dropoff Location"
              description={dropoffLocation.address}
              pinColor={Colors.success}
            />
          )}
        </MapView>

        {/* Map Instructions */}
        <View style={styles.mapInstructions}>
          <Text style={styles.instructionsText}>
            💡 Tap on the map to set {activeInput === 'pickup' ? 'pickup' : 'dropoff'} location
          </Text>
        </View>
      </View>

      {/* Continue Button - Always Clickable for Demo */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
            Continue to Order Details
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={20} 
            color={Colors.white} 
          />
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
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.lightGrey,
  },
  headerTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.black,
  },
  placeholder: {
    width: 40,
  },
  inputContainer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    marginBottom: 8,
  },
  activeInputButton: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  inputButtonText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.grey,
    marginLeft: 10,
  },
  activeInputButtonText: {
    color: Colors.primary,
  },
  addressInput: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.black,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapInstructions: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  instructionsText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.black,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginRight: 10,
  },
});
