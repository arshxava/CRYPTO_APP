import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {ProductFilter, ProductCategory} from '../../types/Product';
import {Colors} from '../../constants/Colors';
import {Typography} from '../../constants/Typography';
import {Layout} from '../../constants/Layout';

import Button from '../common/Button';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: ProductFilter) => void;
  currentFilters: ProductFilter;
  categories: ProductCategory[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentFilters,
  categories,
}) => {
  const [tempFilters, setTempFilters] = useState<ProductFilter>(currentFilters);

  const handleCategorySelect = (categorySlug: string) => {
    setTempFilters({
      ...tempFilters,
      category: tempFilters.category === categorySlug ? undefined : categorySlug,
    });
  };

  const handlePriceRangeSelect = (min: number, max: number) => {
    setTempFilters({
      ...tempFilters,
      priceRange: {min, max},
    });
  };

  const handleAvailabilitySelect = (availability: 'available' | 'out_of_stock') => {
    setTempFilters({
      ...tempFilters,
      availability: tempFilters.availability === availability ? undefined : availability,
    });
  };

  const handleSortBySelect = (sortBy: string) => {
    setTempFilters({
      ...tempFilters,
      sortBy: sortBy as any,
    });
  };

  const handleApply = () => {
    onApply(tempFilters);
  };

  const handleClear = () => {
    setTempFilters({});
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Icon name="close" size={24} color={Colors.text} />
      </TouchableOpacity>
      <Text style={styles.title}>Filter Products</Text>
      <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategorySection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Category</Text>
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={styles.filterOption}
          onPress={() => handleCategorySelect(category.slug)}>
          <Text style={styles.filterOptionText}>{category.name}</Text>
          <Icon
            name={
              tempFilters.category === category.slug
                ? 'checkmark-circle'
                : 'ellipse-outline'
            }
            size={20}
            color={
              tempFilters.category === category.slug
                ? Colors.primary
                : Colors.gray400
            }
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPriceRangeSection = () => {
    const priceRanges = [
      {label: 'Under $50', min: 0, max: 50},
      {label: '$50 - $100', min: 50, max: 100},
      {label: '$100 - $200', min: 100, max: 200},
      {label: '$200 - $500', min: 200, max: 500},
      {label: 'Over $500', min: 500, max: 9999},
    ];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Range</Text>
        {priceRanges.map(range => {
          const isSelected =
            tempFilters.priceRange?.min === range.min &&
            tempFilters.priceRange?.max === range.max;

          return (
            <TouchableOpacity
              key={range.label}
              style={styles.filterOption}
              onPress={() => handlePriceRangeSelect(range.min, range.max)}>
              <Text style={styles.filterOptionText}>{range.label}</Text>
              <Icon
                name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={isSelected ? Colors.primary : Colors.gray400}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderAvailabilitySection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Availability</Text>
      
      <TouchableOpacity
        style={styles.filterOption}
        onPress={() => handleAvailabilitySelect('available')}>
        <Text style={styles.filterOptionText}>In Stock</Text>
        <Icon
          name={
            tempFilters.availability === 'available'
              ? 'checkmark-circle'
              : 'ellipse-outline'
          }
          size={20}
          color={
            tempFilters.availability === 'available'
              ? Colors.primary
              : Colors.gray400
          }
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.filterOption}
        onPress={() => handleAvailabilitySelect('out_of_stock')}>
        <Text style={styles.filterOptionText}>Out of Stock</Text>
        <Icon
          name={
            tempFilters.availability === 'out_of_stock'
              ? 'checkmark-circle'
              : 'ellipse-outline'
          }
          size={20}
          color={
            tempFilters.availability === 'out_of_stock'
              ? Colors.primary
              : Colors.gray400
          }
        />
      </TouchableOpacity>
    </View>
  );

  const renderSortSection = () => {
    const sortOptions = [
      {label: 'Price: Low to High', value: 'price_asc'},
      {label: 'Price: High to Low', value: 'price_desc'},
      {label: 'Name: A to Z', value: 'title_asc'},
      {label: 'Name: Z to A', value: 'title_desc'},
      {label: 'Newest First', value: 'created_desc'},
      {label: 'Oldest First', value: 'created_asc'},
    ];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sort By</Text>
        {sortOptions.map(option => (
          <TouchableOpacity
            key={option.value}
            style={styles.filterOption}
            onPress={() => handleSortBySelect(option.value)}>
            <Text style={styles.filterOptionText}>{option.label}</Text>
            <Icon
              name={
                tempFilters.sortBy === option.value
                  ? 'checkmark-circle'
                  : 'ellipse-outline'
              }
              size={20}
              color={
                tempFilters.sortBy === option.value
                  ? Colors.primary
                  : Colors.gray400
              }
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      <Button
        title="Cancel"
        onPress={onClose}
        variant="outline"
        style={styles.footerButton}
      />
      <Button
        title="Apply Filters"
        onPress={handleApply}
        variant="primary"
        style={styles.footerButton}
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.container}>
        {renderHeader()}
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderCategorySection()}
          {renderPriceRangeSection()}
          {renderAvailabilitySection()}
          {renderSortSection()}
        </ScrollView>
        
        {renderFooter()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  closeButton: {
    padding: Layout.spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  clearButton: {
    padding: Layout.spacing.sm,
  },
  clearButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.white,
    marginVertical: Layout.spacing.sm,
    paddingVertical: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    paddingHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
  },
  filterOptionText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: Layout.spacing.xs,
  },
});

export default FilterModal;