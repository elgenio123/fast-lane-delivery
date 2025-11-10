import * as Location from 'expo-location';
import { Location as LocationType } from '../types/delivery';

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key
const GOOGLE_GEOCODING_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

export class LocationService {
  private static instance: LocationService;

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Simplified - no permission checks
  async requestLocationPermissions(): Promise<boolean> {
    return true; // Always return true for demo
  }

  // Simplified - no permission checks
  async checkLocationPermissions(): Promise<boolean> {
    return true; // Always return true for demo
  }

  // Simplified - return mock location
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    // Return a mock location in Douala, Cameroon for demo purposes
    return {
      latitude: 6.5244,
      longitude: 3.3792,
    };
  }

  // Simplified - return mock location
  async getLastKnownLocation(): Promise<{ latitude: number; longitude: number } | null> {
    return {
      latitude: 6.5244,
      longitude: 3.3792,
    };
  }

  // Simplified - return mock location with address
  async getLocationWithAddress(latitude: number, longitude: number): Promise<LocationType> {
    // For demo, return the coordinates with a mock address
    return {
      latitude,
      longitude,
      address: `Location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      formattedAddress: `Location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    };
  }

  // Simplified - return mock address
  async getAddressFromCoordinates(latitude: number, longitude: number): Promise<string> {
    return `Address at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }

  // Simplified - return mock coordinates
  async getCoordinatesFromAddress(address: string): Promise<LocationType | null> {
    // Return mock coordinates for any address
    return {
      latitude: 6.5244 + (Math.random() - 0.5) * 0.01,
      longitude: 3.3792 + (Math.random() - 0.5) * 0.01,
      address: address,
      formattedAddress: address
    };
  }

  // Simplified - return mock distance
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Simple distance calculation for demo
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Simplified - no watching
  async watchLocation(callback: (location: { latitude: number; longitude: number }) => void): Promise<() => void> {
    // Return a no-op function for demo
    return () => {};
  }
}

export default LocationService.getInstance();
