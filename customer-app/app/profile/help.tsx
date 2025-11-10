import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Header } from '../../components/common/Header';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export default function HelpSupportScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'How do I place a delivery order?',
      answer: 'To place a delivery order, go to the Home screen and tap "Order a Delivery". You\'ll need to set pickup and dropoff locations, describe your package, and select a payment method. Our system will find the nearest driver for you.',
      category: 'delivery',
    },
    {
      id: '2',
      question: 'How do I book a guesthouse?',
      answer: 'Browse available guesthouses in the Browse tab, select your preferred property, choose your dates, and proceed to booking. You can pay using Mobile Money or cash on arrival.',
      category: 'booking',
    },
    {
      id: '3',
      question: 'What payment methods are accepted?',
      answer: 'We accept MTN Mobile Money, Orange Money, Moov Money, and cash payments. You can manage your payment methods in the Profile section.',
      category: 'payment',
    },
    {
      id: '4',
      question: 'How do I track my delivery?',
      answer: 'Once your order is confirmed and a driver is assigned, you can track your delivery in real-time on the Live Tracking screen. You\'ll see the driver\'s location and estimated arrival time.',
      category: 'delivery',
    },
    {
      id: '5',
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order before the driver arrives at the pickup location. Go to the Live Tracking screen and tap "Cancel Order". Note that cancellation fees may apply.',
      category: 'delivery',
    },
    {
      id: '6',
      question: 'What if I have a complaint?',
      answer: 'If you have any complaints or issues, please contact our support team through the chat feature, email us at support@fastlanedelivery.com, or call our hotline.',
      category: 'support',
    },
    {
      id: '7',
      question: 'How do I update my profile information?',
      answer: 'Go to Profile > Edit Profile to update your personal information, including name, email, phone number, and address. You can also change your profile picture.',
      category: 'account',
    },
    {
      id: '8',
      question: 'Is my personal information secure?',
      answer: 'Yes, we take your privacy seriously. All personal and payment information is encrypted and stored securely. We never share your data with third parties.',
      category: 'security',
    },
  ];

  const supportCategories: SupportCategory[] = [
    {
      id: '1',
      title: 'Live Chat',
      subtitle: 'Chat with our support team',
      icon: 'chatbubbles-outline',
      color: Colors.primary,
      onPress: () => {
        Alert.alert(
          'Live Chat',
          'Connecting you to our support team...',
          [{ text: 'OK' }]
        );
      },
    },
    {
      id: '2',
      title: 'Email Support',
      subtitle: 'Send us an email',
      icon: 'mail-outline',
      color: Colors.secondary,
      onPress: () => {
        Linking.openURL('mailto:support@fastlanedelivery.com?subject=Support Request');
      },
    },
    {
      id: '3',
      title: 'Call Us',
      subtitle: 'Speak with our team',
      icon: 'call-outline',
      color: Colors.accent,
      onPress: () => {
        Linking.openURL('tel:+237XXX XXX XXX');
      },
    },
    {
      id: '4',
      title: 'WhatsApp',
      subtitle: 'Message us on WhatsApp',
      icon: 'logo-whatsapp',
      color: '#25D366',
      onPress: () => {
        Linking.openURL('whatsapp://send?phone=237XXXXXXXXX&text=Hello, I need help with Fast Lane Delivery');
      },
    },
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const getCategoryIcon = (category: string) => {
    const categoryIcons: { [key: string]: string } = {
      delivery: 'car-outline',
      booking: 'bed-outline',
      payment: 'card-outline',
      support: 'help-circle-outline',
      account: 'person-outline',
      security: 'shield-checkmark-outline',
    };
    return categoryIcons[category] || 'help-circle-outline';
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      delivery: Colors.primary,
      booking: Colors.secondary,
      payment: Colors.accent,
      support: '#FF9800',
      account: '#4CAF50',
      security: '#9C27B0',
    };
    return categoryColors[category] || Colors.grey;
  };

  const groupedFAQ = faqData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as { [key: string]: FAQItem[] });

  const categoryNames: { [key: string]: string } = {
    delivery: 'Delivery Services',
    booking: 'Guesthouse Booking',
    payment: 'Payment & Billing',
    support: 'Customer Support',
    account: 'Account Management',
    security: 'Privacy & Security',
  };

  return (
    <View style={styles.container}>
      <Header title="Help & Support" showBack={true} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quick Support Options */}
        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Get Help Quickly</Text>
          <View style={styles.supportGrid}>
            {supportCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.supportCard}
                onPress={category.onPress}
                activeOpacity={0.8}
              >
                <View style={[styles.supportIcon, { backgroundColor: category.color }]}>
                  <Ionicons name={category.icon as any} size={24} color={Colors.white} />
                </View>
                <Text style={styles.supportTitle}>{category.title}</Text>
                <Text style={styles.supportSubtitle}>{category.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {Object.entries(groupedFAQ).map(([category, items]) => (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(category) }]}>
                  <Ionicons name={getCategoryIcon(category) as any} size={20} color={Colors.white} />
                </View>
                <Text style={styles.categoryName}>{categoryNames[category]}</Text>
              </View>
              
              {items.map((item) => (
                <View key={item.id} style={styles.faqItem}>
                  <TouchableOpacity
                    style={styles.faqQuestion}
                    onPress={() => toggleFAQ(item.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.faqQuestionText}>{item.question}</Text>
                    <Ionicons
                      name={expandedFAQ === item.id ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={Colors.grey}
                    />
                  </TouchableOpacity>
                  
                  {expandedFAQ === item.id && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.faqAnswerText}>{item.answer}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={20} color={Colors.primary} />
              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>support@fastlanedelivery.com</Text>
              </View>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color={Colors.primary} />
              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>+237 XXX XXX XXX</Text>
              </View>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="time-outline" size={20} color={Colors.primary} />
              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>Support Hours</Text>
                <Text style={styles.contactValue}>24/7 Available</Text>
              </View>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>Address</Text>
                <Text style={styles.contactValue}>Douala, Cameroon</Text>
              </View>
            </View>
          </View>
        </View>

        {/* App Information */}
        <View style={styles.appInfoSection}>
          <View style={styles.appInfoCard}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
            <View style={styles.appInfoContent}>
              <Text style={styles.appInfoTitle}>App Version</Text>
              <Text style={styles.appInfoText}>Fast Lane Delivery v1.0.0</Text>
              <Text style={styles.appInfoSubtext}>Last updated: December 2024</Text>
            </View>
          </View>
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
  supportSection: {
    backgroundColor: Colors.white,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.black,
    marginBottom: 20,
  },
  supportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  supportCard: {
    width: '48%',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  supportTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.black,
    marginBottom: 4,
    textAlign: 'center',
  },
  supportSubtitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    textAlign: 'center',
  },
  faqSection: {
    backgroundColor: Colors.white,
    marginBottom: 20,
  },
  categorySection: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.lightGrey,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.black,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  faqQuestionText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.black,
    flex: 1,
    marginRight: 16,
  },
  faqAnswer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.lightGrey,
  },
  faqAnswerText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.black,
    lineHeight: 20,
  },
  contactSection: {
    backgroundColor: Colors.white,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contactCard: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactDetails: {
    marginLeft: 12,
    flex: 1,
  },
  contactLabel: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.grey,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.black,
  },
  appInfoSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  appInfoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.lightPrimary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  appInfoContent: {
    flex: 1,
    marginLeft: 12,
  },
  appInfoTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginBottom: 4,
  },
  appInfoText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.black,
    marginBottom: 2,
  },
  appInfoSubtext: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
});
