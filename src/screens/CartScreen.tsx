import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';

import {OrderCard} from '@components/order/OrderCard';
import {OrderSummaryCard} from '@components/order/OrderSummaryCard';
import {Button} from '@components/common/Button';
import {Colors} from '@/constants/Colors';
import {Layout} from '@/constants/Layout';
import {Typography} from '@/constants/Typography';
import {RootState} from '@/store/index';
import {CartItem} from '@/types/Product';
import {
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} from '@/store/slices/cartSlice';

const CartScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.variant.price) * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateCartItemQuantity({itemId, quantity}));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Remove', style: 'destructive', onPress: () => dispatch(removeFromCart(itemId))},
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear your entire cart?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Clear', style: 'destructive', onPress: () => dispatch(clearCart())},
      ]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
      return;
    }

    setIsCheckingOut(true);
    // Navigate to checkout screen
    navigation.navigate('Checkout' as never, {cartItems, total} as never);
    setIsCheckingOut(false);
  };

  const handleContinueShopping = () => {
    navigation.navigate('Home' as never);
  };

  const renderCartItem = ({item}: {item: CartItem}) => (
    <OrderCard
      item={item}
      onUpdateQuantity={(quantity) => handleUpdateQuantity(item.product.id.toString(), quantity)}
      onRemove={() => handleRemoveItem(item.product.id.toString())}
      showQuantityControls
      showRemoveButton
    />
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <Text style={styles.emptyCartTitle}>Your Cart is Empty</Text>
      <Text style={styles.emptyCartSubtitle}>
        Add some products to get started with your crypto hardware wallet purchase
      </Text>
      <Button
        title="Continue Shopping"
        onPress={handleContinueShopping}
        style={styles.continueShoppingButton}
      />
    </View>
  );

  const renderCartContent = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.product.id.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.cartItemsContainer}
      />

      {cartItems.length > 0 && (
        <OrderSummaryCard
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
          style={styles.orderSummary}
        />
      )}

      {cartItems.length > 0 && (
        <View style={styles.checkoutContainer}>
          <Button
            title={isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            onPress={handleCheckout}
            disabled={isCheckingOut}
            style={styles.checkoutButton}
          />
          <Button
            title="Continue Shopping"
            onPress={handleContinueShopping}
            variant="outline"
            style={styles.continueButton}
          />
        </View>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? renderEmptyCart() : renderCartContent()}
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
  },
  clearButton: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
  },
  clearButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error,
    fontWeight: Typography.fontWeight.medium,
  },
  cartItemsContainer: {
    paddingHorizontal: Layout.spacing.md,
  },
  orderSummary: {
    marginHorizontal: Layout.spacing.md,
    marginTop: Layout.spacing.lg,
  },
  checkoutContainer: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.lg,
    gap: Layout.spacing.sm,
  },
  checkoutButton: {
    marginBottom: Layout.spacing.sm,
  },
  continueButton: {
    backgroundColor: 'transparent',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
  },
  emptyCartTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  emptyCartSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  continueShoppingButton: {
    minWidth: 200,
  },
});

export default CartScreen;