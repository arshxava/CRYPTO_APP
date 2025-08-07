import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CartItem, Product, ProductVariant} from '@types/Product';

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

const calculateCartTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = parseFloat(item.variant.price);
    return sum + (price * item.quantity);
  }, 0);
  
  return {totalItems, totalPrice};
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{
      product: Product;
      variant: ProductVariant;
      quantity?: number;
      selectedOptions?: {[key: string]: string};
    }>) => {
      const {product, variant, quantity = 1, selectedOptions = {}} = action.payload;
      
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && item.variant.id === variant.id
      );
      
      if (existingItemIndex !== -1) {
        // Update existing item quantity
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        const cartItem: CartItem = {
          product,
          variant,
          quantity,
          selectedOptions,
        };
        state.items.push(cartItem);
      }
      
      // Recalculate totals
      const totals = calculateCartTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
    
    removeFromCart: (state, action: PayloadAction<{
      productId: number;
      variantId: number;
    }>) => {
      const {productId, variantId} = action.payload;
      
      state.items = state.items.filter(
        item => !(item.product.id === productId && item.variant.id === variantId)
      );
      
      // Recalculate totals
      const totals = calculateCartTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
    
    updateCartItemQuantity: (state, action: PayloadAction<{
      productId: number;
      variantId: number;
      quantity: number;
    }>) => {
      const {productId, variantId, quantity} = action.payload;
      
      const itemIndex = state.items.findIndex(
        item => item.product.id === productId && item.variant.id === variantId
      );
      
      if (itemIndex !== -1) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items.splice(itemIndex, 1);
        } else {
          // Update quantity
          state.items[itemIndex].quantity = quantity;
        }
        
        // Recalculate totals
        const totals = calculateCartTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
    
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Bulk operations
    addMultipleToCart: (state, action: PayloadAction<CartItem[]>) => {
      action.payload.forEach(newItem => {
        const existingItemIndex = state.items.findIndex(
          item => item.product.id === newItem.product.id && item.variant.id === newItem.variant.id
        );
        
        if (existingItemIndex !== -1) {
          state.items[existingItemIndex].quantity += newItem.quantity;
        } else {
          state.items.push(newItem);
        }
      });
      
      // Recalculate totals
      const totals = calculateCartTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
    
    removeMultipleFromCart: (state, action: PayloadAction<{
      productId: number;
      variantId: number;
    }[]>) => {
      action.payload.forEach(({productId, variantId}) => {
        state.items = state.items.filter(
          item => !(item.product.id === productId && item.variant.id === variantId)
        );
      });
      
      // Recalculate totals
      const totals = calculateCartTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
    
    // Apply discount
    applyDiscount: (state, action: PayloadAction<{
      discountCode: string;
      discountAmount: number;
      discountType: 'percentage' | 'fixed';
    }>) => {
      // This would typically be handled by the backend
      // For now, we'll store the discount info in the state
      const {discountAmount, discountType} = action.payload;
      
      if (discountType === 'percentage') {
        state.totalPrice = state.totalPrice * (1 - discountAmount / 100);
      } else {
        state.totalPrice = Math.max(0, state.totalPrice - discountAmount);
      }
    },
    
    // Sync with server cart
    syncCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      const totals = calculateCartTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  setCartLoading,
  setCartError,
  addMultipleToCart,
  removeMultipleFromCart,
  applyDiscount,
  syncCart,
} = cartSlice.actions;

export default cartSlice.reducer;