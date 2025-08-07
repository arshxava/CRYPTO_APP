import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {WishlistItem, Product, ProductVariant} from '@types/Product';

export interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  totalItems: 0,
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<{
      product: Product;
      variant?: ProductVariant;
    }>) => {
      const {product, variant} = action.payload;
      
      // Check if item already exists in wishlist
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && 
        (variant ? item.variant?.id === variant.id : !item.variant)
      );
      
      if (existingItemIndex === -1) {
        // Add new item to wishlist
        const wishlistItem: WishlistItem = {
          product,
          variant,
          addedAt: new Date().toISOString(),
        };
        state.items.push(wishlistItem);
        state.totalItems = state.items.length;
      }
    },
    
    removeFromWishlist: (state, action: PayloadAction<{
      productId: number;
      variantId?: number;
    }>) => {
      const {productId, variantId} = action.payload;
      
      state.items = state.items.filter(item => {
        if (variantId) {
          return !(item.product.id === productId && item.variant?.id === variantId);
        } else {
          return item.product.id !== productId;
        }
      });
      
      state.totalItems = state.items.length;
    },
    
    clearWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;
    },
    
    setWishlistLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setWishlistError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Toggle item in wishlist (add if not exists, remove if exists)
    toggleWishlistItem: (state, action: PayloadAction<{
      product: Product;
      variant?: ProductVariant;
    }>) => {
      const {product, variant} = action.payload;
      
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && 
        (variant ? item.variant?.id === variant.id : !item.variant)
      );
      
      if (existingItemIndex !== -1) {
        // Remove existing item
        state.items.splice(existingItemIndex, 1);
      } else {
        // Add new item
        const wishlistItem: WishlistItem = {
          product,
          variant,
          addedAt: new Date().toISOString(),
        };
        state.items.push(wishlistItem);
      }
      
      state.totalItems = state.items.length;
    },
    
    // Bulk operations
    addMultipleToWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      action.payload.forEach(newItem => {
        const existingItemIndex = state.items.findIndex(
          item => item.product.id === newItem.product.id && 
          (newItem.variant ? item.variant?.id === newItem.variant.id : !item.variant)
        );
        
        if (existingItemIndex === -1) {
          state.items.push(newItem);
        }
      });
      
      state.totalItems = state.items.length;
    },
    
    removeMultipleFromWishlist: (state, action: PayloadAction<{
      productId: number;
      variantId?: number;
    }[]>) => {
      action.payload.forEach(({productId, variantId}) => {
        state.items = state.items.filter(item => {
          if (variantId) {
            return !(item.product.id === productId && item.variant?.id === variantId);
          } else {
            return item.product.id !== productId;
          }
        });
      });
      
      state.totalItems = state.items.length;
    },
    
    // Sync with server wishlist
    syncWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
      state.totalItems = state.items.length;
    },
    
    // Sort wishlist
    sortWishlist: (state, action: PayloadAction<'date_asc' | 'date_desc' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc'>) => {
      const sortType = action.payload;
      
      state.items.sort((a, b) => {
        switch (sortType) {
          case 'date_asc':
            return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
          case 'date_desc':
            return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
          case 'name_asc':
            return a.product.title.localeCompare(b.product.title);
          case 'name_desc':
            return b.product.title.localeCompare(a.product.title);
          case 'price_asc':
            const priceA = a.variant ? parseFloat(a.variant.price) : parseFloat(a.product.variants[0]?.price || '0');
            const priceB = b.variant ? parseFloat(b.variant.price) : parseFloat(b.product.variants[0]?.price || '0');
            return priceA - priceB;
          case 'price_desc':
            const priceA2 = a.variant ? parseFloat(a.variant.price) : parseFloat(a.product.variants[0]?.price || '0');
            const priceB2 = b.variant ? parseFloat(b.variant.price) : parseFloat(b.product.variants[0]?.price || '0');
            return priceB2 - priceA2;
          default:
            return 0;
        }
      });
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlistLoading,
  setWishlistError,
  toggleWishlistItem,
  addMultipleToWishlist,
  removeMultipleFromWishlist,
  syncWishlist,
  sortWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;