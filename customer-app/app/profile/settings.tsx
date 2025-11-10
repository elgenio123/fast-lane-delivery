import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Header } from '../../components/common/Header';

interface SettingItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: 'toggle' | 'navigate' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    orderUpdates: true,
    promotionalOffers: false,
    guesthouseBookings: true,
    deliveryTracking: true,
  });

  const [appSettings, setAppSettings] = useState({
    darkMode: false,
    locationServices: true,
    autoSave: true,
    dataUsage: 'balanced',
  });

  const [language, setLanguage] = useState('English');

  const handleNotificationToggle = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleAppSettingToggle = (key: string, value: boolean) => {
    setAppSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'English', onPress: () => setLanguage('English') },
        { text: 'Français', onPress: () => setLanguage('Français') },
        { text: 'Español', onPress: () => setLanguage('Español') },
      ]
    );
  };

  const handleDataUsageChange = () => {
    Alert.alert(
      'Data Usage',
      'Choose your data usage preference',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Low', onPress: () => setAppSettings(prev => ({ ...prev, dataUsage: 'low' })) },
        { text: 'Balanced', onPress: () => setAppSettings(prev => ({ ...prev, dataUsage: 'balanced' })) },
        { text: 'High', onPress: () => setAppSettings(prev => ({ ...prev, dataUsage: 'high' })) },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data including images and temporary files. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: () => {
            // Simulate cache clearing
            Alert.alert('Success', 'Cache cleared successfully!');
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all app settings to their default values. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setNotifications({
              pushNotifications: true,
              orderUpdates: true,
              promotionalOffers: false,
              guesthouseBookings: true,
              deliveryTracking: true,
            });
            setAppSettings({
              darkMode: false,
              locationServices: true,
              autoSave: true,
              dataUsage: 'balanced',
            });
            setLanguage('English');
            Alert.alert('Success', 'Settings reset to default values!');
          },
        },
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://fastlanedelivery.com/privacy-policy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://fastlanedelivery.com/terms-of-service');
  };

  const handleRateApp = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/app/fast-lane-delivery');
    } else {
      Linking.openURL('https://play.google.com/store/apps/details?id=com.fastlanedelivery');
    }
  };

  const notificationSettings: SettingItem[] = [
    {
      id: '1',
      title: 'Push Notifications',
      subtitle: 'Receive push notifications for important updates',
      icon: 'notifications-outline',
      type: 'toggle',
      value: notifications.pushNotifications,
      onToggle: (value) => handleNotificationToggle('pushNotifications', value),
    },
    {
      id: '2',
      title: 'Order Updates',
      subtitle: 'Get notified about your delivery order status',
      icon: 'car-outline',
      type: 'toggle',
      value: notifications.orderUpdates,
      onToggle: (value) => handleNotificationToggle('orderUpdates', value),
    },
    {
      id: '3',
      title: 'Promotional Offers',
      subtitle: 'Receive special offers and discounts',
      icon: 'pricetag-outline',
      type: 'toggle',
      value: notifications.promotionalOffers,
      onToggle: (value) => handleNotificationToggle('promotionalOffers', value),
    },
    {
      id: '4',
      title: 'Guesthouse Bookings',
      subtitle: 'Notifications about your accommodation bookings',
      icon: 'bed-outline',
      type: 'toggle',
      value: notifications.guesthouseBookings,
      onToggle: (value) => handleNotificationToggle('guesthouseBookings', value),
    },
    {
      id: '5',
      title: 'Delivery Tracking',
      subtitle: 'Real-time updates about your delivery',
      icon: 'location-outline',
      type: 'toggle',
      value: notifications.deliveryTracking,
      onToggle: (value) => handleNotificationToggle('deliveryTracking', value),
    },
  ];

  const appPreferences: SettingItem[] = [
    {
      id: '6',
      title: 'Dark Mode',
      subtitle: 'Use dark theme for the app',
      icon: 'moon-outline',
      type: 'toggle',
      value: appSettings.darkMode,
      onToggle: (value) => handleAppSettingToggle('darkMode', value),
    },
    {
      id: '7',
      title: 'Location Services',
      subtitle: 'Allow app to access your location',
      icon: 'location-outline',
      type: 'toggle',
      value: appSettings.locationServices,
      onToggle: (value) => handleAppSettingToggle('locationServices', value),
    },
    {
      id: '8',
      title: 'Auto Save',
      subtitle: 'Automatically save form data',
      icon: 'save-outline',
      type: 'toggle',
      value: appSettings.autoSave,
      onToggle: (value) => handleAppSettingToggle('autoSave', value),
    },
    {
      id: '9',
      title: 'Language',
      subtitle: `Current: ${language}`,
      icon: 'language-outline',
      type: 'action',
      onPress: handleLanguageChange,
    },
    {
      id: '10',
      title: 'Data Usage',
      subtitle: `Current: ${appSettings.dataUsage.charAt(0).toUpperCase() + appSettings.dataUsage.slice(1)}`,
      icon: 'cellular-outline',
      type: 'action',
      onPress: handleDataUsageChange,
    },
  ];

  const dataSettings: SettingItem[] = [
    {
      id: '11',
      title: 'Clear Cache',
      subtitle: 'Free up storage space',
      icon: 'trash-outline',
      type: 'action',
      onPress: handleClearCache,
    },
    {
      id: '12',
      title: 'Reset Settings',
      subtitle: 'Restore default app settings',
      icon: 'refresh-outline',
      type: 'action',
      onPress: handleResetSettings,
    },
  ];

  const legalSettings: SettingItem[] = [
    {
      id: '13',
      title: 'Privacy Policy',
      subtitle: 'Read our privacy policy',
      icon: 'shield-checkmark-outline',
      type: 'navigate',
      onPress: handlePrivacyPolicy,
    },
    {
      id: '14',
      title: 'Terms of Service',
      subtitle: 'Read our terms of service',
      icon: 'document-text-outline',
      type: 'navigate',
      onPress: handleTermsOfService,
    },
  ];

  const otherSettings: SettingItem[] = [
    {
      id: '15',
      title: 'Rate App',
      subtitle: 'Rate us on the app store',
      icon: 'star-outline',
      type: 'action',
      onPress: handleRateApp,
    },
    {
      id: '16',
      title: 'About App',
      subtitle: 'App version and information',
      icon: 'information-circle-outline',
      type: 'navigate',
      onPress: () => router.push('/profile/about'),
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <View key={item.id} style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Ionicons name={item.icon as any} size={24} color={Colors.primary} />
      </View>
      
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>

      {item.type === 'toggle' && (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: Colors.border, true: Colors.primary }}
          thumbColor={Colors.white}
        />
      )}

      {item.type === 'navigate' && (
        <Ionicons name="chevron-forward-outline" size={20} color={Colors.grey} />
      )}

      {item.type === 'action' && (
        <TouchableOpacity onPress={item.onPress}>
          <Ionicons name="chevron-forward-outline" size={20} color={Colors.grey} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSection = (title: string, items: SettingItem[]) => (
    <View key={title} style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {items.map(renderSettingItem)}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Settings" showBack={true} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderSection('Notifications', notificationSettings)}
        {renderSection('App Preferences', appPreferences)}
        {renderSection('Data & Storage', dataSettings)}
        {renderSection('Legal', legalSettings)}
        {renderSection('Other', otherSettings)}

        {/* App Version Info */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Fast Lane Delivery v1.0.0</Text>
          <Text style={styles.versionSubtext}>© 2024 Fast Lane Delivery. All rights reserved.</Text>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.grey,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.lightGrey,
  },
  sectionContent: {
    backgroundColor: Colors.white,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.black,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  versionText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.grey,
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    textAlign: 'center',
  },
});
