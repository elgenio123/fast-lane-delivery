import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradientColors: string[];
}

const onboardingData: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Fast & Reliable',
    subtitle: 'Delivery Service',
    description: 'Get your packages delivered at lightning speed with our reliable delivery network covering your entire city',
    icon: '🚀',
    gradientColors: [Colors.primary, Colors.primaryDark],
  },
  {
    id: '2',
    title: 'Real-time',
    subtitle: 'Tracking',
    description: 'Track your deliveries in real-time with live updates and know exactly when they\'ll arrive at your doorstep',
    icon: '📍',
    gradientColors: [Colors.secondary, Colors.secondaryLight],
  },
  {
    id: '3',
    title: 'Secure & Safe',
    subtitle: 'Delivery',
    description: 'Your packages are handled with utmost care and delivered safely with insurance coverage for peace of mind',
    icon: '🛡️',
    gradientColors: [Colors.accent, Colors.accentLight],
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation when component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      
      // Slide animation
      Animated.timing(slideAnim, {
        toValue: nextIndex * width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(nextIndex);
        slideAnim.setValue(0);
      });
      
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/auth/login');
    }
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
    const isActive = index === currentIndex;
    
    return (
      <View style={styles.slide}>
        <LinearGradient
          colors={item.gradientColors}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.slideContent}>
            <Animated.View 
              style={[
                styles.iconContainer,
                {
                  transform: [
                    {
                      scale: isActive ? 1 : 0.8,
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.icon}>{item.icon}</Text>
            </Animated.View>
            
            <View style={styles.textContainer}>
              <Animated.Text 
                style={[
                  styles.title,
                  {
                    opacity: isActive ? 1 : 0.7,
                    transform: [
                      {
                        translateY: isActive ? 0 : 20,
                      },
                    ],
                  },
                ]}
              >
                {item.title}
              </Animated.Text>
              <Animated.Text 
                style={[
                  styles.subtitle,
                  {
                    opacity: isActive ? 1 : 0.7,
                    transform: [
                      {
                        translateY: isActive ? 0 : 15,
                      },
                    ],
                  },
                ]}
              >
                {item.subtitle}
              </Animated.Text>
              <Animated.Text 
                style={[
                  styles.description,
                  {
                    opacity: isActive ? 1 : 0.7,
                    transform: [
                      {
                        translateY: isActive ? 0 : 10,
                      },
                    ],
                  },
                ]}
              >
                {item.description}
              </Animated.Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
              {
                transform: [
                  {
                    scale: index === currentIndex ? 1.2 : 1,
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          scrollEnabled={false}
        />

        <View style={styles.bottomContainer}>
          {renderPagination()}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.skipButton} 
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>
                {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  slide: {
    width,
    height,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    elevation: 15,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  icon: {
    fontSize: 70,
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: 320,
  },
  title: {
    fontSize: Fonts.sizes.xxxl,
    fontFamily: Fonts.bold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: Fonts.sizes.xxl,
    fontFamily: Fonts.bold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.85,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.2,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
    paddingHorizontal: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 35,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: Colors.white,
    width: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.white,
    opacity: 0.8,
    letterSpacing: 0.5,
  },
  nextButton: {
    backgroundColor: Colors.white,
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 28,
    elevation: 12,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
});
