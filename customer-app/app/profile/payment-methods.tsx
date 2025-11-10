import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Header } from '../../components/common/Header';
import { CustomButton } from '../../components/common/CustomButton';

interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'cash' | 'card';
  name: string;
  number: string;
  provider: string;
  isDefault: boolean;
  isActive: boolean;
}

export default function PaymentMethodsScreen() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'mobile_money',
      name: 'MTN Mobile Money',
      number: '+237 6XX XXX XXX',
      provider: 'MTN',
      isDefault: true,
      isActive: true,
    },
    {
      id: '2',
      type: 'mobile_money',
      name: 'Orange Money',
      number: '+237 6XX XXX XXX',
      provider: 'Orange',
      isDefault: false,
      isActive: true,
    },
    {
      id: '3',
      type: 'mobile_money',
      name: 'Moov Money',
      number: '+237 6XX XXX XXX',
      provider: 'Moov',
      isDefault: false,
      isActive: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    provider: '',
    number: '',
    name: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const mobileMoneyProviders = [
    { id: 'mtn', name: 'MTN Mobile Money', color: '#FFC107', icon: 'phone-portrait' },
    { id: 'orange', name: 'Orange Money', color: '#FF9800', icon: 'phone-portrait' },
    { id: 'moov', name: 'Moov Money', color: '#2196F3', icon: 'phone-portrait' },
    { id: 'express', name: 'Express Union', color: '#4CAF50', icon: 'card' },
  ];

  const getProviderIcon = (provider: string) => {
    const providerInfo = mobileMoneyProviders.find(p => p.id === provider.toLowerCase());
    return providerInfo?.icon || 'phone-portrait';
  };

  const getProviderColor = (provider: string) => {
    const providerInfo = mobileMoneyProviders.find(p => p.id === provider.toLowerCase());
    return providerInfo?.color || Colors.primary;
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.provider.trim()) {
      errors.provider = 'Provider is required';
    }

    if (!formData.number.trim()) {
      errors.number = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{8,}$/.test(formData.number)) {
      errors.number = 'Please enter a valid phone number';
    }

    if (!formData.name.trim()) {
      errors.name = 'Account name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddPaymentMethod = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newPaymentMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: 'mobile_money',
        name: formData.name,
        number: formData.number,
        provider: formData.provider,
        isDefault: paymentMethods.length === 0, // First one becomes default
        isActive: true,
      };

      setPaymentMethods(prev => [...prev, newPaymentMethod]);
      setFormData({ provider: '', number: '', name: '' });
      setShowAddForm(false);
      setFormErrors({});

      Alert.alert('Success', 'Payment method added successfully!');
    } catch (error) {
      console.error('Error adding payment method:', error);
      Alert.alert('Error', 'Failed to add payment method. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = (id: string) => {
    setPaymentMethods(prev =>
      prev.map(method =>
        method.id === id ? { ...method, isActive: !method.isActive } : method
      )
    );
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDeletePaymentMethod = (id: string) => {
    const method = paymentMethods.find(m => m.id === id);
    
    Alert.alert(
      'Delete Payment Method',
      `Are you sure you want to delete ${method?.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(m => m.id !== id));
            Alert.alert('Deleted', 'Payment method removed successfully!');
          },
        },
      ]
    );
  };

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectProvider = (provider: string) => {
    setFormData(prev => ({ ...prev, provider }));
    if (formErrors.provider) {
      setFormErrors(prev => ({ ...prev, provider: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Payment Methods" showBack={true} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Add New Payment Method Button */}
        <View style={styles.addSection}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(!showAddForm)}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
            <Text style={styles.addButtonText}>Add New Payment Method</Text>
          </TouchableOpacity>
        </View>

        {/* Add Payment Method Form */}
        {showAddForm && (
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Add Mobile Money Account</Text>
            
            {/* Provider Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Provider *</Text>
              <View style={styles.providerGrid}>
                {mobileMoneyProviders.map((provider) => (
                  <TouchableOpacity
                    key={provider.id}
                    style={[
                      styles.providerOption,
                      formData.provider === provider.name && styles.providerOptionSelected,
                    ]}
                    onPress={() => selectProvider(provider.name)}
                  >
                    <View style={[styles.providerIcon, { backgroundColor: provider.color }]}>
                      <Ionicons name={provider.icon as any} size={20} color={Colors.white} />
                    </View>
                    <Text style={[
                      styles.providerText,
                      formData.provider === provider.name && styles.providerTextSelected,
                    ]}>
                      {provider.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {formErrors.provider && <Text style={styles.errorText}>{formErrors.provider}</Text>}
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={[styles.textInput, formErrors.number && styles.inputError]}
                value={formData.number}
                onChangeText={(value) => updateFormField('number', value)}
                placeholder="+237 6XX XXX XXX"
                placeholderTextColor={Colors.grey}
                keyboardType="phone-pad"
              />
              {formErrors.number && <Text style={styles.errorText}>{formErrors.number}</Text>}
            </View>

            {/* Account Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account Name *</Text>
              <TextInput
                style={[styles.textInput, formErrors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(value) => updateFormField('name', value)}
                placeholder="Enter account holder name"
                placeholderTextColor={Colors.grey}
              />
              {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
            </View>

            {/* Form Actions */}
            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddForm(false);
                  setFormData({ provider: '', number: '', name: '' });
                  setFormErrors({});
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <CustomButton
                title={isLoading ? 'Adding...' : 'Add Payment Method'}
                onPress={handleAddPaymentMethod}
                disabled={isLoading}
                loading={isLoading}
                style={styles.addFormButton}
              />
            </View>
          </View>
        )}

        {/* Existing Payment Methods */}
        <View style={styles.methodsSection}>
          <Text style={styles.sectionTitle}>Your Payment Methods</Text>
          
          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.methodCard}>
              <View style={styles.methodHeader}>
                <View style={styles.methodInfo}>
                  <View style={[styles.methodIcon, { backgroundColor: getProviderColor(method.provider) }]}>
                    <Ionicons name={getProviderIcon(method.provider) as any} size={20} color={Colors.white} />
                  </View>
                  <View style={styles.methodDetails}>
                    <Text style={styles.methodName}>{method.name}</Text>
                    <Text style={styles.methodNumber}>{method.number}</Text>
                    <Text style={styles.methodProvider}>{method.provider}</Text>
                  </View>
                </View>
                
                <View style={styles.methodActions}>
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                  
                  <Switch
                    value={method.isActive}
                    onValueChange={() => handleToggleActive(method.id)}
                    trackColor={{ false: Colors.border, true: Colors.primary }}
                    thumbColor={Colors.white}
                  />
                </View>
              </View>

              <View style={styles.methodFooter}>
                {!method.isDefault && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleSetDefault(method.id)}
                  >
                    <Ionicons name="star-outline" size={16} color={Colors.primary} />
                    <Text style={styles.actionButtonText}>Set as Default</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeletePaymentMethod(method.id)}
                >
                  <Ionicons name="trash-outline" size={16} color={Colors.error} />
                  <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Payment Security</Text>
              <Text style={styles.infoText}>
                Your payment information is securely stored and encrypted. We never share your financial details with third parties.
              </Text>
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
  addSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginLeft: 8,
  },
  formSection: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  formTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.black,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.black,
    marginBottom: 8,
  },
  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  providerOption: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    marginBottom: 12,
  },
  providerOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.lightPrimary,
  },
  providerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.black,
    textAlign: 'center',
  },
  providerTextSelected: {
    color: Colors.primary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.grey,
  },
  addFormButton: {
    flex: 1,
    marginLeft: 12,
  },
  methodsSection: {
    backgroundColor: Colors.white,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.black,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  methodCard: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.black,
    marginBottom: 2,
  },
  methodNumber: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    marginBottom: 2,
  },
  methodProvider: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.primary,
  },
  methodActions: {
    alignItems: 'flex-end',
  },
  defaultBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  defaultBadgeText: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.medium,
    color: Colors.white,
  },
  methodFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 16,
  },
  actionButtonText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginLeft: 4,
  },
  deleteButton: {
    marginLeft: 8,
  },
  deleteButtonText: {
    color: Colors.error,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.lightPrimary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.black,
    lineHeight: 20,
  },
});
