import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Header } from '../../components/common/Header';

export default function AboutAppScreen() {
  const handleContactUs = () => {
    Linking.openURL('mailto:contact@fastlanedelivery.com');
  };

  const handleWebsite = () => {
    Linking.openURL('https://fastlanedelivery.com');
  };

  const handleSocialMedia = (platform: string) => {
    const urls = {
      facebook: 'https://facebook.com/fastlanedelivery',
      twitter: 'https://twitter.com/fastlanedelivery',
      instagram: 'https://instagram.com/fastlanedelivery',
      linkedin: 'https://linkedin.com/company/fastlanedelivery',
    };
    
    if (urls[platform as keyof typeof urls]) {
      Linking.openURL(urls[platform as keyof typeof urls]);
    }
  };

  const appFeatures = [
    'Fast & reliable delivery services',
    'Guesthouse and accommodation booking',
    'Real-time tracking and updates',
    'Secure payment methods',
    '24/7 customer support',
    'Multi-language support',
  ];

  const teamMembers = [
    {
      name: 'John Doe',
      role: 'CEO & Founder',
      description: '10+ years in logistics and technology',
    },
    {
      name: 'Jane Smith',
      role: 'CTO',
      description: 'Expert in mobile app development',
    },
    {
      name: 'Mike Johnson',
      role: 'Head of Operations',
      description: '15+ years in delivery services',
    },
  ];

  const versionHistory = [
    {
      version: 'v1.0.0',
      date: 'December 2024',
      changes: [
        'Initial app release',
        'Delivery ordering system',
        'Guesthouse booking platform',
        'User authentication',
        'Payment integration',
      ],
    },
    {
      version: 'v0.9.0',
      date: 'November 2024',
      changes: [
        'Beta testing phase',
        'UI/UX improvements',
        'Performance optimizations',
        'Bug fixes',
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <Header title="About App" showBack={true} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* App Logo and Basic Info */}
        <View style={styles.appInfoSection}>
          <View style={styles.appLogo}>
            <Ionicons name="car-sport" size={60} color={Colors.primary} />
          </View>
          <Text style={styles.appName}>Fast Lane Delivery</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appTagline}>
            Your trusted partner for fast delivery and comfortable accommodation
          </Text>
        </View>

        {/* App Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>About Fast Lane Delivery</Text>
          <Text style={styles.descriptionText}>
            Fast Lane Delivery is a comprehensive platform that combines reliable delivery services 
            with comfortable guesthouse accommodations. We're committed to making your life easier 
            by providing fast, secure, and convenient solutions for all your delivery and travel needs.
          </Text>
          <Text style={styles.descriptionText}>
            Founded in 2024, we've been serving customers across Cameroon with dedication and 
            excellence. Our mission is to connect people with reliable services while maintaining 
            the highest standards of quality and customer satisfaction.
          </Text>
        </View>

        {/* App Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What We Offer</Text>
          <View style={styles.featuresList}>
            {appFeatures.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Team Section */}
        <View style={styles.teamSection}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <Text style={styles.teamDescription}>
            Meet the passionate team behind Fast Lane Delivery
          </Text>
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.teamMember}>
              <View style={styles.memberAvatar}>
                <Text style={styles.memberInitial}>
                  {member.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
                <Text style={styles.memberDescription}>{member.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Version History */}
        <View style={styles.versionSection}>
          <Text style={styles.sectionTitle}>Version History</Text>
          {versionHistory.map((version, index) => (
            <View key={index} style={styles.versionItem}>
              <View style={styles.versionHeader}>
                <Text style={styles.versionNumber}>{version.version}</Text>
                <Text style={styles.versionDate}>{version.date}</Text>
              </View>
              <View style={styles.changesList}>
                {version.changes.map((change, changeIndex) => (
                  <View key={changeIndex} style={styles.changeItem}>
                    <Text style={styles.changeBullet}>•</Text>
                    <Text style={styles.changeText}>{change}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Contact & Social */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          
          <TouchableOpacity style={styles.contactButton} onPress={handleContactUs}>
            <Ionicons name="mail-outline" size={24} color={Colors.white} />
            <Text style={styles.contactButtonText}>Contact Us</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.websiteButton} onPress={handleWebsite}>
            <Ionicons name="globe-outline" size={24} color={Colors.primary} />
            <Text style={styles.websiteButtonText}>Visit Our Website</Text>
          </TouchableOpacity>

          <View style={styles.socialSection}>
            <Text style={styles.socialTitle}>Follow Us</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: '#1877F2' }]}
                onPress={() => handleSocialMedia('facebook')}
              >
                <Ionicons name="logo-facebook" size={24} color={Colors.white} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}
                onPress={() => handleSocialMedia('twitter')}
              >
                <Ionicons name="logo-twitter" size={24} color={Colors.white} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: '#E4405F' }]}
                onPress={() => handleSocialMedia('instagram')}
              >
                <Ionicons name="logo-instagram" size={24} color={Colors.white} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: '#0A66C2' }]}
                onPress={() => handleSocialMedia('linkedin')}
              >
                <Ionicons name="logo-linkedin" size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Legal Info */}
        <View style={styles.legalSection}>
          <Text style={styles.legalText}>
            © 2024 Fast Lane Delivery. All rights reserved.
          </Text>
          <Text style={styles.legalSubtext}>
            This app is developed and maintained by Fast Lane Delivery team.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  appInfoSection: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 20,
  },
  appLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: Fonts.sizes.xxl,
    fontFamily: Fonts.bold,
    color: Colors.black,
    marginBottom: 8,
  },
  appVersion: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginBottom: 16,
  },
  appTagline: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  descriptionSection: {
    backgroundColor: Colors.white,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.black,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.black,
    lineHeight: 22,
    marginBottom: 12,
  },
  featuresSection: {
    backgroundColor: Colors.white,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  featuresList: {
    marginTop: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.black,
    marginLeft: 12,
  },
  teamSection: {
    backgroundColor: Colors.white,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  teamDescription: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    marginBottom: 20,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  memberInitial: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.black,
    marginBottom: 4,
  },
  memberRole: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginBottom: 4,
  },
  memberDescription: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
  versionSection: {
    backgroundColor: Colors.white,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  versionItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
  },
  versionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  versionNumber: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  versionDate: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
  changesList: {
    marginLeft: 8,
  },
  changeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  changeBullet: {
    fontSize: Fonts.sizes.sm,
    color: Colors.primary,
    marginRight: 8,
    marginTop: 2,
  },
  changeText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.black,
    flex: 1,
  },
  contactSection: {
    backgroundColor: Colors.white,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  contactButtonText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.white,
    marginLeft: 8,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: 20,
  },
  websiteButtonText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginLeft: 8,
  },
  socialSection: {
    alignItems: 'center',
  },
  socialTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.black,
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legalSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  legalText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.grey,
    marginBottom: 8,
    textAlign: 'center',
  },
  legalSubtext: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    textAlign: 'center',
  },
});
