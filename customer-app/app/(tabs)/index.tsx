import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Header } from '../../components/common/Header';
import { CustomButton } from '../../components/common/CustomButton';
import ImageCarousel from '../../components/ImageCarousel';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const handleOrderDelivery = () => {
    router.push('/(tabs)/activity');
  };

  const handleBookGuesthouse = () => {
    router.push('/(tabs)/browse');
  };

  const handleViewActivity = () => {
    router.push('/(tabs)/activity');
  };

  const features = [
    {
      icon: 'rocket-outline',
      title: 'Fast Delivery',
      description: 'Get your packages delivered in record time',
      color: Colors.accent,
    },
    {
      icon: 'home-outline',
      title: 'Premium Guesthouses',
      description: 'Discover comfortable accommodations',
      color: Colors.secondary,
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Secure & Reliable',
      description: 'Your safety and satisfaction guaranteed',
      color: Colors.warm,
    },
    {
      icon: 'people-outline',
      title: 'Trusted Partners',
      description: 'Verified drivers and property owners',
      color: Colors.cool,
    },
  ];

  const stats = [
    { number: '500+', label: 'Happy Customers' },
    { number: '50+', label: 'Trusted Drivers' },
    { number: '100+', label: 'Guesthouses' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="Fast Lane Delivery" 
        rightComponent={
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="person-circle-outline" size={32} color={Colors.white} />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back! 👋</Text>
          <Text style={styles.welcomeSubtitle}>Ready to make your day easier?</Text>
        </View>

        {/* Image Carousel */}
        <ImageCarousel />

        {/* Hero Section */}
        {/* <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Fast & Reliable</Text>
            <Text style={styles.heroSubtitle}>Get your packages delivered and find the perfect guesthouse in one app</Text>
            <View style={styles.heroButtons}>
              <CustomButton
                title="Order Delivery"
                onPress={handleOrderDelivery}
                style={styles.heroButton}
              />
              <CustomButton
                title="Book Guesthouse"
                onPress={handleBookGuesthouse}
                variant="outline"
                style={styles.heroButton}
              />
            </View>
          </View>
          <View style={styles.heroImageContainer}>
            <View style={styles.heroImage}>
              <Ionicons name="car-sport-outline" size={60} color={Colors.white} />
            </View>
          </View>
        </View> */}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={handleOrderDelivery}>
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.accent }]}>
              <Ionicons name="cube-outline" size={24} color={Colors.white} />
            </View>
            <Text style={styles.quickActionText}>Order Delivery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction} onPress={handleBookGuesthouse}>
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.secondary }]}>
              <Ionicons name="bed-outline" size={24} color={Colors.white} />
            </View>
            <Text style={styles.quickActionText}>Book Guesthouse</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction} onPress={handleViewActivity}>
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.warm }]}>
              <Ionicons name="list-outline" size={24} color={Colors.white} />
            </View>
            <Text style={styles.quickActionText}>My Activity</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity Preview */}
        <View style={styles.recentActivitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={handleViewActivity}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityPreview}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: Colors.accent }]}>
                <Ionicons name="cube-outline" size={20} color={Colors.white} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Package Delivered</Text>
                <Text style={styles.activitySubtitle}>Your order #1234 was delivered successfully</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: Colors.secondary }]}>
                <Ionicons name="bed-outline" size={20} color={Colors.white} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Guesthouse Booked</Text>
                <Text style={styles.activitySubtitle}>Sunset Villa confirmed for next week</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                  <Ionicons name={feature.icon as any} size={24} color={Colors.white} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Service Highlights */}
        {/* <View style={styles.serviceHighlightsSection}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <View style={styles.serviceHighlights}>
            <View style={styles.serviceHighlight}>
              <View style={styles.serviceHighlightIcon}>
                <Ionicons name="car-outline" size={32} color={Colors.accent} />
              </View>
              <View style={styles.serviceHighlightContent}>
                <Text style={styles.serviceHighlightTitle}>Express Delivery</Text>
                <Text style={styles.serviceHighlightDescription}>
                  Same-day delivery for urgent packages across the city
                </Text>
              </View>
            </View>
            <View style={styles.serviceHighlight}>
              <View style={styles.serviceHighlightIcon}>
                <Ionicons name="star-outline" size={32} color={Colors.warm} />
              </View>
              <View style={styles.serviceHighlightContent}>
                <Text style={styles.serviceHighlightTitle}>Premium Guesthouses</Text>
                <Text style={styles.serviceHighlightDescription}>
                  Handpicked accommodations with verified quality standards
                </Text>
              </View>
            </View>
          </View>
        </View> */}

        {/* Stats */}
        {/* <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Our Numbers</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statNumber}>{stat.number}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View> */}

        

        {/* CTA Section */}
        {/* <View style={styles.ctaSection}>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
            <Text style={styles.ctaSubtitle}>Join thousands of satisfied customers</Text>
            <CustomButton
              title="Start Now"
              onPress={handleOrderDelivery}
              style={styles.ctaButton}
            />
          </View>
        </View> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 5,
  },
  welcomeTitle: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
  heroSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  heroContent: {
    flex: 1,
    marginRight: 20,
  },
  heroTitle: {
    fontSize: Fonts.sizes.xxl,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    marginBottom: 24,
    lineHeight: 22,
  },
  heroButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  heroImageContainer: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gradientStart,
    borderRadius: 20,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  heroImage: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    marginTop: -35,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  quickActionText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    textAlign: 'center',
  },
  featuresSection: {
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 20,
    textAlign: 'left',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: -15,
  },
  featureCard: {
    width: '48%',
    marginVertical: 12,
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.lightGrey,
    borderRadius: 16,
  },
  featureIcon: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  featureTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    textAlign: 'center',
    lineHeight: 18,
  },
  statsSection: {
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    marginVertical: 12,
    padding: 16,
    backgroundColor: Colors.lightGrey,
    borderRadius: 16,
    minWidth: 80,
  },
  statNumber: {
    fontSize: Fonts.sizes.xxxl,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.grey,
    textAlign: 'center',
  },
  ctaSection: {
    padding: 24,
    backgroundColor: Colors.gradientStart,
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: Fonts.sizes.xxl,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.white,
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.9,
  },
  ctaButton: {
    width: '100%',
  },
  recentActivitySection: {
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  viewAllText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  activityPreview: {
    gap: 25,
  },
  activityItem: {
    marginTop: -15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: Colors.lightGrey,
    borderRadius: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    marginBottom: 4,
    lineHeight: 18,
  },
  activityTime: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.medium,
    color: Colors.accent,
  },
  serviceHighlightsSection: {
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  serviceHighlights: {
    gap: 20,
  },
  serviceHighlight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: Colors.lightGrey,
    borderRadius: 20,
  },
  serviceHighlightIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  serviceHighlightContent: {
    flex: 1,
  },
  serviceHighlightTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 8,
  },
  serviceHighlightDescription: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    lineHeight: 22,
  },
});