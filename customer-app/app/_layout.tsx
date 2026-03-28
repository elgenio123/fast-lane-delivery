import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { useAuthStore } from '../stores/authStore';
// import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();
  const { loadStoredAuth, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  if (isLoading) {
    return null; // Show splash screen while loading
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="delivery/set-locations" />
        <Stack.Screen name="delivery/order-details" />
        <Stack.Screen name="delivery/finding-driver" />
        <Stack.Screen name="delivery/live-tracking" />
        <Stack.Screen name="property/details/[id]" />
        <Stack.Screen name="booking/details/[id]" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}