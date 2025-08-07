import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';

import ProductCard from '@components/product/ProductCard';
import FilterModal from '@components/product/FilterModal';
import LoadingScreen from '@components/common/LoadingScreen';
import Button from '@components/common/Button';
import {Colors} from '@/constants/Colors';
import {Layout} from '@/constants/Layout';
import {Typography} from '@/constants/Typography';
import {shopifyAPI} from '@/services/shopifyAPI';
import {Product, ProductFilter} from '@/types/Product';
import {RootState} from '@/store/index';

const ProductListScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<ProductFilter>({});
  const [error, setError] = useState<string | null>(null);

  const routeParams = route.params as any;
  const collectionId = routeParams?.collectionId;
  const category = routeParams?.category;
  const searchQuery = routeParams?.searchQuery;

  useEffect(() => {
    loadProducts(true);
  }, [collectionId, category, searchQuery, filters]);

  const loadProducts = async (refresh = false) => {
    try {
      if (refresh) {
        setIsLoading(true);
        setCurrentPage(1);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      const params: any = {
        page: refresh ? 1 : currentPage + 1,
        limit: 20,
      };

      // Apply filters
      if (filters.vendor) params.vendor = filters.vendor;
      if (filters.category) params.product_type = filters.category;
      if (filters.priceRange?.min) params.price_min = filters.priceRange.min.toString();
      if (filters.priceRange?.max) params.price_max = filters.priceRange.max.toString();
      if (collectionId) params.collection_id = collectionId;

      let response;
      if (searchQuery) {
        response = await shopifyAPI.searchProducts(searchQuery);
        const searchResults = response.data.products || [];
        setProducts(refresh ? searchResults : [...products, ...searchResults]);
        setTotalPages(1);
        setHasMore(false);
      } else {
        response = await shopifyAPI.getProducts(params);
        const newProducts = response.data.products || [];
        setProducts(refresh ? newProducts : [...products, ...newProducts]);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        setHasMore(response.data.currentPage < response.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setError('Unable to load products. Please try again.');
      if (refresh) {
        Alert.alert(
          'Error',
          'Unable to load products. Please check your connection and try again.',
          [{text: 'OK'}]
        );
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadProducts(true);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      loadProducts(false);
    }
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail' as never, {product} as never);
  };

  const handleFilterApply = (newFilters: ProductFilter) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  const handleFilterReset = () => {
    setFilters({});
    setShowFilterModal(false);
  };

  const renderProduct = ({item}: {item: Product}) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      style={styles.productCard}
    />
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.loadingMoreText}>Loading more products...</Text>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return <LoadingScreen />;
    }

    if (error) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Unable to Load Products</Text>
          <Text style={styles.emptyStateSubtitle}>{error}</Text>
          <Button
            title="Try Again"
            onPress={() => loadProducts(true)}
            style={styles.retryButton}
          />
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateTitle}>No Products Found</Text>
        <Text style={styles.emptyStateSubtitle}>
          Try adjusting your filters or browse other categories
        </Text>
      </View>
    );
  };

  const getScreenTitle = () => {
    if (searchQuery) return `Search: ${searchQuery}`;
    if (category) return category;
    if (collectionId) return 'Products';
    return 'All Products';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getScreenTitle()}</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productsContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* FilterModal temporarily removed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    flex: 1,
  },
  filterButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  productsContainer: {
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: Layout.spacing.md,
  },
  productCard: {
    flex: 1,
    marginHorizontal: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
  },
  loadingMoreText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginLeft: Layout.spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  retryButton: {
    marginTop: Layout.spacing.md,
  },
});

export default ProductListScreen;