import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import {RootState, AppDispatch} from '../store/index';
import {addToCart} from '../store/slices/cartSlice';
import {toggleWishlistItem} from '../store/slices/wishlistSlice';
import {RootStackScreenProps} from '../types/Navigation';
import {ProductVariant} from '../types/Product';
import {Colors} from '../constants/Colors';
import {Typography} from '../constants/Typography';
import {Layout} from '../constants/Layout';

import Button from '../components/common/Button';

const {width} = Dimensions.get('window');

type ProductDetailScreenProps = RootStackScreenProps<'ProductDetail'>;

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const {product} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = wishlistItems.some(item => item.product.id === product.id);

  const price = parseFloat(selectedVariant.price);
  const compareAtPrice = selectedVariant.compare_at_price 
    ? parseFloat(selectedVariant.compare_at_price) 
    : null;
  const isOnSale = compareAtPrice && compareAtPrice > price;
  const discountPercentage = isOnSale 
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (selectedVariant.inventory_quantity <= 0) {
      Alert.alert('Out of Stock', 'This product is currently out of stock.');
      return;
    }

    dispatch(addToCart({
      product,
      variant: selectedVariant,
      quantity,
    }));

    Alert.alert(
      'Added to Cart',
      `${product.title} has been added to your cart.`,
      [
        {text: 'Continue Shopping', style: 'cancel'},
        {text: 'View Cart', onPress: () => navigation.navigate('Cart')},
      ]
    );
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlistItem({product, variant: selectedVariant}));
  };

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= selectedVariant.inventory_quantity) {
      setQuantity(newQuantity);
    }
  };

  const renderImageGallery = () => {
    const images = product.images.length > 0 ? product.images : [product.image].filter(Boolean);
    
    return (
      <View style={styles.imageGallery}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setSelectedImageIndex(index);
          }}>
          {images.map((image, index) => (
            <Image
              key={image?.id || index}
              source={{uri: image?.src}}
              style={styles.productImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        
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

        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={handleToggleWishlist}>
          <Icon
            name={isInWishlist ? 'heart' : 'heart-outline'}
            size={24}
            color={isInWishlist ? Colors.error : Colors.gray500}
          />
        </TouchableOpacity>

        {images.length > 1 && (
          <View style={styles.imageIndicators}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === selectedImageIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderProductInfo = () => (
    <View style={styles.productInfo}>
      <Text style={styles.vendor}>{product.vendor}</Text>
      <Text style={styles.title}>{product.title}</Text>
      
      <View style={styles.priceContainer}>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
        {isOnSale && compareAtPrice && (
          <Text style={styles.compareAtPrice}>${compareAtPrice.toFixed(2)}</Text>
        )}
      </View>

      <View style={styles.stockInfo}>
        <Icon
          name={selectedVariant.inventory_quantity > 0 ? 'checkmark-circle' : 'close-circle'}
          size={16}
          color={selectedVariant.inventory_quantity > 0 ? Colors.success : Colors.error}
        />
        <Text style={[
          styles.stockText,
          {color: selectedVariant.inventory_quantity > 0 ? Colors.success : Colors.error}
        ]}>
          {selectedVariant.inventory_quantity > 0 
            ? `${selectedVariant.inventory_quantity} in stock`
            : 'Out of stock'
          }
        </Text>
      </View>

      {/* Rating (placeholder) */}
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <Icon
            key={star}
            name="star"
            size={16}
            color={star <= 4 ? Colors.warning : Colors.gray300}
          />
        ))}
        <Text style={styles.ratingText}>(4.00) • 25 reviews</Text>
      </View>
    </View>
  );

  const renderVariants = () => {
    if (product.variants.length <= 1) return null;

    return (
      <View style={styles.variantsSection}>
        <Text style={styles.sectionTitle}>Options</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {product.variants.map((variant) => (
            <TouchableOpacity
              key={variant.id}
              style={[
                styles.variantOption,
                selectedVariant.id === variant.id && styles.selectedVariant,
              ]}
              onPress={() => handleVariantSelect(variant)}>
              <Text
                style={[
                  styles.variantText,
                  selectedVariant.id === variant.id && styles.selectedVariantText,
                ]}>
                {variant.title}
              </Text>
              <Text
                style={[
                  styles.variantPrice,
                  selectedVariant.id === variant.id && styles.selectedVariantPrice,
                ]}>
                ${parseFloat(variant.price).toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderQuantitySelector = () => (
    <View style={styles.quantitySection}>
      <Text style={styles.sectionTitle}>Quantity</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
          onPress={() => handleQuantityChange(-1)}
          disabled={quantity <= 1}>
          <Icon name="remove" size={20} color={quantity <= 1 ? Colors.gray400 : Colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{quantity}</Text>
        
        <TouchableOpacity
          style={[
            styles.quantityButton,
            quantity >= selectedVariant.inventory_quantity && styles.quantityButtonDisabled
          ]}
          onPress={() => handleQuantityChange(1)}
          disabled={quantity >= selectedVariant.inventory_quantity}>
          <Icon 
            name="add" 
            size={20} 
            color={quantity >= selectedVariant.inventory_quantity ? Colors.gray400 : Colors.text} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDescription = () => (
    <View style={styles.descriptionSection}>
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{product.description}</Text>
    </View>
  );

  const renderActions = () => (
    <View style={styles.actions}>
      <Button
        title={`Add to Cart • $${(price * quantity).toFixed(2)}`}
        onPress={handleAddToCart}
        disabled={selectedVariant.inventory_quantity <= 0}
        fullWidth
        style={styles.addToCartButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderImageGallery()}
        {renderProductInfo()}
        {renderVariants()}
        {renderQuantitySelector()}
        {renderDescription()}
      </ScrollView>
      {renderActions()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageGallery: {
    position: 'relative',
    height: width,
  },
  productImage: {
    width,
    height: width,
  },
  saleBadge: {
    position: 'absolute',
    top: Layout.spacing.md,
    left: Layout.spacing.md,
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
    top: Layout.spacing.md,
    right: Layout.spacing.md,
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
    bottom: Layout.spacing.md,
    right: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: Layout.spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
    opacity: 0.5,
    marginHorizontal: 4,
  },
  activeIndicator: {
    opacity: 1,
  },
  productInfo: {
    padding: Layout.spacing.lg,
    backgroundColor: Colors.white,
  },
  vendor: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Layout.spacing.xs,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Layout.spacing.md,
    lineHeight: 32,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  price: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  compareAtPrice: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: Layout.spacing.sm,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  stockText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: Layout.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginLeft: Layout.spacing.sm,
  },
  variantsSection: {
    padding: Layout.spacing.lg,
    backgroundColor: Colors.white,
    marginTop: Layout.spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  variantOption: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginRight: Layout.spacing.sm,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedVariant: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  variantText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  selectedVariantText: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  variantPrice: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  selectedVariantPrice: {
    color: Colors.primary,
  },
  quantitySection: {
    padding: Layout.spacing.lg,
    backgroundColor: Colors.white,
    marginTop: Layout.spacing.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    borderColor: Colors.gray300,
  },
  quantityText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginHorizontal: Layout.spacing.xl,
    minWidth: 40,
    textAlign: 'center',
  },
  descriptionSection: {
    padding: Layout.spacing.lg,
    backgroundColor: Colors.white,
    marginTop: Layout.spacing.sm,
  },
  description: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: 24,
  },
  actions: {
    padding: Layout.spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
  },
});

export default ProductDetailScreen;