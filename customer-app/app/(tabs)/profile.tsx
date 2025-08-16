import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Header } from '../../components/common/Header';
import { useAuthStore } from '../../stores/authStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => router.push('/profile/edit'),
    },
    {
      icon: 'card-outline',
      title: 'Payment Methods',
      subtitle: 'Manage your Mobile Money numbers',
      onPress: () => router.push('/profile/payment-methods'),
    },
    {
      icon: 'time-outline',
      title: 'Order History',
      subtitle: 'View your past orders and bookings',
      onPress: () => router.push('/(tabs)/activity'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'FAQ and contact support',
      onPress: () => router.push('/profile/help'),
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      subtitle: 'App preferences and language',
      onPress: () => router.push('/profile/settings'),
    },
  ];

  return (
    <View style={styles.container}>
      <Header title="Profile" showBack={true} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          <Text style={styles.userPhone}>{user?.phone || '+237 XXX XXX XXX'}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.8}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon as any} size={24} color={Colors.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color={Colors.grey} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Fast Lane Delivery v1.0.0</Text>
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
  userSection: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Fonts.sizes.xxxl,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  userName: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.black,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
  menuSection: {
    backgroundColor: Colors.white,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.black,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.error,
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
});