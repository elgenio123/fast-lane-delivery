import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useOnboarding = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const status = await AsyncStorage.getItem('onboardingCompleted');
      setIsOnboardingCompleted(status === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboardingCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const markOnboardingAsCompleted = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      setIsOnboardingCompleted(true);
    } catch (error) {
      console.error('Error marking onboarding as completed:', error);
    }
  };

  return {
    isOnboardingCompleted,
    isLoading,
    markOnboardingAsCompleted,
  };
};
