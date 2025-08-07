import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import {RootState, AppDispatch} from '../store/index';
import {
  fetchProducts,
  fetchCategories,
  setFilters,
  clearFilters,
  resetProducts,
} from '../store/slices/productsSlice';
import {MainTabScreenProps} from '../types/Navigation';
import {Colors} from '../constants/Colors';
import {Typography} from '../constants/Typography';
import {Layout} from '../constants/Layout';

import LoadingScreen from '../components/common/LoadingScreen';
import Button from '../components/common/Button';
import ProductCard from '../components/product/ProductCard';
import FilterModal from '../components/product/FilterModal';

type ProductsScreenProps = MainTabScreenProps<'Products'>;

const ProductsScreen: React.FC<ProductsScreenProps> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const {
    products,
    categories,
    isLoading,
    error,
    currentPage,
    hasMore,
    filters,
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async (page = 1, append = false) => {
    try {
      await dispatch(fetchProducts({page, filters, append}));
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadCategories = async () => {
    try {
      await dispatch(fetchCategories());
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(resetProducts());
    await loadProducts(1, false);
    setRefreshing(false);
  };

  const loadMoreProducts = async () => {
    if (hasMore && !loadingMore) {
      setLoadingMore(true);
      await loadProducts(currentPage + 1, true);
      setLoadingMore(false);
    }
  };

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetail', {product});
  };

  const handleSearch = () => {
    navigation.navigate('Search');
  };

  const handleFilterPress = () => {
    setShowFilters(true);
  };

  const handleApplyFilters = (newFilters: any) => {
    dispatch(setFilters(newFilters));
    dispatch(resetProducts());
    loadProducts(1, false);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(resetProducts());
    loadProducts(1, false);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Hardware Wallets</Text>
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Icon name="search" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleFilterPress}>
          <Icon name="funnel" size={20} color={Colors.text} />
          <Text style={styles.filterButtonText}>Filter</Text>
          {Object.keys(filters).length > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {Object.keys(filters).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        {Object.keys(filters).length > 0 && (
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={handleClearFilters}>
            <Text style={styles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesSection}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}>
        <TouchableOpacity
          style={[
            styles.categoryChip,
            !filters.category && styles.categoryChipActive,
          ]}
          onPress={() => handleApplyFilters({...filters, category: undefined})}>
          <Text
            style={[
              styles.categoryChipText,
              !filters.category && styles.categoryChipTextActive,
            ]}>
            All Products
          </Text>
        </TouchableOpacity>
        
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              filters.category === category.slug && styles.categoryChipActive,
            ]}
            onPress={() =>
              handleApplyFilters({...filters, category: category.slug})
            }>
            <Text
              style={[
                styles.categoryChipText,
                filters.category === category.slug && styles.categoryChipTextActive,
              ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderProductItem = ({item}: {item: any}) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      style={styles.productCard}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <Text style={styles.loadingText}>Loading more products...</Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="bag-outline" size={64} color={Colors.gray400} />
      <Text style={styles.emptyStateTitle}>No products found</Text>
      <Text style={styles.emptyStateDescription}>
        Try adjusting your filters or search criteria
      </Text>
      {Object.keys(filters).length > 0 && (
        <Button
          title="Clear Filters"
          onPress={handleClearFilters}
          variant="outline"
          style={styles.clearFiltersButton}
        />
      )}
    </View>
  );

  if (isLoading && products.length === 0) {
    return <LoadingScreen message="Loading products..." />;
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderCategories()}
      
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
        columnWrapperStyle={styles.productRow}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
      />
      
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
        categories={categories}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  searchButton: {
    padding: Layout.spacing.sm,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.full,
    marginRight: Layout.spacing.sm,
    position: 'relative',
  },
  filterButtonText: {
    marginLeft: Layout.spacing.xs,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  clearFiltersButton: {
    paddingHorizontal: Layout.spacing.sm,
  },
  clearFiltersText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  categoriesSection: {
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    paddingHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  categoriesContainer: {
    paddingHorizontal: Layout.spacing.md,
  },
  categoryChip: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.full,
    marginRight: Layout.spacing.sm,
    backgroundColor: Colors.white,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
  },
  categoryChipTextActive: {
    color: Colors.white,
  },
  productsList: {
    paddingHorizontal: Layout.spacing.md,
    paddingTop: Layout.spacing.md,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: (Layout.window.width - Layout.spacing.md * 3) / 2,
    marginBottom: Layout.spacing.md,
  },
  loadingFooter: {
    paddingVertical: Layout.spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing['3xl'],
  },
  emptyStateTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  emptyStateDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
});

export default ProductsScreen;