import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';

import {Product} from '../../types/Product';
import {RootState} from '../../store/index';
import {addToWishlist, removeFromWishlist} from '../../store/slices/wishlistSlice';
import {addToCart} from '../../store/slices/cartSlice';
import {Colors} from '@/constants/Colors';
import {Typography} from '@/constants/Typography';
import {Layout} from '@/constants/Layout';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  style?: ViewStyle;
  showAddToCart?: boolean;
  showWishlist?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  style,
  showAddToCart = true,
  showWishlist = true,
}) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  
  const isInWishlist = wishlistItems.some(item => item.product.id === product.id);
  const variant = product.variants?.[0];
  const price = variant ? parseFloat(variant.price) : 0;
  const compareAtPrice = variant?.compare_at_price ? parseFloat(variant.compare_at_price) : null;
  const isOnSale = compareAtPrice && compareAtPrice > price;
  const discountPercentage = isOnSale 
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist({productId: product.id}));
    } else {
      dispatch(addToWishlist({product, variant}));
    }
  };

  const handleAddToCart = () => {
    if (variant) {
      dispatch(addToCart({product, variant, quantity: 1}));
    }
  };

  const renderImage = () => {
    const imageSource = product.image?.src || product.images?.[0]?.src;
    
    return (
      <View style={styles.imageContainer}>
        <Image
          source={
            imageSource 
              ? {uri: imageSource}
              : undefined
          }
          style={styles.productImage}
          resizeMode="cover"
        />
        
        {isOnSale && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>Sale</Text>
          </View>
        )}
        
        {discountPercentage > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>-{discountPercentage}%</Text>
          </View>
        )}
        
        {showWishlist && (
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={handleWishlistToggle}>
            <Icon
              name={isInWishlist ? 'heart' : 'heart-outline'}
              size={20}
              color={isInWishlist ? Colors.error : Colors.gray500}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderProductInfo = () => (
    <View style={styles.productInfo}>
      <Text style={styles.vendor}>{product.vendor}</Text>
      <Text style={styles.title} numberOfLines={2}>
        {product.title}
      </Text>
      
      <View style={styles.priceContainer}>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
        {isOnSale && compareAtPrice && (
          <Text style={styles.compareAtPrice}>${compareAtPrice.toFixed(2)}</Text>
        )}
      </View>
      
      {variant?.inventory_quantity !== undefined && (
        <Text style={styles.stock}>
          {variant.inventory_quantity > 0 
            ? `${variant.inventory_quantity} in stock`
            : 'Out of stock'
          }
        </Text>
      )}
      
      {/* Rating (placeholder for now) */}
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <Icon
            key={star}
            name="star"
            size={12}
            color={star <= 4 ? Colors.warning : Colors.gray300}
          />
        ))}
        <Text style={styles.ratingText}>(4.00)</Text>
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={styles.actions}>
      {showAddToCart && variant && variant.inventory_quantity > 0 && (
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      )}
      
      {variant && variant.inventory_quantity <= 0 && (
        <View style={styles.soldOutButton}>
          <Text style={styles.soldOutText}>Sold out</Text>
        </View>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      {renderImage()}
      {renderProductInfo()}
      {renderActions()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  saleBadge: {
    position: 'absolute',
    top: Layout.spacing.sm,
    left: Layout.spacing.sm,
    backgroundColor: Colors.sale,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  saleBadgeText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  discountBadge: {
    position: 'absolute',
    top: Layout.spacing.sm,
    right: Layout.spacing.sm,
    backgroundColor: Colors.discount,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  discountBadgeText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  wishlistButton: {
    position: 'absolute',
    bottom: Layout.spacing.sm,
    right: Layout.spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    padding: Layout.spacing.md,
  },
  vendor: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Layout.spacing.xs,
  },
  title: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  price: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  compareAtPrice: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: Layout.spacing.sm,
  },
  stock: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginLeft: Layout.spacing.xs,
  },
  actions: {
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: Layout.spacing.md,
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
    alignItems: 'center',
  },
  addToCartText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  soldOutButton: {
    backgroundColor: Colors.gray300,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
    alignItems: 'center',
  },
  soldOutText: {
    color: Colors.gray600,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
});

export default ProductCard;