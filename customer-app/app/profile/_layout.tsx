import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="edit"
        options={{
          title: 'Edit Profile',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="payment-methods"
        options={{
          title: 'Payment Methods',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: 'Help & Support',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: 'About App',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="order-history"
        options={{
          title: 'Order History',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
