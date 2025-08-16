import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Header } from '../../components/common/Header';
import { PropertyCard } from '../../components/property/PropertyCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { usePropertyStore } from '../../stores/propertyStore';

export default function BrowseScreen() {
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const { properties, isLoading, filters, fetchProperties, setFilters, setSelectedProperty } = usePropertyStore();

  useEffect(() => {
    fetchProperties();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
  };

  const handleSearch = () => {
    setFilters({ ...filters, quarter: searchText });
  };

  const handlePropertyPress = (property: any) => {
    setSelectedProperty(property);
    router.push(`/property/details/${property.id}`);
  };

  const handleFilterPress = () => {
    setShowFilters(!showFilters);
  };

  const applyPriceFilter = (minPrice: number, maxPrice: number) => {
    setFilters({ ...filters, minPrice, maxPrice });
    setShowFilters(false);
  };

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Price Range</Text>
        <View style={styles.priceFilters}>
          <TouchableOpacity
            style={styles.priceFilter}
            onPress={() => applyPriceFilter(0, 50)}
          >
            <Text style={styles.priceFilterText}>$0 - $50</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.priceFilter}
            onPress={() => applyPriceFilter(50, 100)}
          >
            <Text style={styles.priceFilterText}>$50 - $100</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.priceFilter}
            onPress={() => applyPriceFilter(100, 200)}
          >
            <Text style={styles.priceFilterText}>$100 - $200</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.priceFilter}
            onPress={() => applyPriceFilter(200, 1000)}
          >
            <Text style={styles.priceFilterText}>$200+</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.filtersTitle}>Minimum Rating</Text>
        <View style={styles.ratingFilters}>
          {[3, 4, 4.5].map((rating) => (
            <TouchableOpacity
              key={rating}
              style={styles.ratingFilter}
              onPress={() => setFilters({ ...filters, minRating: rating })}
            >
              <Ionicons name="star" size={16} color={Colors.warning} />
              <Text style={styles.ratingFilterText}>{rating}+ stars</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderProperties = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (properties.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No properties found</Text>
          <Text style={styles.emptyText}>
            Try adjusting your search criteria or check back later for new listings.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.propertiesList}>
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onPress={() => handlePropertyPress(property)}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Browse Guesthouses" showBack={true} />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color={Colors.grey} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by quarter..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
          <Ionicons name="options-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {renderFilters()}

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderProperties()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.black,
    paddingVertical: 12,
    marginLeft: 8,
  },
  filterButton: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 12,
    padding: 12,
  },
  filtersContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersTitle: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.bold,
    color: Colors.black,
    marginBottom: 12,
  },
  priceFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  priceFilter: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  priceFilterText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.darkGrey,
  },
  ratingFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ratingFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  ratingFilterText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.darkGrey,
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  propertiesList: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Fonts.sizes.md,
    fontFamily: Fonts.regular,
    color: Colors.grey,
    textAlign: 'center',
    lineHeight: 22,
  },
});