import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';

import {ProductCategory} from '../../types/Product';
import {Colors} from '@/constants/Colors';
import {Typography} from '@/constants/Typography';
import {Layout} from '@/constants/Layout';

interface CategoryGridProps {
  categories: ProductCategory[];
  onCategoryPress: (category: ProductCategory) => void;
  numColumns?: number;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onCategoryPress,
  numColumns = 2,
}) => {
  const renderCategoryItem = ({item}: {item: ProductCategory}) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => onCategoryPress(item)}
      activeOpacity={0.8}>
      <View style={styles.categoryImageContainer}>
        <Image
          source={
            item.image 
              ? {uri: item.image}
              : undefined
          }
          style={styles.categoryImage}
          resizeMode="cover"
        />
        <View style={styles.categoryOverlay}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.categoryCount}>
            {item.count} {item.count === 1 ? 'item' : 'items'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Shop by Category</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Layout.spacing.xl,
    backgroundColor: Colors.white,
  },
  sectionTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.md,
  },
  grid: {
    paddingHorizontal: Layout.spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.lg,
  },
  categoryItem: {
    flex: 1,
    marginHorizontal: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryImageContainer: {
    position: 'relative',
    aspectRatio: 1.2,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: Layout.spacing.md,
  },
  categoryName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Layout.spacing.xs,
  },
  categoryCount: {
    fontSize: Typography.fontSize.sm,
    color: Colors.white,
    opacity: 0.9,
  },
});

export default CategoryGrid;