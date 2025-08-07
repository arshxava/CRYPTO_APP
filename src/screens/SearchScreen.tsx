import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';

import {Input} from '@components/common/Input';
import {ProductCard} from '@components/product/ProductCard';
import {LoadingScreen} from '@components/common/LoadingScreen';
import {Colors} from '@constants/Colors';
import {Layout} from '@constants/Layout';
import {Typography} from '@constants/Typography';
import {shopifyAPI} from '@services/shopifyAPI';
import {Product} from '@types/Product';
import {RootState} from '@store/index';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await shopifyAPI.searchProducts(query.trim());
      setSearchResults(response.data.products || []);
      
      // Add to recent searches
      if (!recentSearches.includes(query.trim())) {
        setRecentSearches(prev => [query.trim(), ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      Alert.alert(
        'Search Failed',
        'Unable to load search results. Please check your connection and try again.',
        [{text: 'OK'}]
      );
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail' as never, {product} as never);
  };

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
    handleSearch(search);
  };

  const renderSearchResult = ({item}: {item: Product}) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      style={styles.productCard}
    />
  );

  const renderRecentSearch = ({item}: {item: string}) => (
    <TouchableOpacity
      style={styles.recentSearchItem}
      onPress={() => handleRecentSearchPress(item)}
    >
      <Text style={styles.recentSearchText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (!hasSearched) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Search Products</Text>
          <Text style={styles.emptyStateSubtitle}>
            Find the perfect hardware wallet for your crypto needs
          </Text>
          {recentSearches.length > 0 && (
            <View style={styles.recentSearchesContainer}>
              <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
              <FlatList
                data={recentSearches}
                renderItem={renderRecentSearch}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentSearchesList}
              />
            </View>
          )}
        </View>
      );
    }

    if (isLoading) {
      return <LoadingScreen />;
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateTitle}>No Results Found</Text>
        <Text style={styles.emptyStateSubtitle}>
          Try adjusting your search terms or browse our categories
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => handleSearch(searchQuery)}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.searchInput}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearch(searchQuery)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.searchButtonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderSearchResult}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.resultsContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: Layout.padding,
    paddingTop: Layout.padding,
    paddingBottom: Layout.padding / 2,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.padding,
    paddingBottom: Layout.padding,
    gap: Layout.padding / 2,
  },
  searchInput: {
    flex: 1,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.padding,
    paddingVertical: Layout.padding / 2,
    borderRadius: Layout.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  searchButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
  resultsContainer: {
    paddingHorizontal: Layout.padding,
    paddingBottom: Layout.padding,
  },
  productCard: {
    flex: 1,
    marginHorizontal: Layout.padding / 4,
    marginBottom: Layout.padding,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.padding * 2,
  },
  emptyStateTitle: {
    ...Typography.h2,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Layout.padding / 2,
  },
  emptyStateSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.padding,
  },
  recentSearchesContainer: {
    width: '100%',
  },
  recentSearchesTitle: {
    ...Typography.subtitle,
    color: Colors.text,
    marginBottom: Layout.padding / 2,
  },
  recentSearchesList: {
    paddingHorizontal: Layout.padding / 2,
  },
  recentSearchItem: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.padding,
    paddingVertical: Layout.padding / 2,
    borderRadius: Layout.borderRadius,
    marginRight: Layout.padding / 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recentSearchText: {
    ...Typography.body,
    color: Colors.text,
  },
});

export default SearchScreen;