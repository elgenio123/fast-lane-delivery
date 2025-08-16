import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../../types';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: property.images[0] || 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=800' }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {property.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={Colors.warning} />
            <Text style={styles.rating}>{property.rating.toFixed(1)}</Text>
          </View>
        </View>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color={Colors.grey} />
          <Text style={styles.quarter}>{property.quarter}</Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.price}>
            ${property.pricePerNight}<Text style={styles.priceUnit}>/night</Text>
          </Text>
          <Text style={styles.reviewCount}>
            ({property.reviewCount} reviews)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.black,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.darkGrey,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quarter: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  priceUnit: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
  reviewCount: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
});