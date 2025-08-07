import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {shopifyAPI} from '@services/shopifyAPI';
import {Product, ProductCollection, ProductFilter, ProductCategory} from '@types/Product';

export interface ProductsState {
  products: Product[];
  collections: ProductCollection[];
  categories: ProductCategory[];
  featuredProducts: Product[];
  bestSellers: Product[];
  newArrivals: Product[];
  saleProducts: Product[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  filters: ProductFilter;
  searchQuery: string;
}

const initialState: ProductsState = {
  products: [],
  collections: [],
  categories: [],
  featuredProducts: [],
  bestSellers: [],
  newArrivals: [],
  saleProducts: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  hasMore: true,
  filters: {},
  searchQuery: '',
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: {page?: number; filters?: ProductFilter; append?: boolean}, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.getProducts({
        page: params.page || 1,
        limit: 20,
        ...params.filters,
      });
      return {
        ...response.data,
        append: params.append || false,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId: number, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.getProduct(productId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query: string, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.searchProducts(query);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

export const fetchCollections = createAsyncThunk(
  'products/fetchCollections',
  async (_, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.getCollections();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch collections');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.getFeaturedProducts();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchBestSellers = createAsyncThunk(
  'products/fetchBestSellers',
  async (_, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.getBestSellers();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch best sellers');
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  'products/fetchNewArrivals',
  async (_, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.getNewArrivals();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch new arrivals');
    }
  }
);

export const fetchSaleProducts = createAsyncThunk(
  'products/fetchSaleProducts',
  async (_, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.getSaleProducts();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sale products');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.getCategories();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<ProductFilter>) => {
      state.filters = action.payload;
      state.currentPage = 1;
      state.hasMore = true;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
      state.hasMore = true;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },
    resetProducts: (state) => {
      state.products = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        const {products, totalPages, currentPage, append} = action.payload;
        
        if (append) {
          state.products = [...state.products, ...products];
        } else {
          state.products = products;
        }
        
        state.currentPage = currentPage;
        state.totalPages = totalPages;
        state.hasMore = currentPage < totalPages;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search Products
    builder
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Collections
    builder
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.collections = action.payload.collections;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fetch Featured Products
    builder
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload.products;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fetch Best Sellers
    builder
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.bestSellers = action.payload.products;
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fetch New Arrivals
    builder
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivals = action.payload.products;
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fetch Sale Products
    builder
      .addCase(fetchSaleProducts.fulfilled, (state, action) => {
        state.saleProducts = action.payload.products;
      })
      .addCase(fetchSaleProducts.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fetch Categories
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  setSearchQuery,
  clearSearchQuery,
  resetProducts,
} = productsSlice.actions;

export default productsSlice.reducer;