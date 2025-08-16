import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  style,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const renderRightIcon = () => {
    if (secureTextEntry) {
      return (
        <TouchableOpacity onPress={handlePasswordToggle} style={styles.iconContainer}>
          <Ionicons
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={Colors.grey}
          />
        </TouchableOpacity>
      );
    }

    if (rightIcon && onRightIconPress) {
      return (
        <TouchableOpacity onPress={onRightIconPress} style={styles.iconContainer}>
          <Ionicons name={rightIcon as any} size={20} color={Colors.grey} />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.errorContainer]}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            <Ionicons name={leftIcon as any} size={20} color={Colors.grey} />
          </View>
        )}
        <TextInput
          style={[styles.input, style]}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          placeholderTextColor={Colors.grey}
          {...props}
        />
        {renderRightIcon()}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.darkGrey,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  errorContainer: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.black,
    paddingVertical: 12,
  },
  iconContainer: {
    marginHorizontal: 4,
  },
  errorText: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.regular,
    color: Colors.error,
    marginTop: 4,
  },
});