import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = 200;
const SPACING = 16;

interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  fallbackIcon: string;
  gradientColors: string[];
  actionText: string;
}

const carouselData: CarouselItem[] = [
  {
    id: '1',
    title: 'Express Delivery',
    subtitle: 'Lightning Fast',
    description: 'Get your packages delivered in record time with our premium delivery service',
    imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=400&fit=crop',
    fallbackIcon: '🚚',
    gradientColors: [Colors.primary, Colors.primaryDark],
    actionText: 'Order Now',
  },
  {
    id: '2',
    title: 'Premium Guesthouses',
    subtitle: 'Luxury Stays',
    description: 'Discover handpicked accommodations with verified quality standards',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop',
    fallbackIcon: '🏨',
    gradientColors: [Colors.secondary, Colors.secondaryLight],
    actionText: 'Book Now',
  },
  {
    id: '3',
    title: 'Secure & Reliable',
    subtitle: 'Trusted Service',
    description: 'Your safety and satisfaction guaranteed with every delivery and booking',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    fallbackIcon: '🛡️',
    gradientColors: [Colors.accent, Colors.accentLight],
    actionText: 'Learn More',
  },
  {
    id: '4',
    title: 'City Coverage',
    subtitle: 'Everywhere You Go',
    description: 'Comprehensive delivery network covering your entire city and beyond',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop',
    fallbackIcon: '🌆',
    gradientColors: [Colors.warm, Colors.cool],
    actionText: 'Explore',
  },
];

export default function ImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [imageErrorStates, setImageErrorStates] = useState<{ [key: string]: boolean }>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Auto-scroll every 5 seconds
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % carouselData.length;
      setActiveIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * (CARD_WIDTH + SPACING),
        animated: true,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, fadeAnim]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + SPACING));
    setActiveIndex(index);
  };

  const scrollToIndex = (index: number) => {
    setActiveIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * (CARD_WIDTH + SPACING),
      animated: true,
    });
  };

  const handleImageLoadStart = (itemId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [itemId]: true }));
    setImageErrorStates(prev => ({ ...prev, [itemId]: false }));
  };

  const handleImageLoadEnd = (itemId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [itemId]: false }));
  };

  const handleImageError = (itemId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [itemId]: false }));
    setImageErrorStates(prev => ({ ...prev, [itemId]: true }));
  };

  const renderCarouselItem = (item: CarouselItem, index: number) => {
    const isActive = index === activeIndex;
    const isLoading = imageLoadingStates[item.id];
    const hasError = imageErrorStates[item.id];
    
    return (
      <Animated.View
        key={item.id}
        style={[
          styles.carouselItem,
          {
            transform: [
              {
                scale: isActive ? 1 : 0.95,
              },
            ],
          },
        ]}
      >
        <View style={styles.imageContainer}>
          {!hasError ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.carouselImage}
              resizeMode="cover"
              onLoadStart={() => handleImageLoadStart(item.id)}
              onLoadEnd={() => handleImageLoadEnd(item.id)}
              onError={() => handleImageError(item.id)}
            />
          ) : (
            <View style={styles.fallbackContainer}>
              <Text style={styles.fallbackIcon}>{item.fallbackIcon}</Text>
            </View>
          )}
          
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={Colors.white} />
            </View>
          )}
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
        </View>
        
        <View style={styles.contentContainer}>
          <LinearGradient
            colors={item.gradientColors}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.textContent}>
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                <Text style={styles.actionButtonText}>{item.actionText}</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Animated.View>
    );
  };

  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {carouselData.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
            onPress={() => scrollToIndex(index)}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.paginationDotInner,
                {
                  backgroundColor: index === activeIndex ? Colors.white : 'rgba(255,255,255,0.4)',
                  transform: [
                    {
                      scale: index === activeIndex ? 1.2 : 1,
                    },
                  ],
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>Featured Services</Text>
        {/* <Text style={styles.sectionSubtitle}>Discover what makes us special</Text> */}
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollViewContent}
      >
        {carouselData.map((item, index) => renderCarouselItem(item, index))}
      </ScrollView>
      
      {renderPaginationDots()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginTop: -8,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: -10,
    textAlign: 'left',
  },
  sectionSubtitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    textAlign: 'center',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
  },
  carouselItem: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: SPACING,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  fallbackContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackIcon: {
    fontSize: 80,
    opacity: 0.6,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  textContent: {
    alignItems: 'flex-start',
  },
  itemSubtitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.white,
    marginBottom: 4,
    opacity: 0.9,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemTitle: {
    fontSize: Fonts.sizes.xxl,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  itemDescription: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.white,
    marginBottom: 16,
    opacity: 0.9,
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  paginationDot: {
    width: 12,
    height: 12,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDotActive: {
    width: 16,
    height: 16,
  },
  paginationDotInner: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
});
