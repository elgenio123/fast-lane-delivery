import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { useAuthStore } from '../stores/authStore';
import { useOnboarding } from '../hooks/useOnboarding';

export default function SplashScreen() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { isOnboardingCompleted, isLoading: isOnboardingLoading } = useOnboarding();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOnboardingLoading) return;
      
      if (!isOnboardingCompleted) {
        router.replace('/onboarding');
      } else if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, isOnboardingCompleted, isOnboardingLoading]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>FL</Text>
          </View>
        </View>
        <Text style={styles.title}>Fast Lane Delivery</Text>
        <Text style={styles.subtitle}>Your reliable delivery partner</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
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
  logoText: {
    fontSize: 48,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  title: {
    fontSize: Fonts.sizes.xxxl,
    fontFamily: Fonts.bold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
});