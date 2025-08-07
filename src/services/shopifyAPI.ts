import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {
  SHOPIFY_STORE_URL,
  SHOPIFY_API_TOKEN,
  SHOPIFY_API_VERSION,
  API_BASE_URL,
} from '@env';
import * as SecureStore from 'expo-secure-store';

import {Product, ProductCollection, ProductFilter} from '@types/Product';
import {Order, OrderSummary, OrderAnalytics} from '@types/Order';
import {LoginCredentials, RegisterData, User} from '@store/slices/authSlice';

class ShopifyAPI {
  private api: AxiosInstance;
  private baseURL: string;
  private apiVersion: string;
  private accessToken: string | null = null;

  constructor() {
    // Use fallback values if environment variables are not set
    const storeUrl = SHOPIFY_STORE_URL || 'your-store.myshopify.com';
    this.baseURL = API_BASE_URL || `https://${storeUrl}/admin/api`;
    this.apiVersion = SHOPIFY_API_VERSION || '2024-01';
    
    this.api = axios.create({
      baseURL: `${this.baseURL}/${this.apiVersion}`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadStoredToken();
  }

  private async loadStoredToken() {
    try {
      const token = await SecureStore.getItemAsync('shopify_access_token');
      if (token) {
        this.setAccessToken(token);
      }
    } catch (error) {
      console.error('Error loading stored token:', error);
    }
  }

  private async storeToken(token: string) {
    try {
      await SecureStore.setItemAsync('shopify_access_token', token);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  private async removeStoredToken() {
    try {
      await SecureStore.deleteItemAsync('shopify_access_token');
    } catch (error) {
      console.error('Error removing stored token:', error);
    }
  }

  private setAccessToken(token: string) {
    this.accessToken = token;
    this.api.defaults.headers.common['X-Shopify-Access-Token'] = token;
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add API key if no access token
        if (!this.accessToken && SHOPIFY_API_TOKEN) {
          config.headers['X-Shopify-Access-Token'] = SHOPIFY_API_TOKEN;
        }
        
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        console.error('Response error:', error.response?.status, error.response?.data);
        
        // Handle token expiration
        if (error.response?.status === 401) {
          await this.removeStoredToken();
          this.accessToken = null;
          delete this.api.defaults.headers.common['X-Shopify-Access-Token'];
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<AxiosResponse<{user: User; token: string}>> {
    try {
      // For Shopify, this would typically be handled through Shopify's Customer API
      // or a custom backend that manages customer authentication
      const response = await this.api.post('/customers/login', credentials);
      
      if (response.data.token) {
        this.setAccessToken(response.data.token);
        await this.storeToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AxiosResponse<{user: User; token: string}>> {
    try {
      const response = await this.api.post('/customers', {
        customer: userData
      });
      
      if (response.data.token) {
        this.setAccessToken(response.data.token);
        await this.storeToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async logout(): Promise<AxiosResponse> {
    await this.removeStoredToken();
    this.accessToken = null;
    delete this.api.defaults.headers.common['X-Shopify-Access-Token'];
    
    return this.api.post('/customers/logout');
  }

  async refreshToken(): Promise<AxiosResponse<{token: string}>> {
    const response = await this.api.post('/auth/refresh');
    
    if (response.data.token) {
      this.setAccessToken(response.data.token);
      await this.storeToken(response.data.token);
    }
    
    return response;
  }

  async getUserProfile(): Promise<AxiosResponse<User>> {
    return this.api.get('/customers/current');
  }

  async updateUserProfile(userData: Partial<User>): Promise<AxiosResponse<User>> {
    return this.api.put('/customers/current', {customer: userData});
  }

  // Product methods
  async getProducts(params: {
    page?: number;
    limit?: number;
    collection_id?: number;
    vendor?: string;
    product_type?: string;
    published_status?: string;
    since_id?: number;
    created_at_min?: string;
    created_at_max?: string;
    updated_at_min?: string;
    updated_at_max?: string;
    published_at_min?: string;
    published_at_max?: string;
    fields?: string;
  } = {}): Promise<AxiosResponse<{
    products: Product[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
  }>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.collection_id) queryParams.append('collection_id', params.collection_id.toString());
      if (params.vendor) queryParams.append('vendor', params.vendor);
      if (params.product_type) queryParams.append('product_type', params.product_type);
      if (params.published_status) queryParams.append('published_status', params.published_status);
      if (params.since_id) queryParams.append('since_id', params.since_id.toString());
      if (params.created_at_min) queryParams.append('created_at_min', params.created_at_min);
      if (params.created_at_max) queryParams.append('created_at_max', params.created_at_max);
      if (params.updated_at_min) queryParams.append('updated_at_min', params.updated_at_min);
      if (params.updated_at_max) queryParams.append('updated_at_max', params.updated_at_max);
      if (params.published_at_min) queryParams.append('published_at_min', params.published_at_min);
      if (params.published_at_max) queryParams.append('published_at_max', params.published_at_max);
      if (params.fields) queryParams.append('fields', params.fields);

      const response = await this.api.get(`/products.json?${queryParams.toString()}`);
      
      // Transform response to include pagination info
      const products = response.data.products;
      const totalCount = parseInt(response.headers['x-total-count'] || products.length.toString());
      const currentPage = params.page || 1;
      const limit = params.limit || 20;
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        ...response,
        data: {
          products,
          totalPages,
          currentPage,
          totalCount,
        },
      };
    } catch (error) {
      console.error('Failed to fetch products from API, using fallback data:', error);
      
      // Return fallback data when API fails
      const fallbackProducts: Product[] = [
        {
          id: 1,
          title: 'Trezor Model T',
          handle: 'trezor-model-t',
          description: 'The most advanced hardware wallet with touchscreen and advanced security features.',
          product_type: 'Hardware Wallet',
          vendor: 'Trezor',
          tags: 'hardware-wallet,trezor,bitcoin,ethereum',
          published_at: '2024-01-15T10:00:00Z',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          template_suffix: null,
          status: 'active',
          published_scope: 'web',
          admin_graphql_api_id: 'gid://shopify/Product/1',
          variants: [
            {
              id: 1,
              product_id: 1,
              title: 'Trezor Model T',
              price: '169.00',
              sku: 'TREZOR-T',
              position: 1,
              inventory_policy: 'deny',
              compare_at_price: '199.00',
              fulfillment_service: 'manual',
              inventory_management: 'shopify',
              option1: 'Default Title',
              option2: null,
              option3: null,
              created_at: '2024-01-01T10:00:00Z',
              updated_at: '2024-01-01T10:00:00Z',
              taxable: true,
              barcode: '123456789',
              grams: 500,
              image_id: 1,
              weight: 0.5,
              weight_unit: 'kg',
              inventory_item_id: 1,
              inventory_quantity: 50,
              old_inventory_quantity: 50,
              requires_shipping: true,
              admin_graphql_api_id: 'gid://shopify/ProductVariant/1',
            },
          ],
          options: [
            {
              id: 1,
              product_id: 1,
              name: 'Title',
              position: 1,
              values: ['Default Title'],
            },
          ],
          images: [
            {
              id: 1,
              product_id: 1,
              position: 1,
              created_at: '2024-01-01T10:00:00Z',
              updated_at: '2024-01-01T10:00:00Z',
              alt: 'Trezor Model T Hardware Wallet',
              width: 800,
              height: 600,
              src: 'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Trezor+Model+T',
              variant_ids: [1],
              admin_graphql_api_id: 'gid://shopify/ProductImage/1',
            },
          ],
          image: {
            id: 1,
            product_id: 1,
            position: 1,
            created_at: '2024-01-01T10:00:00Z',
            updated_at: '2024-01-01T10:00:00Z',
            alt: 'Trezor Model T Hardware Wallet',
            width: 800,
            height: 600,
            src: 'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Trezor+Model+T',
            variant_ids: [1],
            admin_graphql_api_id: 'gid://shopify/ProductImage/1',
          },
        },
        {
          id: 2,
          title: 'Ledger Nano X',
          handle: 'ledger-nano-x',
          description: 'Bluetooth-enabled hardware wallet with support for 100+ cryptocurrencies.',
          product_type: 'Hardware Wallet',
          vendor: 'Ledger',
          tags: 'hardware-wallet,ledger,bluetooth,mobile',
          published_at: '2024-01-10T10:00:00Z',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-10T10:00:00Z',
          template_suffix: null,
          status: 'active',
          published_scope: 'web',
          admin_graphql_api_id: 'gid://shopify/Product/2',
          variants: [
            {
              id: 2,
              product_id: 2,
              title: 'Ledger Nano X',
              price: '149.00',
              sku: 'LEDGER-NANO-X',
              position: 1,
              inventory_policy: 'deny',
              compare_at_price: '179.00',
              fulfillment_service: 'manual',
              inventory_management: 'shopify',
              option1: 'Default Title',
              option2: null,
              option3: null,
              created_at: '2024-01-01T10:00:00Z',
              updated_at: '2024-01-01T10:00:00Z',
              taxable: true,
              barcode: '987654321',
              grams: 400,
              image_id: 2,
              weight: 0.4,
              weight_unit: 'kg',
              inventory_item_id: 2,
              inventory_quantity: 75,
              old_inventory_quantity: 75,
              requires_shipping: true,
              admin_graphql_api_id: 'gid://shopify/ProductVariant/2',
            },
          ],
          options: [
            {
              id: 2,
              product_id: 2,
              name: 'Title',
              position: 1,
              values: ['Default Title'],
            },
          ],
          images: [
            {
              id: 2,
              product_id: 2,
              position: 1,
              created_at: '2024-01-01T10:00:00Z',
              updated_at: '2024-01-01T10:00:00Z',
              alt: 'Ledger Nano X Hardware Wallet',
              width: 800,
              height: 600,
              src: 'https://via.placeholder.com/800x600/50C878/FFFFFF?text=Ledger+Nano+X',
              variant_ids: [2],
              admin_graphql_api_id: 'gid://shopify/ProductImage/2',
            },
          ],
          image: {
            id: 2,
            product_id: 2,
            position: 1,
            created_at: '2024-01-01T10:00:00Z',
            updated_at: '2024-01-01T10:00:00Z',
            alt: 'Ledger Nano X Hardware Wallet',
            width: 800,
            height: 600,
            src: 'https://via.placeholder.com/800x600/50C878/FFFFFF?text=Ledger+Nano+X',
            variant_ids: [2],
            admin_graphql_api_id: 'gid://shopify/ProductImage/2',
          },
        },
        {
          id: 3,
          title: 'SecuX V20',
          handle: 'secux-v20',
          description: 'Premium hardware wallet with large touchscreen and advanced security.',
          product_type: 'Hardware Wallet',
          vendor: 'SecuX',
          tags: 'hardware-wallet,secux,touchscreen,premium',
          published_at: '2024-01-05T10:00:00Z',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-05T10:00:00Z',
          template_suffix: null,
          status: 'active',
          published_scope: 'web',
          admin_graphql_api_id: 'gid://shopify/Product/3',
          variants: [
            {
              id: 3,
              product_id: 3,
              title: 'SecuX V20',
              price: '199.00',
              sku: 'SECUX-V20',
              position: 1,
              inventory_policy: 'deny',
              compare_at_price: '249.00',
              fulfillment_service: 'manual',
              inventory_management: 'shopify',
              option1: 'Default Title',
              option2: null,
              option3: null,
              created_at: '2024-01-01T10:00:00Z',
              updated_at: '2024-01-01T10:00:00Z',
              taxable: true,
              barcode: '456789123',
              grams: 600,
              image_id: 3,
              weight: 0.6,
              weight_unit: 'kg',
              inventory_item_id: 3,
              inventory_quantity: 25,
              old_inventory_quantity: 25,
              requires_shipping: true,
              admin_graphql_api_id: 'gid://shopify/ProductVariant/3',
            },
          ],
          options: [
            {
              id: 3,
              product_id: 3,
              name: 'Title',
              position: 1,
              values: ['Default Title'],
            },
          ],
          images: [
            {
              id: 3,
              product_id: 3,
              position: 1,
              created_at: '2024-01-01T10:00:00Z',
              updated_at: '2024-01-01T10:00:00Z',
              alt: 'SecuX V20 Hardware Wallet',
              width: 800,
              height: 600,
              src: 'https://via.placeholder.com/800x600/FF6B35/FFFFFF?text=SecuX+V20',
              variant_ids: [3],
              admin_graphql_api_id: 'gid://shopify/ProductImage/3',
            },
          ],
          image: {
            id: 3,
            product_id: 3,
            position: 1,
            created_at: '2024-01-01T10:00:00Z',
            updated_at: '2024-01-01T10:00:00Z',
            alt: 'SecuX V20 Hardware Wallet',
            width: 800,
            height: 600,
            src: 'https://via.placeholder.com/800x600/FF6B35/FFFFFF?text=SecuX+V20',
            variant_ids: [3],
            admin_graphql_api_id: 'gid://shopify/ProductImage/3',
          },
        },
      ];

      const limit = params.limit || 20;
      const page = params.page || 1;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = fallbackProducts.slice(startIndex, endIndex);

      return {
        data: {
          products: paginatedProducts,
          totalPages: Math.ceil(fallbackProducts.length / limit),
          currentPage: page,
          totalCount: fallbackProducts.length,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      } as AxiosResponse<{
        products: Product[];
        totalPages: number;
        currentPage: number;
        totalCount: number;
      }>;
    }
  }

  async getProduct(productId: number): Promise<AxiosResponse<{product: Product}>> {
    try {
      return await this.api.get(`/products/${productId}.json`);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      throw error;
    }
  }

  async searchProducts(query: string): Promise<AxiosResponse<{products: Product[]}>> {
    try {
      // Shopify doesn't have a dedicated search endpoint in Admin API
      // We'll filter by title for now
      return await this.api.get(`/products.json?title=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Failed to search products from API, using fallback search:', error);
      
      // Return fallback search results when API fails
      const fallbackProducts: Product[] = [
        {
          id: 1,
          title: 'Trezor Model T',
          handle: 'trezor-model-t',
          description: 'The most advanced hardware wallet with touchscreen and advanced security features.',
          product_type: 'Hardware Wallet',
          vendor: 'Trezor',
          tags: 'hardware-wallet,trezor,bitcoin,ethereum',
          published_at: '2024-01-15T10:00:00Z',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          template_suffix: null,
          status: 'active',
          published_scope: 'web',
          admin_graphql_api_id: 'gid://shopify/Product/1',
          variants: [
            {
              id: 1,
              product_id: 1,
              title: 'Trezor Model T',
              price: '169.00',
              sku: 'TREZOR-T',
              position: 1,
              inventory_policy: 'deny',
              compare_at_price: '199.00',
              fulfillment_service: 'manual',
              inventory_management: 'shopify',
              option1: 'Default Title',
              option2: null,
              option3: null,
              created_at: '2024-01-01T10:00:00Z',
              updated_at: '2024-01-01T10:00:00Z',
              taxable: true,
              barcode: '123456789',
              grams: 500,
              image_id: 1,
              weight: 0.5,
              weight_unit: 'kg',
              inventory_item_id: 1,
              inventory_quantity: 50,
              old_inventory_quantity: 50,
              requires_shipping: true,
              admin_graphql_api_id: 'gid://shopify/ProductVariant/1',
            },
          ],
          options: [
            {
              id: 1,
              product_id: 1,
              name: 'Title',
              position: 1,
              values: ['Default Title'],
            },
          ],
          images: [
            {
              id: 1,
              product_id: 1,
              position: 1,
              created_at: '2024-01-01T10:00:00Z',
              updated_at: '2024-01-01T10:00:00Z',
              alt: 'Trezor Model T Hardware Wallet',
              width: 800,
              height: 600,
              src: 'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Trezor+Model+T',
              variant_ids: [1],
              admin_graphql_api_id: 'gid://shopify/ProductImage/1',
            },
          ],
          image: {
            id: 1,
            product_id: 1,
            position: 1,
            created_at: '2024-01-01T10:00:00Z',
            updated_at: '2024-01-01T10:00:00Z',
            alt: 'Trezor Model T Hardware Wallet',
            width: 800,
            height: 600,
            src: 'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Trezor+Model+T',
            variant_ids: [1],
            admin_graphql_api_id: 'gid://shopify/ProductImage/1',
          },
        },
        {
          id: 2,
          title: 'Ledger Nano X',
          handle: 'ledger-nano-x',
          description: 'Bluetooth-enabled hardware wallet with support for 100+ cryptocurrencies.',
          product_type: 'Hardware Wallet',
          vendor: 'Ledger',
          tags: 'hardware-wallet,ledger,bluetooth,mobile',
          published_at: '2024-01-10T10:00:00Z',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-10T10:00:00Z',
          template_suffix: null,
          status: 'active',
          published_scope: 'web',
          admin_graphql_api_id: 'gid://shopify/Product/2',
          variants: [
            {
              id: 2,
              product_id: 2,
              title: 'Ledger Nano X',
              price: '149.00',
              sku: 'LEDGER-NANO-X',
              position: 1,
              inventory_policy: 'deny',
              compare_at_price: '179.00',
              fulfillment_service: 'manual',
              inventory_management: 'shopify',
              option1: 'Default Title',
              option2: null,
              option3: null,
              created_at: '2024-01-01T10:00:00Z',
              updated_at: '2024-01-01T10:00:00Z',
              taxable: true,
              barcode: '987654321',
              grams: 400,
              image_id: 2,
              weight: 0.4,
              weight_unit: 'kg',
              inventory_item_id: 2,
              inventory_quantity: 75,
              old_inventory_quantity: 75,
              requires_shipping: true,
              admin_graphql_api_id: 'gid://shopify/ProductVariant/2',
            },
          ],
          options: [
            {
              id: 2,
              product_id: 2,
              name: 'Title',
              position: 1,
              values: ['Default Title'],
            },
          ],
          images: [
            {
              id: 2,
              product_id: 2,
              position: 1,
              created_at: '2024-01-01T10:00:00Z',
              updated_at: '2024-01-01T10:00:00Z',
              alt: 'Ledger Nano X Hardware Wallet',
              width: 800,
              height: 600,
              src: 'https://via.placeholder.com/800x600/50C878/FFFFFF?text=Ledger+Nano+X',
              variant_ids: [2],
              admin_graphql_api_id: 'gid://shopify/ProductImage/2',
            },
          ],
          image: {
            id: 2,
            product_id: 2,
            position: 1,
            created_at: '2024-01-01T10:00:00Z',
            updated_at: '2024-01-01T10:00:00Z',
            alt: 'Ledger Nano X Hardware Wallet',
            width: 800,
            height: 600,
            src: 'https://via.placeholder.com/800x600/50C878/FFFFFF?text=Ledger+Nano+X',
            variant_ids: [2],
            admin_graphql_api_id: 'gid://shopify/ProductImage/2',
          },
        },
      ];

      // Simple search logic for fallback
      const searchResults = fallbackProducts.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.vendor.toLowerCase().includes(query.toLowerCase())
      );

      return {
        data: {
          products: searchResults,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      } as AxiosResponse<{products: Product[]}>;
    }
  }

  async getCollections(): Promise<AxiosResponse<{collections: ProductCollection[]}>> {
    try {
      const response = await this.api.get('/collections.json');
      return {
        ...response,
        data: {
          collections: response.data.collections || response.data.custom_collections || [],
        },
      };
    } catch (error) {
      console.error('Failed to fetch collections:', error);
      throw error;
    }
  }

  async getFeaturedProducts(): Promise<AxiosResponse<{products: Product[]}>> {
    try {
      // Get products from a "featured" collection or with specific tags
      return await this.api.get('/products.json?published_status=published&limit=10');
    } catch (error) {
      console.error('Failed to fetch featured products from API, using fallback:', error);
      // Use the same fallback as getProducts but return only first 3
      const fallbackResponse = await this.getProducts({limit: 3});
      return {
        ...fallbackResponse,
        data: {products: fallbackResponse.data.products},
      };
    }
  }

  async getBestSellers(): Promise<AxiosResponse<{products: Product[]}>> {
    try {
      // This would typically require analytics data
      // For now, we'll get recently updated products as a proxy
      return await this.api.get('/products.json?published_status=published&limit=10&order=updated_at+desc');
    } catch (error) {
      console.error('Failed to fetch best sellers from API, using fallback:', error);
      // Use the same fallback as getProducts but return only first 3
      const fallbackResponse = await this.getProducts({limit: 3});
      return {
        ...fallbackResponse,
        data: {products: fallbackResponse.data.products},
      };
    }
  }

  async getNewArrivals(): Promise<AxiosResponse<{products: Product[]}>> {
    try {
      return await this.api.get('/products.json?published_status=published&limit=10&order=created_at+desc');
    } catch (error) {
      console.error('Failed to fetch new arrivals from API, using fallback:', error);
      // Use the same fallback as getProducts but return only first 3
      const fallbackResponse = await this.getProducts({limit: 3});
      return {
        ...fallbackResponse,
        data: {products: fallbackResponse.data.products},
      };
    }
  }

  async getSaleProducts(): Promise<AxiosResponse<{products: Product[]}>> {
    try {
      // Products with compare_at_price would indicate sale items
      return await this.api.get('/products.json?published_status=published');
    } catch (error) {
      console.error('Failed to fetch sale products:', error);
      throw error;
    }
  }

  async getCategories(): Promise<AxiosResponse<{categories: any[]}>> {
    try {
      // Get unique product types as categories
      const response = await this.api.get('/products.json?fields=product_type');
      const productTypes = [...new Set(response.data.products.map((p: any) => p.product_type).filter(Boolean))];
      
      const categories = productTypes.map((type, index) => ({
        id: index.toString(),
        name: type,
        slug: type.toLowerCase().replace(/\s+/g, '-'),
        count: response.data.products.filter((p: any) => p.product_type === type).length,
      }));

      return {
        ...response,
        data: {categories},
      };
    } catch (error) {
      console.error('Failed to fetch categories from API, using fallback:', error);
      
      // Return fallback categories
      const fallbackCategories = [
        {
          id: '1',
          name: 'Hardware Wallet',
          slug: 'hardware-wallet',
          count: 3,
        },
        {
          id: '2',
          name: 'Software Wallet',
          slug: 'software-wallet',
          count: 2,
        },
        {
          id: '3',
          name: 'Crypto Accessories',
          slug: 'crypto-accessories',
          count: 1,
        },
      ];

      return {
        data: {categories: fallbackCategories},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      } as AxiosResponse<{categories: any[]}>;
    }
  }

  // Order methods
  async getOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
    financial_status?: string;
    fulfillment_status?: string;
    created_at_min?: string;
    created_at_max?: string;
    updated_at_min?: string;
    updated_at_max?: string;
    processed_at_min?: string;
    processed_at_max?: string;
    attribution_app_id?: string;
    fields?: string;
  } = {}): Promise<AxiosResponse<{
    orders: Order[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
  }>> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await this.api.get(`/orders.json?${queryParams.toString()}`);
      
      const orders = response.data.orders;
      const totalCount = parseInt(response.headers['x-total-count'] || orders.length.toString());
      const currentPage = params.page || 1;
      const limit = params.limit || 20;
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        ...response,
        data: {
          orders,
          totalPages,
          currentPage,
          totalCount,
        },
      };
    } catch (error) {
      console.error('Failed to fetch orders from API, using fallback:', error);
      
      // Return empty orders array as fallback
      const limit = params.limit || 20;
      const page = params.page || 1;
      
      return {
        data: {
          orders: [],
          totalPages: 0,
          currentPage: page,
          totalCount: 0,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      } as AxiosResponse<{
        orders: Order[];
        totalPages: number;
        currentPage: number;
        totalCount: number;
      }>;
    }
  }

  async getOrder(orderId: number): Promise<AxiosResponse<{order: Order}>> {
    return this.api.get(`/orders/${orderId}.json`);
  }

  async createOrder(orderData: any): Promise<AxiosResponse<{order: Order}>> {
    return this.api.post('/orders.json', {order: orderData});
  }

  async updateOrder(orderId: number, updateData: any): Promise<AxiosResponse<{order: Order}>> {
    return this.api.put(`/orders/${orderId}.json`, {order: updateData});
  }

  async cancelOrder(orderId: number): Promise<AxiosResponse<{order: Order}>> {
    return this.api.post(`/orders/${orderId}/cancel.json`);
  }

  async fulfillOrder(orderId: number, fulfillmentData: any): Promise<AxiosResponse<{order: Order}>> {
    return this.api.post(`/orders/${orderId}/fulfillments.json`, {fulfillment: fulfillmentData});
  }

  async refundOrder(orderId: number, refundData: any): Promise<AxiosResponse<{order: Order}>> {
    return this.api.post(`/orders/${orderId}/refunds.json`, {refund: refundData});
  }

  // Analytics methods
  async getOrderSummary(): Promise<AxiosResponse<OrderSummary>> {
    try {
      const ordersResponse = await this.api.get('/orders.json?limit=250&status=any');
      const orders = ordersResponse.data.orders;
      
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum: number, order: Order) => sum + parseFloat(order.total_price), 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const recentOrders = orders.slice(0, 10);
      
      return {
        ...ordersResponse,
        data: {
          totalOrders,
          totalRevenue: totalRevenue.toFixed(2),
          averageOrderValue: averageOrderValue.toFixed(2),
          recentOrders,
        },
      };
    } catch (error) {
      console.error('Failed to fetch order summary from API, using fallback:', error);
      
      // Return fallback order summary
      return {
        data: {
          totalOrders: 0,
          totalRevenue: '0.00',
          averageOrderValue: '0.00',
          recentOrders: [],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      } as AxiosResponse<OrderSummary>;
    }
  }

  async getOrderAnalytics(params: {
    startDate?: string;
    endDate?: string;
  }): Promise<AxiosResponse<OrderAnalytics>> {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('created_at_min', params.startDate);
    if (params.endDate) queryParams.append('created_at_max', params.endDate);
    
    const ordersResponse = await this.api.get(`/orders.json?${queryParams.toString()}&limit=250`);
    const orders = ordersResponse.data.orders;
    
    // Process analytics data
    const dailyOrders = this.processDailyOrders(orders);
    const topProducts = this.processTopProducts(orders);
    const ordersByStatus = this.processOrdersByStatus(orders);
    
    return {
      ...ordersResponse,
      data: {
        dailyOrders,
        topProducts,
        ordersByStatus,
      },
    };
  }

  private processDailyOrders(orders: Order[]) {
    const dailyData: {[date: string]: {count: number; revenue: number}} = {};
    
    orders.forEach(order => {
      const date = order.created_at.split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = {count: 0, revenue: 0};
      }
      dailyData[date].count += 1;
      dailyData[date].revenue += parseFloat(order.total_price);
    });
    
    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      count: data.count,
      revenue: data.revenue.toFixed(2),
    }));
  }

  private processTopProducts(orders: Order[]) {
    const productData: {[productTitle: string]: {quantity: number; revenue: number}} = {};
    
    orders.forEach(order => {
      order.line_items.forEach(item => {
        const title = item.title;
        if (!productData[title]) {
          productData[title] = {quantity: 0, revenue: 0};
        }
        productData[title].quantity += item.quantity;
        productData[title].revenue += parseFloat(item.price) * item.quantity;
      });
    });
    
    return Object.entries(productData)
      .map(([product, data]) => ({
        product,
        quantity: data.quantity,
        revenue: data.revenue.toFixed(2),
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }

  private processOrdersByStatus(orders: Order[]) {
    const statusData: {[status: string]: number} = {};
    
    orders.forEach(order => {
      const status = order.financial_status;
      statusData[status] = (statusData[status] || 0) + 1;
    });
    
    return Object.entries(statusData).map(([status, count]) => ({
      status,
      count,
    }));
  }

  // Inventory methods
  async getInventoryLevels(): Promise<AxiosResponse> {
    return this.api.get('/inventory_levels.json');
  }

  async updateInventoryLevel(inventoryItemId: number, locationId: number, available: number): Promise<AxiosResponse> {
    return this.api.post('/inventory_levels/set.json', {
      location_id: locationId,
      inventory_item_id: inventoryItemId,
      available,
    });
  }

  // Customer methods
  async getCustomers(params: any = {}): Promise<AxiosResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.api.get(`/customers.json?${queryParams.toString()}`);
  }

  async getCustomer(customerId: number): Promise<AxiosResponse> {
    return this.api.get(`/customers/${customerId}.json`);
  }

  // Webhook methods
  async createWebhook(webhook: any): Promise<AxiosResponse> {
    return this.api.post('/webhooks.json', {webhook});
  }

  async getWebhooks(): Promise<AxiosResponse> {
    return this.api.get('/webhooks.json');
  }

  async deleteWebhook(webhookId: number): Promise<AxiosResponse> {
    return this.api.delete(`/webhooks/${webhookId}.json`);
  }
}

export const shopifyAPI = new ShopifyAPI();